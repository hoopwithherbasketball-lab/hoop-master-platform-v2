interface Props {
  level: 'none' | 'starter' | 'development' | 'elite'
  size?: 'sm' | 'md' | 'lg'
}

const config = {
  starter: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Verified Prospect', icon: '✓' },
  development: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Elite Prospect', icon: '★' },
  elite: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Elite Track', icon: '👑' },
  none: { bg: 'bg-gray-100', text: 'text-gray-400', label: 'Unverified', icon: '○' },
}

export function VerifiedBadge({ level, size = 'sm' }: Props) {
  const c = config[level]
  const sizeClass = size === 'lg' ? 'px-4 py-1.5 text-sm' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-xs'

  if (level === 'none') return null

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${c.bg} ${c.text} ${sizeClass}`}>
      <span className="text-current">{c.icon}</span>
      {c.label}
    </span>
  )
}
