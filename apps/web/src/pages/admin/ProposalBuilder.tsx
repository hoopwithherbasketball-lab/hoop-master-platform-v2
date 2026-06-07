import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { toast } from 'sonner'
import { Check, Clipboard, Loader2, ArrowRight } from 'lucide-react'

interface Partner { id: string; business_name: string }
interface InventorySlot { id: string; slot_name: string; price: number; is_available: boolean }

export default function ProposalBuilder() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [inventory, setInventory] = useState<InventorySlot[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedPartner, setSelectedPartner] = useState('')
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [customPrice, setCustomPrice] = useState<string>('')
  
  const [generating, setGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  useEffect(() => {
    async function init() {
      // 1. Auth Check
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("--- AUTH DEBUG ---");
      console.log("Session exists:", !!session);
      
      if (!session) {
        toast.error("You are not logged in. Please sign in to access the CRM.");
        setLoading(false);
        return;
      }

      // 2. Fetch Data
      const [pRes, iRes] = await Promise.all([
        supabase.from('crm_partners').select('id, business_name').order('business_name'),
        supabase.from('sponsorship_inventory').select('id, slot_name, price, is_available').eq('is_available', true)
      ]);

      if (pRes.error || iRes.error) {
        console.error("Fetch Error:", pRes.error || iRes.error);
        toast.error("Failed to load CRM data. Ensure you have Admin permissions.");
      } else {
        setPartners(pRes.data || []);
        setInventory(iRes.data || []);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleToggleSlot = (id: string) => {
    setSelectedSlots(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const generateProposal = async () => {
    if (!selectedPartner) return toast.error('Select a partner')
    if (selectedSlots.length === 0) return toast.error('Select at least one inventory item')
    
    setGenerating(true)
    const items = selectedSlots.map(id => inventory.find(i => i.id === id)).filter(Boolean)
    const baseTotal = items.reduce((acc, curr) => acc + (curr?.price || 0), 0)
    const finalPrice = customPrice ? parseFloat(customPrice) : baseTotal

    const package_details = { items, baseTotal, finalPrice }

    const { data, error } = await supabase.from('proposals').insert({
      partner_id: selectedPartner,
      status: 'Sent',
      package_details
    }).select('id').single()

    setGenerating(false)
    if (error) {
      console.error(error);
      toast.error('Failed to generate proposal. Check Admin permissions.');
    } else if (data) {
      toast.success('Proposal Generated!');
      setGeneratedLink(`${window.location.origin}/pitch/${data.id}`);
      setSelectedPartner('');
      setSelectedSlots([]);
      setCustomPrice('');
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    toast.success('Link copied to clipboard')
  }

  return (
    <DashboardLayout variant="admin" title="Proposal Builder" subtitle="Draft and deploy interactive pitch pages for brand partners">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#fb6c1d]" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Builder Form */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">1. Select Recipient</h2>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#fb6c1d]"
                value={selectedPartner}
                onChange={e => setSelectedPartner(e.target.value)}
              >
                <option value="">-- Choose a CRM Partner --</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.business_name}</option>)}
              </select>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">2. Build Package</h2>
              <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {inventory.map(slot => (
                  <div 
                    key={slot.id} 
                    onClick={() => handleToggleSlot(slot.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedSlots.includes(slot.id) ? 'bg-[#fb6c1d]/10 border-[#fb6c1d]' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${selectedSlots.includes(slot.id) ? 'bg-[#fb6c1d] border-[#fb6c1d]' : 'border-slate-500'}`}>
                        {selectedSlots.includes(slot.id) && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-slate-200">{slot.slot_name}</span>
                    </div>
                    <span className="text-slate-400 font-mono">${slot.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4">
                <label className="block text-sm text-slate-400 mb-1">Custom Package Price (Override Total)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input 
                    type="number" 
                    placeholder="Leave blank to use base total"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-4 text-white focus:outline-none focus:border-[#fb6c1d]"
                    value={customPrice}
                    onChange={e => setCustomPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={generateProposal}
              disabled={generating}
              className="w-full bg-[#fb6c1d] hover:bg-[#e05b14] disabled:opacity-50 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
            >
              {generating ? <Loader2 className="animate-spin" size={20} /> : 'Generate Secure Pitch Link'} <ArrowRight size={20}/>
            </button>
          </div>

          {/* Success Output */}
          <div className="space-y-6">
            {generatedLink && (
              <div className="bg-[#fb6c1d]/10 border border-[#fb6c1d]/30 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 bg-[#fb6c1d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Proposal Ready!</h2>
                <p className="text-slate-400 mb-6">Send this secure link directly to the partner. They do not need an account to view and accept.</p>
                
                <div className="flex bg-slate-900 rounded-lg p-2 border border-slate-700 items-center justify-between">
                  <span className="text-slate-300 font-mono text-sm truncate px-2">{generatedLink}</span>
                  <button onClick={copyLink} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md transition-colors shrink-0">
                    <Clipboard size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
