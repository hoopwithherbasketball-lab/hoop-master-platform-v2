import { notFound } from 'next/navigation';
import Image from 'next/image';

interface AthleteProfileProps {
  params: {
    slug: string;
  };
}

async function getAthlete(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/athletes/${slug}`, {
    // Revalidate data periodically (ISR/SSG pattern for speed)
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch athlete data');
  }

  return res.json();
}

export default async function AthleteProfilePage({ params }: AthleteProfileProps) {
  const athlete = await getAthlete(params.slug);

  if (!athlete) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-600 selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative w-full py-20 px-6 border-b border-purple-900/30 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-12 relative z-10">
          {athlete.media?.graphicTemplateUrl ? (
            <div className="relative w-72 h-[360px] rounded-xl overflow-hidden shadow-2xl shadow-purple-900/40 border-2 border-purple-800/50">
              <Image 
                src={athlete.media.graphicTemplateUrl} 
                alt={`${athlete.name} HOOP WITH HER Spotlight Poster`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-72 h-[360px] rounded-xl bg-slate-900 flex items-center justify-center border-2 border-slate-800 shadow-2xl shadow-black">
              <span className="text-slate-600 font-bold tracking-widest uppercase text-center px-4">
                HOOP WITH HER
              </span>
            </div>
          )}
          
          <div className="flex-1 space-y-5">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-lg">
              {athlete.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-lg font-bold text-white uppercase tracking-wider">
              <span className="bg-gradient-to-r from-purple-800 to-purple-600 px-5 py-2 rounded border border-purple-500/30">
                Class of {athlete.graduationYear}
              </span>
              <span className="bg-slate-800 px-5 py-2 rounded border border-slate-700">
                {athlete.position}
              </span>
              {athlete.jerseyNumber && (
                <span className="bg-amber-500/10 text-amber-400 px-5 py-2 rounded border border-amber-500/20">
                  #{athlete.jerseyNumber}
                </span>
              )}
            </div>

            <div className="flex gap-10 pt-4 text-slate-300">
              {athlete.height && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Height</p>
                  <p className="text-3xl font-bold">{athlete.height}</p>
                </div>
              )}
              {athlete.wingspan && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-400">Wingspan</p>
                  <p className="text-3xl font-bold">{athlete.wingspan}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Film Room & Open Runs */}
        <div className="lg:col-span-2 space-y-16">
          {/* The Film Room */}
          <section>
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8 text-white flex items-center gap-4">
              <span className="w-8 h-1 bg-amber-500 rounded-full" />
              The Film Room
            </h2>
            <div className="space-y-6">
              {athlete.media?.highlightReel ? (
                <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative shadow-xl shadow-black/50">
                  <iframe 
                    src={athlete.media.highlightReel} 
                    className="w-full h-full absolute inset-0"
                    allowFullScreen
                    title={`${athlete.name} Highlight Reel`}
                  ></iframe>
                </div>
              ) : (
                <div className="p-8 border border-slate-800 border-dashed rounded-xl bg-slate-900/50">
                  <p className="text-slate-500 font-medium italic text-center">No video cuts currently uploaded.</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Open Runs */}
          <section>
            <h2 className="text-3xl font-black uppercase tracking-widest mb-8 text-white flex items-center gap-4">
              <span className="w-8 h-1 bg-purple-500 rounded-full" />
              Upcoming Open Runs
            </h2>
            {athlete.openRunEvents && athlete.openRunEvents.length > 0 ? (
              <div className="grid gap-4">
                {athlete.openRunEvents.map((reg: any) => (
                  <div 
                    key={reg.id} 
                    className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-purple-500/50 transition-colors shadow-lg shadow-black/20"
                  >
                    <div>
                      <p className="text-xl font-bold text-amber-500">
                        {new Date(reg.openRunEvent.date).toLocaleDateString('en-US', {
                           month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                      <p className="text-slate-300 font-medium mt-1">{reg.openRunEvent.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-4 py-1.5 bg-purple-900/30 text-purple-300 text-sm font-bold uppercase tracking-wider rounded border border-purple-800/50">
                        Court {reg.openRunEvent.courtNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-slate-800 border-dashed rounded-xl bg-slate-900/50">
                <p className="text-slate-500 font-medium italic text-center">No scheduled Open Runs.</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Academic & Athletic Profile */}
        <div className="space-y-8">
          
          {/* Academic Profile */}
          <section className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl shadow-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 text-purple-400">
              Academic Profile
            </h3>
            <div className="flex items-end gap-4 mb-2">
              <span className="text-6xl font-black text-white leading-none">
                {athlete.coreGPA ? athlete.coreGPA.toFixed(2) : 'N/A'}
              </span>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Core GPA
            </p>
          </section>

          {/* Athletic Profile */}
          <section className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl shadow-black/40">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 text-amber-500">
              Athletic Profile
            </h3>
            {athlete.stats ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'PPG', value: athlete.stats.ppg },
                  { label: 'APG', value: athlete.stats.apg },
                  { label: 'RPG', value: athlete.stats.rpg },
                  { label: 'STL', value: athlete.stats.steals },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-white">{stat.value.toFixed(1)}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm font-medium italic">Stats currently unavailable.</p>
            )}
          </section>

          {/* Skill Stack */}
          {athlete.stats?.skillStack && (
            <section className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl shadow-black/40">
              <h3 className="text-lg font-black uppercase tracking-widest mb-6 text-white">
                Skill Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(athlete.stats.skillStack) && athlete.stats.skillStack.map((skill: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-slate-950 text-slate-300 rounded text-sm font-bold uppercase tracking-wider border border-slate-800 hover:border-amber-500/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
