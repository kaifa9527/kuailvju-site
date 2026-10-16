import { useState } from 'react'
import { cities, type CityId } from './data'
import { LineIcon } from './components/LineIcon'
import type { Language } from './lib/catalog'

type Experience = { id: string; city: CityId; title: Record<Language, string>; theme: Record<Language, string>; detail: Record<Language, string>; duration: Record<Language, string> }

const experiences: Experience[] = [
  { id: 'pattaya-coast', city: 'pattaya', title: { zh: '芭提雅海岸漫步', en: 'Pattaya coast walk' }, theme: { zh: '海岸 · 在地发现', en: 'Coast · local discovery' }, detail: { zh: '从海岸街区出发，用步行节奏认识一座城市。路线与集合点以最终活动安排为准。', en: 'Discover the coastal neighborhood on foot. The route and meeting point depend on the final activity plan.' }, duration: { zh: '约 2 小时', en: 'About 2 hours' } },
  { id: 'sanya-garden', city: 'sanya', title: { zh: '三亚自然漫游', en: 'Sanya nature walk' }, theme: { zh: '自然 · 慢游', en: 'Nature · slow travel' }, detail: { zh: '以轻松的步行方式感受当地自然景观。具体路线、活动强度与开放日期上线前核验。', en: 'A relaxed walk through local scenery. The route, pace and operating dates require verification before launch.' }, duration: { zh: '约 2 小时', en: 'About 2 hours' } },
  { id: 'beihai-neighborhood', city: 'beihai', title: { zh: '北海街区漫游', en: 'Beihai neighborhood walk' }, theme: { zh: '街区 · 生活方式', en: 'Neighborhood · local life' }, detail: { zh: '沿街区了解城市日常与海边生活。集合方式及具体内容以正式活动方案为准。', en: 'Explore everyday city life near the coast. Meeting details and content follow the final activity plan.' }, duration: { zh: '约 2 小时', en: 'About 2 hours' } },
]

