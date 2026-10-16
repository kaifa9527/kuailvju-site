import { useEffect, useRef, useState } from 'react'
import type { Language } from './lib/catalog'
import { LegalNoticeDialog, type NoticeKind } from './LegalNotices'

type AccountMode = 'login' | 'register'
type ContactMode = 'email' | 'phone'

export function AccountDialog({ lang, onClose, onPreviewEnter, onPreviewExit, previewMember }: {
  lang: Language
  onClose: () => void
  onPreviewEnter: () => void
  onPreviewExit: () => void
  previewMember: boolean
}) {
  const [mode, setMode] = useState<AccountMode>('register')
  const [contactMode, setContactMode] = useState<ContactMode>('email')
  const [contact, setContact] = useState('')
  const [consent, setConsent] = useState(false)
  const [notice, setNotice] = useState<NoticeKind | null>(null)
  const [status, setStatus] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const zh = lang === 'zh'

  useEffect(() => {
    if (!previewMember) inputRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !notice) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, notice, previewMember])

  const enterDemo = () => {
    if (mode === 'register' && !consent) {
      setStatus(zh ? '请先勾选并阅读《注册须知》及《隐私政策》。' : 'Please accept the Registration Terms and Privacy Notice first.')
      return
    }
    onPreviewEnter()
  }
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(zh
      ? '当前是静态预览站，尚未连接真实认证服务。没有发送验证码，也没有创建账户。可使用下方“进入演示会员”查看页面流程。'
      : 'This static preview has no live authentication. No code was sent and no account was created. Use “Enter preview member” below to inspect the interface.')
  }

  return <div className="account-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
      <button type="button" className="account-close" onClick={onClose} aria-label={zh ? '关闭' : 'Close'}>×</button>
      {previewMember ? <>
        <span className="account-eyebrow">KUAI LÜ JU / PREVIEW</span>
        <div className="account-avatar-large" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.5-3.5 2.8-5.5 6.5-5.5s6 2 6.5 5.5"/></svg></div>
        <h2 id="account-dialog-title">{zh ? '演示会员' : 'Preview member'}</h2>
        <p className="account-description">{zh ? '你正在体验本机演示身份，不代表已创建真实账户。会员认证与数据保存尚未启用。' : 'You are using a local preview identity, not a real account. Live authentication and data storage are not enabled.'}</p>
        <a className="button button-dark account-primary-link" href="#/management" onClick={onClose}>{zh ? '进入房源委托' : 'Manage a property'}</a>
        <button className="account-text-action" type="button" onClick={onPreviewExit}>{zh ? '退出演示会员' : 'Exit preview member'}</button>
      </> : <>
        <span className="account-eyebrow">KUAI LÜ JU / MEMBER</span>
        <h2 id="account-dialog-title">{zh ? '欢迎来到快旅居' : 'Welcome to Kuai Lü Ju'}</h2>
        <p className="account-description">{zh ? '登录后收藏心仪房源，或提交房源进入平台审核。' : 'Sign in to save homes or submit a listing for review.'}</p>
        <div className="account-mode-switch" role="tablist" aria-label={zh ? '账户操作' : 'Account action'}>
          <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setStatus('') }}>{zh ? '登录' : 'Log in'}</button>
          <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setStatus('') }}>{zh ? '注册' : 'Sign up'}</button>
        </div>
        <form onSubmit={submit}>
          <div className="account-contact-tabs" role="group" aria-label={zh ? '联系方式类型' : 'Contact type'}>
            <button type="button" className={contactMode === 'email' ? 'is-active' : ''} onClick={() => { setContactMode('email'); setContact(''); setStatus('') }}>{zh ? '邮箱' : 'Email'}</button>
            <button type="button" className={contactMode === 'phone' ? 'is-active' : ''} onClick={() => { setContactMode('phone'); setContact(''); setStatus('') }}>{zh ? '手机号' : 'Phone'}</button>
          </div>
          <label className="account-field-label" htmlFor="account-contact">{contactMode === 'email' ? (zh ? '邮箱地址' : 'Email address') : (zh ? '手机号码' : 'Phone number')}</label>
          <input ref={inputRef} id="account-contact" name="contact" type={contactMode === 'email' ? 'email' : 'tel'} autoComplete={contactMode === 'email' ? 'email' : 'tel'} placeholder={contactMode === 'email' ? 'name@example.com' : (zh ? '国家/地区代码 + 手机号码' : 'Country code + phone number')} value={contact} onChange={event => { setContact(event.target.value); setStatus('') }} required/>
          <p className="account-field-hint">{zh ? '演示页面：请勿填写真实联系方式，不会发送验证码。' : 'Preview only: do not enter real contact details. No code will be sent.'}</p>
          {mode === 'register' && <label className="account-consent">
            <input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); setStatus('') }}/>
            <span>{zh ? '我已阅读并同意' : 'I have read and agree to'} <button type="button" className="account-legal-link" onClick={() => setNotice('terms')}>{zh ? '《注册须知》' : 'Registration Terms'}</button> {zh ? '及' : 'and'} <button type="button" className="account-legal-link" onClick={() => setNotice('privacy')}>{zh ? '《隐私政策》' : 'Privacy Notice'}</button></span>
          </label>}
          {status && <p className="account-status" role="status">{status}</p>}
          <button type="submit" className="button button-dark account-primary-button">{mode === 'login' ? (zh ? '继续登录' : 'Continue to log in') : (zh ? '继续注册' : 'Continue to sign up')}</button>
        </form>
        <div className="account-preview-separator"><span>{zh ? '或' : 'OR'}</span></div>
        <button type="button" className="account-preview-button" onClick={enterDemo}>{zh ? '进入演示会员' : 'Enter preview member'} <span>↗</span></button>
        <p className="account-preview-note">{zh ? '仅用于查看页面流程；不创建真实账户，不保存填写的联系方式。' : 'Interface preview only. No real account is created and contact input is not saved.'}</p>
      </>}
    </section>
    {notice && <LegalNoticeDialog lang={lang} kind={notice} onClose={() => setNotice(null)}/>}
  </div>
}
