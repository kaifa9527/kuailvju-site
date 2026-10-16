import { useEffect, useMemo, useRef, useState } from 'react'
import { ThemeSwitch } from './ThemeSwitch'
import { HomeFinder } from './HomeFinder'
import type { HomeMode } from './lib/homeDiscovery'
import { cities, listings, type Listing, type Term } from './data'
import { canExchange, estimateLeaseMoveIn, filterListings, formatPrice, longRentalMonthlyPrice, sortFeaturedListings, type Language, type LeasePaymentOption } from './lib/catalog'
import { LineIcon, amenityIcon } from './components/LineIcon'
import { NavGlyph } from './components/NavGlyph'
import { ExchangeGallery } from './components/ExchangeGallery'
import { ExchangeRequestPage, RentalRequestPage, TestInbox } from './TestFlows'
import { ManagementPage } from './ManagementPage'
import { ManagementEntry } from './ManagementEntry'
import { RoamPage } from './RoamPage'
import { ExchangeCatalogPage, ExchangeDetailPage } from './ExchangeExperience'
import { demoAvailable, filterExchangeHomes, parseExchangeSearch, localDate } from './lib/exchangeDiscovery'
import { handoverReady, leaseRange } from './lib/inventory'
import { readTestRequests } from './lib/testWorkflow'

