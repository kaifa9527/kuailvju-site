import { useEffect, useMemo, useState } from 'react'
import { cities, listings, type Listing, type Term } from './data'
import { canExchange, estimateLeaseMoveIn, filterListings, formatPrice, sortFeaturedListings, type Language, type LeasePaymentOption } from './lib/catalog'
import { LineIcon, amenityIcon } from './components/LineIcon'
import { ExchangeRequestPage, ManagementTestSubmit, RentalRequestPage, TestInbox } from './TestFlows'

type Filters = { city: string; region: string; term: string }
type ExchangeFilters = { city: string; region: string; guests: string }
type Route = { page: string; id?: string; mode?: string; filters: Filters }
const emptyFilters: Filters = { city: 'all', region: 'all', term: 'all' }
const emptyExchangeFilters: ExchangeFilters = { city: 'all', region: 'all', guests: 'all' }
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const words = {
  zh: {
    rent: '房屋租赁', exchange: '旅居置换', manage: '物业托管', explore: '探索房源', more: '了解详情',
    preview: '置换资格提示', menu: '菜单', search: '查找房源', city: '城市', area: '区域', stay: '租期',
    allCities: '全部城市', allAreas: '全部区域', allTerms: '全部租期', day: '日租', month: '月租', quarter: '季租', year: '年租',
    results: '精选房源', exchangeResults: '可置换房源', exchangeIntro: '仅委托经营业主可申请。选好目标房源，发起双房源互换。', guestsFilter: '入住人数', allGuests: '不限人数', guestsAtLeast: '至少可住', reset: '清除筛选', noResult: '没有匹配的示意房源', noResultSub: '试试更换城市或租期。真实房源上线后，选择会持续增加。', exchangeNoResultSub: '试试更换城市、区域或入住人数。',
    demo: '示意房源', price: '示意价格', contact: '咨询房源', apply: '申请置换',
    ineligible: '仅委托经营房源的业主可申请旅居置换。此房源未加入委托经营置换房源池。',
    understood: '我知道了', back: '返回房源', ready: '委托经营 · 可申请置换', noExchange: '暂不开放置换',
    occupants: '可住', room: '卧室', rooms: '卧室', baths: '卫生间', beds: '床位', size: '面积', experience: '居住体验', terms: '可选租期',
    quickRent: '房屋租赁', quickExchange: '旅居置换', quickManage: '物业托管',
    sampleInventory: '以下房源及参数为页面示意，真实房源与可订日期待核验上线。',
    pinned: '置顶', exchangeBadge: '置换示意', exchangeMayWaive: '符合条件可免住宿费', exchangeCostsBrief: '保洁费 + 押金 + 水电',
    exchangeSectionNote: '仅委托经营签约业主可申请；每次入住另付 ¥500 保洁费、¥1,000 可退押金，水电据实结算。芭提雅按确认时的等值泰铢收取。',
    homeManageNote: '委托租赁、委托经营、委托看护。选一种适合您房屋现状的方式。',
    registrationTitle: '登记房源意向', serviceScope: '服务与收费', registrationPreview: '可测试提交流程 · 不收集真实资料',
    registrationNotice: '选择房屋信息后可生成一条站内测试记录，保存在当前浏览器。电话与邮箱暂不填写，也不会发送给平台。',
    propertyCity: '房源城市', propertyRegion: '所在区域', propertyType: '房屋类型', propertySize: '建筑面积（m²）',
    contactPhone: '联系电话', contactEmail: '联系邮箱', apartment: '公寓', villa: '别墅', chooseOne: '请选择', registrationButton: '提交测试登记', registerAction: '查看登记信息', registrationDisabledPlaceholder: '正式开放后填写',
    leasingSteps: ['评估房源', '签约上架', '招租成交', '收租对账'],
    operationSteps: ['评估授权', '运营出租', '收益对账', '符合条件后申请置换'],
    careSteps: ['选择服务', '每周巡检', '拍照留档', '查看报告'],
    viewPhotos: '查看示意图片', sampleSpecs: '配置示意', amenities: '空间与设施',
    feeTitle: '费用先看清', baseRent: '示意房费', zeroAgency: '租客中介费', utilitiesActual: '水电按实际用量结算',
    datePending: '真实可订日期暂未开放查询；提交或付款前须再次核对房态及最终报价。',
    chooseTerm: '选择租期', paymentChoice: '押付方式示意', deposit: '可退押金', prepaidRent: '预付租金', initialDue: '首次应付示意',
    oneTwo: '押一付二', twoOne: '押二付一', oneTwoNote: '1 个月押金 + 前 2 个月租金', twoOneNote: '2 个月押金 + 第 1 个月租金',
    paymentPending: '1 个月租期不展示两个月预付方案；具体押付以当地核验与最终合同为准。',
    otherFees: '其他费用和取消规则待房源核验后公布，不在示意阶段给出虚假总价。',
    exchangeMini: '仅委托经营签约业主可申请；符合条件可免住宿费。每人每次另付 ¥500 保洁费、¥1,000 可退押金，水电据实自付。',
    exchangeThai: '芭提雅费用按确认时锁定的等值泰铢收取。',
    listingRules: '入住与房屋规则', listingRulesPending: '入住退房时间、宠物、吸烟及取消条款，在真实房源核验后逐项公布。',
    intro: '从一处好房，开启下一段生活。', homeNote: '选择城市与租期，先看好房。每一次入住，都有认真回应。',
    guide: '三种服务，一目了然',
    cityNote: '目前开放芭提雅、三亚、北海。更多城市将逐步加入。',
    rentalLine: '好房源，心服务。', exchangeLine: '一房托管，旅居世界。', manageLine: '专业、靠谱，知托付。',
    eligibility: '谁可以置换？', eligibilityText: '仅已签约委托经营、并加入置换房源池的业主，可向另一套委托经营房源发起申请。双方匿名确认，平台协调履约。',
    twoHomes: '两套房源，并列比较', twoHomesSub: '房型、面积、配置与可住日期放在同一画面；双方只做同意、拒绝或修改时间的选择。',
    step1: '选择目标房源', step2: '双方匿名确认', step3: '确定各自入住时间', step4: '支付服务费与押金',
    fee: '每人每次入住', feeBody: '双方认可对等互换时免房费；各自支付 ¥500 管家服务费（入住前后保洁） + ¥1,000 可退押金。芭提雅按锁定汇率收等值泰铢。',
    utility: '水电按入住前后实际抄表结算，由入住人承担；损坏或遗失按证据核算，多退少补。',
    separate: '双方入住日期可以不同', separateSub: '平台跟踪两个独立入住段，确认房源可用、交接与退房结算。',
    choose: '选择适合房屋的托管方式', manageIntro: '从稳定出租，到专业经营或定期看护，权责、收益与服务清晰可见。',
    lease: '委托租赁', operation: '委托经营', care: '委托看护',
    leaseBlurb: '免费展示与招租。租客免中介费，成交后由房东按租期支付佣金。',
    operationBlurb: '平台负责经营与服务。日租扣除约定直接运营成本后，平台 30%，房东 70%。业主可申请旅居置换。',
    careBlurb: '空置房定期照看。每周通风、检查、电器通电保护，并留存拍照记录。',
    leaseDetail: '免费上架与招租，成交后由房东按租期支付约定佣金；带看、签约及租务进度可跟踪。',
    leaseFees: '房东付佣金：少于 6 个月为月租金的 20%；整 6 个月为半个月租金；超过 6 个月为一个月租金。',
    leaseTerms: '租客免中介费；符合租期条件时可选押一付二或押二付一，水电由租客按实际使用承担。',
    operationDetail: '平台负责出租经营、现场服务与收益对账。按日计价房源扣除约定直接成本后平台 30%、房东 70%；符合条件的业主可申请旅居置换。按月经营可另评估固定到手租金方案。',
    careDetail: '公寓与别墅分别报价。基础巡检之外，可按需组合升级项目。',
    careMenu: '可选升级服务', careItems: ['园林绿化修剪', '泳池维护', '深度清洁', '空调与除湿保养', '虫害防治', '软装与布草维护', '台风雨季专项巡检', '离家前封存与返家前准备'],
    termsNote: '具体价格、范围与服务记录，以当地方案和私密签约内容为准。',
    testDesk: '流程测试', language: '语言', close: '关闭', footer: '快旅居 · 房屋租赁与托管', legal: '房源与价格均为示意。可在当前浏览器测试流程，不构成真实预订、置换或交易。',
  },
  en: {
    rent: 'Homes', exchange: 'Stay Exchange', manage: 'Property Care', explore: 'Explore homes', more: 'View details',
    preview: 'Exchange eligibility', menu: 'Menu', search: 'Search', city: 'City', area: 'Area', stay: 'Stay',
    allCities: 'All cities', allAreas: 'All areas', allTerms: 'All stays', day: 'Daily', month: 'Monthly', quarter: 'Quarterly', year: 'Yearly',
    results: 'Featured homes', exchangeResults: 'Exchange homes', exchangeIntro: 'For managed-operation owners. Choose a home and request a direct exchange.', guestsFilter: 'Guests', allGuests: 'Any number', guestsAtLeast: 'Sleeps at least', reset: 'Clear filters', noResult: 'No concept homes match', noResultSub: 'Try a different city or stay length. More choices will appear when live inventory launches.', exchangeNoResultSub: 'Try another city, area or guest count.',
    demo: 'Concept home', price: 'Sample price', contact: 'Ask about this home', apply: 'Request exchange',
    ineligible: 'Stay exchange is available only to owners of homes under an active operation agreement. This home is not in the exchange pool.',
    understood: 'Got it', back: 'Back to homes', ready: 'Managed operation · Exchange eligible', noExchange: 'Exchange unavailable',
    occupants: 'Sleeps', room: 'Bedroom', rooms: 'Bedrooms', baths: 'Bathrooms', beds: 'Beds', size: 'Area', experience: 'The space', terms: 'Stay options',
    quickRent: 'Rent homes', quickExchange: 'Stay exchange', quickManage: 'Property care',
    sampleInventory: 'Homes and details below are illustrative. Live inventory and dates require verification.',
    pinned: 'Pinned', exchangeBadge: 'Exchange concept', exchangeMayWaive: 'Eligible stays may waive rent', exchangeCostsBrief: 'Cleaning + deposit + utilities',
    exchangeSectionNote: 'Only owners under active Full Management agreements may apply. Each stay still requires a ¥500 cleaning fee, ¥1,000 refundable deposit and actual utilities. Pattaya charges the locked THB equivalent.',
    homeManageNote: 'Leasing, full management or home care. Choose the service that fits your property.',
    registrationTitle: 'Register a property enquiry', serviceScope: 'Service & fees', registrationPreview: 'Interactive workflow test · no real details collected',
    registrationNotice: 'Submit property choices to create a browser-only test record. Phone and email remain disabled; nothing is sent to the platform.',
    propertyCity: 'Property city', propertyRegion: 'Area', propertyType: 'Property type', propertySize: 'Floor area (m²)',
    contactPhone: 'Phone', contactEmail: 'Email', apartment: 'Apartment', villa: 'Villa', chooseOne: 'Select', registrationButton: 'Submit test enquiry', registerAction: 'View registration fields', registrationDisabledPlaceholder: 'Available after launch',
    leasingSteps: ['Assess home', 'Sign & list', 'Find tenant', 'Reconcile rent'],
    operationSteps: ['Assess & authorize', 'Operate stays', 'Review earnings', 'Unlock exchange if eligible'],
    careSteps: ['Choose care', 'Weekly visit', 'Photo record', 'Review report'],
    viewPhotos: 'View concept images', sampleSpecs: 'Illustrative details', amenities: 'Space & amenities',
    feeTitle: 'See the costs first', baseRent: 'Sample rent', zeroAgency: 'Tenant agency fee', utilitiesActual: 'Utilities billed by actual use',
    datePending: 'Live dates are not connected yet. Availability and final quotes must be checked before applying or paying.',
    chooseTerm: 'Choose a term', paymentChoice: 'Sample payment choices', deposit: 'Refundable deposit', prepaidRent: 'Prepaid rent', initialDue: 'Sample amount due now',
    oneTwo: '1 + 2', twoOne: '2 + 1', oneTwoNote: '1 month deposit + first 2 months rent', twoOneNote: '2 months deposit + first month rent',
    paymentPending: 'A one-month term does not show a two-month prepayment choice. Final options depend on local review and the contract.',
    otherFees: 'Other charges and cancellation terms will be published after property review. No invented total is shown in this preview.',
    exchangeMini: 'Only owners under a managed operation agreement may apply. Eligible exchanges can waive accommodation rent. Each guest still pays a ¥500 cleaning fee, ¥1,000 refundable deposit and actual utilities.',
    exchangeThai: 'Pattaya collects the locked THB equivalent at confirmation.',
    listingRules: 'Stay & house rules', listingRulesPending: 'Check-in/out times, pets, smoking and cancellation terms will be published after each real home is verified.',
    intro: 'A good home for the next chapter.', homeNote: 'Pick a city and stay length, then discover a place that feels right.',
    guide: 'Three clear ways to begin',
    cityNote: 'Now focusing on Pattaya, Sanya and Beihai. More cities will follow.',
    rentalLine: 'Good homes. Thoughtful service.', exchangeLine: 'One home entrusted. A world to stay in.', manageLine: 'Professional care. Trust well placed.',
    eligibility: 'Who can exchange?', eligibilityText: 'Only owners with an active managed operation agreement and a home admitted to the exchange pool may request another managed home. Both sides decide anonymously; the platform coordinates delivery.',
    twoHomes: 'Two homes, side by side', twoHomesSub: 'Compare layout, size, amenities and dates at a glance. Each owner may accept, decline or suggest new dates without sharing contact details.',
    step1: 'Choose a home', step2: 'Confirm anonymously', step3: 'Agree on both stay dates', step4: 'Pay fee and deposit',
    fee: 'Per person, per stay', feeBody: 'When both owners approve an equivalent exchange, accommodation rent is waived. Each pays a ¥500 cleaning service fee and a refundable ¥1,000 deposit. Pattaya collects the locked THB equivalent.',
    utility: 'Guests pay actual metered utilities. Evidence-based loss or damage charges are settled against the deposit, with any difference refunded or collected.',
    separate: 'Stay dates may differ', separateSub: 'The platform tracks two separate stays, including availability, handover and checkout.',
    choose: 'Choose the right care for your home', manageIntro: 'From stable leasing to active operation or regular care, understand the service and earning model at a glance.',
    lease: 'Leasing', operation: 'Managed operation', care: 'Home care',
    leaseBlurb: 'Free listing and leasing support. Tenants pay no agency fee; owners pay commission after a successful lease.',
    operationBlurb: 'We operate the home and serve guests. For daily stays, net proceeds after agreed direct costs split 30% platform / 70% owner. Owners may exchange stays.',
    careBlurb: 'Routine visits to an idle home: weekly ventilation, checks, electrical protection and photo records.',
    leaseDetail: 'Free listing and leasing support. Owners pay the agreed commission only after a successful lease; viewing, signing and rent progress can be tracked.',
    leaseFees: 'Owner-paid commission: under 6 months, 20% of one month’s rent; exactly 6 months, half a month; over 6 months, one month.',
    leaseTerms: 'Tenants pay no agency fee. Where the lease term permits, choose one-month deposit with two months’ rent or two-month deposit with one month’s rent. Tenants pay actual utilities.',
    operationDetail: 'We manage rental operations, on-site service and earnings. For daily stays, agreed direct costs are deducted before the platform receives 30% and the owner 70%. Eligible owners may request stay exchange. Monthly operations may separately assess a fixed take-home rent.',
    careDetail: 'Apartments and villas have different rates. Add services as needed beyond the basic weekly visit.',
    careMenu: 'Optional upgrades', careItems: ['Garden pruning', 'Pool care', 'Deep cleaning', 'AC and dehumidifier care', 'Pest prevention', 'Linen and furnishing care', 'Storm-season checks', 'Pre-arrival preparation'],
    termsNote: 'Final pricing, scope and records follow local proposals and private agreements.',
    testDesk: 'Test workflow', language: 'Language', close: 'Close', footer: 'Kuai Lü Ju · Homes & property care', legal: 'Homes and prices are illustrative. Browser-only workflow tests do not create live bookings, exchanges or payments.',
  },
}

