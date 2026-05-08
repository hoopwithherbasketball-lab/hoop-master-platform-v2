import React, { useState } from 'react';
import { AuthProvider, useAuth, LoginForm, SignupForm, ProfileCard } from '@hoop-master/features/crm';
import './App.css';

function AuthSection() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div>
        <p>Welcome back, {user.email}!</p>
        <div className="mt-6 max-w-md">
          <ProfileCard editable />
        </div>
        <button
          type="button"
          onClick={signOut}
          className="btn btn-secondary mt-4"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setMode('login')}
          className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`px-4 py-2 rounded ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>Partner Portal</h1>
          <p>Welcome to Hoop With Her Partner Portal</p>
        </header>
        <section className="App-body">
          <AuthSection />
        </section>
      </div>
    </AuthProvider>
  );
}

export default App;
