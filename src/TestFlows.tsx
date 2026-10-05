import { useEffect, useState, type FormEvent } from 'react'
import { cities, listings, type Listing, type Term } from './data'
import { canExchange, formatPrice, longRentalMonthlyPrice, type Language, type LeasePaymentOption } from './lib/catalog'
import { advanceService, changeExchange, createId, proposeExchangeTopUp, readExchangeDrafts, readTestRequests, respondExchangeTopUp, saveTestRequest, validRange, type DateRange, type ExchangeDraft, type ExchangeRequest, type ManagementRequest, type TestRequest } from './lib/testWorkflow'
import { LineIcon } from './components/LineIcon'
import { demoAvailable, localDate } from './lib/exchangeDiscovery'

const copy = {
  zh: {
    testOnly: '站内流程测试 · 仅存于当前浏览器', noReal: '以下均为示意房源。测试记录不发送给平台、业主或邮箱，不构成预订、置换确认或付款。请勿填写真实个人信息。',
    rental: '提交租赁需求', exchange: '发起双房源置换', inbox: '流程测试工作台', formLead: '选择条件并提交，查看下一步如何流转。',
    home: '目标房源', term: '租期', payment: '押付选择', checkin: '希望入住日期', guests: '入住人数', submit: '提交测试需求',
    source: '您的已授权房源', target: '想入住的房源', compare: '双房源对照', aDates: 'A 入住目标房源的时间', bDates: 'B 入住 A 房源的时间', start: '入住', end: '退房',
    eligibility: '测试资格仅通过选择房源模拟。正式服务需核验业主身份、合同、房态、对等价值及当地经营条件。',
    exchangeFee: '对等房源可免住宿费；若价值不等，由平台提出补差额报价，经双方同意后确认。双方各自在入住前付 ¥600 入住前后两次保洁费；长租房押金按入住房源月租金，民宿房押金按房况核定 ¥3,000–6,000，水电实际抄表结算；泰国费用收等值泰铢。入住期间日常保洁自行维护，额外保洁另计。此处不收款。',
    submitExchange: '提交测试置换申请', choose: '请选择', required: '请完整选择房源和有效日期；退房日期必须晚于入住日期。', submitted: '记录已保存在当前浏览器。',
    empty: '还没有测试记录。可先从房源详情提交一笔租赁或置换需求。', type: '类型', created: '创建时间', status: '进度', view: '查看房源',
    roleA: '申请人 A', roleB: '目标业主 B', rolePlatform: '平台处理', accept: '同意', decline: '不同意', counter: '修改时间', confirmCounter: '确认新时间', review: '开始处理', reply: '标记已回复', confirm: '平台核验确认',
    pending: '等待 B 响应', countered: 'B 建议修改时间', accepted: 'B 已同意 · 待平台核验', declined: 'B 已拒绝', applicantDeclined: 'A 未接受修改时间', confirmed: '平台已确认（测试）', submittedStatus: '已提交', reviewing: '处理中', replied: '已回复（测试）',
    note: '本工作台仅用于单浏览器演练角色切换。正式上线时，A、B 与平台将拥有独立账号与权限；申请人不可查看对方身份信息。',
    explainCounter: 'B 只能选择新日期，不能输入文字或联系方式。A 同意后，平台再核验房态和对等价值。', noPayment: '测试完成不触发实际服务。真实房源、身份核验、通知、支付和履约由正式后端承接。',
    monthly: '月租', day: '日租', quarter: '季租', halfYear: '半年租', year: '年租', oneTwo: '押一付二', twoOne: '押二付一', confirmLater: '待房源核验后确认',
    registerOwn: '登记我的房源并申请', draftType: '托管类型', draftCity: '房源城市', draftRegion: '所在区域', draftArea: '面积（㎡）', draftBeds: '卧室数', draftConsent: '我确认有权提供该房源，并明确同意将以上房源信息加入旅居置换展示。正式上线前仍需人工核验。', draftPending: '您授权的房源已加入本机测试展示，尚未核验，暂不可被他人申请入住。', draftMissing: '请填写房源概况并勾选明确授权。', draftLabel: '待核验房源', priceSix: '半年租月价比年租月价上浮 10%',
    guestsCount: '可住人数', bedroom: '卧室', area: '面积', features: '空间配置', management: '托管需求', rentalName: '租赁需求', exchangeName: '置换申请', leasingMode: '委托租赁', operationMode: '委托经营', careMode: '委托看护', apartment: '公寓', villa: '别墅',
    resume: '打开测试工作台', back: '返回房源', workbench: '测试工作台', pendingTimer: '提交后 30 分钟仍未处理的事项会突出显示；正式主动联系由本人值班执行。', overdue: '已超过 30 分钟',
    saveFailed: '当前浏览器未能保存测试记录，请检查浏览器存储权限后重试。',
    reviewChecklist: '测试人工核验：房态可用、合同授权、对等价值和异期履约均已核对',
    checkout: '退房日期', unavailableDates: '所选日期包含测试不可选档期，请重新选择。',
    topupProposed: '补差额待双方确认', topupAccepted: '补差额已获双方确认 · 待平台确认', topupDeclined: '补差额被拒绝', topupAmount: '住宿补差额', topupPayer: '支付方', topupQuote: '提交补差额报价', topupFree: '确认等值免费置换', topupNote: '平台人工核验价值后填写补差额；A 与 B 均需确认。此处只演练，不收款。', waitingOther: '已确认，等待另一方', topupPartyA: 'A 申请人', topupPartyB: 'B 目标业主',
  },
  en: {
    testOnly: 'Interactive test · saved in this browser only', noReal: 'All homes shown are concepts. Test records are not sent to the platform, owners or email, and do not create a booking, exchange or payment. Do not enter real personal details.',
    rental: 'Send a rental enquiry', exchange: 'Request a two-home exchange', inbox: 'Workflow test desk', formLead: 'Choose the details, submit and follow the next steps.',
    home: 'Selected home', term: 'Stay term', payment: 'Payment choice', checkin: 'Preferred arrival', guests: 'Guests', submit: 'Submit test enquiry',
    source: 'Your managed home (test identity)', target: 'Home you want to stay in', compare: 'Two homes, side by side', aDates: 'When A stays in the target home', bDates: 'When B stays in A’s home', start: 'Check in', end: 'Check out',
    eligibility: 'Test eligibility is simulated by selecting a home. Real service requires owner, contract, availability, equivalent value and local authorization checks.',
    exchangeFee: 'Equal-value homes may waive accommodation rent. If values differ, the platform quotes a top-up for both owners to approve. Each party pays ¥600 for pre/post-stay cleaning. The deposit equals the target long-stay monthly rent or ¥3,000–6,000 for a short-stay home. Utilities are metered; Thailand charges the THB equivalent. Guests handle daily cleaning; extra service costs more. No payment here.',
    submitExchange: 'Submit test exchange', choose: 'Choose', required: 'Choose both homes and valid dates. Checkout must be after check-in.', submitted: 'Saved in this browser.',
    empty: 'No test records yet. Start from a home detail page.', type: 'Type', created: 'Created', status: 'Status', view: 'View home',
    roleA: 'Applicant A', roleB: 'Target owner B', rolePlatform: 'Platform desk', accept: 'Accept', decline: 'Decline', counter: 'Suggest dates', confirmCounter: 'Accept new dates', review: 'Start review', reply: 'Mark replied', confirm: 'Verify & confirm',
    pending: 'Waiting for B', countered: 'B suggested new dates', accepted: 'B accepted · platform review', declined: 'B declined', applicantDeclined: 'A declined the new dates', confirmed: 'Platform confirmed (test)', submittedStatus: 'Submitted', reviewing: 'In review', replied: 'Replied (test)',
    note: 'This desk simulates roles in one browser. Live service will use separate accounts and permissions; applicants will not see the other owner’s identity.',
    explainCounter: 'B may suggest dates only. No text or contact details. After A accepts, the platform verifies availability and equivalent value.', noPayment: 'No real service is triggered. Live homes, identity checks, notifications, payments and fulfillment require the production backend.',
    monthly: 'Monthly', day: 'Daily', quarter: 'Quarterly', halfYear: 'Six months', year: 'One year', oneTwo: '1 deposit + 2 rent', twoOne: '2 deposit + 1 rent', confirmLater: 'Confirm after home review',
    registerOwn: 'Register my home and apply', draftType: 'Management type', draftCity: 'Home city', draftRegion: 'Area', draftArea: 'Size (m²)', draftBeds: 'Bedrooms', draftConsent: 'I have the right to offer this home and expressly authorize these details to appear in exchange discovery. Human verification is still required before live service.', draftPending: 'Your authorized home appears in this browser’s demo exchange section, pending verification. Other people cannot request it yet.', draftMissing: 'Complete the home summary and expressly opt in.', draftLabel: 'Pending verification', priceSix: 'Six-month monthly rent is 10% above the annual base',
    guestsCount: 'Sleeps', bedroom: 'Bedrooms', area: 'Area', features: 'Space', management: 'Management enquiry', rentalName: 'Rental enquiry', exchangeName: 'Exchange request', leasingMode: 'Leasing', operationMode: 'Managed operation', careMode: 'Home care', apartment: 'Apartment', villa: 'Villa',
    resume: 'Open test desk', back: 'Back to home', workbench: 'Test desk', pendingTimer: 'Items pending for 30+ minutes are highlighted; the sole human operator contacts the party as soon as possible.', overdue: 'Pending over 30 min',
    saveFailed: 'This browser could not save the test record. Check storage permission and try again.',
    reviewChecklist: 'Test human review: availability, agreement, equivalent value and separate stay dates checked',
    checkout: 'Checkout date', unavailableDates: 'These dates include a demo unavailable day. Please choose another range.',
    topupProposed: 'Top-up awaiting both owners', topupAccepted: 'Top-up agreed · platform review', topupDeclined: 'Top-up declined', topupAmount: 'Accommodation top-up', topupPayer: 'Paying party', topupQuote: 'Propose top-up', topupFree: 'Confirm equal-value exchange', topupNote: 'The platform enters any top-up after human value review; both owners must agree. Test only, no payment.', waitingOther: 'Accepted, waiting for the other owner', topupPartyA: 'A applicant', topupPartyB: 'B target owner',
  },
}

