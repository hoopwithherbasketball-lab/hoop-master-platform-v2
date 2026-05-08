import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { AuthProvider, ProfileCard } from '@hoop-master/features/crm';

const features = [
  { title: 'Tournament Management', description: 'Build and manage tournaments, schedules, brackets, and results.', href: '#' },
  { title: 'Video Library', description: 'Curate training content, highlight reels, and live scouting footage.', href: '#' },
  { title: 'Coaching Assist', description: 'AI-driven game plans, roster analytics, and player development tools.', href: '#' },
]

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <main className="mx-auto max-w-5xl px-6 py-16">
            <div className="space-y-6 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-royal-600">ProCoach Platform</p>
              <h1 className="text-4xl font-display font-bold text-navy-900">Elite coaching and tournament operations for girls basketball.</h1>
              <p className="mx-auto max-w-2xl text-slate-600">Run events, share video resources, and support coaches with a modern platform built for pro-level player development.</p>
              <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4 gap-3">
                <Link to="#" className="btn btn-primary">Request a demo</Link>
                <Link to="#" className="btn btn-secondary">View features</Link>
              </div>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="card p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-navy-900">{feature.title}</h2>
                  <p className="text-slate-500">{feature.description}</p>
                  <Link to={feature.href} className="text-royal-700 font-semibold">Learn more</Link>
                </div>
              ))}
            </div>
            <div className="mt-10 max-w-2xl mx-auto">
              <ProfileCard />
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
