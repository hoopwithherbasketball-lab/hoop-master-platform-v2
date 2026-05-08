import { useParams } from 'react-router-dom'
import PageShell from '../../components/ui/PageShell'

const plans: Record<string, { title: string; description: string; price: string }> = {
  'recruiting-review': { title: 'Recruiting Review', description: 'Complete recruiting profile review with school recommendations.', price: '$299' },
  'nil-assessment': { title: 'NIL Assessment', description: 'Brand and sponsorship readiness review.', price: '$249' },
  'performance-audit': { title: 'Performance Audit', description: 'On-court and strength evaluation with a training plan.', price: '$199' },
}

export default function CheckoutPage() {
  const { slug } = useParams()
  const plan = slug ? plans[slug] : null

  return (
    <PageShell title="Checkout" description="Review your service selection and complete payment." badge="Checkout">
      {plan ? (
        <div className="card p-6 space-y-5 max-w-2xl">
          <div>
            <h2 className="text-2xl font-semibold text-navy-900">{plan.title}</h2>
            <p className="text-slate-500 mt-2">{plan.description}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
            <div className="flex items-center justify-between text-lg font-semibold text-navy-900">
              <span>Total</span>
              <span>{plan.price}</span>
            </div>
          </div>
          <button className="btn btn-primary">Complete purchase</button>
        </div>
      ) : (
        <div className="card p-6 text-slate-600">Please choose a valid service plan to continue checkout.</div>
      )}
    </PageShell>
  )
}
