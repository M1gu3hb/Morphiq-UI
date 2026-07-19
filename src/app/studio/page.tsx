"use client";

import { StudioShell } from "@/components/studio/studio-shell";
import { useLocale } from "@/lib/client-locale";

export default function StudioPage() {
  const locale = useLocale();
  return <StudioShell locale={locale} />;
}
