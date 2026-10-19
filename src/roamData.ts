import type { CityId, Localized } from './data'
import type { IconName } from './components/LineIcon'

export type RoamCategory = 'ticket' | 'activity' | 'hike' | 'custom'

export type ItineraryItem = { time: string; title: Localized; detail: Localized }
export type HostInfo = { name: string; role: Localized; rating: number; reviews: number; years: Localized }
export type Requirement = { icon: IconName; title: Localized; detail: Localized }
export type RoamReview = { name: string; from: Localized; rating: number; date: string; text: Localized }

export type RoamProduct = {
  id: string
  category: RoamCategory
  city: CityId
  title: Localized
  hook: Localized
  summary: Localized
  facts: Localized[]
  rating: number
  reviewCount: number
  galleryCount: number
  pricePending: true
  description: Localized
  itinerary?: ItineraryItem[]
  host?: HostInfo
  includes?: Localized[]
  requirements?: Requirement[]
  relatedStayId?: string
  relatedStayNote?: Localized
  reviews?: RoamReview[]
  inquiryKind?: 'yacht' | 'golf' | 'car'
}

export type RoamGuide = {
  id: string
  city: CityId
  tag: Localized
  title: Localized
  excerpt: Localized
  author: string
  minutes: number
}

/* ───────────────────── 门票 ───────────────────── */
const tickets: RoamProduct[] = [
  {
    id: 'truth-sanctuary', category: 'ticket', city: 'pattaya',
    title: { zh: '真理寺门票', en: 'Sanctuary of Truth Ticket' },
    hook: { zh: '在海边的全木雕奇迹里，听斧凿与潮汐', en: 'An all-wood temple by the sea' },
    summary: { zh: '纯手工木雕建筑，含讲解与入场', en: 'Hand-carved timber temple, entry & guide' },
    facts: [{ zh: '建议停留 2 小时', en: 'About 2 hours' }, { zh: '中文/英文/泰文讲解', en: 'ZH/EN/TH guide' }, { zh: '可选免排队入场', en: 'Skip-line optional' }],
    rating: 4.8, reviewCount: 2140, galleryCount: 8, pricePending: true,
    description: {
      zh: '真理寺（Sanctuary of Truth）是临海而建的全木结构建筑，以木雕讲述东方哲学与神话。建议跟随讲解了解木雕与建筑细节，最佳光线在清晨与傍晚。',
      en: 'The Sanctuary of Truth is an all-wood structure by the sea, carving Eastern philosophy and mythology into timber. A guided visit explains the craftsmanship; soft light falls best in the morning and late afternoon.',
    },
    itinerary: [
      { time: '09:30', title: { zh: '入口检票', en: 'Ticket check' }, detail: { zh: '凭确认码于主入口检票，领取讲解设备', en: 'Check in with the confirmation code and get the audio guide' } },
      { time: '10:00', title: { zh: '主殿讲解', en: 'Main hall tour' }, detail: { zh: '跟随讲解了解四大木雕主题与结构', en: 'Guided walk through the four carving themes' } },
      { time: '11:00', title: { zh: '临海平台', en: 'Seaside terrace' }, detail: { zh: '自由拍照，观看传统工艺展示', en: 'Free time and craft demonstrations' } },
    ],
    host: { name: 'Somchai', role: { zh: '驻场讲解负责人', en: 'Lead on-site guide' }, rating: 4.9, reviews: 1320, years: { zh: '11 年在地讲解', en: '11 years guiding' } },
    includes: [{ zh: '真理寺入场门票', en: 'Admission ticket' }, { zh: '多语种讲解', en: 'Multilingual guide' }, { zh: '传统工艺展示', en: 'Craft demonstration' }],
    requirements: [
      { icon: 'shield', title: { zh: '着装与礼仪', en: 'Dress code' }, detail: { zh: '请着遮肩过膝衣物，现场可租借', en: 'Cover shoulders and knees; wraps available' } },
      { icon: 'calendar', title: { zh: '场次与确认', en: 'Sessions' }, detail: { zh: '选定时段后 24 小时内确认', en: 'Confirmed within 24 hours of the chosen time' } },
      { icon: 'location', title: { zh: '集合点', en: 'Meeting point' }, detail: { zh: '真理寺主入口检票处', en: 'Main entrance ticket gate' } },
      { icon: 'utility', title: { zh: '退改', en: 'Cancellation' }, detail: { zh: '出行前规定时限内可改期', en: 'Reschedule within the stated window' } },
    ],
    relatedStayId: 'pattaya-north-monthly',
    relatedStayNote: { zh: '距真理寺约 15 分钟车程', en: 'About 15 minutes by car' },
    reviews: [
      { name: 'Lin', from: { zh: '来自成都', en: 'Chengdu' }, rating: 5, date: '2026-09', text: { zh: '木雕细节非常震撼，讲解把建筑背后的故事讲清楚了。', en: 'Stunning carvings and the guide brought the stories to life.' } },
    ],
  },
  {
    id: 'nanshan', category: 'ticket', city: 'sanya',
    title: { zh: '南山文化旅游区门票', en: 'Nanshan Cultural Park Ticket' },
    hook: { zh: '海上观音与南山的静谧', en: 'The sea goddess and quiet hills' },
    summary: { zh: '含景区门票，可加素斋与游览车', en: 'Admission, add vegetarian lunch & tram' },
    facts: [{ zh: '建议停留 3 至 4 小时', en: '3–4 hours' }, { zh: '可加园内游览车', en: 'Tram optional' }, { zh: '素斋需另购', en: 'Vegetarian lunch extra' }],
    rating: 4.7, reviewCount: 5380, galleryCount: 8, pricePending: true,
    description: {
      zh: '南山文化旅游区以海上观音、南山寺为核心，园区较大。带老人或小孩建议搭配游览车，正午前后可用素斋。',
      en: 'Nanshan Cultural Park centres on the sea goddess statue and Nanshan Temple. The grounds are large; a tram suits families, and vegetarian lunch is available around noon.',
    },
    host: { name: 'Mei', role: { zh: '景区对接顾问', en: 'Park liaison' }, rating: 4.8, reviews: 2640, years: { zh: '8 年景区服务', en: '8 years on-site' } },
    includes: [{ zh: '南山景区门票', en: 'Admission ticket' }, { zh: '园区基础指引', en: 'Basic park guidance' }],
    requirements: [
      { icon: 'guests', title: { zh: '适合人群', en: 'Good for' }, detail: { zh: '家庭与长者友好，园区步行较多', en: 'Family and senior friendly, lots of walking' } },
      { icon: 'calendar', title: { zh: '确认时间', en: 'Confirmation' }, detail: { zh: '选定日期后确认', en: 'Confirmed on the chosen date' } },
      { icon: 'location', title: { zh: '入园点', en: 'Entry' }, detail: { zh: '南山景区主入口', en: 'Main entrance' } },
      { icon: 'utility', title: { zh: '退改', en: 'Cancellation' }, detail: { zh: '按景区退改规则执行', en: 'Per park rules' } },
    ],
    relatedStayId: 'sanya-haitang-monthly',
    relatedStayNote: { zh: '海棠湾至南山约 30 分钟车程', en: 'Haitang Bay to Nanshan, ~30 min' },
  },
  {
    id: 'weizhou-island', category: 'ticket', city: 'beihai',
    title: { zh: '涠洲岛门票（含上岛费）', en: 'Weizhou Island Entry' },
    hook: { zh: '火山岛与灯塔', en: 'Volcanic island and lighthouse' },
    summary: { zh: '上岛门票，船票需另购', en: 'Island entry; ferry separate' },
    facts: [{ zh: '建议停留 1 至 2 天', en: '1–2 days' }, { zh: '船票需另购', en: 'Ferry separate' }, { zh: '受天气影响', en: 'Weather dependent' }],
    rating: 4.6, reviewCount: 3920, galleryCount: 6, pricePending: true,
    description: {
      zh: '涠洲岛是火山喷发形成的岛屿，上岛需购门票，往返船票另购。行程受天气与潮汐影响较大，建议预留弹性时间。',
      en: 'Weizhou is a volcanic island. Entry requires a ticket and the round-trip ferry is separate. Schedules depend on weather and tides, so keep plans flexible.',
    },
    host: { name: 'A-hai', role: { zh: '岛上接待', en: 'Island host' }, rating: 4.7, reviews: 1540, years: { zh: '9 年岛上服务', en: '9 years on the island' } },
    includes: [{ zh: '涠洲岛上岛门票', en: 'Island entry ticket' }],
    requirements: [
      { icon: 'location', title: { zh: '上岛方式', en: 'Getting there' }, detail: { zh: '需乘指定客轮，船票另购', en: 'Scheduled ferry, ticket separate' } },
      { icon: 'utility', title: { zh: '天气与停航', en: 'Weather' }, detail: { zh: '恶劣天气可能停航，可改期', en: 'Sailings may pause; reschedule available' } },
      { icon: 'calendar', title: { zh: '确认', en: 'Confirmation' }, detail: { zh: '下单后确认上岛信息', en: 'Confirmed after booking' } },
    ],
    relatedStayId: 'beihai-coastal-flat',
    relatedStayNote: { zh: '北海出发乘船前往', en: 'Ferry from Beihai' },
  },
  {
    id: 'wild-elephant-valley', category: 'ticket', city: 'xishuangbanna',
    title: { zh: '野象谷门票', en: 'Wild Elephant Valley Ticket' },
    hook: { zh: '雨林栈道与野生象群', en: 'Rainforest walk & wild elephants' },
    summary: { zh: '含景区门票与雨林栈道', en: 'Admission & canopy walk' },
    facts: [{ zh: '建议停留 2 至 3 小时', en: '2–3 hours' }, { zh: '雨林栈道', en: 'Canopy walk' }, { zh: '野象出没看运气', en: 'Sightings not guaranteed' }],
    rating: 4.5, reviewCount: 4180, galleryCount: 6, pricePending: true,
    description: {
      zh: '野象谷以热带雨林栈道和野生亚洲象观测闻名，野象出没属自然现象，不保证看到。清晨与傍晚动物更活跃。',
      en: 'Wild Elephant Valley is known for its rainforest walk and wild Asian elephants; sightings are natural and never guaranteed. Animals are more active at dawn and dusk.',
    },
    host: { name: 'Yu Dao', role: { zh: '自然导览', en: 'Nature guide' }, rating: 4.8, reviews: 980, years: { zh: '7 年雨林导览', en: '7 years in the rainforest' } },
    includes: [{ zh: '野象谷景区门票', en: 'Admission ticket' }, { zh: '雨林栈道', en: 'Canopy walk' }],
    requirements: [
      { icon: 'shield', title: { zh: '安全提示', en: 'Safety' }, detail: { zh: '请沿栈道游览，勿投食', en: 'Stay on the walkway; do not feed' } },
      { icon: 'calendar', title: { zh: '确认', en: 'Confirmation' }, detail: { zh: '选定日期后确认', en: 'Confirmed on the chosen date' } },
      { icon: 'location', title: { zh: '集合点', en: 'Meeting point' }, detail: { zh: '野象谷游客中心', en: 'Visitor centre' } },
    ],
    relatedStayId: 'xishuangbanna-gaozhuang-monthly',
    relatedStayNote: { zh: '告庄出发约 40 分钟车程', en: 'Gaozhuang, ~40 min' },
  },
]

