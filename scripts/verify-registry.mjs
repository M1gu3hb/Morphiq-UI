import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { builtinModules, createRequire } from "node:module";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const output = mkdtempSync(join(tmpdir(), "morphiq-registry-"));
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
const ts = require(join(root, "node_modules", "typescript"));
const schemaPath = join(root, "src", "registry", "schema.ts");
const registryPath = join(root, "src", "registry", "index.ts");
const globalsPath = join(root, "src", "app", "globals.css");
const validMaterials = new Set(["clay", "glass", "skeuo", "adaptive"]);
const implicitPeerPackages = new Set(["react", "react-dom"]);
const nodeBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
]);
const forbiddenSiteVariables = [
  "--coral",
  "--coral-deep",
  "--ink",
  "--muted",
  "--line",
  "--paper",
  "--paper-deep",
  "--acid",
  "--violet",
  "--sky",
  "--radius-large",
  "--font-display",
  "--font-sans",
];
const resolvableExtensions = [
  "",
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
];

function toPosix(path) {
  return path.split(sep).join("/");
}

function repoRelative(path) {
  return toPosix(relative(root, path));
}

function assertRepoPath(path, label) {
  assert.equal(typeof path, "string", `${label} must be a string`);
  assert.ok(path.length > 0, `${label} must not be empty`);
  assert.ok(!path.includes("\\"), `${label} must use POSIX separators: ${path}`);
  const absolutePath = resolve(root, path);
  const relativePath = relative(root, absolutePath);
  assert.ok(
    relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath),
    `${label} escapes the repository: ${path}`,
  );
  return absolutePath;
}

function readSource(path, kind = ts.ScriptKind.TSX) {
  const source = readFileSync(path, "utf8");
  return {
    source,
    sourceFile: ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, kind),
  };
}

function scriptKindForPath(path) {
  const extension = extname(path).toLowerCase();
  if (extension === ".tsx") return ts.ScriptKind.TSX;
  if (extension === ".jsx") return ts.ScriptKind.JSX;
  if ([".js", ".mjs", ".cjs"].includes(extension)) return ts.ScriptKind.JS;
  if (extension === ".json") return ts.ScriptKind.JSON;
  return ts.ScriptKind.TS;
}

function unwrapExpression(node) {
  let current = node;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  throw new Error(`Registry keys must be static: ${node.getText()}`);
}

function staticValue(rawNode) {
  const node = unwrapExpression(rawNode);
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node)) return { identifier: node.text };
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(staticValue);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.map((property) => {
        assert.ok(ts.isPropertyAssignment(property), `Registry values must use plain properties: ${property.getText()}`);
        return [propertyName(property.name), staticValue(property.initializer)];
      }),
    );
  }
  throw new Error(`Registry values must be statically readable: ${node.getText()}`);
}

function findTypeAlias(sourceFile, name) {
  const declaration = sourceFile.statements.find(
    (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === name,
  );
  assert.ok(declaration, `Missing type alias ${name} in ${repoRelative(sourceFile.fileName)}`);
  return declaration;
}

function registryContract(schemaSourceFile) {
  const entryType = findTypeAlias(schemaSourceFile, "RegistryEntry").type;
  assert.ok(ts.isTypeLiteralNode(entryType), "RegistryEntry must remain a type literal");
  const fields = entryType.members.map((member) => {
    assert.ok(ts.isPropertySignature(member) && member.name, "RegistryEntry fields must be property signatures");
    return propertyName(member.name);
  });

  const categoryType = findTypeAlias(schemaSourceFile, "RegistryCategory").type;
  assert.ok(ts.isUnionTypeNode(categoryType), "RegistryCategory must remain a string-literal union");
  const categories = new Set(
    categoryType.types.map((type) => {
      assert.ok(
        ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal),
        "RegistryCategory members must be string literals",
      );
      return type.literal.text;
    }),
  );
  return { categories, fields };
}

function readRegistryEntries(sourceFile) {
  let initializer;
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "registry") {
        initializer = declaration.initializer;
      }
    }
  }
  assert.ok(initializer, "src/registry/index.ts must export a registry variable");
  const array = unwrapExpression(initializer);
  assert.ok(ts.isArrayLiteralExpression(array), "registry must be an array literal");
  return array.elements.map((element) => {
    const value = staticValue(element);
    assert.ok(value && !Array.isArray(value), "Every registry entry must be an object literal");
    return value;
  });
}

function assertUniqueStrings(values, label) {
  assert.ok(Array.isArray(values), `${label} must be an array`);
  for (const value of values) {
    assert.equal(typeof value, "string", `${label} values must be strings`);
    assert.ok(value.length > 0, `${label} values must not be empty`);
  }
  assert.equal(new Set(values).size, values.length, `${label} contains duplicate values`);
}

