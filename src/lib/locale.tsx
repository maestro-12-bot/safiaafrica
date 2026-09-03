import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CURRENCIES, currencyByCode, formatMoney, type Currency } from "@/data/currencies";
import { LANGUAGES, RTL_LANGUAGES, translate, type TranslationKey } from "@/data/i18n";

interface LocaleValue {
  lang: string;
  currency: Currency;
  setLang: (code: string) => void;
  setCurrency: (code: string) => void;
  t: (key: TranslationKey) => string;
  money: (amountRWF: number) => string;
  rtl: boolean;
}

const LocaleContext = createContext<LocaleValue | null>(null);

const LANG_KEY = "safia.lang";
const CUR_KEY = "safia.currency";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState("en");
  const [currencyCode, setCurrencyCode] = useState("RWF");

  useEffect(() => {
    const storedLang = window.localStorage.getItem(LANG_KEY);
    const storedCur = window.localStorage.getItem(CUR_KEY);
    if (storedLang && LANGUAGES.some((l) => l.code === storedLang)) setLangState(storedLang);
    if (storedCur && CURRENCIES.some((c) => c.code === storedCur)) setCurrencyCode(storedCur);
  }, []);

  const setLang = useCallback((code: string) => {
    setLangState(code);
    window.localStorage.setItem(LANG_KEY, code);
  }, []);

  const setCurrency = useCallback((code: string) => {
    setCurrencyCode(code);
    window.localStorage.setItem(CUR_KEY, code);
  }, []);

  useEffect(() => {
    const rtl = RTL_LANGUAGES.includes(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<LocaleValue>(() => {

    const currency = currencyByCode(currencyCode);
    return {
      lang,
      currency,
      setLang,
      setCurrency,
      t: (key) => translate(lang, key),
      money: (amountRWF) => formatMoney(amountRWF, currency),
      rtl: RTL_LANGUAGES.includes(lang),
    };
  }, [lang, currencyCode, setLang, setCurrency]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
