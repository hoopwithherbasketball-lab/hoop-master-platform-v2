import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Define the interface based on our new joined query
interface EvaluationRecord {
  id: string;
  name: string;
  position: string;
  class: number | string;
  overall: string;
  recommendation: string;
  athleticism: number;
  skill: number;
  iq: number;
  status: string;
}

export default function EliteGBBDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRec, setFilterRec] = useState<string | null>(null);
  const [evals, setEvals] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvals() {
      setLoading(true);
      // Fetch evaluations and join with intake_submissions to get player details
      const { data, error } = await supabase
        .from('coach_evaluations')
        .select(`
          id,
          athleticism_score,
          skill_score,
          iq_score,
          overall_grade,
          recommendation,
          status,
          intake_submissions (
            player_name,
            primary_position,
            grad_class
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching evaluations:', error);
      } else if (data) {
        // Map the Supabase response to our component's interface
        const formattedData: EvaluationRecord[] = data.map((item: any) => ({
          id: item.id,
          name: item.intake_submissions?.player_name || 'Unknown',
          position: item.intake_submissions?.primary_position || 'N/A',
          class: item.intake_submissions?.grad_class || 'N/A',
          overall: item.overall_grade || 'N/A',
          recommendation: item.recommendation || 'none',
          athleticism: item.athleticism_score || 0,
          skill: item.skill_score || 0,
          iq: item.iq_score || 0,
          status: item.status || 'new',
        }));
        setEvals(formattedData);
      }
      setLoading(false);
    }

    fetchEvals();
  }, []);

  const filteredEvals = evals.filter(ev => {
    const matchesSearch = ev.name.toLowerCase().includes(searchTerm.toLowerCase()) || ev.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRec ? ev.recommendation === filterRec : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">EliteGBB Scouting Dashboard</h1>
          <p className="text-slate-500 mt-1">Review player evaluations, game stats, and intake submissions.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or position..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 bg-white"
            onClick={() => setFilterRec(filterRec === 'offer' ? null : 'offer')}
          >
            <Filter size={18} />
            {filterRec === 'offer' ? 'Showing Offers' : 'Filter Offers'}
          </button>
        </div>
      </div>

      <Card className="border-2 border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg">Recent Coach Evaluations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Athlete</th>
                  <th className="p-4">Pos / Class</th>
                  <th className="p-4">Scores (Ath/Skill/IQ)</th>
                  <th className="p-4">Overall Grade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Loading evaluations...
                    </td>
                  </tr>
                ) : filteredEvals.length > 0 ? (
                  filteredEvals.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{ev.name}</td>
                      <td className="p-4">{ev.position} | {ev.class}</td>
                      <td className="p-4 font-mono text-xs">{ev.athleticism} / {ev.skill} / {ev.iq}</td>
                      <td className="p-4 font-bold">{ev.overall}</td>
                      <td className="p-4">
                        <Badge className={`
                          ${ev.status === 'enrolled' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                          ${ev.status === 'contacted' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                          ${ev.status === 'new' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                        `}>
                          {ev.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`
                          ${ev.recommendation === 'offer' ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                          ${ev.recommendation === 'watch' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : ''}
                          ${ev.recommendation === 'pass' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                        `}>
                          {ev.recommendation.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No evaluations found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
