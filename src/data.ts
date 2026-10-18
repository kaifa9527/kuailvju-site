export type CityId = 'pattaya' | 'sanya' | 'beihai' | 'xishuangbanna'
export type Term = 'day' | 'month' | 'quarter' | 'halfYear' | 'year'
export type Localized = { zh: string; en: string }

export type Listing = {
  id: string
  city: CityId
  region: string
  title: Localized
  description: Localized
  type: Localized
  gallery: { image: string; caption: Localized }[]
  guests: number
  bedrooms: number
  bathrooms: number
  beds: number
  area: number
  terms: Term[]
  management: 'operated' | 'leased'
  condition?: 'new' | 'standard' | 'refresh'
  mandateType?: 'exclusive' | 'nonexclusive'
  exchangeAuthorized: boolean
  exchangeOpen: boolean
  price: number
  currency: 'THB' | 'CNY'
  priceUnit: Term
  pinned: boolean
  publishedAt: string
  highlight: Localized
  features: Localized[]
  amenities: Localized[]
  selfCheckIn?: boolean
  verifiedReviews?: { rating: number; stayCompleted: true }[]
  /* A–F 六区（白皮书·详情页） */
  persona?: Localized[]          /* B 房东信任 · 人设标签 */
  ownerIntro?: Localized         /* B 房东信任 · 自荐 */
  goldenBadge?: boolean          /* B 房东信任 · 独家托管金标 */
  walkMin?: number               /* C 步行 10 分钟便利圈 */
  nearby?: Localized[]           /* C 步行便利清单 */
  wishlist?: Localized[]         /* D 交换偏好 · 愿望清单 */
  inspection?: { passed: boolean; date: string; note: Localized } /* E 品控验房记录 */
  demo: true
}

export const cities: { id: CityId; zh: string; en: string; regions: { id: string; zh: string; en: string }[] }[] = [
  { id: 'pattaya', zh: '芭提雅', en: 'Pattaya', regions: [{ id: 'jomtien', zh: '中天海滩', en: 'Jomtien' }, { id: 'north', zh: '北芭提雅', en: 'North Pattaya' }] },
  { id: 'sanya', zh: '三亚', en: 'Sanya', regions: [{ id: 'haitang', zh: '海棠湾', en: 'Haitang Bay' }, { id: 'yalo', zh: '亚龙湾', en: 'Yalong Bay' }] },
  { id: 'beihai', zh: '北海', en: 'Beihai', regions: [{ id: 'yintan', zh: '银滩', en: 'Silver Beach' }, { id: 'qiaogang', zh: '侨港', en: 'Qiaogang' }] },
  { id: 'xishuangbanna', zh: '西双版纳', en: 'Xishuangbanna', regions: [{ id: 'gaozhuang', zh: '告庄西双景', en: 'Gaozhuang' }, { id: 'jinghong', zh: '景洪市区', en: 'Jinghong' }] },
]

