import { useEffect, useRef, useState } from 'react'
import { cities, listings, type Listing } from './data'
import { canExchange, formatPrice, sortFeaturedListings, type Language } from './lib/catalog'
import { demoAvailable, demoBlockedDates, emptyExchangeSearch, exchangeQuery, filterExchangeHomes, localDate, parseExchangeSearch, type AmenityFilter, type ExchangeSearch } from './lib/exchangeDiscovery'
import { readExchangeDrafts, validRange, type ExchangeDraft } from './lib/testWorkflow'
import { LineIcon, amenityIcon } from './components/LineIcon'
import { ExchangeGallery } from './components/ExchangeGallery'
import { guestRecommendation } from './lib/guestRecommendation'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const words = {
  zh: {
    title: '一房托管，旅居世界。', intro: '长租房与民宿房业主明确授权后，房源进入旅居置换展示；双方匿名确认，平台核验后履约。', staysTitle: '住进喜欢的风景。', staysIntro: '这里是委托经营的民宿房源。选择目的地、日期与人数，按晚寻找适合的旅居空间。', staysResults: '精选民宿房',
    destination: '目的地', area: '区域', anyCity: '全部城市', anyArea: '全部区域', start: '入住', end: '退房', guests: '人数', search: '查找房源', filters: '更多筛选', clear: '清除',
    type: '房源类型', any: '不限', apartment: '公寓', villa: '别墅', bedrooms: '卧室', beds: '床位', baths: '卫生间', amenity: '设施', pool: '泳池', parking: '免费停车', wifi: '无线网络', climate: '空调', view: '海景', apply: '查看房源',
    results: '可住的房源', sort: '精选优先 · 最新补充', demo: '示意房源', nights: '晚', sleeps: '可住', day: '晚', sample: '展示房源、图片、价格及档期均为交互测试数据；正式预订须核验真实房态与报价。',
    empty: '暂时没有符合条件的房源', tryAgain: '调整日期、人数或筛选条件再试。', from: '返回搜索结果', home: '首页', overview: '房源概览', highlights: '房源亮点', amenities: '提供的设施', location: '房源所在区域', locationNote: '为保护业主隐私，准确地址将在正式入住安排中提供。',
    availability: '选择入住日期', availabilityNote: '先点入住、再点退房。灰色日期为演示不可选；正式档期以平台核验为准。', blocked: '测试不可选', rules: '入住与房屋规则', rulesNote: '入住退房时间、宠物、吸烟、访客与安静时段由平台核验具体房源后逐项告知，申请确认前可查看完整条款。',
    rental: '按日租住', exchange: '业主旅居置换', rentalLead: '按日计价，提交入住意向后由平台核验房态与最终报价。', exchangeLead: '长租房或民宿房业主明确授权加入置换池后可申请；双方匿名确认，平台核验后生效。',
    daily: '示意每晚房价', total: '示意住宿费', cleaning: '入住前后保洁服务', deposit: '可退入住押金', utilities: '水电', metered: '实际抄表结算', equivalent: '置换住宿费', review: '待对等审核',
    noCharge: '在此页面不收款。', reserve: '提交短住意向', request: '发起置换申请', dateError: '请选择有效的入住和退房日期。', unavailable: '所选日期含演示不可选档期，请换一个时段。', exchangeNoDate: '可先查看房源；申请时填写双方各自的入住日期。',
    eligibility: '置换资格', eligibilityText: '申请房源须由业主明确授权加入置换池；长租房与民宿房均可登记，平台还须核验房源使用权和档期。', timing: '双方档期', timingText: 'A 与 B 可在不同日期入住；业主仅能接受、拒绝或提议日期，不可私下交换联系方式。',
    fees: '费用透明', feesText: '对等房源免住宿费；若价值不等，平台核算补差额并由双方再次确认。双方每次入住另付 ¥600 入住前后两次保洁费；长租房押金按入住房源月租金，民宿房押金按房况核定 ¥3,000–6,000，水电据实结算；芭提雅收等值泰铢。入住期间日常保洁由住客自行维护，额外保洁另计。',
    rentalNote: '租赁与置换是两条独立路径。置换不保证即时确认，平台须核对合同授权、房态、对等价值与异期履约。', related: '继续看看', photos: '张示意图片', test: '站内流程测试', topup: '可能补差额', topupPending: '平台报价 · 双方确认',
  },
  en: {
    title: 'One home entrusted. A world to stay in.', intro: 'Long-stay and operated homes enter the exchange section only with the owner’s express consent. Owners decide anonymously; the platform verifies delivery.', staysTitle: 'Stay somewhere worth remembering.', staysIntro: 'Operated homes for nightly stays. Choose a destination, dates and guests to find your place.', staysResults: 'Short-stay homes',
    destination: 'Destination', area: 'Area', anyCity: 'All cities', anyArea: 'All areas', start: 'Check in', end: 'Check out', guests: 'Guests', search: 'Find homes', filters: 'More filters', clear: 'Clear',
    type: 'Property type', any: 'Any', apartment: 'Apartment', villa: 'Villa', bedrooms: 'Bedrooms', beds: 'Beds', baths: 'Bathrooms', amenity: 'Amenities', pool: 'Pool', parking: 'Free parking', wifi: 'Wi-Fi', climate: 'Air conditioning', view: 'Sea view', apply: 'Show homes',
    results: 'Homes to stay in', sort: 'Featured first · newest next', demo: 'Concept home', nights: 'nights', sleeps: 'Sleeps', day: 'night', sample: 'Homes, images, prices and calendar dates are interactive sample data. Live stays require availability and price verification.',
    empty: 'No homes match these choices', tryAgain: 'Try other dates, guest count or filters.', from: 'Back to results', home: 'Home', overview: 'The space', highlights: 'What stands out', amenities: 'What this place offers', location: 'Where you will be', locationNote: 'The exact address is shared in the final stay arrangements to protect owner privacy.',
    availability: 'Choose your dates', availabilityNote: 'Select check-in, then checkout. Muted dates are demo unavailable days. Live dates require platform verification.', blocked: 'Demo unavailable', rules: 'Stay and house rules', rulesNote: 'Check-in/out, pets, smoking, visitors and quiet hours are confirmed for each real home. Full terms are shown before a request is confirmed.',
    rental: 'Nightly stay', exchange: 'Owner exchange', rentalLead: 'Sample nightly price. The platform checks availability and final price after you send an enquiry.', exchangeLead: 'Owners of long-stay or operated homes may opt in. Both owners decide anonymously, then the platform verifies.',
    daily: 'Sample nightly rate', total: 'Sample accommodation', cleaning: 'Before/after cleaning', deposit: 'Refundable deposit', utilities: 'Utilities', metered: 'Metered use', equivalent: 'Exchange accommodation', review: 'Subject to equal-value review',
    noCharge: 'No payment is taken here.', reserve: 'Send stay enquiry', request: 'Request exchange', dateError: 'Choose a valid check-in and checkout date.', unavailable: 'These dates include a demo unavailable day. Choose another stay.', exchangeNoDate: 'You can view the home now and select both owners’ separate dates when requesting.',
    eligibility: 'Who can exchange', eligibilityText: 'The applicant must expressly opt the home into the exchange pool. Long-stay and operated homes may register, subject to authority and availability checks.', timing: 'Separate dates', timingText: 'A and B may travel at different times. Owners only accept, decline or suggest dates; they cannot exchange private contact details.',
    fees: 'Clear costs', feesText: 'Equal-value homes waive accommodation rent. If values differ, the platform quotes a top-up for both owners to approve. Each stay has a ¥600 pre/post-stay cleaning fee; the deposit equals the target long-stay home’s monthly rent or ¥3,000–6,000 for a short-stay home. Utilities are metered; Pattaya charges the THB equivalent. Guests handle daily cleaning; extra cleaning is charged separately.',
    rentalNote: 'Nightly stays and owner exchanges are separate paths. Exchanges are never instant; the platform checks authority, availability, value and performance at separate dates.', related: 'Explore more homes', photos: 'concept photos', test: 'Interactive test', topup: 'Possible top-up', topupPending: 'Platform quote · both approve',
  },
}