function parseRoute(): Route {
  const raw = window.location.hash.slice(1) || '/'
  const [path, query = ''] = raw.split('?')
  const parts = path.split('/').filter(Boolean)
  const params = new URLSearchParams(query)
  return {
    page: parts[0] || 'home', id: parts[0] === 'listing' ? parts[1] : parts[0] === 'request' ? parts[2] : undefined,
    mode: parts[0] === 'management' || parts[0] === 'request' ? parts[1] : undefined,
    filters: { city: params.get('city') || 'all', region: params.get('region') || 'all', term: params.get('term') || 'all' },
  }
}

function rentalsHash(filters: Filters) {
  const params = new URLSearchParams()
  if (filters.city !== 'all') params.set('city', filters.city)
  if (filters.region !== 'all') params.set('region', filters.region)
  if (filters.term !== 'all') params.set('term', filters.term)
  return `#/rentals${params.size ? `?${params}` : ''}`
}

function Header({ lang, setLang, route }: { lang: Language; setLang: (v: Language) => void; route: Route }) {
  const t = words[lang]
  const [open, setOpen] = useState(false)
  const nav = [
    { href: '#/rentals', label: t.rent, key: 'rentals' },
    { href: '#/exchange', label: t.exchange, key: 'exchange' },
  ]
  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href="#/" aria-label={lang === 'zh' ? '快旅居首页' : 'Kuai Lü Ju home'}><span className="brand-mark">快</span><span className="brand-name">快旅居<span>KUAI LÜ JU</span></span></a>
      <nav className={`primary-nav ${open ? 'is-open' : ''}`} aria-label={t.menu}>
        {nav.map(item => <a key={item.key} href={item.href} className={route.page === item.key ? 'is-current' : ''} onClick={() => setOpen(false)}>{item.label}</a>)}
        <details className="nav-management"><summary className={route.page === 'management' ? 'is-current' : ''}>{t.manage}<span aria-hidden="true">⌄</span></summary><div className="management-menu"><a href="#/management/leasing" onClick={() => setOpen(false)}>{t.lease}</a><a href="#/management/operation" onClick={() => setOpen(false)}>{t.operation}</a><a href="#/management/care" onClick={() => setOpen(false)}>{t.care}</a></div></details>
      </nav>
      <div className="header-actions">
        <a className="test-desk-link" href="#/test-inbox">{t.testDesk}</a>
        <button className="language-switch" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={`${t.language}: ${lang === 'zh' ? 'English' : '中文'}`}>{lang === 'zh' ? 'EN' : '中'}</button>
        <button className="menu-button" aria-expanded={open} aria-label={t.menu} onClick={() => setOpen(v => !v)}><span></span><span></span></button>
      </div>
    </div>
  </header>
}

