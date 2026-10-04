import { useEffect, useState, type FormEvent } from 'react'
import { cities } from './data'
import { type Language } from './lib/catalog'
import { ManagementTestSubmit } from './TestFlows'

type Mode = 'leasing' | 'operation' | 'care'
type Preview = { url: string }
const modes: Mode[] = ['leasing', 'operation', 'care']
const careBasePrices = { china: { apartment: 399, villa: 899 }, pattaya: { apartment: 1990, villa: 4490 } } as const

const copy = {
  zh: {
    title: '专业、靠谱，知托付。', intro: '三种托管方式，服务与收费一页看清。',
    tabs: '托管方式', formTitle: '登记托管房源', formLead: '先填写房屋概况，平台再核实房态并给出专属方案。',
    testOnly: '站内流程测试 · 目前不收集真实资料', testNote: '本表只在当前浏览器生成测试记录。请勿填写真实姓名、电话、门牌或上传含私人信息的图片；正式开放时会启用安全提交与人工核验。',
    location: '房屋位置与规模', condition: '房屋现状与交付', special: '服务偏好', city: '所在城市', area: '所在区域', type: '房屋类型', size: '建筑面积（m²）', floor: '所在楼层', totalFloors: '总楼层', bedrooms: '卧室', livingRooms: '客厅', bathrooms: '卫生间',
    apartment: '公寓 / 大平层', villa: '别墅', choose: '请选择', handover: '预计交房时间', renovation: '装修情况', furnishing: '软装配置', appliances: '家电配置', occupancy: '目前状态',
    renoOptions: [['new', '新装 / 状态良好'], ['standard', '正常使用'], ['refresh', '需要翻新评估']], furnishingOptions: [['none', '空置'], ['partial', '部分配置'], ['full', '可拎包入住']], applianceOptions: [['none', '无家电'], ['basic', '基础家电'], ['full', '配备齐全']], occupancyOptions: [['vacant', '空置'], ['owner', '业主自住'], ['tenant', '现有租客']],
    rentMinimum: '可接受的起租期限', rentLong: '仅长期租赁（至少 6 个月）', rentQuarter: '3 个月起也可接受', cooperationModel: '合作结算方式', modelCommission: '成交后房东支付佣金', modelFixed: '约定房东固定到手租金', expectedRent: '期望月租 / 到手租金（选填）', operationReady: '经营准备情况', readyOptions: [['ready', '可直接经营'], ['prepare', '需要整理或配置'], ['review', '希望平台评估']],
    careAddons: '希望了解的升级服务（选填）', careItems: [['garden', '园林修剪'], ['pool', '泳池管理'], ['deepClean', '深度清洁'], ['ac', '空调与除湿维护'], ['pest', '虫害防治'], ['linen', '布草与软装维护'], ['storm', '雨季 / 台风专项巡检'], ['arrival', '返家前准备']],
    photos: '房屋图片（选填）', photoAction: '选择图片', photoHint: '最多 8 张 JPG、PNG 或 WebP；单张不超过 8 MB。只在本页预览，测试记录仅保存图片张数。', photoError: '请选择不超过 8 张、单张小于 8 MB 的 JPG、PNG 或 WebP 图片。', removePhoto: '移除图片', careBase: '基础看护示意月费', careExtra: '升级项目另行报价，不计入基础月费。',
    privateAddress: '详细地址及联系方式', privateHint: '正式服务时，在私密登记流程中填写；当前测试版不采集。', submit: '提交测试登记', saveError: '当前浏览器未能保存测试记录，请检查存储权限后重试。', floorError: '所在楼层不能高于总楼层。',
    serviceTitle: '服务与收费标准', processTitle: '从登记到服务', process: ['登记房屋概况', '人工核验与报价', '私密签约', '执行与对账'],
    modes: {
      leasing: {
        name: '委托租赁', short: '免费招租 · 房东付佣', lead: '房东免费登记与展示，租客免中介费；成功出租后，费用由房东承担。',
        paragraphs: ['平台协助整理房源、展示、带看、筛选租客、签约与租务跟进。登记时可选“仅长期租赁”或“3 个月起也可接受”，由平台按业主的选择匹配租客。', '房东可在核验后选择按成交租期支付佣金，或与平台另行约定固定到手租金。固定到手租金方案须单独核验经营权、收款与合同安排，具体条款只在私密签约环节展示。'],
        rateTitle: '按成交租期收取的房东佣金', rates: [['少于 6 个月', '月租金 × 20%'], ['恰好 6 个月', '半个月租金'], ['超过 6 个月', '一个月租金']],
        example: '例如月租金 ¥10,000：租 5 个月佣金 ¥2,000；租满 6 个月为 ¥5,000；租 9 个月或 12 个月及以上为 ¥10,000。租客可按适用租期选择押一付二或押二付一，水电由租客按实际使用承担。',
        note: '固定到手租金方案下，平台与业主另行确认到手租金及出租差额的归属，不与上述佣金叠加。最终以当地核验及私密签约内容为准。',
      },
      operation: {
        name: '委托经营', short: '专业经营 · 收益分成', lead: '按日经营的房源，先扣双方确认的直接运营成本，再按房东 70%、平台 30% 分配净收益。',
        paragraphs: ['平台负责房源上架、定价建议、入住服务、保洁调度、现场维护与收益对账。房态、可经营范围、当地要求及成本项目会在签约前逐一核定。', '运营成本可包含该订单或结算期内约定的水电、物业费、保洁与必要耗材等直接支出；以可核对的账目为准。已签约委托经营并获准加入置换房源池的业主，才可申请双房源旅居置换。'],
        rateTitle: '净收益分配', rates: [['业主', '70%'], ['平台', '30%'], ['分配基数', '收入 − 约定直接成本']],
        example: '举例：某结算期入住收入 ¥10,000，约定直接运营成本 ¥2,000，净收益为 ¥8,000；业主分得 ¥5,600，平台分得 ¥2,400。此例仅用于说明计算方法，不是收益承诺。',
        note: '置换须由双方业主匿名确认并经平台核验。互换入住各自另付每次 ¥500 入住前后保洁费、¥1,000 可退押金，水电按抄表结算；芭提雅收等值泰铢。',
      },
      care: {
        name: '委托看护', short: '每周巡检 · 按需升级', lead: '每周到房一次：通风、检查与电器通电保护，完成后拍照留档。',
        paragraphs: ['适合暂时不出租、仍希望保持房屋状态的业主。基础看护记录包含到访时间、异常情况与照片；发现渗漏、异味、设备故障等问题，平台联系业主确认后再安排处置。', '公寓与别墅分别报价，按面积、设施、现场距离和服务范围核算。选择的升级项目会单独列价，先确认方案和费用，再开始服务。'],
        rateTitle: '基础看护示意月费', rates: [['公寓 / 大平层', '中国 ¥399 · 芭提雅 THB 1,990'], ['别墅', '中国 ¥899 · 芭提雅 THB 4,490'], ['升级项目', '按勾选项目另行报价']],
        example: '例如带泳池的别墅，可在每周基础巡检之外，加选泳池管理、园林修剪和雨季专项检查；没有勾选的项目不会自动计费。',
        note: '以上金额仅供站内闭环测试，正式价格上线前按城市、面积与现场成本重新核定。登记不等于自动签约或收费，最终范围与金额由双方私密确认。',
      },
    },
  },
  en: {
    title: 'Professional care. Trust well placed.', intro: 'Three ways to care for your home. See services and fees at a glance.',
    tabs: 'Management options', formTitle: 'Register a managed home', formLead: 'Share the property outline so we can assess it and prepare a proposal.',
    testOnly: 'Browser-only test · no real details collected', testNote: 'This form creates a test record only in this browser. Do not enter real names, phone numbers or exact addresses, or choose private photos. A secure submission and human review will be added for live service.',
    location: 'Location & size', condition: 'Condition & handover', special: 'Service preferences', city: 'City', area: 'Area', type: 'Property type', size: 'Floor area (m²)', floor: 'Floor', totalFloors: 'Building floors', bedrooms: 'Bedrooms', livingRooms: 'Living rooms', bathrooms: 'Bathrooms',
    apartment: 'Apartment / large flat', villa: 'Villa', choose: 'Select', handover: 'Expected handover', renovation: 'Condition', furnishing: 'Furniture & soft furnishings', appliances: 'Appliances', occupancy: 'Current use',
    renoOptions: [['new', 'New / good condition'], ['standard', 'Normal use'], ['refresh', 'Needs assessment']], furnishingOptions: [['none', 'Unfurnished'], ['partial', 'Part furnished'], ['full', 'Ready to move in']], applianceOptions: [['none', 'None'], ['basic', 'Basic appliances'], ['full', 'Fully equipped']], occupancyOptions: [['vacant', 'Vacant'], ['owner', 'Owner occupied'], ['tenant', 'Tenanted']],
    rentMinimum: 'Minimum lease you accept', rentLong: 'Long term only (at least 6 months)', rentQuarter: 'Also accept 3 months or longer', cooperationModel: 'Owner payout model', modelCommission: 'Owner pays commission after leasing', modelFixed: 'Agree a fixed take-home rent', expectedRent: 'Target / take-home rent (optional)', operationReady: 'Operating readiness', readyOptions: [['ready', 'Ready to operate'], ['prepare', 'Needs furnishing or preparation'], ['review', 'Request an assessment']],
    careAddons: 'Optional care upgrades', careItems: [['garden', 'Garden pruning'], ['pool', 'Pool management'], ['deepClean', 'Deep cleaning'], ['ac', 'AC & humidity care'], ['pest', 'Pest prevention'], ['linen', 'Linen & furnishings'], ['storm', 'Storm season checks'], ['arrival', 'Pre-arrival preparation']],
    photos: 'Property photos (optional)', photoAction: 'Choose photos', photoHint: 'Up to 8 JPG, PNG or WebP images, 8 MB each. Previewed on this page only; test records store the photo count.', photoError: 'Choose up to 8 JPG, PNG or WebP images, each below 8 MB.', removePhoto: 'Remove photo', careBase: 'Sample base care per month', careExtra: 'Upgrades are quoted separately and excluded from the base rate.',
    privateAddress: 'Exact address & contact details', privateHint: 'Collected in a private secure flow for live service. This preview does not collect them.', submit: 'Submit test enquiry', saveError: 'This browser could not save the test record. Check storage permissions and try again.', floorError: 'Floor cannot be higher than the total building floors.',
    serviceTitle: 'Service & fees', processTitle: 'How it starts', process: ['Describe the home', 'Human review & quote', 'Private agreement', 'Service & statements'],
    modes: {
      leasing: {
        name: 'Leasing', short: 'Free listing · Owner pays fee', lead: 'Owners list free and tenants pay no agency fee. The owner pays only after a successful lease.',
        paragraphs: ['We help prepare the listing, market the home, arrange viewings, screen tenants, sign and follow the tenancy. Owners choose whether to accept only long leases or stays from three months.', 'After review, owners can choose commission based on the signed term or a separately agreed fixed take-home rent. The fixed-rent model requires its own review of operating rights, payment flow and agreement. Terms are shown only in private signing.'],
        rateTitle: 'Owner commission by signed term', rates: [['Under 6 months', '20% of one month’s rent'], ['Exactly 6 months', 'Half a month’s rent'], ['Over 6 months', 'One month’s rent']],
        example: 'For a sample monthly rent of ¥10,000, a 5-month lease means a ¥2,000 fee, exactly 6 months means ¥5,000, and 9 or 12+ months means ¥10,000. Eligible tenants choose 1 deposit + 2 rent or 2 deposit + 1 rent. Tenants pay actual utilities.',
        note: 'For fixed take-home rent, the owner and platform agree on the owner’s amount and the platform’s rental spread separately. It is not added to the commission above. Local review and the private agreement govern.',
      },
      operation: {
        name: 'Managed operation', short: 'Active stays · Shared net revenue', lead: 'For daily stays, agreed direct operating costs are deducted first. The owner receives 70% of net proceeds and the platform 30%.',
        paragraphs: ['We manage listing, pricing guidance, arrivals, cleaning, on-site coordination and earnings statements. Availability, local operating requirements and costs are verified before signing.', 'Direct costs may include agreed utilities, property fees, cleaning and necessary supplies for the booking or statement period, supported by checkable records. Only owners with an active operation agreement and a home admitted to the exchange pool can request a two-home stay exchange.'],
        rateTitle: 'Net revenue split', rates: [['Owner', '70%'], ['Platform', '30%'], ['Split base', 'Revenue − agreed direct costs']],
        example: 'Example: ¥10,000 stay revenue minus ¥2,000 agreed direct costs leaves ¥8,000 net. The owner receives ¥5,600 and the platform ¥2,400. This illustrates the calculation, not a return promise.',
        note: 'Exchange requires both owners’ anonymous approval and platform review. Each stay has a ¥500 pre/post-stay cleaning fee, ¥1,000 refundable deposit and metered utilities; Pattaya collects the THB equivalent.',
      },
      care: {
        name: 'Home care', short: 'Weekly checks · Optional upgrades', lead: 'One visit each week for ventilation, inspection, appliance power protection and a photo record.',
        paragraphs: ['For owners keeping a home unused. Visit reports include the time, photos and any issues. If we find leaks, odors or equipment faults, we ask the owner before arranging extra work.', 'Apartments and villas are quoted separately based on size, facilities, travel and scope. Add-ons are priced item by item; the service starts only after the owner confirms the proposal.'],
        rateTitle: 'Sample base care per month', rates: [['Apartment / large flat', 'China ¥399 · Pattaya THB 1,990'], ['Villa', 'China ¥899 · Pattaya THB 4,490'], ['Upgrades', 'Quoted per selected service']],
        example: 'A villa with a pool might add pool management, garden pruning and storm checks to weekly basic care. Unselected services are not charged automatically.',
        note: 'These amounts are for browser-only workflow testing. Live prices will be reviewed by city, size and local delivery cost before launch. An enquiry does not create an agreement or charge.',
      },
    },
  },
} as const

