import { useMemberProfile } from '@hoop-master/features/connectgbb'
import PageShell from '../../components/ui/PageShell'
import { Save } from 'lucide-react'

const ROLES = [
  { value: 'player', label: 'Player' },
  { value: 'coach', label: 'Coach' },
  { value: 'parent', label: 'Parent' },
  { value: 'scout', label: 'Scout' },
]

export default function ProfileSettingsPage() {
  const { profile } = useMemberProfile('1')

  return (
    <PageShell title="Profile Settings" description="Edit your ConnectGBB member profile." badge="Settings">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center text-2xl font-bold text-white">{profile?.avatar || '?'}</div>
          <div>
            <p className="font-semibold text-[#121B47]">{profile?.displayName || 'Your Name'}</p>
            <p className="text-sm text-gray-500 capitalize">{profile?.role || 'player'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label><input defaultValue={profile?.displayName} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input defaultValue={profile?.location} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select defaultValue={profile?.role} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]">
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Visibility</label>
            <select defaultValue="connections" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]">
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea defaultValue={profile?.bio} rows={4} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button className="bg-[#0134BD] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#002a80] flex items-center gap-2"><Save size={16} /> Save Changes</button>
          <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </PageShell>
  )
}
