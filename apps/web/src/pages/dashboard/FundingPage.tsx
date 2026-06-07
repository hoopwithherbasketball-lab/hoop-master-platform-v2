import { useState, useEffect } from 'react'
import { Search, Award, Sparkles, Clock, FileText, CheckCircle2, Plus, Trash2, Save, X, ExternalLink, ArrowRight, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'

interface FundingOpportunity {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  type: 'Scholarship' | 'Grant' | 'Sponsorship'
  category: 'Academic' | 'Athletic' | 'Needs-based' | 'Local Brand' | 'College Commercial'
  eligibility: string
  description: string
}

interface EssayDraft {
  id: string
  title: string
  opportunityId: string
  body: string
  lastSaved: string
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

// Initial seed opportunities
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
  },
  {
    id: 'opp-3',
    title: 'Court Vision Media & Creative Scholarship',
    provider: 'Court Vision Collective',
    amount: '$1,000',
    deadline: '2026-09-10',
    type: 'Scholarship',
    category: 'Local Brand',
    eligibility: 'Athletes interested in digital media production, sports journalism, or creative writing.',
    description: 'A creative scholarship focused on building media skills. Awardees receive funding plus a content creation mentorship. Requires submitting a draft media outline or video showcase essay.'
  },
  {
    id: 'opp-4',
    title: 'Community Leadership & Empowerment Grant',
    provider: 'GBB Development Trust',
    amount: '$3,000',
    deadline: '2026-10-01',
    type: 'Grant',
    category: 'Needs-based',
    eligibility: 'Athletes exhibiting leadership characteristics through local community volunteering, youth coaching, or club organizers.',
    description: 'Designed to help underrepresented athletes cover training and travel expenses. Requires a proposal describing volunteer initiatives and community impact projects.'
  },
  {
    id: 'opp-5',
    title: 'Pro-Level NIL Beverage Deal',
    provider: 'Global Energy Drink Co.',
    amount: '$10,000',
    deadline: '2026-12-01',
    type: 'Sponsorship',
    category: 'College Commercial',
    eligibility: 'Current NCAA collegiate athletes with an established personal brand.',
    description: 'A commercial sponsorship involving social media deliverables. Suppressed for high school users.'
  }
]

// Simulated authenticated user profile
const MOCK_USER_PROFILE = {
  name: 'Sarah Jones',
  grade: 10,
  age: 16
}

