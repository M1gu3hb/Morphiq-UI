import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "Compose, style, resize, and export tactile React components in a visual canvas.",
};

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
