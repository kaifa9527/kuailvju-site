import { useEffect, useRef } from 'react'
import type { Language } from './lib/catalog'

export type NoticeKind = 'terms' | 'privacy'

const zhTerms: [string, string][] = [
  ['一、平台定位与服务', '快旅居提供房源信息展示、需求匹配、客户引荐、实地看房协调、合作条件沟通与签约组织等服务。合作方应在线下核实身份、房屋情况及交易条件；平台可组织供需双方签署租赁、居住权益或其他合作协议，亦可在房源权利人有效授权范围内代表其签署相关协议。具体权利义务以有效签约文件为准。'],
  ['二、用户身份及账户', '注册人承诺具备相应民事行为能力，身份及联系方式真实有效。会员可浏览、收藏及咨询房源；创建房源草稿后可获得业主录入权限。未经授权，不得转让、出借账户或冒用他人身份。管理员资格只由平台另行审核并授权。'],
  ['三、房源真实性与合法性', '房源提交人须依法拥有产权、出租经营权或有效委托授权，保证地址、面积、价格、照片、设施、权利状态与交易条件真实、准确、完整；不得发布虚假房源、盗图、隐瞒重大瑕疵或违法经营。提交人应按要求提供权属及授权材料，并对虚假陈述和侵权行为依法承担责任。'],
  ['四、审核、发布及版本管理', '房源提交后须经平台审核，未经审核不得公开发布。平台可要求补正、退回、拒绝上架或依规则下架房源。已发布版本不得由业主直接更改；如需修改，应创建关联该房源的替换版本，经审核通过后方可更新。资料审核不代表平台对权属、房态或交易履行作无条件保证。'],
  ['五、核验与线下签约', '用户应在正式签约前核查房屋实际状况、权利凭证、费用、交付条件及相对方签约资格。平台可协助组织带看、核验、协调、签约和服务进度记录；房屋交付、租金、押金、维修及履约义务由相关主体依有效合同和适用法律承担。'],
  ['六、平台资源与服务成果', '平台依法享有并保护其投入推广、引荐、匹配及协调服务所形成的经营成果。不得未经授权批量采集、复制、出售平台内容、房源资料或客户线索；不得通过虚构主体、隐瞒成交、私下变更签约方式等恶意规避已明确约定的服务费。'],
  ['七、成交保护与违约责任', '平台已实际提供客户引荐、匹配、带看或促成服务的，相关方应履行其已确认的独立业务协议。对有有效防绕单约定且确有恶意规避行为的，可依协议以原应付服务费的两倍作为违约责任计算基准（含原应付服务费）；是否成立及具体金额以证据、合同和适用法律为准。平台可依法保存服务记录并追索应付款项和相应损失。'],
  ['八、平台责任边界', '平台根据实际承诺承担信息管理、服务协调及法律规定的责任。除明确约定或依法应承担的义务外，不保证任何房源一定可订、特定交易必然达成或交易对方必然履约。平台不得以本须知排除依法不可免除的责任；由用户虚假陈述、违约或违法行为造成的损害，由相关责任主体依法承担。'],
  ['九、个人信息与信息安全', '平台仅按服务必要范围处理账户、联系方式、房源、审核及业务记录，敏感权属资料仅供授权审核使用，具体目的、保存时间、用户权利和跨境处理规则见《隐私政策》。用户不得非法取得或使用其他会员资料。'],
  ['十、规则效力与争议解决', '本须知适用于平台基础服务；委托经营、收费、合作保护、签约和违约金等事项以各方另外确认的有效业务协议为准。争议优先友好协商，协商不成依法及依有效约定处理。平台运营主体、适用法律和争议管辖等正式上线前另行公示；重要规则变更将依法提示并取得必要确认。'],
]
const enTerms: [string, string][] = [
  ['1. Platform services', 'Kuai Lü Ju helps list homes, match demand, arrange viewings and coordinate offline agreements. Parties verify identities, property rights and terms before signing. The platform may execute an agreement for an owner only within express authorization.'],
  ['2. Accounts', 'Members must submit truthful identity and contact information. A member may create draft listings; owner tools do not imply platform approval. Staff privileges are separately granted.'],
  ['3. Truthful listings', 'Submitters warrant lawful ownership or valid authorization and accurate photos, location, facilities, prices, availability and terms. Fraudulent or unlawful listings are prohibited.'],
  ['4. Reviews and versions', 'Submission does not publish a listing. Approved listings are locked. Revisions are submitted as linked replacement versions for independent review. Screening is not an unconditional guarantee.'],
  ['5. In-person verification', 'Parties verify home condition, identity, fees and contract terms offline. The platform may organize viewing, verification and signing. Actual performance obligations follow signed agreements and applicable law.'],
  ['6. Platform introductions', 'The platform protects its legitimate introductions, leads and service results. Users must not misappropriate platform materials or conceal deals to evade expressly agreed fees.'],
  ['7. Circumvention and remedies', 'Where a separate enforceable agreement clearly provides anti-circumvention obligations, proven bad-faith circumvention may trigger remedies calculated on twice the agreed platform service fee, inclusive of that original fee, subject to evidence and applicable law.'],
  ['8. Liability boundaries', 'The platform is responsible for its actual commitments and legal duties but does not guarantee availability or performance by unrelated parties. Nothing here excludes non-excludable legal liability.'],
  ['9. Personal data', 'Account, listing and service records are handled only as necessary for service. Restricted ownership records must not be publicly shared. Details appear in the Privacy Notice.'],
  ['10. Changes and disputes', 'Separate signed service agreements govern particular fees and transactions. Disputes follow applicable law and effective written agreements. Operator details and jurisdiction will be disclosed before live launch.'],
]
const zhPrivacy: [string, string][] = [
  ['一、处理目的与范围', '为实现会员身份验证、收藏、房源录入、资质审核、业务咨询、安全风控及必要的通知，平台在正式上线后依功能需要收集邮箱或手机号、账户资料、房源图片及相应操作记录。不会因为访问网站就要求提交产权证明。'],
  ['二、敏感资料与权限', '权属证明、联系方式、精确门牌、授权材料仅允许经授权人员处理，不在公开房源页展示。审核、替换、下架等重要操作需记录并限制权限。'],
  ['三、委托服务方与跨境处理', '为提供认证、数据库、短信、存储等能力，平台可能在明确公示后使用服务供应商；跨境传输须按适用法律履行告知及必要程序。正式服务商、存储位置、保存期限在生产上线前补齐。'],
  ['四、用户权利与信息保护', '用户可通过正式发布的联系方式请求查阅、更正或删除信息、撤回可撤回的同意。平台应采取访问控制、加密和安全记录等合理措施；依法需要保留的交易或审核记录，按适用法律处理。'],
  ['五、当前演示说明', '目前 GitHub Pages 仅提供交互预览，未接入真实会员认证。请勿填写真实电话、邮箱、密码或上传个人证件；测试页面不发送验证码、不创建真实账户、不接收正式申请。'],
]
const enPrivacy: [string, string][] = [
  ['Purpose', 'When live, account verification, favorites, listing review, consultation and security may require contact information, authorized property data and audit records.'],
  ['Sensitive documents', 'Ownership evidence, contact information, precise addresses and authorization records are restricted to approved staff and are not publicly listed.'],
  ['Processors and transfers', 'Authentication, storage and messaging vendors and any cross-border transfers will be disclosed with legally required safeguards before production.'],
  ['Rights and safeguards', 'Members may request access, correction or deletion through published contact channels, subject to legal retention obligations. Access restrictions, secure storage and audit records are required.'],
  ['Preview mode', 'The GitHub Pages preview has no real identity provider. Do not enter real phone numbers, emails, passwords or identity documents; no actual account is created.'],
]