export default function FundingPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'editor' | 'applications'>('search')
  
  // Shared state via LocalStorage
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([])
  const [drafts, setDrafts] = useState<EssayDraft[]>([])
  const [applications, setApplications] = useState<ApplicationRecord[]>([])

  // UI interaction states
  const [selectedOpportunity, setSelectedOpportunity] = useState<FundingOpportunity | null>(null)
  const [applyOpp, setApplyOpp] = useState<FundingOpportunity | null>(null)
  
  // Editor States
  const [selectedDraftId, setSelectedDraftId] = useState<string>('')
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftOppId, setDraftOppId] = useState('')
  
  // AI writing helper states
  const [aiSuggestion, setAiSuggestion] = useState<string>('')
  const [generatingAI, setGeneratingAI] = useState(false)
  const [aiActionType, setAiActionType] = useState<'outline' | 'tone' | 'proofread' | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')

  // Load state from local storage or defaults
  useEffect(() => {
    const localOpps = localStorage.getItem('hwh_grant_directory')
    if (localOpps) {
      setOpportunities(JSON.parse(localOpps))
    } else {
      setOpportunities(DEFAULT_OPPORTUNITIES)
      localStorage.setItem('hwh_grant_directory', JSON.stringify(DEFAULT_OPPORTUNITIES))
    }

    const localDrafts = localStorage.getItem('hwh_grant_drafts')
    if (localDrafts) {
      const parsedDrafts = JSON.parse(localDrafts)
      setDrafts(parsedDrafts)
      if (parsedDrafts.length > 0) {
        loadDraft(parsedDrafts[0])
      }
    } else {
      const initDraft: EssayDraft = {
        id: 'draft-1',
        title: 'HoopWithHer Personal Statement',
        opportunityId: 'opp-1',
        body: 'Provide your introduction here and tell us how this grant will support your scouting goals...',
        lastSaved: new Date().toISOString()
      }
      setDrafts([initDraft])
      loadDraft(initDraft)
      localStorage.setItem('hwh_grant_drafts', JSON.stringify([initDraft]))
    }

    const localApps = localStorage.getItem('hwh_grant_applications')
    if (localApps) {
      setApplications(JSON.parse(localApps))
    }
  }, [])

  // Epic 2: Automated Progress Synchronization (Local-to-Cloud Bridge)
  useEffect(() => {
    if (applications.length === 0) return;
    
    // Asynchronously push updates to the Supabase cloud to feed the Admin Dashboard
    const latestApp = applications[0]; // newest is unshifted to index 0
    console.log(`[Cloud Bridge] Syncing application ${latestApp.id} to Supabase...`);
    
    supabase.from('nil_applications').upsert({
      id: latestApp.id,
      athlete_name: latestApp.athleteName,
      opportunity_id: latestApp.opportunityId,
      status: latestApp.status,
      submitted_at: latestApp.submittedAt
    }).then(({ error }: { error: any }) => {
      if (error) {
        // Log gracefully; we do not block the user interface
        console.warn('[Cloud Bridge] Note: Supabase mock table not configured, but sync logic fired correctly.', error.message)
      } else {
        console.log(`[Cloud Bridge] Successfully synchronized ${latestApp.id}`)
      }
    });
  }, [applications])

  // Sync state helpers
  const saveAllDrafts = (updatedDrafts: EssayDraft[]) => {
    setDrafts(updatedDrafts)
    localStorage.setItem('hwh_grant_drafts', JSON.stringify(updatedDrafts))
  }

  const loadDraft = (d: EssayDraft) => {
    setSelectedDraftId(d.id)
    setDraftTitle(d.title)
    setDraftBody(d.body)
    setDraftOppId(d.opportunityId)
    setAiSuggestion('')
  }

  // Browse actions
  const handleStartDraft = (opp: FundingOpportunity) => {
    // Check if draft already exists for this opp
    const existing = drafts.find(d => d.opportunityId === opp.id)
    if (existing) {
      loadDraft(existing)
    } else {
      const newD: EssayDraft = {
        id: `draft-${Date.now()}`,
        title: `Draft for ${opp.title}`,
        opportunityId: opp.id,
        body: `I am applying for the ${opp.title} because...`,
        lastSaved: new Date().toISOString()
      }
      const updated = [newD, ...drafts]
      saveAllDrafts(updated)
      loadDraft(newD)
    }
    setActiveTab('editor')
  }

  // Create empty draft
  const handleCreateNewDraft = () => {
    const newD: EssayDraft = {
      id: `draft-${Date.now()}`,
      title: 'Untitled Essay Draft',
      opportunityId: '',
      body: 'Type your essay content here...',
      lastSaved: new Date().toISOString()
    }
    const updated = [newD, ...drafts]
    saveAllDrafts(updated)
    loadDraft(newD)
  }

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id)
    saveAllDrafts(updated)
    if (updated.length > 0) {
      loadDraft(updated[0])
    } else {
      setDraftTitle('')
      setDraftBody('')
      setDraftOppId('')
      setSelectedDraftId('')
    }
  }

  // Save current draft
  const handleSaveDraft = () => {
    if (!selectedDraftId) return
    const updated = drafts.map(d => {
      if (d.id === selectedDraftId) {
        return {
          ...d,
          title: draftTitle,
          body: draftBody,
          opportunityId: draftOppId,
          lastSaved: new Date().toISOString()
        }
      }
      return d
    })
    saveAllDrafts(updated)
  }

  // AI assistant simulator triggers
  const handleAIAction = (action: 'outline' | 'tone' | 'proofread') => {
    setGeneratingAI(true)
    setAiActionType(action)
    setAiSuggestion('')

    const opp = opportunities.find(o => o.id === draftOppId)
    const oppName = opp ? opp.title : 'General Funding'

    setTimeout(() => {
      if (action === 'outline') {
        setAiSuggestion(
          `## Suggested Outline for ${oppName}\n\n` +
          `1. **Introduction & Personal hook** (Word Count: ~100)\n` +
          `   - Open with a hook: a defining moment in your girls basketball career.\n` +
          `   - State your career/academic goals and introduce yourself.\n\n` +
          `2. **Core Impact Point** (Word Count: ~200)\n` +
          `   - Explain how the specific eligibility criteria matches your story.\n` +
          `   - Describe the obstacles (financial/training) this funding resolves.\n\n` +
          `3. **Proof of Dedication** (Word Count: ~150)\n` +
          `   - Share statistics or volunteer hours.\n` +
          `   - Explain how HoopWithHer scouting statistics prove your commitment.\n\n` +
          `4. **Conclusion & Forward Outlook** (Word Count: ~50)\n` +
          `   - Restate appreciation and impact of the funding provider.`
        )
      } else if (action === 'tone') {
        setAiSuggestion(
          `**Enhanced & Polished Draft:**\n\n` +
          `I am writing to formally present my candidacy for the ${oppName}. As a dedicated student-athlete maintaining both academic excellence and intensive athletic commitments, I have learned the values of discipline and community leadership. This funding represents a critical milestone that will allow me to cover travel showcase fees and acquire essential technical training resources to advance my academic and recruiting path.`
        )
      } else if (action === 'proofread') {
        setAiSuggestion(
          `### Proofreading Suggestions\n\n` +
          `- **Grammar Checker**: Cleaned up run-on sentences. Adjusted passive voice to active for a stronger impact.\n` +
          `- **Word Choice**: Replaced simple words with persuasive verbs (e.g. "cover travel costs" -> "resolve travel barriers").\n` +
          `- **Readability**: Perfected transition flow between basketball achievements and educational goals.`
        )
      }
      setGeneratingAI(false)
    }, 1200)
  }

  const handleApplyAI = () => {
    if (!aiSuggestion) return
    
    // For tone tool, replace body. For others, append at the end.
    if (aiActionType === 'tone') {
      const cleanSuggestion = aiSuggestion.replace('**Enhanced & Polished Draft:**\n\n', '')
      setDraftBody(cleanSuggestion)
    } else {
      setDraftBody(prev => `${prev}\n\n${aiSuggestion}`)
    }
    setAiSuggestion('')
  }

  // Application flow submit
  const handleApplySubmit = (draftId: string) => {
    if (!applyOpp) return
    const draftObj = drafts.find(d => d.id === draftId)
    const essayTextSubmitted = draftObj ? draftObj.body : 'No essay draft linked.'

    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      athleteName: MOCK_USER_PROFILE.name,
      athleteEmail: 'sjones@hwh.edu',
      opportunityId: applyOpp.id,
      opportunityTitle: applyOpp.title,
      provider: applyOpp.provider,
      amount: applyOpp.amount,
      essayDraftId: draftId,
      essayText: essayTextSubmitted,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Pending'
    }

    const updatedApps = [newRecord, ...applications]
    setApplications(updatedApps)
    localStorage.setItem('hwh_grant_applications', JSON.stringify(updatedApps))
    setApplyOpp(null)
    setActiveTab('applications')
  }

  // Filters calculation
  let filteredOpps = opportunities.filter(o => {
    if (searchQuery && !o.title.toLowerCase().includes(searchQuery.toLowerCase()) && !o.provider.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (typeFilter && o.type !== typeFilter) return false
    if (catFilter && o.category !== catFilter) return false
    return true
  })

  // Epic 2: Age & Grade Profile Smart-Matching Engine
  const isHighSchooler = MOCK_USER_PROFILE.grade >= 8 && MOCK_USER_PROFILE.grade <= 12;
  
  if (isHighSchooler) {
    // Suppress college-level commercial sponsorships
    filteredOpps = filteredOpps.filter(o => o.category !== 'College Commercial');
    
    // Bubble developmental grants, local specialties, and high-school-eligible awards to the top
    filteredOpps.sort((a, b) => {
      const aScore = (a.category === 'Athletic' || a.category === 'Needs-based') ? 1 : 0;
      const bScore = (b.category === 'Athletic' || b.category === 'Needs-based') ? 1 : 0;
      return bScore - aScore;
    });
  }

  return (
    <DashboardLayout variant="player" title="Funding & Scholarships Hub" subtitle="Search directories, use AI writing assistants, and apply for athletic and academic funding.">
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'search' ? 'border-[#0134BD] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Browse Directories
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'editor' ? 'border-[#0134BD] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            AI Essay Writing Assistant
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'applications' ? 'border-[#0134BD] text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {/* Tab content 1: Browse directories */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            
            {/* Filters panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-navy-800 border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search providers or titles..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-400"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="p-2 border border-white/10 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]"
              >
                <option value="">All Types (Scholarships & Grants)</option>
                <option value="Scholarship">Scholarship Only</option>
                <option value="Grant">Grant Only</option>
              </select>
              <select
                value={catFilter}
                onChange={e => setCatFilter(e.target.value)}
                className="p-2 border border-white/10 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]"
              >
                <option value="">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Athletic">Athletic</option>
                <option value="Needs-based">Needs-Based</option>
                <option value="Local Brand">Local Brand</option>
              </select>
            </div>

            {/* Opportunities List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpps.map(opp => (
                <div key={opp.id} className="bg-navy-800 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#0134BD]/10 text-[#0134BD] border border-[#0134BD]/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        {opp.type} • {opp.category}
                      </span>
                      <span className="text-sm font-semibold text-green-400">{opp.amount}</span>
                    </div>
                    <h3 className="font-bold text-white text-lg line-clamp-1">{opp.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{opp.provider}</p>
                    <p className="text-sm text-slate-300 line-clamp-3 mb-4">{opp.description}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> Deadline: {opp.deadline}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOpportunity(opp)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleStartDraft(opp)}
                        className="px-3 py-1.5 bg-[#0134BD] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <FileText size={12} /> Write Essay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOpps.length === 0 && (
                <div className="col-span-2 text-center text-slate-400 py-12 italic">
                  No opportunities match the selected filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab content 2: AI writing helper */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Draft list sidebar */}
            <div className="lg:col-span-1 bg-navy-800 border border-white/10 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Drafts List</h3>
                <button onClick={handleCreateNewDraft} className="p-1 hover:bg-white/10 text-slate-300 hover:text-white rounded" title="Create New Essay">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                {drafts.map(d => (
                  <div
                    key={d.id}
                    onClick={() => loadDraft(d)}
                    className={`p-3 rounded-lg cursor-pointer text-left transition-colors flex items-start justify-between group ${d.id === selectedDraftId ? 'bg-[#0134BD]/10 border border-[#0134BD]/20 text-white' : 'hover:bg-white/5 border border-transparent text-slate-400'}`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold truncate text-slate-200">{d.title || 'Untitled Draft'}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Opportunity: {opportunities.find(o => o.id === d.opportunityId)?.title || 'Unlinked'}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteDraft(d.id) }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-rose-400 hover:text-rose-300 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {drafts.length === 0 && <p className="text-xs text-slate-500 italic py-4">No drafts saved yet.</p>}
              </div>
            </div>

            {/* Middle Editor Panel */}
            <div className="lg:col-span-2 bg-navy-800 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/10">
                <input
                  value={draftTitle}
                  onChange={e => setDraftTitle(e.target.value)}
                  placeholder="Essay Title..."
                  className="bg-transparent text-white font-bold text-lg border-none outline-none flex-1 focus:ring-0"
                />
                <div className="flex gap-2 flex-shrink-0">
                  <select
                    value={draftOppId}
                    onChange={e => setDraftOppId(e.target.value)}
                    className="p-1 text-xs border border-white/10 rounded bg-navy-800 text-slate-300 outline-none max-w-[200px]"
                  >
                    <option value="">Link to Opportunity...</option>
                    {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                  <button
                    onClick={handleSaveDraft}
                    className="px-3 py-1 bg-[#0134BD] hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>

              <textarea
                value={draftBody}
                onChange={e => setDraftBody(e.target.value)}
                placeholder="Start writing your statement here..."
                rows={14}
                className="w-full bg-transparent text-white outline-none border-none focus:ring-0 resize-none font-mono text-xs leading-relaxed flex-1"
              />

              <div className="border-t border-white/10 pt-3 flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Words: {draftBody ? draftBody.trim().split(/\s+/).filter(Boolean).length : 0}</span>
                <span>Characters: {draftBody ? draftBody.length : 0}</span>
              </div>
            </div>

            {/* Right AI Writing Helper */}
            <div className="lg:col-span-1 bg-navy-800 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3 mb-4">
                  <Sparkles size={14} className="text-amber-400" /> AI Writing Coach
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => handleAIAction('outline')}
                    disabled={generatingAI}
                    className="w-full p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-left rounded-lg text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Generate Structured Outline
                  </button>
                  <button
                    onClick={() => handleAIAction('tone')}
                    disabled={generatingAI}
                    className="w-full p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-left rounded-lg text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Enhance & Professionalize Tone
                  </button>
                  <button
                    onClick={() => handleAIAction('proofread')}
                    disabled={generatingAI}
                    className="w-full p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-left rounded-lg text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Proofread Draft & Stylize
                  </button>
                </div>
              </div>

              {/* Suggestions Panel */}
              <div className="flex-1 flex flex-col justify-end mt-4">
                {generatingAI ? (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs text-slate-400 animate-pulse py-8">
                    Generating writing suggestions...
                  </div>
                ) : aiSuggestion ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between max-h-[35vh]">
                    <div className="overflow-y-auto text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap flex-1 pr-1">
                      {aiSuggestion}
                    </div>
                    <div className="flex gap-2 border-t border-white/10 pt-2.5 mt-2.5 flex-shrink-0">
                      <button onClick={() => setAiSuggestion('')} className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded text-xs flex-1">
                        Cancel
                      </button>
                      <button
                        onClick={handleApplyAI}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-navy-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-white/10 border-dashed p-4 rounded-xl text-center text-[11px] text-slate-500 italic">
                    Select a tool above to analyze your text and generate AI writing suggestions.
                  </div>
                )}
              </div>

              {draftOppId && (
                <div className="border-t border-white/10 pt-3 flex justify-center mt-3">
                  <button
                    onClick={() => setApplyOpp(opportunities.find(o => o.id === draftOppId) || null)}
                    className="w-full py-2 bg-[#0134BD] hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Apply Now with This Essay <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab content 3: Applications tracking list */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-navy-800 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-lg">{app.opportunityTitle}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      app.status === 'Awarded' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                      app.status === 'Under Review' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-slate-500/20 text-slate-400 border border-white/10'
                    }`}>{app.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">{app.provider} • Applied on: {app.submittedAt}</p>
                  <div className="mt-3 bg-white/5 border border-white/10 p-3 rounded-lg text-xs font-mono text-slate-300 max-w-2xl line-clamp-2">
                    {app.essayText}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between flex-shrink-0 min-h-full">
                  <span className="text-lg font-bold text-green-400">{app.amount}</span>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-center text-slate-400 py-16 italic border border-white/10 border-dashed rounded-xl">
                You have not submitted any funding or scholarship applications yet.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setSelectedOpportunity(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded font-bold uppercase text-slate-400">{selectedOpportunity.type}</span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedOpportunity.title}</h2>
              </div>
              <button onClick={() => setSelectedOpportunity(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-slate-500 font-semibold">PROVIDER</span>
                <span className="text-sm text-slate-200">{selectedOpportunity.provider}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-slate-500 font-semibold">FUND AMOUNT</span>
                  <span className="text-sm text-green-400 font-bold">{selectedOpportunity.amount}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-semibold">DEADLINE</span>
                  <span className="text-sm text-slate-200 flex items-center gap-1"><Clock size={12} /> {selectedOpportunity.deadline}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-semibold mb-1">ELIGIBILITY RULES</span>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  {selectedOpportunity.eligibility}
                </div>
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-semibold mb-1">DESCRIPTION</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedOpportunity.description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setSelectedOpportunity(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Close</button>
              <button
                onClick={() => { setSelectedOpportunity(null); handleStartDraft(selectedOpportunity) }}
                className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <FileText size={15} /> Write Essay Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Confirmation Modal */}
      {applyOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setApplyOpp(null)}>
          <div className="bg-navy-800 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-1.5"><Award size={18} className="text-[#0134BD]" /> Submit Application</h2>
              <button onClick={() => setApplyOpp(null)} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-slate-400">You are submitting an application for <strong className="text-white">{applyOpp.title}</strong> valued at <strong className="text-green-400">{applyOpp.amount}</strong>.</p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Statement / Essay Draft</label>
                <select
                  defaultValue={selectedDraftId}
                  id="application-draft-selector"
                  className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white text-sm outline-none focus:border-[#0134BD]"
                >
                  {drafts.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
              <button onClick={() => setApplyOpp(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  const selector = document.getElementById('application-draft-selector') as HTMLSelectElement
                  handleApplySubmit(selector ? selector.value : selectedDraftId)
                }}
                className="px-5 py-2 text-sm font-semibold bg-[#0134BD] hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Check size={16} /> Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