function displayCity(listing: Listing, lang: Language) {
  const city = cities.find(item => item.id === listing.city)!
  return `${city[lang]} · ${city.regions.find(item => item.id === listing.region)?.[lang] || ''}`
}

function PropertyCompare({ listing, lang, title }: { listing: Listing; lang: Language; title: string }) {
  const t = copy[lang]
  return <article className="test-property"><img src={`${import.meta.env.BASE_URL}${listing.gallery[0].image.slice(1)}`} alt=""/><div><small>{title} / {displayCity(listing, lang)}</small><h3>{listing.title[lang]}</h3><p>{listing.type[lang]} · {formatPrice(listing, lang)}</p><dl><div><dt>{t.guestsCount}</dt><dd>{listing.guests}</dd></div><div><dt>{t.bedroom}</dt><dd>{listing.bedrooms}</dd></div><div><dt>{t.area}</dt><dd>{listing.area} m²</dd></div></dl><p>{t.features}: {listing.amenities.map(item => item[lang]).join(' · ')}</p></div></article>
}

function DraftCompare({ draft, lang, title }: { draft: ExchangeDraft; lang: Language; title: string }) {
  const t = copy[lang]
  const city = cities.find(item => item.id === draft.city)
  const region = city?.regions.find(item => item.id === draft.region)
  return <article className="test-property draft-compare"><div><small>{title} / {city?.[lang]} · {region?.[lang]}</small><h3>{t.draftLabel}</h3><p>{draft.management === 'leasing' ? t.leasingMode : t.operationMode} · {draft.propertyType === 'villa' ? t.villa : t.apartment}</p><dl><div><dt>{t.bedroom}</dt><dd>{draft.bedrooms}</dd></div><div><dt>{t.area}</dt><dd>{draft.area} m²</dd></div></dl><p>{t.draftPending}</p></div></article>
}