function location(home: Listing, lang: Language) {
  const city = cities.find(item => item.id === home.city)!
  return `${city[lang]} · ${city.regions.find(item => item.id === home.region)?.[lang] || ''}`
}

function nightly(home: Listing, lang: Language) {
  return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: home.currency, maximumFractionDigits: 0 }).format(home.price)
}

function DraftCard({ draft, lang }: { draft: ExchangeDraft; lang: Language }) {
  const city = cities.find(item => item.id === draft.city)
  const region = city?.regions.find(item => item.id === draft.region)
  return <article className="exchange-draft-card"><div className="exchange-draft-art"><LineIcon name="window" size={48}/><span>{lang === 'zh' ? '待核验' : 'Under review'}</span></div><div className="exchange-draft-body"><small>{city?.[lang]} · {region?.[lang]}</small><h3>{draft.propertyType === 'villa' ? lang === 'zh' ? '别墅' : 'Villa' : lang === 'zh' ? '公寓' : 'Apartment'} · {draft.area} m²</h3><p>{draft.management === 'leasing' ? lang === 'zh' ? '委托租赁' : 'Long-stay management' : lang === 'zh' ? '委托经营' : 'Operated stay'} · {draft.bedrooms} {lang === 'zh' ? '间卧室' : 'bedrooms'}</p><p>{lang === 'zh' ? '业主已授权加入置换展示。平台核验房源与权益后，才可申请入住。' : 'Owner authorized display. Stay requests open after the platform verifies the home and owner rights.'}</p></div></article>
}

function stayNights(start: string, end: string) { return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000) }

