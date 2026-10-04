export type CityId = 'pattaya' | 'sanya' | 'beihai'
export type Term = 'day' | 'month' | 'quarter' | 'year'
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
  demo: true
}

export const cities: { id: CityId; zh: string; en: string; regions: { id: string; zh: string; en: string }[] }[] = [
  { id: 'pattaya', zh: '芭提雅', en: 'Pattaya', regions: [{ id: 'jomtien', zh: '中天海滩', en: 'Jomtien' }, { id: 'north', zh: '北芭提雅', en: 'North Pattaya' }] },
  { id: 'sanya', zh: '三亚', en: 'Sanya', regions: [{ id: 'haitang', zh: '海棠湾', en: 'Haitang Bay' }, { id: 'yalo', zh: '亚龙湾', en: 'Yalong Bay' }] },
  { id: 'beihai', zh: '北海', en: 'Beihai', regions: [{ id: 'yintan', zh: '银滩', en: 'Silver Beach' }, { id: 'qiaogang', zh: '侨港', en: 'Qiaogang' }] },
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
    guests: 2, bedrooms: 1, bathrooms: 1, beds: 1, area: 72, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
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
    guests: 6, bedrooms: 3, bathrooms: 3, beds: 3, area: 220, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
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
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 96, terms: ['month', 'quarter', 'year'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false,
    price: 3900, currency: 'CNY', priceUnit: 'month', pinned: true, publishedAt: '2026-09-20', highlight: { zh: '长租友好', en: 'Long-stay friendly' }, demo: true,
    features: [{ zh: '卧室与起居分区清晰', en: 'Separate rest and living areas' }, { zh: '按月计价，适合较长停留', en: 'Monthly pricing for longer stays' }],
    amenities: [{ zh: '海景窗景', en: 'Sea-facing windows' }, { zh: '起居室', en: 'Living room' }, { zh: '餐厅', en: 'Dining area' }, { zh: '空调', en: 'Air conditioning' }],
  },
  {
    id: 'pattaya-north-two-bedroom', city: 'pattaya', region: 'north',
    title: { zh: '北芭提雅云景公寓', en: 'North Pattaya Skyline Apartment' },
    description: { zh: '双卧室与开阔阳台相连，适合结伴短住。房源与图片仅为页面示意。', en: 'Two bedrooms open onto an airy balcony for a shared short stay. Concept home and imagery only.' },
    type: { zh: '双卧公寓', en: 'Two-bedroom apartment' },
    gallery: [{ image: '/images/pattaya-north-two-bedroom.jpg', caption: { zh: '客厅与城市景观 · 视觉示意', en: 'Living room and skyline · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 2, beds: 2, area: 102, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
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
    guests: 6, bedrooms: 3, bathrooms: 3, beds: 3, area: 235, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
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
    guests: 4, bedrooms: 2, bathrooms: 2, beds: 2, area: 118, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
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
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 88, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
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
    guests: 2, bedrooms: 1, bathrooms: 1, beds: 1, area: 55, terms: ['month', 'quarter', 'year'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false,
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
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 89, terms: ['month', 'quarter', 'year'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false,
    price: 6200, currency: 'CNY', priceUnit: 'month', pinned: false, publishedAt: '2026-10-02', highlight: { zh: '绿意庭景', en: 'Garden outlook' }, demo: true,
    features: [{ zh: '家庭友好的双卧布局', en: 'Two-bedroom family layout' }, { zh: '起居与用餐空间完整', en: 'Full living and dining areas' }],
    amenities: [{ zh: '庭景窗景', en: 'Garden outlook' }, { zh: '起居室', en: 'Living area' }, { zh: '空调', en: 'Air conditioning' }, { zh: '餐厅', en: 'Dining area' }],
  },
  {
    id: 'beihai-qiaogang-monthly', city: 'beihai', region: 'qiaogang',
    title: { zh: '侨港海岸长租公寓', en: 'Qiaogang Coastal Monthly Apartment' },
    description: { zh: '双卧、餐厅与明亮起居空间，为长住留出呼吸感。房源与价格仅为页面示意。', en: 'Two bedrooms, dining and a bright living space for a longer stay. Concept home and price only.' },
    type: { zh: '双卧公寓', en: 'Two-bedroom apartment' },
    gallery: [{ image: '/images/beihai-qiaogang-monthly.jpg', caption: { zh: '起居与餐厅 · 视觉示意', en: 'Living and dining area · concept' } }],
    guests: 4, bedrooms: 2, bathrooms: 1, beds: 2, area: 93, terms: ['month', 'quarter', 'year'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false,
    price: 3600, currency: 'CNY', priceUnit: 'month', pinned: false, publishedAt: '2026-10-01', highlight: { zh: '海岸慢生活', en: 'Easy coastal living' }, demo: true,
    features: [{ zh: '双卧与独立餐厅', en: 'Two bedrooms and a dining area' }, { zh: '适合家庭或结伴长住', en: 'Suited to family or shared long stays' }],
    amenities: [{ zh: '起居室', en: 'Living area' }, { zh: '餐厅', en: 'Dining area' }, { zh: '空调', en: 'Air conditioning' }, { zh: '海景窗景', en: 'Sea-facing windows' }],
  },
]
