export type UserRole = 'player' | 'parent' | 'coach' | 'club_admin' | 'admin'

export type ServiceStatus =
  | 'new'
  | 'awaiting_intake'
  | 'in_review'
  | 'needs_assets'
  | 'assigned'
  | 'in_progress'
  | 'awaiting_client_feedback'
  | 'complete'
  | 'archived'