function ExchangeCard({ home, lang, query, kind }: { home: Listing; lang: Language; query: string; kind: 'exchange' | 'stays' }) {
  const t = words[lang]
  return <a className="listing-card exchange-discovery-card" href={`#/${kind}/home/${home.id}${query}`}>
    <div className="listing-image"><img src={asset(home.gallery[0].image)} alt={home.gallery[0].caption[lang]} loading="lazy"/><span className="image-label">{t.demo}</span>{home.pinned && <span className="listing-pinned">{lang === 'zh' ? '精选' : 'Featured'}</span>}</div>
    <div className="listing-content"><div className="listing-eyebrow">{location(home, lang)} <span>/ {home.type[lang]}</span></div><h3>{home.title[lang]}</h3><p>{home.highlight[lang]} · {t.sleeps} {home.guests} · {home.bedrooms} {t.bedrooms.toLowerCase()}</p><div className="listing-bottom"><div><small>{home.management === 'leased' ? (lang === 'zh' ? '长租基础月租 · 置换需核验' : 'Base monthly rent · exchange subject to review') : t.daily}</small><strong>{home.management === 'leased' ? formatPrice(home, lang) : `${nightly(home, lang)} / ${t.day}`}</strong></div><span className="circle-arrow" aria-hidden="true">↗</span></div></div>
  </a>
}

