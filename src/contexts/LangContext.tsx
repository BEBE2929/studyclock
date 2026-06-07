"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Lang, T } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

type LangContextType = {
  lang: Lang;
  t: T;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextType>({
  lang: "ja",
  t: translations.ja,
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("studyclock_lang") as Lang | null;
    if (saved === "ja" || saved === "ko") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("studyclock_lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang] as T, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
