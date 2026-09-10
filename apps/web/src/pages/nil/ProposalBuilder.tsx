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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You are not logged in");
        setLoading(false);
        return;
      }
      
      const [partnersRes, slotsRes] = await Promise.all([
        supabase.from('sponsorship_crm').select('id, business_name').eq('status', 'active'),
        supabase.from('media_ad_slots').select('*').eq('is_available', true)
      ]);
      
      if (partnersRes.data) setPartners(partnersRes.data);
      if (slotsRes.data) setInventory(slotsRes.data);
      
      setLoading(false);
    }
    init();
  }, []);

  const generateProposal = async () => {
    if (!selectedPartner || selectedSlots.length === 0) {
      toast.error('Select a partner and at least one slot');
      return;
    }
    setGenerating(true);
    
    // In a real app we would insert into sponsorship_proposals
    const proposalId = crypto.randomUUID();
    
    // Mocking the backend call for now
    await new Promise(r => setTimeout(r, 1000));
    
    setGeneratedLink(`https://hoopwithher.com/pitch/${proposalId}`);
    setGenerating(false);
    toast.success('Proposal generated!');
  }

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link copied to clipboard!');
  }

  return (
    <DashboardLayout title="Proposal Builder" variant="admin">
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Select Partner</h2>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" value={selectedPartner} onChange={e => setSelectedPartner(e.target.value)}>
                <option value="">-- Choose a Partner --</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.business_name}</option>
                ))}
              </select>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Select Inventory</h2>
              <div className="space-y-2">
                {inventory.map(slot => (
                  <label key={slot.id} className="flex items-center gap-3 text-slate-300">
                    <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-[#fb6c1d]" checked={selectedSlots.includes(slot.id)} onChange={e => {
                      if (e.target.checked) setSelectedSlots([...selectedSlots, slot.id]);
                      else setSelectedSlots(selectedSlots.filter(id => id !== slot.id));
                    }} />
                    {slot.slot_name} - ${slot.price}
                  </label>
                ))}
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

          <div className="space-y-6">
            {generatedLink && (
              <div className="bg-[#fb6c1d]/10 border border-[#fb6c1d]/30 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#fb6c1d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Proposal Ready!</h2>
                <p className="text-slate-400 mb-6">Send this secure link directly to the partner.</p>
                
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