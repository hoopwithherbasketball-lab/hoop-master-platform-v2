import { useState, useMemo } from 'react'
import { useNILCompanies } from '@hoop-master/features/nil'
import { supabase } from '../../lib/supabase'
import { Plus, Edit3, Trash2, X, Mail, Search, Globe, User, Send, Check, Upload } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const INDUSTRIES = ['Restaurant', 'Fitness Studio', 'Salon', 'Service Provider', 'Local Brand', 'Other']
const STATUSES = ['prospect', 'outreach', 'negotiating', 'partner', 'inactive']
const OFFERS_LIST = ['Cash', 'Free Product', 'Discounts', 'Event Appearances']

const statusColors: Record<string, string> = {
  prospect: 'bg-blue-500/20 text-blue-400',
  outreach: 'bg-amber-500/20 text-amber-400',
  negotiating: 'bg-purple-500/20 text-purple-400',
  partner: 'bg-green-500/20 text-green-400',
  inactive: 'bg-slate-500/20 text-slate-400',
}

interface CompanyNotes {
  offers: string[]
  notes: string
}

function parseNotes(notesStr: string): CompanyNotes {
  if (!notesStr) return { offers: [], notes: '' }
  try {
    const parsed = JSON.parse(notesStr)
    if (parsed && typeof parsed === 'object') {
      return {
        offers: Array.isArray(parsed.offers) ? parsed.offers : [],
        notes: typeof parsed.notes === 'string' ? parsed.notes : '',
      }
    }
  } catch (e) {
    // Not JSON, fallback
  }
  return { offers: [], notes: notesStr }
}

function serializeNotes(offers: string[], notes: string): string {
  return JSON.stringify({ offers, notes })
}