function RegistrationForm({ lang, mode }: { lang: Language; mode: Mode }) {
  const t = copy[lang]
  const [cityId, setCityId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [previews, setPreviews] = useState<Preview[]>([])
  const [photoError, setPhotoError] = useState('')
  const [saveError, setSaveError] = useState('')
  const city = cities.find(item => item.id === cityId)
  const careEstimate = mode === 'care' && (propertyType === 'apartment' || propertyType === 'villa') && cityId
    ? careBasePrices[cityId === 'pattaya' ? 'pattaya' : 'china'][propertyType] : null
  const careCurrency = cityId === 'pattaya' ? 'THB' : 'CNY'
  useEffect(() => () => previews.forEach(item => URL.revokeObjectURL(item.url)), [previews])

  function selectPhotos(files: FileList | null) {
    setPhotoError('')
    if (!files?.length) return
    const next = Array.from(files)
    if (next.length > 8 || next.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024)) {
      setPreviews([])
      setPhotoError(t.photoError)
      return
    }
    setPreviews(next.map(file => ({ url: URL.createObjectURL(file) })))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) || '')
    if (Number(value('floor')) > Number(value('totalFloors'))) { setSaveError(t.floorError); return }
    setSaveError('')
    try {
      ManagementTestSubmit({
        mode, city: cityId, region: regionId, propertyType: value('propertyType'), area: Number(value('area')),
        floor: Number(value('floor')), totalFloors: Number(value('totalFloors')), bedrooms: Number(value('bedrooms')),
        livingRooms: Number(value('livingRooms')), bathrooms: Number(value('bathrooms')), handover: value('handover'),
        renovation: value('renovation'), furnishing: value('furnishing'), appliances: value('appliances'), occupancy: value('occupancy'),
        rentalMinimum: mode === 'leasing' ? value('rentalMinimum') : undefined,
        cooperationModel: mode === 'leasing' ? value('cooperationModel') : undefined,
        expectedMonthlyRent: mode === 'leasing' && value('expectedMonthlyRent') ? Number(value('expectedMonthlyRent')) : undefined,
        operationReady: mode === 'operation' ? value('operationReady') : undefined,
        careAddons: mode === 'care' ? data.getAll('careAddons').map(String) : undefined,
        careEstimate: careEstimate || undefined,
        photoCount: previews.length,
      })
    } catch { setSaveError(t.saveError) }
  }

  const countOptions = (max: number) => Array.from({ length: max + 1 }, (_, number) => <option key={number} value={number}>{number}</option>)
  const selectOptions = (items: ReadonlyArray<readonly [string, string]>) => <><option value="">{t.choose}</option>{items.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</>
  return <form className="management-form" id="register-property" onSubmit={submit}>
    <div className="management-form-head"><p className="eyebrow">PROPERTY / ENQUIRY</p><h2>{t.formTitle}</h2><p>{t.formLead}</p></div>
    <div className="management-test-note"><strong>{t.testOnly}</strong><p>{t.testNote}</p></div>
    <fieldset className="management-fieldset"><legend>01 / {t.location}</legend><div className="management-fields">
      <label>{t.city}<select required value={cityId} onChange={event => { setCityId(event.target.value); setRegionId('') }}><option value="">{t.choose}</option>{cities.map(item => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label>
      <label>{t.area}<select required value={regionId} onChange={event => setRegionId(event.target.value)} disabled={!city}><option value="">{t.choose}</option>{city?.regions.map(item => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label>
      <label>{t.type}<select name="propertyType" required value={propertyType} onChange={event => setPropertyType(event.target.value)}>{selectOptions([['apartment', t.apartment], ['villa', t.villa]])}</select></label>
      <label>{t.size}<input name="area" required type="number" min="10" max="10000" inputMode="decimal" placeholder="m²"/></label>
      <label>{t.floor}<input name="floor" required type="number" min="1" max="200" inputMode="numeric"/></label>
      <label>{t.totalFloors}<input name="totalFloors" required type="number" min="1" max="200" inputMode="numeric"/></label>
      <label>{t.bedrooms}<select name="bedrooms" required><option value="">{t.choose}</option>{countOptions(12)}</select></label>
      <label>{t.livingRooms}<select name="livingRooms" required><option value="">{t.choose}</option>{countOptions(6)}</select></label>
      <label>{t.bathrooms}<select name="bathrooms" required><option value="">{t.choose}</option>{countOptions(10)}</select></label>
    </div></fieldset>
    <fieldset className="management-fieldset"><legend>02 / {t.condition}</legend><div className="management-fields">
      <label>{t.handover}<input name="handover" required type="date"/></label>
      <label>{t.occupancy}<select name="occupancy" required>{selectOptions(t.occupancyOptions)}</select></label>
      <label>{t.renovation}<select name="renovation" required>{selectOptions(t.renoOptions)}</select></label>
      <label>{t.furnishing}<select name="furnishing" required>{selectOptions(t.furnishingOptions)}</select></label>
      <label>{t.appliances}<select name="appliances" required>{selectOptions(t.applianceOptions)}</select></label>
    </div></fieldset>
    <fieldset className="management-fieldset"><legend>03 / {t.special}</legend>
      {mode === 'leasing' && <div className="management-fields"><label className="field-wide">{t.rentMinimum}<select name="rentalMinimum" required><option value="">{t.choose}</option><option value="long">{t.rentLong}</option><option value="quarter">{t.rentQuarter}</option></select></label><label className="field-wide">{t.cooperationModel}<select name="cooperationModel" required><option value="">{t.choose}</option><option value="commission">{t.modelCommission}</option><option value="fixed">{t.modelFixed}</option></select></label><label>{t.expectedRent}<input name="expectedMonthlyRent" type="number" min="0" inputMode="decimal" placeholder={cityId === 'pattaya' ? 'THB' : 'CNY'}/></label></div>}
      {mode === 'operation' && <div className="management-fields"><label className="field-wide">{t.operationReady}<select name="operationReady" required>{selectOptions(t.readyOptions)}</select></label></div>}
      {mode === 'care' && <><p className="management-choice-label">{t.careAddons}</p><div className="management-checks">{t.careItems.map(([value, label]) => <label key={value}><input type="checkbox" name="careAddons" value={value}/>{label}</label>)}</div>{careEstimate !== null && <p className="management-care-estimate"><span>{t.careBase}</span><strong>{new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: careCurrency, maximumFractionDigits: 0 }).format(careEstimate)}</strong><small>{t.careExtra}</small></p>}</>}
    </fieldset>
    <div className="management-photos"><div><strong>{t.photos}</strong><p>{t.photoHint}</p></div><label className="button button-outline">{t.photoAction}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => { selectPhotos(event.target.files); event.target.value = '' }}/></label></div>
    {photoError && <p role="alert" className="form-error">{photoError}</p>}
    {previews.length > 0 && <div className="management-photo-grid">{previews.map((item, index) => <div key={item.url}><img src={item.url} alt={`${t.photos} ${index + 1}`}/><button type="button" aria-label={`${t.removePhoto} ${index + 1}`} onClick={() => setPreviews(previous => previous.filter(photo => photo.url !== item.url))}>×</button></div>)}</div>}
    <div className="management-private"><strong>{t.privateAddress}</strong><p>{t.privateHint}</p></div>
    {saveError && <p role="alert" className="form-error">{saveError}</p>}
    <button className="button button-dark management-submit" type="submit">{t.submit}<span aria-hidden="true">↗</span></button>
  </form>
}

function ServiceDetails({ lang, mode }: { lang: Language; mode: Mode }) {
  const t = copy[lang]
  const details = t.modes[mode]
  return <aside className="management-service" aria-label={t.serviceTitle}>
    <p className="eyebrow">SERVICE / {String(modes.indexOf(mode) + 1).padStart(2, '0')}</p>
    <h2>{t.serviceTitle}</h2><p className="management-service-lead">{details.lead}</p>
    {details.paragraphs.map(paragraph => <p key={paragraph} className="management-service-paragraph">{paragraph}</p>)}
    <div className="management-rates"><h3>{details.rateTitle}</h3>{details.rates.map(([label, amount]) => <div key={label}><span>{label}</span><strong>{amount}</strong></div>)}</div>
    <div className="management-example"><span>EXAMPLE / {lang === 'zh' ? '举例说明' : 'HOW IT WORKS'}</span><p>{details.example}</p></div>
    <p className="management-service-note">{details.note}</p>
    <div className="management-process"><h3>{t.processTitle}</h3><ol>{t.process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol></div>
  </aside>
}

export function ManagementPage({ lang, mode }: { lang: Language; mode?: string }) {
  const t = copy[lang]
  const [selected, setSelected] = useState<Mode>(modes.includes(mode as Mode) ? mode as Mode : 'leasing')
  useEffect(() => { setSelected(modes.includes(mode as Mode) ? mode as Mode : 'leasing') }, [mode])
  return <div className="page-shell page-top management-catalog-page">
    <div className="page-title"><p className="eyebrow">03 / PROPERTY CARE</p><h1>{t.title}</h1><p>{t.intro}</p></div>
    <div className="management-tabs" role="tablist" aria-label={t.tabs}>{modes.map((item, index) => <button key={item} id={`management-tab-${item}`} type="button" role="tab" aria-selected={selected === item} aria-controls="management-panel" className={selected === item ? 'is-active' : ''} onClick={() => { setSelected(item); window.history.replaceState(null, '', `#/management/${item}`) }}><span>{String(index + 1).padStart(2, '0')} / SERVICE</span><strong>{t.modes[item].name}</strong><small>{t.modes[item].short}</small></button>)}</div>
    <div className="management-mobile-highlight"><p>{t.modes[selected].lead}</p><div>{t.modes[selected].rates.slice(0, 2).map(([label, amount]) => <span key={label}>{label} <strong>{amount}</strong></span>)}</div></div>
    <div className="management-content" id="management-panel" role="tabpanel" aria-labelledby={`management-tab-${selected}`}><RegistrationForm key={selected} lang={lang} mode={selected}/><ServiceDetails lang={lang} mode={selected}/></div>
  </div>
}
