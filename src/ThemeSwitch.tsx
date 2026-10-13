import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
const key = 'kuailvju-theme'
const valid = (value: string | null): Theme => value === 'light' || value === 'dark' ? value : 'system'
const read = (): Theme => { try { return valid(localStorage.getItem(key)) } catch { return 'system' } }
const apply = (theme: Theme) => {
  document.documentElement.dataset.theme = theme === 'system'
    ? matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme
}

// Apply the remembered preference before mounting, avoiding a light-theme flash.
export const initializeTheme = () => apply(read())

export function ThemeSwitch({ lang }: { lang: 'zh' | 'en' }) {
  const [theme, setTheme] = useState<Theme>(read)
  useEffect(() => {
    apply(theme)
    const media = matchMedia('(prefers-color-scheme: dark)')
    const update = () => { if (theme === 'system') apply('system') }
    media.addEventListener('change', update)
    const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) setTheme(read()) }
    window.addEventListener('storage', sync)
    return () => { media.removeEventListener('change', update); window.removeEventListener('storage', sync) }
  }, [theme])
  return <select className="theme-switch" aria-label={lang === 'zh' ? '外观主题' : 'Appearance'} value={theme} onChange={event => {
    const next = valid(event.target.value)
    apply(next)
    setTheme(next)
    try { localStorage.setItem(key, next) } catch { /* Preference still works for this session. */ }
  }}>
    <option value="system">{lang === 'zh' ? '系统' : 'Auto'}</option>
    <option value="light">{lang === 'zh' ? '浅色' : 'Light'}</option>
    <option value="dark">{lang === 'zh' ? '深色' : 'Dark'}</option>
  </select>
}
