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
  highlight: Localized
  features: Localized[]
  amenities: Localized[]
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
    price: 2800, currency: 'THB', priceUnit: 'day', highlight: { zh: '开阔海景', en: 'Open sea view' }, demo: true,
    features: [{ zh: '面向海景的明亮起居', en: 'Bright living area facing the sea' }, { zh: '适合双人短住', en: 'A compact stay for two' }],
    amenities: [{ zh: '海景窗景', en: 'Sea-facing windows' }, { zh: '独立卧室', en: 'Separate bedroom' }, { zh: '空调', en: 'Air conditioning' }, { zh: '无线网络', en: 'Wi-Fi' }],
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
    price: 1680, currency: 'CNY', priceUnit: 'day', highlight: { zh: '独立庭院', en: 'Private courtyard' }, demo: true,
    features: [{ zh: '庭院与泳池连成开阔空间', en: 'Courtyard and pool open into one space' }, { zh: '三卧布局，适合结伴旅居', en: 'Three bedrooms for a shared stay' }],
    amenities: [{ zh: '庭院', en: 'Courtyard' }, { zh: '泳池', en: 'Pool' }, { zh: '独立卧室', en: 'Separate bedrooms' }, { zh: '空调', en: 'Air conditioning' }],
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
    price: 3900, currency: 'CNY', priceUnit: 'month', highlight: { zh: '长租友好', en: 'Long-stay friendly' }, demo: true,
    features: [{ zh: '卧室与起居分区清晰', en: 'Separate rest and living areas' }, { zh: '按月计价，适合较长停留', en: 'Monthly pricing for longer stays' }],
    amenities: [{ zh: '海景窗景', en: 'Sea-facing windows' }, { zh: '起居室', en: 'Living room' }, { zh: '餐厅', en: 'Dining area' }, { zh: '空调', en: 'Air conditioning' }],
  },
]
