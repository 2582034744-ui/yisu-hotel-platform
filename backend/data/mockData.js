const fs = require('fs');
const path = require('path');

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'hotels-data.json');

// 默认酒店数据
const defaultHotels = [
    // ========== 原有的高端五星级酒店 ==========
    {
        id: 1,
        name: "上海外滩华尔道夫酒店",
        name_en: "Waldorf Astoria Shanghai",
        address: "上海市黄浦区中山东一路2号",
        city: "上海",
        star_rating: 5,
        images: ["/uploads/hotel1-1.jpg", "/uploads/hotel1-2.jpg", "/uploads/hotel1-3.jpg"],
        description: "酒店坐落于外滩核心地带，拥有绝佳的黄浦江景观。装修风格融合了古典与现代元素，为宾客提供奢华的住宿体验。",
        facilities: "免费WiFi、游泳池、健身房、停车场、餐厅、SPA、商务中心",
        phone: "021-63229988",
        email: "shanghai.waldorf@hilton.com",
        rating: 4.9,
        review_count: 2341,
        status: "published",
        merchant_id: 1001,
        created_at: "2024-01-01 10:00:00",
        updated_at: "2024-12-01 15:30:00",
        min_price: 1288,
        distance: "距外滩500米",
        latitude: 31.2373,
        longitude: 121.4865,
        rooms: [
            {
                id: 101,
                name: "豪华江景大床房",
                price: 1688,
                discount_price: 1288,
                bed_type: "大床2m",
                area: 45,
                max_guests: 2,
                description: "45平方米，外滩景观，配备智能马桶、浴缸",
                images: ["/uploads/room101-1.jpg", "/uploads/room101-2.jpg"]
            },
            {
                id: 102,
                name: "高级城景双床房",
                price: 1388,
                discount_price: 988,
                bed_type: "双床1.2m",
                area: 38,
                max_guests: 2,
                description: "38平方米，城市景观，配备智能马桶",
                images: ["/uploads/room102-1.jpg", "/uploads/room102-2.jpg"]
            },
            {
                id: 103,
                name: "行政套房",
                price: 2888,
                discount_price: 2288,
                bed_type: "大床2m",
                area: 80,
                max_guests: 3,
                description: "80平方米，江景套房，含行政酒廊待遇",
                images: ["/uploads/room103-1.jpg", "/uploads/room103-2.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 10001,
                name: "外滩",
                type: "attraction",
                distance: "步行约5分钟"
            },
            {
                id: 10002,
                name: "南京东路地铁站",
                type: "transport",
                distance: "步行约5分钟"
            },
            {
                id: 10003,
                name: "南京路步行街",
                type: "shopping",
                distance: "步行约10分钟"
            }
        ]
    },
    {
        id: 2,
        name: "北京王府井半岛酒店",
        name_en: "The Peninsula Beijing",
        address: "北京市东城区王府井金鱼胡同8号",
        city: "北京",
        star_rating: 5,
        images: ["/uploads/hotel2-1.jpg", "/uploads/hotel2-2.jpg"],
        description: "位于王府井核心区域，融合了中西文化精髓，提供卓越的住宿体验。",
        facilities: "免费WiFi、室内游泳池、SPA、健身房、米其林餐厅",
        phone: "010-85162888",
        email: "peninsula.beijing@peninsula.com",
        rating: 4.8,
        review_count: 1876,
        status: "published",
        merchant_id: 1002,
        created_at: "2024-02-01 10:00:00",
        updated_at: "2024-11-15 14:20:00",
        min_price: 1888,
        distance: "距王府井步行街100米",
        latitude: 39.9109,
        longitude: 116.4134,
        rooms: [
            {
                id: 201,
                name: "豪华客房",
                price: 2288,
                discount_price: 1888,
                bed_type: "大床2m/双床1.2m",
                area: 50,
                max_guests: 2,
                description: "50平方米，王府井景观",
                images: ["/uploads/room201-1.jpg"]
            },
            {
                id: 202,
                name: "半岛套房",
                price: 3888,
                discount_price: 3288,
                bed_type: "大床2m",
                area: 90,
                max_guests: 3,
                description: "90平方米，带客厅的套房",
                images: ["/uploads/room202-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 20001,
                name: "王府井大街",
                type: "shopping",
                distance: "步行约2分钟"
            },
            {
                id: 20002,
                name: "故宫博物院",
                type: "attraction",
                distance: "车程约10分钟"
            },
            {
                id: 20003,
                name: "王府井地铁站",
                type: "transport",
                distance: "步行约5分钟"
            }
        ]
    },
    {
        id: 3,
        name: "广州四季酒店",
        name_en: "Four Seasons Hotel Guangzhou",
        address: "广州市天河区珠江新城珠江西路5号",
        city: "广州",
        star_rating: 5,
        images: ["/uploads/hotel3-1.jpg", "/uploads/hotel3-2.jpg", "/uploads/hotel3-3.jpg"],
        description: "坐落于广州国际金融中心，俯瞰珠江美景，提供奢华住宿体验。",
        facilities: "免费WiFi、无边泳池、SPA、米其林餐厅、健身房",
        phone: "020-88838888",
        email: "guangzhou.fourseasons@fourseasons.com",
        rating: 4.7,
        review_count: 1567,
        status: "published",
        merchant_id: 1003,
        created_at: "2024-03-01 10:00:00",
        updated_at: "2024-10-20 09:45:00",
        min_price: 1588,
        distance: "距珠江新城地铁站200米",
        latitude: 23.1291,
        longitude: 113.2644,
        rooms: [
            {
                id: 301,
                name: "江景客房",
                price: 1888,
                discount_price: 1588,
                bed_type: "大床2m",
                area: 48,
                max_guests: 2,
                description: "48平方米，珠江景观",
                images: ["/uploads/room301-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 30001,
                name: "花城广场",
                type: "attraction",
                distance: "步行约5分钟"
            },
            {
                id: 30002,
                name: "珠江新城地铁站",
                type: "transport",
                distance: "步行约3分钟"
            }
        ]
    },
    {
        id: 4,
        name: "深圳瑞吉酒店",
        name_en: "The St. Regis Shenzhen",
        address: "深圳市罗湖区深南东路5016号",
        city: "深圳",
        star_rating: 5,
        images: ["/uploads/hotel4-1.jpg", "/uploads/hotel4-2.jpg"],
        description: "位于京基100大厦，深圳地标性建筑，提供管家服务。",
        facilities: "免费WiFi、室内泳池、SPA、酒吧、餐厅",
        phone: "0755-88886666",
        email: "stregis.shenzhen@stregis.com",
        rating: 4.8,
        review_count: 1345,
        status: "published",
        merchant_id: 1004,
        created_at: "2024-04-01 10:00:00",
        updated_at: "2024-09-12 16:30:00",
        min_price: 1488,
        distance: "距大剧院地铁站100米",
        latitude: 22.5431,
        longitude: 114.0579,
        rooms: [
            {
                id: 401,
                name: "豪华客房",
                price: 1688,
                discount_price: 1488,
                bed_type: "大床2m",
                area: 45,
                max_guests: 2,
                description: "45平方米，城市景观",
                images: ["/uploads/room401-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 40001,
                name: "京基100大厦",
                type: "attraction",
                distance: "大厦内"
            },
            {
                id: 40002,
                name: "大剧院地铁站",
                type: "transport",
                distance: "步行约2分钟"
            }
        ]
    },
    {
        id: 5,
        name: "杭州西子湖四季酒店",
        name_en: "Four Seasons Hotel Hangzhou at West Lake",
        address: "杭州市西湖区灵隐路5号",
        city: "杭州",
        star_rating: 5,
        images: ["/uploads/hotel5-1.jpg", "/uploads/hotel5-2.jpg"],
        description: "毗邻西湖，江南园林式酒店，环境优美。",
        facilities: "免费WiFi、室外泳池、SPA、中餐厅、健身房",
        phone: "0571-88298888",
        email: "hangzhou.fourseasons@fourseasons.com",
        rating: 4.9,
        review_count: 1123,
        status: "published",
        merchant_id: 1005,
        created_at: "2024-05-01 10:00:00",
        updated_at: "2024-08-08 11:15:00",
        min_price: 1688,
        distance: "距西湖500米",
        latitude: 30.2465,
        longitude: 120.1140,
        rooms: [
            {
                id: 501,
                name: "园景客房",
                price: 1888,
                discount_price: 1688,
                bed_type: "大床2m",
                area: 55,
                max_guests: 2,
                description: "55平方米，江南园林景观",
                images: ["/uploads/room501-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 50001,
                name: "西湖",
                type: "attraction",
                distance: "步行约10分钟"
            },
            {
                id: 50002,
                name: "灵隐寺",
                type: "attraction",
                distance: "车程约10分钟"
            }
        ]
    },

    // ========== 新增：四星级酒店（适合商务出行） ==========
    {
        id: 6,
        name: "上海虹桥枢纽亚朵酒店",
        name_en: "Atour Hotel Shanghai Hongqiao Hub",
        address: "上海市闵行区申长路888号",
        city: "上海",
        star_rating: 4,
        images: ["/uploads/hotel6-1.jpg", "/uploads/hotel6-2.jpg", "/uploads/hotel6-3.jpg"],
        description: "位于虹桥商务区核心地带，距离虹桥机场和虹桥火车站仅10分钟车程，是商务出行的理想选择。",
        facilities: "免费WiFi、会议室、健身房、餐厅、自助洗衣房、免费停车场",
        phone: "021-62298888",
        email: "hongqiao.atour@atour.com",
        rating: 4.6,
        review_count: 3456,
        status: "published",
        merchant_id: 1006,
        created_at: "2024-06-01 10:00:00",
        updated_at: "2024-11-20 14:30:00",
        min_price: 458,
        distance: "距虹桥机场5公里",
        latitude: 31.1979,
        longitude: 121.3264,
        rooms: [
            {
                id: 601,
                name: "高级大床房",
                price: 558,
                discount_price: 458,
                bed_type: "大床1.8m",
                area: 28,
                max_guests: 2,
                description: "28平方米，城市景观，配备办公桌",
                images: ["/uploads/room601-1.jpg"]
            },
            {
                id: 602,
                name: "几木套房",
                price: 758,
                discount_price: 658,
                bed_type: "大床2m",
                area: 45,
                max_guests: 2,
                description: "45平方米，带会客区，配备胶囊咖啡机",
                images: ["/uploads/room602-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 60001,
                name: "虹桥天地",
                type: "shopping",
                distance: "步行约8分钟"
            },
            {
                id: 60002,
                name: "虹桥火车站",
                type: "transport",
                distance: "车程约10分钟"
            }
        ]
    },
    {
        id: 7,
        name: "北京新国展希尔顿欢朋酒店",
        name_en: "Hampton by Hilton Beijing New China International Exhibition Center",
        address: "北京市顺义区天竺地区府前二街6号",
        city: "北京",
        star_rating: 4,
        images: ["/uploads/hotel7-1.jpg", "/uploads/hotel7-2.jpg"],
        description: "紧邻北京新国展，提供免费机场接送服务，是参展商和商务旅客的首选。",
        facilities: "免费WiFi、免费机场班车、健身房、餐厅、会议室",
        phone: "010-80468888",
        email: "beijing.hampton@hilton.com",
        rating: 4.5,
        review_count: 2876,
        status: "published",
        merchant_id: 1007,
        created_at: "2024-06-15 10:00:00",
        updated_at: "2024-10-25 09:20:00",
        min_price: 528,
        distance: "距新国展500米",
        latitude: 40.0803,
        longitude: 116.5574,
        rooms: [
            {
                id: 701,
                name: "舒适大床房",
                price: 628,
                discount_price: 528,
                bed_type: "大床1.8m",
                area: 30,
                max_guests: 2,
                description: "30平方米，简约现代风格",
                images: ["/uploads/room701-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 70001,
                name: "北京新国展",
                type: "attraction",
                distance: "步行约6分钟"
            },
            {
                id: 70002,
                name: "首都机场",
                type: "transport",
                distance: "车程约15分钟"
            }
        ]
    },
    {
        id: 8,
        name: "广州白云山麓湖亚朵酒店",
        name_en: "Atour Hotel Guangzhou Baiyun Mountain Luhu",
        address: "广州市白云区广园中路218号",
        city: "广州",
        star_rating: 4,
        images: ["/uploads/hotel8-1.jpg", "/uploads/hotel8-2.jpg"],
        description: "背靠白云山，面朝麓湖，环境清幽，空气清新，是休闲度假的理想选择。",
        facilities: "免费WiFi、健身房、书吧、餐厅、自助洗衣房",
        phone: "020-86338888",
        email: "baiyun.atour@atour.com",
        rating: 4.7,
        review_count: 1890,
        status: "published",
        merchant_id: 1008,
        created_at: "2024-07-01 10:00:00",
        updated_at: "2024-09-18 16:45:00",
        min_price: 398,
        distance: "距白云山风景区1公里",
        latitude: 23.1843,
        longitude: 113.2715,
        rooms: [
            {
                id: 801,
                name: "山景大床房",
                price: 498,
                discount_price: 398,
                bed_type: "大床1.8m",
                area: 32,
                max_guests: 2,
                description: "32平方米，白云山景观",
                images: ["/uploads/room801-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 80001,
                name: "白云山风景区",
                type: "attraction",
                distance: "步行约15分钟"
            },
            {
                id: 80002,
                name: "麓湖公园",
                type: "attraction",
                distance: "步行约10分钟"
            }
        ]
    },

    // ========== 新增：经济型酒店（适合预算有限的旅行者） ==========
    {
        id: 9,
        name: "上海外滩南京东路步行街全季酒店",
        name_en: "Ji Hotel Shanghai East Nanjing Road Pedestrian Street",
        address: "上海市黄浦区九江路595号",
        city: "上海",
        star_rating: 3,
        images: ["/uploads/hotel9-1.jpg", "/uploads/hotel9-2.jpg"],
        description: "位于南京东路步行街旁，步行可达外滩、人民广场，地理位置优越，性价比高。",
        facilities: "免费WiFi、24小时前台、行李寄存、自助早餐",
        phone: "021-63608888",
        email: "shanghai.ji@huazhu.com",
        rating: 4.4,
        review_count: 5678,
        status: "published",
        merchant_id: 1009,
        created_at: "2024-07-15 10:00:00",
        updated_at: "2024-11-10 11:30:00",
        min_price: 299,
        distance: "距南京东路地铁站200米",
        latitude: 31.2345,
        longitude: 121.4821,
        rooms: [
            {
                id: 901,
                name: "大床房",
                price: 359,
                discount_price: 299,
                bed_type: "大床1.5m",
                area: 18,
                max_guests: 2,
                description: "18平方米，简约设计",
                images: ["/uploads/room901-1.jpg"]
            },
            {
                id: 902,
                name: "双床房",
                price: 399,
                discount_price: 339,
                bed_type: "双床1.2m",
                area: 22,
                max_guests: 2,
                description: "22平方米，适合朋友同行",
                images: ["/uploads/room902-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 90001,
                name: "南京路步行街",
                type: "shopping",
                distance: "步行约2分钟"
            },
            {
                id: 90002,
                name: "人民广场",
                type: "attraction",
                distance: "步行约10分钟"
            },
            {
                id: 90003,
                name: "外滩",
                type: "attraction",
                distance: "步行约15分钟"
            }
        ]
    },
    {
        id: 10,
        name: "北京西站汉庭酒店",
        name_en: "Hanting Hotel Beijing West Railway Station",
        address: "北京市丰台区广安路9号",
        city: "北京",
        star_rating: 2,
        images: ["/uploads/hotel10-1.jpg", "/uploads/hotel10-2.jpg", "/uploads/hotel10-3.jpg"],
        description: "紧邻北京西站南广场，交通便利，干净整洁，适合中转旅客。",
        facilities: "免费WiFi、24小时热水、行李寄存、自助早餐",
        phone: "010-63268888",
        email: "beijing.hanting@huazhu.com",
        rating: 4.2,
        review_count: 4321,
        status: "published",
        merchant_id: 1010,
        created_at: "2024-08-01 10:00:00",
        updated_at: "2024-10-05 13:15:00",
        min_price: 219,
        distance: "距北京西站300米",
        latitude: 39.8949,
        longitude: 116.3220,
        rooms: [
            {
                id: 1001,
                name: "大床房",
                price: 269,
                discount_price: 219,
                bed_type: "大床1.5m",
                area: 15,
                max_guests: 2,
                description: "15平方米，经济实惠",
                images: ["/uploads/room1001-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 100001,
                name: "北京西站",
                type: "transport",
                distance: "步行约5分钟"
            },
            {
                id: 100002,
                name: "莲花池公园",
                type: "attraction",
                distance: "步行约10分钟"
            }
        ]
    },
    {
        id: 11,
        name: "广州火车站如家酒店",
        name_en: "Home Inn Guangzhou Railway Station",
        address: "广州市越秀区环市西路184号",
        city: "广州",
        star_rating: 2,
        images: ["/uploads/hotel11-1.jpg", "/uploads/hotel11-2.jpg"],
        description: "位于广州火车站对面，交通枢纽位置，周边餐饮丰富，适合背包客和短期停留旅客。",
        facilities: "免费WiFi、行李寄存、叫醒服务",
        phone: "020-86668888",
        email: "guangzhou.homeinn@homeinn.com",
        rating: 4.1,
        review_count: 3890,
        status: "published",
        merchant_id: 1011,
        created_at: "2024-08-15 10:00:00",
        updated_at: "2024-09-22 10:30:00",
        min_price: 189,
        distance: "距广州火车站200米",
        latitude: 23.1495,
        longitude: 113.2570,
        rooms: [
            {
                id: 1101,
                name: "经济大床房",
                price: 229,
                discount_price: 189,
                bed_type: "大床1.5m",
                area: 12,
                max_guests: 1,
                description: "12平方米，适合单人入住",
                images: ["/uploads/room1101-1.jpg"]
            },
            {
                id: 1102,
                name: "标准双床房",
                price: 289,
                discount_price: 249,
                bed_type: "双床1.2m",
                area: 18,
                max_guests: 2,
                description: "18平方米，经济实惠",
                images: ["/uploads/room1102-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 110001,
                name: "广州火车站",
                type: "transport",
                distance: "步行约3分钟"
            },
            {
                id: 110002,
                name: "流花湖公园",
                type: "attraction",
                distance: "步行约8分钟"
            }
        ]
    },
    {
        id: 12,
        name: "深圳罗湖口岸青旅",
        name_en: "Shenzhen Luohu Port Youth Hostel",
        address: "深圳市罗湖区人民南路3005号深房广场",
        city: "深圳",
        star_rating: 2,
        images: ["/uploads/hotel12-1.jpg", "/uploads/hotel12-2.jpg"],
        description: "面向青年旅行者，提供床位房和标间，氛围轻松，可结识各国朋友，步行可达罗湖口岸。",
        facilities: "免费WiFi、公共厨房、公共休息区、自助洗衣、行李寄存",
        phone: "0755-82238888",
        email: "sz.luohu@yha.com",
        rating: 4.3,
        review_count: 2156,
        status: "published",
        merchant_id: 1012,
        created_at: "2024-09-01 10:00:00",
        updated_at: "2024-11-28 15:40:00",
        min_price: 89,
        distance: "距罗湖口岸500米",
        latitude: 22.5309,
        longitude: 114.1166,
        rooms: [
            {
                id: 1201,
                name: "4人间床位",
                price: 99,
                discount_price: 89,
                bed_type: "上下铺",
                area: 20,
                max_guests: 1,
                description: "20平方米，4人间，独立储物柜",
                images: ["/uploads/room1201-1.jpg"]
            },
            {
                id: 1202,
                name: "标准大床房",
                price: 239,
                discount_price: 199,
                bed_type: "大床1.5m",
                area: 16,
                max_guests: 2,
                description: "16平方米，私密空间",
                images: ["/uploads/room1202-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 120001,
                name: "罗湖口岸",
                type: "transport",
                distance: "步行约8分钟"
            },
            {
                id: 120002,
                name: "东门老街",
                type: "shopping",
                distance: "地铁2站"
            }
        ]
    },
    {
        id: 13,
        name: "杭州西湖湖滨银泰漫心酒店",
        name_en: "Manxin Hotel Hangzhou West Lake Hubin Yintai",
        address: "杭州市上城区平海路125号",
        city: "杭州",
        star_rating: 3,
        images: ["/uploads/hotel13-1.jpg", "/uploads/hotel13-2.jpg", "/uploads/hotel13-3.jpg"],
        description: "位于西湖湖滨商圈，步行5分钟可达西湖，周边商业繁华，性价比高。",
        facilities: "免费WiFi、24小时前台、行李寄存、早餐",
        phone: "0571-87038888",
        email: "hz.westlake@manxin.com",
        rating: 4.5,
        review_count: 3124,
        status: "published",
        merchant_id: 1013,
        created_at: "2024-09-15 10:00:00",
        updated_at: "2024-12-02 09:10:00",
        min_price: 329,
        distance: "距西湖300米",
        latitude: 30.2577,
        longitude: 120.1606,
        rooms: [
            {
                id: 1301,
                name: "湖景大床房",
                price: 429,
                discount_price: 359,
                bed_type: "大床1.8m",
                area: 25,
                max_guests: 2,
                description: "25平方米，部分房间可观西湖",
                images: ["/uploads/room1301-1.jpg"]
            },
            {
                id: 1302,
                name: "亲子家庭房",
                price: 529,
                discount_price: 459,
                bed_type: "大床1.8m+单人床",
                area: 35,
                max_guests: 3,
                description: "35平方米，适合家庭入住",
                images: ["/uploads/room1302-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 130001,
                name: "西湖",
                type: "attraction",
                distance: "步行约6分钟"
            },
            {
                id: 130002,
                name: "湖滨银泰in77",
                type: "shopping",
                distance: "步行约3分钟"
            },
            {
                id: 130003,
                name: "龙翔桥地铁站",
                type: "transport",
                distance: "步行约5分钟"
            }
        ]
    },

    // ========== 新增：景点周边特色酒店 ==========
    {
        id: 14,
        name: "西安钟楼南门古城墙亚朵酒店",
        name_en: "Atour Hotel Xi'an Bell Tower South Gate City Wall",
        address: "西安市碑林区南大街32号",
        city: "西安",
        star_rating: 4,
        images: ["/uploads/hotel14-1.jpg", "/uploads/hotel14-2.jpg"],
        description: "位于西安古城核心区，紧邻钟楼、鼓楼、回民街，可步行上古城墙，感受古都魅力。",
        facilities: "免费WiFi、书吧、餐厅、健身房、自助洗衣房",
        phone: "029-87218888",
        email: "xian.atour@atour.com",
        rating: 4.7,
        review_count: 2876,
        status: "published",
        merchant_id: 1014,
        created_at: "2024-07-20 10:00:00",
        updated_at: "2024-10-30 14:25:00",
        min_price: 468,
        distance: "距钟楼300米",
        latitude: 34.2610,
        longitude: 108.9468,
        rooms: [
            {
                id: 1401,
                name: "城景大床房",
                price: 568,
                discount_price: 468,
                bed_type: "大床1.8m",
                area: 30,
                max_guests: 2,
                description: "30平方米，古城景观",
                images: ["/uploads/room1401-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 140001,
                name: "西安钟楼",
                type: "attraction",
                distance: "步行约5分钟"
            },
            {
                id: 140002,
                name: "回民街",
                type: "attraction",
                distance: "步行约8分钟"
            },
            {
                id: 140003,
                name: "西安城墙",
                type: "attraction",
                distance: "步行约10分钟"
            }
        ]
    },
    {
        id: 15,
        name: "成都宽窄巷子亚朵酒店",
        name_en: "Atour Hotel Chengdu Kuanzhai Alley",
        address: "成都市青羊区同仁路18号",
        city: "成都",
        star_rating: 4,
        images: ["/uploads/hotel15-1.jpg", "/uploads/hotel15-2.jpg", "/uploads/hotel15-3.jpg"],
        description: "位于宽窄巷子景区内，川西民居风格设计，可体验成都慢生活。",
        facilities: "免费WiFi、茶室、书吧、餐厅、健身房",
        phone: "028-86138888",
        email: "chengdu.atour@atour.com",
        rating: 4.8,
        review_count: 3542,
        status: "published",
        merchant_id: 1015,
        created_at: "2024-08-10 10:00:00",
        updated_at: "2024-11-05 16:20:00",
        min_price: 528,
        distance: "宽窄巷子内",
        latitude: 30.6669,
        longitude: 104.0535,
        rooms: [
            {
                id: 1501,
                name: "庭院景观房",
                price: 628,
                discount_price: 528,
                bed_type: "大床1.8m",
                area: 35,
                max_guests: 2,
                description: "35平方米，川西庭院景观",
                images: ["/uploads/room1501-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 150001,
                name: "宽窄巷子",
                type: "attraction",
                distance: "酒店内"
            },
            {
                id: 150002,
                name: "人民公园",
                type: "attraction",
                distance: "步行约10分钟"
            }
        ]
    },
    {
        id: 16,
        name: "桂林象鼻山江边客栈",
        name_en: "Guilin Elephant Trunk Hill Riverside Inn",
        address: "桂林市象山区滨江路12号",
        city: "桂林",
        star_rating: 3,
        images: ["/uploads/hotel16-1.jpg", "/uploads/hotel16-2.jpg"],
        description: "紧邻象鼻山景区，漓江边上的特色客栈，推窗即景，感受山水之美。",
        facilities: "免费WiFi、江景露台、茶室、行李寄存",
        phone: "0773-28238888",
        email: "guilin.riverside@inn.com",
        rating: 4.6,
        review_count: 1876,
        status: "published",
        merchant_id: 1016,
        created_at: "2024-09-10 10:00:00",
        updated_at: "2024-11-18 13:50:00",
        min_price: 289,
        distance: "距象鼻山200米",
        latitude: 25.2740,
        longitude: 110.2993,
        rooms: [
            {
                id: 1601,
                name: "江景大床房",
                price: 349,
                discount_price: 289,
                bed_type: "大床1.8m",
                area: 20,
                max_guests: 2,
                description: "20平方米，漓江景观",
                images: ["/uploads/room1601-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 160001,
                name: "象鼻山景区",
                type: "attraction",
                distance: "步行约3分钟"
            },
            {
                id: 160002,
                name: "两江四湖景区",
                type: "attraction",
                distance: "步行约5分钟"
            }
        ]
    },
    {
        id: 17,
        name: "丽江古城花间堂客栈",
        name_en: "Blossom Hill Inn Lijiang Old Town",
        address: "丽江市古城区五一街文治巷97号",
        city: "丽江",
        star_rating: 4,
        images: ["/uploads/hotel17-1.jpg", "/uploads/hotel17-2.jpg", "/uploads/hotel17-3.jpg"],
        description: "位于丽江古城内，纳西族传统院落改造，保留了原始建筑风貌，体验古城生活。",
        facilities: "免费WiFi、茶室、庭院、餐厅、书吧",
        phone: "0888-51238888",
        email: "lijiang.blossomhill@blossom.com",
        rating: 4.8,
        review_count: 2345,
        status: "published",
        merchant_id: 1017,
        created_at: "2024-08-20 10:00:00",
        updated_at: "2024-10-15 10:10:00",
        min_price: 428,
        distance: "丽江古城内",
        latitude: 26.8721,
        longitude: 100.2295,
        rooms: [
            {
                id: 1701,
                name: "庭院大床房",
                price: 528,
                discount_price: 428,
                bed_type: "大床1.8m",
                area: 30,
                max_guests: 2,
                description: "30平方米，纳西庭院景观",
                images: ["/uploads/room1701-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 170001,
                name: "四方街",
                type: "attraction",
                distance: "步行约8分钟"
            },
            {
                id: 170002,
                name: "木府",
                type: "attraction",
                distance: "步行约12分钟"
            }
        ]
    },
    {
        id: 18,
        name: "厦门鼓浪屿钢琴码头民宿",
        name_en: "Gulangyu Piano Pier Homestay",
        address: "厦门市思明区鼓浪屿龙头路118号",
        city: "厦门",
        star_rating: 3,
        images: ["/uploads/hotel18-1.jpg", "/uploads/hotel18-2.jpg"],
        description: "位于鼓浪屿钢琴码头附近，欧式建筑风格，充满文艺气息，适合拍照打卡。",
        facilities: "免费WiFi、咖啡厅、露台、行李寄存",
        phone: "0592-20638888",
        email: "gulangyu.homestay@homestay.com",
        rating: 4.5,
        review_count: 1987,
        status: "published",
        merchant_id: 1018,
        created_at: "2024-09-25 10:00:00",
        updated_at: "2024-12-01 09:30:00",
        min_price: 319,
        distance: "距钢琴码头200米",
        latitude: 24.4485,
        longitude: 118.0823,
        rooms: [
            {
                id: 1801,
                name: "海景大床房",
                price: 419,
                discount_price: 339,
                bed_type: "大床1.8m",
                area: 22,
                max_guests: 2,
                description: "22平方米，部分海景",
                images: ["/uploads/room1801-1.jpg"]
            },
            {
                id: 1802,
                name: "庭院双床房",
                price: 389,
                discount_price: 319,
                bed_type: "双床1.2m",
                area: 25,
                max_guests: 2,
                description: "25平方米，庭院景观",
                images: ["/uploads/room1802-1.jpg"]
            }
        ],
        nearby_places: [
            {
                id: 180001,
                name: "钢琴码头",
                type: "transport",
                distance: "步行约3分钟"
            },
            {
                id: 180002,
                name: "日光岩",
                type: "attraction",
                distance: "步行约15分钟"
            },
            {
                id: 180003,
                name: "龙头路商业街",
                type: "shopping",
                distance: "步行约5分钟"
            }
        ]
    }
];

// 默认用户数据
const defaultUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: '系统管理员',
        role: 'admin',
        merchantId: null,
    },
    {
        id: 1001,
        username: 'shanghai_merchant',
        password: '123456',
        name: '上海外滩酒店管理有限公司',
        role: 'merchant',
        merchantId: 1001,
    },
    {
        id: 1002,
        username: 'beijing_merchant',
        password: '123456',
        name: '北京王府井酒店管理有限公司',
        role: 'merchant',
        merchantId: 1002,
    },
    {
        id: 1003,
        username: 'guangzhou_merchant',
        password: '123456',
        name: '广州四季酒店管理有限公司',
        role: 'merchant',
        merchantId: 1003,
    },
    {
        id: 1004,
        username: 'shenzhen_merchant',
        password: '123456',
        name: '深圳湾酒店管理有限公司',
        role: 'merchant',
        merchantId: 1004,
    },
    {
        id: 1005,
        username: 'hangzhou_merchant',
        password: '123456',
        name: '杭州西湖酒店管理有限公司',
        role: 'merchant',
        merchantId: 1005,
    },
    {
        id: 1006,
        username: 'merchant1006',
        password: '123456',
        name: '上海虹桥酒店管理公司',
        role: 'merchant',
        merchantId: 1006,
    },
    {
        id: 1007,
        username: 'merchant1007',
        password: '123456',
        name: '北京国展酒店管理公司',
        role: 'merchant',
        merchantId: 1007,
    },
    {
        id: 1008,
        username: 'merchant1008',
        password: '123456',
        name: '成都锦里酒店管理公司',
        role: 'merchant',
        merchantId: 1008,
    },
    {
        id: 1009,
        username: 'merchant1009',
        password: '123456',
        name: '南京金陵酒店管理公司',
        role: 'merchant',
        merchantId: 1009,
    },
    {
        id: 1010,
        username: 'merchant1010',
        password: '123456',
        name: '西安古城酒店管理公司',
        role: 'merchant',
        merchantId: 1010,
    },
    {
        id: 1011,
        username: 'merchant1011',
        password: '123456',
        name: '苏州园林酒店管理公司',
        role: 'merchant',
        merchantId: 1011,
    },
    {
        id: 1012,
        username: 'merchant1012',
        password: '123456',
        name: '青岛海滨酒店管理公司',
        role: 'merchant',
        merchantId: 1012,
    },
    {
        id: 1013,
        username: 'merchant1013',
        password: '123456',
        name: '重庆山城酒店管理公司',
        role: 'merchant',
        merchantId: 1013,
    },
    {
        id: 1014,
        username: 'merchant1014',
        password: '123456',
        name: '厦门鹭岛酒店管理公司',
        role: 'merchant',
        merchantId: 1014,
    },
    {
        id: 1015,
        username: 'merchant1015',
        password: '123456',
        name: '三亚滨海酒店管理公司',
        role: 'merchant',
        merchantId: 1015,
    },
    {
        id: 1016,
        username: 'merchant1016',
        password: '123456',
        name: '丽江古镇酒店管理公司',
        role: 'merchant',
        merchantId: 1016,
    },
    {
        id: 1017,
        username: 'merchant1017',
        password: '123456',
        name: '桂林山水酒店管理公司',
        role: 'merchant',
        merchantId: 1017,
    },
    {
        id: 1018,
        username: 'merchant1018',
        password: '123456',
        name: '厦门鼓浪屿酒店管理公司',
        role: 'merchant',
        merchantId: 1018,
    },
];

// 加载数据的函数
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            console.log('从 JSON 文件加载数据成功');
            return {
                hotels: data.hotels || defaultHotels,
                bookings: data.bookings || [],
                users: data.users || defaultUsers
            };
        }
    } catch (error) {
        console.error('加载数据文件失败:', error);
    }
    console.log('使用默认数据');
    return {
        hotels: [...defaultHotels],
        bookings: [],
        users: [...defaultUsers]
    };
}

// 保存数据的函数
function saveData(hotels, bookings, users) {
    try {
        const data = { hotels, bookings, users };
        console.log('正在保存数据，酒店数量:', hotels.length);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log('数据已保存到 JSON 文件:', DATA_FILE);
        return true;
    } catch (error) {
        console.error('保存数据失败:', error);
        console.error('错误详情:', error.message);
        return false;
    }
}

// 初始化数据
const loadedData = loadData();

// 导出数据（使用 let 以便可以修改）
let hotels = loadedData.hotels;
let bookings = loadedData.bookings;
let users = loadedData.users;

// 导出保存函数
module.exports = {
    get hotels() { return hotels; },
    set hotels(value) { hotels = value; },
    get bookings() { return bookings; },
    set bookings(value) { bookings = value; },
    get users() { return users; },
    set users(value) { users = value; },
    saveData: () => saveData(hotels, bookings, users)
};