export const listings: Listing[] = [
  {
    id: 'pattaya-sea-view', city: 'pattaya', region: 'jomtien',
    title: { zh: '中天海景公寓', en: 'Jomtien Sea View Apartment' },
    description: { zh: '开阔窗景与安静起居空间。此处为页面视觉示意，非真实可订房源。', en: 'Open sea views and a quiet living space. Visual concept only; not a bookable property.' },
    type: { zh: '海景公寓', en: 'Sea view apartment' }, gallery: [
      { image: '/images/pattaya-concept.jpg', caption: { zh: '起居空间与海景 · 视觉示意', en: 'Living area and sea view · concept' } },
      { image: '/images/pattaya-bedroom.jpg', caption: { zh: '卧室与海景 · 视觉示意', en: 'Bedroom and sea view · concept' } },
    ],
    guests: 2, bedrooms: 1, bathrooms: 1, beds: 1, area: 72, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 2800, currency: 'THB', priceUnit: 'day', pinned: false, publishedAt: '2026-09-26', highlight: { zh: '开阔海景', en: 'Open sea view' }, demo: true,
    features: [{ zh: '面向海景的明亮起居', en: 'Bright living area facing the sea' }, { zh: '适合双人短住', en: 'A compact stay for two' }],
    selfCheckIn: true,
    amenities: [{ zh: '海景窗景', en: 'Sea-facing windows' }, { zh: '独立卧室', en: 'Separate bedroom' }, { zh: '厨房', en: 'Kitchen' }, { zh: '专用工作空间', en: 'Dedicated workspace' }, { zh: '电视', en: 'TV' }, { zh: '电梯', en: 'Lift' }, { zh: '洗衣机', en: 'Washer' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'sanya-garden-villa', city: 'sanya', region: 'haitang',
    title: { zh: '海棠湾庭院别墅', en: 'Haitang Bay Garden Villa' },
    description: { zh: '庭院、泳池与温润材质构成一处轻松的旅居空间。此处为页面视觉示意。', en: 'A calm retreat with a courtyard, pool and warm natural materials. Visual concept only.' },
    type: { zh: '庭院别墅', en: 'Garden villa' }, gallery: [
      { image: '/images/sanya-concept.jpg', caption: { zh: '庭院与泳池 · 视觉示意', en: 'Courtyard and pool · concept' } },
      { image: '/images/sanya-bedroom.jpg', caption: { zh: '卧室与庭院 · 视觉示意', en: 'Bedroom and courtyard · concept' } },
    ],
    guests: 6, bedrooms: 3, bathrooms: 3, beds: 3, area: 220, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 1680, currency: 'CNY', priceUnit: 'day', pinned: true, publishedAt: '2026-09-15', highlight: { zh: '独立庭院', en: 'Private courtyard' }, demo: true,
    features: [{ zh: '庭院与泳池连成开阔空间', en: 'Courtyard and pool open into one space' }, { zh: '三卧布局，适合结伴旅居', en: 'Three bedrooms for a shared stay' }],
    selfCheckIn: true,
    amenities: [{ zh: '庭院', en: 'Courtyard' }, { zh: '泳池', en: 'Pool' }, { zh: '厨房', en: 'Kitchen' }, { zh: '免费停车位', en: 'Free parking' }, { zh: '专用工作空间', en: 'Dedicated workspace' }, { zh: '电视', en: 'TV' }, { zh: '洗衣机', en: 'Washer' }, { zh: '独立卧室', en: 'Separate bedrooms' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'beihai-coastal-flat', city: 'beihai', region: 'yintan',
    title: { zh: '银滩海岸公寓', en: 'Silver Beach Coastal Flat' },
    description: { zh: '适合慢下来生活的明亮公寓。此处为页面视觉示意，租金仅用于交互展示。', en: 'A light-filled apartment for a slower stay. Visual concept and example price only.' },
    type: { zh: '海岸公寓', en: 'Coastal flat' }, gallery: [
      { image: '/images/beihai-concept.jpg', caption: { zh: '卧室与海景 · 视觉示意', en: 'Bedroom and sea view · concept' } },
      { image: '/images/beihai-living.jpg', caption: { zh: '起居与餐厅 · 视觉示意', en: 'Living and dining area · concept' } },
    ],
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 96, terms: ['halfYear', 'year'], management: 'leased', condition: 'standard', mandateType: 'exclusive', exchangeAuthorized: true, exchangeOpen: true,
    price: 3900, currency: 'CNY', priceUnit: 'month', pinned: true, publishedAt: '2026-09-20', highlight: { zh: '长租友好', en: 'Long-stay friendly' }, demo: true,
    features: [{ zh: '卧室与起居分区清晰', en: 'Separate rest and living areas' }, { zh: '按月计价，适合较长停留', en: 'Monthly pricing for longer stays' }],
    amenities: [{ zh: '海景窗景', en: 'Sea-facing windows' }, { zh: '起居室', en: 'Living room' }, { zh: '餐厅', en: 'Dining area' }, { zh: '空调', en: 'Air conditioning' }],
    persona: [{ zh: '海岸慢生活家', en: 'Coastal slow-living host' }, { zh: '园艺爱好者', en: 'Garden lover' }],
    ownerIntro: { zh: '这是我留在北海的第二个家，交给快旅居独家托管。我喜欢它每天被海风叫醒、阳台上有绿意的感觉。', en: 'My second home in Beihai, under exclusive care with Kuaijl. I love waking to the sea breeze with green on the balcony.' },
    goldenBadge: true, walkMin: 10,
    nearby: [{ zh: '银滩步行道 · 步行5分钟', en: 'Silver Beach boardwalk · 5 min walk' }, { zh: '侨港风情街 · 步行10分钟', en: 'Qiaogang food street · 10 min walk' }, { zh: '本地菜市场 · 步行8分钟', en: 'Local market · 8 min walk' }],
    wishlist: [{ zh: '三亚 · 海棠湾', en: 'Sanya · Haitang Bay' }, { zh: '芭提雅 · 中天海滩', en: 'Pattaya · Jomtien' }, { zh: '海边两居以上的家', en: 'A 2+ bedroom home by the sea' }],
    inspection: { passed: true, date: '2026-10-08', note: { zh: '水电、墙面、家具与家电核验通过，可交付', en: 'Utilities, walls, furniture and appliances verified and ready' } },
  },
  {
    id: 'pattaya-north-two-bedroom', city: 'pattaya', region: 'north',
    title: { zh: '北芭提雅云景公寓', en: 'North Pattaya Skyline Apartment' },
    description: { zh: '双卧室与开阔阳台相连，适合结伴短住。房源与图片仅为页面示意。', en: 'Two bedrooms open onto an airy balcony for a shared short stay. Concept home and imagery only.' },
    type: { zh: '双卧公寓', en: 'Two-bedroom apartment' },
    gallery: [{ image: '/images/pattaya-north-two-bedroom.jpg', caption: { zh: '客厅与城市景观 · 视觉示意', en: 'Living room and skyline · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 2, beds: 2, area: 102, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 3500, currency: 'THB', priceUnit: 'day', pinned: false, publishedAt: '2026-10-02', highlight: { zh: '城市与海景', en: 'City and sea views' }, demo: true,
    features: [{ zh: '双卧室与独立起居区', en: 'Two bedrooms and a separate living space' }, { zh: '面向城市的阳台', en: 'Balcony overlooking the city' }],
    selfCheckIn: true,
    amenities: [{ zh: '阳台', en: 'Balcony' }, { zh: '起居室', en: 'Living area' }, { zh: '厨房', en: 'Kitchen' }, { zh: '专用工作空间', en: 'Dedicated workspace' }, { zh: '电视', en: 'TV' }, { zh: '电梯', en: 'Lift' }, { zh: '洗衣机', en: 'Washer' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'pattaya-jomtien-pool-villa', city: 'pattaya', region: 'jomtien',
    title: { zh: '中天泳池庭院别墅', en: 'Jomtien Courtyard Pool Villa' },
    description: { zh: '起居区连接热带庭院与泳池，适合家人朋友同住。房源与图片仅为页面示意。', en: 'Living spaces meet a tropical courtyard and pool for a shared stay. Concept home and imagery only.' },
    type: { zh: '泳池别墅', en: 'Pool villa' },
    gallery: [{ image: '/images/pattaya-jomtien-pool-villa.jpg', caption: { zh: '起居区与泳池 · 视觉示意', en: 'Living area and pool · concept' } }],
    guests: 6, bedrooms: 3, bathrooms: 3, beds: 3, area: 235, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 8900, currency: 'THB', priceUnit: 'day', pinned: false, publishedAt: '2026-09-29', highlight: { zh: '独立泳池', en: 'Private pool' }, demo: true,
    features: [{ zh: '室内空间连通庭院', en: 'Living area opens to the courtyard' }, { zh: '适合多人短住', en: 'Room for a shared short stay' }],
    selfCheckIn: true,
    amenities: [{ zh: '独立泳池', en: 'Private pool' }, { zh: '庭院', en: 'Courtyard' }, { zh: '厨房', en: 'Kitchen' }, { zh: '免费停车位', en: 'Free parking' }, { zh: '专用工作空间', en: 'Dedicated workspace' }, { zh: '电视', en: 'TV' }, { zh: '洗衣机', en: 'Washer' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'sanya-yalong-apartment', city: 'sanya', region: 'yalo',
    title: { zh: '亚龙湾山海公寓', en: 'Yalong Bay Mountain & Sea Apartment' },
    description: { zh: '山海之间的双卧公寓，起居空间延伸至露台。房源与图片仅为页面示意。', en: 'A two-bedroom apartment between green hills and the sea. Concept home and imagery only.' },
    type: { zh: '露台公寓', en: 'Terrace apartment' },
    gallery: [{ image: '/images/sanya-yalong-apartment.jpg', caption: { zh: '起居室与露台 · 视觉示意', en: 'Living area and terrace · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 2, beds: 2, area: 118, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 980, currency: 'CNY', priceUnit: 'day', pinned: false, publishedAt: '2026-10-01', highlight: { zh: '山海露台', en: 'Hillside terrace' }, demo: true,
    features: [{ zh: '露台衔接客餐厅', en: 'Terrace extends the living area' }, { zh: '适合双人或家庭', en: 'Flexible stay for couples or families' }],
    selfCheckIn: true,
    amenities: [{ zh: '露台', en: 'Terrace' }, { zh: '起居室', en: 'Living area' }, { zh: '厨房', en: 'Kitchen' }, { zh: '专用工作空间', en: 'Dedicated workspace' }, { zh: '电视', en: 'TV' }, { zh: '电梯', en: 'Lift' }, { zh: '洗衣机', en: 'Washer' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'beihai-qiaogang-stay', city: 'beihai', region: 'qiaogang',
    title: { zh: '侨港海风公寓', en: 'Qiaogang Sea Breeze Apartment' },
    description: { zh: '明亮的海岸起居空间，适合轻松的短住节奏。房源与图片仅为页面示意。', en: 'A bright coastal living space for an easy short stay. Concept home and imagery only.' },
    type: { zh: '海景公寓', en: 'Sea view apartment' },
    gallery: [{ image: '/images/beihai-qiaogang-stay.jpg', caption: { zh: '客厅与海景 · 视觉示意', en: 'Living room and sea view · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 88, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 680, currency: 'CNY', priceUnit: 'day', pinned: false, publishedAt: '2026-09-30', highlight: { zh: '窗外海景', en: 'Coastal outlook' }, demo: true,
    features: [{ zh: '窗边阅读与休憩角落', en: 'A quiet corner by the window' }, { zh: '双卧短住布局', en: 'Two-bedroom short-stay layout' }],
    selfCheckIn: true,
    amenities: [{ zh: '海景窗景', en: 'Sea-facing windows' }, { zh: '起居室', en: 'Living area' }, { zh: '厨房', en: 'Kitchen' }, { zh: '专用工作空间', en: 'Dedicated workspace' }, { zh: '电视', en: 'TV' }, { zh: '电梯', en: 'Lift' }, { zh: '洗衣机', en: 'Washer' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'pattaya-north-monthly', city: 'pattaya', region: 'north',
    title: { zh: '北芭提雅林景长租公寓', en: 'North Pattaya Garden View Monthly Home' },
    description: { zh: '起居、用餐与卧室分区清楚，适合较长居住。房源与价格仅为页面示意。', en: 'A clear living, dining and sleeping layout for longer stays. Concept home and price only.' },
    type: { zh: '长租公寓', en: 'Monthly apartment' },
    gallery: [{ image: '/images/pattaya-north-monthly.jpg', caption: { zh: '客厅与阳台 · 视觉示意', en: 'Living room and balcony · concept' } }],
    guests: 2, bedrooms: 1, bathrooms: 1, beds: 1, area: 55, terms: ['halfYear', 'year'], management: 'leased', condition: 'standard', mandateType: 'nonexclusive', exchangeAuthorized: false, exchangeOpen: false,
    price: 18000, currency: 'THB', priceUnit: 'month', pinned: false, publishedAt: '2026-10-03', highlight: { zh: '日常生活便利', en: 'Easy everyday living' }, demo: true,
    features: [{ zh: '独立卧室与客厅', en: 'Separate bedroom and living room' }, { zh: '适合一至两人长住', en: 'Suited to one or two long-stay guests' }],
    amenities: [{ zh: '阳台', en: 'Balcony' }, { zh: '起居室', en: 'Living area' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
  {
    id: 'sanya-haitang-monthly', city: 'sanya', region: 'haitang',
    title: { zh: '海棠湾绿庭家庭公寓', en: 'Haitang Bay Garden Family Apartment' },
    description: { zh: '适合家庭长住的双卧公寓，窗外是绿意庭景。房源与价格仅为页面示意。', en: 'A two-bedroom family home with a green garden outlook. Concept home and price only.' },
    type: { zh: '家庭公寓', en: 'Family apartment' },
    gallery: [{ image: '/images/sanya-haitang-monthly.jpg', caption: { zh: '客厅与庭景 · 视觉示意', en: 'Living room and garden · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 89, terms: ['halfYear', 'year'], management: 'leased', condition: 'new', mandateType: 'exclusive', exchangeAuthorized: true, exchangeOpen: true,
    price: 6200, currency: 'CNY', priceUnit: 'month', pinned: false, publishedAt: '2026-10-02', highlight: { zh: '绿意庭景', en: 'Garden outlook' }, demo: true,
    features: [{ zh: '家庭友好的双卧布局', en: 'Two-bedroom family layout' }, { zh: '起居与用餐空间完整', en: 'Full living and dining areas' }],
    amenities: [{ zh: '庭景窗景', en: 'Garden outlook' }, { zh: '起居室', en: 'Living area' }, { zh: '空调', en: 'Air conditioning' }, { zh: '餐厅', en: 'Dining area' }],
    persona: [{ zh: '亲子旅居达人', en: 'Family-travel host' }, { zh: '园艺爱好者', en: 'Garden lover' }],
    ownerIntro: { zh: '这套房是我们一家三口度假用的，现在交给快旅居独家托管。窗外是整片绿庭，希望你也喜欢。', en: 'Our family holiday home, now under exclusive care with Kuaijl. A full garden outside the window — I hope you love it too.' },
    goldenBadge: true, walkMin: 10,
    nearby: [{ zh: '海棠湾免税城 · 步行10分钟', en: 'Haitang Bay duty-free mall · 10 min walk' }, { zh: '沿海步道 · 步行6分钟', en: 'Coastal promenade · 6 min walk' }, { zh: '社区超市 · 步行5分钟', en: 'Neighbourhood market · 5 min walk' }],
    wishlist: [{ zh: '芭提雅 · 泳池别墅', en: 'Pattaya · pool villa' }, { zh: '北海 · 银滩海岸', en: 'Beihai · Silver Beach' }, { zh: '带庭院的度假屋', en: 'A holiday home with a garden' }],
    inspection: { passed: true, date: '2026-10-05', note: { zh: '家电、墙面与儿童防护设施核验通过，可交付', en: 'Appliances, walls and child-safety features verified and ready' } },
  },
  {
    id: 'beihai-qiaogang-monthly', city: 'beihai', region: 'qiaogang',
    title: { zh: '侨港海岸长租公寓', en: 'Qiaogang Coastal Monthly Apartment' },
    description: { zh: '双卧、餐厅与明亮起居空间，为长住留出呼吸感。房源与价格仅为页面示意。', en: 'Two bedrooms, dining and a bright living space for a longer stay. Concept home and price only.' },
    type: { zh: '双卧公寓', en: 'Two-bedroom apartment' },
    gallery: [{ image: '/images/beihai-qiaogang-monthly.jpg', caption: { zh: '起居与餐厅 · 视觉示意', en: 'Living and dining area · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 93, terms: ['halfYear', 'year'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false,
    price: 3600, currency: 'CNY', priceUnit: 'month', pinned: false, publishedAt: '2026-10-01', highlight: { zh: '海岸慢生活', en: 'Easy coastal living' }, demo: true,
    features: [{ zh: '双卧与独立餐厅', en: 'Two bedrooms and a dining area' }, { zh: '适合家庭或结伴长住', en: 'Suited to family or shared long stays' }],
    amenities: [{ zh: '起居室', en: 'Living area' }, { zh: '餐厅', en: 'Dining area' }, { zh: '空调', en: 'Air conditioning' }, { zh: '海景窗景', en: 'Sea-facing windows' }],
  },
  {
    id: 'xishuangbanna-gaozhuang-monthly', city: 'xishuangbanna', region: 'gaozhuang',
    title: { zh: '告庄雨林度假公寓', en: 'Gaozhuang Rainforest Retreat' },
    description: { zh: '雨林环绕的傣式度假公寓，庭院泳池与木构起居空间相连。房源与图片仅为页面示意。', en: 'A Dai-style retreat wrapped in rainforest, with a courtyard pool beside a timber living space. Concept home and imagery only.' },
    type: { zh: '度假公寓', en: 'Retreat apartment' },
    gallery: [{ image: '/images/xishuangbanna-gaozhuang.jpg', caption: { zh: '庭院与泳池 · 视觉示意', en: 'Courtyard and pool · concept' } }, { image: '/images/xishuangbanna-bedroom.jpg', caption: { zh: '卧室与自然光 · 视觉示意', en: 'Bedroom in natural light · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 2, beds: 2, area: 96, terms: ['halfYear', 'year'], management: 'leased', condition: 'new', mandateType: 'exclusive', exchangeAuthorized: true, exchangeOpen: true,
    price: 1200, currency: 'CNY', priceUnit: 'month', pinned: false, publishedAt: '2026-10-10', highlight: { zh: '雨林庭院', en: 'Rainforest courtyard' }, demo: true,
    features: [{ zh: '庭院泳池连接起居空间', en: 'Courtyard pool opens to the living area' }, { zh: '按月长住，适合避寒候鸟', en: 'Monthly stays for winter sun-seekers' }],
    amenities: [{ zh: '庭院', en: 'Courtyard' }, { zh: '泳池', en: 'Pool' }, { zh: '起居室', en: 'Living area' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
    persona: [{ zh: '雨林候鸟', en: 'Rainforest traveller' }, { zh: '茶与慢生活', en: 'Tea & slow life' }],
    ownerIntro: { zh: '我们把版纳的家托付给快旅居独家托管。每天推开窗是雨林和茶山，想把这份安静也换给你。', en: 'Our Xishuangbanna home is under Kuaijl exclusive care. Every window opens to rainforest and tea hills — we would love to swap that calm with you.' },
    goldenBadge: true, walkMin: 10,
    nearby: [{ zh: '告庄星光夜市 · 步行8分钟', en: 'Gaozhuang night market · 8 min walk' }, { zh: '澜沧江步道 · 步行10分钟', en: 'Mekong promenade · 10 min walk' }, { zh: '本地茶室 · 步行5分钟', en: 'Local tea house · 5 min walk' }],
    wishlist: [{ zh: '芭提雅 · 泳池别墅', en: 'Pattaya · pool villa' }, { zh: '三亚 · 海棠湾', en: 'Sanya · Haitang Bay' }, { zh: '带庭院的海边之家', en: 'A seaside home with a garden' }],
    inspection: { passed: true, date: '2026-10-12', note: { zh: '防潮、木构与庭院设施核验通过，可交付', en: 'Moisture control, timber structure and courtyard verified and ready' } },
  },
  {
    id: 'xishuangbanna-jinghong-stay', city: 'xishuangbanna', region: 'jinghong',
    title: { zh: '景洪雨林民宿', en: 'Jinghong Rainforest Guesthouse' },
    description: { zh: '木质坡屋顶与自然光组成的轻松短住空间，窗外是热带绿植。房源与图片仅为页面示意。', en: 'A relaxed short stay under a timber roof in natural light, framed by tropical greenery. Concept home and imagery only.' },
    type: { zh: '雨林民宿', en: 'Rainforest guesthouse' },
    gallery: [{ image: '/images/xishuangbanna-bedroom.jpg', caption: { zh: '卧室与藤编细节 · 视觉示意', en: 'Bedroom and rattan details · concept' } }],
    guests: 2, bedrooms: 1, bathrooms: 1, beds: 1, area: 45, terms: ['day'], management: 'operated', exchangeAuthorized: false, exchangeOpen: false,
    price: 180, currency: 'CNY', priceUnit: 'day', pinned: false, publishedAt: '2026-10-12', highlight: { zh: '自然光与绿意', en: 'Natural light & greenery' }, demo: true,
    features: [{ zh: '藤编与木质细节', en: 'Rattan and timber details' }, { zh: '适合双人短住', en: 'A compact stay for two' }],
    selfCheckIn: true,
    amenities: [{ zh: '庭景窗景', en: 'Garden outlook' }, { zh: '厨房', en: 'Kitchen' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
  },
]
