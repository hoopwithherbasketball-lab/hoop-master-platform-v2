import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ServiceIntakePage() {
  return (
    <DashboardLayout variant="player" title="Service Intake" subtitle="Share your goals and timeline with our support team." >
      <div className="card p-6 space-y-6">
        <div>
          <p className="text-sm text-slate-500">Tell us which service you need and what your priorities are.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Service</p>
            <p className="mt-2 text-base font-semibold text-white">Recruiting Profile Update</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Priority</p>
            <p className="mt-2 text-base font-semibold text-white">Highlight reel delivery</p>
          </div>
        </div>
        <div className="grid gap-3">
          <label className="block text-sm text-gray-300">Additional details</label>
          <textarea className="w-full min-h-[140px] rounded-3xl border border-white/10 p-4 text-sm text-white" defaultValue="I need help finalizing my highlight footage and sending it to target schools." />
        </div>
        <button className="btn btn-primary">Submit intake</button>
      </div>
    </DashboardLayout>
  )
}
