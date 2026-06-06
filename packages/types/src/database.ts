export type UserRole = 'player' | 'parent' | 'coach' | 'club_admin' | 'admin' | 'service_specialist'
export type ServiceStatus = 'new' | 'awaiting_intake' | 'in_review' | 'needs_assets' | 'assigned' | 'in_progress' | 'awaiting_client_feedback' | 'complete' | 'archived'
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'dismissed'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'booked' | 'won' | 'nurture' | 'lost'
export type NILCompanyStage = 'prospecting' | 'matched' | 'outreach' | 'negotiation' | 'active'
export type NILOpportunityStatus = 'matched' | 'review' | 'negotiation' | 'active' | 'completed' | 'cancelled'
export type NILTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type NILTaskStatus = 'todo' | 'in_progress' | 'completed'
export type NILTaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ConnectRole = 'player' | 'parent' | 'coach' | 'scout' | 'club_admin'
export type CommunityMembershipStatus = 'pending' | 'active' | 'suspended'
export type CommunityMembershipTier = 'starter' | 'pro' | 'elite'
export type CommunityReportReason = 'spam' | 'abuse' | 'harassment' | 'misinformation' | 'other'

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: { id: string; user_id: string; role: UserRole; created_at: string }
        Insert: { user_id: string; role: UserRole }
        Update: { role?: UserRole }
      }
      player_profiles: {
        Row: PlayerProfile
        Insert: Omit<PlayerProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PlayerProfile, 'id'>>
      }
      service_offers: {
        Row: ServiceOffer
        Insert: Omit<ServiceOffer, 'id' | 'created_at'>
        Update: Partial<Omit<ServiceOffer, 'id'>>
      }
      service_orders: {
        Row: ServiceOrder
        Insert: Omit<ServiceOrder, 'id' | 'created_at'>
        Update: Partial<Omit<ServiceOrder, 'id'>>
      }
      audit_submissions: {
        Row: AuditSubmission
        Insert: Omit<AuditSubmission, 'id' | 'submitted_at'>
        Update: Partial<Omit<AuditSubmission, 'id'>>
      }
      audit_results: {
        Row: AuditResult
        Insert: Omit<AuditResult, 'id' | 'created_at'>
        Update: Partial<Omit<AuditResult, 'id'>>
      }
      player_readiness_scores: {
        Row: ReadinessScore
        Insert: Omit<ReadinessScore, 'id' | 'created_at'>
        Update: Partial<Omit<ReadinessScore, 'id'>>
      }
      player_events: {
        Row: PlayerEvent
        Insert: Omit<PlayerEvent, 'id' | 'created_at'>
        Update: Partial<Omit<PlayerEvent, 'id'>>
      }
      player_tasks: {
        Row: PlayerTask
        Insert: Omit<PlayerTask, 'id' | 'created_at'>
        Update: Partial<Omit<PlayerTask, 'id'>>
      }
      coach_saved_players: {
        Row: { id: string; coach_profile_id: string; player_profile_id: string; created_at: string }
        Insert: { coach_profile_id: string; player_profile_id: string }
        Update: never
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at'>
        Update: Partial<Omit<Lead, 'id'>>
      }
      tournaments: {
        Row: Tournament
        Insert: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tournament, 'id'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id'>>
      }
      programs: {
        Row: Program
        Insert: Omit<Program, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Program, 'id'>>
      }
      event_registrations: {
        Row: EventRegistration
        Insert: Omit<EventRegistration, 'id' | 'created_at'>
        Update: Partial<Omit<EventRegistration, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id'>>
      }
      coach_profiles: {
        Row: CoachProfile
        Insert: Omit<CoachProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CoachProfile, 'id'>>
      }
      assistant_sessions: {
        Row: AssistantSession
        Insert: Omit<AssistantSession, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AssistantSession, 'id'>>
      }
      assistant_messages: {
        Row: AssistantMessage
        Insert: Omit<AssistantMessage, 'id' | 'created_at'>
        Update: Partial<Omit<AssistantMessage, 'id'>>
      }
      site_content: {
        Row: SiteContent
        Insert: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SiteContent, 'id'>>
      }
      nil_companies: {
        Row: NILCompany
        Insert: Omit<NILCompany, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NILCompany, 'id'>>
      }
      nil_opportunities: {
        Row: NILOpportunity
        Insert: Omit<NILOpportunity, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NILOpportunity, 'id'>>
      }
      nil_athlete_profiles: {
        Row: NILAthleteProfile
        Insert: Omit<NILAthleteProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NILAthleteProfile, 'id'>>
      }
      nil_outreach: {
        Row: NILOutreach
        Insert: Omit<NILOutreach, 'id' | 'created_at'>
        Update: Partial<Omit<NILOutreach, 'id'>>
      }
      nil_compliance_items: {
        Row: NILComplianceItem
        Insert: Omit<NILComplianceItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NILComplianceItem, 'id'>>
      }
      nil_tasks: {
        Row: NILTask
        Insert: Omit<NILTask, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NILTask, 'id'>>
      }
      community_posts: {
        Row: CommunityPost
        Insert: Omit<CommunityPost, 'id' | 'created_at'>
        Update: Partial<Omit<CommunityPost, 'id'>>
      }
      community_likes: {
        Row: { id: string; post_id: string; user_id: string; created_at: string }
        Insert: { post_id: string; user_id: string }
        Update: never
      }
      community_comments: {
        Row: CommunityComment
        Insert: Omit<CommunityComment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CommunityComment, 'id'>>
      }
      community_post_reports: {
        Row: CommunityPostReport
        Insert: Omit<CommunityPostReport, 'id' | 'created_at' | 'updated_at' | 'resolved_at' | 'resolved_by'>
        Update: Partial<Omit<CommunityPostReport, 'id' | 'reporter_id' | 'post_id'>>
      }
      community_audit_logs: {
        Row: CommunityAuditLog
        Insert: Omit<CommunityAuditLog, 'id' | 'created_at'>
        Update: never
      }
      community_memberships: {
        Row: CommunityMembership
        Insert: Omit<CommunityMembership, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CommunityMembership, 'id' | 'user_id'>>
      }
      training_videos: {
        Row: TrainingVideo
        Insert: Omit<TrainingVideo, 'id' | 'created_at'>
        Update: Partial<Omit<TrainingVideo, 'id'>>
      }
      member_connections: {
        Row: { id: string; requester_id: string; target_id: string; status: string; created_at: string; updated_at: string }
        Insert: { requester_id: string; target_id: string; status?: string }
        Update: { status?: string }
      }
      conversations: {
        Row: { id: string; participant_one: string; participant_two: string; last_message: string; last_timestamp: string; participant_one_unread: number; participant_two_unread: number; created_at: string }
        Insert: { participant_one: string; participant_two: string }
        Update: { last_message?: string; last_timestamp?: string; participant_one_unread?: number; participant_two_unread?: number }
      }
      messages: {
        Row: { id: string; conversation_id: string; sender_id: string; content: string; created_at: string; read: boolean }
        Insert: { conversation_id: string; sender_id: string; content: string }
        Update: { read?: boolean }
      }
      member_profiles: {
        Row: MemberProfile
        Insert: Omit<MemberProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MemberProfile, 'id'>>
      }
      media_channels: {
        Row: MediaChannel
        Insert: Omit<MediaChannel, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MediaChannel, 'id'>>
      }
      media_assets: {
        Row: MediaAsset
        Insert: Omit<MediaAsset, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MediaAsset, 'id'>>
      }
      channel_schedules: {
        Row: ChannelSchedule
        Insert: Omit<ChannelSchedule, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ChannelSchedule, 'id'>>
      }
      ad_slots: {
        Row: AdSlot
        Insert: Omit<AdSlot, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AdSlot, 'id'>>
      }
      epg_programs: {
        Row: EPGProgram
        Insert: Omit<EPGProgram, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EPGProgram, 'id'>>
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>
        Update: never
      }
      analytics_aggregates: {
        Row: AnalyticsAggregate
        Insert: Omit<AnalyticsAggregate, 'id' | 'created_at'>
        Update: never
      }
      white_label_tenants: {
        Row: WhiteLabelTenant
        Insert: Omit<WhiteLabelTenant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WhiteLabelTenant, 'id'>>
      }
    }
  }
}