function SearchPanel({ lang, initial, compact = false }: { lang: Language; initial: Filters; compact?: boolean }) {
  const t = words[lang]
  const [filters, setFilters] = useState(initial)
  useEffect(() => { setFilters(initial) }, [initial.city, initial.region, initial.term])
  const selectedCity = cities.find(c => c.id === filters.city)
  const choose = (patch: Partial<Filters>) => setFilters(previous => ({ ...previous, ...patch }))
  return <form className={`search-panel ${compact ? 'search-compact' : ''}`} onSubmit={event => { event.preventDefault(); window.location.hash = rentalsHash(filters) }}>
    <label><span>{t.city}</span><select value={filters.city} onChange={e => choose({ city: e.target.value, region: 'all' })}><option value="all">{t.allCities}</option>{cities.map(c => <option key={c.id} value={c.id}>{c[lang]}</option>)}</select></label>
    <label><span>{t.area}</span><select value={filters.region} onChange={e => choose({ region: e.target.value })}><option value="all">{t.allAreas}</option>{selectedCity?.regions.map(r => <option key={r.id} value={r.id}>{r[lang]}</option>)}</select></label>
    <label><span>{t.stay}</span><select value={filters.term} onChange={e => choose({ term: e.target.value })}><option value="all">{t.allTerms}</option>{(['day', 'month', 'quarter', 'year'] as Term[]).map(term => <option key={term} value={term}>{t[term]}</option>)}</select></label>
    <button className="button button-dark search-submit" type="submit"><span>{t.search}</span><span aria-hidden="true">↗</span></button>
  </form>
}

