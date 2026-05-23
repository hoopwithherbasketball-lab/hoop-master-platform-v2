import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '@hoop-master/features/crm'
import { Bell } from 'lucide-react'

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead, typeIcons } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-500 hover:text-[#0134BD] transition-colors">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#FB6C1D] text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h3 className="font-semibold text-[#121B47] text-sm">Notifications</h3>
            {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-[#0134BD] hover:underline">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">No notifications</p>}
            {notifications.map(n => (
              <Link key={n.id} to={n.link || '#'} onClick={() => { markRead(n.id); setOpen(false) }} className={`flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                <span className="text-lg flex-shrink-0">{typeIcons[n.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-[#121B47]' : 'text-gray-600'}`}>{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.description}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{new Date(n.timestamp).toLocaleDateString()}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-[#FB6C1D] rounded-full flex-shrink-0 mt-1.5" />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
