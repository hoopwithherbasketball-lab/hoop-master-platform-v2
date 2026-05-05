import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-gray-900">ProCoach Platform</h1>
              </div>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
