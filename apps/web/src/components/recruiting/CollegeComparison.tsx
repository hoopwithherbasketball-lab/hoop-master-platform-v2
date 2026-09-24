import { useState } from 'react'
import { calculateDecisionScore, calculateNetCost, costFields, decisionCriteria } from '@hoop-master/features/recruiting'

const inputClass = 'mt-1 w-full rounded-lg border border-white/20 bg-navy-900 p-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-300'
interface SchoolWorksheet { name: string; year: string; costs: Record<string, string>; scores: Record<string, string>; notes: string }
const emptySchool = (): SchoolWorksheet => ({ name: '', year: '', costs: {}, scores: {}, notes: '' })

export default function CollegeComparison() {
  const [schools, setSchools] = useState<SchoolWorksheet[]>([emptySchool(), emptySchool(), emptySchool()])
  function update(index: number, changes: Partial<SchoolWorksheet>) {
    setSchools(previous => previous.map((school, i) => i === index ? { ...school, ...changes } : school))
  }
  return <section id="comparison" className="scroll-mt-20 space-y-5">
    <h2 className="text-2xl font-bold text-white">Compare your college options</h2>
    <p className="text-slate-300">Evaluate academics, basketball, finances and daily life together. Enter costs for the same academic year in US dollars, using each school’s written offer. Blank means unknown; enter 0 only when confirmed. Loans and work-study are not grants and are not deducted.</p>
    <p className="text-sm text-amber-200">Worksheets stay on this page while it is open. Use Print / save PDF to keep your work before leaving. These estimates do not determine eligibility or guarantee an award.</p>
    <div className="grid gap-5 xl:grid-cols-3">
      {schools.map((school, index) => {
        const net = calculateNetCost(school.costs)
        const score = calculateDecisionScore(school.scores)
        return <fieldset key={index} className="min-w-0 rounded-2xl border border-white/15 bg-navy-800 p-5 space-y-4">
          <legend className="px-2 font-semibold text-amber-200">College {index + 1}</legend>
          <label className="block text-sm">College name<input className={inputClass} value={school.name} onChange={event => update(index, { name: event.target.value })} /></label>
          <label className="block text-sm">Academic year<input className={inputClass} placeholder="e.g. 2027–28" value={school.year} onChange={event => update(index, { year: event.target.value })} /></label>
          {costFields.map(field => <label key={field.id} className="block text-sm">{field.label} (USD)<input type="number" min="0" step="0.01" inputMode="decimal" className={inputClass} value={school.costs[field.id] ?? ''} onChange={event => update(index, { costs: { ...school.costs, [field.id]: event.target.value } })} /></label>)}
          <p className="rounded-lg bg-navy-900 p-3" aria-live="polite">Estimated annual net cost: <strong>{net === null ? 'Complete all cost fields' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(net)}</strong></p>
          <p className="text-xs text-slate-300">Aid is counted once. A result of $0 does not imply that excess aid is refundable. Ask about uncovered costs and renewal conditions.</p>
          <h3 className="font-semibold pt-3">Decision scorecard</h3>
          <p className="text-sm text-slate-300">Rate each area 1–10, where 10 is the best fit for you. For cost, a higher score means greater affordability.</p>
          {decisionCriteria.map(criterion => <label key={criterion.id} className="block text-sm">{criterion.label} · {criterion.weight}%<input type="number" min="1" max="10" step="1" className={inputClass} value={school.scores[criterion.id] ?? ''} onChange={event => update(index, { scores: { ...school.scores, [criterion.id]: event.target.value } })} /></label>)}
          <p aria-live="polite">Weighted fit: <strong>{score === null ? 'Rate all areas from 1–10' : `${score.toFixed(1)} / 10`}</strong></p>
          <label className="block text-sm print:hidden">Visit notes, award conditions and unanswered questions<textarea rows={5} className={inputClass} value={school.notes} onChange={event => update(index, { notes: event.target.value })} /></label>
          <div className="hidden print:block whitespace-pre-wrap break-words text-sm"><h3 className="font-semibold">Visit notes, award conditions and unanswered questions</h3>{school.notes || 'No notes entered.'}</div>
        </fieldset>
      })}
    </div>
    <p className="rounded-xl border border-amber-300/30 p-4 text-amber-100">Would this school still be a good choice if basketball, your role or the coaching staff changed? Use the score to organize a conversation, not to make the decision for you.</p>
  </section>
}
