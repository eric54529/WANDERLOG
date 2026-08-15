import { Trip } from '../types';

export const initialTrips: Trip[] = [
  {
    id: 'trip-kyoto-spring-2025',
    title: '初春京都與嵐山：櫻花古寺慢活散策 5 日遊',
    subtitle: '漫步哲學之道、走進嵯峨野竹林與祇園白川夜櫻的粉櫻回憶',
    destination: '京都 & 嵐山 (Kyoto)',
    country: '日本 (Japan)',
    countryCode: 'JP',
    flag: '🇯🇵',
    startDate: '2025-04-02',
    endDate: '2025-04-06',
    daysCount: 5,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    summary: '趁著四月初春櫻花盛開，我們踏上了久違的京都散策之旅。從清晨薄霧中的清水寺舞台，到嵐山渡月橋邊的抹茶香氣，古都的每一片石板路與飄落的櫻花瓣都讓人心醉神迷。',
    companions: ['小涵 (攝影狂)', '阿偉 (美食領隊)', '我'],
    budget: {
      currency: 'TWD',
      totalAmount: 42000,
      perPerson: 42000,
      breakdown: {
        transport: 12500,
        stay: 16000,
        food: 9500,
        tickets: 2500,
        shopping: 1500,
      },
    },
    vibe: 'culture',
    rating: 5,
    viewsCount: 384,
    likesCount: 56,
    isFavorite: true,
    highlights: [
      '清晨 6 點獨享清水寺舞台與無人櫻花絕景',
      '搭乘嵐山嵯峨野小火車穿越保津川峽谷',
      '祇園白川邊品嚐百年和菓子抹茶聖代',
      '伏見稻荷千本鳥居晨曦光影攝影特輯',
      '鴨川跳烏龜石、傍晚在河畔吹風放空'
    ],
    tips: [
      '熱門景點如清水寺與伏見稻荷建議清晨 7:00 前抵達，光線最好且能避開人潮。',
      '購買 ICOCA 卡搭配京都巴士一日券即可輕鬆暢遊市區所有經典古寺。',
      '嵐山小火車車票強烈建議出發前一個月在 JR 官網先預訂偶數排靠窗席位！',
      '推薦在四條河原町租借傳統和服，漫步二年坂與產寧坂拍照氛圍極佳。'
    ],
    memoriesText: '「在京都的時間流速彷彿比日常慢了一半。看著櫻花隨風落在鴨川水面，突然明白旅行不是為了趕路，而是為了重新找回感受生活微小美好的能力。」',
    createdAt: '2025-04-08T10:00:00Z',
    updatedAt: '2025-04-08T10:00:00Z',
    places: [
      {
        id: 'place-kiyomizu',
        name: '清水寺 (Kiyomizu-dera)',
        category: 'sight',
        lat: 34.994857,
        lng: 135.785046,
        dayNumber: 1,
        note: '懸空舞台俯瞰滿山櫻花，音羽之瀑祈求健康',
        photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        rating: 5,
        address: '京都府京都市東山區清水1丁目294',
        timeSpent: '2.5 小時'
      },
      {
        id: 'place-gion',
        name: '祇園白川 & 花見小路',
        category: 'photo_spot',
        lat: 35.0042,
        lng: 135.7766,
        dayNumber: 1,
        note: '傍晚町家木屋與石板小徑，白川垂櫻倒影美如畫',
        photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        address: '京都府京都市東山區祇園町南側'
      },
      {
        id: 'place-arashiyama-bamboo',
        name: '嵐山竹林小徑 & 天龍寺',
        category: 'nature',
        lat: 35.0167,
        lng: 135.6714,
        dayNumber: 2,
        note: '陽光穿透高聳竹林的幽靜綠意，天龍寺曹源池庭園倒影',
        photoUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        address: '京都府京都市右京區嵯峨小倉山田淵山町'
      },
      {
        id: 'place-sagano-train',
        name: '嵯峨野觀光鐵道小火車',
        category: 'transport',
        lat: 35.0192,
        lng: 135.6775,
        dayNumber: 2,
        note: '搭復古露天車廂穿梭櫻花隧道與保津川碧綠溪谷',
        photoUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
        rating: 5
      },
      {
        id: 'place-fushimi-inari',
        name: '伏見稻荷大社 (千本鳥居)',
        category: 'sight',
        lat: 34.9671,
        lng: 135.7727,
        dayNumber: 3,
        note: '連綿不絕的朱紅色鳥居，沿山林步道緩緩登頂',
        photoUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        address: '京都府京都市伏見區深草藪之內町68'
      },
      {
        id: 'place-philosopher-path',
        name: '哲學之道 (Philosopher\'s Walk)',
        category: 'nature',
        lat: 35.0272,
        lng: 135.7958,
        dayNumber: 4,
        note: '沿著琵琶湖疏水綿延約兩公里的櫻花林蔭道',
        photoUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80',
        rating: 5
      },
      {
        id: 'place-kamogawa',
        name: '鴨川跳烏龜石 (鴨川三角洲)',
        category: 'leisure' as any,
        lat: 35.0305,
        lng: 135.7725,
        dayNumber: 5,
        note: '坐在鴨川河畔看白鷺鷥與野餐，體驗在地悠閒步調',
        photoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        rating: 4.7
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2025-04-02',
        title: '初見古都：東山散步道與清水寺暮色',
        highlight: '三年坂的和風石板路與傍晚清水舞台的壯闊全景',
        mood: '🌸 滿心期待與初見驚喜',
        weather: '晴朗微風 18°C',
        journalText: '班機抵達關西機場後，搭上 HARUKA 直奔京都車站。推著行李來到五條附近的町家民宿，放下背包立刻奔向東山區。午後的產寧坂櫻花開得正盛，沿途買了現烤的生八橋與櫻花冰淇淋。站在清水寺舞台上望向京都市區，夕陽把古樸的木造榫卯結構染成了金紅色，微風吹來陣陣櫻吹雪，這一刻便知道這趟旅程將無比難忘。',
        stops: [
          {
            id: 's1-1',
            time: '13:30',
            placeName: '京都站 & HARUKA 特急抵達',
            description: '順利在綠色窗口兌換 JR PASS，感受古都現代與傳統交融的建築穹頂。',
            category: 'transport',
            cost: '¥3,200',
            tips: '記得在車站買一杯抹茶拿鐵配車站限定便當！'
          },
          {
            id: 's1-2',
            time: '15:00',
            placeName: '二年坂 & 三年坂石板路',
            description: '穿梭在傳統木造町家建築間，兩側古意盎然的茶屋與陶藝店令人流連忘返。',
            photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
            category: 'sight'
          },
          {
            id: 's1-3',
            time: '16:45',
            placeName: '清水寺 (音羽山清水寺)',
            description: '走上清水舞台俯瞰被粉白櫻花包圍的山谷，並在音羽瀑布品嚐清泉。',
            photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
            category: 'sight',
            cost: '門票 ¥400'
          },
          {
            id: 's1-4',
            time: '19:00',
            placeName: '祇園白川夜櫻漫步 & 鴨川晚餐',
            description: '夜幕低垂，河畔茶屋點亮燈籠，石板路旁的垂櫻與溪流波光相映成趣。',
            category: 'food'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2025-04-03',
        title: '嵯峨野之風：嵐山竹林幽徑與保津川遊船',
        highlight: '聽著竹葉沙沙作響，乘著觀光小火車穿梭峽谷',
        mood: '🍃 寧靜深邃與身心療癒',
        weather: '多雲時晴 16°C',
        journalText: '早晨搭乘嵐電來到嵐山，趁著遊客尚未湧入，我們漫步穿過嵯峨野竹林小徑。早晨的陽光如絲線般穿過翠綠的竹梢，空氣中瀰漫著竹子特有的清新芬芳。隨後走進世界遺產天龍寺，坐在曹源池庭園的緣側上看鯉魚遊動。下午搭上嵯峨野小火車，沿著保津川峽谷欣賞兩岸櫻花與奇岩，河面上的泛舟遊客熱情地向我們揮手，整個人完全放鬆下來。',
        stops: [
          {
            id: 's2-1',
            time: '08:00',
            placeName: '嵐山竹林小徑 (Bamboo Grove)',
            description: '無人的晨間竹林步道，幽靜得只能聽見風聲與自己的腳步聲。',
            photoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            category: 'nature'
          },
          {
            id: 's2-2',
            time: '09:30',
            placeName: '天龍寺 & 曹源池庭園',
            description: '室町時代由夢窗疏石國師設計的迴遊式庭園，借景嵐山山景堪稱一絕。',
            category: 'sight',
            cost: '門票 ¥500'
          },
          {
            id: 's2-3',
            time: '11:30',
            placeName: '嵯峨野觀光鐵道 (嵯峨野 Torokko 小火車)',
            description: '坐在開放式第 5 節車廂「富貴號」，保津川峽谷的山谷櫻景盡收眼底。',
            photoUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=600&q=80',
            category: 'transport',
            cost: '¥880'
          },
          {
            id: 's2-4',
            time: '14:30',
            placeName: '渡月橋畔 % ARABICA 咖啡',
            description: '排隊買了杯拉花精美的燕麥奶拿鐵，坐在桂川堤防上看水鳥與遠山。',
            category: 'food'
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2025-04-04',
        title: '紅色隧道：伏見稻荷大社與宇治抹茶香',
        highlight: '千本鳥居的朱紅光影與宇治百年老店的極品抹茶芭菲',
        mood: '⛩️ 震撼與味蕾饗宴',
        weather: '晴 20°C',
        journalText: '清晨 6:45 抵達伏見稻荷大社。晨光穿透一根根朱紅色的鳥居木柱，在地面投下長長的陰影，宛如通往神聖異次元的神秘隧道。爬到四之辻觀景點俯瞰京都市容後下山。午後搭 JR 來到宇治，空氣中真的能聞到淡淡的焙茶香。在「中村藤吉本店」點了生茶果凍竹筒芭菲，濃郁的抹茶苦甜平衡到了極致，幸福感直接拉滿！',
        stops: [
          {
            id: 's3-1',
            time: '07:00',
            placeName: '伏見稻荷大社 (千本鳥居)',
            description: '沿著稻荷山綿延數公里的朱紅鳥居隧道，清晨無人時光影絕美。',
            photoUrl: 'https://images.unsplash.com/photo-1478436127897-769e00d0c71e?auto=format&fit=crop&w=600&q=80',
            category: 'sight'
          },
          {
            id: 's3-2',
            time: '12:00',
            placeName: '宇治 平等院鳳凰堂',
            description: '印在日幣 10 元硬幣上的國寶建築，阿字池倒影莊嚴而典雅。',
            category: 'sight',
            cost: '門票 ¥600'
          },
          {
            id: 's3-3',
            time: '14:30',
            placeName: '中村藤吉本店 (宇治抹茶旗艦)',
            description: '品嚐招牌竹筒抹茶冰淇淋與手打濃茶，茶香甘醇餘韻悠長。',
            category: 'food',
            cost: '¥1,650'
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2025-04-05',
        title: '櫻雪紛飛：哲學之道、南禪寺與蹴上傾斜鐵道',
        highlight: '走在鋪滿粉紅花瓣的舊鐵道與古老水路閣',
        mood: '💖 浪漫詩意',
        weather: '晴時多雲 19°C',
        journalText: '第四天是滿開的櫻花視覺盛宴！從銀閣寺出發走入哲學之道，兩旁的櫻花樹枝垂向小溪，花瓣隨風飄落在清澈的水流中。接著探訪了南禪寺的水路閣紅磚拱橋，古羅馬風格的引水道與日式枯山水毫無違和。最後來到蹴上傾斜鐵道，兩側櫻花交織成粉色穹頂，隨手一拍都是明信片般的風景。',
        stops: [
          {
            id: 's4-1',
            time: '09:00',
            placeName: '哲學之道散步策',
            description: '全長約兩公里的疏水道步道，是京都最著名的櫻花散步道之一。',
            photoUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80',
            category: 'nature'
          },
          {
            id: 's4-2',
            time: '11:30',
            placeName: '南禪寺 & 水路閣',
            description: '壯觀的三門與融合洋風的紅磚拱形疏水橋，攝影愛好者的最愛。',
            category: 'sight'
          },
          {
            id: 's4-3',
            time: '14:00',
            placeName: '蹴上傾斜鐵道 (Keage Incline)',
            description: '廢棄舊鐵軌兩側開滿吉野櫻，櫻花隧道下每一步都像走在日劇裡。',
            category: 'photo_spot'
          }
        ]
      },
      {
        dayNumber: 5,
        date: '2025-04-06',
        title: '依依不捨：鴨川野餐與錦市場尋味回味',
        highlight: '在鴨川旁跳烏龜石、錦市場品嚐玉子燒與章魚燒',
        mood: '☀️ 溫暖感恩',
        weather: '晴天 22°C',
        journalText: '旅行的最後一天，我們決定放慢所有節奏。早上到錦市場吃剛出爐的熱騰騰三木雞卵玉子燒與豆乳甜甜圈，隨後外帶了麵包走去鴨川三角洲。脫下鞋子在清涼的溪石間跳躍，看著學生與家庭在草地上曬太陽野餐。收拾行囊時雖然不捨，但滿滿的相機記憶卡與回憶，已經把京都的春天深深烙印在心中。',
        stops: [
          {
            id: 's5-1',
            time: '10:00',
            placeName: '錦市場 (京都人的廚房)',
            description: '品嚐各式京醬菜、烤牡蠣、玉子燒與抹茶點心，充滿市井人情味。',
            category: 'food'
          },
          {
            id: 's5-2',
            time: '12:30',
            placeName: '鴨川三角洲 (跳烏龜石)',
            description: '坐在草坪上吹著微風，欣賞高野川與賀茂川交會的美麗水景。',
            photoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            category: 'nature'
          }
        ]
      }
    ],
    photos: [
      {
        id: 'ph-kyoto-1',
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        caption: '清水寺舞台遠眺，粉櫻與古剎在春光中靜立。',
        location: '清水寺',
        dayNumber: 1,
        date: '2025-04-02',
        tags: ['古寺', '櫻花', '世界遺產', '風景'],
        isCover: true,
        liked: true
      },
      {
        id: 'ph-kyoto-2',
        url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
        caption: '產寧坂與二年坂古樸町家木造建築與石階步道。',
        location: '二年坂 & 產寧坂',
        dayNumber: 1,
        date: '2025-04-02',
        tags: ['街道', '古都', '傳統町家'],
        liked: true
      },
      {
        id: 'ph-kyoto-3',
        url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
        caption: '清晨嵐山嵯峨野竹林小徑，綠意盎然光影婆娑。',
        location: '嵐山竹林',
        dayNumber: 2,
        date: '2025-04-03',
        tags: ['自然', '竹林', '清晨', '風景'],
        liked: true
      },
      {
        id: 'ph-kyoto-4',
        url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
        caption: '嵯峨野觀光小火車穿梭於保津川春季櫻林與峽谷間。',
        location: '嵯峨野鐵道',
        dayNumber: 2,
        date: '2025-04-03',
        tags: ['鐵道', '峽谷', '交通']
      },
      {
        id: 'ph-kyoto-5',
        url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80',
        caption: '伏見稻荷大社千本鳥居，朱紅色的光影長廊。',
        location: '伏見稻荷大社',
        dayNumber: 3,
        date: '2025-04-04',
        tags: ['鳥居', '神社', '建築', '人文'],
        liked: true
      },
      {
        id: 'ph-kyoto-6',
        url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80',
        caption: '哲學之道的櫻花小溪，落英繽紛水波粼粼。',
        location: '哲學之道',
        dayNumber: 4,
        date: '2025-04-05',
        tags: ['櫻花', '水景', '散策', '風景']
      },
      {
        id: 'ph-kyoto-7',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
        caption: '鴨川兩岸的垂柳與曬太陽的旅人，最愜意的日常。',
        location: '鴨川',
        dayNumber: 5,
        date: '2025-04-06',
        tags: ['野餐', '河流', '生活感'],
        liked: true
      }
    ]
  },
  {
    id: 'trip-swiss-alps-2024',
    title: '瑞士阿爾卑斯之巔：少女峰與馬特洪峰冰河壯遊 8 日',
    subtitle: '穿梭在如童話般的格林德瓦木屋、健行五湖倒影與搭乘冰河列車',
    destination: '因特拉肯、策馬特 & 琉森 (Interlaken & Zermatt)',
    country: '瑞士 (Switzerland)',
    countryCode: 'CH',
    flag: '🇨🇭',
    startDate: '2024-09-10',
    endDate: '2024-09-17',
    daysCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
    summary: '九月的瑞士秋高氣爽，金黃色的落葉松與白雪皚皚的山巔交織成極致畫卷。我們搭乘齒軌火車登上歐洲屋脊少女峰，在策馬特五湖健行看馬特洪峰的完美倒影，每一口空氣都無比純淨。',
    companions: ['Emma (旅伴)', 'David (山友)'],
    budget: {
      currency: 'TWD',
      totalAmount: 105000,
      perPerson: 105000,
      breakdown: {
        transport: 38000,
        stay: 42000,
        food: 18000,
        tickets: 7000,
      },
    },
    vibe: 'nature',
    rating: 5,
    viewsCount: 620,
    likesCount: 94,
    isFavorite: true,
    highlights: [
      '登上海拔 3,454 公尺的歐洲之巔少女峰 (Jungfraujoch)',
      '策馬特五湖健行 (Stellisee) 拍下馬特洪峰日出金頂黃金倒影',
      '格林德瓦 First 懸崖天空步道與高空飛索挑戰',
      '搭乘世界最慢特急「冰河列車 (Glacier Express)」穿越蘭德瓦薩高架橋',
      '琉森卡貝爾木橋與琉森湖遊船賞阿爾卑斯群山'
    ],
    tips: [
      '強烈推薦購買 Swiss Travel Pass (瑞士旅行通行證)，無限搭乘全境火車、巴士、遊船，且可享有許多登山纜車折扣。',
      '策馬特看日出黃金馬特洪峰一定要早起（建議 6:00 前至 Kirchbrücke 橋），雲霧散開的瞬間震撼人心。',
      '高山氣候多變，即使夏季登山也要準備好防風防水防寒三合一外套。'
    ],
    memoriesText: '「當清晨第一道金光灑在馬特洪峰的尖錐山頂時，整個湖面映著耀眼的金色。那一刻所有的舟車勞頓與清晨寒風，都在大自然的神奇前化作最深層的感動。」',
    createdAt: '2024-09-22T08:00:00Z',
    updatedAt: '2024-09-22T08:00:00Z',
    places: [
      {
        id: 'place-jungfrau',
        name: '少女峰 (Jungfraujoch - Top of Europe)',
        category: 'sight',
        lat: 46.5475,
        lng: 7.9824,
        dayNumber: 2,
        note: '歐洲最高火車站，參觀斯芬克斯觀景台與冰宮',
        photoUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        rating: 5
      },
      {
        id: 'place-grindelwald',
        name: '格林德瓦 (Grindelwald & First)',
        category: 'nature',
        lat: 46.6242,
        lng: 8.0414,
        dayNumber: 3,
        note: '夢幻山坡小木屋，First 懸崖步道與高空飛索',
        photoUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
        rating: 4.9
      },
      {
        id: 'place-zermatt-matterhorn',
        name: '策馬特 & 馬特洪峰 (Matterhorn)',
        category: 'nature',
        lat: 45.9763,
        lng: 7.7491,
        dayNumber: 5,
        note: '高納葛拉特登山鐵道，五湖健行尋找倒影',
        photoUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
        rating: 5
      },
      {
        id: 'place-lucerne',
        name: '琉森卡貝爾木橋 (Chapel Bridge)',
        category: 'sight',
        lat: 47.0516,
        lng: 8.3074,
        dayNumber: 7,
        note: '歐洲最古老木造有頂橋樑，湖畔天鵝與古城巷弄',
        photoUrl: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80',
        rating: 4.8
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2024-09-10',
        title: '抵達蘇黎世直奔因特拉肯湖間小鎮',
        highlight: '搭乘瑞士國鐵穿梭在綠意盎然的圖恩湖與布里恩茨湖間',
        mood: '🏔️ 雀躍興奮',
        journalText: '抵達蘇黎世機場後開通 Swiss Travel Pass，搭乘雙層景觀列車一路南下。穿過窗外連綿的山丘與湛藍的湖水，下午順利抵達因特拉肯。在何維克街 (Höhematte) 大草坪上仰望遠方的雪山，看著五彩繽紛的飛行傘在藍天中翱翔。',
        stops: [
          {
            id: 'sw1-1',
            time: '11:00',
            placeName: '蘇黎世機場 SBB 景觀列車',
            description: '準時、乾淨、窗景宛如移動風景畫的瑞士國鐵體驗。',
            category: 'transport'
          },
          {
            id: 'sw1-2',
            time: '15:30',
            placeName: '因特拉肯 Höhematte 大草坪',
            description: '坐在長椅上品嚐瑞士起司與麵包，遠眺少女峰的雄偉初貌。',
            category: 'nature'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2024-09-11',
        title: '征服歐洲之巔：少女峰冰宮與阿萊奇冰河',
        highlight: '站上海拔 3,454 米，俯瞰阿爾卑斯山最長的阿萊奇冰河',
        mood: '❄️ 震撼壯麗',
        weather: '晴空萬里 -2°C',
        journalText: '清晨搭乘艾格快線 (Eiger Express) 纜車與齒軌火車直達少女峰。走出戶外觀景台的那一秒，零下的冷空氣與純白的萬年冰河撲面而來！腳下是壯觀延綿 23 公里的阿萊奇冰河，四周被四千公尺的雪山環抱。在冰宮裡撫摸晶瑩透亮的冰雕，宛如走進冰雪奇緣的世界。',
        stops: [
          {
            id: 'sw2-1',
            time: '08:30',
            placeName: '艾格快線纜車 (Eiger Express)',
            description: '現代化 3S 纜車超大玻璃窗，近距離仰望艾格峰北壁的險峻險峰。',
            category: 'transport'
          },
          {
            id: 'sw2-2',
            time: '10:00',
            placeName: '斯芬克斯觀景台 (Sphinx Observatory)',
            description: '站在 3571 米平台，360 度無死角欣賞阿爾卑斯群山雪原。',
            photoUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
            category: 'sight'
          }
        ]
      }
    ],
    photos: [
      {
        id: 'ph-sw-1',
        url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
        caption: '少女峰斯芬克斯觀景台眺望阿萊奇冰河壯麗全貌。',
        location: '少女峰',
        dayNumber: 2,
        tags: ['雪山', '冰河', '高山', '瑞士之巔'],
        isCover: true,
        liked: true
      },
      {
        id: 'ph-sw-2',
        url: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80',
        caption: '格林德瓦夢幻山坡，綠草如茵中的童話木屋群。',
        location: '格林德瓦',
        dayNumber: 3,
        tags: ['童話村莊', '草原', '木屋'],
        liked: true
      },
      {
        id: 'ph-sw-3',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        caption: '策馬特高納葛拉特湖泊中倒映出的金頂馬特洪峰。',
        location: '策馬特 Stellisee',
        dayNumber: 5,
        tags: ['馬特洪峰', '湖泊倒影', '經典風景'],
        liked: true
      },
      {
        id: 'ph-sw-4',
        url: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=80',
        caption: '琉森卡貝爾木橋與水塔，湖畔天鵝自在游弋。',
        location: '琉森',
        dayNumber: 7,
        tags: ['古橋', '湖泊', '城市散步'],
        liked: true
      },
      {
        id: 'ph-sw-5',
        url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
        caption: '阿爾卑斯高山小木屋與漫山白雪相映成趣。',
        location: '因特拉肯山區',
        dayNumber: 4,
        tags: ['雪景', '木屋', '寧靜']
      },
      {
        id: 'ph-sw-6',
        url: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1200&q=80',
        caption: '宛如藍寶石般清澈透明的阿爾卑斯高山湖泊。',
        location: '藍湖 Blausee',
        dayNumber: 6,
        tags: ['湖泊', '清澈', '自然']
      }
    ]
  },
  {
    id: 'trip-iceland-ring-road-2023',
    title: '冰島一號公路極光自駕：冰川瀑布與黑沙灘冒險 7 日',
    subtitle: '追逐綠色極光夜空、探訪藍冰洞、鑽石沙灘與大自然最純粹的狂野力量',
    destination: '雷克雅維克、維克 & 傑古沙龍 (Reykjavik & Vik)',
    country: '冰島 (Iceland)',
    countryCode: 'IS',
    flag: '🇮🇸',
    startDate: '2023-10-15',
    endDate: '2023-10-21',
    daysCount: 7,
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80',
    summary: '租了一輛四驅 SUV，我們沿著冰島一號公路環島南岸展開自駕冒險。從轟鳴的賽里雅蘭瀑布到維克黑沙灘的玄武岩柱，在沒有光害的小木屋前看著綠色極光如彩帶般在夜空翻滾舞動，那一刻體會到了世界的廣袤與人類的渺小。',
    companions: ['阿倫', '小芳', '立群'],
    budget: {
      currency: 'TWD',
      totalAmount: 88000,
      perPerson: 88000,
      breakdown: {
        transport: 26000,
        stay: 32000,
        food: 18000,
        tickets: 12000,
      },
    },
    vibe: 'roadtrip',
    rating: 5,
    viewsCount: 450,
    likesCount: 72,
    isFavorite: false,
    highlights: [
      '在維克黑沙灘小木屋守候到 5 級強烈極光風暴爆發',
      '鑽石冰沙灘 (Diamond Beach) 觸摸被大浪沖上黑沙的晶瑩古老浮冰',
      '穿戴冰爪在瓦特納冰川上踏冰健行',
      '走進賽里雅蘭瀑布 (Seljalandsfoss) 水簾後方的神秘洞穴',
      '藍湖溫泉 (Blue Lagoon) 敷火山白泥享受地熱放鬆'
    ],
    tips: [
      '秋冬冰島天氣瞬息萬變，務必每天出發前查詢 vedur.is (天氣) 與 road.is (路況)。',
      '租車務必加保全險（包含碎石險與砂塵險），冰島強風時開車門務必雙手抓緊！',
      '拍攝極光需帶穩固三腳架與大光圈廣角鏡頭，手動對焦至無限遠。'
    ],
    memoriesText: '「在黑夜裡仰望天空，突然一道翠綠色的光芒自天頂劃破夜空，接著整個蒼穹開始跳動起舞。沒有任何言語能形容那一刻的震撼與激動，我們四個人在零下的寒風中相擁歡呼。」',
    createdAt: '2023-10-25T12:00:00Z',
    updatedAt: '2023-10-25T12:00:00Z',
    places: [
      {
        id: 'place-seljalandsfoss',
        name: '賽里雅蘭瀑布 (Seljalandsfoss)',
        category: 'nature',
        lat: 63.6156,
        lng: -19.9885,
        dayNumber: 2,
        note: '可繞至瀑布水幕後方的奇幻瀑布，感受水氣磅礴',
        photoUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
        rating: 4.9
      },
      {
        id: 'place-reynisfjara',
        name: '維克黑沙灘 (Reynisfjara Beach)',
        category: 'photo_spot',
        lat: 63.4057,
        lng: -19.0439,
        dayNumber: 3,
        note: '黑色火山沙、玄武岩石柱海蝕柱與洶湧北大西洋大浪',
        photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        rating: 5
      },
      {
        id: 'place-jokulsarlon',
        name: '傑古沙龍冰河湖 & 鑽石冰沙灘',
        category: 'nature',
        lat: 64.0484,
        lng: -16.1795,
        dayNumber: 4,
        note: '巨大的藍色浮冰靜靜漂浮，在黑沙灘上如同鑽石閃閃發光',
        photoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        rating: 5
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2023-10-15',
        title: '取車啟程：雷克雅維克市區與哈爾格林姆教堂',
        highlight: '登頂火箭大教堂俯瞰色彩繽紛的北歐小矮房',
        mood: '🚗 冒險啟航',
        journalText: '班機降落凱夫拉維克機場，順利辦理四驅車租借手續。初入首都雷克雅維克，空氣冷冽乾淨。走進地標哈爾格林姆教堂，坐電梯上頂樓俯瞰整座城市，五顏六色的屋頂在陰鬱的天空下格外溫暖可愛。晚上在熱狗名店 Bæjarins Beztu Pylsur 嚐了一份羊肉熱狗堡，簡單卻無比美味。',
        stops: [
          {
            id: 'is1-1',
            time: '14:00',
            placeName: '哈爾格林姆教堂 (Hallgrimskirkja)',
            description: '以冰島特有的玄武岩柱為靈感設計的前衛管風琴大教堂。',
            category: 'sight'
          }
        ]
      }
    ],
    photos: [
      {
        id: 'ph-is-1',
        url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
        caption: '站在賽里雅蘭瀑布後方，看水幕奔流直下。',
        location: '賽里雅蘭瀑布',
        dayNumber: 2,
        tags: ['瀑布', '水幕', '狂野大自然'],
        isCover: true,
        liked: true
      },
      {
        id: 'ph-is-2',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: '維克黑沙灘的六角形玄武岩柱群與洶湧怒濤。',
        location: '維克黑沙灘',
        dayNumber: 3,
        tags: ['黑沙灘', '玄武岩', '海岸'],
        liked: true
      },
      {
        id: 'ph-is-3',
        url: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=80',
        caption: '黑夜中綻放舞動的極光女神，如夢似幻的綠色光幕。',
        location: '維克小鎮郊區',
        dayNumber: 3,
        tags: ['極光', '星空', '夜景'],
        liked: true
      },
      {
        id: 'ph-is-4',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        caption: '傑古沙龍冰河湖與鑽石沙灘上閃耀的晶瑩冰晶。',
        location: '傑古沙龍冰河湖',
        dayNumber: 4,
        tags: ['冰河湖', '鑽石沙灘', '浮冰'],
        liked: true
      },
      {
        id: 'ph-is-5',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        caption: '冰島一號公路延伸至雪山地平線的狂野自駕體驗。',
        location: '一號環島公路',
        dayNumber: 5,
        tags: ['自駕', '公路', '遼闊']
      },
      {
        id: 'ph-is-6',
        url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
        caption: '黃金圈古佛斯瀑布壯觀水氣與雙層彩虹。',
        location: '古佛斯瀑布 Gullfoss',
        dayNumber: 6,
        tags: ['瀑布', '黃金圈', '彩虹']
      }
    ]
  },
  {
    id: 'trip-taiwan-hualien-2024',
    title: '花東縱谷與太平洋海線：山海相遇的放空療癒 4 日',
    subtitle: '騎單車穿梭伯朗大道金黃稻浪、七星潭聽浪撿石與都蘭海風咖啡',
    destination: '花蓮 & 台東 (Hualien & Taitung)',
    country: '台灣 (Taiwan)',
    countryCode: 'TW',
    flag: '🇹🇼',
    startDate: '2024-11-01',
    endDate: '2024-11-04',
    daysCount: 4,
    coverImage: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1600&q=80',
    summary: '跳上普悠瑪號離開喧囂都市，一路向東。太平洋蔚藍的浪花拍打著七星潭礫灘，騎著單車在池上秋收前的金黃稻浪中奔馳，在都蘭糖廠聽著原住民吉他彈唱，簡單、純粹、滿滿的台灣土地溫度。',
    companions: ['宜萱 (好友)'],
    budget: {
      currency: 'TWD',
      totalAmount: 14500,
      perPerson: 14500,
      breakdown: {
        transport: 3200,
        stay: 6800,
        food: 3500,
        shopping: 1000,
      },
    },
    vibe: 'leisure',
    rating: 4.9,
    viewsCount: 290,
    likesCount: 48,
    isFavorite: false,
    highlights: [
      '池上伯朗大道無電線桿的金黃稻海單車巡禮',
      '清晨坐在七星潭月牙灣礫石灘聽太平洋浪花拍岸',
      '太魯閣峽谷壯麗的大理石燕子口斷崖奇景',
      '都蘭鼻觀海平台吹海風喝手沖咖啡放空一整個下午'
    ],
    tips: [
      '池上金黃稻浪最佳觀賞期在每年 10 月底至 11 月中旬（秋收前），建議租電動腳踏車較省力。',
      '花蓮市區炸彈蔥油餅與公正包子排隊人潮多，建議避開正餐尖峰時段。',
      '台東海岸線公車班次較少，建議租機車或自駕漫遊更隨興愜意。'
    ],
    memoriesText: '「看著眼前無邊無際的太平洋藍，深淺漸層在陽光下閃耀。在台灣東岸，只要隨意找一顆大石頭坐下聽浪，就能把心裡所有的雜質洗滌得乾乾淨淨。」',
    createdAt: '2024-11-06T14:00:00Z',
    updatedAt: '2024-11-06T14:00:00Z',
    places: [
      {
        id: 'place-qixingtan',
        name: '七星潭海岸風景區',
        category: 'nature',
        lat: 24.0322,
        lng: 121.6294,
        dayNumber: 1,
        note: '優美的月牙灣與圓滾滾的青石礫灘，聽浪好去處',
        photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        address: '花蓮縣新城鄉海岸路'
      },
      {
        id: 'place-taroko',
        name: '太魯閣國家公園 (燕子口步道)',
        category: 'nature',
        lat: 24.1678,
        lng: 121.5544,
        dayNumber: 2,
        note: '鬼斧神工的立霧溪大理石峽谷與壺穴地貌',
        photoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        address: '花蓮縣秀林鄉富世村'
      },
      {
        id: 'place-bolang',
        name: '池上伯朗大道 & 天堂路',
        category: 'photo_spot',
        lat: 23.1192,
        lng: 121.2185,
        dayNumber: 3,
        note: '穿過金黃稻浪的筆直道路，金城武樹下品一杯茶',
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        rating: 5,
        address: '台東縣池上鄉錦新三號道路'
      },
      {
        id: 'place-dulan',
        name: '都蘭鼻 & 新東糖廠文化園區',
        category: 'culture',
        lat: 22.8762,
        lng: 121.2294,
        dayNumber: 4,
        note: '藝術家工坊、原住民木雕與俯瞰太平洋的斷崖岬角',
        photoUrl: 'https://images.unsplash.com/photo-1508248467877-aec1b08de376?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        address: '台東縣東河鄉都蘭村'
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2024-11-01',
        title: '抵達花蓮：七星潭的湛藍海風與東大門夜市',
        highlight: '在礫石灘堆石頭許願，感受太平洋的溫柔擁抱',
        mood: '🌊 放鬆放空',
        weather: '晴 24°C',
        journalText: '早晨從台北搭台鐵自強號出發，沿途看著龜山島與蘇花峭壁。抵達花蓮後租了機車直奔七星潭。海水是令人驚艷的青藍色，海浪捲起小圓石發出沙沙的療癒聲響。傍晚到東大門夜市吃烤玉米、檸檬汁與現炸原住民竹筒飯，滿滿幸福感。',
        stops: [
          {
            id: 'tw1-1',
            time: '14:00',
            placeName: '七星潭月牙灣',
            description: '踩在溫潤的礫石上，看浪花層層推湧而來。',
            photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            category: 'nature'
          },
          {
            id: 'tw1-2',
            time: '18:30',
            placeName: '東大門夜市與花蓮市區散策',
            description: '品嚐原住民石板烤肉、高粱酒香腸與檸檬汁。',
            category: 'food'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2024-11-02',
        title: '鬼斧神工：太魯閣峽谷與立霧溪大理石奇景',
        highlight: '走進燕子口峽谷步道，驚嘆於大自然的千萬年雕琢',
        mood: '⛰️ 震撼讚嘆',
        weather: '多雲時晴 22°C',
        journalText: '沿著中橫公路進入太魯閣國家公園。兩旁拔地而起的千仞大理石岩壁讓人屏息，立霧溪在峽谷底部奔騰切削出深邃的壺穴地形。穿上安全帽漫步燕子口步道，感受山風在峽谷間迴盪的呼嘯聲，深刻體會到台灣島嶼的地質生命力。',
        stops: [
          {
            id: 'tw2-1',
            time: '09:30',
            placeName: '太魯閣燕子口步道',
            description: '欣賞大理石峽谷、壺穴溶洞與靳綱橋下急流。',
            photoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
            category: 'nature'
          },
          {
            id: 'tw2-2',
            time: '14:00',
            placeName: '長春祠 & 清水斷崖遠眺',
            description: '蘇花公路最著名的懸崖海景，深藍色的太平洋浩瀚無垠。',
            photoUrl: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=600&q=80',
            category: 'sight'
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2024-11-03',
        title: '稻浪金黃：池上伯朗大道與大坡池晨光',
        highlight: '在無電線桿的遼闊稻海中騎著單車迎風前行',
        mood: '🌾 療癒舒暢',
        weather: '陽光明媚 25°C',
        journalText: '搭乘區間車來到台東池上。十一月的縱谷稻田正是收割前的金黃飽滿期。租了一台復古電動腳踏車，騎在沒有任何電線桿干擾的伯朗大道上，兩側金黃色的稻浪隨風起伏如金色的海。在大坡池邊吃著著名的池上木片便當，米飯Q彈香甜，整顆心都沉靜下來。',
        stops: [
          {
            id: 'tw3-1',
            time: '08:30',
            placeName: '池上伯朗大道 & 金城武樹',
            description: '在金黃稻海與中央山脈背景下騎單車徜徉。',
            photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            category: 'photo_spot'
          },
          {
            id: 'tw3-2',
            time: '12:30',
            placeName: '大坡池木片便當午餐',
            description: '品嚐池上在地冠軍米、柴火滷肉與炸排骨。',
            category: 'food'
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2024-11-04',
        title: '海風漫步：都蘭糖廠與太平洋斷崖巡禮',
        highlight: '坐在都蘭鼻看著海浪拍岸，喝著手沖咖啡告別東岸',
        mood: '☕ 依依不捨',
        weather: '晴朗微風 26°C',
        journalText: '旅程最後一天沿著台 11 線公路來到都蘭。走進新東糖廠廢棄廠房改建的文創園區，在充滿漂流木藝術的咖啡廳裡喝了一杯台東在地手沖咖啡。隨後走到伸入太平洋的都蘭鼻岬角，腳下是深邃的黑潮，耳邊是規律的浪濤聲。四天的旅行劃下完美句點，心中裝滿了山與海的溫柔。',
        stops: [
          {
            id: 'tw4-1',
            time: '10:30',
            placeName: '都蘭新東糖廠文創園區',
            description: '參觀原住民漂流木藝廊與手工藝工坊。',
            photoUrl: 'https://images.unsplash.com/photo-1508248467877-aec1b08de376?auto=format&fit=crop&w=600&q=80',
            category: 'culture'
          },
          {
            id: 'tw4-2',
            time: '14:00',
            placeName: '都蘭鼻太平洋岬角平台',
            description: '靜坐聽浪，在太平洋無死角海平面前深呼吸放空。',
            photoUrl: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=600&q=80',
            category: 'nature'
          }
        ]
      }
    ],
    photos: [
      {
        id: 'ph-tw-1',
        url: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80',
        caption: '台灣東海岸壯麗的太平洋斷崖與蔚藍海浪。',
        location: '清水斷崖 & 東海岸',
        dayNumber: 2,
        tags: ['海洋', '斷崖', '太平洋', '花蓮'],
        isCover: true,
        liked: true
      },
      {
        id: 'ph-tw-2',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: '七星潭清澈蔚藍的月牙灣浪潮與礫石灘。',
        location: '七星潭',
        dayNumber: 1,
        tags: ['海灘', '浪花', '自然'],
        liked: true
      },
      {
        id: 'ph-tw-3',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        caption: '池上伯朗大道無垠的金黃稻浪，單車追風的自由。',
        location: '台東池上',
        dayNumber: 3,
        tags: ['稻田', '單車', '鄉間小路', '黃金稻浪'],
        liked: true
      },
      {
        id: 'ph-tw-4',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
        caption: '太魯閣國家公園大理石峽谷與雲霧繚繞山巒。',
        location: '太魯閣國家公園',
        dayNumber: 2,
        tags: ['峽谷', '國家公園', '壯麗大理石'],
        liked: true
      },
      {
        id: 'ph-tw-5',
        url: 'https://images.unsplash.com/photo-1508248467877-aec1b08de376?auto=format&fit=crop&w=1200&q=80',
        caption: '都蘭文化聚落與山海間的慢活步調。',
        location: '台東都蘭',
        dayNumber: 4,
        tags: ['文創', '慢活', '太平洋']
      },
      {
        id: 'ph-tw-6',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: '清晨迎著海風迎接太平洋第一道璀璨日出金光。',
        location: '東海岸海線',
        dayNumber: 1,
        tags: ['日出', '晨曦', '海景'],
        liked: true
      }
    ]
  }
];
