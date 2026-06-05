import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">GBB</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg leading-none">Elite GBB</span>
                <span className="block text-xs text-slate-500 leading-none">ProCoach</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">The recruiting-readiness platform for elite girls basketball.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/watch" className="hover:text-white transition-colors">Watch Live</Link></li>
              <li><Link to="/browse" className="hover:text-white transition-colors">Browse Players</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/signup?role=coach" className="hover:text-white transition-colors">For Coaches</Link></li>
              <li><Link to="/signup?role=club_admin" className="hover:text-white transition-colors">For Clubs</Link></li>
              <li><Link to="/partner-onboarding" className="hover:text-white transition-colors">Partner With Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/audit" className="hover:text-white transition-colors">Recruit-Ready Audit</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">All Services</Link></li>
              <li><Link to="/workshops" className="hover:text-white transition-colors">Workshops</Link></li>
              <li><Link to="/nil-readiness" className="hover:text-white transition-colors">NIL Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/recruiting-readiness" className="hover:text-white transition-colors">Recruiting Guide</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/embed/docs" className="hover:text-white transition-colors">Embed Player</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>2026 Elite GBB / Hoop With Her. All rights reserved.</p>
          <p>Built for girls basketball families, coaches and programs.</p>
        </div>
      </div>
    </footer>
  )
}
