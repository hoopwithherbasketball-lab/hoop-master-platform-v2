import { useTrainingTracks } from '@hoop-master/features/connectgbb'
import PageShell from '../../components/ui/PageShell'

const categoryColors: Record<string, string> = {
  skill: 'bg-[#0134BD]',
  strength: 'bg-[#FB6C1D]',
  film: 'bg-[#C8A24A]',
  recruiting: 'bg-[#121B47]',
}

const categoryLabels: Record<string, string> = {
  skill: 'Skill Development',
  strength: 'Strength & Conditioning',
  film: 'Film Study',
  recruiting: 'Recruiting Prep',
}

export default function TrainingHubPage() {
  const { tracks, loading } = useTrainingTracks()

  return (
    <PageShell title="Training Hub" description="Video lessons, drill libraries, and skill tracks designed for elite development." badge="ConnectGBB">
      {loading ? (
        <div className="animate-pulse grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-navy-800 p-6 rounded-lg shadow-md h-40" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tracks.map(track => (
            <div key={track.id} className="bg-navy-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD]">
              <div className="flex justify-between items-start mb-3">
                <span className={`${categoryColors[track.category] || 'bg-[#0134BD]'} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                  {categoryLabels[track.category] || track.category}
                </span>
                <span className="text-xs text-slate-400">{track.level}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{track.title}</h3>
              <p className="text-sm text-slate-400 mb-3">{track.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{track.duration}</span>
                <span>{track.lessonCount} lessons</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