export function RoamPage({ lang, id, query, embedded = false, hideSearch = false, previewLimit, groupCities = false }: { lang: Language; id?: string; query: string; embedded?: boolean; hideSearch?: boolean; previewLimit?: number; groupCities?: boolean }) {
  const searchParams = new URLSearchParams(query)
  const selectedCity = searchParams.get('city') || 'all'
  const selectedCategory = searchParams.get('category') || 'all'
  const selectedDate = searchParams.get('date') || ''
  const [city, setCity] = useState(selectedCity)
  const [date, setDate] = useState(selectedDate)
  const [guests, setGuests] = useState(1)
  const [receipt, setReceipt] = useState('')
  const item = experiences.find(entry => entry.id === id)
  const copy = lang === 'zh' ? {
    eyebrow: '04 / ROAM', title: '漫游当地，住得更深。', lead: '精选当地活动体验。从一处好房出发，走进一座城市。', city: '目的地', all: '全部城市', explore: '探索体验', example: '活动示意', duration: '参考时长', details: '查看体验', back: '返回漫游', date: '体验日期', guests: '参加人数', reserve: '提交站内测试预约', submitted: '测试预约已保存于当前浏览器', notice: '目前为活动与流程示意。暂无真实活动档期、价格或付款；正式开放前将核验体验内容与服务方。请勿填写真实个人资料。', nearby: '看看附近住处', find: '查看短租房', required: '请选择体验日期。',
  } : {
    eyebrow: '04 / ROAM', title: 'Stay longer. Roam deeper.', lead: 'Local experiences that bring you closer to each city.', city: 'Destination', all: 'All cities', explore: 'Explore experiences', example: 'Concept activity', duration: 'Approximate duration', details: 'View experience', back: 'Back to Roam', date: 'Experience date', guests: 'Participants', reserve: 'Submit browser-only test request', submitted: 'Test request saved in this browser', notice: 'Activities and flow are illustrative. There are no live dates, prices or payments yet. Content and providers require verification before launch. Do not enter personal details.', nearby: 'Find a place nearby', find: 'See short stays', required: 'Choose an experience date.',
  }
  const filter = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const p = new URLSearchParams(); if (city !== 'all') p.set('city', city); if (selectedCategory !== 'all') p.set('category', selectedCategory); if (selectedDate) p.set('date', selectedDate); window.location.hash = `#/roam${p.size ? `?${p}` : ''}` }
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const chosenDate = String(new FormData(event.currentTarget).get('date') || '')
    if (!item || !chosenDate) { setReceipt(copy.required); return }
    const code = `ROAM-${Date.now().toString(36).toUpperCase()}`
    const record = { code, experienceId: item.id, date: chosenDate, guests, createdAt: new Date().toISOString(), testOnly: true }
    try { localStorage.setItem('kuailvju-roam-test', JSON.stringify([record, ...JSON.parse(localStorage.getItem('kuailvju-roam-test') || '[]')])) } catch { /* Browser storage may be unavailable; the receipt still confirms this local test. */ }
    setReceipt(`${copy.submitted} · ${code}`)
  }
  return <div className={embedded ? "roam-page roam-page-inline" : "roam-page page-shell page-top"}>
    {!embedded && <div className="roam-intro"><p className="eyebrow">{copy.eyebrow}</p><h1>{item ? item.title[lang] : copy.title}</h1><p>{item ? item.detail[lang] : copy.lead}</p></div>}
    {!item && selectedCategory !== 'all' && <p className="roam-notice" role="status">{lang === 'zh' ? `“${{ attractions: '景点', tickets: '门票', experiences: '当地体验' }[selectedCategory as 'attractions' | 'tickets' | 'experiences'] || selectedCategory}”产品仍待核验上架，当前没有可购买的真实商品。` : 'Selected products are pending supplier verification. No live tickets or experiences are available for purchase.'}</p>}
    {item ? <>
      <a className="text-link roam-back" href="#/roam">← {copy.back}</a>
      <div className="roam-detail"><div className="roam-detail-story"><div className="roam-symbol"><LineIcon name="compass" size={62}/><span>{item.theme[lang]}</span></div><div className="roam-details-list"><div><LineIcon name="location"/>{cities.find(cityItem => cityItem.id === item.city)?.[lang]}</div><div><LineIcon name="calendar"/>{copy.duration}：{item.duration[lang]}</div></div><p className="roam-notice">{copy.notice}</p><a className="text-link" href={`#/stays?city=${item.city}`}>{copy.find} ↗</a></div>
      <form className="roam-request" onSubmit={submit}><span className="eyebrow">{copy.example} / TEST</span><label>{copy.date}<input name="date" type="date" value={date} min={new Date().toLocaleDateString("en-CA")} onChange={event => setDate(event.target.value)} required/></label><label>{copy.guests}<select value={guests} onChange={event => setGuests(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}</select></label><button className="button button-dark" type="submit">{copy.reserve} ↗</button>{receipt && <p className="roam-receipt" role="status">{receipt}</p>}</form></div>
    </> : <>{!hideSearch && <form className="roam-filter" onSubmit={filter}><label>{copy.city}<select value={city} onChange={event => setCity(event.target.value)}><option value="all">{copy.all}</option>{cities.map(entry => <option key={entry.id} value={entry.id}>{entry[lang]}</option>)}</select></label><button type="submit" className="button button-dark">{copy.explore} <LineIcon name="arrow" size={17}/></button></form>}<p className="roam-notice">{copy.notice}</p><div className={groupCities ? "roam-grid roam-grouped" : "roam-grid"}>{experiences.filter(entry => (selectedCity === 'all' || entry.city === selectedCity) && (selectedCategory === 'all' || selectedCategory === 'experiences')).slice(0, previewLimit).map((entry, index) => <a className="roam-card" href={`#/roam/${entry.id}`} key={entry.id}><span className="roam-card-top"><LineIcon name="compass" size={34}/><small>{String(index + 1).padStart(2, '0')} / {copy.example}</small></span><span className="roam-card-city">{cities.find(cityItem => cityItem.id === entry.city)?.[lang]}</span><strong>{entry.title[lang]}</strong><span className="roam-card-bottom"><span>{entry.theme[lang]} · {entry.duration[lang]}</span><LineIcon name="arrow" size={20}/></span></a>)}</div></>}
  </div>
}