function SearchForm({ lang, initial, kind }: { lang: Language; initial: ExchangeSearch; kind: 'exchange' | 'stays' }) {
  const t = words[lang]
  const [draft, setDraft] = useState(initial)
  const [active, setActive] = useState<'where' | 'when' | 'who' | 'filters' | null>(null)
  const [error, setError] = useState('')
  const finder = useRef<HTMLDivElement>(null)
  const serialized = exchangeQuery(initial)
  useEffect(() => { setDraft(initial) }, [serialized])
  useEffect(() => {
    if (!active) return
    const close = (event: PointerEvent) => { if (!finder.current?.contains(event.target as Node)) setActive(null) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setActive(null) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape) }
  }, [active])
  const city = cities.find(item => item.id === draft.city)
  const update = (part: Partial<ExchangeSearch>) => setDraft(previous => ({ ...previous, ...part }))
  const commit = (requested: ExchangeSearch) => {
    if (requested.start || requested.end) {
      if (!validRange({ start: requested.start, end: requested.end }) || requested.start < localDate()) { setError(t.dateError); setActive('when'); return }
    }
    setError('')
    setDraft(requested)
    setActive(null)
    window.location.hash = `#/${kind}${exchangeQuery(requested)}`
  }
  const toggle = (part: 'where' | 'when' | 'who' | 'filters') => { setError(''); setActive(previous => previous === part ? null : part) }
  const toggleAmenity = (key: AmenityFilter) => commit({ ...initial, amenities: initial.amenities.includes(key) ? initial.amenities.filter(item => item !== key) : [...initial.amenities, key] })
  const destination = draft.city === 'all' ? t.anyCity : `${city?.[lang]}${draft.region === 'all' ? '' : ` · ${city?.regions.find(item => item.id === draft.region)?.[lang] || ''}`}`
  const dateLabel = draft.start && draft.end ? `${draft.start.slice(5).replace('-', '/')}–${draft.end.slice(5).replace('-', '/')}` : lang === 'zh' ? '选择日期' : 'Add dates'
  const guestLabel = lang === 'zh' ? `${draft.guests} 位住客` : `${draft.guests} ${draft.guests === 1 ? 'guest' : 'guests'}`
  const amenityKeys: AmenityFilter[] = ['pool', 'parking', 'wifi', 'climate', 'view']
  return <div className="compact-finder" ref={finder}>
    <div className="compact-searchbar" role="search">
      <button type="button" className={`compact-segment destination${active === 'where' ? ' is-open' : ''}`} onClick={() => toggle('where')} aria-expanded={active === 'where'}><LineIcon name="window" size={18}/><span><small>{t.destination}</small><strong>{destination}</strong></span></button>
      <button type="button" className={`compact-segment${active === 'when' ? ' is-open' : ''}`} onClick={() => toggle('when')} aria-expanded={active === 'when'}><LineIcon name="calendar" size={18}/><span><small>{lang === 'zh' ? '入住 — 退房' : 'Check in — out'}</small><strong>{dateLabel}</strong></span></button>
      <button type="button" className={`compact-segment guests${active === 'who' ? ' is-open' : ''}`} onClick={() => toggle('who')} aria-expanded={active === 'who'}><LineIcon name="guests" size={18}/><span><small>{t.guests}</small><strong>{guestLabel}</strong></span></button>
      <button type="button" className="compact-submit" onClick={() => commit(draft)} aria-label={t.search}><span>{t.search}</span><LineIcon name="arrow" size={18}/></button>
    </div>
    <button type="button" className="compact-mobile-trigger" onClick={() => toggle('where')} aria-expanded={active !== null}><LineIcon name="window" size={19}/><span><strong>{destination}</strong><small>{dateLabel} · {guestLabel}</small></span><LineIcon name="arrow" size={18}/></button>
    <div className="compact-quick-filters">
      <button type="button" className={`compact-filter-entry${active === 'filters' ? ' selected' : ''}`} onClick={() => toggle('filters')} aria-expanded={active === 'filters'}><LineIcon name="check" size={17}/>{t.filters}</button>
      <span className="compact-quick-rule" aria-hidden="true"/>
      <button type="button" className={initial.type === 'villa' ? 'selected' : ''} aria-pressed={initial.type === 'villa'} onClick={() => commit({ ...initial, type: initial.type === 'villa' ? 'all' : 'villa' })}>{t.villa}</button>
      <button type="button" className={initial.bedrooms >= 2 ? 'selected' : ''} aria-pressed={initial.bedrooms >= 2} onClick={() => commit({ ...initial, bedrooms: initial.bedrooms >= 2 ? 0 : 2 })}>{lang === 'zh' ? '2 间卧室+' : '2+ bedrooms'}</button>
      {(['pool', 'parking', 'climate'] as const).map(key => <button type="button" key={key} className={initial.amenities.includes(key) ? 'selected' : ''} aria-pressed={initial.amenities.includes(key)} onClick={() => toggleAmenity(key)}>{t[key]}</button>)}
      {(initial.city !== 'all' || initial.start || initial.end || initial.guests > 1 || initial.type !== 'all' || initial.bedrooms || initial.beds || initial.baths || initial.amenities.length > 0) && <button type="button" className="compact-clear" onClick={() => commit(emptyExchangeSearch)}>{t.clear} ×</button>}
    </div>
    {active && <div className={`compact-popover compact-popover-${active}`}>
      <div className="compact-popover-top"><div className="compact-popover-tabs"><button type="button" className={active === 'where' ? 'selected' : ''} onClick={() => setActive('where')}>{t.destination}</button><button type="button" className={active === 'when' ? 'selected' : ''} onClick={() => setActive('when')}>{lang === 'zh' ? '日期' : 'Dates'}</button><button type="button" className={active === 'who' ? 'selected' : ''} onClick={() => setActive('who')}>{t.guests}</button><button type="button" className={active === 'filters' ? 'selected' : ''} onClick={() => setActive('filters')}>{t.filters}</button></div><button type="button" className="compact-close" aria-label={lang === 'zh' ? '关闭搜索' : 'Close search'} onClick={() => setActive(null)}><LineIcon name="close" size={18}/></button></div>
      {active === 'where' && <div className="compact-popover-body"><p className="compact-panel-label">{lang === 'zh' ? '想住在哪座城市？' : 'Where would you like to stay?'}</p><div className="compact-choice-grid"><button type="button" className={draft.city === 'all' ? 'selected' : ''} onClick={() => update({ city: 'all', region: 'all' })}>{t.anyCity}</button>{cities.map(item => <button type="button" key={item.id} className={draft.city === item.id ? 'selected' : ''} onClick={() => update({ city: item.id, region: 'all' })}>{item[lang]}</button>)}</div>{city && <><p className="compact-panel-label">{t.area} <span>{lang === 'zh' ? '可选' : 'Optional'}</span></p><div className="compact-choice-grid"><button type="button" className={draft.region === 'all' ? 'selected' : ''} onClick={() => update({ region: 'all' })}>{t.anyArea}</button>{city.regions.map(item => <button type="button" key={item.id} className={draft.region === item.id ? 'selected' : ''} onClick={() => update({ region: item.id })}>{item[lang]}</button>)}</div></>}</div>}
      {active === 'when' && <div className="compact-popover-body"><p className="compact-panel-label">{kind === 'exchange' ? lang === 'zh' ? '希望入住目标房源的日期' : 'Preferred dates for the target home' : lang === 'zh' ? '选择入住与退房日期' : 'Select check-in and checkout'}</p><div className="compact-dates"><label>{t.start}<input type="date" value={draft.start} min={localDate()} onChange={event => update({ start: event.target.value, end: draft.end && draft.end <= event.target.value ? '' : draft.end })}/></label><label>{t.end}<input type="date" value={draft.end} min={draft.start || localDate()} onChange={event => update({ end: event.target.value })}/></label></div><p className="compact-panel-help">{kind === 'exchange' ? lang === 'zh' ? '这只是筛选意向日期。双方可异期入住，实际档期须经业主和平台确认。' : 'These are preferred dates only. Each owner may stay at different times; both stays need confirmation.' : lang === 'zh' ? '日期用于筛选示意档期；提交入住意向后由平台核实。' : 'Dates filter sample availability. The platform verifies live dates after an enquiry.'}</p><button type="button" className="compact-text-action" onClick={() => update({ start: '', end: '' })}>{lang === 'zh' ? '日期不限' : 'Any dates'}</button></div>}
      {active === 'who' && <div className="compact-popover-body"><div className="compact-stepper"><div><strong>{t.guests}</strong><small>{lang === 'zh' ? '按实际入住人数筛选房源容量' : 'Match the home’s guest capacity'}</small></div><div><button type="button" aria-label={lang === 'zh' ? '减少人数' : 'Fewer guests'} disabled={draft.guests <= 1} onClick={() => update({ guests: draft.guests - 1 })}>−</button><output>{draft.guests}</output><button type="button" aria-label={lang === 'zh' ? '增加人数' : 'More guests'} disabled={draft.guests >= 20} onClick={() => update({ guests: draft.guests + 1 })}>+</button></div></div><p className="compact-panel-help">{lang === 'zh' ? '儿童计入入住人数；婴儿、宠物及加床政策请在房源详情确认。' : 'Children count as guests. Confirm infant, pet and extra-bed rules on each home.'}</p></div>}
      {active === 'filters' && <div className="compact-popover-body"><p className="compact-panel-label">{t.type}</p><div className="compact-choice-grid"><button type="button" className={draft.type === 'all' ? 'selected' : ''} onClick={() => update({ type: 'all' })}>{t.any}</button><button type="button" className={draft.type === 'apartment' ? 'selected' : ''} onClick={() => update({ type: 'apartment' })}>{t.apartment}</button><button type="button" className={draft.type === 'villa' ? 'selected' : ''} onClick={() => update({ type: 'villa' })}>{t.villa}</button></div><div className="compact-number-filters">{(['bedrooms', 'beds', 'baths'] as const).map(key => <label key={key}>{t[key]}<select value={draft[key]} onChange={event => update({ [key]: Number(event.target.value) })}><option value={0}>{t.any}</option>{[1, 2, 3, 4, 5].map(number => <option key={number} value={number}>{number}+</option>)}</select></label>)}</div><p className="compact-panel-label">{t.amenity}</p><div className="compact-choice-grid">{amenityKeys.map(key => <button type="button" key={key} className={draft.amenities.includes(key) ? 'selected' : ''} aria-pressed={draft.amenities.includes(key)} onClick={() => update({ amenities: draft.amenities.includes(key) ? draft.amenities.filter(item => item !== key) : [...draft.amenities, key] })}>{t[key]}</button>)}</div></div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="compact-popover-actions"><button type="button" className="compact-text-action" onClick={() => { setDraft(emptyExchangeSearch); commit(emptyExchangeSearch) }}>{t.clear}</button><button type="button" className="button button-dark" onClick={() => commit(draft)}>{t.apply}<LineIcon name="arrow" size={17}/></button></div>
    </div>}
  </div>
}

