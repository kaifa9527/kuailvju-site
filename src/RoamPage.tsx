import { useMemo, useState } from 'react'
import { cities, listings, type CityId } from './data'
import { LineIcon, type IconName } from './components/LineIcon'
import type { Language } from './lib/catalog'
import {
  roamProducts, roamGuides, categoryLabels,
  type RoamCategory, type RoamProduct,
} from './roamData'

const cityName = (city: CityId, lang: Language) => cities.find(c => c.id === city)?.[lang] ?? ''

/* 精致占位图：统一深绿渐变 + 类别细线图标 + 实勘待补角标 */
const categoryIcon: Record<RoamCategory, IconName> = {
  ticket: 'location', activity: 'guests', hike: 'compass', custom: 'star',
}
function RoamImage({ product, ratio = '4/3', big = false }: { product: RoamProduct; ratio?: string; big?: boolean }) {
  return (
    <div className={`roam-img ${big ? 'roam-img-big' : ''}`} style={{ aspectRatio: ratio }}>
      <span className="roam-img-icon"><LineIcon name={categoryIcon[product.category]} size={big ? 40 : 28} /></span>
      <span className="roam-img-city">{cityName(product.city, 'zh')}</span>
      <span className="roam-img-tag">{big ? '实勘图待补' : '实勘待补'}</span>
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return <span className="roam-stars"><LineIcon name="heart" size={13} />{rating.toFixed(1)}</span>
}

/* 商品卡 */
function ProductCard({ product, lang }: { product: RoamProduct; lang: Language }) {
  return (
    <a className="roam-product-card" href={`#/roam/${product.id}`}>
      <div className="roam-product-media">
        <RoamImage product={product} />
        <button type="button" className="roam-wish" aria-label={lang === 'zh' ? '收藏' : 'Save'}>
          <LineIcon name="heart" size={18} />
        </button>
      </div>
      <div className="roam-product-body">
        <div className="roam-product-line">
          <strong>{product.title[lang]}</strong>
          <Stars rating={product.rating} />
        </div>
        <p>{product.summary[lang]}</p>
        <div className="roam-product-foot">
          <span className="roam-price-pending">{lang === 'zh' ? '票价待核验' : 'Price pending'}</span>
        </div>
      </div>
    </a>
  )
}

/* 分类 Tabs */
const tabs: (RoamCategory | 'all')[] = ['all', 'ticket', 'activity', 'hike', 'custom']

function RowSection({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="roam-row">
      <div className="roam-row-head">
        <h3>{title}</h3>
        {note && <span>{note}</span>}
      </div>
      <div className="roam-rail">{children}</div>
    </section>
  )
}

/* 完整列表视图 */
function RoamListView({ lang }: { lang: Language }) {
  const [tab, setTab] = useState<RoamCategory | 'all'>('all')
  const list = useMemo(
    () => (tab === 'all' ? roamProducts : roamProducts.filter(p => p.category === tab)),
    [tab],
  )
  const recent = list.slice(0, 6)
  const popular = [...list].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const local = list.filter(p => p.category === 'hike' || p.category === 'activity').slice(0, 8)
  const guides = roamGuides
  return (
    <div className="roam-list">
      <div className="roam-tabs" role="tablist">
        {tabs.map(t => (
          <button
            key={t} type="button" role="tab" aria-selected={tab === t}
            className={tab === t ? 'is-active' : ''}
            onClick={() => setTab(t)}
          >
            {t === 'all' ? (lang === 'zh' ? '全部' : 'All') : categoryLabels[t][lang]}
          </button>
        ))}
      </div>

      <RowSection title={lang === 'zh' ? '这几天就可以出发' : 'Bookable soon'}>
        {recent.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
      </RowSection>

      <RowSection title={lang === 'zh' ? '去过的人都给了高分' : 'Top rated by travellers'}>
        {popular.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
      </RowSection>

      <RowSection title={lang === 'zh' ? '换个玩法，深入这座城' : 'Go deeper into each city'}>
        {local.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
      </RowSection>

      <section className="roam-guides">
        <div className="roam-row-head">
          <h3>{lang === 'zh' ? '住客和漫游者的在地手记' : 'Notes from travellers'}</h3>
        </div>
        <div className="roam-guides-grid">
          <div className="roam-guides-feature">
            <RoamImage product={roamProducts.find(p => p.id === 'rainforest-hike')!} ratio="3/4" big />
            <div className="roam-guides-feature-copy">
              <span className="roam-guide-tag">{guides[0].tag[lang]}</span>
              <h4>{guides[0].title[lang]}</h4>
              <p>{guides[0].excerpt[lang]}</p>
              <span className="roam-guide-by">{guides[0].author} · {guides[0].minutes} 分钟</span>
            </div>
          </div>
          <div className="roam-guides-list">
            {guides.slice(1).map(g => (
              <a key={g.id} className="roam-guide-item" href="#/roam/rainforest-hike">
                <span className="roam-guide-tag">{g.tag[lang]}</span>
                <h4>{g.title[lang]}</h4>
                <p>{g.excerpt[lang]}</p>
                <span className="roam-guide-by">{g.author} · {g.minutes} 分钟</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* 首页精选网格（嵌入） */
function RoamFeatured({ lang, previewLimit = 8 }: { lang: Language; previewLimit?: number }) {
  const picks = [...roamProducts].sort((a, b) => b.rating - a.rating).slice(0, previewLimit)
  return (
    <div className="roam-featured-grid">
      {picks.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
    </div>
  )
}

export function RoamPage({ lang, id, embedded = false, previewLimit, groupCities = false }: {
  lang: Language; id?: string; query: string; embedded?: boolean; hideSearch?: boolean;
  previewLimit?: number; groupCities?: boolean
}) {
  const product = roamProducts.find(p => p.id === id)

  if (product) {
    return product.category === 'custom'
      ? <RoamCustomView product={product} lang={lang} />
      : <RoamDetailView product={product} lang={lang} />
  }

  if (embedded && !groupCities) {
    return <RoamFeatured lang={lang} previewLimit={previewLimit} />
  }

  return (
    <div className={embedded ? 'roam-page roam-page-inline' : 'roam-page page-shell page-top'}>
      <RoamListView lang={lang} />
    </div>
  )
}

const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`

function RelatedStay({ stayId, note, lang }: { stayId?: string; note?: { zh: string; en: string }; lang: Language }) {
  const s = listings.find(l => l.id === stayId)
  if (!s) return null
  const c = cities.find(x => x.id === s.city)!
  return (
    <a className="roam-related-stay" href={`#/listing/${s.id}`}>
      <img src={asset(s.gallery[0].image)} alt={s.title[lang]} loading="lazy" />
      <div className="roam-related-copy">
        <small>{c[lang]}</small>
        <strong>{s.title[lang]}</strong>
        {note && <p>{note[lang]}</p>}
      </div>
      <span className="roam-related-go"><LineIcon name="arrow" size={18} /></span>
    </a>
  )
}

/* 标准详情 · 预订卡（UI 即时感，真实走站内工作台） */
function BookingCard({ product, lang }: { product: RoamProduct; lang: Language }) {
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState(0)
  const [guests, setGuests] = useState(1)
  const [receipt, setReceipt] = useState('')
  const slots = lang === 'zh' ? ['上午 09:00', '上午 10:30', '下午 14:00', '下午 15:30'] : ['09:00', '10:30', '14:00', '15:30']
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) { setReceipt(lang === 'zh' ? '请先选一个日期。' : 'Choose a date first.'); return }
    const code = `RM-${Date.now().toString(36).toUpperCase()}`
    const record = { code, product: product.id, date, slot: slots[slot], guests, createdAt: new Date().toISOString(), pending: true }
    try { localStorage.setItem('kuailvju-roam-workbench', JSON.stringify([record, ...JSON.parse(localStorage.getItem('kuailvju-roam-workbench') || '[]')])) } catch { /* local record */ }
    setReceipt(lang === 'zh' ? `需求已记录（${code}），平台确认场次与票价后回复你。` : `Request saved (${code}). We confirm the slot and fare and reply.`)
  }
  return (
    <div className="roam-booking-card">
      <div className="roam-booking-head">
        <span className="roam-price-pending">{lang === 'zh' ? '票价核验中' : 'Fare pending'}</span>
        <p>{lang === 'zh' ? '确认场次后给出真实价格' : 'Real fare after slot confirmation'}</p>
      </div>
      <form onSubmit={submit}>
        <label className="roam-field">
          <span>{lang === 'zh' ? '日期' : 'Date'}</span>
          <input type="date" value={date} min={new Date().toLocaleDateString('en-CA')} onChange={e => setDate(e.target.value)} />
        </label>
        <div className="roam-field">
          <span>{lang === 'zh' ? '时段' : 'Time'}</span>
          <div className="roam-slots">
            {slots.map((s, i) => (
              <button type="button" key={s} className={slot === i ? 'is-active' : ''} onClick={() => setSlot(i)}>{s}</button>
            ))}
          </div>
        </div>
        <label className="roam-field roam-guest-field">
          <span>{lang === 'zh' ? '人数' : 'Guests'}</span>
          <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 8].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button className="button button-dark roam-book-btn" type="submit">{lang === 'zh' ? '提交预订需求' : 'Request booking'}</button>
        {receipt && <p className="roam-booking-receipt">{receipt}</p>}
        <p className="roam-booking-note">{lang === 'zh' ? '目前不直接出票，由平台工作台确认后回复。' : 'No instant ticket yet; the workbench confirms and replies.'}</p>
      </form>
    </div>
  )
}

/* 标准详情视图 */
function RoamDetailView({ product, lang }: { product: RoamProduct; lang: Language }) {
  const c = cityName(product.city, lang)
  return (
    <div className="roam-detail-page page-shell">
      <nav className="roam-breadcrumb">
        <a href="#/">{lang === 'zh' ? '首页' : 'Home'}</a>
        <a href="#/roam">{lang === 'zh' ? '漫游' : 'Roam'}</a>
        <span>{c}，{product.title[lang]}</span>
      </nav>

      <div className="roam-detail-gallery">
        <RoamImage product={product} ratio="16/9" big />
        <div className="roam-gallery-rest">
          {[0, 1, 2].map(i => <RoamImage key={i} product={product} ratio="4/3" />)}
        </div>
        <span className="roam-gallery-count">{lang === 'zh' ? `共 ${product.galleryCount} 张，实勘图待补` : `${product.galleryCount} photos pending`}</span>
      </div>

      <div className="roam-detail-layout">
        <div className="roam-detail-main">
          <div className="roam-fact-chips">
            {product.facts.map(f => (
              <span className="roam-fact-chip" key={f.zh}><LineIcon name="check" size={15} />{f[lang]}</span>
            ))}
          </div>
          <h1 className="roam-hook">{product.hook[lang]}</h1>
          <p className="roam-desc">{product.description[lang]}</p>

          {product.itinerary && (
            <section className="roam-itinerary">
              <h2>{lang === 'zh' ? '行程安排' : 'Itinerary'}</h2>
              {product.itinerary.map(it => (
                <div className="roam-itinerary-item" key={it.time}>
                  <span className="roam-itinerary-time">{it.time}</span>
                  <span className="roam-itinerary-axis" />
                  <div className="roam-itinerary-copy">
                    <h4>{it.title[lang]}</h4>
                    <p>{it.detail[lang]}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {product.host && (
            <section className="roam-host">
              <span className="roam-host-avatar">{product.host.name.slice(0, 1)}</span>
              <div className="roam-host-copy">
                <h4>{product.host.name}，{product.host.role[lang]}</h4>
                <p>{product.host.years[lang]}，{product.host.rating.toFixed(1)}（{product.host.reviews} {lang === 'zh' ? '条评价' : 'reviews'}）</p>
              </div>
              <button type="button" className="roam-host-msg">{lang === 'zh' ? '发消息' : 'Message'}</button>
            </section>
          )}

          {product.requirements && (
            <section className="roam-requirements">
              <h2>{lang === 'zh' ? '预订须知' : 'Before you book'}</h2>
              <div className="roam-requirements-grid">
                {product.requirements.map(r => (
                  <div className="roam-requirement" key={r.title.zh}>
                    <LineIcon name={r.icon} size={22} />
                    <h4>{r.title[lang]}</h4>
                    <p>{r.detail[lang]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="roam-related">
            <h2>{lang === 'zh' ? '玩完，就近住下来' : 'Stay nearby afterwards'}</h2>
            <RelatedStay stayId={product.relatedStayId} note={product.relatedStayNote} lang={lang} />
          </section>
        </div>

        <aside className="roam-booking-aside">
          <BookingCard product={product} lang={lang} />
        </aside>
      </div>
    </div>
  )
}

/* 定制询价视图 */
type InquiryGroup = { label: string; options: string[]; multi?: boolean }
const inquiryConfig: Record<string, { groups: InquiryGroup[]; ask: string }> = {
  yacht: {
    ask: '请告诉我们，你期待怎样的海上时光',
    groups: [
      { label: '出海方式', options: ['包艇', '拼艇'] },
      { label: '出海时长', options: ['半日', '整日', '两天一晚', '多天'] },
      { label: '想体验什么', options: ['海钓', '尾波滑水', '浮潜', '桨板', '海上餐食', '生日布置'], multi: true },
    ],
  },
  golf: {
    ask: '请告诉我们，你想怎么安排这一场',
    groups: [
      { label: '安排方式', options: ['18 洞', '9 洞', '多日多场'] },
      { label: '时长', options: ['半天', '一天', '两天'] },
      { label: '需要的服务', options: ['配教练', '球童', '包车', '租装备', '含午餐', '订开球时间'], multi: true },
    ],
  },
  car: {
    ask: '请告诉我们，你的路线和时间',
    groups: [
      { label: '用车方式', options: ['包车', '拼车', '多日环线'] },
      { label: '时长', options: ['半日', '整日', '两天', '多日'] },
      { label: '需要的服务', options: ['司机', '导游', '多语言', '含餐', '住宿安排'], multi: true },
    ],
  },
}

function ChipGroup({ group, values, onToggle }: { group: InquiryGroup; values: string[]; onToggle: (o: string, multi?: boolean) => void }) {
  return (
    <div className="roam-inquiry-group">
      <span className="roam-inquiry-label">{group.label}</span>
      <div className="roam-chip-group">
        {group.options.map(o => (
          <button type="button" key={o} className={values.includes(o) ? 'is-active' : ''} onClick={() => onToggle(o, group.multi)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function RoamCustomView({ product, lang }: { product: RoamProduct; lang: Language }) {
  const cfg = inquiryConfig[product.inquiryKind ?? 'yacht']
  const [values, setValues] = useState<string[]>([])
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [budget, setBudget] = useState('')
  const [contact, setContact] = useState('')
  const [receipt, setReceipt] = useState('')
  const zh = lang === 'zh'
  const budgets = zh ? ['先看方案', '¥5,000 以内', '¥5,000–10,000', '¥10,000 以上'] : ['Quote first', 'Under ¥5,000', '¥5,000–10,000', 'Over ¥10,000']
  const toggle = (o: string, multi?: boolean) => {
    if (!multi) { setValues(v => (v.includes(o) ? v.filter(x => x !== o) : [...v.filter(x => !cfg.groups.some(g => !g.multi && g.options.includes(x))), o])); return }
    setValues(v => (v.includes(o) ? v.filter(x => x !== o) : [...v, o]))
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) { setReceipt(zh ? '请先选一个预计日期。' : 'Choose an expected date first.'); return }
    const code = `CU-${Date.now().toString(36).toUpperCase()}`
    const record = { code, product: product.id, values, date, adults, children, budget, createdAt: new Date().toISOString(), pending: true }
    try { localStorage.setItem('kuailvju-custom-workbench', JSON.stringify([record, ...JSON.parse(localStorage.getItem('kuailvju-custom-workbench') || '[]')])) } catch { /* local record */ }
    setReceipt(zh ? `需求已提交（${code}），设计师会在 2 小时内出 1v1 方案。` : `Submitted (${code}). A one-to-one plan follows within two hours.`)
  }
  const promises = zh
    ? [['专属设计师 1v1 对接'], ['2 小时内出方案，免费报价'], ['同步档期与气象，不强制下单'], ['不满意可继续调整，直到满意']]
    : [['Dedicated 1:1 planner'], ['Plan in 2 hours, free quote'], ['Availability & weather checks, no commitment'], ['Revise until you are happy']]
  return (
    <div className="roam-custom-page">
      <div className="roam-custom-hero">
        <RoamImage product={product} ratio="21/9" big />
        <div className="roam-custom-hero-copy">
          <span className="roam-custom-label">{zh ? '私人定制' : 'Private custom'}</span>
          <h1>{product.title[lang]}</h1>
          <p>{product.hook[lang]}</p>
        </div>
      </div>

      <div className="roam-custom-layout page-shell">
        <div className="roam-custom-main">
          <form className="roam-inquiry" onSubmit={submit}>
            <h2>{zh ? cfg.ask : 'Tell us what you have in mind'}</h2>
            {cfg.groups.map(g => <ChipGroup key={g.label} group={g} values={values} onToggle={toggle} />)}

            <div className="roam-inquiry-row">
              <label className="roam-field">
                <span>{zh ? '预计出行日期' : 'Expected date'}</span>
                <input type="date" value={date} min={new Date().toLocaleDateString('en-CA')} onChange={e => setDate(e.target.value)} />
              </label>
              <label className="roam-field">
                <span>{zh ? '成人' : 'Adults'}</span>
                <select value={adults} onChange={e => setAdults(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}</select>
              </label>
              <label className="roam-field">
                <span>{zh ? '儿童' : 'Children'}</span>
                <select value={children} onChange={e => setChildren(Number(e.target.value))}>{[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}</select>
              </label>
            </div>

            <div className="roam-inquiry-group">
              <span className="roam-inquiry-label">{zh ? '预算范围' : 'Budget'}</span>
              <div className="roam-chip-group">
                {budgets.map(b => <button type="button" key={b} className={budget === b ? 'is-active' : ''} onClick={() => setBudget(b)}>{b}</button>)}
              </div>
            </div>

            <label className="roam-field roam-contact-field">
              <span>{zh ? '联系方式（选填，演示阶段可不填）' : 'Contact (optional)'}</span>
              <input type="text" value={contact} placeholder={zh ? '正式开放后填写' : 'Available after launch'} onChange={e => setContact(e.target.value)} />
            </label>

            <button className="button button-dark roam-custom-submit" type="submit">{zh ? '提交定制需求，免费报价' : 'Submit request, free quote'}</button>
            {receipt && <p className="roam-booking-receipt">{receipt}</p>}
          </form>

          {product.reviews && product.reviews.length > 0 && (
            <section className="roam-real-records">
              <h2>{zh ? '真实出行记录' : 'Real trip records'}</h2>
              <div className="roam-records-grid">
                {product.reviews.map(r => (
                  <div className="roam-record" key={r.name}>
                    <span className="roam-record-avatar">{r.name.slice(0, 1)}</span>
                    <div className="roam-record-head">
                      <strong>{r.name}</strong>
                      <span className="roam-stars"><LineIcon name="heart" size={13} />{r.rating}</span>
                    </div>
                    <p>{r.text[lang]}</p>
                    <small>{r.date}</small>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="roam-custom-side">
          <div className="roam-promise">
            <h3>{zh ? '2 小时内出 1v1 方案' : '1:1 plan in 2 hours'}</h3>
            <ul>
              {promises.map((p, i) => (
                <li key={i}><span className="roam-promise-check"><LineIcon name="check" size={15} /></span>{p[0]}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="roam-related page-shell">
        <h2>{zh ? '漫游之后，归于静谧居所' : 'Return to a quiet place'}</h2>
        <RelatedStay stayId={product.relatedStayId} note={product.relatedStayNote} lang={lang} />
      </section>
    </div>
  )
}
