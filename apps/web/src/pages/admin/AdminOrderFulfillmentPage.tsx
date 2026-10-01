import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Save, CheckCircle, Package, User, Calendar, FileText, Activity } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminOrderFulfillmentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('new')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const editableStatuses = [
    'new', 'awaiting_intake', 'in_review', 'needs_assets', 'assigned', 
    'in_progress', 'awaiting_client_feedback', 'complete', 'archived', 
    'cancelled', 'active', 'review', 'completed'
  ]

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          service_offers(name, category, price_cents),
          player_profiles(first_name, last_name, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order')
        navigate('/admin/orders')
      } else if (data) {
        setOrder(data)
        setStatus(data.status || 'new')
        setNotes(data.notes || '')
      }
      setLoading(false)
    }
    fetchOrder()
  }, [id, navigate])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    const { error } = await supabase
      .from('service_orders')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update order')
      console.error(error)
    } else {
      toast.success('Order updated successfully')
      setOrder(prev => ({ ...prev, status, notes }))
    }
    setSaving(false)
  }

  const markCompleted = async () => {
    if (!id) return
    setSaving(true)
    const { error } = await supabase
      .from('service_orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      toast.error('Failed to complete order')
    } else {
      toast.success('Order marked as completed!')
      setStatus('completed')
      setOrder(prev => ({ ...prev, status: 'completed', completed_at: new Date().toISOString() }))
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <DashboardLayout variant="admin" title="Order Fulfillment">
        <div className="flex justify-center p-12"><Activity className="animate-spin text-gray-500" /></div>
      </DashboardLayout>
    )
  }

  if (!order) return null

  const offer = Array.isArray(order.service_offers) ? order.service_offers[0] : order.service_offers
  const profile = Array.isArray(order.player_profiles) ? order.player_profiles[0] : order.player_profiles
  const profileName = profile?.first_name || profile?.last_name ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown Athlete'

  return (
    <DashboardLayout variant="admin" title="Order Fulfillment" subtitle={`Manage and fulfill order ${id?.slice(0,8)}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-navy-800 rounded-xl p-6 shadow-md border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Package size={20} className="text-[#0134BD]" /> Service Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Service</label>
                  <p className="text-white font-medium">{offer?.name || 'Custom Service'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Category</label>
                  <p className="text-gray-300">{offer?.category || 'General'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Price</label>
                  <p className="text-green-400 font-bold">${(offer?.price_cents || 0) / 100}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Purchaser</label>
                  <p className="text-gray-300">{order.customer_name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{order.customer_email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-navy-800 rounded-xl p-6 shadow-md border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText size={20} className="text-amber-500" /> Fulfillment Notes / Deliverables</h2>
              <p className="text-sm text-gray-400 mb-4">Add internal notes or links to deliverables (e.g. Google Drive link, report URL) here. This is tied directly to the order.</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Enter fulfillment details or deliverable links..."
                className="w-full h-48 bg-navy-900 border border-white/10 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#0134BD]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-navy-800 rounded-xl p-6 shadow-md border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><User size={18} /> Athlete Profile</h3>
              <div className="flex items-center gap-4 mb-4">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{profileName}</p>
                  <button onClick={() => navigate(`/dashboard/profile/${order.player_profile_id}`)} className="text-xs text-[#0134BD] hover:underline">View Full Profile</button>
                </div>
              </div>
            </div>

            <div className="bg-navy-800 rounded-xl p-6 shadow-md border border-white/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Calendar size={18} /> Status & Timeline</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Created At</label>
                  <p className="text-sm text-gray-300">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Due Date</label>
                  <p className="text-sm text-gray-300">{order.due_at ? new Date(order.due_at).toLocaleDateString() : 'No deadline set'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Completed At</label>
                  <p className="text-sm text-gray-300">{order.completed_at ? new Date(order.completed_at).toLocaleString() : 'Pending'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Order Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#0134BD]"
                  >
                    {editableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full flex justify-center items-center gap-2 bg-[#0134BD] hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Save size={16} /> Save Changes
                </button>
                {status !== 'completed' && (
                  <button 
                    onClick={markCompleted} 
                    disabled={saving}
                    className="w-full flex justify-center items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-500 py-2.5 rounded-lg text-sm font-medium transition-colors border border-green-500/30"
                  >
                    <CheckCircle size={16} /> Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