type Filters = { city: string; region: string; type: string; term: string; moveIn: string; guestsMin: string; bedroomsMin: string; areaMin: string }
type Route = { page: string; id?: string; mode?: string; filters: Filters; query: string }
const emptyFilters: Filters = { city: 'all', region: 'all', type: 'all', term: 'all', moveIn: '', guestsMin: 'all', bedroomsMin: 'all', areaMin: 'all' }
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const words = {
  zh: {
    rent: '长租房', stays: '民宿房', exchange: '旅居置换', roam: '漫游', navRent: '长租', navStays: '短租', navExchange: '置换', manage: '物业托管', explore: '探索房源', more: '了解详情',
    preview: '置换资格提示', menu: '菜单', search: '查找房源', city: '城市', area: '区域', stay: '租期',
    homeSearchTitle: '按需求找房', searchRentals: '查找长租房', searchStays: '查找民宿房', searchExchange: '查找可置换房源', demoNotice: '当前为站内体验：房源、价格和档期均为示意；真实申请需经平台核验。',
    rentLead: '半年或一年起租 · 租客免中介费', staysLead: '按晚选择委托经营房源',
    exchangeWho: '长租业主先授权', exchangeWhoDetail: '委托租赁业主自愿授权空置可交付档期。民宿不参与置换。', exchangeHow: '双方匿名确认', exchangeHowDetail: '对照天数、面积、卧室与装修，各自确认房源和日期。', exchangeThen: '平台核验履约', exchangeThenDetail: '双房源共用库存，核对两段日期与交付能力。',
    exchangeFree: '住宿费', exchangeFreeValue: '对等互换可免', exchangeClean: '每次入住保洁', exchangeCleanValue: '¥600', exchangeDeposit: '入住押金', exchangeDepositValue: '目标房源月租', exchangeUtilities: '水电费用', exchangeUtilitiesValue: '实际抄表自付', exchangeCostNote: '仅已授权的委托租赁长租房参与。保洁费含入住前、退房后各一次；押金等于实际入住房源的一个月租金。面积、卧室、装修与各自实际入住天数用于推荐，地段和租金只作参考；芭提雅费用按确认时等值泰铢收取。', exchangeReference: '月租参考价 · 非置换应付', exchangeCardAction: '查看置换条件',
    allCities: '全部城市', allAreas: '全部区域', propertyType: '类型', allTypes: '全部类型', residential: '住宅', allTerms: '全部租期', moreOptions: '更多选项', moreFilters: '更多筛选', lessOptions: '收起选项', bedroomsFilter: '卧室数', allBedrooms: '不限卧室', areaFilter: '面积', allAreasMin: '不限面积', sort: '精选优先 · 最新补充', day: '日租', month: '月租', quarter: '季租', halfYear: '半年', year: '一年',
    results: '精选房源', exchangeResults: '可置换房源', exchangeIntro: '仅已授权的委托租赁长租房，且只开放空置可交付日期；民宿独立经营。', guestsFilter: '入住人数', allGuests: '不限人数', guestsAtLeast: '至少可住', reset: '清除筛选', noResult: '没有匹配的示意房源', noResultSub: '试试更换城市或租期。真实房源上线后，选择会持续增加。', exchangeNoResultSub: '试试更换城市、区域或入住人数。',
    demo: '示意房源', price: '示意价格', contact: '咨询房源', apply: '申请置换',
    ineligible: '民宿独立经营，不参与置换；未获授权的长租房也不能发起互换申请。',
    understood: '我知道了', back: '返回房源', ready: '业主已授权 · 可申请置换', noExchange: '暂不开放置换',
    occupants: '可住', room: '卧室', rooms: '卧室', baths: '卫生间', beds: '床位', size: '面积', experience: '居住体验', terms: '可选租期',
    quickRent: '长租', quickStays: '短租', quickExchange: '置换', quickManage: '漫游',
    sampleInventory: '以下房源及参数为页面示意，真实房源与可订日期待核验上线。',
    pinned: '置顶', exchangeBadge: '可置换 · 示意', exchangeMayWaive: '符合条件可免住宿费', exchangeCostsBrief: '保洁费 + 押金 + 水电',
    exchangeSectionNote: '仅已授权的委托租赁业主可申请。每次入住收 ¥600 入住前后保洁费；押金按目标长租房一个月租金，水电据实结算。已出租期间不可置换，芭提雅收等值泰铢。',
    homeManageNote: '委托租赁、委托经营、委托看护。选一种适合您房屋现状的方式。',
    roamLead: '住进一座城市，再走进它的日常。', roamNote: '三城本地活动体验 · 查看示意内容与站内预约流程',
    registrationTitle: '登记房源意向', serviceScope: '服务与收费', registrationPreview: '可测试提交流程 · 不收集真实资料',
    registrationNotice: '选择房屋信息后可生成一条站内测试记录，保存在当前浏览器。电话与邮箱暂不填写，也不会发送给平台。',
    propertyCity: '房源城市', propertyRegion: '所在区域', propertySize: '建筑面积（m²）',
    contactPhone: '联系电话', contactEmail: '联系邮箱', apartment: '公寓', villa: '别墅', chooseOne: '请选择', registrationButton: '提交测试登记', registerAction: '查看登记信息', registrationDisabledPlaceholder: '正式开放后填写',
    leasingSteps: ['评估房源', '签约上架', '招租成交', '收租对账'],
    operationSteps: ['评估授权', '民宿经营', '入住服务', '收益对账'],
    careSteps: ['选择服务', '每周巡检', '拍照留档', '查看报告'],
    viewPhotos: '查看示意图片', sampleSpecs: '配置示意', amenities: '空间与设施',
    feeTitle: '费用先看清', baseRent: '示意房费', zeroAgency: '租客中介费', utilitiesActual: '水电按实际用量结算',
    datePending: '真实可订日期暂未开放查询；提交或付款前须再次核对房态及最终报价。',
    chooseTerm: '选择租期', paymentChoice: '押付方式示意', deposit: '可退押金', prepaidRent: '预付租金', initialDue: '首次应付示意',
    oneTwo: '押一付二', twoOne: '押二付一', oneTwoNote: '1 个月押金 + 前 2 个月租金', twoOneNote: '2 个月押金 + 第 1 个月租金',
    paymentPending: '具体押付以当地核验与最终合同为准。',
    otherFees: '其他费用和取消规则待房源核验后公布，不在示意阶段给出虚假总价。',
    exchangeMini: '仅已授权的委托租赁业主可申请。每次入住另收 ¥600 前后两次保洁费；押金按入住房源一个月租金，水电据实自付。',
    exchangeThai: '芭提雅费用按确认时锁定的等值泰铢收取。',
    listingRules: '入住规则', listingRulesPending: '入住退房时间、宠物、吸烟及取消条款，在真实房源核验后逐项公布。',
    intro: '从一处好房，开启下一段生活。', homeNote: '选择城市与租期，先看好房。每一次入住，都有认真回应。',
    guide: '三种服务，一目了然',
    cityNote: '目前开放芭提雅、三亚、北海。更多城市将逐步加入。',
    rentalLine: '好房源，心服务。', exchangeLine: '一房托管，旅居世界。', manageLine: '专业、靠谱，知托付。',
    eligibility: '谁可以置换？', eligibilityText: '仅已签委托租赁且明确授权的长租房业主，可在空置可交付日期互换；民宿不参与。',
    twoHomes: '两套房源，并列比较', twoHomesSub: '实际入住天数、面积、卧室与装修同屏对照；地段、景观和租金只作参考，双方匿名确认。',
    step1: '选择目标房源', step2: '双方匿名确认', step3: '确定各自入住时间', step4: '支付服务费与押金',
    fee: '每人每次入住', feeBody: '双方认可相近条件后可免房费；各自每次入住付 ¥600 入住前后两次保洁费，押金按实际入住房源一个月租金收取；芭提雅收等值泰铢。',
    utility: '水电按入住前后实际抄表结算，由入住人承担；损坏或遗失按证据核算，多退少补。',
    separate: '双方入住日期可以不同', separateSub: '平台跟踪两个独立入住段，确认房源可用、交接与退房结算。',
    choose: '选择适合房屋的托管方式', manageIntro: '从稳定出租，到专业经营或定期看护，权责、收益与服务清晰可见。',
    lease: '委托租赁', operation: '委托经营', care: '委托看护',
    leaseBlurb: '免费展示与招租。租客免中介费，成交后由房东按租期支付佣金。',
    operationBlurb: '平台负责民宿经营与服务。日租扣除约定直接运营成本后，平台 30%，房东 70%；不参与置换。',
    careBlurb: '空置房定期照看。每周通风、检查、电器通电保护，并留存拍照记录。',
    leaseDetail: '免费上架与招租，成交后由房东按租期支付约定佣金；带看、签约及租务进度可跟踪。',
    leaseFees: '房东付佣金：半年租为半个月租金，一年租为一个月租金；也可另议固定到手租金与平台出租差额。',
    leaseTerms: '租客免中介费；符合租期条件时可选押一付二或押二付一，水电由租客按实际使用承担。',
    operationDetail: '平台负责民宿经营、现场服务与收益对账。按日计价房源的正常水电含在住宿费中；扣除约定且有凭证的直接成本后平台 30%、房东 70%。民宿不参与置换。',
    careDetail: '公寓与别墅分别报价。基础巡检之外，可按需组合升级项目。',
    careMenu: '可选升级服务', careItems: ['园林绿化修剪', '泳池维护', '深度清洁', '空调与除湿保养', '虫害防治', '软装与布草维护', '台风雨季专项巡检', '离家前封存与返家前准备'],
    termsNote: '具体价格、范围与服务记录，以当地方案和私密签约内容为准。',
    testDesk: '流程测试', language: '语言', close: '关闭', footer: '快旅居 · 房屋租赁与托管', legal: '房源与价格均为示意。可在当前浏览器测试流程，不构成真实预订、置换或交易。',
  },
  en: {
    rent: 'Long stays', stays: 'Short stays', exchange: 'Stay Exchange', roam: 'Explore', navRent: 'Long', navStays: 'Short', navExchange: 'Exchange', manage: 'Property Care', explore: 'Explore homes', more: 'View details',
    preview: 'Exchange eligibility', menu: 'Menu', search: 'Search', city: 'City', area: 'Area', stay: 'Stay',
    homeSearchTitle: 'Find your kind of stay', searchRentals: 'Search long stays', searchStays: 'Search short stays', searchExchange: 'Search exchange homes', demoNotice: 'Interactive preview: homes, prices and dates are examples. Live requests require platform verification.',
    rentLead: 'Six or twelve months · no tenant agency fee', staysLead: 'Operated homes for nightly stays',
    exchangeWho: 'Long-stay owner opt-in', exchangeWhoDetail: 'Entrusted-leasing owners offer vacant, deliverable dates. Short stays do not join exchange.', exchangeHow: 'Both decide anonymously', exchangeHowDetail: 'Compare actual nights, size, bedrooms and condition before confirming.', exchangeThen: 'Platform verifies', exchangeThenDetail: 'Both homes share inventory; we check both stays and delivery.',
    exchangeFree: 'Accommodation', exchangeFreeValue: 'May be waived', exchangeClean: 'Cleaning per stay', exchangeCleanValue: '¥600', exchangeDeposit: 'Stay deposit', exchangeDepositValue: 'Target monthly rent', exchangeUtilities: 'Utilities', exchangeUtilitiesValue: 'Metered usage', exchangeCostNote: 'Only authorized entrusted long-stay homes may join. The fee covers one clean before and after a stay; the deposit equals one month of the home actually occupied. Nights, size, bedrooms and condition guide matching; location and rent are references only. Pattaya collects the confirmed THB equivalent.', exchangeReference: 'Monthly reference · not exchange due', exchangeCardAction: 'See exchange terms',
    allCities: 'All cities', allAreas: 'All areas', propertyType: 'Type', allTypes: 'All types', residential: 'Residential', allTerms: 'All stays', moreOptions: 'More options', moreFilters: 'More filters', lessOptions: 'Hide options', bedroomsFilter: 'Bedrooms', allBedrooms: 'Any bedrooms', areaFilter: 'Area', allAreasMin: 'Any area', sort: 'Featured first · newest next', day: 'Daily', month: 'Monthly', quarter: 'Quarterly', halfYear: '6 months', year: '1 year',
    results: 'Featured homes', exchangeResults: 'Exchange homes', exchangeIntro: 'Only authorized entrusted long-stay homes on vacant, deliverable dates. Short stays operate separately.', guestsFilter: 'Guests', allGuests: 'Any number', guestsAtLeast: 'Sleeps at least', reset: 'Clear filters', noResult: 'No concept homes match', noResultSub: 'Try a different city or stay length. More choices will appear when live inventory launches.', exchangeNoResultSub: 'Try another city, area or guest count.',
    demo: 'Concept home', price: 'Sample price', contact: 'Ask about this home', apply: 'Request exchange',
    ineligible: 'Short stays operate separately and do not join exchange. An unauthorized long-stay home cannot receive an exchange request either.',
    understood: 'Got it', back: 'Back to homes', ready: 'Owner authorized · Exchange eligible', noExchange: 'Exchange unavailable',
    occupants: 'Sleeps', room: 'Bedroom', rooms: 'Bedrooms', baths: 'Bathrooms', beds: 'Beds', size: 'Area', experience: 'The space', terms: 'Stay options',
    quickRent: 'Long', quickStays: 'Short', quickExchange: 'Exchange', quickManage: 'Explore',
    sampleInventory: 'Homes and details below are illustrative. Live inventory and dates require verification.',
    pinned: 'Pinned', exchangeBadge: 'Exchange eligible · concept', exchangeMayWaive: 'Eligible stays may waive rent', exchangeCostsBrief: 'Cleaning + deposit + utilities',
    exchangeSectionNote: 'Only authorized entrusted-leasing owners may apply. Each stay has a ¥600 pre/post-stay cleaning fee, a deposit equal to the occupied home’s monthly rent and metered utilities. Tenanted dates are unavailable. Pattaya charges the THB equivalent.',
    homeManageNote: 'Leasing, full management or home care. Choose the service that fits your property.',
    roamLead: 'Find a place to stay. Then explore its everyday life.', roamNote: 'Local activity concepts in three cities · preview the booking flow',
    registrationTitle: 'Register a property enquiry', serviceScope: 'Service & fees', registrationPreview: 'Interactive workflow test · no real details collected',
    registrationNotice: 'Submit property choices to create a browser-only test record. Phone and email remain disabled; nothing is sent to the platform.',
    propertyCity: 'Property city', propertyRegion: 'Area', propertySize: 'Floor area (m²)',
    contactPhone: 'Phone', contactEmail: 'Email', apartment: 'Apartment', villa: 'Villa', chooseOne: 'Select', registrationButton: 'Submit test enquiry', registerAction: 'View registration fields', registrationDisabledPlaceholder: 'Available after launch',
    leasingSteps: ['Assess home', 'Sign & list', 'Find tenant', 'Reconcile rent'],
    operationSteps: ['Assess & authorize', 'Operate short stays', 'Serve guests', 'Review earnings'],
    careSteps: ['Choose care', 'Weekly visit', 'Photo record', 'Review report'],
    viewPhotos: 'View concept images', sampleSpecs: 'Illustrative details', amenities: 'Space & amenities',
    feeTitle: 'See the costs first', baseRent: 'Sample rent', zeroAgency: 'Tenant agency fee', utilitiesActual: 'Utilities billed by actual use',
    datePending: 'Live dates are not connected yet. Availability and final quotes must be checked before applying or paying.',
    chooseTerm: 'Choose a term', paymentChoice: 'Sample payment choices', deposit: 'Refundable deposit', prepaidRent: 'Prepaid rent', initialDue: 'Sample amount due now',
    oneTwo: '1 + 2', twoOne: '2 + 1', oneTwoNote: '1 month deposit + first 2 months rent', twoOneNote: '2 months deposit + first month rent',
    paymentPending: 'Final payment options depend on local review and the contract.',
    otherFees: 'Other charges and cancellation terms will be published after property review. No invented total is shown in this preview.',
    exchangeMini: 'Only authorized entrusted-leasing owners may apply. Each stay has a ¥600 pre/post-stay cleaning fee, a deposit equal to the occupied home’s monthly rent, and metered utilities.',
    exchangeThai: 'Pattaya collects the locked THB equivalent at confirmation.',
    listingRules: 'Stay rules', listingRulesPending: 'Check-in/out times, pets, smoking and cancellation terms will be published after each real home is verified.',
    intro: 'A good home for the next chapter.', homeNote: 'Pick a city and stay length, then discover a place that feels right.',
    guide: 'Three clear ways to begin',
    cityNote: 'Now focusing on Pattaya, Sanya and Beihai. More cities will follow.',
    rentalLine: 'Good homes. Thoughtful service.', exchangeLine: 'One home entrusted. A world to stay in.', manageLine: 'Professional care. Trust well placed.',
    eligibility: 'Who can exchange?', eligibilityText: 'Only owners of entrusted long-stay homes with express authorization may exchange vacant, deliverable dates. Short stays do not join.',
    twoHomes: 'Two homes, side by side', twoHomesSub: 'Compare actual nights, size, bedrooms and condition. Location, views and rent remain references; both owners decide anonymously.',
    step1: 'Choose a home', step2: 'Confirm anonymously', step3: 'Agree on both stay dates', step4: 'Pay fee and deposit',
    fee: 'Per person, per stay', feeBody: 'When both owners approve a comparable exchange, accommodation rent may be waived. Each pays ¥600 for pre/post-stay cleaning and a deposit equal to one month of the occupied home’s rent. Pattaya collects the THB equivalent.',
    utility: 'Guests pay actual metered utilities. Evidence-based loss or damage charges are settled against the deposit, with any difference refunded or collected.',
    separate: 'Stay dates may differ', separateSub: 'The platform tracks two separate stays, including availability, handover and checkout.',
    choose: 'Choose the right care for your home', manageIntro: 'From stable leasing to active operation or regular care, understand the service and earning model at a glance.',
    lease: 'Leasing', operation: 'Managed operation', care: 'Home care',
    leaseBlurb: 'Free listing and leasing support. Tenants pay no agency fee; owners pay commission after a successful lease.',
    operationBlurb: 'We operate short stays and serve guests. Net proceeds after agreed direct costs split 30% platform / 70% owner. These homes do not join exchange.',
    careBlurb: 'Routine visits to an idle home: weekly ventilation, checks, electrical protection and photo records.',
    leaseDetail: 'Free listing and leasing support. Owners pay the agreed commission only after a successful lease; viewing, signing and rent progress can be tracked.',
    leaseFees: 'Owner-paid commission: half a month for a six-month lease or one month for a one-year lease. A fixed take-home rent model can be agreed separately.',
    leaseTerms: 'Tenants pay no agency fee. Where the lease term permits, choose one-month deposit with two months’ rent or two-month deposit with one month’s rent. Tenants pay actual utilities.',
    operationDetail: 'We manage short-stay operations, on-site service and earnings. Normal utilities are included in the guest rate; agreed, documented direct costs are deducted once before the platform receives 30% and the owner 70%. Short stays do not join exchange.',
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
    page: parts[0] || 'home', id: parts[0] === 'listing' || parts[0] === 'roam' ? parts[1] : parts[0] === 'request' || (parts[0] === 'exchange' || parts[0] === 'stays') && parts[1] === 'home' ? parts[2] : undefined,
    mode: parts[0] === 'management' || parts[0] === 'request' ? parts[1] : undefined,
    filters: { city: params.get('city') || 'all', region: params.get('region') || 'all', type: params.get('type') || 'all', term: params.get('term') || 'all', moveIn: params.get('moveIn') || '', guestsMin: params.get('guests') || 'all', bedroomsMin: params.get('bedrooms') || 'all', areaMin: params.get('area') || 'all' },
    query,
  }
}

