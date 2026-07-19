export type Locale = "en" | "es";

export function tr(locale: Locale, english: string, spanish: string) {
  return locale === "es" ? spanish : english;
}