/* ───────────────────── 活动 ───────────────────── */
const activities: RoamProduct[] = [
  {
    id: 'muay-thai', category: 'activity', city: 'pattaya',
    title: { zh: '泰拳体验课', en: 'Muay Thai Intro Class' },
    hook: { zh: '跟教练打出第一拳', en: 'Throw your first strike with a trainer' },
    summary: { zh: '零基础体验，含装备与教练', en: 'Beginner-friendly, gear & trainer included' },
    facts: [{ zh: '时长 90 分钟', en: '90 minutes' }, { zh: '2 人可成团', en: 'Min 2' }, { zh: '含绑手与护具', en: 'Wraps & guards included' }],
    rating: 4.9, reviewCount: 1260, galleryCount: 6, pricePending: true,
    description: {
      zh: '从热身、基本站姿与拳法开始，在教练一对一指导下完成组合动作。零基础可参加，强度可按个人情况调整。',
      en: 'Start with warm-up, stance and basic strikes, then finish a combination with one-on-one coaching. Beginners are welcome and the intensity is adjustable.',
    },
    itinerary: [
      { time: '09:00', title: { zh: '热身与绑手', en: 'Warm-up & wraps' }, detail: { zh: '15 分钟热身，学习绑手', en: '15-min warm-up and hand wrapping' } },
      { time: '09:20', title: { zh: '基本技术', en: 'Basics' }, detail: { zh: '拳法、肘膝与步法', en: 'Punches, elbows, knees and footwork' } },
      { time: '09:50', title: { zh: '组合与放松', en: 'Combos & cool-down' }, detail: { zh: '完成组合动作，拉伸放松', en: 'Pad combinations and stretching' } },
    ],
    host: { name: 'Kru Den', role: { zh: '持证泰拳教练', en: 'Certified Muay Thai trainer' }, rating: 5, reviews: 860, years: { zh: '13 年执教', en: '13 years coaching' } },
    includes: [{ zh: '教练指导', en: 'Trainer coaching' }, { zh: '绑手与护具', en: 'Wraps & guards' }, { zh: '毛巾与饮用水', en: 'Towel & water' }],
    requirements: [
      { icon: 'guests', title: { zh: '适合人群', en: 'Good for' }, detail: { zh: '12 岁以上，零基础可参加', en: '12+, no experience needed' } },
      { icon: 'calendar', title: { zh: '时段', en: 'Sessions' }, detail: { zh: '上午/下午多时段', en: 'Morning & afternoon slots' } },
      { icon: 'utility', title: { zh: '成团', en: 'Group size' }, detail: { zh: '2 人成团，最多 8 人', en: 'Min 2, max 8' } },
    ],
    relatedStayId: 'pattaya-sea-view',
    relatedStayNote: { zh: '场馆位于市区，打车可达', en: 'City gym, short ride away' },
  },
  {
    id: 'houhai-surf', category: 'activity', city: 'sanya',
    title: { zh: '后海冲浪教学', en: 'Houhai Surf Lesson' },
    hook: { zh: '在后海的浪上站起来', en: 'Catch your first wave at Houhai' },
    summary: { zh: '含板、教练与拍照', en: 'Board, coach & photos included' },
    facts: [{ zh: '时长 2 小时', en: '2 hours' }, { zh: '1 对 2 教学', en: '1 coach to 2' }, { zh: '含冲浪板与防晒服', en: 'Board & rash guard' }],
    rating: 4.8, reviewCount: 1740, galleryCount: 6, pricePending: true,
    description: {
      zh: '在后海沙滩从划水、起板开始，教练全程跟随。课程含冲浪板与防晒服，浪况以当天海况为准。',
      en: 'At Houhai beach, start with paddling and the pop-up while a coach stays with you. The board and rash guard are included; waves follow daily conditions.',
    },
    itinerary: [
      { time: '07:30', title: { zh: '岸上教学', en: 'Land briefing' }, detail: { zh: '安全、划水与起板动作', en: 'Safety, paddling and pop-up' } },
      { time: '08:00', title: { zh: '下水练习', en: 'In the water' }, detail: { zh: '教练带浪，逐步起板', en: 'Coached waves and pop-ups' } },
      { time: '09:15', title: { zh: '放松与回看', en: 'Cool-down & review' }, detail: { zh: '回看动作照片，拉伸', en: 'Review photos and stretch' } },
    ],
    host: { name: 'A-kai', role: { zh: '冲浪教练', en: 'Surf coach' }, rating: 4.9, reviews: 1120, years: { zh: '6 年冲浪教学', en: '6 years coaching' } },
    includes: [{ zh: '冲浪板', en: 'Surfboard' }, { zh: '防晒服', en: 'Rash guard' }, { zh: '教练与拍照', en: 'Coaching & photos' }],
    requirements: [
      { icon: 'guests', title: { zh: '适合人群', en: 'Good for' }, detail: { zh: '8 岁以上，会游泳更佳', en: '8+, swimming helps' } },
      { icon: 'utility', title: { zh: '海况', en: 'Conditions' }, detail: { zh: '浪况不佳可改期', en: 'Reschedule in poor surf' } },
      { icon: 'location', title: { zh: '集合点', en: 'Meeting point' }, detail: { zh: '后海冲浪俱乐部', en: 'Houhai surf club' } },
    ],
    relatedStayId: 'sanya-yalong-apartment',
    relatedStayNote: { zh: '亚龙湾至后海约 25 分钟', en: 'Yalong to Houhai, ~25 min' },
  },
  {
    id: 'silver-beach-sup', category: 'activity', city: 'beihai',
    title: { zh: '银滩桨板体验', en: 'Silver Beach SUP Experience' },
    hook: { zh: '在平静海面划一块板', en: 'Paddle calm waters on a board' },
    summary: { zh: '含板、救生衣与教练', en: 'Board, vest & coach included' },
    facts: [{ zh: '时长 90 分钟', en: '90 minutes' }, { zh: '含救生衣', en: 'Life vest included' }, { zh: '风浪小可亲子', en: 'Calm water, family friendly' }],
    rating: 4.7, reviewCount: 680, galleryCount: 5, pricePending: true,
    description: {
      zh: '银滩近岸风浪较小，适合桨板入门与亲子体验。教练讲解平衡与划行，全程在浅水区进行。',
      en: 'The calm near-shore water at Silver Beach suits SUP beginners and families. A coach covers balance and paddling in shallow water.',
    },
    host: { name: 'Xiao Bei', role: { zh: '水上活动教练', en: 'Water sports coach' }, rating: 4.8, reviews: 420, years: { zh: '5 年执教', en: '5 years coaching' } },
    includes: [{ zh: '桨板与桨', en: 'Board & paddle' }, { zh: '救生衣', en: 'Life vest' }, { zh: '教练指导', en: 'Coaching' }],
    requirements: [
      { icon: 'guests', title: { zh: '适合人群', en: 'Good for' }, detail: { zh: '6 岁以上可亲子', en: '6+, family friendly' } },
      { icon: 'utility', title: { zh: '海况', en: 'Conditions' }, detail: { zh: '风浪大时改期', en: 'Reschedule in high surf' } },
    ],
    relatedStayId: 'beihai-qiaogang-stay',
    relatedStayNote: { zh: '侨港至银滩很近', en: 'Close to Silver Beach' },
  },
  {
    id: 'dai-cooking', category: 'activity', city: 'xishuangbanna',
    title: { zh: '傣家料理课堂', en: 'Dai Cooking Class' },
    hook: { zh: '逛菜市场，做一桌傣味', en: 'Shop the market, cook a Dai meal' },
    summary: { zh: '含市场采买与三道傣味', en: 'Market visit & three dishes' },
    facts: [{ zh: '时长 3 小时', en: '3 hours' }, { zh: '含市场采买', en: 'Market visit' }, { zh: '可素食定制', en: 'Vegetarian options' }],
    rating: 4.9, reviewCount: 540, galleryCount: 6, pricePending: true,
    description: {
      zh: '先逛本地菜市场认识香料与食材，再在傣家竹楼学习三道经典傣味，最后一起享用。',
      en: 'Begin at the local market to learn the herbs, then cook three classic Dai dishes in a bamboo house and share the meal.',
    },
    itinerary: [
      { time: '10:00', title: { zh: '市场采买', en: 'Market visit' }, detail: { zh: '认识香茅草、傣味调料', en: 'Learn lemongrass and Dai spices' } },
      { time: '11:00', title: { zh: '动手烹饪', en: 'Cooking' }, detail: { zh: '制作三道傣味', en: 'Cook three dishes' } },
      { time: '12:30', title: { zh: '共享午餐', en: 'Lunch' }, detail: { zh: '一起享用成果', en: 'Share the meal' } },
    ],
    host: { name: '玉应', role: { zh: '傣家料理老师', en: 'Dai cuisine teacher' }, rating: 5, reviews: 360, years: { zh: '20 年家传手艺', en: '20 years of family recipes' } },
    includes: [{ zh: '食材与采买', en: 'Ingredients & market' }, { zh: '菜谱与围裙', en: 'Recipes & apron' }, { zh: '午餐', en: 'Lunch' }],
    requirements: [
      { icon: 'guests', title: { zh: '饮食限制', en: 'Diet needs' }, detail: { zh: '可提前告知素食/过敏', en: 'Tell us allergies in advance' } },
      { icon: 'calendar', title: { zh: '时段', en: 'Sessions' }, detail: { zh: '上午场次为主', en: 'Morning sessions' } },
    ],
    relatedStayId: 'xishuangbanna-jinghong-stay',
    relatedStayNote: { zh: '位于景洪市区，方便到达', en: 'In central Jinghong' },
  },
]