function rentalsHash(filters: Filters) {
  const params = new URLSearchParams()
  if (filters.city !== 'all') params.set('city', filters.city)
  if (filters.region !== 'all') params.set('region', filters.region)
  if (filters.type !== 'all') params.set('type', filters.type)
  if (filters.term !== 'all') params.set('term', filters.term)
  if (filters.moveIn) params.set('moveIn', filters.moveIn)
  if (filters.guestsMin !== 'all') params.set('guests', filters.guestsMin)
  if (filters.bedroomsMin !== 'all') params.set('bedrooms', filters.bedroomsMin)
  if (filters.areaMin !== 'all') params.set('area', filters.areaMin)
  return `#/rentals${params.size ? `?${params}` : ''}`
}

function Header({ lang, setLang, route, mode, onModeChange, onSearch }: {
  lang: Language; setLang: (v: Language) => void; route: Route;
  mode: HomeMode; onModeChange: (mode: HomeMode) => void; onSearch: (mode: HomeMode, query: string) => void
}) {
  const t = words[lang]
  const isHome = route.page === 'home'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 180)
  const [searchOpen, setSearchOpen] = useState(false)
  const [homeHeight, setHomeHeight] = useState(() => window.innerWidth <= 760 ? 430 : 230)
  const [searchSummary, setSearchSummary] = useState<[string, string, string]>([
    lang === 'zh' ? '全部城市' : 'Anywhere',
    lang === 'zh' ? '不限日期' : 'Any date',
    lang === 'zh' ? '不限条件' : 'Any options',
  ])
  const headerRef = useRef<HTMLElement>(null)
  const expanded = !scrolled || searchOpen
  const modeLabel = mode === 'rentals' ? t.navRent : mode === 'stays' ? t.navStays : mode === 'exchange' ? t.navExchange : t.roam
  const nav = [
    { href: '#/rentals', label: t.navRent, key: 'rentals' as const },
    { href: '#/stays', label: t.navStays, key: 'stays' as const },
    { href: '#/exchange', label: t.navExchange, key: 'exchange' as const },
    { href: '#/roam', label: t.roam, key: 'roam' as const },
  ]

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [route.page])
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 180)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])
  useEffect(() => {
    if (!isHome || !expanded || !headerRef.current) return
    const node = headerRef.current
    const measure = () => setHomeHeight(Math.ceil(node.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [isHome, expanded])
  useEffect(() => {
    if (!isHome || !searchOpen || !scrolled) return
    const onOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setSearchOpen(false)
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [isHome, searchOpen, scrolled])
  useEffect(() => {
    if (scrolled && searchOpen) headerRef.current?.querySelector<HTMLSelectElement>('.home-discovery-destination select')?.focus()
  }, [scrolled, searchOpen])

  return <>
    {isHome && <div className="home-header-space" style={{ height: homeHeight }} aria-hidden="true"/>}
    <header ref={headerRef} className={'site-header clear-site-header' + (isHome ? ' home-affixed' + (expanded ? ' home-expanded' : ' home-collapsed') : '')}>
      <div className="header-inner">
        <a className="brand" href="#/" aria-label={lang === 'zh' ? '快旅居首页' : 'Kuai Lü Ju home'}>
          <span className="brand-mark">快</span><span className="brand-name">快旅居<span>KUAI LÜ JU</span></span>
        </a>
        <nav className="primary-nav clear-primary-nav" aria-label={t.menu}>
          {nav.map(item => <a key={item.key} href={item.href}
            aria-current={isHome ? undefined : route.page === item.key ? 'page' : undefined}
            className={(isHome ? mode === item.key : route.page === item.key) ? 'is-current' : ''}
            onClick={event => {
              if (isHome) { event.preventDefault(); onModeChange(item.key) }
              setOpen(false)
            }}><NavGlyph name={item.key} size={22}/><span>{item.label}</span></a>)}
          <a href="#/management" className={'nav-owner-service' + (route.page === 'management' ? ' is-current' : '')}
            aria-label={t.manage} title={t.manage} onClick={() => setOpen(false)}>
            <NavGlyph name="management" size={22}/><span>{lang === 'zh' ? '委托' : 'Owners'}</span>
          </a>
        </nav>
        {isHome && <button type="button" className="home-compact-search" aria-controls="home-search-panel"
          aria-expanded={expanded} aria-label={(lang === 'zh' ? '展开搜索：' : 'Expand search: ') + modeLabel + ' · ' + searchSummary.join(' · ')}
          onClick={() => { setSearchOpen(true); setOpen(false) }}>
          <span className="compact-search-mode">{modeLabel}</span>
          <span className="compact-search-detail">{searchSummary[0]}</span>
          <span className="compact-search-detail">{searchSummary[1]}</span>
          <span className="compact-search-detail compact-search-extra">{searchSummary[2]}</span>
          <span className="compact-search-icon"><LineIcon name="search" size={18}/></span>
        </button>}
        <div className="header-actions clear-header-actions">
          <ThemeSwitch lang={lang}/>
          <button className="language-switch" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={t.language + ': ' + (lang === 'zh' ? 'English' : '中文')}>{lang === 'zh' ? 'EN' : '中'}</button>
          <button className="menu-button" aria-expanded={open} aria-label={t.menu} onClick={() => { setOpen(value => !value); setSearchOpen(false) }}><span></span><span></span></button>
        </div>
      </div>
      {open && <nav className="mobile-utility-menu" aria-label={t.menu}>
        <a href="#/test-inbox" onClick={() => setOpen(false)}>{t.testDesk}</a>
      </nav>}
      {isHome && <div className="home-finder-stage" id="home-search-panel" aria-hidden={!expanded}>
        <HomeFinder lang={lang} mode={mode} onSearch={onSearch} onSummaryChange={setSearchSummary}/>
        {scrolled && searchOpen && <button type="button" className="home-finder-dismiss" aria-label={t.close}
          onClick={() => setSearchOpen(false)}><LineIcon name="close" size={18}/></button>}
      </div>}
    </header>
  </>
}

function SearchPanel({ lang, initial, searchLabel, onSummaryChange }: { lang: Language; initial: Filters; searchLabel?: string; onSummaryChange?: (summary: [string, string, string]) => void }) {
  const t = words[lang]
  const [draft, setDraft] = useState(initial)
  const [active, setActive] = useState<'where' | 'when' | 'term' | 'filters' | null>(null)
  const finder = useRef<HTMLDivElement>(null)
  const serialized = rentalsHash(initial)
  useEffect(() => { setDraft(initial) }, [serialized])
  useEffect(() => {
    if (!active) return
    const closeOutside = (event: PointerEvent) => { if (!finder.current?.contains(event.target as Node)) setActive(null) }
    const closeEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setActive(null) }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape) }
  }, [active])
  const city = cities.find(item => item.id === draft.city)
  const update = (part: Partial<Filters>) => setDraft(previous => ({ ...previous, ...part }))
  const commit = (next: Filters) => { setDraft(next); setActive(null); window.location.hash = rentalsHash(next) }
  const activeFilters = initial.type !== 'all' || initial.guestsMin !== 'all' || initial.bedroomsMin !== 'all' || initial.areaMin !== 'all'
  const termLabel = draft.term === 'halfYear' ? t.halfYear : draft.term === 'year' ? t.year : t.allTerms
  const cityLabel = draft.city === 'all' ? t.allCities : city?.[lang] || t.allCities
  const regionLabel = draft.region === 'all' ? t.allAreas : city?.regions.find(item => item.id === draft.region)?.[lang] || t.allAreas
  useEffect(() => { onSummaryChange?.([cityLabel, draft.moveIn || (lang === 'zh' ? '选择日期' : 'Add dates'), termLabel]) }, [onSummaryChange, cityLabel, draft.moveIn, lang, termLabel])
  const clear = () => commit(emptyFilters)
  return <div className="compact-finder rental-finder" ref={finder}>
    <div className="compact-searchbar rental-searchbar" role="search">
      <button type="button" className={`compact-segment rental-city${active === 'where' ? ' is-open' : ''}`} onClick={() => setActive(active === 'where' ? null : 'where')} aria-expanded={active === 'where'}><LineIcon name="window" size={18}/><span><small>{t.city}</small><strong>{cityLabel}</strong></span></button>
      <button type="button" className={`compact-segment rental-area${active === 'where' ? ' is-open' : ''}`} onClick={() => setActive(active === 'where' ? null : 'where')} aria-expanded={active === 'where'}><LineIcon name="area" size={18}/><span><small>{t.area}</small><strong>{regionLabel}</strong></span></button>
      <button type="button" className={`compact-segment rental-type${active === 'when' ? ' is-open' : ''}`} onClick={() => setActive(active === 'when' ? null : 'when')} aria-expanded={active === 'when'}><LineIcon name="calendar" size={18}/><span><small>{lang === 'zh' ? '计划起租' : 'Move in'}</small><strong>{draft.moveIn || (lang === 'zh' ? '选择日期' : 'Choose date')}</strong></span></button>
      <button type="button" className={`compact-segment rental-term${active === 'term' ? ' is-open' : ''}`} onClick={() => setActive(active === 'term' ? null : 'term')} aria-expanded={active === 'term'}><LineIcon name="calendar" size={18}/><span><small>{t.stay}</small><strong>{termLabel}</strong></span></button>
      <button type="button" className="compact-submit" onClick={() => commit(draft)} aria-label={searchLabel || t.search}><span>{searchLabel || t.search}</span><LineIcon name="arrow" size={18}/></button>
    </div>
    <button type="button" className="compact-mobile-trigger" onClick={() => setActive(active ? null : 'where')} aria-expanded={active !== null}><LineIcon name="window" size={19}/><span><strong>{cityLabel}</strong><small>{regionLabel} · {draft.moveIn || (lang === 'zh' ? '待选起租日' : 'Any date')} · {termLabel}</small></span><LineIcon name="arrow" size={18}/></button>
    <div className="compact-quick-filters rental-quick-filters">
      <button type="button" className={`compact-filter-entry${active === 'filters' ? ' selected' : ''}`} onClick={() => setActive(active === 'filters' ? null : 'filters')} aria-expanded={active === 'filters'}><LineIcon name="check" size={17}/>{t.moreFilters}</button>
      <span className="compact-quick-rule" aria-hidden="true"/>
      <button type="button" className={initial.type === 'villa' ? 'selected' : ''} aria-pressed={initial.type === 'villa'} onClick={() => commit({ ...initial, type: initial.type === 'villa' ? 'all' : 'villa' })}>{t.villa}</button>
      <button type="button" className={initial.bedroomsMin === '2' ? 'selected' : ''} aria-pressed={initial.bedroomsMin === '2'} onClick={() => commit({ ...initial, bedroomsMin: initial.bedroomsMin === '2' ? 'all' : '2' })}>{lang === 'zh' ? '2 间卧室+' : '2+ bedrooms'}</button>
      <button type="button" className={initial.guestsMin === '4' ? 'selected' : ''} aria-pressed={initial.guestsMin === '4'} onClick={() => commit({ ...initial, guestsMin: initial.guestsMin === '4' ? 'all' : '4' })}>{lang === 'zh' ? '可住 4 人+' : 'Sleeps 4+'}</button>
      <button type="button" className={initial.areaMin === '80' ? 'selected' : ''} aria-pressed={initial.areaMin === '80'} onClick={() => commit({ ...initial, areaMin: initial.areaMin === '80' ? 'all' : '80' })}>{lang === 'zh' ? '80㎡+' : '80 m²+'}</button>
      {(activeFilters || initial.city !== 'all' || initial.region !== 'all' || initial.term !== 'all' || initial.moveIn) && <button type="button" className="compact-clear" onClick={clear}>{lang === 'zh' ? '清除' : 'Clear'} ×</button>}
    </div><p className="compact-quick-hint" aria-hidden="true">{lang === 'zh' ? '左右滑动查看更多筛选 →' : 'Swipe for more filters →'}</p>
    {active && <div className="compact-popover compact-popover-filters rental-popover" role="dialog" aria-label={t.moreFilters}>
      <div className="compact-popover-top"><div className="compact-popover-tabs"><button type="button" className={active === 'where' ? 'selected' : ''} onClick={() => setActive('where')}>{t.city} / {t.area}</button><button type="button" className={active === 'when' ? 'selected' : ''} onClick={() => setActive('when')}>{lang === 'zh' ? '起租日期' : 'Move in'}</button><button type="button" className={active === 'term' ? 'selected' : ''} onClick={() => setActive('term')}>{t.stay}</button><button type="button" className={active === 'filters' ? 'selected' : ''} onClick={() => setActive('filters')}>{t.moreFilters}</button></div><button type="button" className="compact-close" aria-label={lang === 'zh' ? '关闭搜索' : 'Close search'} onClick={() => setActive(null)}><LineIcon name="close" size={18}/></button></div>
      {active === 'where' && <div className="compact-popover-body"><p className="compact-panel-label">{t.city}</p><div className="compact-choice-grid"><button type="button" className={draft.city === 'all' ? 'selected' : ''} onClick={() => update({ city: 'all', region: 'all' })}>{t.allCities}</button>{cities.map(item => <button type="button" key={item.id} className={draft.city === item.id ? 'selected' : ''} onClick={() => update({ city: item.id, region: 'all' })}>{item[lang]}</button>)}</div>{city && <><p className="compact-panel-label">{t.area}</p><div className="compact-choice-grid"><button type="button" className={draft.region === 'all' ? 'selected' : ''} onClick={() => update({ region: 'all' })}>{t.allAreas}</button>{city.regions.map(item => <button type="button" key={item.id} className={draft.region === item.id ? 'selected' : ''} onClick={() => update({ region: item.id })}>{item[lang]}</button>)}</div></>}</div>}
      {active === 'when' && <div className="compact-popover-body"><p className="compact-panel-label">{lang === 'zh' ? '计划起租日期' : 'Preferred move-in date'}</p><label className="compact-date-field"><input type="date" min={localDate()} value={draft.moveIn} onChange={event => update({ moveIn: event.target.value })}/></label><p className="micro-note">{lang === 'zh' ? '检查从该日起完整连续的半年或一年；未选日期时房态待核验。' : 'Checks the full continuous six-month or one-year lease. Without a date, availability needs review.'}</p></div>}
      {active === 'term' && <div className="compact-popover-body"><p className="compact-panel-label">{t.stay}</p><div className="compact-choice-grid"><button type="button" className={draft.term === 'all' ? 'selected' : ''} onClick={() => update({ term: 'all' })}>{t.allTerms}</button>{(['halfYear', 'year'] as Term[]).map(term => <button type="button" key={term} className={draft.term === term ? 'selected' : ''} onClick={() => update({ term })}>{t[term]}</button>)}</div></div>}
      {active === 'filters' && <div className="compact-popover-body"><p className="compact-panel-label">{t.propertyType}</p><div className="compact-choice-grid"><button type="button" className={draft.type === 'all' ? 'selected' : ''} onClick={() => update({ type: 'all' })}>{t.allTypes}</button><button type="button" className={draft.type === 'apartment' ? 'selected' : ''} onClick={() => update({ type: 'apartment' })}>{t.apartment}</button><button type="button" className={draft.type === 'villa' ? 'selected' : ''} onClick={() => update({ type: 'villa' })}>{t.villa}</button><button type="button" className={draft.type === 'residential' ? 'selected' : ''} onClick={() => update({ type: 'residential' })}>{t.residential}</button></div><p className="compact-panel-label">{t.moreFilters}</p><div className="compact-number-filters"><label>{t.guestsFilter}<select value={draft.guestsMin} onChange={event => update({ guestsMin: event.target.value })}><option value="all">{t.allGuests}</option><option value="2">{t.guestsAtLeast} 2</option><option value="4">{t.guestsAtLeast} 4</option><option value="6">{t.guestsAtLeast} 6</option></select></label><label>{t.bedroomsFilter}<select value={draft.bedroomsMin} onChange={event => update({ bedroomsMin: event.target.value })}><option value="all">{t.allBedrooms}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label><label>{t.areaFilter}<select value={draft.areaMin} onChange={event => update({ areaMin: event.target.value })}><option value="all">{t.allAreasMin}</option><option value="60">60 m²+</option><option value="80">80 m²+</option><option value="100">100 m²+</option></select></label></div></div>}
      <div className="compact-popover-actions"><button type="button" className="compact-text-action" onClick={clear}>{lang === 'zh' ? '清除全部' : 'Clear all'}</button><button type="button" className="button button-dark" onClick={() => commit(draft)}>{lang === 'zh' ? '应用筛选' : 'Apply'} <LineIcon name="arrow" size={17}/></button></div>
    </div>}
  </div>
}

