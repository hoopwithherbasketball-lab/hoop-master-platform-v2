import React from 'react'
import { Plus, Clock, AlertTriangle } from 'lucide-react'

export default function TaskBoard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-end"><div><h1 className="text-2xl font-bold text-navy-900">Tasks & Follow-ups</h1><p className="text-slate-500 text-sm">Action items for NIL and outreach operations.</p></div><button className="flex items-center gap-2 px-3 py-1.5 bg-royal-600 text-white rounded text-sm font-medium hover:bg-royal-700"><Plus size={16}/>New Task</button></header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{label:'To Do',tasks:[{title:'Research Local Beverage Brands',target:'Company',priority:'medium',due:'May 10'},{title:'Update Sarah Media Kit',target:'Sarah Jenkins',priority:'high',due:'Today'}]},{label:'In Progress',tasks:[{title:'Nike Contract Review',target:'Compliance',priority:'urgent',due:'Tomorrow'}]},{label:'Completed',tasks:[{title:'Initial Email to Gatorade',target:'Outreach',priority:'low',due:'Done'}]}].map((col)=>(
          <div key={col.label} className="space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-royal-400">{col.label} ({col.tasks.length})</h2>
            <div className="space-y-3">{col.tasks.map((task,i)=>(
              <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-royal-200 transition-all">
                <div className="flex items-start justify-between mb-2"><span className="text-[10px] font-bold text-royal-600 uppercase bg-royal-50 px-1.5 py-0.5 rounded">{task.target}</span>{task.priority==='urgent'&&<AlertTriangle size={12} className="text-rose-500"/>}</div>
                <h3 className="text-sm font-bold text-navy-900 mb-3">{task.title}</h3>
                <div className="flex justify-between items-center"><div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase"><Clock size={10}/>{task.due}</div></div>
              </div>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