export interface PlayerProfile {
  id: string
  user_id: string | null
  slug: string | null
  first_name: string
  last_name: string
  display_name: string | null
  class_year: number | null
  grade: string | null
  birth_year: number | null
  position: string | null
  secondary_position: string | null
  height: string | null
  city: string | null
  state: string | null
  school_name: string | null
  team_name: string | null
  jersey_number: string | null
  gpa: number | null
  bio: string | null
  coach_name: string | null
  coach_email: string | null
  is_public: boolean
  profile_completion_percent: number
  instagram_handle: string | null
  twitter_handle: string | null
  film_url: string | null
  profile_image_url: string | null
  overall_score: number | null
  created_at: string
  updated_at: string
}

export interface ServiceOffer {
  id: string
  slug: string
  name: string
  category: string
  description: string | null
  price_cents: number
  active: boolean
  created_at: string
}

export interface ServiceOrder {
  id: string
  service_offer_id: string
  customer_user_id: string | null
  player_profile_id: string | null
  assigned_to: string | null
  status: ServiceStatus
  stripe_checkout_session_id: string | null
  intake_complete: boolean
  due_at: string | null
  completed_at: string | null
  created_at: string
}

export interface AuditSubmission {
  id: string
  service_order_id: string | null
  customer_user_id: string | null
  player_profile_id: string | null
  goals: string | null
  target_schools: string | null
  current_film_status: string | null
  event_schedule_notes: string | null
  biggest_concern: string | null
  submitted_at: string
}