export function LegalNoticeDialog({ lang, kind, onClose }: { lang: Language; kind: NoticeKind; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])
  const sections = kind === 'terms' ? (lang === 'zh' ? zhTerms : enTerms) : (lang === 'zh' ? zhPrivacy : enPrivacy)
  const title = kind === 'terms' ? (lang === 'zh' ? '用户注册及平台服务须知' : 'Registration & Service Terms') : (lang === 'zh' ? '隐私政策（预览）' : 'Privacy Notice (Preview)')
  return <div className="legal-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="legal-dialog" role="dialog" aria-modal="true" aria-labelledby="legal-dialog-title">
      <header className="legal-dialog-header">
        <h2 id="legal-dialog-title">{title}</h2>
        <button ref={closeRef} type="button" className="legal-close" onClick={onClose} aria-label={lang === 'zh' ? '关闭并返回' : 'Close and return'}>×</button>
      </header>
      <div className="legal-scroll" tabIndex={0}>
        <p className="legal-intro">{lang === 'zh' ? '以下为开发预览版条款。正式启用前将补齐平台运营主体、适用法律与隐私处理信息。' : 'Draft for preview. The operating entity, applicable law and final privacy disclosures must be confirmed before launch.'}</p>
        {sections.map(([heading, paragraph]) => <section key={heading}><h3>{heading}</h3><p>{paragraph}</p></section>)}
      </div>
      <footer className="legal-dialog-footer"><button type="button" className="button button-dark" onClick={onClose}>{lang === 'zh' ? '返回注册' : 'Back to registration'}</button></footer>
    </section>
  </div>
}