function ListingCard({ listing, lang, context = 'rentals', query = '', pendingInspection = false, serviceCaption = false }: { listing: Listing; lang: Language; context?: 'rentals' | 'stays' | 'exchange'; query?: string; pendingInspection?: boolean; serviceCaption?: boolean }) {
  const t = words[lang]
  const city = cities.find(c => c.id === listing.city)!
  const region = city.regions.find(r => r.id === listing.region)!
  return <a className={`listing-card ${context === 'exchange' ? 'listing-card-exchange' : ''}`} href={context === 'exchange' ? `#/exchange/home/${listing.id}` : context === 'stays' ? `#/stays/home/${listing.id}` : `#/listing/${listing.id}${query ? `?${query}` : ''}`}>
    <div className="listing-image"><img src={asset(listing.gallery[0].image)} alt={`${listing.title[lang]} — ${t.demo}`} loading="lazy"/><span className="image-label">{t.demo}</span>{listing.pinned && <span className="listing-pinned">{t.pinned}</span>}</div>
    <div className="listing-content"><div className="listing-eyebrow">{city[lang]} · {region[lang]} <span>/{listing.type[lang]}</span></div><h3>{listing.title[lang]}</h3>{serviceCaption && context === 'stays' && <p className="listing-service-caption">{lang === 'zh' ? '提供日租/短租服务' : 'Daily stays · Short-term rentals'}</p>}<p>{listing.highlight[lang]} <span>·</span> {listing.bedrooms} {(listing.bedrooms === 1 ? t.room : t.rooms).toLowerCase()} <span>·</span> {listing.area} m²</p><div className="listing-terms">{context === 'exchange' ? <span>{t.exchangeBadge}</span> : context === 'stays' ? <span>{lang === 'zh' ? '按晚入住' : 'Nightly stays'}</span> : listing.terms.map(term => <span key={term}>{t[term]}</span>)}{pendingInspection && <span className="listing-inspection-badge">{lang === 'zh' ? '预计可入住 · 待验房' : 'Estimated · inspection pending'}</span>}</div><div className="listing-bottom">{context === 'exchange' ? <><div><small>{t.exchangeReference}</small><span className="exchange-reference-price">{formatPrice(listing, lang)}</span></div><span className="exchange-card-action">{t.exchangeCardAction} <LineIcon name="arrow" size={16}/></span></> : <><div><small>{context === 'rentals' ? (lang === 'zh' ? '一年基础月租 · 半年上浮10%' : 'Annual base monthly rent · +10% for six months') : t.price}</small><strong>{formatPrice(listing, lang)}</strong></div><span className="circle-arrow" aria-hidden="true">↗</span></>}</div></div>
  </a>
}

