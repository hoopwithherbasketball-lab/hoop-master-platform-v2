import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth, LoginForm, SignupForm, ProfileCard } from '@hoop-master/features/crm';
import ProposalBuilder from './components/ProposalBuilder';
import './App.css';

function AuthSection() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div>
        <p className="mb-4 text-lg">Welcome back, <strong>{user.email}</strong>!</p>
        <div className="flex gap-4 mb-8">
          <Link to="/proposals/builder" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
            Open Proposal Builder
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
        <div className="mt-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <ProfileCard editable />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <div className="mb-6 flex gap-4 justify-center border-b pb-4">
        <button
          onClick={() => setMode('login')}
          className={`px-4 py-2 rounded font-medium ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`px-4 py-2 rounded font-medium ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Sign Up
        </button>
      </div>

      {mode === 'login' ? (
        <LoginForm />
      ) : (
        <SignupForm />
      )}
    </div>
  );
}

function Home() {
  return (
    <div className="App">
      <header className="bg-slate-900 text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Partner Portal</h1>
        <p className="text-blue-200">Welcome to Hoop With Her Partner Portal</p>
      </header>
      <section className="p-8 max-w-4xl mx-auto">
        <AuthSection />
      </section>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proposals/builder" element={<ProposalBuilder />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
