# Анализ проекта `info_actions_2025` и предложения по рефакторингу

## 1. Что это за проект

Лендинг-виджет «Акции» для двух брендов (coral.ru / sunmar.ru), собираемый внешним тулингом
лендингов (`landing.page.json` + секции HTML), с Vue 3 SPA-островком, монтируемым в `#info-actions`.

```
site/coral.ru/
  landing.page.json      — env (brand, cdnAssetsURL) + список секций разметки
  markup/*.html          — секции; info-actions.html подключает config.js и main.js
  js/config.js           — данные акций в window._promotion_settings (глобал)
  js/filterFreshOffers.js— фильтр «актуальности» по датам (dayjs)
  js/main.js             — createApp + регистрация ant-design-vue и 3 директив
  js/Vue/App.vue         — нормализация фильтров, вывод табов и карточек
  js/Vue/components/     — Tabs, Card (+ .scss рядом)
  js/Vue/directives/     — ymbonus (метрика по показу), entry (метрика по клику), clipboard
site/common/css/         — variables, mixins, layout, components
site/sunmar.ru/          — только landing.page.json (секции пустые)
```

Архитектура в целом здравая: данные → фильтрация → нормализация → отображение; стили разбиты
по компонентам; аналитика вынесена в директивы. Ниже — то, что стоит починить.

---

## 2. Критичные проблемы (чинить в первую очередь)

### 2.1 Битые URL картинок в `config.js`
`%` в URL — это начало percent-encoding. Сейчас в конфиге:

- `New_Promo_Coral_324x180_hotel4%.png` → `%.p` невалидная escape-последовательность;
- `New_Promo_Coral_324x180_eb_20%.png`, `..._eb_5%.png` — то же;
- `New_Promo_Coral_324x180_BlackFriday%2025.png` → браузер декодирует `%20` как пробел →
  запрашивается `BlackFriday 25.png`;
- `offer page-upd_eb_leto.png` — пробел в пути.

**Решение:** переименовать файлы на CDN без `%` и пробелов, либо хранить уже
`encodeURI()`-нормализованные ссылки. Плюс добавить валидацию конфига в dev-режиме
(см. п. 3.1) и `onerror`-плейсхолдер на `<img>`.

### 2.2 Опечатка в URL: `?banner_on_site = offers-cb-sokrovischa-vostoka`
Пробелы вокруг `=` ломают разбор UTM/аналитики. Исправить + добавить проверку в валидаторе.

### 2.3 `:key="promotion.name"` при неуникальных `name`
В конфиге есть повторяющиеся названия («Отдых ближе, чем кажется...» — 2 записи,
«Черная пятница» в разных вариантах). Дубликат ключа во `v-for` = баги реюза DOM.

**Решение:** ввести обязательное поле `id` в конфиге (или генерировать стабильный ключ
`` `${name}|${url}` ``).

### 2.4 `id="popup-trigger"` внутри `v-for`
Дубли `id` в DOM при нескольких акциях без `url`. Заменить на класс `js-popup-trigger`
(и селекторы внешнего кода поправить соответственно).

### 2.5 Даты без таймзоны
`dayjs('2025-11-28 00:00')` парсится в **локальной** зоне пользователя. Акция, стартующая
в 00:00 МСК, у клиента во Владивостоке появится/пропадёт не тогда. Плюс список акций
не переоценивается, пока страница открыта.

**Решение:**
```js
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc); dayjs.extend(timezone);
const TZ = 'Europe/Moscow';
const parse = s => dayjs.tz(s, 'YYYY-MM-DD HH:mm', TZ);
```
и опционально «тикающее» время в App.vue:
```js
import { useNow } from '@vueuse/core';
const now = useNow({ interval: 60_000 });
const freshOffers = computed(() => promotions.value.filter(o => isFresh(o, now.value)));
```

---

## 3. Данные и конфигурация

### 3.1 `window._promotion_settings` как глобал
Отдельный `<script defer src="config.js">` создаёт неявную связь и гонку: если порядок
загрузки изменится, `App.vue` получит `[]` и просто ничего не отрисует (молча).

**Варианты (по возрастанию усилий):**
1. `export const PROMOTIONS = [...]` + `import` в `main.js` — исчезает глобал, конфиг
   попадает в бандл и минифицируется/тришейкается.
