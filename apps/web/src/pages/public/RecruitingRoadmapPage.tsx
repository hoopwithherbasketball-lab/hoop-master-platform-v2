import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collegePaths, gradePlans, monthlyTasks, recruitingGlossary, roadmapSections } from '@hoop-master/features/recruiting'
import CollegeComparison from '../../components/recruiting/CollegeComparison'
import AthleteOutreachDraft from '../../components/recruiting/AthleteOutreachDraft'

const tools = [
  ['Player profile', '/dashboard/profile', 'Maintain your recruiting identity and verified information.'],
  ['Film library', '/dashboard/film-index', 'Organize highlights and complete game footage.'],
  ['Readiness', '/dashboard/readiness', 'Review your existing development assessment.'],
  ['Funding', '/dashboard/funding', 'Continue with the existing funding tools.'],
  ['Open Runs', '/events', 'Find upcoming opportunities and registration details.'],
  ['NIL preparation', '/dashboard/nil/roadmap', 'Keep recruiting and personal brand development connected.'],
] as const
const officialSources = [
  ['NCAA recruiting and calendars', 'https://www.ncaa.org/', 'Find the current women’s basketball recruiting calendar for your division and year.'],
  ['NCAA Eligibility Center', 'https://web3.ncaa.org/ecwr3/', 'Review academic, amateurism and international requirements.'],
  ['NAIA / PlayNAIA', 'https://play.mynaia.org/', 'Use the official NAIA eligibility and registration guidance.'],
  ['NJCAA', 'https://www.njcaa.org/', 'Review current eligibility guidance with your junior college.'],
  ['Federal Student Aid', 'https://studentaid.gov/', 'Review FAFSA, grants, loans and financial aid offers.'],
] as const