function ManagementCards({ lang }: { lang: Language }) {
  const t = words[lang]
  return <div className="management-grid">
    <a className="management-card" href="#/management?service=leasing"><span>01 / SERVICE</span><h3>{t.lease}</h3><p>{t.leaseBlurb}</p><b>{t.more} ↗</b></a>
    <a className="management-card" href="#/management?service=operation"><span>02 / SERVICE</span><h3>{t.operation}</h3><p>{t.operationBlurb}</p><b>{t.more} ↗</b></a>
    <a className="management-card" href="#/management?service=care"><span>03 / SERVICE</span><h3>{t.care}</h3><p>{t.careBlurb}</p><b>{t.more} ↗</b></a>
  </div>
}

function HomePage({ lang, mode, query }: { lang: Language; mode: HomeMode; query: string }) {
  const t = words[lang]
  const params = new URLSearchParams(query)
  const filteredLong = sortFeaturedListings(filterListings(listings.filter(item => item.management === 'leased'), {
    city: params.get('city') || 'all', region: params.get('region') || 'all',
    term: params.get('term') || 'all',
  })).filter(item => !params.get('moveIn') || (params.get('term') === 'all' ? item.terms : [params.get('term')!]).some(term => {
    const range = leaseRange(params.get('moveIn')!, term)
    return Boolean(range && demoAvailable(item.id, range))
  }))
  const exchangeSearch = parseExchangeSearch(params)
  const shortStayHomes = sortFeaturedListings(filterExchangeHomes(listings, exchangeSearch, localDate(), 'stays'))
  const exchangeHomes = sortFeaturedListings(filterExchangeHomes(listings, exchangeSearch, localDate(), 'exchange'))
  const headings = { rentals: t.rent, stays: t.stays, exchange: t.exchange, roam: t.roam }
  const homes = mode === 'rentals' ? filteredLong : mode === 'stays' ? shortStayHomes : exchangeHomes
  const validRoamCategory = params.get('category') === 'all' || !params.get('category') || params.get('category') === 'experiences'
  const empty = lang === 'zh' ? '暂无符合条件的演示结果，请尝试调整搜索条件。' : 'No demo results match. Try different filters.'
  return <section className="section page-shell home-property-section home-active-results" aria-label={headings[mode]}>
    <div className="section-heading"><h2>{headings[mode]}</h2><span className="home-results-count">{mode === 'roam' ? (validRoamCategory ? '03' : '00') : String(homes.length).padStart(2, '0')}</span></div>
    {mode === 'roam'
      ? <RoamPage lang={lang} query={query} embedded hideSearch/>
      : homes.length
        ? <div className="listing-grid home-listing-grid">
            {homes.map((listing, index) => <ListingCard key={listing.id} listing={listing} lang={lang}
              context={mode} serviceCaption={mode === 'stays' && index === 0}/>)}
          </div>
        : <div className="empty-state"><p>{empty}</p></div>}
    <p className="home-discovery-results-note">{lang === 'zh' ? '仅供站内演示，真实可订房态、价格及档期以核验为准。' : 'Preview inventory only; real pricing and availability require verification.'}</p>
  </section>
}

