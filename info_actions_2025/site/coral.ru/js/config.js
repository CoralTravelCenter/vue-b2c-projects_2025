/**
 * Конфигурация промо-кампании (баннер/акция).
 *
 * @typedef {Object} PromoConfig
 *
 * @property {string} filter
 *   Текст фильтра в интерфейсе (чип/селектор акций).
 *   Пример: "По направлениям".
 *
 * @property {string} name
 *   Название промо-кампании для отображения в UI.
 *   Пример: "Черная пятница".
 *
 * @property {string} visual
 *   URL промо-изображения (баннер). Допускается абсолютная ссылка.
 *   Пример: "https://b2ccdn.coral.ru/content/img/actions/....png".
 *
 * @property {string} url
 *   Относительный URL посадочной страницы промо.
 *   Допускается наличие UTM/служебных параметров.
 *   Пример: "/hot-offers/black-friday/?banner_on_site=offers-black-friday-2025/".
 *
 * @property {string} description
 *   Краткий маркетинговый текст/слоган промо, показывается пользователю.
 *   Пример: "Дотянитесь до путешествия мечты с выгодой до 35% и супер-кешбэком*".
 *
 * @property {string} ligal
 *   Юридический блок / наименование юрлица, указываемое мелким шрифтом.
 *   Пример: "ООО «Центрбронь»".
 *
 * @property {string} erid
 *   ERID-идентификатор рекламного материала для веб-версии сайта.
 *   Используется для выполнения требований по маркировке рекламы.
 *
 * @property {string} app_erid
 *   ERID-идентификатор промо для мобильного приложения.
 *   Может совпадать с `erid` или быть отдельным значением.
 *
 * @property {string} promo_start
 *   Техническая дата и время старта промо в формате "YYYY-MM-DD HH:mm".
 *   Используется для показа/скрытия промо в интерфейсе.
 *   Пример: "2025-11-28 00:00".
 *
 * @property {string} promo_end_text
 *   Человекочитаемое описание даты окончания промо для UI.
 *   Пример: "до 01.12.2025".
 *
 * @property {string} promo_end
 *   Техническая дата и время окончания промо в формате "YYYY-MM-DD HH:mm".
 *   Используется логикой показа/скрытия (таймеры, фильтрация).
 *   Пример: "2025-12-01 23:59".
 *
 * @property {string} entry_point
 *   Служебный идентификатор точки входа для аналитики/трекера.
 *   Может быть пустой строкой, если отдельный entry point не нужен.
 */