function assertOptions(options, label) {
  assert.ok(Array.isArray(options) && options.length > 0, `${label} must not be empty`);
  const ids = options.map((option, index) => {
    assert.ok(option && !Array.isArray(option), `${label}[${index}] must be an object`);
    for (const field of ["id", "label", "labelEs"]) {
      assert.equal(typeof option[field], "string", `${label}[${index}].${field} must be a string`);
      assert.ok(option[field].length > 0, `${label}[${index}].${field} must not be empty`);
    }
    return option.id;
  });
  assertUniqueStrings(ids, `${label} ids`);
  return ids;
}

function collectStringLiterals(sourceFile) {
  const values = new Set();
  function visit(node) {
    if (ts.isStringLiteralLike(node)) values.add(node.text);
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return values;
}

function packageName(specifier) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

function resolveInternalImport(fromPath, specifier) {
  let basePath;
  if (specifier.startsWith("@/")) {
    basePath = join(root, "src", specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    basePath = resolve(dirname(fromPath), specifier);
  } else if (specifier.startsWith("/")) {
    basePath = resolve(root, `.${specifier}`);
  } else {
    return null;
  }

  const candidates = [basePath];
  for (const extension of resolvableExtensions.slice(1)) candidates.push(`${basePath}${extension}`);
  for (const extension of resolvableExtensions.slice(1)) candidates.push(join(basePath, `index${extension}`));
  const resolvedPath = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  assert.ok(resolvedPath, `${repoRelative(fromPath)} imports missing repo file: ${specifier}`);
  assertRepoPath(repoRelative(resolvedPath), `Resolved import from ${repoRelative(fromPath)}`);
  return resolvedPath;
}

function importSpecifiers(sourceFile) {
  const specifiers = [];
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      specifiers.push(statement.moduleSpecifier.text);
    }
    if (ts.isExportDeclaration(statement) && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
      specifiers.push(statement.moduleSpecifier.text);
    }
  }
  return specifiers;
}

function dependencyClosure(sourcePath) {
  const queue = [sourcePath];
  const visited = new Set();
  const internal = new Set();
  const external = new Set();

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const canonicalPath = resolve(currentPath);
    if (visited.has(canonicalPath)) continue;
    visited.add(canonicalPath);
    const { sourceFile } = readSource(canonicalPath, scriptKindForPath(canonicalPath));

    for (const specifier of importSpecifiers(sourceFile)) {
      const internalPath = resolveInternalImport(canonicalPath, specifier);
      if (internalPath) {
        if (resolve(internalPath) !== resolve(sourcePath)) internal.add(repoRelative(internalPath));
        queue.push(internalPath);
        continue;
      }
      const dependency = packageName(specifier);
      if (!nodeBuiltins.has(specifier) && !nodeBuiltins.has(dependency)) external.add(dependency);
    }
  }
  return { external, internal };
}

function difference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

function maskTypeScriptComments(source) {
  const characters = source.split("");
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.JSX, source);
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (token !== ts.SyntaxKind.SingleLineCommentTrivia && token !== ts.SyntaxKind.MultiLineCommentTrivia) {
      continue;
    }
    for (let index = scanner.getTokenPos(); index < scanner.getTextPos(); index += 1) {
      if (characters[index] !== "\n" && characters[index] !== "\r") characters[index] = " ";
    }
  }
  return characters.join("");
}

