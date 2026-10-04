import type { ReactNode, SVGProps } from 'react'

export type IconName = 'guests' | 'bedroom' | 'bed' | 'bath' | 'area' | 'window' | 'garden' | 'pool' | 'climate' | 'wifi' | 'living' | 'dining' | 'balcony' | 'arrow' | 'calendar' | 'shield' | 'check' | 'utility'

const paths: Record<IconName, ReactNode> = {
  guests: <><circle cx="9" cy="8" r="3"/><path d="M3.5 19v-1a5.5 5.5 0 0 1 11 0v1M17 5.5a3 3 0 0 1 0 5.8M17 14a4.5 4.5 0 0 1 3.5 4.4V19"/></>,
  bedroom: <><path d="M4 21V4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5V21M3 21h18"/><circle cx="16" cy="12" r=".8"/></>,
  bed: <><path d="M3 18v-7M21 18v-7M3 15h18M5 15v-4.5A2.5 2.5 0 0 1 7.5 8h9a2.5 2.5 0 0 1 2.5 2.5V15M5 11h14"/></>,
  bath: <><path d="M3 12h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2ZM6 12V6a3 3 0 0 1 3-3h1M7 20l-1 2M17 20l1 2"/></>,
  area: <><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M4 4l6 6M20 4l-6 6M20 20l-6-6M4 20l6-6"/></>,
  window: <><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/></>,
  garden: <><path d="M12 21v-9M12 16C5 16 4 11 5 5c6 0 9 3 7 11ZM12 14c0-6 2-9 7-10 2 6 0 10-7 10Z"/></>,
  pool: <><path d="M3 10c1.5 0 1.5 1.5 3 1.5S7.5 10 9 10s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5M3 16c1.5 0 1.5 1.5 3 1.5S7.5 16 9 16s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5"/></>,
  climate: <><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="9"/><path d="M12 3v7M21 12h-7M12 21v-7M3 12h7"/></>,
  wifi: <><path d="M2.5 8.5a15 15 0 0 1 19 0M5.5 12a10 10 0 0 1 13 0M8.8 15.5a5 5 0 0 1 6.4 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></>,
  living: <><path d="M5 13V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M4 12a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2 2 2 0 0 0-2 2H6a2 2 0 0 0-2-2ZM5 18v2M19 18v2"/></>,
  dining: <><path d="M4 4v6a3 3 0 0 0 6 0V4M7 4v17M16 21V4a4 4 0 0 1 4 4v6h-4"/></>,
  balcony: <><path d="M3 20h18M5 17V9h14v8M9 9V4h6v5M5 13h14M9 13v4M15 13v4"/></>,
  arrow: <><path d="M5 19 19 5M9 5h10v10"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 3v4M17 3v4M3 10h18M8 15h3"/></>,
  shield: <><path d="m12 2 8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>,
  check: <path d="m4 12 5 5L20 6"/>,
  utility: <><path d="M12 2c-3.8 4.7-7 8.2-7 12a7 7 0 0 0 14 0c0-3.8-3.2-7.3-7-12Z"/><path d="m13 8-3 5h3l-2 4"/></>,
}

export function LineIcon({ name, size = 22, ...rest }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>{paths[name]}</svg>
}

export function amenityIcon(label: string): IconName {
  if (/泳池|pool/i.test(label)) return 'pool'
  if (/庭院|庭景|园林|garden|courtyard/i.test(label)) return 'garden'
  if (/阳台|露台|balcony|terrace/i.test(label)) return 'balcony'
  if (/海景|窗景|window|view/i.test(label)) return 'window'
  if (/卧室|bedroom/i.test(label)) return 'bedroom'
  if (/空调|air conditioning/i.test(label)) return 'climate'
  if (/网络|wi-fi/i.test(label)) return 'wifi'
  if (/餐厅|dining/i.test(label)) return 'dining'
  return 'living'
}
