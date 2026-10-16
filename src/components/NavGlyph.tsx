import type { ReactNode } from 'react'

export type NavGlyphName = 'rentals' | 'stays' | 'exchange' | 'roam' | 'management'

// A restrained, consistent 24px icon family for the five primary destinations.
// Fixed stroke weight and rounded geometry ensure equal visual weight at all sizes.
const illustrations: Record<NavGlyphName, ReactNode> = {
  rentals: <><path d="m3.5 10 8.5-6.5 8.5 6.5"/><path d="M6 9v11h12V9"/><path d="M10 20v-7h4v7"/></>,
  stays: <><path d="M3.5 19V9.5M20.5 19V12M3.5 16h17"/><path d="M6 16v-4.5h9.5a5 5 0 0 1 5 4.5M6 12h6"/></>,
  exchange: <><path d="m7 6.5 5-4 5 4M12 2.5v10"/><path d="M4 13.5h16m-3-3 3 3-3 3"/><path d="M20 19H4m3-3-3 3 3 3"/></>,
  roam: <><circle cx="12" cy="12" r="9"/><path d="m15.75 8.25-2.3 5.2-5.2 2.3 2.3-5.2 5.2-2.3Z"/></>,
  management: <><path d="M12 2.5 20 6v5.4c0 5-3 8.2-8 10.1-5-1.9-8-5.1-8-10.1V6l8-3.5Z"/><path d="m8.5 12 3.5-3 3.5 3M9.7 11v5h4.6v-5"/></>,
}

export function NavGlyph({ name, size = 22 }: { name: NavGlyphName; size?: number }) {
  return <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false"
  >{illustrations[name]}</svg>
}
