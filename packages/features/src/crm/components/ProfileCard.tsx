import { useState } from 'react'
import { useCurrentUserProfile } from '../hooks/useCurrentUserProfile.js'

interface ProfileCardProps {
  editable?: boolean
  className?: string
}

export function ProfileCard({ editable = false, className = '' }: ProfileCardProps) {
  const { profile, loading, updateProfile } = useCurrentUserProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    class_year: 0,
  })

  const handleEdit = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        position: profile.position || '',
        class_year: profile.class_year || 0,
      })
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (updateProfile) {
      await updateProfile(formData)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className={`bg-navy-800 rounded-lg border border-white/10 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={`bg-navy-800 rounded-lg border border-white/10 p-6 ${className}`}>
        <p className="text-slate-500">No profile data available. Please sign in to sync your information.</p>
      </div>
    )
  }

  return (
    <div className={`bg-navy-800 rounded-lg border border-white/10 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Profile Information</h3>
        {editable && !isEditing && (
          <button
            onClick={handleEdit}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-navy-900 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-navy-900 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Point Guard, Forward"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Class Year</label>
            <input
              type="number"
              value={formData.class_year}
              onChange={e => setFormData(prev => ({ ...prev, class_year: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2026"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="text-lg font-semibold text-white">
              {profile.first_name} {profile.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Position</p>
            <p className="text-base font-medium text-white">{profile.position || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Class Year</p>
            <p className="text-base font-medium text-white">{profile.class_year || 'Not specified'}</p>
          </div>
        </div>
      )}
    </div>
  )
}