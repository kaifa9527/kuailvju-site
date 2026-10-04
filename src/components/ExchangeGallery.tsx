/* Hallmark · pre-emit critique: P5 H4 E4 S5 R5 V4 */
import { useEffect, useRef, useState } from 'react'
import type { Listing } from '../data'
import type { Language } from '../lib/catalog'
import { LineIcon } from './LineIcon'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export function ExchangeGallery({ home, lang }: { home: Listing; lang: Language }) {
  const [active, setActive] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const photos = home.gallery
  const zh = lang === 'zh'

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem('kuailvju-saved-homes') || '[]').includes(home.id)) } catch { setSaved(false) }
    lastTriggerRef.current = null
    setActive(null)
    setNotice('')
  }, [home.id])

  useEffect(() => { if (active === null) lastTriggerRef.current?.focus() }, [active])

  useEffect(() => {
    if (active === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive(index => index === null ? null : (index + 1) % photos.length)
      if (event.key === 'ArrowLeft') setActive(index => index === null ? null : (index - 1 + photos.length) % photos.length)
      if (event.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        if (!buttons?.length) return
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus() }
        else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [active, photos.length])

  const openGallery = (index: number) => { lastTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setActive(index) }

  const toggleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('kuailvju-saved-homes') || '[]') as string[]
      const next = saved ? existing.filter(id => id !== home.id) : [...new Set([...existing, home.id])]
      localStorage.setItem('kuailvju-saved-homes', JSON.stringify(next))
      setSaved(!saved)
      setNotice(saved ? (zh ? '已取消收藏' : 'Removed from saved homes') : (zh ? '已保存到此浏览器' : 'Saved in this browser'))
    } catch { setNotice(zh ? '当前浏览器无法保存' : 'This browser cannot save homes') }
  }
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: home.title[lang], url: location.href })
      else { await navigator.clipboard.writeText(location.href); setNotice(zh ? '房源链接已复制' : 'Listing link copied') }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setNotice(zh ? '无法复制，请使用浏览器地址栏分享' : 'Please share from your browser address bar')
    }
  }

  return <>
    <div className="exchange-gallery-actions">
      <span>{zh ? `${photos.length} 张房源示意照片` : `${photos.length} concept ${photos.length === 1 ? 'photo' : 'photos'}`}</span>
      <div><button type="button" onClick={share}><LineIcon name="share" size={18}/>{zh ? '分享' : 'Share'}</button><button type="button" onClick={toggleSave} aria-pressed={saved}><LineIcon name="heart" size={18}/>{saved ? (zh ? '已收藏' : 'Saved') : (zh ? '收藏' : 'Save')}</button></div>
    </div>
    {notice && <p className="exchange-gallery-notice" role="status">{notice}</p>}
    <div className="exchange-gallery-mosaic" aria-label={zh ? '房源照片预览' : 'Home photo preview'}>
      {Array.from({ length: 5 }, (_, index) => photos[index] ? <button key={photos[index].image} className={`exchange-gallery-tile tile-${index + 1}`} type="button" onClick={() => openGallery(index)} aria-label={`${zh ? '查看照片' : 'View photo'} ${index + 1}: ${photos[index].caption[lang]}`}><img src={asset(photos[index].image)} alt={photos[index].caption[lang]}/>{index === 0 && <span className="exchange-photo-caption">{photos[index].caption[lang]}</span>}</button> : <div className={`exchange-gallery-tile exchange-gallery-pending tile-${index + 1}`} key={`pending-${index}`}><LineIcon name="photos" size={25}/><span>{zh ? '更多角度待补充' : 'More views to come'}</span></div>)}
      <button className="exchange-show-photos" type="button" onClick={() => openGallery(0)}><LineIcon name="photos" size={17}/>{zh ? '查看所有照片' : 'View all photos'}</button>
    </div>
    {active !== null && <div ref={dialogRef} className="exchange-lightbox" role="dialog" aria-modal="true" aria-label={zh ? '房源照片' : 'Home photos'}>
      <div className="exchange-lightbox-head"><div><strong>{home.title[lang]}</strong><span>{active + 1} / {photos.length} · {zh ? '视觉示意' : 'Visual concept'}</span></div><button ref={closeRef} type="button" onClick={() => setActive(null)} aria-label={zh ? '关闭相册' : 'Close gallery'}><LineIcon name="close"/></button></div>
      <div className="exchange-lightbox-stage"><button type="button" disabled={photos.length < 2} onClick={() => setActive((active - 1 + photos.length) % photos.length)} aria-label={zh ? '上一张' : 'Previous photo'}>←</button><figure><img src={asset(photos[active].image)} alt={photos[active].caption[lang]}/><figcaption>{photos[active].caption[lang]}</figcaption></figure><button type="button" disabled={photos.length < 2} onClick={() => setActive((active + 1) % photos.length)} aria-label={zh ? '下一张' : 'Next photo'}>→</button></div>
      <div className="exchange-lightbox-thumbs">{photos.map((photo, index) => <button type="button" key={photo.image} className={index === active ? 'active' : ''} aria-label={`${zh ? '查看照片' : 'View photo'} ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)}><img src={asset(photo.image)} alt=""/></button>)}</div>
    </div>}
  </>
}
