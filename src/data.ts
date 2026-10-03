export type CityId = 'pattaya' | 'sanya' | 'beihai'
export type Term = 'day' | 'month' | 'quarter' | 'year'

export type Listing = {
  id: string
  city: CityId
  region: string
  title: { zh: string; en: string }
  description: { zh: string; en: string }
  type: { zh: string; en: string }
  image: string
  guests: number
  bedrooms: number
  area: number
  terms: Term[]
  management: 'operated' | 'leased'
  exchangeAuthorized: boolean
  exchangeOpen: boolean
  price: number
  currency: 'THB' | 'CNY'
  priceUnit: Term
  highlight: { zh: string; en: string }
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
    type: { zh: '海景公寓', en: 'Sea view apartment' }, image: '/images/pattaya-concept.jpg',
    guests: 2, bedrooms: 1, area: 72, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
    price: 2800, currency: 'THB', priceUnit: 'day', highlight: { zh: '开阔海景', en: 'Open sea view' }, demo: true,
  },
  {
    id: 'sanya-garden-villa', city: 'sanya', region: 'haitang',
    title: { zh: '海棠湾庭院别墅', en: 'Haitang Bay Garden Villa' },
    description: { zh: '庭院、泳池与温润材质构成一处轻松的旅居空间。此处为页面视觉示意。', en: 'A calm retreat with a courtyard, pool and warm natural materials. Visual concept only.' },
    type: { zh: '庭院别墅', en: 'Garden villa' }, image: '/images/sanya-concept.jpg',
    guests: 6, bedrooms: 3, area: 220, terms: ['day'], management: 'operated', exchangeAuthorized: true, exchangeOpen: true,
    price: 1680, currency: 'CNY', priceUnit: 'day', highlight: { zh: '独立庭院', en: 'Private courtyard' }, demo: true,
  },
  {
    id: 'beihai-coastal-flat', city: 'beihai', region: 'yintan',
    title: { zh: '银滩海岸公寓', en: 'Silver Beach Coastal Flat' },
    description: { zh: '适合慢下来生活的明亮公寓。此处为页面视觉示意，租金仅用于交互展示。', en: 'A light-filled apartment for a slower stay. Visual concept and example price only.' },
    type: { zh: '海岸公寓', en: 'Coastal flat' }, image: '/images/beihai-concept.jpg',
    guests: 4, bedrooms: 2, area: 96, terms: ['month', 'quarter', 'year'], management: 'leased', exchangeAuthorized: false, exchangeOpen: false,
    price: 3900, currency: 'CNY', priceUnit: 'month', highlight: { zh: '长租友好', en: 'Long-stay friendly' }, demo: true,
  },
]
