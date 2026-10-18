
-- Private, player-owned recruiting relationship records.
-- Do not deploy until migration review; this migration does not send messages.
CREATE TABLE IF NOT EXISTS public.recruiting_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_profile_id uuid NOT NULL REFERENCES public.player_profiles(id) ON DELETE CASCADE,
  college_name text NOT NULL CHECK (length(trim(college_name)) BETWEEN 2 AND 180),
  division text NOT NULL DEFAULT 'unknown'
    CHECK (division IN ('unknown','ncaa_d1','ncaa_d2','ncaa_d3','naia','njcaa','other')),
  coach_name text NOT NULL DEFAULT '',
  coach_email text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'research'
    CHECK (source IN ('research','email','x','referral','event','inbound','other')),
  stage text NOT NULL DEFAULT 'researching'
    CHECK (stage IN ('researching','ready','contacted','responded','evaluating','visit','offer_reported','committed','closed')),
  next_action text NOT NULL DEFAULT '',
  next_action_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recruiting_targets_owner_profile_idx
 ON public.recruiting_targets(owner_user_id, player_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS recruiting_targets_owner_due_idx
 ON public.recruiting_targets(owner_user_id, next_action_date);
ALTER TABLE public.recruiting_targets ENABLE ROW LEVEL SECURITY;

-- The account must own the player profile. Public profiles do NOT confer access.
CREATE POLICY "Players manage only their own recruiting targets"
ON public.recruiting_targets FOR ALL TO authenticated
USING (
  owner_user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.player_profiles p
    WHERE p.id = player_profile_id AND p.user_id = auth.uid())
)
WITH CHECK (
  owner_user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.player_profiles p
    WHERE p.id = player_profile_id AND p.user_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS public.recruiting_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES public.recruiting_targets(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email','x','text','phone','event','referral','other')),
  direction text NOT NULL CHECK (direction IN ('outbound','inbound','in_person')),
  summary text NOT NULL CHECK (length(trim(summary)) BETWEEN 3 AND 2000),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recruiting_interactions_owner_target_idx
 ON public.recruiting_interactions(owner_user_id, target_id, occurred_at DESC);
ALTER TABLE public.recruiting_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players manage only their own recruiting interactions"
ON public.recruiting_interactions FOR ALL TO authenticated
USING (
  owner_user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.recruiting_targets t
    JOIN public.player_profiles p ON p.id = t.player_profile_id
    WHERE t.id = target_id AND t.owner_user_id = auth.uid() AND p.user_id = auth.uid())
)
WITH CHECK (
  owner_user_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.recruiting_targets t
    JOIN public.player_profiles p ON p.id = t.player_profile_id
    WHERE t.id = target_id AND t.owner_user_id = auth.uid() AND p.user_id = auth.uid())
);

COMMENT ON TABLE public.recruiting_targets IS
'Player-owned recruiting CRM. All stages and offers are self-reported, not verified scholarship decisions.';
COMMENT ON TABLE public.recruiting_interactions IS
'Manual record of recruiting communications, not an outbound messaging service.';