2. Оставить возможность override: `const data = window._promotion_settings ?? PROMOTIONS`.
3. Вынести в `promotions.json` на CDN и грузить `fetch` — обновление акций без пересборки
   лендинга (самый «продуктовый» вариант; нужен skeleton-стейт на время загрузки).

### 3.2 Схема записи
- `ligal` → `legal` (опечатка расползлась в props/шаблон/стили);
- `filter: "Акции отелей,По направлениям"` — строка вместо массива; парсинг строки в
  `App.vue` (split/trim/dedupe) существует только из-за этого. Сделать `filters: string[]`
  и оставить строковый парсинг лишь как legacy-ветку;
- поле `trigger: '#14_feb'` в первой записи не документировано в JSDoc и нигде не читается —
  удалить или реализовать;
- `promo_end_text: "Бессрочно"` при заданном `promo_end` (запись «Дети отдыхают… бесплатно»)
  — текст врёт пользователю;
- есть заведомо просроченные записи (сентябрь/октябрь 2025) — их можно чистить скриптом
  `npm run promo:prune`.

### 3.3 Валидация
Небольшой `validateConfig()` под `if (import.meta.env?.DEV)`: уникальность `id`, парсибельность
дат, `promo_start < promo_end`, валидный `new URL(visual)`, отсутствие пробелов в `url`,
наличие `erid` при наличии `legal`. Ошибки — в `console.warn` с индексом записи.

---

## 4. Код: конкретные улучшения

### 4.1 Дублирование определения бренда (3 места)
`App.vue` (`location.origin.includes('coral.ru')`), `ymbonus.directive.js`
(`location.host.includes('coral')`), `entry.directive.js` (то же) — разные критерии,
легко разъехаться.

**Решение:** `js/brand.js`
```js
const isCoral = /coral/i.test(location.host);
export const BRAND = isCoral ? 'coral' : 'sunmar';
export const METRIKA = isCoral
  ? { counterId: 96674199, goals: { bonusShow: 'coral-bonus-show', entry: 'entry-point' } }
  : { counterId: 215233,   goals: { bonusShow: 'sunmar-bonus-show', entry: 'entry-point' } };
export const reachGoal = (goal, params) =>
  typeof window.ym === 'function' && window.ym(METRIKA.counterId, 'reachGoal', goal, params);
```
Дальше `:class="BRAND"` один раз на корне (см. 5.1), а `domen`/`isCoral` как `computed`
не нужен — это константа на время жизни страницы.

В `entry.directive.js` ветвление вообще вырождено: `goal` одинаков для обоих брендов.

### 4.2 `App.vue`
- `:key="currentFilter"` на `<ul>` уничтожает и пересоздаёт **весь** список при переключении
  таба → повторная загрузка `<img>` и мерцание. Убрать; для анимации использовать
  `<TransitionGroup name="cards" tag="ul">`.
- 9 отдельных props у `Card` → передавать один объект: `<Card :promo="promotion" />`.
  Меньше шума, легче добавлять поля.
- `isBonus` через regex `/bonus/i` по фильтрам — хрупко. Лучше явный флаг в конфиге
  (`analytics: { bonus: true }`) или константа `FILTER_BONUS = 'CoralBonus'`.
- Строка `'Все акции'` захардкожена в трёх местах (`App.vue` × 2, `Tabs.vue` default) →
  вынести в `const ALL = 'Все акции'`.
- `promotionsArr` — `ref` на данных, которые не меняются: достаточно обычной константы
  (или `shallowRef`), реактивность на 25 объектов не нужна.
- `filters`/`offersNormalized`/`filteredPromotions` — цепочка из трёх `computed` по одному
  и тому же массиву; при нынешних объёмах это ок, но нормализацию (`filtersArr`) логичнее
  делать **один раз** при загрузке конфига, а не в реактивном слое.
- Нет пустого состояния: если фильтр не дал результатов или конфиг пуст — пустой экран.
  Добавить `<p v-if="!filteredPromotions.length">Сейчас нет активных акций</p>`.

### 4.3 `Card.vue`
- Оба SVG (coral и sunmar) рендерятся **всегда**, один прячется через CSS `display:none` —
  лишние узлы × количество карточек. Рендерить один: `v-if="BRAND === 'coral'"` или
  вынести в `<TimeIcon :brand="BRAND" />`.
- `v-html` на `name` и `description`. Сейчас источник доверенный (свой конфиг), но если
  данные переедут в CMS/JSON с CDN — это готовый XSS. Минимум: комментарий-предупреждение,
  лучше — разрешать только `<br>` (`String(x).replace(/<(?!br\s*\/?>)[^>]*>/g, '')`).