function DateFields({ label, value, onChange, name }: { label: string; value: DateRange; onChange: (value: DateRange) => void; name?: string }) {
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'
  const t = copy[lang]
  return <fieldset className="date-fields"><legend>{label}</legend><label>{t.start}<input required name={name ? `${name}Start` : undefined} type="date" value={value.start} onChange={event => onChange({ ...value, start: event.target.value })}/></label><label>{t.end}<input required name={name ? `${name}End` : undefined} type="date" min={value.start || undefined} value={value.end} onChange={event => onChange({ ...value, end: event.target.value })}/></label></fieldset>
}

export function RentalRequestPage({ lang, listingId, query = '' }: { lang: Language; listingId?: string; query?: string }) {
  const t = copy[lang]
  const listing = listings.find(item => item.id === listingId)
  const params = new URLSearchParams(query)
  const [term, setTerm] = useState<Term>(listing?.terms.includes(params.get('term') as Term) ? params.get('term') as Term : listing?.terms[0] || 'halfYear')
  const [payment, setPayment] = useState<LeasePaymentOption>('one-two')
  const [guests, setGuests] = useState(Math.min(listing?.guests || 1, Math.max(1, Number(params.get('guests')) || 1)))
  const [feedback, setFeedback] = useState('')
  if (!listing) return <div className="page-shell page-top">{t.empty}</div>
  function submit(form: HTMLFormElement) {
    const start = String(new FormData(form).get('start') || '')
    const end = String(new FormData(form).get('end') || '')
    if (!listing || !start || start < localDate() || term === 'day' && !validRange({ start, end })) { setFeedback(t.required); return }
    if (term === 'day' && !demoAvailable(listing.id, { start, end })) { setFeedback(t.unavailableDates); return }
    try {
      saveTestRequest({ id: createId(), createdAt: new Date().toISOString(), kind: 'rental', listingId: listing.id, term, payment: listing.priceUnit === 'month' ? payment : 'confirm', start, ...(term === 'day' ? { end } : {}), guests, status: 'submitted' })
      window.location.hash = '#/test-inbox'
    } catch { setFeedback(t.saveFailed) }
  }
  return <div className="page-shell test-flow-page"><a className="back-link" href={listing.priceUnit === "day" ? `#/stays/home/${listing.id}` : `#/listing/${listing.id}`}>← {t.back}</a><div className="test-flow-heading"><p className="eyebrow">RENTAL / INTERACTIVE TEST</p><h1>{t.rental}</h1><p>{t.formLead}</p></div><p className="test-ribbon"><LineIcon name="shield"/>{t.testOnly}</p><div className="test-flow-layout"><PropertyCompare listing={listing} lang={lang} title={t.home}/><form className="test-flow-form" onSubmit={event => { event.preventDefault(); submit(event.currentTarget) }}><p>{t.noReal}</p><label>{t.term}<select value={term} onChange={event => setTerm(event.target.value as Term)}>{listing.terms.map(item => <option key={item} value={item}>{t[item === 'month' ? 'monthly' : item]}</option>)}</select></label>{listing.priceUnit === 'month' && <p className="micro-note">{t.priceSix} · {new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: listing.currency, maximumFractionDigits: 0 }).format(longRentalMonthlyPrice(listing.price, term === 'halfYear' ? 'halfYear' : 'year'))} / {lang === 'zh' ? '月' : 'month'}</p>}<label>{t.checkin}<input required name="start" type="date" min={localDate()} defaultValue={params.get("start") || ""}/></label>{term === "day" && <label>{t.checkout}<input required name="end" type="date" min={localDate()} defaultValue={params.get("end") || ""}/></label>}<label>{t.guests}<select value={guests} onChange={event => setGuests(Number(event.target.value))}>{Array.from({ length: listing.guests }, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}</select></label>{listing.priceUnit === 'month' && <fieldset className="test-choice"><legend>{t.payment}</legend><label><input type="radio" checked={payment === 'one-two'} onChange={() => setPayment('one-two')}/>{t.oneTwo}</label><label><input type="radio" checked={payment === 'two-one'} onChange={() => setPayment('two-one')}/>{t.twoOne}</label></fieldset>}<p className="micro-note">{t.noPayment}</p>{feedback && <p role="alert" className="form-error">{feedback}</p>}<button className="button button-dark" type="submit">{t.submit}<LineIcon name="arrow" size={17}/></button></form></div></div>
}