function ListingCard({ listing, lang, context = 'rentals' }: { listing: Listing; lang: Language; context?: 'rentals' | 'exchange' }) {
  const t = words[lang]
  const city = cities.find(c => c.id === listing.city)!
  const region = city.regions.find(r => r.id === listing.region)!
  return <a className={`listing-card ${context === 'exchange' ? 'listing-card-exchange' : ''}`} href={`#/listing/${listing.id}`}>
    <div className="listing-image"><img src={asset(listing.gallery[0].image)} alt={`${listing.title[lang]} — ${t.demo}`} loading="lazy"/><span className="image-label">{t.demo}</span>{listing.pinned && <span className="listing-pinned">{t.pinned}</span>}</div>
    <div className="listing-content"><div className="listing-eyebrow">{city[lang]} · {region[lang]} <span>/{listing.type[lang]}</span></div><h3>{listing.title[lang]}</h3><p>{listing.highlight[lang]} <span>·</span> {listing.bedrooms} {(listing.bedrooms === 1 ? t.room : t.rooms).toLowerCase()} <span>·</span> {listing.area} m²</p>{context === 'rentals' ? <div className="listing-terms">{listing.terms.map(term => <span key={term}>{t[term]}</span>)}</div> : <div className="listing-terms"><span>{t.exchangeBadge}</span></div>}<div className="listing-bottom"><div><small>{context === 'exchange' ? t.exchangeMayWaive : t.price}</small><strong>{context === 'exchange' ? t.exchangeCostsBrief : formatPrice(listing, lang)}</strong></div><span className="circle-arrow" aria-hidden="true">↗</span></div></div>
  </a>
}