export interface AuditResult {
  id: string
  audit_submission_id: string
  readiness_band: string | null
  total_score: number | null
  strengths: string | null
  gaps: string | null
  priority_actions: string | null
  recommended_offer_slug: string | null
  created_by: string | null
  created_at: string
}

export interface ReadinessScore {
  id: string
  player_profile_id: string
  overall_score: number
  bio_score: number | null
  film_score: number | null
  academics_score: number | null
  events_score: number | null
  professionalism_score: number | null
  notes: string | null
  calculated_by: string | null
  created_at: string
}

export interface PlayerEvent {
  id: string
  player_profile_id: string
  title: string
  location: string | null
  city: string | null
  state: string | null
  start_date: string | null
  end_date: string | null
  team_name: string | null
  jersey_number: string | null
  notes: string | null
  created_at: string
}

export interface PlayerTask {
  id: string
  player_profile_id: string
  task_type: string
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  created_at: string
}

export interface Lead {
  id: string
  lead_type: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  source: string | null
  interest: string | null
  status: LeadStatus
  created_at: string
}

export type NILCompanyStatus = 'prospect' | 'outreach' | 'negotiating' | 'partner' | 'inactive'

export interface NILCompany {
  id: string
  name: string
  industry: string
  contact_name: string
  contact_email: string
  website: string
  notes: string
  status: NILCompanyStatus
  created_at: string
  updated_at: string
}

export interface NILOpportunity {
  id: string
  company_id: string | null
  title: string
  description: string
  value_cents: number
  deadline: string | null
  status: NILOpportunityStatus
  created_at: string
  updated_at: string
}

export interface NILAthleteProfile {
  id: string
  player_profile_id: string
  display_name: string
  position: string
  class_year: number | null
  followers: string
  readiness_score: number
  tier: NILTier
  opted_in: boolean
  created_at: string
  updated_at: string
}

export type NILOutreachStatus = 'draft' | 'sent' | 'replied' | 'ignored'

export interface NILOutreach {
  id: string
  athlete_id: string | null
  company_id: string | null
  subject: string
  status: NILOutreachStatus
  sent_at: string | null
  notes: string
  created_at: string
}

export interface NILComplianceItem {
  id: string
  athlete_name: string
  opportunity_name: string
  items: string[]
  status: 'pending' | 'approved' | 'error'
  athlete_profile_id: string | null
  created_at: string
  updated_at: string
}

