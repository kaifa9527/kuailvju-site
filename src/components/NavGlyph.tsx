import type { ReactNode } from 'react'

export type NavGlyphName = 'rentals' | 'stays' | 'exchange' | 'roam' | 'management'

// A restrained, consistent 24px icon family for the five primary destinations.
// Fixed stroke weight and rounded geometry ensure equal visual weight at all sizes.
const illustrations: Record<NavGlyphName, ReactNode> = {
  rentals: <>
    <path d="m3.5 9 8.5-6 8.5 6" />
    <path d="M5.5 8.25V20h13V8.25" />
    <path d="M9.5 20v-6.5h5V20" />
    <path d="M8 10.25h2M14 10.25h2" />
  </>,
  stays: <>
    <path d="M3.5 19V9.5M20.5 19V12" />
    <path d="M3.5 15.5h17M6 15.5v-4.25c0-1 .75-1.75 1.75-1.75h9.5c1.8 0 3.25 1.5 3.25 3.25v2.75" />
    <path d="M6 12h6M4.75 19h14.5" />
    <path d="M18.3 4.25v3.25M16.7 5.9h3.2" />
  </>,
  exchange: <>
    <path d="m5.5 9.25 6.5-5.5 6.5 5.5" />
    <path d="M7.5 9v2M16.5 9v2" />
    <path d="M4 14h15.5l-3-2.75M19.5 14l-3 2.75" />
    <path d="M20 19.5H4.5l3-2.75M4.5 19.5l3 2.75" />
  </>,
  roam: <>
    <circle cx="12" cy="12" r="8.75" />
    <path d="m15.75 8.25-2.25 5.25-5.25 2.25 2.25-5.25 5.25-2.25Z" />
    <circle cx="12" cy="12" r=".7" fill="currentColor" stroke="none" />
    <path d="M12 1.75v1.5M12 20.75v1.5M1.75 12h1.5M20.75 12h1.5" />
  </>,
  management: <>
    <path d="M12 2.25 20 5.5v5.65c0 5.05-3.15 8.7-8 10.6-4.85-1.9-8-5.55-8-10.6V5.5L12 2.25Z" />
    <path d="m8.1 11.15 3.9-3.1 3.9 3.1" />
    <path d="M9.25 10.7v5.1h5.5v-5.1M11.15 15.8v-2.7h1.7v2.7" />
  </>,
}

export function NavGlyph({ name, size = 22 }: { name: NavGlyphName; size?: number }) {
  return <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false"
  >{illustrations[name]}</svg>
}