function ManagementCards({ lang }: { lang: Language }) {
  const t = words[lang]
  return <div className="management-grid">
    <a className="management-card" href="#/management/leasing"><span>01 / SERVICE</span><h3>{t.lease}</h3><p>{t.leaseBlurb}</p><b>{t.more} ↗</b></a>
    <a className="management-card" href="#/management/operation"><span>02 / SERVICE</span><h3>{t.operation}</h3><p>{t.operationBlurb}</p><b>{t.more} ↗</b></a>
    <a className="management-card" href="#/management/care"><span>03 / SERVICE</span><h3>{t.care}</h3><p>{t.careBlurb}</p><b>{t.more} ↗</b></a>
  </div>
}

function HomePage({ lang }: { lang: Language }) {
  const t = words[lang]
  const featured = sortFeaturedListings(listings).slice(0, 6)
  const exchangeHomes = sortFeaturedListings(listings.filter(canExchange)).slice(0, 6)
  return <>
    <div className="mobile-service-nav page-shell" aria-label={t.guide}><a href="#/rentals"><span>01</span>{t.quickRent}</a><a href="#/exchange"><span>02</span>{t.quickExchange}</a><a href="#/management"><span>03</span>{t.quickManage}</a></div>
    <section className="hero page-shell"><div className="hero-copy"><p className="eyebrow">KUAI LÜ JU / HOMES & STAYS</p><h1>{t.rentalLine}</h1><p className="hero-description">{t.intro}<br/>{t.homeNote}</p><p className="city-note">{t.cityNote}</p></div><div className="hero-visual"><img src={asset('/images/pattaya-concept.jpg')} alt={t.demo}/><span>{t.demo} / PATTAYA</span></div></section>
    <div className="search-wrap page-shell"><SearchPanel lang={lang} initial={emptyFilters}/></div>
    <section className="section page-shell home-property-section" id="homes"><div className="section-heading"><div><p className="eyebrow">01 / RENTAL HOMES</p><h2>{t.results}</h2></div><a className="text-link" href="#/rentals">{t.explore} <span>↗</span></a></div><p className="sample-inventory">{t.sampleInventory}</p><div className="listing-grid home-listing-grid">{featured.map(listing => <ListingCard key={listing.id} listing={listing} lang={lang}/>)}</div></section>
    <section className="section home-exchange-section" id="exchange-homes"><div className="page-shell"><div className="section-heading"><div><p className="eyebrow">02 / STAY EXCHANGE</p><h2>{t.exchange}</h2></div><a className="text-link" href="#/exchange">{t.more} <span>↗</span></a></div><p className="sample-inventory">{t.exchangeSectionNote} {t.sampleInventory}</p><div className="listing-grid home-listing-grid">{exchangeHomes.map(listing => <ListingCard key={listing.id} listing={listing} lang={lang} context="exchange"/>)}</div></div></section>
    <section className="section page-shell home-management-section" id="property-management"><div className="section-heading"><div><p className="eyebrow">03 / PROPERTY MANAGEMENT</p><h2>{t.manage}</h2></div><a className="text-link" href="#/management">{t.more} <span>↗</span></a></div><p className="sample-inventory">{t.homeManageNote}</p><ManagementCards lang={lang}/></section>
  </>
}

function RentalsPage({ lang, filters }: { lang: Language; filters: Filters }) {
  const t = words[lang]
  const found = filterListings(listings, filters)
  return <div className="page-shell page-top"><div className="page-title"><p className="eyebrow">01 / HOMES</p><h1>{t.rentalLine}</h1><p>{t.homeNote}</p></div><SearchPanel lang={lang} initial={filters} compact/><div className="results-bar"><div><h2>{t.results}</h2><span>{String(found.length).padStart(2, '0')} / {String(listings.length).padStart(2, '0')}</span></div>{(filters.city !== 'all' || filters.region !== 'all' || filters.term !== 'all') && <a href="#/rentals" className="text-link">{t.reset} ↗</a>}</div><p className="sample-inventory">{t.sampleInventory}</p>{found.length ? <div className="listing-grid">{found.map(item => <ListingCard key={item.id} listing={item} lang={lang}/>)}</div> : <div className="empty-state"><h3>{t.noResult}</h3><p>{t.noResultSub}</p><a className="button button-dark" href="#/rentals">{t.reset} ↗</a></div>}</div>
}

function PropertyGallery({ listing, lang }: { listing: Listing; lang: Language }) {
  const t = words[lang]
  const [active, setActive] = useState(0)
  const photo = listing.gallery[active]
  return <div className="property-gallery">
    <div className="detail-image"><img src={asset(photo.image)} alt={`${listing.title[lang]} · ${photo.caption[lang]}`}/><span>{t.demo} · {active + 1}/{listing.gallery.length}</span></div>
    <div className="gallery-foot"><p>{photo.caption[lang]}</p><div className="gallery-thumbs" aria-label={t.viewPhotos}>{listing.gallery.map((item, index) => <button key={item.image} type="button" className={active === index ? 'is-active' : ''} aria-label={`${t.viewPhotos} ${index + 1}: ${item.caption[lang]}`} aria-pressed={active === index} onClick={() => setActive(index)}><img src={asset(item.image)} alt="" loading="lazy"/></button>)}</div></div>
  </div>
}

