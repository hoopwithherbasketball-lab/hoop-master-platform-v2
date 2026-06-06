import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Eye, Clock, Search, Award, Check } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'

interface FundingOpportunity {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  type: 'Scholarship' | 'Grant'
  category: 'Academic' | 'Athletic' | 'Needs-based' | 'Local Brand'
  eligibility: string
  description: string
}

interface ApplicationRecord {
  id: string
  athleteName: string
  athleteEmail: string
  opportunityId: string
  opportunityTitle: string
  provider: string
  amount: string
  essayDraftId: string
  essayText: string
  submittedAt: string
  status: 'Pending' | 'Under Review' | 'Awarded' | 'Rejected'
}

const DEFAULT_OPPORTUNITIES: FundingOpportunity[] = [
  {
    id: 'opp-1',
    title: 'HoopWithHer Athletic Excellence Grant',
    provider: 'HoopWithHer Foundation',
    amount: '$2,500',
    deadline: '2026-08-15',
    type: 'Grant',
    category: 'Athletic',
    eligibility: 'High school girls basketball players (Class of 2026-2029) with D1/D2 recruiting potential.',
    description: 'A fund dedicated to supporting travel club team costs, training fees, and showcase registration expenses for outstanding female basketball student-athletes.'
  },
  {
    id: 'opp-2',
    title: 'NextGen Academic-Athlete Scholarship',
    provider: 'NextGen Nutrition Brand',
    amount: '$1,500',
    deadline: '2026-07-30',
    type: 'Scholarship',
    category: 'Academic',
    eligibility: 'Student-athletes maintaining a GPA of 3.5 or higher who demonstrate excellence on the court and in the classroom.',
    description: 'Sponsored by NextGen Nutrition, this scholarship supports tuition costs for higher education. Requires a 500-word essay on balancing academic rigor with high-level sports training.'
  }
]

