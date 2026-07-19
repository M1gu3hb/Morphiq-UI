import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animated library",
  description: "Customizable tactile React components with downloadable code, CSS, prompts, and visual assets.",
};

export default function LibraryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
