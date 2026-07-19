import type { Metadata } from "next";
import "@fontsource/allura";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Morphiq UI — Tactile React Components",
    template: "%s — Morphiq UI",
  },
  description:
    "A tactile React component library and visual studio for clay, glass, skeuomorphic, and adaptive interfaces.",
};

const localeBootstrap = `(function(){try{var saved=localStorage.getItem('morphiq-locale');var locale=saved==='es'||saved==='en'?saved:(navigator.language||'en').toLowerCase().indexOf('es')===0?'es':'en';document.documentElement.lang=locale}catch(e){document.documentElement.lang='en'}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: localeBootstrap }} /></head>
      <body>{children}</body>
    </html>
  );
}
