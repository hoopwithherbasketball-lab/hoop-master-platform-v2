import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/layout/Header'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Products } from './pages/Products'
import { Success } from './pages/Success'
import { Home } from './pages/Home'
import PricingPage from './pages/Pricing'
import Store from './pages/Store'
import Checkout from './pages/Checkout'
import Dashboard from './components/Dashboard/Dashboard'
import AdminDashboard from './components/Admin/AdminDashboard'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import DynamicPage from './pages/DynamicPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/store" element={<Store />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/success" element={<Success />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/pages/:slug" element={<DynamicPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