window._promotion_settings = [
  {
    filter: "По направлениям",
    name: "Черная пятница: все начнется 28 ноября",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_BlackFriday.jpg",
    url: "/hot-offers/black-friday/?banner_on_site=offers-teaser-black-friday/",
    promo_end: "2025-11-28 23:59",
    entry_point: "teaser_bf25"
  },
  {
    filter: "По направлениям",
    name: "Черная пятница",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_BlackFriday%2025.png",
    url: "/hot-offers/black-friday/?banner_on_site=offers-black-friday-2025/",
    description: "Дотянитесь до путешествия мечты с выгодой до 35% и супер-кешбэком*",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFGDsawr",
    app_erid: "2W5zFGDsawr",
    promo_start: "2025-11-28 00:00",
    promo_end_text: "до 01.12.2025",
    promo_end: "2025-12-01 23:59"
  },
  {
    filter: "По направлениям",
    name: "Билеты подождут, а вот отель - нет",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_hotel4%.png",
    url: "/hotel/?banner_on_site=offers-hotel-5/",
    description: "Забронируйте проживание со скидкой 4%",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFJVKZQU",
    app_erid: "2W5zFJVKZQU",
    promo_end_text: "до 28.11.2025",
    promo_end: "2025-11-28 23:59",
    entry_point: "5_onlyhotel"
  },
  {
    filter: "По направлениям",
    name: "Календарь путешествий на 2026 год",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_Конкурс.jpg",
    url: "/hot-offers/kalendar-puteshestvii/contest/?banner_on_site=offers-kalendar-puteshestvii-contest/",
    description: "Запланируйте отдых заранее – выиграйте 250 000 ₽ на путешествие",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFJoC8yW",
    app_erid: "2W5zFJoC8yW",
    promo_end_text: "до 23.11.2025",
    entry_point: "smm_250k_27102025"
  },
  {
    filter: "По направлениям",
    name: "Отдых ближе, чем кажется...",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_eb_20%.png",
    url: "/hot-offers/rannee-bronirovanie-osen/?banner_on_site=offers-rannee-bronirovanie-osen/",
    description: "Предоплата от 20%",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFJnJ5Qc",
    app_erid: "2W5zFJnJ5Qc",
    promo_start: "2025-10-01 06:01",
    promo_end_text: "до 30.11.2025",
    promo_end: "2025-11-30 23:30"
  },
  {
    filter: "По направлениям",
    name: "Соберите свое идеальное лето 2026",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_calendar.jpg",
    url: "/hot-offers/kalendar-puteshestvii/?banner_on_site=offers-kalendar-puteshestvii/",
    description: "Только до Нового года – максимальные скидки на туры",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFHrxXzx",
    app_erid: "2W5zFHrxXzx",
    promo_end_text: "до 31.12.2025",
    entry_point: "calendar"
  },
  {
    filter: "По направлениям",
    name: "Черная пятница – все по-настоящему!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_BlackFriday.png",
    url: "/hot-offers/black-friday/?banner_on_site=offers-black-friday25/",
    description: "Летите туда, где настоящие скидки на известные бренды",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFGWQXXv",
    app_erid: "2W5zFGWQXXv",
    promo_start: "2025-10-13 13:00",
    promo_end_text: "до 17.11.2025",
    promo_end: "2025-11-17 23:30",
    entry_point: "black_friday"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus.Сокровища Востока!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb/cb_aktsiya_sokrovischa_vostoka.jpg",
    url: "/poleznaya-informatsiya/offers/aktsiya-sokrovischa-vostoka/?banner_on_site = offers-cb-sokrovischa-vostoka",
    description: "Дарим 4000 бонусов при бронировании тура в Египет или ОАЭ!",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFHaLYCY",
    app_erid: "2W5zFHhkUcG",
    promo_end_text: "до 31.12.2025",
    promo_end: "2025-12-31 23:59"
  },
  {
    filter: "По направлениям",
    name: "Все путешествия исполнятся!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/offer page-upd_eb_leto.png",
    url: "/hot-offers/rannee-bronirovanie-leto/?banner_on_site=offers-rannee-bronirovanie-leto/",
    description: "Бронируйте лето 2026 со скидкой до 50%",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFHVybb6",
    app_erid: "2W5zFHVybb6",
    promo_end_text: "до 31.12.2025",
    promo_end: "2025-12-31 23:30"
  },
  {
    filter: "По направлениям",
    name: "Отдых ближе, чем кажется...",
    visual: "https://b2ccdn.coral.ru/content/img/actions/New_Promo_Coral_324x180_eb_5%.png",
    url: "/hot-offers/rannee-bronirovanie-osen/?banner_on_site=offers-rannee-bronirovanie-osen/",
    description: "Предоплата снижена до 5% только до 5 сентября!",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFHvhqCt",
    app_erid: "2W5zFHvhqCt",
    promo_end_text: "до 05.09.2025",
    promo_end: "2025-09-05 23:30"
  },
  {
    filter: "По направлениям",
    name: "Новый год – повод для путешествия!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/NEW_Inner_page_Coral_684x364_NY_25_offers.webp",
    url: "/main/newyear/?banner_on_site=offers-newyear26/",
    description: "Бронируйте отдых на все праздники",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFGJXd4c",
    app_erid: "2W5zFGJXd4c",
    promo_end_text: "до 31.12.2025"
  },
  {
    filter: "Акции отелей,По направлениям",
    name: "Дети отдыхают в Турции и Египте бесплатно",
    visual: "https://b2ccdn.coral.ru/content/img/actions/action2+2.png",
    url: "/poleznaya-informatsiya/offers/hot-offers/aktsiya-deti-otdyhayut-v-egipte-besplatno/?banner_on_site=offers-action2+2_2025/",
    description: "Вы платите только за перелет",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFJXGkTz",
    app_erid: "2W5zFJXGkTz",
    promo_end_text: "Бессрочно",
    promo_end: "2025-10-27 23:30"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus. Первым рейсом!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb/one-flight_cb_offers_324х180.png",
    url: "/poleznaya-informatsiya/offers/aktsiya-pervym-rejsom/?banner_on_site=offers-pervym-rejsom/",
    description: "Дарим до 5000 бонусов за бронирование",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFHyyxPA",
    app_erid: "2W5zFJpuYgY",
    promo_end_text: "до 31.01.2026",
    promo_end: "2026-01-31 23:30"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus. На волне доверия!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb/on-wave-trust_offers_324x180.png",
    url: "/poleznaya-informatsiya/offers/aktsiya-na-volne-doveriya/?banner_on_site=offers-volne-doveriya/",
    description: "Дарим 6 000 бонусов за второе путешествие с картой",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFJX7hJQ",
    app_erid: "2W5zFKABPM2",
    promo_end_text: "Бессрочно"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus. Добро пожаловать!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb-dobro-pozhalovat.png",
    url: "/poleznaya-informatsiya/offers/hot-offers/akcia-dobro-pozhalovat/?banner_on_site=offers-dobro-pozhalovat/",
    description: "Активируйте карту и получите 3 000 приветственных бонусов на счёт!",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFGRi6qe",
    app_erid: "2W5zFGac2Xi",
    promo_end_text: "до 31.01.2026",
    promo_end: "2026-01-31 23:30"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus.<br> Ранние пташки!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb-rannie-ptashk.png",
    url: "/poleznaya-informatsiya/offers/akciya-rannie-ptashki/?banner_on_site=offers-cb-rannie-ptashki/",
    description: "Дарим 2 000 бонусов на раннее бронирование!",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFGkywW8",
    app_erid: "2W5zFGrutdW",
    promo_end_text: "до 31.10.2025",
    promo_end: "2025-10-31 23:30"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus. Любимый отель!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb-lyubimiy-hotel.png",
    url: "/poleznaya-informatsiya/offers/hot-offers/lyubimiy-hotel/?banner_on_site=offers-cb-lyubimiy-hotel/",
    description: "Дарим 1000 дополнительных бонусов на отдых!",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFHUVbPn",
    app_erid: "2W5zFHwBNTz",
    promo_end_text: "до 30.09.2025",
    promo_end: "2025-09-30 23:30"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus. Отель XO Cape Arnna",
    visual: "https://b2ccdn.coral.ru/content/img/actions/cb-xo-cape-arnnat.png",
    url: "/poleznaya-informatsiya/offers/xo-cape-arnna/?banner_on_site=offers-cb-xo-cape-arnnat/",
    description: "12 000 бонусов на отдых в отеле XO Cape Arnna!",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFJKRBhA",
    app_erid: "2W5zFJNPAFr",
    promo_end_text: "до 20.10.2025",
    promo_end: "2025-10-20 23:30"
  },
  {
    filter: "CoralBonus",
    name: "CoralBonus. Отель Anda Barut Collection",
    visual: "https://b2ccdn.coral.ru/content/img/actions/Anda_Barut_Collection_ac.png",
    url: "/poleznaya-informatsiya/offers/anda-barut-collection/?banner_on_site=offers-cb-anda-barut-collection",
    description: "11 000 бонусов на отдых в отеле Anda Barut Collection!",
    ligal: "ООО «КОРТРЕВЕЛ МАРКЕТ»",
    erid: "2W5zFJUK7PE",
    app_erid: "2W5zFJhezvL",
    promo_end_text: "до 20.10.2025",
    promo_end: "2025-10-20 23:30"
  },
  {
    filter: "По направлениям",
    name: "Не можете найти подходящий тур?",
    visual: "https://b2ccdn.coral.ru/content/img/actions/tour-guide.png",
    url: "/tour-guide/?banner_on_site=offers-tour-guide/",
    description: "Умный подбор туров по вашим предпочтениям",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFFv4ggg",
    app_erid: "2W5zFFv4ggg",
    promo_end_text: "Бессрочно"
  },
  {
    filter: "Акции отелей",
    name: "За детей<br> платить не нужно!",
    visual: "https://b2ccdn.coral.ru/content/img/actions/detymi-v-rossii.png",
    url: "/vygodnyy-otdyh-s-detymi-v-rossii/?banner_on_site=offers-detymi-v-rossii/",
    description: "Отели России с бесплатным проживанием и питанием для детей",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFGf4Krg",
    app_erid: "2W5zFGf4Krg",
    promo_end_text: "Бессрочно"
  },
  {
    filter: "Акции отелей",
    name: "Пакеты услуг в отелях ОАЭ",
    visual: "https://b2ccdn.coral.ru/content/img/actions/hotels-service-packages.png",
    url: "/poleznaya-informatsiya/hotels-service-packages/?banner_on_site=offers-hotels-service-packages/",
    description: "Не беспокойся об ограничениях в работе банковских карт",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFHqFkpY",
    app_erid: "2W5zFHqFkpY",
    promo_end_text: "Бессрочно"
  },
  {
    filter: "Акции отелей",
    name: "Акции отелей",
    visual: "https://b2ccdn.coral.ru/content/img/actions/actionhotels.png",
    url: "/poleznaya-informatsiya/offers/hot-offers/actionhotels/?banner_on_site=offers-actionhotels/",
    description: "Эксклюзивные скидки, бонусы и подарки",
    ligal: "ООО «Центрбронь»",
    erid: "2W5zFHz9gWc",
    app_erid: "2W5zFHz9gWc",
    promo_end_text: "Бессрочно"
  }
];
