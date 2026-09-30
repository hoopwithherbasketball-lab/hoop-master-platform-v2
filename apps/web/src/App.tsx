import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, ProtectedRoute } from './lib/auth'
import type { UserRole } from './types/database'
import { PublicLayout as UIPublicLayout } from '@hoop-master/ui'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
const HomePage = lazy(() => import('./pages/public/HomePage'))
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'))
const RecruitingReadinessPage = lazy(() => import('./pages/public/RecruitingReadinessPage'))
const RecruitingRoadmapPage = lazy(() => import('./pages/public/RecruitingRoadmapPage'))
const NILReadinessPage = lazy(() => import('./pages/public/NILReadinessPage'))
const AuditPage = lazy(() => import('./pages/public/AuditPage'))
const BrowsePage = lazy(() => import('./pages/public/BrowsePage'))
const PlayerDetailPage = lazy(() => import('./pages/public/PlayerDetailPage'))
const WorkshopsPage = lazy(() => import('./pages/public/WorkshopsPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const FAQPage = lazy(() => import('./pages/public/FAQPage'))
const PublicEventsPage = lazy(() => import('./pages/public/EventsPage'))
const CheckoutPage = lazy(() => import('./pages/public/CheckoutPage'))
const CheckoutSuccessPage = lazy(() => import('./pages/public/CheckoutSuccessPage'))
const UITestPage = lazy(() => import('./pages/UITestPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'))
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'))
const ProfileOptimizerPage = lazy(() => import('./pages/dashboard/ProfileOptimizerPage'))
const ReadinessPage = lazy(() => import('./pages/dashboard/ReadinessPage'))
const CoachDashboard = lazy(() => import('./pages/dashboard/CoachDashboard'))
const EventsPage = lazy(() => import('./pages/dashboard/EventsPage'))
const ServicesOrdersPage = lazy(() => import('./pages/dashboard/ServicesOrdersPage'))
const ServiceOrderDetailPage = lazy(() => import('./pages/dashboard/ServiceOrderDetailPage'))
const ServiceIntakePage = lazy(() => import('./pages/dashboard/ServiceIntakePage'))
const IntakeFormPage = lazy(() => import('./pages/dashboard/IntakeFormPage'))
const EliteGBBIntakePage = lazy(() => import('./pages/public/EliteGBBIntakePage'))
const ChannelsBrowsePage = lazy(() => import('./pages/public/ChannelsBrowsePage'))
const ChannelWatchPage = lazy(() => import('./pages/public/ChannelWatchPage'))
const PlayerPortalPage = lazy(() => import('./pages/dashboard/PlayerPortalPage'))
const OnePagerPage = lazy(() => import('./pages/dashboard/OnePagerPage'))
const ClassTrackingPage = lazy(() => import('./pages/dashboard/ClassTrackingPage'))
const ResourcesDashboardPage = lazy(() => import('./pages/dashboard/ResourcesDashboardPage'))
const ParentDashboardPage = lazy(() => import('./pages/dashboard/ParentDashboardPage'))
const NILRoadmapPage = lazy(() => import('./pages/dashboard/NILRoadmapPage'))
const CoachDashboardLegacy = lazy(() => import('./pages/coach/CoachDashboard'))
const CoachSearchPage = lazy(() => import('./pages/coach/CoachSearchPage'))
const CoachShortlistPage = lazy(() => import('./pages/coach/CoachShortlistPage'))
const CoachEventsPage = lazy(() => import('./pages/coach/CoachEventsPage'))
const PlayerEvaluationPage = lazy(() => import('./pages/coach/PlayerEvaluationPage'))
const ProspectComparisonPage = lazy(() => import('./pages/coach/ProspectComparisonPage'))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminAuditsPage = lazy(() => import('./pages/admin/AdminAuditsPage'))
const EliteGBBDashboard = lazy(() => import('./pages/admin/EliteGBBDashboard'))
const NILOverview = lazy(() => import('./pages/nil/NILOverview'))
const CompanyList = lazy(() => import('./pages/nil/CompanyList'))
const OpportunityList = lazy(() => import('./pages/nil/OpportunityList'))
const AthleteNILProfileList = lazy(() => import('./pages/nil/AthleteNILProfileList'))
const OutreachInbox = lazy(() => import('./pages/nil/OutreachInbox'))
const ComplianceQueue = lazy(() => import('./pages/nil/ComplianceQueue'))
const TaskBoard = lazy(() => import('./pages/nil/TaskBoard'))
const NILProposals = lazy(() => import('./pages/nil/NILProposals'))
const ProposalBuilderPage = lazy(() => import('./pages/nil/ProposalBuilderPage'))
const ProposalEditor = lazy(() => import('./pages/nil/ProposalEditor'))
const AdminPlayersPage = lazy(() => import('./pages/admin/AdminPlayersPage'))
const EliteGBBHubPage = lazy(() => import('./pages/connectgbb/ConnectGBBHubPage'))
const CommunityFeedPage = lazy(() => import('./pages/connectgbb/CommunityFeedPage'))
const TrainingHubPage = lazy(() => import('./pages/connectgbb/TrainingHubPage'))
const ConnectionsPage = lazy(() => import('./pages/connectgbb/ConnectionsPage'))
const MemberProfilePage = lazy(() => import('./pages/connectgbb/MemberProfilePage'))
const MessagesPage = lazy(() => import('./pages/connectgbb/MessagesPage'))
const FilmIndexPage = lazy(() => import('./pages/dashboard/FilmIndexPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const FundingPage = lazy(() => import('./pages/dashboard/FundingPage'))
const AdminFundingPage = lazy(() => import('./pages/admin/AdminFundingPage'))
const AdminEvaluationsPage = lazy(() => import('./pages/admin/AdminEvaluationsPage'))
const CourtsideCommunicationPage = lazy(() => import('./pages/admin/CourtsideCommunicationPage'))
const AdminPlayerDetailPage = lazy(() => import('./pages/admin/AdminPlayerDetailPage'))
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'))
const AdminAuditLogsPage = lazy(() => import('./pages/admin/AdminAuditLogsPage'))
const AdminTrainingPage = lazy(() => import('./pages/admin/AdminTrainingPage'))
const AdminRecruitingOutreachPage = lazy(() => import('./pages/admin/AdminRecruitingOutreachPage'))
const AdminIntakeSubmissionsPage = lazy(() => import('./pages/admin/AdminIntakeSubmissionsPage'))
const AdminCommunityFeedPage = lazy(() => import('./pages/admin/AdminCommunityFeedPage'))
const AdminCommunityMembershipsPage = lazy(() => import('./pages/admin/AdminCommunityMembershipsPage'))
const AdminModerationQueuePage = lazy(() => import('./pages/admin/AdminModerationQueuePage'))
const AdminChannelsPage = lazy(() => import('./pages/admin/AdminChannelsPage'))
const AdminAssetsPage = lazy(() => import('./pages/admin/AdminAssetsPage'))
const AdminSchedulePage = lazy(() => import('./pages/admin/AdminSchedulePage'))
const AdminAdSlotsPage = lazy(() => import('./pages/admin/AdminAdSlotsPage'))
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'))
const AdminTenantsPage = lazy(() => import('./pages/admin/AdminTenantsPage'))
const EmbedPlayerPage = lazy(() => import('./pages/public/EmbedPlayerPage'))
const EmbedDocsPage = lazy(() => import('./pages/public/EmbedDocsPage'))
const AdminPageBuilder = lazy(() => import('./pages/admin/AdminPageBuilder'))
const AdminPageNew = lazy(() => import('./pages/admin/AdminPageNew'))
const AdminPageEditor = lazy(() => import('./pages/admin/AdminPageEditor'))
const SponsorsDashboard = lazy(() => import('./pages/admin/SponsorsDashboard'))
const DynamicPage = lazy(() => import('./pages/public/DynamicPage'))
const PitchPage = lazy(() => import('./pages/public/PitchPage'))
const ProfileSettingsPage = lazy(() => import('./pages/connectgbb/ProfileSettingsPage'))
const PartnerOnboardingPage = lazy(() => import('./pages/public/PartnerOnboardingPage'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'))
const AdminPageBuilderPage = lazy(() => import('./pages/admin/AdminPageBuilderPage'))
const DynamicPagePreview = lazy(() => import('./pages/public/DynamicPagePreview'))


const Fallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-[#FF3366] animate-spin" />
  </div>
);

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <UIPublicLayout navbar={<Navbar />} footer={<Footer />}>{children}</UIPublicLayout>
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
      <Route path="/recruiting-roadmap" element={<PublicLayout><RecruitingRoadmapPage /></PublicLayout>} />
      <Route path="/nil-readiness" element={<PublicLayout><NILReadinessPage /></PublicLayout>} />
      <Route path="/audit" element={<PublicLayout><AuditPage /></PublicLayout>} />
      <Route path="/browse" element={<PublicLayout><BrowsePage /></PublicLayout>} />
      <Route path="/elitegbb" element={<EliteGBBIntakePage />} />
      <Route path="/browse/:id" element={<PublicLayout><PlayerDetailPage /></PublicLayout>} />
      <Route path="/workshops" element={<PublicLayout><WorkshopsPage /></PublicLayout>} />
      <Route path="/ui-test" element={<PublicLayout><UITestPage /></PublicLayout>} />
      <Route path="/p/:slug" element={<PublicLayout><DynamicPage /></PublicLayout>} />
      <Route path="/checkout/success" element={<PublicLayout><CheckoutSuccessPage /></PublicLayout>} />
      <Route path="/checkout/:slug" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
      <Route path="/watch" element={<PublicLayout><ChannelsBrowsePage /></PublicLayout>} />
      <Route path="/watch/:slug" element={<ChannelWatchPage />} />
      <Route path="/embed/:slug" element={<EmbedPlayerPage />} />
      <Route path="/embed/docs" element={<PublicLayout><EmbedDocsPage /></PublicLayout>} />
      <Route path="/p/:slug" element={<PublicLayout><DynamicPage /></PublicLayout>} />
      <Route path="/pitch/:id" element={<PublicLayout><PitchPage /></PublicLayout>} />
      <Route path="/partner-onboarding" element={<PartnerOnboardingPage />} />
      <Route path="/p/:slug" element={<DynamicPagePreview />} />
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
      <Route path="/dashboard/funding" element={<ProtectedRoute><FundingPage /></ProtectedRoute>} />
      <Route path="/dashboard/nil/roadmap" element={<ProtectedRoute><NILRoadmapPage /></ProtectedRoute>} />
      <Route path="/dashboard/coach" element={<ProtectedRoute><CoachDashboard /></ProtectedRoute>} />
      <Route path="/coach" element={<ProtectedRoute><CoachDashboardLegacy /></ProtectedRoute>} />
      <Route path="/coach/search" element={<ProtectedRoute><CoachSearchPage /></ProtectedRoute>} />
      <Route path="/coach/shortlist" element={<ProtectedRoute><CoachShortlistPage /></ProtectedRoute>} />
      <Route path="/coach/events" element={<ProtectedRoute><CoachEventsPage /></ProtectedRoute>} />
      <Route path="/coach/evaluation/:id" element={<ProtectedRoute><PlayerEvaluationPage /></ProtectedRoute>} />
      <Route path="/coach/compare" element={<ProtectedRoute><ProspectComparisonPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminOverview /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute role="admin"><AdminLeadsPage /></ProtectedRoute>} />
      <Route path="/admin/funding" element={<ProtectedRoute role="admin"><AdminFundingPage /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrdersPage /></ProtectedRoute>} />
      <Route path="/admin/audits" element={<ProtectedRoute role="admin"><AdminAuditsPage /></ProtectedRoute>} />
      <Route path="/admin/evaluations" element={<ProtectedRoute role="admin"><AdminEvaluationsPage /></ProtectedRoute>} />
      <Route path="/admin/courtside-communication" element={<ProtectedRoute role="admin"><CourtsideCommunicationPage /></ProtectedRoute>} />
      <Route path="/admin/players" element={<ProtectedRoute role="admin"><AdminPlayersPage /></ProtectedRoute>} />
      <Route path="/admin/elitegbb" element={<ProtectedRoute role="admin"><EliteGBBDashboard /></ProtectedRoute>} />
      <Route path="/admin/players/:id" element={<ProtectedRoute role="admin"><AdminPlayerDetailPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReportsPage /></ProtectedRoute>} />
      <Route path="/admin/crm-audit" element={<ProtectedRoute role="admin"><AdminAuditLogsPage /></ProtectedRoute>} />
      <Route path="/admin/training" element={<ProtectedRoute role="admin"><AdminTrainingPage /></ProtectedRoute>} />
      <Route path="/admin/recruiting/outreach" element={<ProtectedRoute role="admin"><AdminRecruitingOutreachPage /></ProtectedRoute>} />
      <Route path="/admin/intake" element={<ProtectedRoute role="admin"><AdminIntakeSubmissionsPage /></ProtectedRoute>} />
      <Route path="/admin/feed" element={<ProtectedRoute role="admin"><AdminCommunityFeedPage /></ProtectedRoute>} />
      <Route path="/admin/community-memberships" element={<ProtectedRoute role="admin"><AdminCommunityMembershipsPage /></ProtectedRoute>} />
      <Route path="/admin/moderation" element={<ProtectedRoute role="admin"><AdminModerationQueuePage /></ProtectedRoute>} />
      <Route path="/admin/channels" element={<ProtectedRoute role="admin"><AdminChannelsPage /></ProtectedRoute>} />
      <Route path="/admin/assets" element={<ProtectedRoute role="admin"><AdminAssetsPage /></ProtectedRoute>} />
      <Route path="/admin/schedules" element={<ProtectedRoute role="admin"><AdminSchedulePage /></ProtectedRoute>} />
      <Route path="/admin/ad-slots" element={<ProtectedRoute role="admin"><AdminAdSlotsPage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalyticsPage /></ProtectedRoute>} />
      <Route path="/admin/tenants" element={<ProtectedRoute role="admin"><AdminTenantsPage /></ProtectedRoute>} />
      <Route path="/admin/pages" element={<ProtectedRoute role="admin"><AdminPageBuilder /></ProtectedRoute>} />
      <Route path="/admin/pages/new" element={<ProtectedRoute role="admin"><AdminPageNew /></ProtectedRoute>} />
      <Route path="/admin/pages/:slug" element={<ProtectedRoute role="admin"><AdminPageEditor /></ProtectedRoute>} />
      <Route path="/admin/sponsors" element={<ProtectedRoute role="admin"><SponsorsDashboard /></ProtectedRoute>} />
      <Route path="/nil/proposals" element={<ProtectedRoute role="admin"><NILProposals /></ProtectedRoute>} />
      <Route path="/admin/page-builder-mvp" element={<ProtectedRoute role="admin"><AdminPageBuilderPage /></ProtectedRoute>} />
      <Route path="/nil" element={<ProtectedRoute role="admin"><NILOverview /></ProtectedRoute>} />
      <Route path="/nil/companies" element={<ProtectedRoute role="admin"><CompanyList /></ProtectedRoute>} />
      <Route path="/nil/opportunities" element={<ProtectedRoute role="admin"><OpportunityList /></ProtectedRoute>} />
      <Route path="/nil/athletes" element={<ProtectedRoute role="admin"><AthleteNILProfileList /></ProtectedRoute>} />
      <Route path="/nil/outreach" element={<ProtectedRoute role="admin"><OutreachInbox /></ProtectedRoute>} />
      <Route path="/nil/compliance" element={<ProtectedRoute role="admin"><ComplianceQueue /></ProtectedRoute>} />
      <Route path="/nil/tasks" element={<ProtectedRoute role="admin"><TaskBoard /></ProtectedRoute>} />
      <Route path="/nil/partner-portal" element={<ProtectedRoute role="admin"><Navigate to="/nil/companies" replace /></ProtectedRoute>} />
      <Route path="/nil/proposals/advanced" element={<ProtectedRoute role="admin"><ProposalBuilderPage /></ProtectedRoute>} />
      <Route path="/nil/proposals/:id/edit" element={<ProtectedRoute role="admin"><ProposalEditor /></ProtectedRoute>} />
      <Route path="/elitegbb" element={<ProtectedRoute><EliteGBBHubPage /></ProtectedRoute>} />
      <Route path="/elitegbb/feed" element={<ProtectedRoute><CommunityFeedPage /></ProtectedRoute>} />
      <Route path="/elitegbb/training" element={<ProtectedRoute><TrainingHubPage /></ProtectedRoute>} />
      <Route path="/elitegbb/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
      <Route path="/elitegbb/member/:id" element={<ProtectedRoute><MemberProfilePage /></ProtectedRoute>} />
      <Route path="/elitegbb/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/elitegbb/settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<Fallback />}><AppRoutes /></Suspense>
        </ErrorBoundary>
      </AuthProvider>
      <Toaster theme="dark" position="top-right" richColors />
    </BrowserRouter>
  )
}