export default function AdminFundingPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'applications'>('directory')

  // Shared state via LocalStorage
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([])
  const [applications, setApplications] = useState<ApplicationRecord[]>([])

  // Modal interactions
  const [oppModal, setOppModal] = useState<{ type: 'create' | 'edit'; opportunity?: any } | null>(null)
  const [viewApp, setViewApp] = useState<ApplicationRecord | null>(null)
  const [deleteOppId, setDeleteOppId] = useState<string | null>(null)

  // Listing fields
  const [title, setTitle] = useState('')
  const [provider, setProvider] = useState('')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [type, setType] = useState<'Scholarship' | 'Grant'>('Scholarship')
  const [category, setCategory] = useState<'Academic' | 'Athletic' | 'Needs-based' | 'Local Brand'>('Academic')
  const [eligibility, setEligibility] = useState('')
  const [description, setDescription] = useState('')

  // Filtering / Search
  const [oppSearch, setOppSearch] = useState('')
  const [appSearch, setAppSearch] = useState('')

  // Load from local storage
  useEffect(() => {
    const localOpps = localStorage.getItem('hwh_grant_directory')
    if (localOpps) {
      setOpportunities(JSON.parse(localOpps))
    } else {
      setOpportunities(DEFAULT_OPPORTUNITIES)
      localStorage.setItem('hwh_grant_directory', JSON.stringify(DEFAULT_OPPORTUNITIES))
    }

    const localApps = localStorage.getItem('hwh_grant_applications')
    if (localApps) {
      setApplications(JSON.parse(localApps))
    }
  }, [])

  // Sync directory
  const saveOpportunities = (updated: FundingOpportunity[]) => {
    setOpportunities(updated)
    localStorage.setItem('hwh_grant_directory', JSON.stringify(updated))
  }

  // Sync applications status
  const saveApplications = (updated: ApplicationRecord[]) => {
    setApplications(updated)
    localStorage.setItem('hwh_grant_applications', JSON.stringify(updated))
  }

  const openCreateOpp = () => {
    setTitle('')
    setProvider('')
    setAmount('')
    setDeadline('')
    setType('Scholarship')
    setCategory('Academic')
    setEligibility('')
    setDescription('')
    setOppModal({ type: 'create' })
  }

  const openEditOpp = (opp: FundingOpportunity) => {
    setTitle(opp.title)
    setProvider(opp.provider)
    setAmount(opp.amount)
    setDeadline(opp.deadline)
    setType(opp.type)
    setCategory(opp.category)
    setEligibility(opp.eligibility)
    setDescription(opp.description)
    setOppModal({ type: 'edit', opportunity: opp })
  }

  const handleSaveOpp = () => {
    if (!title.trim() || !provider.trim()) return

    const payload: FundingOpportunity = {
      id: oppModal?.type === 'edit' ? oppModal.opportunity.id : `opp-${Date.now()}`,
      title,
      provider,
      amount,
      deadline,
      type,
      category,
      eligibility,
      description
    }

    let updated: FundingOpportunity[] = []
    if (oppModal?.type === 'create') {
      updated = [payload, ...opportunities]
    } else {
      updated = opportunities.map(o => o.id === payload.id ? payload : o)
    }

    saveOpportunities(updated)
    setOppModal(null)
  }

  const handleDeleteOpp = (id: string) => {
    const updated = opportunities.filter(o => o.id !== id)
    saveOpportunities(updated)
    setDeleteOppId(null)
  }

  const handleUpdateAppStatus = (appId: string, status: 'Pending' | 'Under Review' | 'Awarded' | 'Rejected') => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        return { ...app, status }
      }
      return app
    })
    saveApplications(updated)
    if (viewApp && viewApp.id === appId) {
      setViewApp({ ...viewApp, status })
    }
  }

  // Filter lists
  const filteredOpps = opportunities.filter(o =>
    o.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
    o.provider.toLowerCase().includes(oppSearch.toLowerCase())
  )

  const filteredApps = applications.filter(app =>
    app.athleteName.toLowerCase().includes(appSearch.toLowerCase()) ||
    app.opportunityTitle.toLowerCase().includes(appSearch.toLowerCase())
  )

  return (
    <DashboardLayout
      variant="admin"
      title="Grants & Funding Management"
      subtitle="Manage the scholarship and grant directories and review submissions from student-athletes."
      action={
        activeTab === 'directory' && (
          <button
            onClick={openCreateOpp}
            className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> Add Opportunity
          </button>
        )
      }
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'directory' ? 'border-[#0134BD] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Manage Directory ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'applications' ? 'border-[#0134BD] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Submissions Log ({applications.length})
          </button>
        </div>

        {/* Tab 1: Manage directory */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            
            {/* Search filter */}
            <div className="flex items-center gap-2 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 max-w-md">
              <Search size={16} className="text-slate-400" />
              <input
                value={oppSearch}
                onChange={e => setOppSearch(e.target.value)}
                placeholder="Search directory..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-400"
              />
            </div>

            {/* Opportunities Table */}
            <div className="bg-navy-800 border border-white/10 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase">
                    <tr>
                      <th className="px-5 py-3">Title / Provider</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Deadline</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-gray-200">
                    {filteredOpps.map(opp => (
                      <tr key={opp.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{opp.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{opp.provider}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{opp.type}</td>
                        <td className="px-5 py-4 text-slate-300">{opp.category}</td>
                        <td className="px-5 py-4 font-bold text-green-400">{opp.amount}</td>
                        <td className="px-5 py-4 text-slate-400 flex items-center gap-1 mt-1.5"><Clock size={12} /> {opp.deadline}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEditOpp(opp)}
                              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                              title="Edit Opportunity"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteOppId(opp.id)}
                              className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
                              title="Delete Opportunity"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOpps.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400 italic">
                          No opportunities logged in the directory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Submissions log */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            
            {/* Search filter */}
            <div className="flex items-center gap-2 bg-navy-800 border border-white/10 rounded-lg px-3 py-2 max-w-md">
              <Search size={16} className="text-slate-400" />
              <input
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Search athlete submissions..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-400"
              />
            </div>

            {/* Applications Table */}
            <div className="bg-navy-800 border border-white/10 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold text-slate-400 uppercase">
                    <tr>
                      <th className="px-5 py-3">Athlete</th>
                      <th className="px-5 py-3">Opportunity</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Date Applied</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-gray-200">
                    {filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{app.athleteName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{app.athleteEmail}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-slate-200">{app.opportunityTitle}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{app.provider}</div>
                        </td>
                        <td className="px-5 py-4 text-green-400 font-bold">{app.amount}</td>
                        <td className="px-5 py-4 text-slate-400">{app.submittedAt}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                            app.status === 'Awarded' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                            app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                            app.status === 'Under Review' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-slate-500/20 text-slate-400 border border-white/10'
                          }`}>{app.status}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setViewApp(app)}
                            className="p-2 text-[#0134BD] bg-[#0134BD]/10 hover:bg-[#0134BD]/20 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                          >
                            <Eye size={14} /> Review Essay
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400 italic">
                          No student-athlete submissions logged.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Opportunity Creation/Editing Modal */}
      {oppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setOppModal(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{oppModal.type === 'create' ? 'New Opportunity Listing' : 'Edit Opportunity Listing'}</h2>
              <button onClick={() => setOppModal(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Opportunity Title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Community Leadership Grant"
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Provider / Host *</label>
                  <input
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                    placeholder="e.g. GBB Collective"
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Grant / Scholarship Amount</label>
                  <input
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="e.g. $2,000"
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]"
                  >
                    <option value="Scholarship">Scholarship</option>
                    <option value="Grant">Grant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Needs-based">Needs-Based</option>
                    <option value="Local Brand">Local Brand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Eligibility Criteria</label>
                <textarea
                  rows={2}
                  value={eligibility}
                  onChange={e => setEligibility(e.target.value)}
                  placeholder="Describe GPA, class year, sports, or regional restrictions..."
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD] resize-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide a general summary of the funding purpose and objectives..."
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-white/5 text-white outline-none focus:border-[#0134BD] resize-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setOppModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSaveOpp} className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors">Publish Opportunity</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {viewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setViewApp(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">{viewApp.athleteName}</h2>
                <p className="text-xs text-slate-400">Application Essay Review</p>
              </div>
              <button onClick={() => setViewApp(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-xs space-y-1">
                <div><span className="text-slate-500">Applying For:</span> <span className="text-white font-semibold">{viewApp.opportunityTitle}</span></div>
                <div><span className="text-slate-500">Provider:</span> <span className="text-white font-semibold">{viewApp.provider}</span></div>
                <div><span className="text-slate-500">Amount:</span> <span className="text-green-400 font-bold">{viewApp.amount}</span></div>
                <div><span className="text-slate-500">Submitted:</span> <span className="text-slate-300">{viewApp.submittedAt}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Personal Essay Statement</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 max-h-60 overflow-y-auto text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewApp.essayText}
                </div>
              </div>

              {/* Status Update controls */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Set Application Review Decision</label>
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={() => handleUpdateAppStatus(viewApp.id, 'Under Review')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 ${viewApp.status === 'Under Review' ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(viewApp.id, 'Awarded')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 ${viewApp.status === 'Awarded' ? 'bg-green-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                  >
                    Awarded
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(viewApp.id, 'Rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 ${viewApp.status === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setViewApp(null)} className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors">Close Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Opportunity Modal */}
      {deleteOppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setDeleteOppId(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Delete Opportunity</h2>
            <p className="text-sm text-slate-400 mb-5">Are you sure you want to remove this opportunity from the directory? This will not remove already logged application records.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteOppId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDeleteOpp(deleteOppId)} className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete Opportunity</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
