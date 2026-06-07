import { useState, useMemo, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { CheckCircle, Search, ArrowUpDown, Shield, FileText, Check, Star, Award, Sparkles, AlertCircle } from 'lucide-react'

interface Brand {
  id: string
  name: string
  industry: string
  tier: 'Local' | 'Regional' | 'National'
  contactEmail: string
  status: 'Not Contacted' | 'Pitch Sent' | 'In Discussion' | 'Signed' | 'Declined'
  ncaaDisclosed: boolean
  parentSigned: boolean
  contractUploaded: boolean
  notes: string
}

const PRE_SEEDED_BRANDS: Brand[] = [
  // National Brands
  { id: '1', name: 'Celsius energy', industry: 'Beverage', tier: 'National', contactEmail: 'nil@celsius.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Active NIL sponsor for college and high school female athletes.' },
  { id: '2', name: 'Liquid I.V.', industry: 'Beverage', tier: 'National', contactEmail: 'sponsorships@liquid-iv.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Hydration brand with extensive lifestyle athlete networks.' },
  { id: '3', name: 'Gatorade', industry: 'Beverage', tier: 'National', contactEmail: 'nil-inquiries@pepsico.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Primary sports drink sponsor. Looks for top regional/national players.' },
  { id: '4', name: 'Nike Women', industry: 'Apparel', tier: 'National', contactEmail: 'nike.women.nil@nike.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Elite brand partner. Active in female basketball advocacy.' },
  { id: '5', name: 'Under Armour', industry: 'Apparel', tier: 'National', contactEmail: 'ua-female-nil@underarmour.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Focuses on performance-driven athletes.' },
  { id: '6', name: 'Adidas Women', industry: 'Apparel', tier: 'National', contactEmail: 'adidas-nil-inquiries@adidas.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Global footwear and apparel. Large female sport campaigns.' },
  { id: '7', name: 'Wilson Sporting Goods', industry: 'Sports Gear', tier: 'National', contactEmail: 'team-wilson-nil@wilson.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Official game ball supplier. Focus on athlete gear training campaigns.' },
  { id: '8', name: 'Spalding', industry: 'Sports Gear', tier: 'National', contactEmail: 'nil@spalding.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Basketball manufacturer. Looks for active court leaders.' },
  { id: '9', name: 'Celsius energy', industry: 'Beverage', tier: 'National', contactEmail: 'nil@celsius.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Active in energetic lifestyle female sports campaigns.' },
  { id: '10', name: 'Athleta', industry: 'Apparel', tier: 'National', contactEmail: 'athleta_nil@gap.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Empowerment-themed sportswear campaigns for female athletes.' },
  { id: '11', name: 'Lululemon', industry: 'Apparel', tier: 'National', contactEmail: 'ambassadors@lululemon.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Focuses on yoga, training, and holistic well-being athlete leaders.' },
  { id: '12', name: 'Celsius energy', industry: 'Beverage', tier: 'National', contactEmail: 'nil@celsius.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Lifestyle activations.' },
  { id: '13', name: 'Hera Swim', industry: 'Apparel', tier: 'National', contactEmail: 'sponsorship@heraswim.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Female-founded swimwear brand looking for summer lifestyle ambassadors.' },
  { id: '14', name: 'Gymshark Women', industry: 'Apparel', tier: 'National', contactEmail: 'nil-women@gymshark.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Active UGC fitness campaigns.' },
  { id: '15', name: 'Bose', industry: 'Technology', tier: 'National', contactEmail: 'bose-nil-teams@bose.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Audio gear (headphones). Looks for pre-game lifestyle content creators.' },
  
  // Regional Brands
  { id: '16', name: 'East Coast Sports Academy', industry: 'Fitness Studio', tier: 'Regional', contactEmail: 'collab@eastcoastsports.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Regional training center groups.' },
  { id: '17', name: 'Midwest Dairy Collective', industry: 'Beverage', tier: 'Regional', contactEmail: 'nil@midwestdairy.org', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Promotes healthy lifestyle milk and yogurt partnerships.' },
  { id: '18', name: 'Southern Peach Clean Eats', industry: 'Local Dining', tier: 'Regional', contactEmail: 'partner@peachcleaneats.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Healthy meal prep brand expanding in the Southeast.' },
  { id: '19', name: 'West Coast Power Gyms', industry: 'Fitness Studio', tier: 'Regional', contactEmail: 'info@westcoastpower.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Gym franchise focusing on youth athletics.' },
  { id: '20', name: 'Pacific Nutrition', industry: 'Health & Wellness', tier: 'Regional', contactEmail: 'marketing@pacnutri.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Smoothie and vitamin bars across CA, OR, and WA.' },
  { id: '21', name: 'Texas Lone Star Apparel', industry: 'Apparel', tier: 'Regional', contactEmail: 'collab@lonestarwear.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Cowboy and country-themed athletic wear.' },
  { id: '22', name: 'Rocky Mountain Gear', industry: 'Sports Gear', tier: 'Regional', contactEmail: 'sponsors@rockymountingear.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Outdoor and active gear brand in the mountain west.' },
  { id: '23', name: 'Great Lakes Hydration', industry: 'Beverage', tier: 'Regional', contactEmail: 'glh-nil@glh.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Mineral water brand in the Midwest region.' },
  { id: '24', name: 'Empire State Athletics', industry: 'Fitness Studio', tier: 'Regional', contactEmail: 'marketing@empireathletics.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Large sports performance brand in New York.' },
  { id: '25', name: 'Sunshine Smoothies', industry: 'Local Dining', tier: 'Regional', contactEmail: 'sunshine@smoothiepartners.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Organic juice and bowl shops in Florida.' },

  // Local/Specialty Brands
  { id: '26', name: 'Downtown Grind Coffee', industry: 'Local Dining', tier: 'Local', contactEmail: 'grind@downtown.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local coffee spot looking for student-athlete morning story takeovers.' },
  { id: '27', name: 'City Edge Training Lab', industry: 'Fitness Studio', tier: 'Local', contactEmail: 'coach@cityedgelab.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Boutique personal training studio offering free memberships for posts.' },
  { id: '28', name: 'Gloss & Glow Salons', industry: 'Beauty & Cosmetics', tier: 'Local', contactEmail: 'collabs@glossglow.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local hair and nail beauty salon.' },
  { id: '29', name: 'FitFood Bistro', industry: 'Local Dining', tier: 'Local', contactEmail: 'bistro@fitfood.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Healthy meal prep local cafe.' },
  { id: '30', name: 'Main Street Physio', industry: 'Health & Wellness', tier: 'Local', contactEmail: 'recovery@mainstreetphysio.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Sports recovery and massage clinic. Offers free recovery treatments.' },
  { id: '31', name: 'NextGen Orthotics', industry: 'Health & Wellness', tier: 'Local', contactEmail: 'support@nextgenortho.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Custom shoe inserts and running assessments.' },
  { id: '32', name: 'Boutique Clean Skincare', industry: 'Beauty & Cosmetics', tier: 'Local', contactEmail: 'clean@cleanskincare.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Vegan skincare products seeking student-athlete skin routines.' },
  { id: '33', name: 'The Local Burger Co', industry: 'Local Dining', tier: 'Local', contactEmail: 'eats@localburger.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Family restaurant supporting local youth sports teams.' },
  { id: '34', name: 'Elite Performance Gym', industry: 'Fitness Studio', tier: 'Local', contactEmail: 'elite@performgym.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local gym. Offers brand apparel models deals.' },
  { id: '35', name: 'Downtown Lash Bar', industry: 'Beauty & Cosmetics', tier: 'Local', contactEmail: 'lashes@lashbar.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local lash extension beauty spot.' },
  { id: '36', name: 'Green Garden Cafe', industry: 'Local Dining', tier: 'Local', contactEmail: 'green@gardencafe.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Salad and green bowl local dining spot.' },
  { id: '37', name: 'Sprout Wellness Co', industry: 'Health & Wellness', tier: 'Local', contactEmail: 'hello@sproutwell.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local vitamin shops supporting girls sports teams.' },
  { id: '38', name: 'Vibe Yoga Studio', industry: 'Fitness Studio', tier: 'Local', contactEmail: 'vibe@vibeyoga.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Yoga and mindfulness local studios.' },
  { id: '39', name: 'Bounce Basketball Club', industry: 'Sports Gear', tier: 'Local', contactEmail: 'admin@bounceclub.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local club training. Gear showcase campaigns.' },
  { id: '40', name: 'Apex Sports Recovery', industry: 'Health & Wellness', tier: 'Local', contactEmail: 'apex@sportsrecovery.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Cryotherapy and cold plunges local facility.' },
  { id: '41', name: 'The Protein Shake Bar', industry: 'Local Dining', tier: 'Local', contactEmail: 'shake@proteinbar.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Shake and protein smoothie cafe near local schools.' },
  { id: '42', name: 'Luxe Hair Care', industry: 'Beauty & Cosmetics', tier: 'Local', contactEmail: 'luxe@haircare.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Salon hair products looking for after-game hair routine reviews.' },
  { id: '43', name: 'Precision Sports Physio', industry: 'Health & Wellness', tier: 'Local', contactEmail: 'physio@precision.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Sports health and physical rehabilitation.' },
  { id: '44', name: 'Local Organic Juice', industry: 'Beverage', tier: 'Local', contactEmail: 'juice@localorganic.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Cold pressed organic fruit juices.' },
  { id: '45', name: 'True Beauty Boutique', industry: 'Beauty & Cosmetics', tier: 'Local', contactEmail: 'true@beautyboutique.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Organic beauty cosmetic products.' },
  { id: '46', name: 'Gameday Socks Co', industry: 'Apparel', tier: 'Local', contactEmail: 'socks@gamedaysocks.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Custom athletic athletic socks maker.' },
  { id: '47', name: 'The Run Lab', industry: 'Sports Gear', tier: 'Local', contactEmail: 'run@runlab.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Local running shoes shop.' },
  { id: '48', name: 'Flex Gym Essentials', industry: 'Sports Gear', tier: 'Local', contactEmail: 'essentials@flexgym.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Lifting belts, chalk, and recovery rollers maker.' },
  { id: '49', name: 'Fit & Healthy Prep', industry: 'Local Dining', tier: 'Local', contactEmail: 'prep@fithealthy.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Macro-calculated meal prep café.' },
  { id: '50', name: 'Core Pilates Lab', industry: 'Fitness Studio', tier: 'Local', contactEmail: 'pilates@corelab.com', status: 'Not Contacted', ncaaDisclosed: false, parentSigned: false, contractUploaded: false, notes: 'Reformer Pilates class packs deals.' }
]

export default function NILRoadmapPage() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'outreach'>('roadmap')
  const [activeGrade, setActiveGrade] = useState<'6-8' | '9-12' | 'beyond'>('6-8')
  const [brands, setBrands] = useState<Brand[]>([])
  
  // Search and Sort
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'industry' | 'status'>('name')
  const [sortAsc, setSortAsc] = useState(true)

  // Load / Seed state
  useEffect(() => {
    const stored = localStorage.getItem('hwh_nil_roadmap_brands')
    if (stored) {
      setBrands(JSON.parse(stored))
    } else {
      localStorage.setItem('hwh_nil_roadmap_brands', JSON.stringify(PRE_SEEDED_BRANDS))
      setBrands(PRE_SEEDED_BRANDS)
    }
  }, [])

  const updateBrand = (updated: Brand) => {
    const newBrands = brands.map(b => b.id === updated.id ? updated : b)
    setBrands(newBrands)
    localStorage.setItem('hwh_nil_roadmap_brands', JSON.stringify(newBrands))
  }

  // Phased Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('hwh_nil_roadmap_checklist')
    return stored ? JSON.parse(stored) : {}
  })

  const toggleCheck = (id: string) => {
    const next = { ...checklist, [id]: !checklist[id] }
    setChecklist(next)
    localStorage.setItem('hwh_nil_roadmap_checklist', JSON.stringify(next))
  }

  // Sorting and filtering
  const handleSort = (field: 'name' | 'industry' | 'status') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(field)
      setSortAsc(true)
    }
  }

  const sortedAndFilteredBrands = useMemo(() => {
    return brands
      .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   b.industry.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'name') comp = a.name.localeCompare(b.name)
        if (sortBy === 'industry') comp = a.industry.localeCompare(b.industry)
        if (sortBy === 'status') comp = a.status.localeCompare(b.status)
        return sortAsc ? comp : -comp
      })
  }, [brands, searchQuery, sortBy, sortAsc])

  return (
    <DashboardLayout 
      variant="player"
      title="Family NIL Roadmap" 
      subtitle="Phased branding roadmap and outreach dashboard specifically curated for female student-athletes"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-[3px] ${
              activeTab === 'roadmap' 
                ? 'border-[#0134BD] text-white' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Roadmap Checklist
          </button>
          <button
            onClick={() => setActiveTab('outreach')}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-[3px] ${
              activeTab === 'outreach' 
                ? 'border-[#0134BD] text-white' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Brand Outreach Tracker
          </button>
        </div>

        {activeTab === 'roadmap' ? (
          <div className="space-y-6">
            {/* Grade Tabs */}
            <div className="flex gap-1.5 bg-navy-800 p-1 rounded-xl border border-white/5 w-fit">
              {[
                { id: '6-8', label: 'Middle School (Grades 6-8)' },
                { id: '9-12', label: 'High School (Grades 9-12)' },
                { id: 'beyond', label: 'College & Beyond (Commercial)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGrade(tab.id as any)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeGrade === tab.id 
                      ? 'bg-[#0134BD] text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Phased Checklist Body */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                {activeGrade === '6-8' && (
                  <div className="space-y-3">
                    <div className="card bg-navy-800 p-5 space-y-2 border border-white/5">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Sparkles size={18} />
                        <h4 className="font-bold text-sm">Building Foundations (Grades 6-8)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        At this stage, building a brand is not about signing corporate commercial contracts. It is about values, sportsmanship, and safe, parental-guided storytelling.
                      </p>
                    </div>

                    {[
                      { id: 'ms_1', title: 'Define Core Values', desc: 'Identify 3 qualities outside of your sport that represent you (e.g. community service, academics, fashion).' },
                      { id: 'ms_2', title: 'Establish Parent-Managed Profiles', desc: 'Secure handle reserves on Instagram & TikTok. Keep profiles private or strictly parent-supervised.' },
                      { id: 'ms_3', title: 'Action Photography Collection', desc: 'Start building a private library of high-resolution action photos from local games.' },
                      { id: 'ms_4', title: 'NCAA Compliance Onboarding', desc: 'Understand that middle school athletes must preserve amateur eligibility under state athletic associations.' },
                    ].map(item => (
                      <div key={item.id} className="card p-4 flex gap-3 items-start hover:border-white/10 transition-colors">
                        <button onClick={() => toggleCheck(item.id)} className="mt-0.5">
                          {checklist[item.id] ? (
                            <CheckCircle size={20} className="text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-blue-400 transition-colors" />
                          )}
                        </button>
                        <div>
                          <h5 className="font-bold text-white text-xs">{item.title}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeGrade === '9-12' && (
                  <div className="space-y-3">
                    <div className="card bg-navy-800 p-5 space-y-2 border border-white/5">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Star size={18} />
                        <h4 className="font-bold text-sm">Growth & Engagement (Grades 9-12)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        High school is where you transition to public content. Focus on authentic storytelling, highlight reels, and clean digital footprints.
                      </p>
                    </div>

                    {[
                      { id: 'hs_1', title: 'Digital Footprint Review', desc: 'Audit old posts. Ensure all content is professional, positive, and represents your school values.' },
                      { id: 'hs_2', title: 'Develop Content Pillars', desc: 'Create a weekly posting routine: 1 post about training, 1 personal story, 1 academic highlight.' },
                      { id: 'hs_3', title: 'Draft standard Media Kit', desc: 'Assemble a 1-page PDF showing your height, position, stats, school highlights, and audience reach.' },
                      { id: 'hs_4', title: 'Study High School Association Rules', desc: 'Check if your specific State High School Athletic Association (NFHS) allows high schoolers to earn NIL income.' },
                    ].map(item => (
                      <div key={item.id} className="card p-4 flex gap-3 items-start hover:border-white/10 transition-colors">
                        <button onClick={() => toggleCheck(item.id)} className="mt-0.5">
                          {checklist[item.id] ? (
                            <CheckCircle size={20} className="text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-blue-400 transition-colors" />
                          )}
                        </button>
                        <div>
                          <h5 className="font-bold text-white text-xs">{item.title}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeGrade === 'beyond' && (
                  <div className="space-y-3">
                    <div className="card bg-navy-800 p-5 space-y-2 border border-white/5">
                      <div className="flex items-center gap-2 text-[#C8A24A]">
                        <Award size={18} />
                        <h4 className="font-bold text-sm">Commercialization & Legal Hardening</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        College and commercialization stages. Establish legal entities, secure representative agreements, and file compliance reports.
                      </p>
                    </div>

                    {[
                      { id: 'coll_1', title: 'Setup LLC & Separate Banking', desc: 'Incorporate a business entity (e.g. Single Member LLC) to separate personal funds from NIL revenue.' },
                      { id: 'coll_2', title: 'Standardize Disclosure Filing', desc: 'Every contract must be reported to the school compliance portal within 14 days of execution.' },
                      { id: 'coll_3', title: 'Quarterly Tax Withholding Plan', desc: 'Set aside 30% of cash deal earnings into a separate tax vault account for 1099 filing.' },
                      { id: 'coll_4', title: 'Select Legal Representative / Agency', desc: 'Review agency contracts carefully. Ensure representation clauses do not tie up long-term future athletic fees.' },
                    ].map(item => (
                      <div key={item.id} className="card p-4 flex gap-3 items-start hover:border-white/10 transition-colors">
                        <button onClick={() => toggleCheck(item.id)} className="mt-0.5">
                          {checklist[item.id] ? (
                            <CheckCircle size={20} className="text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-blue-400 transition-colors" />
                          )}
                        </button>
                        <div>
                          <h5 className="font-bold text-white text-xs">{item.title}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Info Card */}
              <div className="space-y-4">
                <div className="card bg-[#0134BD]/10 border border-[#0134BD]/20 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <Shield className="text-[#0134BD]" size={20} />
                    <h4 className="font-bold text-sm">Legal & Compliance Alert</h4>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-2 leading-relaxed">
                    <p><strong>NCAA Policy Rules:</strong> NIL earnings must be based on a market value transaction. Compensation cannot be tied to athletic performance parameters or high-school recruitment offers.</p>
                    <p><strong>Parent Guardrails:</strong> High school and middle school athletes under 18 years old require parents to execute agency, brand outreach, or commercial contracts on their behalf.</p>
                  </div>
                  <div className="bg-slate-900 border border-white/5 p-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-amber-400 flex-shrink-0" size={14} />
                    <span className="text-[10px] text-slate-400 leading-snug">Ensure that you register every contract in the disclosure log before commencing campaign posts.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search and summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-navy-800 p-4 rounded-xl border border-white/5">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search 50+ female brand matches..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {sortedAndFilteredBrands.length} target brands matching criteria
              </div>
            </div>

            {/* Brands Outreach Table */}
            <div className="bg-navy-800 border border-white/10 rounded-xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-white/5 border-b border-white/10 text-[10px] font-semibold text-slate-400 uppercase">
                    <tr>
                      <th onClick={() => handleSort('name')} className="px-4 py-3 cursor-pointer hover:bg-white/5 select-none">
                        <span className="flex items-center gap-1">Brand Name <ArrowUpDown size={12} /></span>
                      </th>
                      <th onClick={() => handleSort('industry')} className="px-4 py-3 cursor-pointer hover:bg-white/5 select-none">
                        <span className="flex items-center gap-1">Industry <ArrowUpDown size={12} /></span>
                      </th>
                      <th className="px-4 py-3">Tier</th>
                      <th onClick={() => handleSort('status')} className="px-4 py-3 cursor-pointer hover:bg-white/5 select-none">
                        <span className="flex items-center gap-1">Outreach Status <ArrowUpDown size={12} /></span>
                      </th>
                      <th className="px-4 py-3 text-center">Compliance Checks</th>
                      <th className="px-4 py-3">Quick Pitch Contacts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {sortedAndFilteredBrands.map(b => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-white block">{b.name}</span>
                          <span className="text-[10px] text-slate-500 block max-w-[200px] truncate">{b.notes}</span>
                        </td>
                        <td className="px-4 py-3.5">{b.industry}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            b.tier === 'Local' ? 'bg-blue-500/10 text-blue-400' :
                            b.tier === 'Regional' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {b.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <select 
                            value={b.status} 
                            onChange={e => updateBrand({ ...b, status: e.target.value as any })}
                            className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-[11px] outline-none"
                          >
                            <option value="Not Contacted">Not Contacted</option>
                            <option value="Pitch Sent">Pitch Sent</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Signed">Signed</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-center items-center gap-3">
                            <button 
                              onClick={() => updateBrand({ ...b, ncaaDisclosed: !b.ncaaDisclosed })}
                              title="NCAA Disclosure Filed"
                              className={`p-1 rounded flex items-center justify-center border transition-colors ${
                                b.ncaaDisclosed ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-transparent border-slate-700 text-slate-600'
                              }`}
                            >
                              <FileText size={13} />
                              <span className="text-[9px] ml-1 font-bold">NCAA</span>
                            </button>

                            <button 
                              onClick={() => updateBrand({ ...b, parentSigned: !b.parentSigned })}
                              title="Parent Guardian Consent"
                              className={`p-1 rounded flex items-center justify-center border transition-colors ${
                                b.parentSigned ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-transparent border-slate-700 text-slate-600'
                              }`}
                            >
                              <Check size={13} />
                              <span className="text-[9px] ml-1 font-bold">PARENT</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <a 
                            href={`mailto:${b.contactEmail}?subject=NIL%20Branding%20Ambassador%20Inquiry`}
                            className="bg-[#0134BD] hover:bg-blue-700 text-white px-2.5 py-1 rounded font-bold text-[10px] inline-block transition-colors"
                          >
                            Send Email
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