function RentalsPage({ lang, filters }: { lang: Language; filters: Filters }) {
  const t = words[lang]
  const requests = readTestRequests()
  const longHomes = sortFeaturedListings(listings.filter(item => item.management === 'leased'))
  const found = filterListings(longHomes, filters).filter(item => !filters.moveIn || (filters.term === 'all' ? item.terms : [filters.term]).some(term => { const range = leaseRange(filters.moveIn, term); return range && demoAvailable(item.id, range) }))
  const detailQuery = new URLSearchParams()
  if (filters.moveIn) detailQuery.set('moveIn', filters.moveIn)
  if (filters.term !== 'all') detailQuery.set('term', filters.term)
  return <div className="page-shell page-top exchange-discovery rentals-catalog-page"><div className="page-title"><p className="eyebrow">01 / LONG STAYS</p><h1>{t.rent}</h1><p>{lang === 'zh' ? '半年或一年，安心长住。半年月租按一年基础月租上浮 10%。' : 'Stay for six months or a year. Six-month rent adds 10% to the annual base monthly rate.'}</p></div><SearchPanel lang={lang} initial={filters}/><div className="results-bar"><div><h2>{t.results}</h2><span>{String(found.length).padStart(2, '0')}</span></div><span className="exchange-sort-note">{t.sort}</span></div><p className="sample-inventory">{t.sampleInventory} {filters.moveIn ? (lang === 'zh' ? '以下档期为本机测试库存推算，非正式可订承诺。' : 'Dates are estimated from this browser’s test inventory, not a live booking promise.') : (lang === 'zh' ? '未指定起租日，具体可交付时间待核验。' : 'Select a move-in date to check the test calendar.')}</p>{found.length ? <div className="listing-grid">{found.map(item => <ListingCard key={item.id} listing={item} lang={lang} query={detailQuery.toString()} pendingInspection={Boolean(filters.moveIn && !handoverReady(item.id, filters.moveIn, requests))}/>)}</div> : <div className="empty-state"><h3>{t.noResult}</h3><p>{t.noResultSub}</p><a className="button button-dark" href="#/rentals">{t.reset} ↗</a></div>}</div>
}