export function ExchangeCatalogPage({ lang, query, kind = 'exchange' }: { lang: Language; query: string; kind?: 'exchange' | 'stays' }) {
  const t = words[lang]
  const search = parseExchangeSearch(new URLSearchParams(query))
  const hasValidDates = !search.start && !search.end || validRange({ start: search.start, end: search.end }) && search.start >= localDate()
  const homes = hasValidDates ? filterExchangeHomes(sortFeaturedListings(listings), search, localDate(), kind) : []
  const drafts = kind === 'exchange' ? readExchangeDrafts().filter(draft => (search.city === 'all' || draft.city === search.city) && (search.region === 'all' || draft.region === search.region) && (search.type === 'all' || draft.propertyType === search.type) && draft.bedrooms >= search.bedrooms) : []
  const linkQuery = exchangeQuery(search)
  return <div className="page-shell page-top exchange-catalog-page exchange-discovery">
    <div className="page-title"><p className="eyebrow">{kind === 'stays' ? '02 / SHORT STAYS' : '03 / STAY EXCHANGE'}</p><h1>{kind === 'stays' ? t.staysTitle : t.title}</h1><p>{kind === 'stays' ? t.staysIntro : t.intro}</p></div>
    <SearchForm lang={lang} initial={search} kind={kind}/>
    <div className="results-bar"><div><h2>{kind === 'stays' ? t.staysResults : t.results}</h2><span>{String(homes.length).padStart(2, '0')}</span></div><span className="exchange-sort-note">{t.sort}</span></div>
    <p className="sample-inventory">{t.sample}</p>
    {homes.length ? <div className="listing-grid">{homes.map(home => <ExchangeCard key={home.id} home={home} lang={lang} query={linkQuery} kind={kind}/>)}</div> : <div className="empty-state"><h3>{t.empty}</h3><p>{hasValidDates ? t.tryAgain : t.dateError}</p><a className="button button-dark" href={`#/${kind}`}>{t.clear} ↗</a></div>}
    {kind === 'exchange' && drafts.length > 0 && <section className="exchange-drafts"><div className="results-bar"><div><h2>{lang === 'zh' ? '业主授权 · 待核验' : 'Owner authorized · under review'}</h2><span>{String(drafts.length).padStart(2, '0')}</span></div></div><p className="sample-inventory">{lang === 'zh' ? '以下登记仅保存在当前浏览器，用于测试“授权后展示”链路；尚不可申请入住，真实发布需人工核验。' : 'These entries live in this browser to test opt-in discovery. They cannot receive stay requests until human verification.'}</p><div className="listing-grid">{drafts.map(draft => <DraftCard key={draft.id} draft={draft} lang={lang}/>)}</div></section>}
    {kind === 'exchange' && <><div className="exchange-paths"><article><span>01 / LONG STAYS</span><h2>{lang === 'zh' ? '长租房也可置换' : 'Long-stay homes can opt in'}</h2><p>{t.eligibilityText}</p></article><article><span>02 / OWNER EXCHANGE</span><h2>{t.exchange}</h2><p>{t.exchangeLead}</p></article></div><p className="exchange-catalog-foot">{t.rentalNote}</p></>}
  </div>
}