- Props без `required`/дефолтов; `promo_end_text`, `erid` и т.д. — `String` без валидации.
- Комментарий `<!-- твои иконки -->` — убрать.
- `copied` + `setTimeout` вручную → `const copied = refAutoReset(false, 1500)` из `@vueuse/core`
  (минус 15 строк и `onBeforeUnmount`).
- `alt="Промо"` одинаковый для всех — для SEO/a11y лучше `:alt="name"` с фолбэком, плюс
  `width`/`height` на `<img>` для устранения CLS.
- Первые 2–4 карточки: `loading="eager"` + `fetchpriority="high"`, остальные — как сейчас.

### 4.4 Директивы
- `clipboard.directive.js` — ~80 строк собственной реализации, при этом в зависимостях лежат
  **неиспользуемые** `copy-to-clipboard` и `vue-clipboard` (`vue-clipboard@0.0.1` — заброшенный
  пакет для Vue 2, к тому же). Либо удалить пакеты, либо переписать директиву поверх
  `copy-to-clipboard` (он уже содержит legacy-фолбэк) / `useClipboard()` из `@vueuse/core`.
- `updated()` в clipboard пишет `el.dataset.clipboardText`, который нигде не читается —
  мёртвый код.
- Служебные поля `el.__ymStop`, `el.__clipboardCleanup__`, `el.__entryCleanup__` — три разных
  соглашения об именовании; лучше единый `Symbol` + общий хелпер `withCleanup()`.
- `ymbonus`: хук называется `unmounted`, а в clipboard — `beforeUnmount`; в ymbonus
  `seen.delete(el)` при размонтировании обнуляет дедупликацию, т.е. при переключении таба
  туда-обратно цель отправится повторно. Если это не задумано — `seen` должен ключеваться
  по имени акции, а не по DOM-элементу.
- `getSiteConfig()` дублируется в ymbonus/entry → заменить на `METRIKA` из `brand.js` (4.1).

### 4.5 `Tabs.vue`
Доступность: `<li @click>` без роли и клавиатуры.
```html
<div class="tabs-navigation__list" role="tablist">
  <button v-for="f in filters" :key="f" role="tab" type="button"
          :aria-selected="model === f" :class="{'js-active': model === f}"
          @click="model = f">{{ f }}</button>
</div>
```
`selectFilter()` — лишняя обёртка над `model.value = filter`.

### 4.6 `filterFreshOffers.js`
Логика избыточна: `start.isSame(now,'minute') || start.isBefore(now,'minute')` — это просто
`!start.isAfter(now)`. Плюс комментариев больше, чем кода. Компактно:
```js
export function isFresh(o, now = dayjs()) {
  const start = o.promo_start && parse(o.promo_start);
  const end   = o.promo_end   && parse(o.promo_end);
  if (start && !start.isValid()) return false;
  if (end   && !end.isValid())   return false;
  return (!start || !start.isAfter(now)) && (!end || !end.isBefore(now));
}
```

---

## 5. Стили

1. **Брендирование**: класс `coral`/`sunmar` навешивается на *каждую* карточку и на табы.
   Достаточно одного `data-brand` на корневом `#info-actions`, а в SCSS —
   `:global([data-brand='sunmar']) &  { ... }`. Уходит `:class="domen ? ... : ..."` из шаблонов.
2. **Хардкод цветов**: `#0093D0`, `#061A3E`, `#2e3465`, `#F5F5F8`, `#52c41a`, `#535353` разбросаны
   по компонентам. Часть переменных уже есть в `common/css/variables.scss` — свести туда
   (или в CSS custom properties `--brand-accent`, чтобы переключать тему одним классом).
3. `!important` в `Card.scss` (5 штук) — следствие борьбы с глобальными стилями лендинга.
   Точечнее: поднять специфичность через `@include mixins.parentTag(...)` или сузить сброс.
4. Магические брейкпоинты `@media (width >= 1280px)` дублируются в 6 местах, при этом уже есть
   миксин `respond-up($breakpoint)` — использовать его везде единообразно.
5. `.no-scrollbar` объявлен в `Tabs.scss`, но по смыслу это утилита → `common/css/components.scss`.
6. `.cards-container:has(.sunmar)` — хрупкий трюк; после п.1 заменяется на
   `[data-brand='sunmar'] .cards-container`.
