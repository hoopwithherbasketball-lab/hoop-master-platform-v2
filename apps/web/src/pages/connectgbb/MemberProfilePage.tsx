import { useParams, Link } from 'react-router-dom'
import { useMemberProfile } from '@hoop-master/features/connectgbb'
import { VerifiedBadge, useVerification } from '@hoop-master/features/crm'
import PageShell from '../../components/ui/PageShell'
import { MapPin, Calendar, MessageSquare } from 'lucide-react'

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { profile } = useMemberProfile(id || '1')
  const badge = useVerification()

  if (!profile) return <PageShell title="Not Found" description="Member not found." badge="ConnectGBB"><Link to="/connectgbb" className="text-[#0134BD] hover:underline">← Back to ConnectGBB</Link></PageShell>

  return (
    <PageShell title={profile.displayName} description={`${profile.role} • ${profile.location}`} badge="Profile">
      <Link to="/connectgbb/feed" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0134BD] mb-2">← Back to Feed</Link>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="w-20 h-20 bg-[#0134BD] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto">{profile.avatar}</div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <h1 className="text-2xl font-bold text-[#121B47]">{profile.displayName}</h1>
            <VerifiedBadge level={badge.badge} size="sm" />
          </div>
          <p className="text-gray-500 capitalize mt-1">{profile.role}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Joined {profile.joined}</span>
          </div>
          <p className="text-gray-700 mt-4 max-w-lg mx-auto">{profile.bio}</p>
          <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center"><p className="text-xl font-bold text-[#121B47]">{profile.connections}</p><p className="text-xs text-gray-500">Connections</p></div>
            <div className="text-center"><p className="text-xl font-bold text-[#121B47]">{profile.posts}</p><p className="text-xs text-gray-500">Posts</p></div>
          </div>
          <button className="mt-5 bg-[#0134BD] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#002a80] transition-colors flex items-center gap-2 mx-auto">
            <MessageSquare size={16} /> Message
          </button>
        </div>
      </div>
    </PageShell>
  )
}
