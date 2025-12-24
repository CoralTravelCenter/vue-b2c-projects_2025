import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import {createYmaps} from 'vue-yandex-maps';

(window as any)._yamap_settings = [{
    country_name: 'Турция',
    capital_cords: [39.9199, 32.8543],
    product: [{
        name: 'Экскурсионные туры',
        list: [],
    },
        {
            name: 'Достопримечательности',
            list: [],
        },
        {
            name: 'Экскурсии',
            list: [{
                label: 'Экскурсии по красотам Турции',
                url: 'https://www.coral.ru/main/turkey/tyrkeyexcursion/'
            },
                {
                    label: 'Экскурсии из Антальи',
                    url: 'https://www.coral.ru/main/turkey/antalya/antalyaexcursion/'
                },
                {
                    label: 'Экскурсии из Бодрума',
                    url: 'https://www.coral.ru/main/turkey/aegeanexcursion/'
                }
            ]
        },
        {
            name: 'Корпоративные программы',
            list: [{
                label: 'Стамбул и Каппадокия',
                pdf: 'https://cdn.coral.ru/content/img/ist_cappadocia.pdf',
            },
                {
                    label: 'Квест-путешествие по Турции',
                    pdf: 'https://cdn.coral.ru/content/img/turkeyquestjourney.pdf',
                }
            ]
        }
    ]
},
    {
        country_name: 'Азербайджан',
        capital_cords: [40.3777, 49.892],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Экскурсионный тур в Азербайджан',
                url: 'https://www.coral.ru/main/azerbaijan/ekskursionnie-turi-v-azerbaydzhan/'
            }],
        },
            {
                name: 'Достопримечательности',
                list: [],
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Страна Огней, Баку и окрестности',
                    pdf: 'https://cdn.coral.ru/content/img/azerbaijan.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Армения',
        capital_cords: [40.1811, 44.5136],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Экскурсионный тур в Армению',
                url: 'https://www.coral.ru/armeniya/ekskursionnie-turi-v-armeniyu/'
            }],
        },
            {
                name: 'Достопримечательности',
                list: [{
                    label: 'Достопримечательности Армении',
                    url: 'https://www.coral.ru/armeniya/attractionarmenia/'
                }]
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Самое главное за 5 дней',
                    pdf: 'https://cdn.coral.ru/content/img/armenia.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Бахрейн',
        capital_cords: [26.2279, 50.5857],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: [{
                    label: 'Отдых в Бахрейне',
                    url: 'https://www.coral.ru/main/bahrein/otdyh-v-bahrein/'
                }]
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Болгария',
        capital_cords: [42.6975, 23.3242],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Экскурсия №1',
                url: 'https://www.coral.ru/main/bulgaria/bulgariaexcursion/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия по Болгарии',
                    url: 'https://www.coral.ru/main/bulgaria/bulgariaexcursion/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Беларусь',
        capital_cords: [53.9, 27.5667],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Экскурсия в Беларусь',
                url: 'https://www.coral.ru/belarus/ekskursionnie-turi-v-belarus/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: [{
                    label: 'Достопримечательности Белорусии',
                    url: 'https://www.coral.ru/belarus/dostoprimechatelnosti-belarusi/'
                }

                ]
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Вьетнам',
        capital_cords: [21.0245, 105.841],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: "Экскурсия во Вьетнам",
                    url: 'https://www.coral.ru/main/vietnam/exvietnam/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Грузия',
        capital_cords: [41.6941, 44.8337],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Тур в Грузию',
                url: 'https://www.coral.ru/georgia/ekskursionnye-tury-v-gruziyu/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: [{
                    label: 'Достопримечательности в Грузии',
                    url: 'https://www.coral.ru/georgia/dostoprimechatelynosti-gruzii/'
                }]
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Древняя Грузия',
                    pdf: 'https://cdn.coral.ru/content/img/georgia02022024.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Доминиканская Республика',
        capital_cords: [18.4719, -69.8923],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия в Доминикану',
                    url: 'https://www.coral.ru/main/dominikana/exdominikana/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Египет',
        capital_cords: [30.0626, 31.2497],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия в Египет',
                    url: 'https://www.coral.ru/main/egypt/egyptexcurcion/',
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Индонезия',
        capital_cords: [-6.21462, 106.845],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия на Бали',
                    url: 'https://www.coral.ru/main/bali/exbali/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Италия',
        capital_cords: [41.8919, 12.5113],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Тур в Италию',
                url: 'https://www.coral.ru/main/italia/round-trips/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия в Италии',
                    url: 'https://www.coral.ru/italia/ekskursii-v-italii/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Казахстан',
        capital_cords: [51.1801, 71.446],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Тур в Казахстан',
                url: 'https://www.coral.ru/kazahstan/ekskursionnye-tury-v-kazahstan/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Казахстан, Алма-Ата',
                    pdf: 'https://cdn.coral.ru/content/img/kazakhstan.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Катар',
        capital_cords: [25.2854, 51.531],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия в Катаре',
                    url: 'https://www.coral.ru/main/qatar/excursions-qatar/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Кипр',
        capital_cords: [35.1753, 33.3642],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия на Кипре',
                    url: 'https://www.coral.ru/cyprus/ekskursii-na-kipre/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Маврикий',
        capital_cords: [-20.1619, 57.4989],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия на Маврикий',
                    url: 'https://www.coral.ru/main/mauritius/mauritiusexcursion/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Марокко',
        capital_cords: [34.0132, -6.83255],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия в Марокко',
                    url: 'https://www.coral.ru/main/morocco/moroccoexcursion/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Все Марокко - программа-путешествие',
                    pdf: 'https://cdn.coral.ru/content/img/morocco.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Мексика',
        capital_cords: [19.4285, -99.1277],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсия в Мексике',
                    url: 'https://www.coral.ru/mexico/mexicoexcursion/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'ОАЭ',
        capital_cords: [24.4667, 54.3667],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Тур в ОАЭ',
                url: 'https://www.coral.ru/uae-excursions-weektour/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии и парки развлечений в ОАЭ',
                    url: 'https://www.coral.ru/main/uae/uaeexcursion/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Восточный город будущего',
                    pdf: 'https://cdn.coral.ru/content/img/uae.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Россия',
        capital_cords: [55.7522, 37.6156],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Туры по России',
                url: 'https://www.coral.ru/concepts/ekskursionnie-turi/ekskursionnie-turi-po-rossii/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Алтай - горы и озера',
                    pdf: 'https://cdn.coral.ru/content/img/altai.pdf',
                },
                    {
                        label: 'Калининград - знакомство',
                        pdf: 'https://cdn.coral.ru/content/img/kaliningrad.pdf',
                    },
                    {
                        label: 'Горный край - Дагестан',
                        pdf: 'https://cdn.coral.ru/content/img/dagestan.pdf'
                    },
                ]
            }
        ]
    },
    {
        country_name: 'Сейшельские острова',
        capital_cords: [-4.62001, 55.455],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии на Сейшелах',
                    url: 'https://www.coral.ru/main/seychelles/exseychelles/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Таиланд',
        capital_cords: [13.754, 100.501],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии в Тайланде',
                    url: 'https://www.coral.ru/main/thailand/exthai/',
                },
                    {
                        label: 'Экскурсии на Пхукете',
                        url: 'https://www.coral.ru/main/regthailand/phuket/ekskursii-na-phukete/',
                    },
                    {
                        label: 'Экскурсии в Паттайе',
                        url: 'https://www.coral.ru/main/regthailand/pattaya/ekskursii-v-pattaje/'
                    }
                ]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Танзания',
        capital_cords: [-6.17221, 35.7395],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии на Занзибаре',
                    url: 'https://www.coral.ru/main/tanzania/zanzibarexcursion/'
                },]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Тунис',
        capital_cords: [36.819, 10.1658],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии в Тунисе',
                    url: 'https://www.coral.ru/main/tunis/tunisexcurcion/'
                },]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Узбекистан',
        capital_cords: [41.2646, 69.2163],
        product: [{
            name: 'Экскурсионные туры',
            list: [{
                label: 'Тур в Узбекистан',
                url: 'https://www.coral.ru/uzbekistan/ekskursionnye-tury-v-uzbekistan/'
            }]
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Узбекистан, Бухара',
                    pdf: 'https://cdn.coral.ru/content/img/uzbekistan.pdf'
                }]
            }
        ]
    },
    {
        country_name: 'Черногория',
        capital_cords: [42.4411, 19.2636],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии в Черногории',
                    url: 'https://www.coral.ru/main/chernogoriya/montenegroexcursion/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Шри-Ланка',
        capital_cords: [6.88297, 79.9071],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии на Шри-Ланке',
                    url: 'https://www.coral.ru/main/srilanka/exsrilanka/'
                }]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Куба',
        capital_cords: [23.133, -82.383],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Экскурсии на Кубе',
                    url: 'https://www.coral.ru/main/cuba/cubaexcursions/'
                }

                ]
            },
            {
                name: 'Корпоративные программы',
                list: []
            }
        ]
    },
    {
        country_name: 'Китайская Народная Республика',
        capital_cords: [39.9075, 116.397],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Пекин-Шанхай',
                    pdf: 'https://cdn.coral.ru/content/img/china.pdf',
                },
                    {
                        label: 'Декорации Аватара',
                        pdf: 'https://cdn.coral.ru/content/img/china2.pdf'
                    }
                ]
            }
        ]
    },
    {
        country_name: 'Кыргыстан',
        capital_cords: [42.87, 74.59],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: []
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Кыргыстан, Памиро-Алай',
                    pdf: 'https://cdn.coral.ru/content/img/china.pdf',
                }]
            }
        ]
    },
    {
        country_name: 'Индия',
        capital_cords: [28.6358, 77.2244],
        product: [{
            name: 'Экскурсионные туры',
            list: []
        },
            {
                name: 'Достопримечательности',
                list: []
            },
            {
                name: 'Экскурсии',
                list: [{
                    label: 'Золотой Треугольник + Гоа',
                    url: 'https://www.coral.ru/main/india/indiaexcursionpr/goldentrianglemini/'
                },
                    {
                        label: 'Тур Тадж Махал + Гоа',
                        url: 'https://www.coral.ru/main/india/indiaexcursionpr/tajmahaltour/'
                    },
                    {
                        label: 'Мумбай + Гоа',
                        url: 'https://www.coral.ru/main/india/indiaexcursionpr/tourinmumbai3/'
                    }
                ]
            },
            {
                name: 'Корпоративные программы',
                list: [{
                    label: 'Индия - 5 городов',
                    pdf: 'https://cdn.coral.ru/content/img/india01022024.pdf',
                }]
            }
        ]
    }
];

const app = createApp(App);
app.use(createYmaps({
    apikey: import.meta.env.VITE_YMAPS_API_KEY,
}));
app.mount('#monkey-app');