7. `Card.scss` фактически содержит два компонента (coral и sunmar) — можно разнести
   на `Card.scss` + `Card.sunmar.scss`, если различий станет больше.

---

## 6. Тулинг и зависимости

- `vue` лежит в `devDependencies`, а рантайм-зависимости (`ant-design-vue`) — в `dependencies`.
  Для бандлящегося лендинга это некритично, но логичнее: `vue` → `dependencies`, `sass` → dev.
- **Неиспользуемое**: `copy-to-clipboard`, `vue-clipboard` (см. 4.4) → удалить (`-~30 KB` из
  дерева зависимостей).
- **`ant-design-vue` ради Tooltip + Button** — самая дорогая зависимость проекта. `app.use(Tooltip)`
  регистрирует компонент глобально, но при этом тянет `dayjs`-локали и общий рантайм antd.
  Варианты: (а) точечный импорт `import { Tooltip } from 'ant-design-vue'` + `components: { ATooltip }`
  локально в `Card.vue`; (б) заменить на `floating-vue`/собственный поповер на `@floating-ui`
  (тултип показывает всего две строки текста и кнопку копирования) — экономия десятков КБ.
- Нет `scripts` в `package.json` (ни `dev`, ни `build`, ни `lint`) — непонятно, как запускать.
  Добавить хотя бы описание в README + `eslint` (`eslint-plugin-vue`), `prettier`, `stylelint`
  (порядок свойств в SCSS сейчас соблюдается вручную).
- Каталог `dev/` с собранными Next.js-чанками закоммичен в репозиторий (~50 файлов бандла) —
  проверить, нужен ли он в git; если это артефакт для локального превью, добавить в `.gitignore`
  или вынести.
- Нет TypeScript и тестов. Минимальный полезный шаг без полной миграции: `jsconfig.json` +
  JSDoc-тип `PromoConfig` (он уже написан!) в `config.js` через `/** @type {PromoConfig[]} */` —
  IDE сразу начнёт подсвечивать опечатки вроде `ligal`/`trigger`.
- Юнит-тесты имеет смысл написать ровно для одной функции — `isFresh()` (граничные даты,
  невалидные строки, только start / только end). Vitest, ~30 строк.

---

## 7. Прочее (UX / SEO / производительность)

- Изображения грузятся с CDN в оригинальном размере (324×180 в вёрстке, но файлы явно крупнее) —
  подключить `srcset`/`?w=` параметры CDN и `.webp` (один файл в конфиге уже `.webp` — остальные нет).
- `<html>`-разметка секции содержит только пустой `#info-actions` — контент не индексируется.
  Если SEO важен, рассмотреть SSG-пререндер карточек в `info-actions.html` с гидрацией.
- Нет loading/error-состояния и нет обработки случая «конфиг не загрузился».
- Ссылки `target="_blank"` на внутренние страницы сайта — обычно нежелательно для внутренних
  переходов (ломает историю и аналитику пути).

---

## 8. Предлагаемый порядок работ

| Приоритет | Задача | Трудоёмкость |
|---|---|---|
| P0 | Починить битые URL картинок и `banner_on_site = ` | 15 мин |
| P0 | Уникальный `id` в конфиге + `:key` по нему; убрать дубль `id="popup-trigger"` | 30 мин |
| P0 | Таймзона МСК в парсинге дат | 30 мин |
| P1 | `brand.js` (BRAND + METRIKA + reachGoal), убрать дублирование в 3 файлах | 1 ч |
| P1 | Удалить `copy-to-clipboard`/`vue-clipboard` или переписать директиву поверх них | 30 мин |
| P1 | Убрать `:key="currentFilter"` с `<ul>`, добавить `TransitionGroup` и пустое состояние | 1 ч |
| P1 | `Card`: один props-объект `promo`, один SVG вместо двух, `refAutoReset` | 1–2 ч |
| P2 | Валидатор конфига в dev + JSDoc-типизация массива | 1 ч |
| P2 | Брендирование через `data-brand` на корне, чистка `!important` и хардкода цветов | 2–3 ч |
| P2 | A11y табов (`role="tab"`, `<button>`, клавиатура) | 1 ч |
| P3 | Замена `ant-design-vue` на лёгкий тултип | 2–4 ч |
| P3 | Конфиг акций из JSON на CDN (без пересборки) | 3–4 ч |
| P3 | ESLint/Prettier/Stylelint + Vitest для `isFresh` | 2–3 ч |