function Calendar({ home, lang, start, end, onSelect }: { home: Listing; lang: Language; start: string; end: string; onSelect: (date: string) => void }) {
  const t = words[lang]
  const [offset, setOffset] = useState(0)
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const pad = (first.getDay() + 6) % 7
  const blocked = new Set(demoBlockedDates(home.id))
  const weekday = lang === 'zh' ? ['一', '二', '三', '四', '五', '六', '日'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return <div className="exchange-calendar"><div className="calendar-head"><strong>{new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long' }).format(first)}</strong><div><button type="button" disabled={offset === 0} onClick={() => setOffset(offset - 1)} aria-label={lang === 'zh' ? '上个月' : 'Previous month'}>←</button><button type="button" disabled={offset === 5} onClick={() => setOffset(offset + 1)} aria-label={lang === 'zh' ? '下个月' : 'Next month'}>→</button></div></div><div className="calendar-grid">{weekday.map((label, index) => <small key={index}>{label}</small>)}{Array.from({ length: pad }, (_, index) => <i key={`p${index}`}/>)}{Array.from({ length: days }, (_, index) => { const date = `${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`; const closed = date < localDate() || blocked.has(date); return <button key={date} type="button" disabled={closed} className={`${closed ? 'is-blocked' : ''} ${date >= start && date < end && start && end ? 'is-selected' : ''} ${date === start || date === end ? 'is-boundary' : ''}`} aria-label={`${date}${closed ? ` · ${t.blocked}` : ''}`} aria-pressed={date === start || date === end} onClick={() => onSelect(date)}>{index + 1}</button> })}</div><p>{t.availabilityNote}</p></div>
}

export function ExchangeDetailPage({ lang, id, query, kind = 'exchange' }: { lang: Language; id?: string; query: string; kind?: 'exchange' | 'stays' }) {
  const t = words[lang]
  const home = listings.find(item => item.id === id)
  const search = parseExchangeSearch(new URLSearchParams(query))
  const [start, setStart] = useState(search.start)
  const [end, setEnd] = useState(search.end)
  const [guests, setGuests] = useState(search.guests)
  const [amenitiesOpen, setAmenitiesOpen] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'rental' | 'exchange'>(home?.management === 'leased' ? 'exchange' : 'rental')
  const startInput = useRef<HTMLInputElement>(null)
  const endInput = useRef<HTMLInputElement>(null)
  const guestsInput = useRef<HTMLSelectElement>(null)
  useEffect(() => { setStart(search.start); setEnd(search.end); setGuests(search.guests); setAmenitiesOpen(false); setError(''); setMode(home?.management === 'leased' ? 'exchange' : 'rental') }, [id, query, kind, home?.management])
  if (!home || (kind === 'exchange' ? !canExchange(home) : home.management !== 'operated')) return <div className="page-shell empty-state"><h1>{t.empty}</h1><a className="button button-dark" href={`#/${kind}`}>{t.from} ↗</a></div>
  const range = { start, end }
  const days = validRange(range) ? stayNights(start, end) : 0
  const navigate = () => {
    const chosen = { start: startInput.current?.value || '', end: endInput.current?.value || '' }
    const chosenGuests = Number(guestsInput.current?.value || guests)
    if (chosen.start || chosen.end) {
      if (!validRange(chosen) || chosen.start < localDate()) { setError(t.dateError); return }
      if (!demoAvailable(home.id, chosen)) { setError(t.unavailable); return }
    } else if (mode === 'rental') { setError(t.dateError); return }
    setError('')
    const params = new URLSearchParams()
    if (chosen.start) params.set('start', chosen.start)
    if (chosen.end) params.set('end', chosen.end)
    params.set('guests', String(chosenGuests))
    window.location.hash = `#/request/${mode}/${home.id}?${params}`
  }
  const selectDay = (date: string) => {
    if (!start || end || date <= start) { setStart(date); setEnd(''); setError(''); return }
    if (!demoAvailable(home.id, { start, end: date })) { setError(t.unavailable); return }
    setEnd(date)
    setError('')
  }
  const related = listings.filter(item => (kind === 'stays' ? item.management === 'operated' : canExchange(item)) && item.id !== home.id && item.guests >= guests).sort((a, b) => Number(b.city === home.city) - Number(a.city === home.city)).slice(0, 3)
  const exchangeCleaning = home.city === 'pattaya' ? (lang === 'zh' ? '¥600 等值泰铢' : 'THB equivalent of ¥600') : '¥600'
  const exchangeDeposit = home.management === 'leased' ? new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: home.currency, maximumFractionDigits: 0 }).format(home.price) : home.city === 'pattaya' ? (lang === 'zh' ? '¥3,000–6,000 等值泰铢' : 'THB equivalent of ¥3,000–6,000') : '¥3,000–6,000'
  const recommendation = guestRecommendation(home)
  const hasPool = home.amenities.some(item => /泳池|pool/i.test(item.zh))
  const highlights = [
    ...(home.guests >= 4 ? [{ icon: 'family' as const, title: lang === 'zh' ? '适合家庭与好友同行' : 'Room for family and friends', detail: lang === 'zh' ? `${home.bedrooms} 间卧室，最多可住 ${home.guests} 人；真实房客好评将在入住评价核验后展示。` : `${home.bedrooms} bedrooms for up to ${home.guests} guests. Verified guest praise appears after real stays.` }] : [{ icon: 'window' as const, title: home.features[0][lang], detail: lang === 'zh' ? '房源特色以正式核验信息为准。' : 'Features are subject to property verification.' }]),
    ...(hasPool ? [{ icon: 'pool' as const, title: lang === 'zh' ? '尽享泳池时光' : 'Enjoy time by the pool', detail: lang === 'zh' ? '泳池是这套示意房源的特色配置；开放时间与使用规则须上线前核验。' : 'A concept highlight for this home; access and rules require live verification.' }] : [{ icon: 'window' as const, title: home.highlight[lang], detail: home.features[1]?.[lang] || home.description[lang] }]),
    ...(home.selfCheckIn ? [{ icon: 'lock' as const, title: lang === 'zh' ? '密码锁自助入住' : 'Self check-in with a keypad', detail: lang === 'zh' ? '置换民宿标配。入住前由平台核验身份，并单独发送当次有效的开门信息。' : 'Standard for exchange stays. The platform verifies the guest and sends a stay-specific code before arrival.' }] : []),
  ]
  return <div className="page-shell exchange-detail">
    <div className="exchange-detail-top"><a className="back-link" href={`#/${kind}${exchangeQuery(search)}`}>← {t.from}</a><span>{t.demo} / {t.test}</span></div>
    <div className="detail-heading"><div><p className="eyebrow">{location(home, lang)} / {home.type[lang]}</p><h1>{home.title[lang]}</h1><p>{home.highlight[lang]} · {t.sleeps} {home.guests} · {home.bedrooms} {t.bedrooms.toLowerCase()} · {home.beds} {t.beds.toLowerCase()} · {home.bathrooms} {t.baths.toLowerCase()}</p></div></div>
    <ExchangeGallery home={home} lang={lang}/>
    <div className="exchange-detail-layout"><div className="exchange-detail-main">
      <section className="exchange-info-section" id="space"><p className="eyebrow">THE SPACE</p><h2>{t.overview}</h2><p className="lead">{home.description[lang]}</p><div className="exchange-fact-row"><span><LineIcon name="guests"/>{t.sleeps} {home.guests}</span><span><LineIcon name="bedroom"/>{home.bedrooms} {t.bedrooms}</span><span><LineIcon name="bed"/>{home.beds} {t.beds}</span><span><LineIcon name="bath"/>{home.bathrooms} {t.baths}</span><span><LineIcon name="area"/>{home.area} m²</span></div></section>
      <section className="exchange-recommendation" aria-label={lang === 'zh' ? '房客推荐' : 'Guest recommendation'}><div className="exchange-recommendation-mark"><LineIcon name="shield" size={28}/><strong>{lang === 'zh' ? '房客推荐' : 'Guest recommended'}</strong></div>{recommendation.recommended ? <p><strong>{recommendation.rating!.toFixed(2)} / 5</strong><span>{lang === 'zh' ? `${recommendation.count} 条已核验入住评价` : `${recommendation.count} verified post-stay reviews`}</span></p> : <p><strong>{lang === 'zh' ? '等待真实入住评价' : 'Awaiting real guest reviews'}</strong><span>{lang === 'zh' ? '示意房源不展示虚构评分与评价数' : 'No invented rating or review count for concept homes'}</span></p>}<details><summary>{lang === 'zh' ? '查看推荐规则' : 'How recommendations work'}</summary><p>{lang === 'zh' ? '仅统计已完成入住、经平台核验的评价；至少 5 条且平均分达到 4.8 / 5 时，才展示房客推荐评分。' : 'Only completed and verified stays count. A recommendation appears after at least five reviews averaging 4.8 / 5 or higher.'}</p></details></section>
      <section className="exchange-info-section"><p className="eyebrow">HIGHLIGHTS</p><h2>{t.highlights}</h2><div className="exchange-highlight-list">{highlights.map(item => <div className="exchange-highlight" key={item.title}><LineIcon name={item.icon} size={25}/><div><h3>{item.title}</h3><p>{item.detail}</p></div></div>)}</div></section>
      <section className="exchange-info-section"><p className="eyebrow">AMENITIES</p><h2>{t.amenities}</h2><div className="amenity-list">{(amenitiesOpen ? home.amenities : home.amenities.slice(0, 6)).map(item => <span key={item.zh}><LineIcon name={amenityIcon(item.zh)} size={23}/>{item[lang]}</span>)}</div>{home.amenities.length > 6 && <button className="exchange-amenities-toggle" type="button" aria-expanded={amenitiesOpen} onClick={() => setAmenitiesOpen(!amenitiesOpen)}>{amenitiesOpen ? (lang === 'zh' ? '收起设施' : 'Show fewer') : (lang === 'zh' ? `查看全部 ${home.amenities.length} 项设施` : `Show all ${home.amenities.length} amenities`)} <span aria-hidden="true">{amenitiesOpen ? '−' : '+'}</span></button>}<p className="exchange-amenities-note">{lang === 'zh' ? '以上配置为示意数据，真实房源上线前逐项核验。' : 'Concept amenities are verified individually before a live home is published.'}</p></section>
      <section className="exchange-info-section"><p className="eyebrow">AVAILABILITY</p><h2>{t.availability}</h2><Calendar home={home} lang={lang} start={start} end={end} onSelect={selectDay}/></section>
      <section className="exchange-info-section"><p className="eyebrow">LOCATION</p><h2>{t.location}</h2><div className="exchange-location"><strong>{location(home, lang)}</strong><p>{t.locationNote}</p></div></section>
      <section className="exchange-info-section"><p className="eyebrow">GOOD TO KNOW</p><h2>{t.rules}</h2><p>{t.rulesNote}</p></section>
      <section className="exchange-info-section exchange-rules"><p className="eyebrow">OWNER EXCHANGE</p><h2>{t.exchange}</h2><div><article><LineIcon name="shield"/><h3>{t.eligibility}</h3><p>{t.eligibilityText}</p></article><article><LineIcon name="calendar"/><h3>{t.timing}</h3><p>{t.timingText}</p></article><article><LineIcon name="utility"/><h3>{t.fees}</h3><p>{t.feesText}</p></article></div></section>
    </div><aside className="exchange-action-card"><div className="exchange-mode-tabs" role="tablist" aria-label={t.overview}>{home.management === 'operated' && <button type="button" role="tab" aria-selected={mode === 'rental'} className={mode === 'rental' ? 'active' : ''} onClick={() => { setMode('rental'); setError('') }}>{t.rental}</button>}<button type="button" role="tab" aria-selected={mode === 'exchange'} className={mode === 'exchange' ? 'active' : ''} onClick={() => { setMode('exchange'); setError('') }}>{t.exchange}</button></div><div className="exchange-action-body"><p className="eyebrow">{mode === 'rental' ? 'NIGHTLY STAY' : 'TWO-HOME EXCHANGE'}</p><strong className="exchange-action-price">{mode === 'rental' ? `${nightly(home, lang)} / ${t.day}` : t.equivalent}</strong><p className="exchange-action-lead">{mode === 'rental' ? t.rentalLead : t.exchangeLead}</p><div className="exchange-action-fields"><label>{t.start}<input ref={startInput} type="date" min={localDate()} value={start} onInput={event => setStart(event.currentTarget.value)} onChange={event => { setStart(event.target.value); setError('') }}/></label><label>{t.end}<input ref={endInput} type="date" min={start || localDate()} value={end} onInput={event => setEnd(event.currentTarget.value)} onChange={event => { setEnd(event.target.value); setError('') }}/></label><label>{t.guests}<select ref={guestsInput} value={guests} onChange={event => setGuests(Number(event.target.value))}>{Array.from({ length: home.guests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label></div><div className="exchange-cost-lines">{mode === 'rental' ? <><div><span>{t.daily}</span><strong>{nightly(home, lang)}</strong></div>{days > 0 && <div><span>{days} {t.nights}</span><strong>{nightly({ ...home, price: home.price * days }, lang)}</strong></div>}<div><span>{t.utilities}</span><strong>{t.metered}</strong></div></> : <><div><span>{t.equivalent}</span><strong>{t.review}</strong></div><div><span>{t.topup}</span><strong>{t.topupPending}</strong></div><div><span>{t.cleaning}</span><strong>{exchangeCleaning}</strong></div><div><span>{t.deposit}</span><strong>{exchangeDeposit}</strong></div><div><span>{t.utilities}</span><strong>{t.metered}</strong></div></>}</div>{mode === 'exchange' && <p className="exchange-action-note">{home.city === 'pattaya' ? t.feesText : t.exchangeNoDate}</p>}{error && <p className="form-error" role="alert">{error}</p>}<button type="button" className="button button-dark" onClick={navigate}>{mode === 'rental' ? t.reserve : t.request}<LineIcon name="arrow" size={17}/></button><small>{t.noCharge} {t.sample}</small></div></aside></div>
    <section className="exchange-related"><div className="results-bar"><div><h2>{t.related}</h2></div></div><div className="listing-grid">{related.map(item => <ExchangeCard key={item.id} home={item} lang={lang} query={exchangeQuery(search)} kind={kind}/>)}</div></section>
  </div>
}