export default function RecruitingRoadmapPage() {
  const [grade, setGrade] = useState(gradePlans[0].id)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const plan = gradePlans.find(item => item.id === grade) ?? gradePlans[0]
  const tasks = [...plan.tasks.map((text, index) => ({ id: `${plan.id}-${index}`, text })), ...monthlyTasks.map((text, index) => ({ id: `monthly-${index}`, text }))]
  const completed = tasks.filter(task => checked[task.id]).length
  return <main className="recruiting-workspace bg-navy-900 text-white pt-24 pb-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      <header className="max-w-3xl space-y-5">
        <p className="uppercase tracking-widest text-sm font-semibold text-amber-300">HOOP WITH HER · Recruiting workspace</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Build a college plan that fits your life.</h1>
        <p className="text-lg text-slate-300">Turn recruiting questions into clear next steps. Prepare your profile, communicate with coaches, plan visits and compare options with your family.</p>
        <div className="flex flex-wrap gap-3"><a href="#checklists" className="rounded-lg bg-amber-300 px-5 py-3 font-semibold text-navy-900">Start your checklist</a><a href="#comparison" className="rounded-lg border border-white/30 px-5 py-3">Compare colleges</a><button type="button" onClick={() => window.print()} className="rounded-lg border border-white/30 px-5 py-3 print:hidden">Print / save PDF</button></div>
        <p className="text-sm text-slate-400">Planning guidance, not an eligibility determination. Rules and calendars change: confirm your division, sport and year with official sources and school staff before acting.</p>
      </header>
      <nav aria-label="Recruiting topics" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-white/15 p-5 bg-navy-800">
        {[['checklists', 'Your grade and monthly plan'], ['college-levels', 'College pathways'], ...roadmapSections.map(section => [section.id, section.title]), ['outreach-drafts', 'Email drafts'], ['glossary', 'Recruiting language'], ['comparison', 'College comparison'], ['official-resources', 'Official resources']].map(([id, title]) => <a key={id} href={`#${id}`} className="rounded-md p-2 text-sm text-slate-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300">{title}</a>)}
      </nav>
      <section aria-labelledby="existing-tools"><h2 id="existing-tools" className="text-2xl font-bold mb-5">Your connected tools</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map(([title, href, text]) => <Link key={href} to={href} className="rounded-xl border border-white/15 p-5 hover:border-amber-300"><h3 className="font-semibold text-amber-200">{title} →</h3><p className="text-sm text-slate-300 mt-2">{text}</p></Link>)}</div><p className="text-sm text-slate-400 mt-3">Account tools require sign-in. This guide and its worksheets are available to everyone.</p></section>
      <section id="checklists" className="scroll-mt-20 rounded-2xl border border-white/15 bg-navy-800 p-5 sm:p-7 space-y-5">
        <h2 className="text-2xl font-bold">Your next steps, at your stage</h2>
        <label className="block max-w-lg">Choose your stage<select value={grade} onChange={event => setGrade(event.target.value)} className="block w-full mt-2 rounded-lg border border-white/20 bg-navy-900 p-3">{gradePlans.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <p aria-live="polite" className="text-amber-200">{completed} of {tasks.length} actions complete for this stage and month</p>
        <progress className="w-full accent-amber-300" value={completed} max={tasks.length} aria-label="Checklist completion" />
        <div className="grid gap-6 md:grid-cols-2">{[false, true].map(monthly => <fieldset key={String(monthly)} className="space-y-3"><legend className="font-semibold mb-3">{monthly ? 'Monthly maintenance' : plan.title}</legend>{tasks.filter(task => task.id.startsWith('monthly-') === monthly).map(task => <label key={task.id} className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" checked={!!checked[task.id]} onChange={event => setChecked(previous => ({ ...previous, [task.id]: event.target.checked }))} className="mt-1 h-4 w-4 shrink-0 accent-amber-300" /><span>{task.text}</span></label>)}</fieldset>)}</div>
        <p className="text-sm text-slate-400">Completion reflects your own checklist, not a recruiting ranking or eligibility score. Checks remain while this page is open; print before leaving to keep a copy.</p>
      </section>
      <section id="college-levels" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">Find your college pathway</h2><p className="text-slate-300">Compare daily demands, academic options, affordability and roster fit across levels. A division label alone cannot tell you where you belong.</p><div className="overflow-x-auto rounded-xl border border-white/15"><table className="w-full text-left text-sm"><caption className="sr-only">College basketball pathways and financial aid considerations</caption><thead className="bg-navy-800"><tr>{['Pathway', 'Experience', 'Aid considerations'].map(title => <th key={title} scope="col" className="p-4">{title}</th>)}</tr></thead><tbody>{collegePaths.map(([name, experience, aid]) => <tr key={name} className="border-t border-white/10"><th scope="row" className="p-4 text-amber-200">{name}</th><td className="p-4">{experience}</td><td className="p-4">{aid}</td></tr>)}</tbody></table></div></section>
      {roadmapSections.map(section => <section id={section.id} key={section.id} className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">{section.title}</h2><div className="grid gap-3 md:grid-cols-2">{section.items.map(item => <details key={item.title} className="rounded-xl border border-white/15 bg-navy-800 p-5 print:break-inside-avoid" open><summary className="cursor-pointer font-semibold text-amber-100 focus-visible:ring-2 focus-visible:ring-amber-300">{item.title}</summary><p className="mt-3 text-slate-300 text-sm leading-relaxed">{item.text}</p></details>)}</div></section>)}
      <AthleteOutreachDraft />
      <section id="glossary" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">Understand recruiting language</h2><dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{recruitingGlossary.map(([term, definition]) => <div key={term} className="rounded-xl border border-white/15 p-5"><dt className="font-semibold text-amber-100">{term}</dt><dd className="mt-2 text-sm text-slate-300">{definition}</dd></div>)}</dl></section>
      <CollegeComparison />
      <section id="official-resources" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">Verify with official sources</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{officialSources.map(([title, href, text]) => <a key={title} href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 p-5 hover:border-amber-300"><h3 className="font-semibold text-amber-200">{title} ↗<span className="sr-only"> (opens a new tab)</span></h3><p className="text-sm text-slate-300 mt-2">{text}</p></a>)}</div></section>
      <section className="rounded-2xl bg-navy-800 border border-white/15 p-7"><h2 className="text-2xl font-bold">Put your plan into practice</h2><p className="text-slate-300 mt-3 mb-5">Create your account to use the existing player tools, or talk with HOOP WITH HER about your next step.</p><div className="flex flex-wrap gap-4"><Link to="/signup" className="rounded-lg bg-amber-300 px-5 py-3 text-navy-900 font-semibold">Create an account</Link><Link to="/contact" className="rounded-lg border border-white/30 px-5 py-3">Contact our team</Link></div></section>
    </div>
  </main>
}
