import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description: "Browse tactile React components across clay, glass, skeuomorphic, and adaptive surface systems.",
};

export default function ComponentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