function lineNumber(sourceFile, position) {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function customPropertyLeaks(path, source, sourceFile, forbiddenVariables) {
  const leaks = [];
  const maskedSource = maskTypeScriptComments(source);
  const functionPattern = /var\s*\(/gi;
  for (const match of maskedSource.matchAll(functionPattern)) {
    const start = match.index;
    const contentStart = start + match[0].length;
    let depth = 0;
    let end = -1;
    let hasFallback = false;
    for (let index = contentStart; index < maskedSource.length; index += 1) {
      const character = maskedSource[index];
      if (character === "(") depth += 1;
      else if (character === ")") {
        if (depth === 0) {
          end = index;
          break;
        }
        depth -= 1;
      } else if (character === "," && depth === 0) {
        hasFallback = true;
      }
    }
    const content = maskedSource.slice(contentStart, end === -1 ? maskedSource.length : end);
    const variable = content.match(/^\s*(--[a-zA-Z0-9_-]+)/)?.[1] ?? "unknown custom property";
    if (end === -1 || !hasFallback) {
      const kind = forbiddenVariables.has(variable) ? "site :root variable" : "custom property";
      leaks.push(`${repoRelative(path)}:${lineNumber(sourceFile, start)} ${kind} ${variable} has no fallback`);
    }
  }
  return leaks;
}

function globalClassNames(globalsSource) {
  const withoutComments = globalsSource.replace(/\/\*[\s\S]*?\*\//g, " ");
  return new Set(
    [...withoutComments.matchAll(/(^|[^a-zA-Z0-9_-])\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g)].map(
      (match) => match[2],
    ),
  );
}

function styleLiterals(sourceFile) {
  const bindings = new Map();
  const literals = [];
  const visitedBindings = new Set();

  function indexBindings(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      bindings.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, indexBindings);
  }

  function collect(node) {
    if (
      ts.isStringLiteralLike(node) ||
      node.kind === ts.SyntaxKind.TemplateHead ||
      node.kind === ts.SyntaxKind.TemplateMiddle ||
      node.kind === ts.SyntaxKind.TemplateTail
    ) {
      literals.push({ position: node.getStart(sourceFile) + 1, text: node.text });
      return;
    }
    if (ts.isIdentifier(node) && bindings.has(node.text) && !visitedBindings.has(node.text)) {
      visitedBindings.add(node.text);
      collect(bindings.get(node.text));
      return;
    }
    ts.forEachChild(node, collect);
  }

  function findStyleContexts(node) {
    if (ts.isCallExpression(node)) {
      const name = ts.isIdentifier(node.expression) ? node.expression.text : "";
      if (["cn", "clsx", "cva", "tv"].includes(name)) {
        for (const argument of node.arguments) collect(argument);
        return;
      }
    }
    if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "className" &&
      node.initializer
    ) {
      collect(node.initializer);
      return;
    }
    ts.forEachChild(node, findStyleContexts);
  }

  indexBindings(sourceFile);
  findStyleContexts(sourceFile);
  return literals;
}

function globalClassLeaks(path, sourceFile, chromeClasses) {
  const leaks = [];
  const seen = new Set();
  for (const literal of styleLiterals(sourceFile)) {
    let offset = 0;
    for (const token of literal.text.split(/\s+/)) {
      if (!token) continue;
      const tokenOffset = literal.text.indexOf(token, offset);
      offset = tokenOffset + token.length;
      if (!chromeClasses.has(token)) continue;
      const key = `${token}:${literal.position + tokenOffset}`;
      if (seen.has(key)) continue;
      seen.add(key);
      leaks.push(
        `${repoRelative(path)}:${lineNumber(sourceFile, literal.position + tokenOffset)} uses global chrome class .${token}`,
      );
    }
  }
  return leaks;
}

function registryFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...registryFiles(path));
    else if (/\.[cm]?tsx?$/.test(entry.name)) files.push(path);
  }
  return files.sort();
}

