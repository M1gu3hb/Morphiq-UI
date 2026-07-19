"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";

const storageKey = "morphiq-locale";
const localeEvent = "morphiq-locale-change";

function browserLocale(): Locale {
  const saved = window.localStorage.getItem(storageKey);
  if (saved === "es" || saved === "en") return saved;
  return window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(localeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(localeEvent, onChange);
  };
}

export function useLocale() {
  return useSyncExternalStore(subscribe, browserLocale, () => "en" as Locale);
}

export function setClientLocale(locale: Locale) {
  window.localStorage.setItem(storageKey, locale);
  document.documentElement.lang = locale;
  window.dispatchEvent(new Event(localeEvent));
}
