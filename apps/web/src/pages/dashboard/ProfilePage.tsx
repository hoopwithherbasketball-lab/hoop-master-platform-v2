import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth, useCurrentUserProfile } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Camera, User, Loader as Loader2, CircleCheck as CheckCircle } from 'lucide-react'

const POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center', 'Guard', 'Forward', 'Wing']

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, updateProfile } = useCurrentUserProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    secondary_position: '',
    class_year: 0,
    height: '',
    school_name: '',
    city: '',
    state: '',
    team_name: '',
    gpa: '',
    bio: '',
    instagram_handle: '',
    film_url: '',
  })

  const startEdit = () => {
    if (!profile) return
    setFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      position: profile.position || '',
      secondary_position: profile.secondary_position || '',
      class_year: profile.class_year || 0,
      height: profile.height || '',
      school_name: profile.school_name || '',
      city: profile.city || '',
      state: profile.state || '',
      team_name: profile.team_name || '',
      gpa: profile.gpa != null ? String(profile.gpa) : '',
      bio: profile.bio || '',
      instagram_handle: profile.instagram_handle || '',
      film_url: profile.film_url || '',
    })
    setIsEditing(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        position: formData.position || null,
        secondary_position: formData.secondary_position || null,
        class_year: formData.class_year || null,
        height: formData.height || null,
        school_name: formData.school_name || null,
        city: formData.city || null,
        state: formData.state || null,
        team_name: formData.team_name || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        bio: formData.bio || null,
        instagram_handle: formData.instagram_handle || null,
        film_url: formData.film_url || null,
      })
      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { setImageError('Please select an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { setImageError('Image must be under 5MB.'); return }
    setImageError('')
    setImageUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('player-assets').upload(path, file, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('player-assets').getPublicUrl(path)
      await updateProfile({ profile_image_url: publicUrl })
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Upload failed. Check storage bucket permissions.')
    } finally {
      setImageUploading(false)
    }
  }

  const f = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [k]: e.target.value }))

  const inputClass = 'w-full p-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-500 outline-none focus:border-[#0134BD] text-sm'

  return (
    <DashboardLayout variant="player" title="Profile" subtitle="Manage your basketball profile and academic details.">
      <div className="max-w-2xl space-y-6">
        {/* Profile image */}
        <div className="bg-navy-800 rounded-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Profile Photo</h3>
          <div className="flex items-center gap-5">
            <div className="relative">
              {loading ? (
                <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
              ) : profile?.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy-700 border-2 border-white/10 flex items-center justify-center">
                  <User size={32} className="text-slate-500" />
                </div>
              )}
              {imageUploading && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <Loader2 size={20} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Camera size={14} />
                {imageUploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <p className="text-xs text-slate-500 mt-1.5">JPG, PNG or WebP. Max 5MB.</p>
              {imageError && <p className="text-xs text-red-400 mt-1">{imageError}</p>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        {/* Profile details */}
        <div className="bg-navy-800 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Profile Information</h3>
            <div className="flex items-center gap-2">
              {saved && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle size={12} />Saved</span>}
              {!isEditing && !loading && (
                <button onClick={startEdit} className="text-[#6b9df4] hover:text-white text-sm font-medium transition-colors">Edit</button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-white/10 rounded" />)}</div>
          ) : isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">First Name</label>
                  <input value={formData.first_name} onChange={f('first_name')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Last Name</label>
                  <input value={formData.last_name} onChange={f('last_name')} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Primary Position</label>
                  <select value={formData.position} onChange={f('position')} className={inputClass + ' bg-navy-800'}>
                    <option value="">Select...</option>
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Secondary Position</label>
                  <select value={formData.secondary_position} onChange={f('secondary_position')} className={inputClass + ' bg-navy-800'}>
                    <option value="">Select...</option>
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Class Year</label>
                  <input type="number" value={formData.class_year || ''} onChange={f('class_year')} placeholder="2026" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height</label>
                  <input value={formData.height} onChange={f('height')} placeholder={'5\'8"'} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">GPA</label>
                  <input type="number" step="0.01" min="0" max="4" value={formData.gpa} onChange={f('gpa')} placeholder="3.8" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">School</label>
                  <input value={formData.school_name} onChange={f('school_name')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Team</label>
                  <input value={formData.team_name} onChange={f('team_name')} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">City</label>
                  <input value={formData.city} onChange={f('city')} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">State</label>
                  <input value={formData.state} onChange={f('state')} maxLength={2} placeholder="TX" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bio</label>
                <textarea value={formData.bio} onChange={f('bio')} rows={3} className={inputClass + ' resize-none'} placeholder="Tell coaches about yourself..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Instagram Handle</label>
                  <input value={formData.instagram_handle} onChange={f('instagram_handle')} placeholder="@handle" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Film URL</label>
                  <input value={formData.film_url} onChange={f('film_url')} placeholder="https://..." className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#0134BD] hover:bg-[#002a80] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                  {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : 'Save Changes'}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                ['Name', [profile.first_name, profile.last_name].filter(Boolean).join(' ')],
                ['Position', profile.position || '—'],
                ['Class Year', profile.class_year ? String(profile.class_year) : '—'],
                ['Height', profile.height || '—'],
                ['School', profile.school_name || '—'],
                ['Team', profile.team_name || '—'],
                ['City / State', [profile.city, profile.state].filter(Boolean).join(', ') || '—'],
                ['GPA', profile.gpa != null ? String(profile.gpa) : '—'],
                ['Instagram', profile.instagram_handle || '—'],
                ['Film URL', profile.film_url || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-white truncate">{value}</p>
                </div>
              ))}
              {profile.bio && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-0.5">Bio</p>
                  <p className="text-sm text-white leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No profile found. Complete the intake form to create your profile.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
