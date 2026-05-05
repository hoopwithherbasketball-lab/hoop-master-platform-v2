import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import type { UserRole } from './types/database'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/public/HomePage'
import ServicesPage from './pages/public/ServicesPage'
import RecruitingReadinessPage from './pages/public/RecruitingReadinessPage'
import NILReadinessPage from './pages/public/NILReadinessPage'
import AuditPage from './pages/public/AuditPage'
import BrowsePage from './pages/public/BrowsePage'
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

function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { user, loading, hasRole } = useAuth()
  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-royal-500 border-t-transparent rounded-full animate-spin" /></div>)
  if (!user) return <Navigate to="/login" replace />
  if (role && !hasRole(role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

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
      <Route path="/workshops" element={<PublicLayout><WorkshopsPage /></PublicLayout>} />
      <Route path="/ui-test" element={<PublicLayout><UITestPage /></PublicLayout>} />
      <Route path="/checkout/:slug" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
      <Route path="/dashboard" element={<RequireAuth><DashboardOverview /></RequireAuth>} />
      <Route path="/dashboard/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/dashboard/profile/optimizer" element={<RequireAuth><ProfileOptimizerPage /></RequireAuth>} />
      <Route path="/dashboard/readiness" element={<RequireAuth><ReadinessPage /></RequireAuth>} />
      <Route path="/dashboard/events" element={<RequireAuth><EventsPage /></RequireAuth>} />
      <Route path="/dashboard/services" element={<RequireAuth><ServicesOrdersPage /></RequireAuth>} />
      <Route path="/dashboard/services/:orderId" element={<RequireAuth><ServiceOrderDetailPage /></RequireAuth>} />
      <Route path="/dashboard/services/:orderId/intake" element={<RequireAuth><ServiceIntakePage /></RequireAuth>} />
      <Route path="/dashboard/resources" element={<RequireAuth><ResourcesDashboardPage /></RequireAuth>} />
      <Route path="/dashboard/parent" element={<RequireAuth><ParentDashboardPage /></RequireAuth>} />
      <Route path="/coach" element={<RequireAuth><CoachDashboard /></RequireAuth>} />
      <Route path="/coach/search" element={<RequireAuth><CoachSearchPage /></RequireAuth>} />
      <Route path="/coach/shortlist" element={<RequireAuth><CoachShortlistPage /></RequireAuth>} />
      <Route path="/coach/events" element={<RequireAuth><CoachEventsPage /></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth role="admin"><AdminOverview /></RequireAuth>} />
      <Route path="/admin/leads" element={<RequireAuth role="admin"><AdminLeadsPage /></RequireAuth>} />
      <Route path="/admin/orders" element={<RequireAuth role="admin"><AdminOrdersPage /></RequireAuth>} />
      <Route path="/admin/audits" element={<RequireAuth role="admin"><AdminAuditsPage /></RequireAuth>} />
      <Route path="/admin/players" element={<RequireAuth role="admin"><AdminPlayersPage /></RequireAuth>} />
      <Route path="/nil" element={<RequireAuth role="admin"><NILOverview /></RequireAuth>} />
      <Route path="/nil/companies" element={<RequireAuth role="admin"><CompanyList /></RequireAuth>} />
      <Route path="/nil/opportunities" element={<RequireAuth role="admin"><OpportunityList /></RequireAuth>} />
      <Route path="/nil/athletes" element={<RequireAuth role="admin"><AthleteNILProfileList /></RequireAuth>} />
      <Route path="/nil/outreach" element={<RequireAuth role="admin"><OutreachInbox /></RequireAuth>} />
      <Route path="/nil/compliance" element={<RequireAuth role="admin"><ComplianceQueue /></RequireAuth>} />
      <Route path="/nil/tasks" element={<RequireAuth role="admin"><TaskBoard /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (<BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>)
}
