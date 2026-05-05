import React from 'react'
import { User, Star, Instagram, Twitter } from 'lucide-react'

export default function AthleteNILProfileList() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Athlete NIL Profiles</h1>
        <p className="text-slate-500 text-sm">Athletes opted into NIL matchmaking.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Sarah Jenkins', pos: 'PG', classYr: 2026, followers: '12.4K', readiness: 88, tier: 'Gold' },
          { name: 'Maya Thompson', pos: 'SG/SF', classYr: 2027, followers: '8.1K', readiness: 74, tier: 'Silver' },
          { name: 'Jordan Lee', pos: 'C', classYr: 2026, followers: '5.2K', readiness: 62, tier: 'Bronze' },
        ].map((a, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-royal-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-sm">{a.name[0]}</div>
              <div><p className="font-bold text-navy-900 text-sm">{a.name}</p><p className="text-[11px] text-slate-400">{a.pos} | Class of {a.classYr}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-slate-50 rounded p-1.5"><p className="text-[10px] text-slate-400">Followers</p><p className="text-xs font-bold text-navy-900">{a.followers}</p></div>
              <div className="bg-slate-50 rounded p-1.5"><p className="text-[10px] text-slate-400">Readiness</p><p className="text-xs font-bold text-navy-900">{a.readiness}%</p></div>
              <div className="bg-slate-50 rounded p-1.5"><p className="text-[10px] text-slate-400">Tier</p><p className="text-xs font-bold text-navy-900">{a.tier}</p></div>
            </div>
            <button className="w-full text-xs font-bold text-royal-600 bg-royal-50 py-1.5 rounded hover:bg-royal-100 transition-colors">View Full Profile</button>
          </div>
        ))}
      </div>
    </div>
  )
}
