import { useState } from 'react'
import { getMissingTemplateTokens, recruitingEmailTemplates, recruitingPersonalizationFields, renderRecruitingTemplate } from '@hoop-master/features/recruiting'

const templates = recruitingEmailTemplates.filter(template => template.audience === 'college_coach')
const control = 'w-full rounded-lg border border-white/20 bg-navy-900 p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-300'

export default function AthleteOutreachDraft() {
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [variantId, setVariantId] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState('')
  const template = templates.find(item => item.id === templateId) ?? templates[0]
  const variant = template.variants.find(item => item.id === variantId) ?? template.variants[0]
  const source = `${variant.subject}\n${variant.body}`
  const required = new Set(getMissingTemplateTokens(source, {}))
  const missing = getMissingTemplateTokens(source, values)
  const draft = `Subject: ${renderRecruitingTemplate(variant.subject, values)}\n\n${renderRecruitingTemplate(variant.body, values)}`
  async function copy() {
    if (missing.length) return
    try { await navigator.clipboard.writeText(draft); setStatus('Copied. Review names, facts and links before sending from your email account.') }
    catch { setStatus('Clipboard unavailable. Select and copy the draft below.') }
  }
  return <section id="outreach-drafts" className="scroll-mt-20 rounded-2xl border border-white/15 bg-navy-800 p-5 sm:p-7 space-y-5">
    <h2 className="text-2xl font-bold">Write your next coach email</h2>
    <p className="text-slate-300">Choose a situation, add verified details and review your draft. This tool shares the staff template library; it does not send emails or store personal information. Save a copy before leaving.</p>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <label className="block">Situation<select className={control} value={template.id} onChange={event => { setTemplateId(event.target.value); setVariantId(''); setStatus('') }}>{templates.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="block">Variation<select className={control} value={variant.id} onChange={event => { setVariantId(event.target.value); setStatus('') }}>{template.variants.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <p className="text-sm text-slate-300">{variant.whenToUse}</p>
        <div className="grid gap-3 sm:grid-cols-2">{recruitingPersonalizationFields.filter(field => required.has(field.token)).map(field => <label key={field.token} className="block text-sm">{field.label}<input className={control} value={values[field.token] ?? ''} onChange={event => { setValues(previous => ({ ...previous, [field.token]: event.target.value })); setStatus('') }} /></label>)}</div>
      </div>
      <div className="space-y-4 min-w-0">
        <label className="block font-semibold print:hidden">Draft for review<textarea readOnly value={draft} rows={23} className={`${control} mt-2 text-sm leading-relaxed`} /></label>
        <div className="hidden print:block whitespace-pre-wrap break-words text-sm">{draft}</div>
        <p className="text-sm text-amber-200">{missing.length ? `${missing.length} fields still need verified details.` : 'All fields filled. Confirm facts and the program’s communication rules before sending.'}</p>
        <button type="button" disabled={missing.length > 0} onClick={copy} className="rounded-lg bg-amber-300 px-4 py-2 font-semibold text-navy-900 disabled:opacity-40">Copy reviewed draft</button>
        <p role="status" className="text-sm text-slate-300">{status}</p>
      </div>
    </div>
  </section>
}