function ListingBookingCard({ listing, lang, onAction, query = '' }: { listing: Listing; lang: Language; onAction: (message: string) => void; query?: string }) {
  const t = words[lang]
  const params = new URLSearchParams(query)
  const [term, setTerm] = useState<Term>(params.get('term') === 'halfYear' ? 'halfYear' : 'year')
  const [payment, setPayment] = useState<LeasePaymentOption>('one-two')
  const termMonths = term === 'halfYear' ? 6 : term === 'year' ? 12 : 0
  const monthlyPrice = listing.priceUnit === 'month' ? longRentalMonthlyPrice(listing.price, term === 'halfYear' ? 'halfYear' : 'year') : listing.price
  const estimate = listing.priceUnit === 'month' ? estimateLeaseMoveIn(monthlyPrice, termMonths, payment) : null
  const money = (value: number) => new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: listing.currency, maximumFractionDigits: 0 }).format(value)
  return <aside className="booking-card">
    <span className="eyebrow">{t.feeTitle} / {t.demo}</span>
    <div className="booking-price"><small>{t.baseRent}</small><strong>{money(monthlyPrice)} / {lang === 'zh' ? '月' : 'month'}</strong></div>
    <div className="fee-lines"><div><span><LineIcon name="shield" size={17}/>{t.zeroAgency}</span><strong>{money(0)}</strong></div><div><span><LineIcon name="utility" size={17}/>{t.utilitiesActual}</span></div></div>
    {listing.priceUnit === 'month' && <div className="payment-example">
      <label className="term-control">{t.chooseTerm}<select value={term} onChange={event => setTerm(event.target.value as Term)}>{listing.terms.map(value => <option key={value} value={value}>{t[value]}</option>)}</select></label><p className="micro-note">{lang === 'zh' ? '半年月租按一年基础月租上浮 10%；以下押付金额随租期自动更新。' : 'The six-month monthly price is 10% above the annual base rate. Move-in estimates update with your choice.'}</p>
      {estimate ? <><p className="field-label">{t.paymentChoice}</p><div className="payment-options"><button type="button" className={payment === 'one-two' ? 'selected' : ''} aria-pressed={payment === 'one-two'} onClick={() => setPayment('one-two')}>{t.oneTwo}</button><button type="button" className={payment === 'two-one' ? 'selected' : ''} aria-pressed={payment === 'two-one'} onClick={() => setPayment('two-one')}>{t.twoOne}</button></div><p className="micro-note">{payment === 'one-two' ? t.oneTwoNote : t.twoOneNote}</p><div className="estimate-lines"><div><span>{t.deposit}</span><strong>{money(estimate.deposit)}</strong></div><div><span>{t.prepaidRent}</span><strong>{money(estimate.prepaidRent)}</strong></div><div className="estimate-total"><span>{t.initialDue}</span><strong>{money(estimate.initialDue)}</strong></div></div></> : <p className="micro-note">{t.paymentPending}</p>}
    </div>}
    <p className="booking-disclaimer">{t.datePending} {t.otherFees}</p>
    <a className="button button-dark" href={`#/request/rental/${listing.id}?term=${term}${params.get('moveIn') ? `&start=${params.get('moveIn')}` : ''}`}>{t.contact} <LineIcon name="arrow" size={17}/></a>
    {canExchange(listing) ? <div className="booking-exchange"><span>{t.ready}</span><p>{t.exchangeMini} {listing.city === 'pattaya' && t.exchangeThai}</p><a className="button button-light" href={`#/request/exchange/${listing.id}`}>{t.apply} <LineIcon name="arrow" size={17}/></a></div> : <button className="exchange-ineligible" onClick={() => onAction(t.ineligible)}>{t.noExchange} ⓘ</button>}
  </aside>
}