/* ───────────────────── 徒步 ───────────────────── */
const hikes: RoamProduct[] = [
  {
    id: 'koh-larn-coast', category: 'hike', city: 'pattaya',
    title: { zh: '格兰岛海岸徒步', en: 'Koh Larn Coastal Hike' },
    hook: { zh: '从一个海湾走到另一个海湾', en: 'Walk from one bay to the next' },
    summary: { zh: '领队制，含往返船票与午餐', en: 'Guided, ferry & lunch included' },
    facts: [{ zh: '全程约 6 小时', en: 'About 6 hours' }, { zh: '含往返船票', en: 'Round-trip ferry' }, { zh: '难度初级', en: 'Easy level' }],
    rating: 4.8, reviewCount: 720, galleryCount: 7, pricePending: true,
    description: {
      zh: '乘船前往格兰岛，沿海岸步道连接多个海湾，中午在海边简餐。行程以步行为主，需做好防晒。',
      en: 'Take the ferry to Koh Larn and link the bays along coastal trails, with a simple seaside lunch. The day is mostly walking; bring sun protection.',
    },
    itinerary: [
      { time: '08:30', title: { zh: '摆渡上岛', en: 'Ferry over' }, detail: { zh: '从巴厘海码头乘船', en: 'Ferry from Bali Hai pier' } },
      { time: '09:30', title: { zh: '海岸徒步', en: 'Coastal trail' }, detail: { zh: '连接两个海湾与观景台', en: 'Link two bays and viewpoints' } },
      { time: '12:00', title: { zh: '海边午餐', en: 'Beach lunch' }, detail: { zh: '简餐与自由活动', en: 'Simple lunch and free time' } },
      { time: '15:00', title: { zh: '返程', en: 'Return' }, detail: { zh: '乘船返回芭提雅', en: 'Ferry back to Pattaya' } },
    ],
    host: { name: 'Kru Nat', role: { zh: '户外领队', en: 'Outdoor guide' }, rating: 4.9, reviews: 480, years: { zh: '8 年带队', en: '8 years guiding' } },
    includes: [{ zh: '往返船票', en: 'Round-trip ferry' }, { zh: '领队服务', en: 'Guide' }, { zh: '海边午餐', en: 'Beach lunch' }],
    requirements: [
      { icon: 'guests', title: { zh: '体力要求', en: 'Fitness' }, detail: { zh: '初级，需连续步行', en: 'Easy, sustained walking' } },
      { icon: 'parking', title: { zh: '装备', en: 'Gear' }, detail: { zh: '防晒、帽子与饮用水', en: 'Sun protection and water' } },
      { icon: 'utility', title: { zh: '天气', en: 'Weather' }, detail: { zh: '雨天可改期', en: 'Reschedule in rain' } },
    ],
    relatedStayId: 'pattaya-north-two-bedroom',
    relatedStayNote: { zh: '码头位于市区', en: 'Pier in the city' },
  },
  {
    id: 'sun-bay-coast', category: 'hike', city: 'sanya',
    title: { zh: '太阳湾海岸徒步', en: 'Sun Bay Coastal Hike' },
    hook: { zh: '山海之间的海岸线', en: 'A coastline between hills and sea' },
    summary: { zh: '领队制，含补给与接送', en: 'Guided, supplies & transfer included' },
    facts: [{ zh: '全程约 4 小时', en: 'About 4 hours' }, { zh: '难度初级到中级', en: 'Easy–moderate' }, { zh: '含补给', en: 'Snacks included' }],
    rating: 4.7, reviewCount: 560, galleryCount: 6, pricePending: true,
    description: {
      zh: '沿太阳湾海岸线徒步，经过礁石与海湾。部分路段需注意脚下，建议穿防滑鞋。',
      en: 'Hike the Sun Bay coastline past reefs and coves. Watch your footing on rocky sections; grippy shoes are recommended.',
    },
    host: { name: 'A-wen', role: { zh: '户外领队', en: 'Outdoor guide' }, rating: 4.8, reviews: 340, years: { zh: '7 年带队', en: '7 years guiding' } },
    includes: [{ zh: '领队与路线规划', en: 'Guide & route' }, { zh: '水与补给', en: 'Water & snacks' }, { zh: '往返接送', en: 'Transfers' }],
    requirements: [
      { icon: 'parking', title: { zh: '装备', en: 'Gear' }, detail: { zh: '防滑鞋、防晒', en: 'Grippy shoes and sun protection' } },
      { icon: 'guests', title: { zh: '体力', en: 'Fitness' }, detail: { zh: '初级到中级', en: 'Easy to moderate' } },
    ],
    relatedStayId: 'sanya-yalong-apartment',
    relatedStayNote: { zh: '亚龙湾出发较近', en: 'Close to Yalong Bay' },
  },
  {
    id: 'weizhou-volcano', category: 'hike', city: 'beihai',
    title: { zh: '涠洲岛火山海岸穿越', en: 'Weizhou Volcanic Coast Hike' },
    hook: { zh: '走过火山岩与海蚀崖', en: 'Across volcanic rock and sea cliffs' },
    summary: { zh: '领队制，含上岛与路线', en: 'Guided, entry & route included' },
    facts: [{ zh: '全程约 5 小时', en: 'About 5 hours' }, { zh: '难度中级', en: 'Moderate' }, { zh: '含地质讲解', en: 'Geology commentary' }],
    rating: 4.8, reviewCount: 640, galleryCount: 7, pricePending: true,
    description: {
      zh: '沿涠洲岛火山岩海岸穿越，经过海蚀崖、灯塔与滴水丹屏。领队讲解火山地质与潮汐。',
      en: 'Cross Weizhou’s volcanic coast past sea cliffs, the lighthouse and Dripwater Crag. The guide explains the volcano geology and tides.',
    },
    itinerary: [
      { time: '08:00', title: { zh: '上岛集合', en: 'Meet on island' }, detail: { zh: '游客中心出发', en: 'Start at the visitor centre' } },
      { time: '08:40', title: { zh: '火山岩海岸', en: 'Volcanic coast' }, detail: { zh: '经过海蚀崖与灯塔', en: 'Past sea cliffs and lighthouse' } },
      { time: '11:30', title: { zh: '滴水丹屏', en: 'Dripwater Crag' }, detail: { zh: '沿海观景与返程', en: 'Coastal views and return' } },
    ],
    host: { name: 'A-hai', role: { zh: '岛上领队', en: 'Island guide' }, rating: 4.9, reviews: 420, years: { zh: '9 年带队', en: '9 years guiding' } },
    includes: [{ zh: '上岛门票', en: 'Island entry' }, { zh: '领队与讲解', en: 'Guide & commentary' }],
    requirements: [
      { icon: 'parking', title: { zh: '装备', en: 'Gear' }, detail: { zh: '防滑鞋、防晒、帽子', en: 'Grippy shoes, sun hat' } },
      { icon: 'guests', title: { zh: '体力', en: 'Fitness' }, detail: { zh: '中级，含礁石路段', en: 'Moderate, rocky sections' } },
      { icon: 'utility', title: { zh: '潮汐', en: 'Tides' }, detail: { zh: '路线按潮汐时间调整', en: 'Route adjusted for tides' } },
    ],
    relatedStayId: 'beihai-coastal-flat',
    relatedStayNote: { zh: '需先乘船到岛', en: 'Ferry to the island first' },
  },
  {
    id: 'rainforest-hike', category: 'hike', city: 'xishuangbanna',
    title: { zh: '热带雨林徒步', en: 'Tropical Rainforest Hike' },
    hook: { zh: '走进板根与绞杀的雨林', en: 'Into the rainforest of roots and vines' },
    summary: { zh: '领队制，含装备与自然讲解', en: 'Guided, gear & nature commentary' },
    facts: [{ zh: '全程约 4 小时', en: 'About 4 hours' }, { zh: '难度中级', en: 'Moderate' }, { zh: '含自然讲解', en: 'Nature commentary' }],
    rating: 4.9, reviewCount: 880, galleryCount: 8, pricePending: true,
    description: {
      zh: '走进热带雨林，认识大板根、绞杀榕与热带植物。雨林潮湿，建议穿防滑鞋并带替换衣物。',
      en: 'Enter the rainforest to learn about giant roots, strangler figs and tropical plants. It is humid and muddy; wear grippy shoes and bring a change of clothes.',
    },
    itinerary: [
      { time: '08:30', title: { zh: '雨林入口', en: 'Trailhead' }, detail: { zh: '安全讲解与装备', en: 'Safety briefing and gear' } },
      { time: '09:00', title: { zh: '板根与绞杀', en: 'Roots & vines' }, detail: { zh: '认识雨林植物与生态', en: 'Learn rainforest ecology' } },
      { time: '11:30', title: { zh: '溪边休整', en: 'Stream break' }, detail: { zh: '休整并返程', en: 'Rest and return' } },
    ],
    host: { name: 'Yu Dao', role: { zh: '自然领队', en: 'Nature guide' }, rating: 5, reviews: 620, years: { zh: '10 年雨林带队', en: '10 years in the rainforest' } },
    includes: [{ zh: '领队与自然讲解', en: 'Guide & commentary' }, { zh: '防滑装备', en: 'Gear' }, { zh: '饮用水', en: 'Water' }],
    requirements: [
      { icon: 'parking', title: { zh: '装备', en: 'Gear' }, detail: { zh: '防滑鞋、替换衣物、防蚊', en: 'Grippy shoes, change of clothes' } },
      { icon: 'guests', title: { zh: '体力', en: 'Fitness' }, detail: { zh: '中级，含湿滑路段', en: 'Moderate, slippery sections' } },
      { icon: 'shield', title: { zh: '安全', en: 'Safety' }, detail: { zh: '请跟紧领队，勿离队', en: 'Stay with the guide' } },
    ],
    relatedStayId: 'xishuangbanna-gaozhuang-monthly',
    relatedStayNote: { zh: '告庄出发约 40 分钟', en: 'Gaozhuang, ~40 min' },
  },
]

