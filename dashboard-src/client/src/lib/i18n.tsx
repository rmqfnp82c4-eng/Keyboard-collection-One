import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "en" | "ru";

const translations = {
  // ── Navigation ──
  "nav.dashboard": { en: "Dashboard", ru: "Дашборд" },
  "nav.collection": { en: "Collection", ru: "Коллекция" },
  "nav.keebOfDay": { en: "Keeb of the Day", ru: "Борда дня" },
  "nav.stats": { en: "Stats", ru: "Статистика" },

  // ── Dashboard ──
  "dash.title": { en: "Dashboard", ru: "Дашборд" },
  "dash.subtitle": {
    en: "{kb} keyboards · {kc} keycap sets · {sw} switches",
    ru: "{kb} клавиатур · {kc} наборов кейкапов · {sw} свитчей",
  },
  "dash.keyboards": { en: "Keyboards", ru: "Клавиатуры" },
  "dash.gmkSets": { en: "GMK Sets", ru: "GMK наборы" },
  "dash.switches": { en: "Switches", ru: "Свитчи" },
  "dash.needRotation": { en: "Need Rotation", ru: "Пора в ротацию" },
  "dash.built": { en: "built", ru: "собрано" },
  "dash.gb": { en: "GB", ru: "ГБ" },
  "dash.onBoard": { en: "on board", ru: "на борде" },
  "dash.inBox": { en: "in box", ru: "в коробке" },
  "dash.brands": { en: "brands", ru: "брендов" },
  "dash.neverTracked": { en: "never been tracked", ru: "ещё не отслеживались" },
  "dash.keyboardOfDay": { en: "Keyboard of the Day", ru: "Клавиатура дня" },
  "dash.useToday": { en: "Use Today", ru: "Использовать" },
  "dash.reroll": { en: "Reroll", ru: "Перевыбрать" },
  "dash.mostUsedKeycaps": { en: "Most Used Keycaps", ru: "Популярные кейкапы" },
  "dash.mostUsedSwitches": { en: "Most Used Switches", ru: "Популярные свитчи" },
  "dash.needsRotation": { en: "Needs Rotation — Never Tracked", ru: "Пора в ротацию — не использовались" },
  "dash.viewAll": { en: "View All", ru: "Все" },
  "dash.board": { en: "board", ru: "борда" },
  "dash.boards": { en: "boards", ru: "борд" },

  // ── Collection ──
  "coll.title": { en: "Collection", ru: "Коллекция" },
  "coll.keyboards": { en: "keyboards", ru: "клавиатур" },
  "coll.searchPlaceholder": { en: "Search by name, keycaps, switch...", ru: "Поиск по названию, кейкапам, свитчам..." },
  "coll.all": { en: "All", ru: "Все" },
  "coll.built": { en: "Built", ru: "Собранные" },
  "coll.groupBuy": { en: "Group Buy", ru: "Групбай" },
  "coll.unused": { en: "Unused", ru: "Не использ." },
  "coll.caps": { en: "Caps", ru: "Кепы" },
  "coll.switch": { en: "Switch", ru: "Свитч" },
  "coll.used": { en: "Used", ru: "Исп." },
  "coll.neverTracked": { en: "Never tracked", ru: "Не отслеж." },
  "coll.use": { en: "Use", ru: "Исп." },
  "coll.noKeyboards": { en: "No keyboards found", ru: "Клавиатуры не найдены" },

  // ── Keyboard of the Day ──
  "kotd.title": { en: "Keyboard of the Day", ru: "Клавиатура дня" },
  "kotd.subtitle": { en: "Let fate choose your daily driver", ru: "Пусть судьба выберет твою борду на сегодня" },
  "kotd.dailyPick": { en: "Daily Pick", ru: "Выбор дня" },
  "kotd.random": { en: "Random", ru: "Случайная" },
  "kotd.keycaps": { en: "Keycaps", ru: "Кейкапы" },
  "kotd.switches": { en: "Switches", ru: "Свитчи" },
  "kotd.useThisBoard": { en: "Use This Board Today", ru: "Использовать сегодня" },
  "kotd.hitRandom": { en: "Hit Random to pick a board", ru: "Нажми «Случайная» для выбора" },
  "kotd.changesDaily": { en: "Changes daily at midnight. Same pick for everyone today.", ru: "Меняется ежедневно в полночь. Одинаковый выбор для всех." },

  // ── Stats ──
  "stats.title": { en: "Collection Stats", ru: "Статистика коллекции" },
  "stats.subtitle": { en: "Your keyboard journey in numbers", ru: "Твоё клавиатурное путешествие в цифрах" },
  "stats.daysInHobby": { en: "Days in Hobby", ru: "Дней в хобби" },
  "stats.keyboards": { en: "Keyboards", ru: "Клавиатуры" },
  "stats.gmkSets": { en: "GMK Sets", ru: "GMK наборы" },
  "stats.switches": { en: "Switches", ru: "Свитчи" },
  "stats.layoutDist": { en: "Layout Distribution", ru: "Распределение по формату" },
  "stats.keycapStatus": { en: "Keycap Status", ru: "Статус кейкапов" },
  "stats.onKeyboard": { en: "On Keyboard", ru: "На борде" },
  "stats.inBox": { en: "In Box", ru: "В коробке" },
  "stats.groupBuy": { en: "Group Buy", ru: "Групбай" },
  "stats.topSwitchBrands": { en: "Top Switch Brands", ru: "Топ брендов свитчей" },
  "stats.keyboardColors": { en: "Keyboard Colors", ru: "Цвета клавиатур" },
  "stats.allGmkSets": { en: "All GMK Sets", ru: "Все GMK наборы" },
  "stats.switchInventory": { en: "Switch Inventory", ru: "Инвентарь свитчей" },
  "stats.active": { en: "Active", ru: "Активен" },
  "stats.inBoxBadge": { en: "In Box", ru: "В коробке" },
  "stats.gbBadge": { en: "GB", ru: "ГБ" },
  "stats.inUseBadge": { en: "In Use", ru: "На борде" },

  // ── Gallery ──
  "gallery.close": { en: "Close", ru: "Закрыть" },
  "gallery.prev": { en: "Previous photo", ru: "Предыдущее фото" },
  "gallery.next": { en: "Next photo", ru: "Следующее фото" },
  "gallery.photo": { en: "photo", ru: "фото" },
  "gallery.photos": { en: "photos", ru: "фото" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem("keebtracker-locale");
      if (saved === "ru" || saved === "en") return saved;
    } catch {}
    // Default to Russian since it's a Russian user's site
    return "ru";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("keebtracker-locale", newLocale);
    } catch {}
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const entry = translations[key];
      if (!entry) return key;
      let text = entry[locale] || entry.en;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