function ListingPage({ lang, id, onAction, query = '' }: { lang: Language; id?: string; onAction: (message: string) => void; query?: string }) {
  const t = words[lang]
  const listing = listings.find(item => item.id === id)
  if (!listing) return <div className="page-shell empty-state"><h1>{t.noResult}</h1><a href="#/rentals" className="button button-dark">{t.back}</a></div>
  const city = cities.find(c => c.id === listing.city)!
  const region = city.regions.find(r => r.id === listing.region)!
  return <div className="page-shell detail-page">
    <a className="back-link" href="#/rentals">← {t.back}</a>
    <div className="detail-heading"><div><p className="eyebrow">{city[lang]} / {region[lang]} / {t.demo}</p><h1>{listing.title[lang]}</h1><p>{listing.type[lang]} · {listing.highlight[lang]}</p></div><div className="detail-price"><span>{t.price}</span><strong>{formatPrice(listing, lang)}</strong></div></div>
    {canExchange(listing) && <div className="exchange-entry"><span>{t.ready}</span><a href={`#/exchange/home/${listing.id}`}>{t.apply} <LineIcon name="arrow" size={17}/></a></div>}
    <ExchangeGallery key={listing.id} home={listing} lang={lang}/>
    <div className="detail-layout"><div className="detail-main">
      <h2>{lang === 'zh' ? '房屋概况' : 'About this home'}</h2><p className="lead">{listing.description[lang]}</p>
      <div className="facts"><div><LineIcon name="guests"/><small>{t.occupants}</small><strong>{listing.guests}</strong></div><div><LineIcon name="bedroom"/><small>{t.rooms}</small><strong>{listing.bedrooms}</strong></div><div><LineIcon name="bed"/><small>{t.beds}</small><strong>{listing.beds}</strong></div><div><LineIcon name="bath"/><small>{t.baths}</small><strong>{listing.bathrooms}</strong></div><div><LineIcon name="area"/><small>{t.size}</small><strong>{listing.area} m²</strong></div></div>
      <ul className="feature-list">{listing.features.map(feature => <li key={feature.zh}><LineIcon name="check" size={17}/>{feature[lang]}</li>)}</ul>
      <h3>{t.amenities}</h3><div className="amenity-list">{listing.amenities.map(amenity => <span key={amenity.zh}><LineIcon name={amenityIcon(amenity.zh)} size={21}/>{amenity[lang]}</span>)}</div>
      <section className="rental-practical" aria-label={lang === 'zh' ? '位置与入住信息' : 'Location and stay information'}>
        <h3>{lang === 'zh' ? '位置与入住' : 'Location & stay'}</h3>
        <div><LineIcon name="location" size={21}/><p><strong>{city[lang]} · {region[lang]}</strong><span>{lang === 'zh' ? '公开展示到区域；具体位置在房源核验与咨询阶段确认。' : 'The public listing shows the area. Confirm the exact location after property verification.'}</span></p></div>
        <div><LineIcon name="shield" size={21}/><p><strong>{t.listingRules}</strong><span>{lang === 'zh' ? '宠物、吸烟、装修和退租约定将在真实房源核验及私密签约前说明。' : 'Pet, smoking, alteration and move-out terms are confirmed before a private lease is signed.'}</span></p></div>
      </section>
    </div><ListingBookingCard key={`${listing.id}:${query}`} listing={listing} lang={lang} onAction={onAction} query={query}/></div>
  </div>
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute)
  const [homeMode, setHomeMode] = useState<HomeMode>('rentals')
  const [homeQueries, setHomeQueries] = useState<Record<HomeMode, string>>({ rentals: '', stays: '', exchange: '', roam: '' })
  const onHomeSearch = (mode: HomeMode, query: string) => { setHomeQueries(current => ({ ...current, [mode]: query })); window.scrollTo({ top: 0, behavior: 'smooth' }) }
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
    if (route.page === 'rentals') return <HomePage lang={lang} mode="rentals" query={route.query}/>
    if (route.page === 'listing') return listings.find(item => item.id === route.id)?.management === 'operated' ? <ExchangeDetailPage lang={lang} id={route.id} query={route.query} kind="stays"/> : <ListingPage lang={lang} id={route.id} query={route.query} onAction={setMessage}/>
    if (route.page === 'stays' && route.id) return <ExchangeDetailPage lang={lang} id={route.id} query={route.query} kind="stays"/>
    if (route.page === 'stays') return <HomePage lang={lang} mode="stays" query={route.query}/>
    if (route.page === 'exchange' && route.id) return <ExchangeDetailPage lang={lang} id={route.id} query={route.query} kind="exchange"/>
    if (route.page === 'exchange') return <HomePage lang={lang} mode="exchange" query={route.query}/>
    if (route.page === 'roam') return route.id ? <RoamPage lang={lang} id={route.id} query={route.query}/> : <HomePage lang={lang} mode="roam" query={route.query}/>
    if (route.page === 'management' && !route.mode) return <ManagementEntry lang={lang} suggested={new URLSearchParams(route.query).get('service') || undefined}/>
    if (route.page === 'management') return <ManagementPage lang={lang} mode={route.mode}/>
    if (route.page === 'request' && route.mode === 'rental') return <RentalRequestPage lang={lang} listingId={route.id} query={route.query}/>
    if (route.page === 'request' && route.mode === 'exchange') return <ExchangeRequestPage lang={lang} listingId={route.id} query={route.query}/>
    if (route.page === 'test-inbox') return <TestInbox lang={lang}/>
    return <HomePage lang={lang} mode={homeMode} query={homeQueries[homeMode]}/>
  }, [route, lang, homeMode, homeQueries])
  return <><Header lang={lang} setLang={setLang} route={route} mode={route.page === 'rentals' || route.page === 'stays' || route.page === 'exchange' || route.page === 'roam' && !route.id ? route.page as HomeMode : homeMode} onModeChange={setHomeMode} onSearch={onHomeSearch}/><main id="main-content">{content}</main><footer className="site-footer"><div className="page-shell"><div className="footer-top"><a className="footer-brand" href="#/">快旅居 <span>KUAI LÜ JU</span></a><nav aria-label="Footer"><a href="#/rentals">{t.rent}</a><a href="#/stays">{t.stays}</a><a href="#/exchange">{t.exchange}</a><a href="#/roam">{t.roam}</a><a href="#/management">{t.manage}</a></nav></div><div className="footer-bottom"><span>{t.footer}</span><p>{t.legal}</p><span>© {new Date().getFullYear()} KUAI LÜ JU</span></div></div></footer>{message && <div className="modal-backdrop" onClick={() => setMessage(null)}><div className="modal" role="dialog" aria-modal="true" aria-label={t.preview} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setMessage(null)} aria-label={t.close}>×</button><span className="eyebrow">PREVIEW NOTICE</span><h2>{t.preview}</h2><p>{message}</p><button className="button button-dark" onClick={() => setMessage(null)}>{t.understood} ↗</button></div></div>}</>
}