try {
  const { sourceFile: schemaSourceFile } = readSource(schemaPath, ts.ScriptKind.TS);
  const { sourceFile: registrySourceFile } = readSource(registryPath, ts.ScriptKind.TS);
  const globalsSource = readFileSync(globalsPath, "utf8");
  const declaredSiteVariables = new Set(
    [...globalsSource.matchAll(/(^|[\s;{])(--[a-zA-Z0-9_-]+)\s*:/gm)].map((match) => match[2]),
  );
  for (const variable of forbiddenSiteVariables) {
    assert.ok(declaredSiteVariables.has(variable), `globals.css no longer declares expected site variable ${variable}`);
  }
  const forbiddenVariables = new Set(forbiddenSiteVariables);
  const chromeClasses = globalClassNames(globalsSource);
  const { categories, fields } = registryContract(schemaSourceFile);
  const entries = readRegistryEntries(registrySourceFile);
  assert.ok(entries.length > 0, "registry must contain at least one component");

  const slugs = entries.map((entry, index) => {
    for (const field of fields) {
      assert.ok(Object.hasOwn(entry, field), `registry[${index}] is missing RegistryEntry.${field}`);
    }
    assert.equal(typeof entry.slug, "string", `registry[${index}].slug must be a string`);
    assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid kebab-case slug: ${entry.slug}`);
    assert.ok(categories.has(entry.category), `${entry.slug}: invalid category ${entry.category}`);
    assert.ok(Array.isArray(entry.materials) && entry.materials.length > 0, `${entry.slug}: materials must not be empty`);
    assertUniqueStrings(entry.materials, `${entry.slug}: materials`);
    for (const material of entry.materials) {
      assert.ok(validMaterials.has(material), `${entry.slug}: invalid material ${material}`);
    }
    const variantIds = assertOptions(entry.variants, `${entry.slug}: variants`);
    const sizeIds = assertOptions(entry.sizes, `${entry.slug}: sizes`);
    assert.ok(entry.dependencies && !Array.isArray(entry.dependencies), `${entry.slug}: dependencies must be an object`);
    assertUniqueStrings(entry.dependencies.npm, `${entry.slug}: dependencies.npm`);
    assertUniqueStrings(entry.dependencies.internal, `${entry.slug}: dependencies.internal`);

    const expectedSourcePath = `src/registry/ui/${entry.slug}.tsx`;
    assert.equal(
      entry.sourcePath,
      expectedSourcePath,
      `${entry.slug}: sourcePath must match the component slug (${expectedSourcePath})`,
    );
    const sourcePath = assertRepoPath(entry.sourcePath, `${entry.slug}: sourcePath`);
    assert.ok(existsSync(sourcePath) && statSync(sourcePath).isFile(), `${entry.slug}: sourcePath does not exist: ${entry.sourcePath}`);
    for (const dependency of entry.dependencies.internal) {
      const dependencyPath = assertRepoPath(dependency, `${entry.slug}: dependencies.internal`);
      assert.ok(existsSync(dependencyPath) && statSync(dependencyPath).isFile(), `${entry.slug}: missing internal dependency ${dependency}`);
    }

    const previewRelativePath = `src/registry/previews/${entry.slug}-preview.tsx`;
    const previewPath = assertRepoPath(previewRelativePath, `${entry.slug}: preview path`);
    assert.ok(existsSync(previewPath) && statSync(previewPath).isFile(), `${entry.slug}: preview does not exist: ${previewRelativePath}`);
    const { sourceFile: previewSourceFile } = readSource(previewPath);
    const previewLiterals = collectStringLiterals(previewSourceFile);
    for (const id of variantIds) {
      assert.ok(previewLiterals.has(id), `${entry.slug}: preview does not cover variant id "${id}" as a text literal`);
    }
    for (const id of sizeIds) {
      assert.ok(previewLiterals.has(id), `${entry.slug}: preview does not cover size id "${id}" as a text literal`);
    }

    const { source, sourceFile } = readSource(sourcePath);
    const containmentLeaks = [
      ...customPropertyLeaks(sourcePath, source, sourceFile, forbiddenVariables),
      ...globalClassLeaks(sourcePath, sourceFile, chromeClasses),
    ];
    assert.equal(
      containmentLeaks.length,
      0,
      `${entry.slug}: self-contained contract leaks:\n${containmentLeaks.join("\n")}`,
    );

    const actualDependencies = dependencyClosure(sourcePath);
    const declaredNpm = new Set(entry.dependencies.npm);
    const declaredInternal = new Set(entry.dependencies.internal);
    const missingNpm = difference(actualDependencies.external, new Set([...declaredNpm, ...implicitPeerPackages]));
    const phantomNpm = difference(declaredNpm, actualDependencies.external);
    const missingInternal = difference(actualDependencies.internal, declaredInternal);
    const phantomInternal = difference(declaredInternal, actualDependencies.internal);
    assert.deepEqual(missingNpm, [], `${entry.slug}: undeclared npm imports: ${missingNpm.join(", ")}`);
    assert.deepEqual(phantomNpm, [], `${entry.slug}: phantom npm dependencies: ${phantomNpm.join(", ")}`);
    assert.deepEqual(missingInternal, [], `${entry.slug}: undeclared internal imports: ${missingInternal.join(", ")}`);
    assert.deepEqual(phantomInternal, [], `${entry.slug}: phantom internal dependencies: ${phantomInternal.join(", ")}`);
    return entry.slug;
  });

  assert.equal(new Set(slugs).size, slugs.length, "Registry slugs must be unique");
  assert.deepEqual(slugs, [...slugs].sort(), "Registry entries must be sorted alphabetically by slug");

  const compilerConfig = join(output, "tsconfig.registry.json");
  writeFileSync(
    compilerConfig,
    `${JSON.stringify({
      extends: join(root, "tsconfig.json"),
      compilerOptions: { incremental: false, noEmit: true },
      files: registryFiles(join(root, "src", "registry")),
      include: [],
    }, null, 2)}\n`,
  );
  execFileSync(process.execPath, [tsc, "--project", compilerConfig, "--pretty", "false"], {
    cwd: root,
    stdio: "inherit",
  });

  process.stdout.write(
    `${JSON.stringify({ components: entries.length, selfContained: true, guards: "ok", status: "ok" })}\n`,
  );
} finally {
  rmSync(output, { recursive: true, force: true });
}
