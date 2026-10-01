import { useEffect, useState } from 'react'
import { useMemberProfile } from '@hoop-master/features/connectgbb'
import { PageShell } from '@hoop-master/ui'
import { Save } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'

const ROLES = [
  { value: 'player', label: 'Player' },
  { value: 'coach', label: 'Coach' },
  { value: 'parent', label: 'Parent' },
  { value: 'scout', label: 'Scout' },
]

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const { profile } = useMemberProfile(user?.id || '')
  const [displayName, setDisplayName] = useState('')
  const [location, setLocation] = useState('')
  const [role, setRole] = useState('player')
  const [bio, setBio] = useState('')
  const [emailVisibility, setEmailVisibility] = useState<'public' | 'connections' | 'private'>('connections')
  const [saving, setSaving] = useState(false)
  const [statusText, setStatusText] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.displayName)
    setLocation(profile.location)
    setRole(profile.role)
    setBio(profile.bio)
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    try {
      setSaving(true)
      setStatusText(null)
      const { error } = await supabase
        .from('member_profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName.trim(),
          location: location.trim(),
          role,
          bio: bio.trim(),
          email_visibility: emailVisibility,
        }, { onConflict: 'user_id' })

      if (error) throw error
      setStatusText('Profile saved successfully.')
    } catch (e) {
      console.error('ProfileSettingsPage handleSave:', e)
      setStatusText('Unable to save profile right now.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell title="Profile Settings" description="Edit your ConnectGBB member profile." badge="Settings">
      <div className="max-w-2xl mx-auto bg-navy-800 rounded-xl shadow-md p-6 space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b border-white/10">
          <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center text-2xl font-bold text-white">{profile?.avatar || '?'}</div>
          <div>
            <p className="font-semibold text-white">{profile?.displayName || 'Your Name'}</p>
            <p className="text-sm text-slate-400 capitalize">{profile?.role || 'player'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} data-testid="connectgbb-profile-display-name-input" className="w-full p-2.5 border border-white/20 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Location</label><input value={location} onChange={(e) => setLocation(e.target.value)} data-testid="connectgbb-profile-location-input" className="w-full p-2.5 border border-white/20 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} data-testid="connectgbb-profile-role-select" className="w-full p-2.5 border border-white/20 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]">
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Email Visibility</label>
            <select value={emailVisibility} onChange={(e) => setEmailVisibility(e.target.value as 'public' | 'connections' | 'private')} data-testid="connectgbb-profile-email-visibility-select" className="w-full p-2.5 border border-white/20 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]">
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div><label className="block text-sm font-medium text-gray-300 mb-1">Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} data-testid="connectgbb-profile-bio-input" rows={4} className="w-full p-2.5 border border-white/20 rounded-lg focus:ring-[#0134BD] focus:border-[#0134BD]" /></div>

        {statusText && <p className="text-sm text-slate-300" data-testid="connectgbb-profile-save-status-text">{statusText}</p>}

        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button onClick={handleSave} disabled={saving} data-testid="connectgbb-profile-save-button" className="bg-[#0134BD] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#002a80] disabled:opacity-50 flex items-center gap-2"><Save size={16} /> Save Changes</button>
          <button onClick={() => {
            setDisplayName(profile?.displayName || '')
            setLocation(profile?.location || '')
            setRole(profile?.role || 'player')
            setBio(profile?.bio || '')
            setEmailVisibility('connections')
          }} data-testid="connectgbb-profile-cancel-button" className="px-6 py-2.5 border border-white/20 rounded-lg text-gray-300 font-medium hover:bg-white/5">Reset</button>
        </div>
      </div>
    </PageShell>
  )
}
