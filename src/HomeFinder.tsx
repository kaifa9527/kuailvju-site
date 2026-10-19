import { useEffect, useRef, useState, type FormEvent } from 'react'
import { cities } from './data'
import type { Language } from './lib/catalog'
import { localDate } from './lib/exchangeDiscovery'
import { initialHomeSearch, makeHomeSearchHash, type HomeMode, type HomeSearch } from './lib/homeDiscovery'
import { LineIcon } from './components/LineIcon'

const translations = {
  zh: {
    city: '目的地', cityAny: '选择城市', region: '区域', regionAny: '全部区域', start: '入住日期', moveIn: '起租日期', visit: '体验日期',
    end: '退房日期', term: '租期', guests: '人数', search: '搜索', anytime: '不限日期',
    halfYear: '半年', year: '一年', anyTerm: '半年或一年', category: '体验类型',
    all: '全部', attractions: '景点', tickets: '门票', experiences: '当地体验',
    invalid: '请填写有效日期：退房必须晚于入住。',
    demo: '当前为演示内容，房源、景点和档期尚未开放真实预订。',
    modeLabel: '选择旅居类型', modeRentals: '长租', modeStays: '短租', modeExchange: '置换', modeRoam: '漫游',
  },
  en: {
    city: 'Destination', cityAny: 'Choose a city', region: 'Area', regionAny: 'All areas', start: 'Check-in', moveIn: 'Move-in', visit: 'Visit date',
    end: 'Check out', term: 'Lease', guests: 'Guests', search: 'Search', anytime: 'Any date',
    halfYear: 'Six months', year: 'One year', anyTerm: '6 or 12 months', category: 'Explore',
    all: 'All', attractions: 'Attractions', tickets: 'Tickets', experiences: 'Local experiences',
    invalid: 'Choose valid dates; checkout must be after check-in.',
    demo: 'This is a preview; homes, attractions and dates are not yet bookable.',
    modeLabel: 'Choose a stay type', modeRentals: 'Long', modeStays: 'Short', modeExchange: 'Exchange', modeRoam: 'Roam',
  },
}

export function HomeFinder({ lang, mode, onSummaryChange, onSearch }: { lang: Language; mode: HomeMode; onSummaryChange?: (summary: [string, string, string]) => void; onSearch?: (mode: HomeMode, query: string) => void }) {
  const t = translations[lang]
  const [draftByMode, setDraftByMode] = useState<Record<HomeMode, HomeSearch>>(() => ({
    rentals: { ...initialHomeSearch }, stays: { ...initialHomeSearch },
    exchange: { ...initialHomeSearch }, roam: { ...initialHomeSearch },
  }))
  const [error, setError] = useState('')
  // Pointer users should not see an orphaned focus ring after choosing an option.
  // Preserve keyboard focus, which remains necessary for accessible tab navigation.
  const pointerSelection = useRef(false)
  const releasePointerFocus = (target: EventTarget) => {
    if (!pointerSelection.current) return
    if (target instanceof HTMLSelectElement || (target instanceof HTMLInputElement && target.type === 'date')) {
      window.requestAnimationFrame(() => {
        if (document.activeElement === target) target.blur()
      })
    }
  }
  const draft = draftByMode[mode]
  const startLabel = mode === 'rentals' ? t.moveIn : mode === 'roam' ? t.visit : t.start
  const selectedCity = cities.find(entry => entry.id === draft.city)
  const destination = selectedCity?.[lang] || (lang === 'zh' ? '任何地方' : 'Anywhere')
  const dateSummary = draft.start ? (draft.end ? `${draft.start} — ${draft.end}` : draft.start) : (lang === 'zh' ? '任意时间' : 'Any date')
  const optionSummary = mode === 'rentals' ? (draft.term === 'halfYear' ? t.halfYear : draft.term === 'year' ? t.year : t.anyTerm) : mode === 'roam' ? ({ all: t.all, attractions: t.attractions, tickets: t.tickets, experiences: t.experiences }[draft.category]) : `${draft.guests} ${t.guests}`
  useEffect(() => { onSummaryChange?.([destination, dateSummary, optionSummary]) }, [onSummaryChange, destination, dateSummary, optionSummary])
  const update = (change: Partial<HomeSearch>) => {
    setError('')
    setDraftByMode(current => ({ ...current, [mode]: { ...current[mode], ...change } }))
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const hash = makeHomeSearchHash(mode, draft, localDate())
      if (onSearch) onSearch(mode, hash.split('?')[1] || '')
      else window.location.hash = hash
    }
    catch { setError(t.invalid) }
  }
  return <section className="home-discovery page-shell" aria-label={t.search}>
    <form className="home-discovery-form" onSubmit={submit} role="search"
      onPointerDownCapture={() => { pointerSelection.current = true }}
      onKeyDownCapture={() => { pointerSelection.current = false }}
      onChangeCapture={event => releasePointerFocus(event.target)}>
      <label className="home-discovery-field home-discovery-destination">
        <span>{t.city}</span>
        <select value={draft.city} onChange={event => update({ city: event.target.value, region: 'all' })} aria-label={t.city}>
          <option value="all">{t.cityAny}</option>
          {cities.map(city => <option key={city.id} value={city.id}>{city[lang]}</option>)}
        </select>
      </label>
      {(mode === 'rentals' || mode === 'stays' || mode === 'exchange') && <label className="home-discovery-field">
        <span>{t.region}</span>
        <select value={draft.region} onChange={event => update({ region: event.target.value })} aria-label={t.region}>
          <option value="all">{t.regionAny}</option>
          {selectedCity?.regions.map(region => <option key={region.id} value={region.id}>{region[lang]}</option>)}
        </select>
      </label>}
      {mode === 'rentals' && <label className="home-discovery-field">
        <span>{t.term}</span>
        <select value={draft.term} onChange={event => update({ term: event.target.value as HomeSearch['term'] })}>
          <option value="all">{t.anyTerm}</option><option value="halfYear">{t.halfYear}</option><option value="year">{t.year}</option>
        </select>
      </label>}
      {mode === 'roam' && <label className="home-discovery-field">
        <span>{t.category}</span>
        <select value={draft.category} onChange={event => update({ category: event.target.value as HomeSearch['category'] })}>
          <option value="all">{t.all}</option><option value="attractions">{t.attractions}</option>
          <option value="tickets">{t.tickets}</option><option value="experiences">{t.experiences}</option>
        </select>
      </label>}
      <label className="home-discovery-field">
        <span>{startLabel}</span>
        <input aria-label={startLabel} type="date" min={localDate()} value={draft.start} onChange={event => update({ start: event.target.value })}/>
      </label>
      {(mode === 'stays' || mode === 'exchange') && <label className="home-discovery-field">
        <span>{t.end}</span>
        <input aria-label={t.end} type="date" min={draft.start || localDate()} value={draft.end} onChange={event => update({ end: event.target.value })}/>
      </label>}
      {(mode === 'stays' || mode === 'exchange') && <label className="home-discovery-field home-discovery-guests">
        <span>{t.guests}</span>
        <select value={draft.guests} onChange={event => update({ guests: Number(event.target.value) })}>
          {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>}
      <button className="home-discovery-submit" type="submit" aria-label={t.search} title={t.search}><LineIcon name="search" size={20}/></button>
    </form>
    {error && <p className="form-error" role="alert">{error}</p>}
    <p className="home-discovery-note">{t.demo}</p>
  </section>
}