export interface NILTask {
  id: string
  title: string
  target: string
  priority: NILTaskPriority
  status: NILTaskStatus
  due_date: string | null
  steps: TaskStep[]
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TaskStep {
  id: string
  label: string
  done: boolean
}

export interface CommunityPost {
  id: string
  author_id: string
  author_name: string
  author_role: ConnectRole | 'club_admin'
  content: string
  image_url: string
  created_at: string
  like_count: number
  comment_count: number
}

export interface CommunityComment {
  id: string
  post_id: string
  author_id: string
  author_name: string
  author_role: ConnectRole
  parent_comment_id: string | null
  content: string
  created_at: string
  updated_at: string
}

export interface CommunityPostReport {
  id: string
  post_id: string
  reporter_id: string
  reason: CommunityReportReason
  details: string
  status: 'open' | 'reviewing' | 'resolved' | 'rejected'
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  updated_at: string
}

export interface CommunityAuditLog {
  id: string
  actor_user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface CommunityMembership {
  id: string
  user_id: string
  status: CommunityMembershipStatus
  tier: CommunityMembershipTier
  invited_by: string | null
  approved_at: string | null
  expires_at: string | null
  notes: string
  created_at: string
  updated_at: string
}

export interface TrainingVideo {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration_minutes: number
  thumbnail_url: string
  video_url: string
  lesson_count: number
  created_at: string
}

export interface MemberProfile {
  id: string
  user_id: string
  display_name: string
  role: ConnectRole
  bio: string
  avatar_url: string
  location: string
  email_visibility: 'public' | 'connections' | 'private'
  created_at: string
  updated_at: string
}

export interface Tournament {
  id: string
  title: string
  description: string
  location: string
  address: string
  start_date: string | null
  end_date: string | null
  registration_deadline: string | null
  entry_fee: number
  max_teams: number
  current_teams: number
  age_groups: string[]
  divisions: string[]
  format: string
  prize_description: string
  image_url: string
  registration_link: string
  organizer_id: string | null
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  event_type: string
  location: string
  address: string
  start_date: string | null
  end_date: string | null
  price: number
  max_participants: number
  current_participants: number
  image_url: string
  registration_link: string
  organizer_id: string | null
  age_groups: string[]
  status: 'draft' | 'published' | 'cancelled'
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  coach_id: string | null
  title: string
  description: string
  category: string
  level: string
  price: number
  duration_weeks: number
  sessions_per_week: number
  max_participants: number
  current_participants: number
  image_url: string
  location: string
  schedule: string
  age_min: number
  age_max: number
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  player_profile_id: string | null
  status: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export interface CoachProfile {
  id: string
  user_id: string | null
  first_name: string | null
  last_name: string | null
  title: string | null
  organization: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface AssistantSession {
  id: string
  coach_id: string
  player_name: string | null
  title: string
  created_at: string
  updated_at: string
}

export interface AssistantMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface SiteContent {
  id: string
  page: string
  section: string
  content: string
  created_at: string
  updated_at: string
}

// ======== MEDIA PLATFORM TYPES (Phase 7) ========

export type ChannelType = 'live' | 'linear' | 'vod'
export type ChannelStatus = 'draft' | 'active' | 'paused' | 'archived'
export type AssetStatus = 'draft' | 'processing' | 'ready' | 'failed' | 'archived'
export type AdPosition = 'pre' | 'mid' | 'post'
export type RepeatRule = 'none' | 'daily' | 'weekly'
export type AnalyticsEventType = 'play' | 'pause' | 'stop' | 'heartbeat' | 'seek' | 'ad_start' | 'ad_end' | 'fullscreen' | 'quality_change'
export type TenantStatus = 'active' | 'suspended' | 'archived'

export interface ChannelBranding {
  logo_url: string
  primary_color: string
  secondary_color: string
  font_family: string
}

export interface MediaChannel {
  id: string
  slug: string
  name: string
  description: string
  channel_type: ChannelType
  status: ChannelStatus
  branding: ChannelBranding
  custom_domain: string | null
  cname_target: string | null
  stream_url: string | null
  thumbnail_url: string
  is_public: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface MediaAsset {
  id: string
  title: string
  description: string
  duration_seconds: number
  storage_path: string
  thumbnail_url: string
  status: AssetStatus
  category: string
  tags: string[]
  metadata: Record<string, unknown>
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ChannelSchedule {
  id: string
  channel_id: string
  asset_id: string
  scheduled_start: string
  scheduled_end: string
  position: number
  repeat_rule: RepeatRule
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdSlot {
  id: string
  channel_id: string
  position: AdPosition
  duration_seconds: number
  ad_tag_url: string
  scte35_cue: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EPGProgram {
  id: string
  channel_id: string
  asset_id: string | null
  start_time: string
  end_time: string
  title: string
  description: string
  episode_number: number | null
  season_number: number | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  channel_id: string | null
  asset_id: string | null
  viewer_id: string | null
  session_id: string
  event_type: AnalyticsEventType
  watch_seconds: number
  metadata: Record<string, unknown>
  created_at: string
}

export interface AnalyticsAggregate {
  id: string
  channel_id: string | null
  asset_id: string | null
  hour_bucket: string
  total_plays: number
  total_watch_seconds: number
  unique_viewers: number
  peak_concurrent: number
  ad_plays: number
  ad_completions: number
  created_at: string
}

export interface WhiteLabelTenant {
  id: string
  name: string
  slug: string
  custom_domain: string | null
  cname_target: string | null
  player_branding: Record<string, unknown>
  status: TenantStatus
  max_channels: number
  max_storage_gb: number
  created_at: string
  updated_at: string
}
