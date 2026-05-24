import PageShell from '../../components/ui/PageShell'

const faqs = [
  { q: 'What is Elite GBB?', a: 'Elite GBB is a recruiting-readiness platform for elite girls basketball players. We help athletes build their profile, connect with college coaches, and unlock NIL opportunities.' },
  { q: 'Who can join?', a: 'Any girls basketball player from middle school through college can create a profile. Parents, coaches, and club administrators are also welcome.' },
  { q: 'How much does it cost?', a: 'We offer a range of services from free profile creation to premium recruiting packages. Check our Services page for detailed pricing.' },
  { q: 'How do I get started?', a: 'Create a free account, build your player profile, and start exploring recruiting tools and NIL opportunities.' },
  { q: 'Is my data secure?', a: 'Yes. We use Supabase authentication and row-level security to ensure your data is only visible to authorized users.' },
  { q: 'How do coaches find me?', a: 'College coaches can browse player profiles, filter by position and class year, and reach out through the platform.' },
]

export default function FAQPage() {
  return (
    <PageShell title="Frequently Asked Questions" description="Common questions about Elite GBB and our platform." badge="FAQ">
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-navy-800 p-6 rounded-lg shadow-md group">
            <summary className="text-lg font-semibold text-white cursor-pointer list-none flex items-center justify-between">
              {faq.q}
              <span className="text-[#0134BD] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-slate-400">{faq.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  )
}