function ListingBookingCard({ listing, lang, onAction }: { listing: Listing; lang: Language; onAction: (message: string) => void }) {
  const t = words[lang]
  const [term, setTerm] = useState<Term>(listing.terms.includes('quarter') ? 'quarter' : listing.terms[0])
  const [payment, setPayment] = useState<LeasePaymentOption>('one-two')
  const termMonths = term === 'quarter' ? 3 : term === 'year' ? 12 : term === 'month' ? 1 : 0
  const estimate = listing.priceUnit === 'month' ? estimateLeaseMoveIn(listing.price, termMonths, payment) : null
  const money = (value: number) => new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: listing.currency, maximumFractionDigits: 0 }).format(value)
  return <aside className="booking-card">
    <span className="eyebrow">{t.feeTitle} / {t.demo}</span>
    <div className="booking-price"><small>{t.baseRent}</small><strong>{formatPrice(listing, lang)}</strong></div>
    <div className="fee-lines"><div><span><LineIcon name="shield" size={17}/>{t.zeroAgency}</span><strong>{money(0)}</strong></div><div><span><LineIcon name="utility" size={17}/>{t.utilitiesActual}</span></div></div>
    {listing.priceUnit === 'month' && <div className="payment-example">
      <label className="term-control">{t.chooseTerm}<select value={term} onChange={event => setTerm(event.target.value as Term)}>{listing.terms.map(value => <option key={value} value={value}>{t[value]}</option>)}</select></label>
      {estimate ? <><p className="field-label">{t.paymentChoice}</p><div className="payment-options"><button type="button" className={payment === 'one-two' ? 'selected' : ''} aria-pressed={payment === 'one-two'} onClick={() => setPayment('one-two')}>{t.oneTwo}</button><button type="button" className={payment === 'two-one' ? 'selected' : ''} aria-pressed={payment === 'two-one'} onClick={() => setPayment('two-one')}>{t.twoOne}</button></div><p className="micro-note">{payment === 'one-two' ? t.oneTwoNote : t.twoOneNote}</p><div className="estimate-lines"><div><span>{t.deposit}</span><strong>{money(estimate.deposit)}</strong></div><div><span>{t.prepaidRent}</span><strong>{money(estimate.prepaidRent)}</strong></div><div className="estimate-total"><span>{t.initialDue}</span><strong>{money(estimate.initialDue)}</strong></div></div></> : <p className="micro-note">{t.paymentPending}</p>}
    </div>}
    <p className="booking-disclaimer">{t.datePending} {t.otherFees}</p>
    <a className="button button-dark" href={`#/request/rental/${listing.id}`}>{t.contact} <LineIcon name="arrow" size={17}/></a>
    {canExchange(listing) ? <div className="booking-exchange"><span>{t.ready}</span><p>{t.exchangeMini} {listing.city === 'pattaya' && t.exchangeThai}</p><a className="button button-light" href={`#/request/exchange/${listing.id}`}>{t.apply} <LineIcon name="arrow" size={17}/></a></div> : <button className="exchange-ineligible" onClick={() => onAction(t.ineligible)}>{t.noExchange} ⓘ</button>}
  </aside>
}

function ListingPage({ lang, id, onAction }: { lang: Language; id?: string; onAction: (message: string) => void }) {
  const t = words[lang]
  const listing = listings.find(item => item.id === id)
  if (!listing) return <div className="page-shell empty-state"><h1>{t.noResult}</h1><a href="#/rentals" className="button button-dark">{t.back}</a></div>
  const city = cities.find(c => c.id === listing.city)!
  const region = city.regions.find(r => r.id === listing.region)!
  return <div className="page-shell detail-page">
    <a className="back-link" href="#/rentals">← {t.back}</a>
    <div className="detail-heading"><div><p className="eyebrow">{city[lang]} / {region[lang]} / {t.demo}</p><h1>{listing.title[lang]}</h1><p>{listing.type[lang]} · {listing.highlight[lang]}</p></div><div className="detail-price"><span>{t.price}</span><strong>{formatPrice(listing, lang)}</strong></div></div>
    {canExchange(listing) && <div className="exchange-entry"><span>{t.ready}</span><a href={`#/request/exchange/${listing.id}`}>{t.apply} <LineIcon name="arrow" size={17}/></a></div>}
    <PropertyGallery key={listing.id} listing={listing} lang={lang}/>
    <div className="detail-layout"><div className="detail-main">
      <p className="eyebrow">THE SPACE / {t.sampleSpecs}</p><h2>{t.experience}</h2><p className="lead">{listing.description[lang]}</p>
      <div className="facts"><div><LineIcon name="guests"/><small>{t.occupants}</small><strong>{listing.guests}</strong></div><div><LineIcon name="bedroom"/><small>{t.rooms}</small><strong>{listing.bedrooms}</strong></div><div><LineIcon name="bed"/><small>{t.beds}</small><strong>{listing.beds}</strong></div><div><LineIcon name="bath"/><small>{t.baths}</small><strong>{listing.bathrooms}</strong></div><div><LineIcon name="area"/><small>{t.size}</small><strong>{listing.area} m²</strong></div></div>
      <ul className="feature-list">{listing.features.map(feature => <li key={feature.zh}><LineIcon name="check" size={17}/>{feature[lang]}</li>)}</ul>
      <h3>{t.amenities}</h3><div className="amenity-list">{listing.amenities.map(amenity => <span key={amenity.zh}><LineIcon name={amenityIcon(amenity.zh)} size={21}/>{amenity[lang]}</span>)}</div>
      <div className="detail-secondary"><h3>{t.terms}</h3><div className="term-list">{listing.terms.map(value => <span key={value}><LineIcon name="calendar" size={16}/>{t[value]}</span>)}</div><details><summary><LineIcon name="shield" size={17}/>{t.listingRules}</summary><p>{t.listingRulesPending}</p></details></div>
    </div><ListingBookingCard key={listing.id} listing={listing} lang={lang} onAction={onAction}/></div>
  </div>
}