export default function CompanyList() {
  const { companies, loading } = useNILCompanies()
  
  // UI states
  const [modal, setModal] = useState<{ type: 'create' | 'edit'; company?: any } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMessage('Reading CSV...')

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split(/\r?\n/)
        if (lines.length <= 1) {
          throw new Error('CSV is empty or missing a header row.')
        }

        // Parse header and map column indices
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const getIndex = (name: string) => headers.indexOf(name)
        
        const nameIdx = getIndex('name')
        const industryIdx = getIndex('industry')
        const contactNameIdx = getIndex('contact name') || getIndex('contact_name')
        const contactEmailIdx = getIndex('contact email') || getIndex('contact_email')
        const websiteIdx = getIndex('website')
        const statusIdx = getIndex('status')
        const offersIdx = getIndex('offers')
        const notesIdx = getIndex('notes')

        if (nameIdx === -1) {
          throw new Error('CSV must contain a "Name" column.')
        }

        const payload: any[] = []

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          // Parse CSV row with simple quote handling
          const cols: string[] = []
          let cur = ''
          let inQuotes = false
          for (let charIdx = 0; charIdx < line.length; charIdx++) {
            const char = line[charIdx]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
              cols.push(cur.trim())
              cur = ''
            } else {
              cur += char
            }
          }
          cols.push(cur.trim())

          const nameVal = cols[nameIdx]
          if (!nameVal) continue // Skip rows without name

          const indVal = (industryIdx !== -1 && cols[industryIdx]) ? cols[industryIdx] : 'Other'
          const cNameVal = (contactNameIdx !== -1 && cols[contactNameIdx]) ? cols[contactNameIdx] : ''
          const cEmailVal = (contactEmailIdx !== -1 && cols[contactEmailIdx]) ? cols[contactEmailIdx] : ''
          const webVal = (websiteIdx !== -1 && cols[websiteIdx]) ? cols[websiteIdx] : ''
          const statVal = (statusIdx !== -1 && cols[statusIdx]) ? cols[statusIdx] : 'prospect'
          
          const rawOffers = (offersIdx !== -1 && cols[offersIdx]) ? cols[offersIdx].split(';').map(o => o.trim()) : []
          const rawNotes = (notesIdx !== -1 && cols[notesIdx]) ? cols[notesIdx] : ''
          
          payload.push({
            name: nameVal,
            industry: INDUSTRIES.includes(indVal) ? indVal : 'Other',
            contact_name: cNameVal,
            contact_email: cEmailVal,
            website: webVal,
            status: STATUSES.includes(statVal) ? statVal : 'prospect',
            notes: serializeNotes(rawOffers, rawNotes)
          })
        }

        if (payload.length === 0) {
          throw new Error('No valid rows parsed from the CSV.')
        }

        setUploadMessage(`Uploading ${payload.length} targets...`)
        const { error } = await supabase.from('nil_companies').insert(payload)
        if (error) throw error

        setUploadMessage('Upload successful! Reloading...')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (err: any) {
        alert(`Failed to import CSV: ${err.message}`)
        setUploading(false)
        setUploadMessage('')
      }
    }
    reader.readAsText(file)
  }
  const [outreachModal, setOutreachModal] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  // Form fields
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('Restaurant')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState('prospect')
  const [notesText, setNotesText] = useState('')
  const [selectedOffers, setSelectedOffers] = useState<string[]>([])
  
  // Outreach fields
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [sendingOutreach, setSendingOutreach] = useState(false)

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [offerFilter, setOfferFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const openCreate = () => {
    setName('')
    setIndustry('Restaurant')
    setContactName('')
    setContactEmail('')
    setWebsite('')
    setStatus('prospect')
    setNotesText('')
    setSelectedOffers([])
    setModal({ type: 'create' })
  }

  const openEdit = (c: any) => {
    const parsed = parseNotes(c.notes)
    setName(c.name || '')
    setIndustry(c.industry || 'Restaurant')
    setContactName(c.contact_name || '')
    setContactEmail(c.contact_email || '')
    setWebsite(c.website || '')
    setStatus(c.status || 'prospect')
    setNotesText(parsed.notes)
    setSelectedOffers(parsed.offers)
    setModal({ type: 'edit', company: c })
  }

  const openOutreach = (c: any) => {
    const parsed = parseNotes(c.notes)
    const offersStr = parsed.offers.length > 0 ? parsed.offers.join(', ') : 'local collaborations'
    setEmailSubject(`Partnership Opportunity with HoopWithHer Athletes`)
    setEmailBody(
      `Hi ${c.contact_name || 'there'},\n\n` +
      `I am reaching out from HoopWithHer regarding a potential partnership. We saw that you target opportunities for ${offersStr} with local student-athletes.\n\n` +
      `Our girls' basketball athletes have a strong local following, and we would love to discuss how they can collaborate with ${c.name} for campaigns, reviews, or appearances.\n\n` +
      `Please let us know if you are open to a brief chat next week.\n\n` +
      `Best regards,\n` +
      `HoopWithHer Sponsorship Team`
    )
    setOutreachModal(c)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    const notesStr = serializeNotes(selectedOffers, notesText)
    const payload = {
      name,
      industry,
      contact_name: contactName,
      contact_email: contactEmail,
      website,
      status,
      notes: notesStr,
    }

    if (modal?.type === 'create') {
      await supabase.from('nil_companies').insert(payload)
    } else if (modal?.type === 'edit' && modal.company) {
      await supabase.from('nil_companies').update(payload).eq('id', modal.company.id)
    }
    setModal(null)
    window.location.reload()
  }

  const handleSendOutreach = async () => {
    if (!outreachModal) return
    setSendingOutreach(true)
    
    // Save outreach record in database
    await supabase.from('nil_outreach').insert({
      company_id: outreachModal.id,
      subject: emailSubject,
      notes: emailBody, // Maps to message body
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    // If company was a prospect, update status to outreach
    if (outreachModal.status === 'prospect') {
      await supabase.from('nil_companies').update({ status: 'outreach' }).eq('id', outreachModal.id)
    }

    setSendingOutreach(false)
    setOutreachModal(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('nil_companies').delete().eq('id', id)
    setDeleteId(null)
    window.location.reload()
  }

  const toggleOffer = (offer: string) => {
    setSelectedOffers(prev =>
      prev.includes(offer) ? prev.filter(o => o !== offer) : [...prev, offer]
    )
  }

  // Filtered companies list
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const parsed = parseNotes(c.notes)
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = c.name?.toLowerCase().includes(query)
        const matchContact = c.contact_name?.toLowerCase().includes(query)
        const matchEmail = c.contact_email?.toLowerCase().includes(query)
        const matchIndustry = c.industry?.toLowerCase().includes(query)
        if (!matchName && !matchContact && !matchEmail && !matchIndustry) return false
      }

      // Industry Filter
      if (industryFilter && c.industry !== industryFilter) return false

      // Status Filter
      if (statusFilter && c.status !== statusFilter) return false

      // Offer Filter
      if (offerFilter && !parsed.offers.includes(offerFilter)) return false

      return true
    })
  }, [companies, searchQuery, industryFilter, offerFilter, statusFilter])

  return (
    <DashboardLayout
      variant="admin"
      title="NIL Brand Partners"
      subtitle="Target local brands and initiate NIL sponsorship outreach."
      action={
        <div className="flex items-center gap-2">
          {uploading ? (
            <span className="text-xs text-blue-300 animate-pulse font-medium">{uploadMessage}</span>
          ) : (
            <>
              <input 
                type="file" 
                id="bulk-upload-csv" 
                accept=".csv" 
                onChange={handleBulkUpload} 
                className="hidden" 
              />
              <label 
                htmlFor="bulk-upload-csv" 
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border border-white/15 transition-colors"
              >
                <Upload size={15} /> Bulk Upload (CSV)
              </label>
            </>
          )}
          <button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <Plus size={16} /> Add Target Brand
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-navy-800 border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search local brands..."
              className="flex-1 outline-none text-sm bg-transparent text-white placeholder-slate-400"
            />
          </div>
          
          <select
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
            className="p-2 border border-white/10 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]"
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>

          <select
            value={offerFilter}
            onChange={e => setOfferFilter(e.target.value)}
            className="p-2 border border-white/10 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]"
          >
            <option value="">All Offer Types</option>
            {OFFERS_LIST.map(off => <option key={off} value={off}>{off}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 border border-white/10 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]"
          >
            <option value="">All CRM Statuses</option>
            {STATUSES.map(st => <option key={st} value={st} className="capitalize">{st}</option>)}
          </select>
        </div>

        {/* Brand List Table */}
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-navy-800 border border-white/10 h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="bg-navy-800 border border-white/10 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase">
                  <tr>
                    <th className="px-5 py-3">Company / Website</th>
                    <th className="px-5 py-3">Industry</th>
                    <th className="px-5 py-3">Contact Person</th>
                    <th className="px-5 py-3">Offers Provided</th>
                    <th className="px-5 py-3">Pipeline Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-gray-200">
                  {filteredCompanies.map(c => {
                    const parsed = parseNotes(c.notes)
                    return (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-white">{c.name}</div>
                          {c.website && (
                            <a
                              href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#0134BD] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Globe size={12} /> {c.website}
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-300">{c.industry || 'Local Brand'}</td>
                        <td className="px-5 py-4">
                          {c.contact_name ? (
                            <div>
                              <div className="text-slate-200 flex items-center gap-1"><User size={12} /> {c.contact_name}</div>
                              <div className="text-xs text-slate-400">{c.contact_email}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">No contact added</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {parsed.offers.map(off => (
                              <span key={off} className="bg-white/10 text-white border border-white/10 text-[10px] font-semibold px-2 py-0.5 rounded">
                                {off}
                              </span>
                            ))}
                            {parsed.offers.length === 0 && <span className="text-xs text-slate-500 italic">None</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[c.status] || 'bg-slate-500/20 text-slate-400'}`}>
                            {c.status || 'prospect'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {c.contact_email && (
                              <button
                                onClick={() => openOutreach(c)}
                                title="Contact Brand"
                                className="p-2 text-[#0134BD] bg-[#0134BD]/10 hover:bg-[#0134BD]/20 rounded-lg transition-colors"
                              >
                                <Mail size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => openEdit(c)}
                              title="Edit Brand"
                              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteId(c.id)}
                              title="Delete Brand"
                              className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredCompanies.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400 italic">
                        No targeted brands matched the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Save Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal.type === 'create' ? 'New Target Brand' : 'Edit Target Brand'}</h2>
              <button onClick={() => setModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Brand Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. FitLife Gym"
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]"
                  >
                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Pipeline Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD] capitalize"
                  >
                    {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Name</label>
                  <input
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Email</label>
                  <input
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="e.g. sponsor@brand.com"
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Website URL</label>
                <input
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="e.g. www.fitlifegym.com"
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Offer Types Provided</label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  {OFFERS_LIST.map(off => (
                    <label key={off} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={selectedOffers.includes(off)}
                        onChange={() => toggleOffer(off)}
                        className="rounded border-white/20 text-[#0134BD] bg-transparent focus:ring-0 focus:ring-offset-0"
                      />
                      {off}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={notesText}
                  onChange={e => setNotesText(e.target.value)}
                  placeholder="Add background notes or negotiation details here..."
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors">Save Brand Target</button>
            </div>
          </div>
        </div>
      )}

      {/* Outreach Message Composer Modal */}
      {outreachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setOutreachModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-1.5"><Mail size={18} className="text-[#0134BD]" /> Contact Brand Target</h2>
              <button onClick={() => setOutreachModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1">
                <div><span className="text-slate-400 font-semibold">To:</span> <span className="text-white">{outreachModal.contact_name}</span> ({outreachModal.contact_email})</div>
                <div><span className="text-slate-400 font-semibold">Brand:</span> <span className="text-white">{outreachModal.name}</span> • <span className="text-white">{outreachModal.industry}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Message Body</label>
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD] font-mono text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setOutreachModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button
                onClick={handleSendOutreach}
                disabled={sendingOutreach}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {sendingOutreach ? 'Sending...' : <><Send size={15} /> Send Pitch & Log Outreach</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Brand Target</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to remove this targeted brand? This action will permanently remove their records.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete Target</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
