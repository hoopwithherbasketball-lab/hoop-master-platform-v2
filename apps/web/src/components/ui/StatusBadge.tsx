const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  awaiting_intake: { label: 'Awaiting Intake', className: 'bg-yellow-100 text-yellow-700' },
  in_review: { label: 'In Review', className: 'bg-orange-100 text-orange-700' },
  needs_assets: { label: 'Needs Assets', className: 'bg-red-100 text-red-700' },
  assigned: { label: 'Assigned', className: 'bg-purple-100 text-purple-700' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  awaiting_client_feedback: { label: 'Awaiting Feedback', className: 'bg-yellow-100 text-yellow-800' },
  complete: { label: 'Complete', className: 'bg-green-100 text-green-700' },
  archived: { label: 'Archived', className: 'bg-slate-100 text-slate-500' },
}
export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' }
  return <span className={`badge ${config.className}`}>{config.label}</span>
}