function ExchangePage({ lang }: { lang: Language }) {
  const t = words[lang]
  const exchangeHomes = sortFeaturedListings(listings.filter(canExchange))
  const [draft, setDraft] = useState<ExchangeFilters>(emptyExchangeFilters)
  const [filters, setFilters] = useState<ExchangeFilters>(emptyExchangeFilters)
  const selectedCity = cities.find(city => city.id === draft.city)
  const found = exchangeHomes.filter(listing =>
    (filters.city === 'all' || listing.city === filters.city) &&
    (filters.region === 'all' || listing.region === filters.region) &&
    (filters.guests === 'all' || listing.guests >= Number(filters.guests)))
  const hasFilters = filters.city !== 'all' || filters.region !== 'all' || filters.guests !== 'all'
  return <>
    <section className="page-shell page-top exchange-catalog-page" id="exchange-list">
      <div className="page-title"><p className="eyebrow">02 / STAY EXCHANGE</p><h1>{t.exchangeLine}</h1><p>{t.exchangeIntro}</p></div>
      <form className="search-panel search-compact" onSubmit={event => { event.preventDefault(); setFilters(draft) }}>
        <label><span>{t.city}</span><select value={draft.city} onChange={event => setDraft(previous => ({ ...previous, city: event.target.value, region: 'all' }))}><option value="all">{t.allCities}</option>{cities.map(city => <option key={city.id} value={city.id}>{city[lang]}</option>)}</select></label>
        <label><span>{t.area}</span><select value={draft.region} onChange={event => setDraft(previous => ({ ...previous, region: event.target.value }))}><option value="all">{t.allAreas}</option>{selectedCity?.regions.map(region => <option key={region.id} value={region.id}>{region[lang]}</option>)}</select></label>
        <label><span>{t.guestsFilter}</span><select value={draft.guests} onChange={event => setDraft(previous => ({ ...previous, guests: event.target.value }))}><option value="all">{t.allGuests}</option>{[2, 4, 6, 8].map(count => <option key={count} value={count}>{t.guestsAtLeast} {count}</option>)}</select></label>
        <button className="button button-dark search-submit" type="submit"><span>{t.search}</span><span aria-hidden="true">↗</span></button>
      </form>
      <div className="results-bar"><div><h2>{t.exchangeResults}</h2><span>{String(found.length).padStart(2, '0')} / {String(exchangeHomes.length).padStart(2, '0')}</span></div>{hasFilters && found.length > 0 && <button className="text-link text-link-button" onClick={() => { setDraft(emptyExchangeFilters); setFilters(emptyExchangeFilters) }}>{t.reset} ↗</button>}</div>
      <p className="sample-inventory">{t.sampleInventory}</p>
      {found.length ? <div className="listing-grid">{found.map(listing => <ListingCard key={listing.id} listing={listing} lang={lang} context="exchange"/>)}</div> : <div className="empty-state"><h3>{t.noResult}</h3><p>{t.exchangeNoResultSub}</p><button className="button button-dark" onClick={() => { setDraft(emptyExchangeFilters); setFilters(emptyExchangeFilters) }}>{t.reset} ↗</button></div>}
    </section>
    <section className="exchange-visual page-shell"><div className="compare-image compare-a"><img src={asset('/images/pattaya-concept.jpg')} alt={t.demo}/><span>A / PATTAYA</span></div><div className="compare-center">↔</div><div className="compare-image compare-b"><img src={asset('/images/sanya-concept.jpg')} alt={t.demo}/><span>B / SANYA</span></div></section>
    <section className="page-shell exchange-body"><div className="exchange-lead"><p className="eyebrow">HOW IT WORKS</p><h2>{t.twoHomes}</h2><p>{t.twoHomesSub}</p></div><ol className="steps"><li><span>01</span>{t.step1}</li><li><span>02</span>{t.step2}</li><li><span>03</span>{t.step3}</li><li><span>04</span>{t.step4}</li></ol><div className="exchange-notes"><article><span>01 / ACCESS</span><h3>{t.eligibility}</h3><p>{t.eligibilityText}</p></article><article><span>02 / TIMING</span><h3>{t.separate}</h3><p>{t.separateSub}</p></article><article><span>03 / COST</span><h3>{t.fee}</h3><p>{t.feeBody}</p><p>{t.utility}</p></article></div><a className="button button-dark" href="#exchange-list" onClick={event => { event.preventDefault(); document.getElementById('exchange-list')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.explore} ↗</a></section>
  </>
}

function ServiceRegistration({ lang, mode }: { lang: Language; mode: 'leasing' | 'operation' | 'care' }) {
  const t = words[lang]
  const [cityId, setCityId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [area, setArea] = useState('')
  const city = cities.find(item => item.id === cityId)
  return <form className="service-registration" id="register-property" onSubmit={event => { event.preventDefault(); if (cityId && regionId && propertyType && Number(area) > 0) ManagementTestSubmit({ mode, city: cityId, region: regionId, propertyType, area: Number(area) }) }}>
    <p className="eyebrow">ENQUIRY / PREVIEW</p><h2>{t.registrationTitle}</h2><p className="registration-preview">{t.registrationPreview}</p><p className="registration-notice">{t.registrationNotice}</p>
    <div className="registration-fields">
      <label>{t.propertyCity}<select required value={cityId} onChange={event => { setCityId(event.target.value); setRegionId('') }}><option value="">{t.chooseOne}</option>{cities.map(item => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label>
      <label>{t.propertyRegion}<select required value={regionId} onChange={event => setRegionId(event.target.value)} disabled={!city}><option value="">{t.chooseOne}</option>{city?.regions.map(item => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label>
      <label>{t.propertyType}<select required value={propertyType} onChange={event => setPropertyType(event.target.value)}><option value="">{t.chooseOne}</option><option value="apartment">{t.apartment}</option><option value="villa">{t.villa}</option></select></label>
      <label>{t.propertySize}<input required type="number" min="1" inputMode="numeric" placeholder="m²" value={area} onChange={event => setArea(event.target.value)}/></label>
      <label>{t.contactPhone}<input type="tel" disabled placeholder={t.registrationDisabledPlaceholder}/></label>
      <label>{t.contactEmail}<input type="email" disabled placeholder={t.registrationDisabledPlaceholder}/></label>
    </div>
    <button className="button button-dark" type="submit">{t.registrationButton} ↗</button>
  </form>
}

function ManagementPage({ lang, mode }: { lang: Language; mode?: string }) {
  const t = words[lang]
  const modes = [
    { id: 'leasing', number: '01', title: t.lease, blurb: t.leaseBlurb, detail: t.leaseDetail, steps: t.leasingSteps },
    { id: 'operation', number: '02', title: t.operation, blurb: t.operationBlurb, detail: t.operationDetail, steps: t.operationSteps },
    { id: 'care', number: '03', title: t.care, blurb: t.careBlurb, detail: t.careDetail, steps: t.careSteps },
  ]
  const selected = modes.find(item => item.id === mode)
  if (!selected) return <div className="page-shell management-page"><div className="page-title"><p className="eyebrow">03 / PROPERTY CARE</p><h1>{t.manageLine}</h1><p>{t.manageIntro}</p></div><div className="management-intro"><h2>{t.choose}</h2><p>{t.cityNote}</p></div><ManagementCards lang={lang}/></div>
  return <div className="page-shell management-page management-service-page">
    <a href="#/management" className="back-link">← {t.manage}</a>
    <div className="service-specific-hero"><p className="eyebrow">{selected.number} / PROPERTY MANAGEMENT</p><h1>{selected.title}</h1><p>{selected.blurb}</p><button className="text-link text-link-button" onClick={() => document.getElementById('register-property')?.scrollIntoView({ behavior: 'smooth' })}>{t.registerAction} ↗</button></div>
    <ol className="service-flow">{selected.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
    <div className="service-detail-layout"><section className="service-summary"><p className="eyebrow">SERVICE / {selected.number}</p><h2>{t.serviceScope}</h2><p className="lead">{selected.detail}</p>{selected.id === 'leasing' && <div className="mode-facts"><p>{t.leaseFees}</p><p>{t.leaseTerms}</p></div>}{selected.id === 'operation' && <p className="mode-fact-note">{t.eligibilityText}</p>}{selected.id === 'care' && <details className="care-disclosure"><summary>{t.careMenu} ↗</summary><div className="care-menu">{t.careItems.map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, '0')}</i>{item}</span>)}</div></details>}<p className="micro-note">{t.termsNote}</p></section><ServiceRegistration key={selected.id} lang={lang} mode={selected.id as 'leasing' | 'operation' | 'care'}/></div>
  </div>
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute)
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('kuailvju-lang') as Language) || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'))
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => { const update = () => { setRoute(parseRoute()); setMessage(null); window.scrollTo({ top: 0, behavior: 'instant' }) }; window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.title = lang === 'zh' ? '快旅居｜好房源，心服务' : 'Kuai Lü Ju | Good homes. Thoughtful service.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', lang === 'zh'
      ? '快旅居：房屋租赁、旅居置换与物业托管。可体验完整站内测试流程，真实房源与交易待核验开放。'
      : 'Kuai Lü Ju: homes, stay exchange and property care. Explore interactive browser-only workflows; live homes and transactions follow verification.')
  }, [lang])
  const setLang = (next: Language) => { setLangState(next); localStorage.setItem('kuailvju-lang', next) }
  const t = words[lang]
  const content = useMemo(() => {
    if (route.page === 'rentals') return <RentalsPage lang={lang} filters={route.filters}/>
    if (route.page === 'listing') return <ListingPage lang={lang} id={route.id} onAction={setMessage}/>
    if (route.page === 'exchange') return <ExchangePage lang={lang}/>
    if (route.page === 'management') return <ManagementPage lang={lang} mode={route.mode}/>
    if (route.page === 'request' && route.mode === 'rental') return <RentalRequestPage lang={lang} listingId={route.id}/>
    if (route.page === 'request' && route.mode === 'exchange') return <ExchangeRequestPage lang={lang} listingId={route.id}/>
    if (route.page === 'test-inbox') return <TestInbox lang={lang}/>
    return <HomePage lang={lang}/>
  }, [route, lang])
  return <><Header lang={lang} setLang={setLang} route={route}/><main id="main-content">{content}</main><footer className="site-footer"><div className="page-shell"><div className="footer-top"><a className="footer-brand" href="#/">快旅居 <span>KUAI LÜ JU</span></a><nav aria-label="Footer"><a href="#/rentals">{t.rent}</a><a href="#/exchange">{t.exchange}</a><a href="#/management">{t.manage}</a></nav></div><div className="footer-bottom"><span>{t.footer}</span><p>{t.legal}</p><span>© {new Date().getFullYear()} KUAI LÜ JU</span></div></div></footer>{message && <div className="modal-backdrop" onClick={() => setMessage(null)}><div className="modal" role="dialog" aria-modal="true" aria-label={t.preview} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setMessage(null)} aria-label={t.close}>×</button><span className="eyebrow">PREVIEW NOTICE</span><h2>{t.preview}</h2><p>{message}</p><button className="button button-dark" onClick={() => setMessage(null)}>{t.understood} ↗</button></div></div>}</>
}