/* ───────────────────── 定制 ───────────────────── */
const customs: RoamProduct[] = [
  {
    id: 'yacht-pattaya', category: 'custom', city: 'pattaya', inquiryKind: 'yacht',
    title: { zh: '格兰岛游艇包船与海钓', en: 'Koh Larn Yacht & Fishing Charter' },
    hook: { zh: '向光而行，把一片海包下来', en: 'Take a private stretch of sea' },
    summary: { zh: '包艇询价，含船长与船员', en: 'Private charter, crew included' },
    facts: [{ zh: '半日或整日', en: 'Half or full day' }, { zh: '含船长与船员', en: 'Captain & crew' }, { zh: '可含海钓与餐食', en: 'Fishing & catering options' }],
    rating: 4.9, reviewCount: 320, galleryCount: 8, pricePending: true,
    description: {
      zh: '从芭提雅出海前往格兰岛，包艇按需求定制海钓、浮潜与海上餐食。提交需求后由设计师出 1v1 方案与报价。',
      en: 'Sail from Pattaya to Koh Larn with a private yacht, customizing fishing, snorkelling and on-board dining. Submit your request for a one-to-one plan and quote.',
    },
    host: { name: 'Captain Ek', role: { zh: '资深船长', en: 'Senior captain' }, rating: 5, reviews: 280, years: { zh: '16 年航海经验', en: '16 years at sea' } },
    includes: [{ zh: '船长与船员', en: 'Captain & crew' }, { zh: '燃油与基础装备', en: 'Fuel & basic gear' }, { zh: '保险', en: 'Insurance' }],
    requirements: [
      { icon: 'calendar', title: { zh: '档期', en: 'Availability' }, detail: { zh: '需提前预约锁船', en: 'Book ahead to secure the boat' } },
      { icon: 'utility', title: { zh: '天气', en: 'Weather' }, detail: { zh: '气象联动，可改期', en: 'Weather-linked, reschedule available' } },
    ],
    relatedStayId: 'pattaya-jomtien-pool-villa',
    relatedStayNote: { zh: '可搭配中天泳池别墅', en: 'Pair with a Jomtien pool villa' },
    reviews: [
      { name: 'Wang', from: { zh: '来自北京', en: 'Beijing' }, rating: 5, date: '2026-08', text: { zh: '船很新，海钓和浮潜都安排得好，孩子玩得很开心。', en: 'New boat and great fishing and snorkelling; the kids loved it.' } },
    ],
  },
  {
    id: 'yacht-sanya', category: 'custom', city: 'sanya', inquiryKind: 'yacht',
    title: { zh: '太阳湾游艇出海定制', en: 'Sun Bay Yacht Charter' },
    hook: { zh: '私属蓝湾与海上时光', en: 'A private bay and time on the water' },
    summary: { zh: '包艇/拼艇询价', en: 'Private or shared charter' },
    facts: [{ zh: '包艇或拼艇', en: 'Private or shared' }, { zh: '双师陪驾', en: 'Two crew' }, { zh: '含尾波浮潜', en: 'Wakeboard & snorkel' }],
    rating: 4.8, reviewCount: 460, galleryCount: 8, pricePending: true,
    description: {
      zh: '在三亚太阳湾出海，按需求定制海钓、尾波滑水与浮潜。提交需求后 2 小时内出方案。',
      en: 'Sail at Sanya’s Sun Bay, customizing fishing, wakeboarding and snorkelling. A plan follows within two hours of your request.',
    },
    host: { name: 'Captain Zhou', role: { zh: '职业船长', en: 'Professional captain' }, rating: 4.9, reviews: 340, years: { zh: '12 年航海', en: '12 years at sea' } },
    includes: [{ zh: '船长与船员', en: 'Captain & crew' }, { zh: '装备与保险', en: 'Gear & insurance' }],
    requirements: [
      { icon: 'calendar', title: { zh: '档期', en: 'Availability' }, detail: { zh: '提前预约', en: 'Book ahead' } },
      { icon: 'utility', title: { zh: '天气', en: 'Weather' }, detail: { zh: '气象联动改期', en: 'Weather-linked changes' } },
    ],
    relatedStayId: 'sanya-garden-villa',
    relatedStayNote: { zh: '可搭配海棠湾庭院别墅', en: 'Pair with a Haitang Bay villa' },
  },
  {
    id: 'golf-custom', category: 'custom', city: 'xishuangbanna', inquiryKind: 'golf',
    title: { zh: '高尔夫定制与预订', en: 'Golf Booking & Custom Day' },
    hook: { zh: '球场、球童与一站式安排', en: 'Course, caddies and one-stop planning' },
    summary: { zh: '果岭费/球童/包车可定制', en: 'Greens, caddies & transfer options' },
    facts: [{ zh: '含果岭费与球童', en: 'Greens & caddies' }, { zh: '可包车与装备', en: 'Transfer & gear' }, { zh: '18 洞或 9 洞', en: '18 or 9 holes' }],
    rating: 4.7, reviewCount: 240, galleryCount: 6, pricePending: true,
    description: {
      zh: '按水平与时间定制高尔夫一日，含果岭费、球童、球车与往返安排。提交需求后出方案。',
      en: 'Customize a golf day around your level and schedule, including greens, caddies, carts and transfers. A plan follows your request.',
    },
    host: { name: 'He Ge', role: { zh: '高尔夫顾问', en: 'Golf consultant' }, rating: 4.8, reviews: 160, years: { zh: '10 年高尔夫服务', en: '10 years in golf' } },
    includes: [{ zh: '果岭费与球童', en: 'Greens & caddies' }, { zh: '球车与安排', en: 'Cart & planning' }],
    requirements: [
      { icon: 'calendar', title: { zh: '开球时间', en: 'Tee time' }, detail: { zh: '提前预约开球时段', en: 'Book tee times ahead' } },
      { icon: 'guests', title: { zh: '水平', en: 'Level' }, detail: { zh: '新手可配教练', en: 'Coaching for beginners' } },
    ],
    relatedStayId: 'xishuangbanna-gaozhuang-monthly',
    relatedStayNote: { zh: '可搭配告庄度假公寓', en: 'Pair with a Gaozhuang apartment' },
  },
]

