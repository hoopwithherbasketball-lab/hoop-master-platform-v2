import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './lib/auth'
import type { UserRole } from './types/database'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/public/HomePage'
import ServicesPage from './pages/public/ServicesPage'
import RecruitingReadinessPage from './pages/public/RecruitingReadinessPage'
import NILReadinessPage from './pages/public/NILReadinessPage'
import AuditPage from './pages/public/AuditPage'
import BrowsePage from './pages/public/BrowsePage'
import PlayerDetailPage from './pages/public/PlayerDetailPage'
import WorkshopsPage from './pages/public/WorkshopsPage'
import CheckoutPage from './pages/public/CheckoutPage'
import UITestPage from "./pages/UITestPage"
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import ProfilePage from './pages/dashboard/ProfilePage'
import ProfileOptimizerPage from './pages/dashboard/ProfileOptimizerPage'
import ReadinessPage from './pages/dashboard/ReadinessPage'
import EventsPage from './pages/dashboard/EventsPage'
import ServicesOrdersPage from './pages/dashboard/ServicesOrdersPage'
import ServiceOrderDetailPage from './pages/dashboard/ServiceOrderDetailPage'
import ServiceIntakePage from './pages/dashboard/ServiceIntakePage'
import ResourcesDashboardPage from './pages/dashboard/ResourcesDashboardPage'
import ParentDashboardPage from './pages/dashboard/ParentDashboardPage'
import CoachDashboard from './pages/coach/CoachDashboard'
import CoachSearchPage from './pages/coach/CoachSearchPage'
import CoachShortlistPage from './pages/coach/CoachShortlistPage'
import CoachEventsPage from './pages/coach/CoachEventsPage'
import AdminOverview from './pages/admin/AdminOverview'
import AdminLeadsPage from './pages/admin/AdminLeadsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminAuditsPage from './pages/admin/AdminAuditsPage'
import NILOverview from "./pages/nil/NILOverview"
import CompanyList from "./pages/nil/CompanyList"
import OpportunityList from "./pages/nil/OpportunityList"
import AthleteNILProfileList from "./pages/nil/AthleteNILProfileList"
import OutreachInbox from "./pages/nil/OutreachInbox"
import ComplianceQueue from "./pages/nil/ComplianceQueue"
import TaskBoard from "./pages/nil/TaskBoard"
import AdminPlayersPage from './pages/admin/AdminPlayersPage'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (<div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1">{children}</div><Footer /></div>)
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/recruiting-readiness" element={<PublicLayout><RecruitingReadinessPage /></PublicLayout>} />
      <Route path="/nil-readiness" element={<PublicLayout><NILReadinessPage /></PublicLayout>} />
      <Route path="/audit" element={<PublicLayout><AuditPage /></PublicLayout>} />
      <Route path="/browse" element={<PublicLayout><BrowsePage /></PublicLayout>} />
      <Route path="/browse/:id" element={<PublicLayout><PlayerDetailPage /></PublicLayout>} />
      <Route path="/workshops" element={<PublicLayout><WorkshopsPage /></PublicLayout>} />
      <Route path="/ui-test" element={<PublicLayout><UITestPage /></PublicLayout>} />
      <Route path="/checkout/:slug" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/profile/optimizer" element={<ProtectedRoute><ProfileOptimizerPage /></ProtectedRoute>} />
      <Route path="/dashboard/readiness" element={<ProtectedRoute><ReadinessPage /></ProtectedRoute>} />
      <Route path="/dashboard/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/dashboard/services" element={<ProtectedRoute><ServicesOrdersPage /></ProtectedRoute>} />
      <Route path="/dashboard/services/:orderId" element={<ProtectedRoute><ServiceOrderDetailPage /></ProtectedRoute>} />
      <Route path="/dashboard/services/:orderId/intake" element={<ProtectedRoute><ServiceIntakePage /></ProtectedRoute>} />
      <Route path="/dashboard/resources" element={<ProtectedRoute><ResourcesDashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/parent" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />
      <Route path="/coach" element={<ProtectedRoute><CoachDashboard /></ProtectedRoute>} />
      <Route path="/coach/search" element={<ProtectedRoute><CoachSearchPage /></ProtectedRoute>} />
      <Route path="/coach/shortlist" element={<ProtectedRoute><CoachShortlistPage /></ProtectedRoute>} />
      <Route path="/coach/events" element={<ProtectedRoute><CoachEventsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminOverview /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute role="admin"><AdminLeadsPage /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrdersPage /></ProtectedRoute>} />
      <Route path="/admin/audits" element={<ProtectedRoute role="admin"><AdminAuditsPage /></ProtectedRoute>} />
      <Route path="/admin/players" element={<ProtectedRoute role="admin"><AdminPlayersPage /></ProtectedRoute>} />
      <Route path="/nil" element={<ProtectedRoute role="admin"><NILOverview /></ProtectedRoute>} />
      <Route path="/nil/companies" element={<ProtectedRoute role="admin"><CompanyList /></ProtectedRoute>} />
      <Route path="/nil/opportunities" element={<ProtectedRoute role="admin"><OpportunityList /></ProtectedRoute>} />
      <Route path="/nil/athletes" element={<ProtectedRoute role="admin"><AthleteNILProfileList /></ProtectedRoute>} />
      <Route path="/nil/outreach" element={<ProtectedRoute role="admin"><OutreachInbox /></ProtectedRoute>} />
      <Route path="/nil/compliance" element={<ProtectedRoute role="admin"><ComplianceQueue /></ProtectedRoute>} />
      <Route path="/nil/tasks" element={<ProtectedRoute role="admin"><TaskBoard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (<BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>)
}
