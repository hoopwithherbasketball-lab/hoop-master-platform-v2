export type UserRole = 'player' | 'parent' | 'coach' | 'club_admin' | 'admin' | 'service_specialist'
export type ServiceStatus = 'new' | 'awaiting_intake' | 'in_review' | 'needs_assets' | 'assigned' | 'in_progress' | 'awaiting_client_feedback' | 'complete' | 'archived'
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'dismissed'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'booked' | 'won' | 'nurture' | 'lost'

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