export function ExchangeRequestPage({ lang, listingId, query = '' }: { lang: Language; listingId?: string; query?: string }) {
  const t = copy[lang]
  const target = listings.find(item => item.id === listingId)
  const params = new URLSearchParams(query)
  const eligible = listings.filter(canExchange)
  const knownDrafts = readExchangeDrafts()
  const [sourceId, setSourceId] = useState('')
  const [draftCity, setDraftCity] = useState(cities[0].id)
  const [draftRegion, setDraftRegion] = useState(cities[0].regions[0].id)
  const [draftManagement, setDraftManagement] = useState<'leasing' | 'operation'>('leasing')
  const [draftType, setDraftType] = useState('apartment')
  const [draftArea, setDraftArea] = useState('')
  const [draftBedrooms, setDraftBedrooms] = useState('')
  const [draftConsent, setDraftConsent] = useState(false)
  const [aStay, setAStay] = useState<DateRange>({ start: params.get('start') || '', end: params.get('end') || '' })
  const [bStay, setBStay] = useState<DateRange>({ start: '', end: '' })
  const [guests, setGuests] = useState(Math.min(target?.guests || 1, Math.max(1, Number(params.get('guests')) || 1)))
  const [error, setError] = useState('')
  if (!target || !canExchange(target)) return <div className="page-shell page-top">{t.eligibility}</div>
  const source = eligible.find(item => item.id === sourceId)
  const existingDraft = knownDrafts.find(item => item.id === sourceId)
  const city = cities.find(item => item.id === draftCity)!
  const newDraft: ExchangeDraft | null = sourceId === 'new' && Number(draftArea) > 0 && Number(draftBedrooms) > 0 && draftConsent
    ? { id: '', city: draftCity, region: draftRegion, propertyType: draftType, area: Number(draftArea), bedrooms: Number(draftBedrooms), management: draftManagement, authorized: true }
    : null
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const a = { start: String(data.get('aStart') || ''), end: String(data.get('aEnd') || '') }
    const b = { start: String(data.get('bStart') || ''), end: String(data.get('bEnd') || '') }
    if (!source && !existingDraft && !newDraft) { setError(sourceId === 'new' ? t.draftMissing : t.required); return }
    if (source?.id === target?.id || !validRange(a) || !validRange(b)) { setError(t.required); return }
    if (a.start < localDate() || b.start < localDate() || !demoAvailable(target!.id, a) || source && !demoAvailable(source.id, b)) { setError(t.unavailableDates); return }
    try {
      const id = createId()
      const sourceDraft = newDraft ? { ...newDraft, id: `draft-${id}` } : existingDraft
      saveTestRequest({ id, createdAt: new Date().toISOString(), kind: 'exchange', sourceId: source?.id || sourceDraft!.id, ...(sourceDraft ? { sourceDraft } : {}), targetId: target!.id, aStay: a, bStay: b, guests, status: 'pending-owner' })
      window.location.hash = '#/test-inbox'
    } catch { setError(t.saveFailed) }
  }
  return <div className="page-shell test-flow-page"><a className="back-link" href={`#/exchange/home/${target.id}${query ? `?${query}` : ''}`}>← {t.back}</a><div className="test-flow-heading"><p className="eyebrow">STAY EXCHANGE / INTERACTIVE TEST</p><h1>{t.exchange}</h1><p>{t.formLead}</p></div><p className="test-ribbon"><LineIcon name="shield"/>{t.testOnly}</p><form onSubmit={submit} className="exchange-test-form">
    <div className="exchange-select"><label>{t.source}<select required value={sourceId} onChange={event => setSourceId(event.target.value)}><option value="">{t.choose}</option>{eligible.filter(item => item.id !== target.id).map(item => <option key={item.id} value={item.id}>{item.title[lang]} · {displayCity(item, lang)}</option>)}{knownDrafts.map(item => <option key={item.id} value={item.id}>{t.draftLabel} · {cities.find(city => city.id === item.city)?.[lang]}</option>)}<option value="new">＋ {t.registerOwn}</option></select></label><label>{t.guests}<select value={guests} onChange={event => setGuests(Number(event.target.value))}>{Array.from({ length: target.guests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label><p>{t.eligibility}</p></div>
    {sourceId === 'new' && <fieldset className="exchange-draft-fields"><legend>{t.registerOwn}</legend><label>{t.draftType}<select value={draftManagement} onChange={event => setDraftManagement(event.target.value as 'leasing' | 'operation')}><option value="leasing">{t.leasingMode}</option><option value="operation">{t.operationMode}</option></select></label><label>{t.draftCity}<select value={draftCity} onChange={event => { const next = cities.find(item => item.id === event.target.value)!; setDraftCity(next.id); setDraftRegion(next.regions[0].id) }}>{cities.map(item => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label><label>{t.draftRegion}<select value={draftRegion} onChange={event => setDraftRegion(event.target.value)}>{city.regions.map(item => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label><label>{t.type}<select value={draftType} onChange={event => setDraftType(event.target.value)}><option value="apartment">{t.apartment}</option><option value="villa">{t.villa}</option></select></label><label>{t.draftArea}<input type="number" min="1" value={draftArea} onChange={event => setDraftArea(event.target.value)}/></label><label>{t.draftBeds}<input type="number" min="1" value={draftBedrooms} onChange={event => setDraftBedrooms(event.target.value)}/></label><label className="exchange-draft-consent"><input type="checkbox" checked={draftConsent} onChange={event => setDraftConsent(event.target.checked)}/>{t.draftConsent}</label><p>{t.draftPending}</p></fieldset>}
    <div className="exchange-test-grid">{source ? <PropertyCompare listing={source} lang={lang} title="A"/> : existingDraft || newDraft ? <DraftCompare draft={(existingDraft || newDraft)!} lang={lang} title="A"/> : <div className="test-property empty-property">A / {t.source}</div>}<span className="compare-symbol" aria-hidden="true">↔</span><PropertyCompare listing={target} lang={lang} title="B"/></div><div className="exchange-date-grid"><DateFields name="a" label={t.aDates} value={aStay} onChange={setAStay}/><DateFields name="b" label={t.bDates} value={bStay} onChange={setBStay}/></div><div className="exchange-submit"><p>{t.exchangeFee}</p><p>{t.noReal}</p>{error && <p role="alert" className="form-error">{error}</p>}<button type="submit" className="button button-dark">{t.submitExchange}<LineIcon name="arrow" size={17}/></button></div>
  </form></div>
}

function statusText(request: TestRequest, lang: Language) {
  const t = copy[lang]
  if (request.kind === 'exchange') return ({ 'pending-owner': t.pending, 'counter-proposed': t.countered, 'owner-accepted': t.accepted, 'owner-declined': t.declined, 'applicant-declined': t.applicantDeclined, 'topup-proposed': t.topupProposed, 'topup-accepted': t.topupAccepted, 'topup-declined': t.topupDeclined, 'platform-confirmed': t.confirmed })[request.status]
  return ({ submitted: t.submittedStatus, reviewing: t.reviewing, replied: t.replied })[request.status]
}

function ExchangeRecordCompare({ source, target, lang }: { source: Listing; target: Listing; lang: Language }) {
  const t = copy[lang]
  return <div className="exchange-record-compare" aria-label={t.compare}>
    {([['A', source], ['B', target]] as const).map(([side, home]) => <div key={side}>
      <small>{side} / {displayCity(home, lang)}</small>
      <strong>{home.title[lang]}</strong>
      <span>{home.bedrooms} {t.bedroom} · {home.area} m² · {lang === 'zh' ? `可住 ${home.guests} 人` : `Sleeps ${home.guests}`}</span>
      <span>{home.amenities.map(item => item[lang]).join(' · ')}</span>
      <em>{formatPrice(home, lang)}</em>
    </div>)}
  </div>
}

function ManagementRecordDetails({ request, lang }: { request: ManagementRequest; lang: Language }) {
  const zh = lang === 'zh'
  const selected = (value?: string) => ({
    new: zh ? '新装 / 状态良好' : 'New / good condition', standard: zh ? '正常使用' : 'Normal use', refresh: zh ? '需要翻新评估' : 'Needs assessment',
    none: zh ? '无' : 'None', partial: zh ? '部分配置' : 'Part furnished', full: zh ? '配备齐全' : 'Fully equipped', basic: zh ? '基础配置' : 'Basic',
    vacant: zh ? '空置' : 'Vacant', owner: zh ? '业主自住' : 'Owner occupied', tenant: zh ? '现有租客' : 'Tenanted',
    long: zh ? '至少 6 个月' : '6+ months', quarter: zh ? '3 个月起' : '3+ months', ready: zh ? '可直接经营' : 'Ready', prepare: zh ? '需要整理配置' : 'Needs preparation', review: zh ? '待评估' : 'Needs review',
  }[value || ''] || value || '—')
  const addons: Record<string, string> = zh
    ? { garden: '园林修剪', pool: '泳池管理', deepClean: '深度清洁', ac: '空调与除湿维护', pest: '虫害防治', linen: '布草与软装维护', storm: '雨季专项巡检', arrival: '返家前准备' }
    : { garden: 'Garden', pool: 'Pool', deepClean: 'Deep cleaning', ac: 'AC care', pest: 'Pest prevention', linen: 'Linen', storm: 'Storm checks', arrival: 'Pre-arrival' }
  return <details className="management-record-details"><summary>{zh ? '查看房源登记摘要' : 'View property details'} ↗</summary><div className="record-facts">
    <span>{zh ? '楼层' : 'Floor'}: {request.floor ?? '—'} / {request.totalFloors ?? '—'}</span>
    <span>{zh ? '户型' : 'Layout'}: {request.bedrooms ?? '—'} {zh ? '卧' : 'bed'} · {request.livingRooms ?? '—'} {zh ? '厅' : 'living'} · {request.bathrooms ?? '—'} {zh ? '卫' : 'bath'}</span>
    <span>{zh ? '交房' : 'Handover'}: {request.handover || '—'}</span>
    <span>{zh ? '装修' : 'Condition'}: {selected(request.renovation)}</span>
    <span>{zh ? '软装' : 'Furnishings'}: {selected(request.furnishing)}</span>
    <span>{zh ? '家电' : 'Appliances'}: {selected(request.appliances)}</span>
    <span>{zh ? '现状' : 'Current use'}: {selected(request.occupancy)}</span>
    {request.rentalMinimum && <span>{zh ? '起租期限' : 'Minimum lease'}: {selected(request.rentalMinimum)}</span>}
    {request.cooperationModel && <span>{zh ? '结算方式' : 'Payout model'}: {request.cooperationModel === 'fixed' ? (zh ? '固定到手租金' : 'Fixed take-home rent') : (zh ? '成交后房东付佣' : 'Owner-paid commission')}</span>}
    {request.expectedMonthlyRent !== undefined && <span>{zh ? '期望月租 / 到手租金' : 'Target / take-home rent'}: {new Intl.NumberFormat(zh ? 'zh-CN' : 'en-US', { style: 'currency', currency: request.city === 'pattaya' ? 'THB' : 'CNY', maximumFractionDigits: 0 }).format(request.expectedMonthlyRent)}</span>}
    {request.operationReady && <span>{zh ? '经营准备' : 'Operating readiness'}: {selected(request.operationReady)}</span>}
    {request.careEstimate !== undefined && <span>{zh ? '基础看护测试价' : 'Sample base care'}: {new Intl.NumberFormat(zh ? 'zh-CN' : 'en-US', { style: 'currency', currency: request.city === 'pattaya' ? 'THB' : 'CNY', maximumFractionDigits: 0 }).format(request.careEstimate)} / {zh ? '月' : 'month'}</span>}
    {request.careAddons && <span>{zh ? '选配服务' : 'Add-ons'}: {request.careAddons.length ? request.careAddons.map(item => addons[item] || item).join(' · ') : (zh ? '无' : 'None')}</span>}
    <span>{zh ? '图片张数' : 'Photos'}: {request.photoCount ?? 0}</span>
  </div></details>
}

function TopUpFlow({ request, lang, role, reviewed, onUpdate }: { request: ExchangeRequest; lang: Language; role: 'a' | 'b' | 'platform'; reviewed: boolean; onUpdate: () => void }) {
  const t = copy[lang]
  const quote = request.topUp
  const acceptedHere = role === 'a' ? quote?.acceptedA : role === 'b' ? quote?.acceptedB : false
  const update = (next: ExchangeRequest | null) => { if (next) { saveTestRequest(next); onUpdate() } }
  return <div className="topup-flow">
    {quote && <div className="topup-summary"><span>{t.topupAmount}: <strong>{new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: quote.currency, maximumFractionDigits: 0 }).format(quote.amount)}</strong></span><span>{t.topupPayer}: {quote.payer === 'a' ? t.topupPartyA : t.topupPartyB}</span></div>}
    {role === 'platform' && request.status === 'owner-accepted' && <form className="topup-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); update(proposeExchangeTopUp(request, Number(data.get('amount')), String(data.get('currency')) as 'CNY' | 'THB', String(data.get('payer')) as 'a' | 'b')) }}><p>{t.topupNote}</p><label>{t.topupAmount}<input name="amount" type="number" min="1" step="1" required/></label><label>{lang === 'zh' ? '币种' : 'Currency'}<select name="currency"><option value="CNY">CNY</option><option value="THB">THB</option></select></label><label>{t.topupPayer}<select name="payer"><option value="a">{t.topupPartyA}</option><option value="b">{t.topupPartyB}</option></select></label><button className="button button-outline" type="submit" disabled={!reviewed}>{t.topupQuote} ↗</button></form>}
    {(role === 'a' || role === 'b') && request.status === 'topup-proposed' && (acceptedHere ? <p className="micro-note">{t.waitingOther}</p> : <div className="record-actions"><button onClick={() => update(respondExchangeTopUp(request, role, true))}>{t.accept}</button><button onClick={() => update(respondExchangeTopUp(request, role, false))}>{t.decline}</button></div>)}
  </div>
}

function TestRecord({ request, lang, role, onUpdate }: { request: TestRequest; lang: Language; role: 'a' | 'b' | 'platform'; onUpdate: () => void }) {
  const t = copy[lang]
  const [counter, setCounter] = useState<DateRange>({ start: '', end: '' })
  const [showCounter, setShowCounter] = useState(false)
  const [counterError, setCounterError] = useState('')
  const [reviewed, setReviewed] = useState(false)
  const mainListing = request.kind === 'rental' ? listings.find(item => item.id === request.listingId) : request.kind === 'exchange' ? listings.find(item => item.id === request.targetId) : null
  const source = request.kind === 'exchange' ? listings.find(item => item.id === request.sourceId) : null
  const sourceDraft = request.kind === 'exchange' ? request.sourceDraft || readExchangeDrafts().find(item => item.id === request.sourceId) : null
  const managementCity = request.kind === 'management' ? cities.find(item => item.id === request.city) : null
  const managementArea = managementCity?.regions.find(item => item.id === (request.kind === 'management' ? request.region : ''))
  const overdue = request.status === 'pending-owner' && Date.now() - Date.parse(request.createdAt) >= 30 * 60 * 1000
  function exchangeAction(action: 'accept' | 'decline' | 'counter' | 'confirm', suggested = counter) {
    if (request.kind !== 'exchange') return
    const updated = changeExchange(request, action, suggested)
    if (updated) { saveTestRequest(updated); onUpdate(); setShowCounter(false) }
  }
  function serviceAction() {
    if (request.kind === 'exchange') return
    const updated = advanceService(request)
    if (updated) { saveTestRequest(updated); onUpdate() }
  }
  return <article className={`test-record ${overdue ? 'is-overdue' : ''}`}><div className="test-record-top"><span>{request.id}</span><span>{new Date(request.createdAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</span></div><div className="test-record-heading"><div><small>{request.kind === 'rental' ? t.rentalName : request.kind === 'management' ? t.management : t.exchangeName}</small><h2>{mainListing?.title[lang] || (request.kind === 'management' ? ({ leasing: t.leasingMode, operation: t.operationMode, care: t.careMode })[request.mode] : '')}</h2></div><strong>{statusText(request, lang)}</strong></div>{overdue && <p className="overdue-label">{t.overdue}</p>}{request.kind === 'rental' && <div className="record-facts"><span>{t.term}: {({ month: t.monthly, day: t.day, quarter: t.quarter, halfYear: t.halfYear, year: t.year })[request.term as Term] || request.term}</span><span>{t.checkin}: {request.start}</span>{request.end && <span>{t.checkout}: {request.end}</span>}<span>{t.guests}: {request.guests}</span><span>{t.payment}: {request.payment === 'confirm' ? t.confirmLater : request.payment === 'one-two' ? t.oneTwo : t.twoOne}</span></div>}{request.kind === 'management' && <div className="record-facts"><span>{managementCity?.[lang]} / {managementArea?.[lang]}</span><span>{request.propertyType === 'villa' ? t.villa : t.apartment}</span><span>{request.area} m²</span></div>}{request.kind === 'management' && <ManagementRecordDetails request={request} lang={lang}/>}{request.kind === 'exchange' && <><div className="record-facts"><span>A: {source?.title[lang] || (sourceDraft ? t.draftLabel : '')}</span><span>B: {mainListing?.title[lang]}</span><span>{t.aDates}: {request.aStay.start} → {request.aStay.end}</span><span>{t.bDates}: {request.bStay.start} → {request.bStay.end}</span>{request.guests && <span>{t.guests}: {request.guests}</span>}{request.counterStay && <span>{t.countered}: {request.counterStay.start} → {request.counterStay.end}</span>}</div>{source && mainListing ? <ExchangeRecordCompare source={source} target={mainListing} lang={lang}/> : sourceDraft && mainListing && <div className="exchange-test-grid"><DraftCompare draft={sourceDraft} lang={lang} title="A"/><PropertyCompare listing={mainListing} lang={lang} title="B"/></div>} {role === 'b' && request.status === 'pending-owner' && <div className="record-actions"><button onClick={() => exchangeAction('accept')}>{t.accept}</button><button onClick={() => exchangeAction('decline')}>{t.decline}</button><button onClick={() => setShowCounter(value => !value)}>{t.counter}</button></div>}{role === 'b' && showCounter && <form className="counter-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const suggested = { start: String(data.get('counterStart') || ''), end: String(data.get('counterEnd') || '') }; if (validRange(suggested)) exchangeAction('counter', suggested); else setCounterError(t.required) }}><p>{t.explainCounter}</p><DateFields name="counter" label={t.counter} value={counter} onChange={setCounter}/>{counterError && <p role="alert" className="form-error">{counterError}</p>}<button className="button button-dark" type="submit">{t.counter}</button></form>}{role === 'a' && request.status === 'counter-proposed' && <div className="record-actions"><button onClick={() => exchangeAction('accept')}>{t.confirmCounter}</button><button onClick={() => exchangeAction('decline')}>{t.decline}</button></div>}{role === 'platform' && (request.status === 'owner-accepted' || request.status === 'topup-accepted') && <div className="platform-review"><label><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)}/>{t.reviewChecklist}</label><div className="record-actions"><button disabled={!reviewed} onClick={() => exchangeAction('confirm')}>{request.status === 'owner-accepted' ? t.topupFree : t.confirm}</button></div></div>}<TopUpFlow request={request} lang={lang} role={role} reviewed={reviewed} onUpdate={onUpdate}/></>}{role === 'platform' && request.kind !== 'exchange' && request.status !== 'replied' && <div className="record-actions"><button onClick={serviceAction}>{request.status === 'submitted' ? t.review : t.reply}</button></div>}{mainListing && <a className="record-link" href={request.kind === 'exchange' ? `#/exchange/home/${mainListing.id}` : mainListing.priceUnit === "day" ? `#/stays/home/${mainListing.id}` : `#/listing/${mainListing.id}`}>{t.view} ↗</a>}</article>
}

export function TestInbox({ lang }: { lang: Language }) {
  const t = copy[lang]
  const [role, setRole] = useState<'a' | 'b' | 'platform'>('platform')
  const [requests, setRequests] = useState<TestRequest[]>(readTestRequests)
  useEffect(() => { const update = () => setRequests(readTestRequests()); const timer = window.setInterval(update, 60000); window.addEventListener('kuailvju-test-updated', update); window.addEventListener('storage', update); return () => { window.clearInterval(timer); window.removeEventListener('kuailvju-test-updated', update); window.removeEventListener('storage', update) } }, [])
  const visible = role === 'b' ? requests.filter(request => request.kind === 'exchange') : requests
  return <div className="page-shell test-flow-page test-inbox"><div className="test-flow-heading"><p className="eyebrow">WORKFLOW / INTERACTIVE TEST</p><h1>{t.inbox}</h1><p>{t.note}</p></div><p className="test-ribbon"><LineIcon name="shield"/>{t.testOnly}</p><p className="inbox-disclaimer">{t.noReal} {t.pendingTimer}</p><div className="role-tabs" role="tablist" aria-label={t.inbox}>{([['a', t.roleA], ['b', t.roleB], ['platform', t.rolePlatform]] as const).map(([value, label]) => <button key={value} role="tab" aria-selected={role === value} className={role === value ? 'is-active' : ''} onClick={() => setRole(value)}>{label}</button>)}</div><div className="test-records">{visible.length ? visible.map(request => <TestRecord key={request.id} request={request} lang={lang} role={role} onUpdate={() => setRequests(readTestRequests())}/>) : <div className="empty-state"><h2>{t.empty}</h2><a className="button button-dark" href="#/rentals">{t.back} ↗</a></div>}</div></div>
}

export function ManagementTestSubmit(details: Omit<ManagementRequest, 'id' | 'createdAt' | 'kind' | 'status'>) {
  saveTestRequest({ id: createId(), createdAt: new Date().toISOString(), kind: 'management', ...details, status: 'submitted' })
  window.location.hash = '#/test-inbox'
}
