/* Hallmark · pre-emit critique: P5 H4 E4 S5 R5 V4 */
import { useState } from 'react'
import type { Language } from './lib/catalog'
import { LineIcon } from './components/LineIcon'

type Service = 'leasing' | 'operation' | 'care'
const services: Service[] = ['leasing', 'operation', 'care']
const words = {
  zh: {
    eyebrow: 'OWNER / PROPERTY CARE', title: '登录或登记托管房源', lead: '先选一种服务，再填写房屋概况。只需几步，找到适合房子的托付方式。',
    leasing: '委托租赁', leasingSub: '长租房 · 半年或一年', operation: '委托经营', operationSub: '民宿房 · 平台经营', care: '委托看护', careSub: '不对外出租 · 管家照看',
    select: '选择委托方式', continue: '继续登记房源', existing: '已有托管记录？', desk: '查看站内测试记录',
    note: '当前为站内流程测试：无需输入真实手机号、邮箱或密码。正式账号登录需接入安全后台后开放。',
  },
  en: {
    eyebrow: 'OWNER / PROPERTY CARE', title: 'Sign in or register a home', lead: 'Choose a service, then describe the home. A few clear steps lead to the right way to care for it.',
    leasing: 'Leasing', leasingSub: 'Long stays · 6 or 12 months', operation: 'Managed operation', operationSub: 'Short stays · platform operated', care: 'Home care', careSub: 'No letting · regular property care',
    select: 'Choose a service', continue: 'Continue to property form', existing: 'Already registered a home?', desk: 'View browser-only test records',
    note: 'This is a browser-only workflow test. No real phone, email or password is collected. Live account sign-in requires the secure production backend.',
  },
}

export function ManagementEntry({ lang, suggested }: { lang: Language; suggested?: string }) {
  const t = words[lang]
  const [selected, setSelected] = useState<Service>(services.includes(suggested as Service) ? suggested as Service : 'leasing')
  return <div className="management-entry-page">
    <div className="management-entry-backdrop" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/sanya-concept.jpg`} alt=""/><img src={`${import.meta.env.BASE_URL}images/pattaya-concept.jpg`} alt=""/><img src={`${import.meta.env.BASE_URL}images/beihai-concept.jpg`} alt=""/></div>
    <div className="management-entry-card"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="management-entry-lead">{t.lead}</p>
      <fieldset><legend>{t.select}</legend>{services.map(service => <label key={service} className={selected === service ? 'selected' : ''}><input type="radio" name="management-service" value={service} checked={selected === service} onChange={() => setSelected(service)}/><span><strong>{t[service]}</strong><small>{t[`${service}Sub`]}</small></span><LineIcon name={service === 'care' ? 'shield' : service === 'operation' ? 'living' : 'calendar'} size={22}/></label>)}</fieldset>
      <a className="button button-dark" href={`#/management/${selected}`}>{t.continue}<LineIcon name="arrow" size={17}/></a><p className="management-entry-existing">{t.existing} <a href="#/test-inbox">{t.desk} ↗</a></p><p className="management-entry-note">{t.note}</p>
    </div>
  </div>
}
