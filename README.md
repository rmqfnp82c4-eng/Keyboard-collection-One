# KeebTracker — Keyboard Collection Dashboard

Дашборд для отслеживания коллекции механических клавиатур: 36 клавиатур, 53 набора GMK кейкапов, 80 свитчей.

## Онлайн-версия (GitHub Pages)

👉 **https://rmqfnp82c4-eng.github.io/Keyboard-collection-One/**

Статическая версия — просмотр коллекции, статистика, «клавиатура дня», переключатель RU/EN. Работает без установки.

---

## Локальная версия (с бэкендом)

Полная версия с Express + SQLite. Кнопка «Использовать» сохраняет данные в базу, ведётся история использования.

### Требования

- [Node.js](https://nodejs.org/) 18+ (рекомендуется 20+)

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/rmqfnp82c4-eng/Keyboard-collection-One.git
cd Keyboard-collection-One/dashboard-src

# 2. Установить зависимости
npm install

# 3. Запустить
npm run dev
```

Откроется на **http://localhost:5000**

При первом запуске база данных (`sqlite.db`) создаётся автоматически и заполняется всеми клавиатурами, кейкапами и свитчами.

### Что работает в локальной версии (и не работает в онлайне)

| Функция | GitHub Pages | Локально |
|---------|:---:|:---:|
| Просмотр коллекции | ✅ | ✅ |
| Статистика и графики | ✅ | ✅ |
| Клавиатура дня / случайная | ✅ | ✅ |
| Переключатель RU / EN | ✅ | ✅ |
| Кнопка «Использовать» (сохранение) | ❌ | ✅ |
| История использования | ❌ | ✅ |
| Отслеживание ротации | ❌ | ✅ |

---

## Структура

```
├── index.html          # Статический билд (GitHub Pages)
├── assets/             # CSS + JS бандл
├── Photos/             # Фотографии клавиатур (28 папок)
├── dashboard-src/      # Полный исходный код
│   ├── client/         # React + Tailwind + shadcn/ui + Recharts
│   ├── server/         # Express + SQLite (Drizzle ORM)
│   └── shared/         # Общие типы и схема БД
└── README.md
```

## Стек

React · Vite · TypeScript · Tailwind CSS · shadcn/ui · Recharts · Express · SQLite · Drizzle ORM
