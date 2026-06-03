import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './lib/auth'
import type { UserRole } from './types/database'
import ErrorBoundary from './components/ErrorBoundary'
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
import ContactPage from './pages/public/ContactPage'
import FAQPage from './pages/public/FAQPage'
import PublicEventsPage from './pages/public/EventsPage'
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
import IntakeFormPage from './pages/dashboard/IntakeFormPage'
import EliteGBBIntakePage from './pages/public/EliteGBBIntakePage'
import ChannelsBrowsePage from './pages/public/ChannelsBrowsePage'
import ChannelWatchPage from './pages/public/ChannelWatchPage'
import PlayerPortalPage from './pages/dashboard/PlayerPortalPage'
import OnePagerPage from './pages/dashboard/OnePagerPage'
import ClassTrackingPage from './pages/dashboard/ClassTrackingPage'
import ResourcesDashboardPage from './pages/dashboard/ResourcesDashboardPage'
import ParentDashboardPage from './pages/dashboard/ParentDashboardPage'
import CoachDashboard from './pages/coach/CoachDashboard'
import CoachSearchPage from './pages/coach/CoachSearchPage'
import CoachShortlistPage from './pages/coach/CoachShortlistPage'
import CoachEventsPage from './pages/coach/CoachEventsPage'
import PlayerEvaluationPage from './pages/coach/PlayerEvaluationPage'
import ProspectComparisonPage from './pages/coach/ProspectComparisonPage'
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
import ConnectGBBHubPage from './pages/connectgbb/ConnectGBBHubPage'
import CommunityFeedPage from './pages/connectgbb/CommunityFeedPage'
import TrainingHubPage from './pages/connectgbb/TrainingHubPage'
import ConnectionsPage from './pages/connectgbb/ConnectionsPage'
import MemberProfilePage from './pages/connectgbb/MemberProfilePage'
import MessagesPage from './pages/connectgbb/MessagesPage'
import FilmIndexPage from './pages/dashboard/FilmIndexPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import AdminEvaluationsPage from './pages/admin/AdminEvaluationsPage'
import AdminPlayerDetailPage from './pages/admin/AdminPlayerDetailPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminTrainingPage from './pages/admin/AdminTrainingPage'
import AdminIntakeSubmissionsPage from './pages/admin/AdminIntakeSubmissionsPage'
import AdminCommunityFeedPage from './pages/admin/AdminCommunityFeedPage'
import AdminCommunityMembershipsPage from './pages/admin/AdminCommunityMembershipsPage'
import AdminChannelsPage from './pages/admin/AdminChannelsPage'
import AdminAssetsPage from './pages/admin/AdminAssetsPage'
import AdminSchedulePage from './pages/admin/AdminSchedulePage'
import AdminAdSlotsPage from './pages/admin/AdminAdSlotsPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminTenantsPage from './pages/admin/AdminTenantsPage'
import EmbedPlayerPage from './pages/public/EmbedPlayerPage'
import EmbedDocsPage from './pages/public/EmbedDocsPage'
import ProfileSettingsPage from './pages/connectgbb/ProfileSettingsPage'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (<div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1">{children}</div><Footer /></div>)
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><PublicEventsPage /></PublicLayout>} />
      <Route path="/recruiting-readiness" element={<PublicLayout><RecruitingReadinessPage /></PublicLayout>} />
      <Route path="/nil-readiness" element={<PublicLayout><NILReadinessPage /></PublicLayout>} />
      <Route path="/audit" element={<PublicLayout><AuditPage /></PublicLayout>} />
      <Route path="/browse" element={<PublicLayout><BrowsePage /></PublicLayout>} />
      <Route path="/elitegbb" element={<EliteGBBIntakePage />} />
      <Route path="/browse/:id" element={<PublicLayout><PlayerDetailPage /></PublicLayout>} />
      <Route path="/workshops" element={<PublicLayout><WorkshopsPage /></PublicLayout>} />
      <Route path="/ui-test" element={<PublicLayout><UITestPage /></PublicLayout>} />
      <Route path="/checkout/:slug" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
      <Route path="/watch" element={<PublicLayout><ChannelsBrowsePage /></PublicLayout>} />
      <Route path="/watch/:slug" element={<ChannelWatchPage />} />
      <Route path="/embed/:slug" element={<EmbedPlayerPage />} />
      <Route path="/embed/docs" element={<PublicLayout><EmbedDocsPage /></PublicLayout>} />
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
      <Route path="/dashboard/intake" element={<ProtectedRoute><IntakeFormPage /></ProtectedRoute>} />
      <Route path="/dashboard/portal" element={<ProtectedRoute><PlayerPortalPage /></ProtectedRoute>} />
      <Route path="/dashboard/onepager" element={<ProtectedRoute><OnePagerPage /></ProtectedRoute>} />
      <Route path="/dashboard/class-tracking" element={<ProtectedRoute><ClassTrackingPage /></ProtectedRoute>} />
      <Route path="/dashboard/film-index" element={<ProtectedRoute><FilmIndexPage /></ProtectedRoute>} />
      <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/dashboard/resources" element={<ProtectedRoute><ResourcesDashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/parent" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />
      <Route path="/coach" element={<ProtectedRoute><CoachDashboard /></ProtectedRoute>} />
      <Route path="/coach/search" element={<ProtectedRoute><CoachSearchPage /></ProtectedRoute>} />
      <Route path="/coach/shortlist" element={<ProtectedRoute><CoachShortlistPage /></ProtectedRoute>} />
      <Route path="/coach/events" element={<ProtectedRoute><CoachEventsPage /></ProtectedRoute>} />
      <Route path="/coach/evaluation/:id" element={<ProtectedRoute><PlayerEvaluationPage /></ProtectedRoute>} />
      <Route path="/coach/compare" element={<ProtectedRoute><ProspectComparisonPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminOverview /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute role="admin"><AdminLeadsPage /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrdersPage /></ProtectedRoute>} />
      <Route path="/admin/audits" element={<ProtectedRoute role="admin"><AdminAuditsPage /></ProtectedRoute>} />
      <Route path="/admin/evaluations" element={<ProtectedRoute role="admin"><AdminEvaluationsPage /></ProtectedRoute>} />
      <Route path="/admin/players" element={<ProtectedRoute role="admin"><AdminPlayersPage /></ProtectedRoute>} />
      <Route path="/admin/players/:id" element={<ProtectedRoute role="admin"><AdminPlayerDetailPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReportsPage /></ProtectedRoute>} />
      <Route path="/admin/training" element={<ProtectedRoute role="admin"><AdminTrainingPage /></ProtectedRoute>} />
      <Route path="/admin/intake" element={<ProtectedRoute role="admin"><AdminIntakeSubmissionsPage /></ProtectedRoute>} />
      <Route path="/admin/feed" element={<ProtectedRoute role="admin"><AdminCommunityFeedPage /></ProtectedRoute>} />
      <Route path="/admin/community-memberships" element={<ProtectedRoute role="admin"><AdminCommunityMembershipsPage /></ProtectedRoute>} />
      <Route path="/admin/channels" element={<ProtectedRoute role="admin"><AdminChannelsPage /></ProtectedRoute>} />
      <Route path="/admin/assets" element={<ProtectedRoute role="admin"><AdminAssetsPage /></ProtectedRoute>} />
      <Route path="/admin/schedules" element={<ProtectedRoute role="admin"><AdminSchedulePage /></ProtectedRoute>} />
      <Route path="/admin/ad-slots" element={<ProtectedRoute role="admin"><AdminAdSlotsPage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalyticsPage /></ProtectedRoute>} />
      <Route path="/admin/tenants" element={<ProtectedRoute role="admin"><AdminTenantsPage /></ProtectedRoute>} />
      <Route path="/nil" element={<ProtectedRoute role="admin"><NILOverview /></ProtectedRoute>} />
      <Route path="/nil/companies" element={<ProtectedRoute role="admin"><CompanyList /></ProtectedRoute>} />
      <Route path="/nil/opportunities" element={<ProtectedRoute role="admin"><OpportunityList /></ProtectedRoute>} />
      <Route path="/nil/athletes" element={<ProtectedRoute role="admin"><AthleteNILProfileList /></ProtectedRoute>} />
      <Route path="/nil/outreach" element={<ProtectedRoute role="admin"><OutreachInbox /></ProtectedRoute>} />
      <Route path="/nil/compliance" element={<ProtectedRoute role="admin"><ComplianceQueue /></ProtectedRoute>} />
      <Route path="/nil/tasks" element={<ProtectedRoute role="admin"><TaskBoard /></ProtectedRoute>} />
      <Route path="/connectgbb" element={<ProtectedRoute><ConnectGBBHubPage /></ProtectedRoute>} />
      <Route path="/connectgbb/feed" element={<ProtectedRoute><CommunityFeedPage /></ProtectedRoute>} />
      <Route path="/connectgbb/training" element={<ProtectedRoute><TrainingHubPage /></ProtectedRoute>} />
      <Route path="/connectgbb/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
      <Route path="/connectgbb/member/:id" element={<ProtectedRoute><MemberProfilePage /></ProtectedRoute>} />
      <Route path="/connectgbb/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/connectgbb/settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (<BrowserRouter><AuthProvider><ErrorBoundary><AppRoutes /></ErrorBoundary></AuthProvider></BrowserRouter>)
}
