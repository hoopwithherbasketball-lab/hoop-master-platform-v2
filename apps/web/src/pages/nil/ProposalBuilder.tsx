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
      
      if (!session) {
        toast.error("You are not logg
<truncated 5279 bytes>

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