/* ───────────────────── 在地手记（UGC） ───────────────────── */
const guides: RoamGuide[] = [
  { id: 'g-rainforest', city: 'xishuangbanna', tag: { zh: '徒步装备', en: 'Hike gear' }, title: { zh: '雨林徒步，怎么穿、带什么', en: 'What to wear in the rainforest' }, excerpt: { zh: '防滑鞋、替换衣物和防蚊是关键；雨林里少穿纯棉。', en: 'Grippy shoes, a change of clothes and repellent matter; avoid cotton.' }, author: 'Yu Dao', minutes: 4 },
  { id: 'g-weizhou-tide', city: 'beihai', tag: { zh: '潮汐与日出', en: 'Tides & sunrise' }, title: { zh: '涠洲岛看日出与赶海的时间', en: 'Sunrise and tide times on Weizhou' }, excerpt: { zh: '日出和潮汐每天不同，按日期查好再安排。', en: 'Sunrise and tides shift daily; check by date.' }, author: 'A-hai', minutes: 3 },
  { id: 'g-houhai-surf', city: 'sanya', tag: { zh: '新手冲浪', en: 'Beginner surf' }, title: { zh: '第一次冲浪，选上午还是下午', en: 'Morning or afternoon for your first surf' }, excerpt: { zh: '清晨浪小、人少，更适合新手第一节课。', en: 'Mornings bring smaller waves and fewer people for beginners.' }, author: 'A-kai', minutes: 3 },
  { id: 'g-truth-photo', city: 'pattaya', tag: { zh: '讲解与拍照', en: 'Guide & photos' }, title: { zh: '真理寺怎么逛不赶、出片', en: 'How to enjoy and photograph the Sanctuary' }, excerpt: { zh: '清晨光线柔、人也少，讲解帮你看懂木雕。', en: 'Soft morning light and fewer crowds; a guide helps.' }, author: 'Somchai', minutes: 4 },
]

export const categoryLabels: Record<RoamCategory, Localized> = {
  ticket: { zh: '门票', en: 'Tickets' },
  activity: { zh: '活动', en: 'Activities' },
  hike: { zh: '徒步', en: 'Hikes' },
  custom: { zh: '定制', en: 'Custom' },
}

export const roamProducts: RoamProduct[] = [...tickets, ...activities, ...hikes, ...customs]
export const roamGuides: RoamGuide[] = guides
