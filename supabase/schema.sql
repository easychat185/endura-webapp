-- ENDURA Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free','pro','premium')),
  onboarding_completed BOOLEAN DEFAULT false,
  program_week INTEGER DEFAULT 1,
  program_length INTEGER DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- ONBOARDING RESPONSES
-- ============================================================
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  age INTEGER,
  relationship TEXT,
  duration TEXT,
  control INTEGER,
  confidence INTEGER,
  relationships TEXT,
  anxiety TEXT,
  previous_attempts TEXT[],
  held_back TEXT[],
  activity TEXT,
  stress INTEGER,
  sleep INTEGER,
  goals TEXT[],
  timeline TEXT,
  commitment INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own onboarding" ON onboarding_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding" ON onboarding_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding" ON onboarding_responses FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_number INTEGER NOT NULL,
  summary TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_conversations_user_started ON conversations(user_id, started_at DESC);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender TEXT CHECK (sender IN ('user','maya')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_messages_user_created ON messages(user_id, created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);

-- ============================================================
-- DAILY SCORES
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  control_score INTEGER CHECK (control_score BETWEEN 1 AND 10),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 10),
  awareness_score INTEGER CHECK (awareness_score BETWEEN 1 AND 10),
  logged_at DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, logged_at)
);

ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scores" ON daily_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON daily_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON daily_scores FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_daily_scores_user_date ON daily_scores(user_id, logged_at DESC);

-- ============================================================
-- MILESTONES
-- ============================================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own milestones" ON milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON milestones FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- EXERCISE COMPLETIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS exercise_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_slug TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exercise_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own completions" ON exercise_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON exercise_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_exercise_completions_user ON exercise_completions(user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- GAMIFICATION: USER_GAMIFICATION (core XP/level/streak)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_gamification (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  streak_shields INTEGER DEFAULT 0,
  leaderboard_opt_in BOOLEAN DEFAULT false
);

ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gamification" ON user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own gamification" ON user_gamification FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gamification" ON user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GAMIFICATION: XP_TRANSACTIONS (audit log)
-- ============================================================
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_id TEXT,
  multiplier NUMERIC(3,1) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own xp_transactions" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp_transactions" ON xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_xp_transactions_user_date ON xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_xp_transactions_source ON xp_transactions(user_id, source, source_id);

-- ============================================================
-- GAMIFICATION: BADGES (reference table — seeded)
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common','uncommon','rare','legendary')),
  xp_reward INTEGER DEFAULT 30,
  category TEXT NOT NULL
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);

-- ============================================================
-- GAMIFICATION: USER_BADGES (earned badges)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT REFERENCES badges(id) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- ============================================================
-- GAMIFICATION: DAILY_ACTIVITY (real streak tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  actions JSONB DEFAULT '{}',
  xp_earned INTEGER DEFAULT 0,
  multiplier_applied NUMERIC(3,1) DEFAULT 1.0,
  UNIQUE(user_id, activity_date)
);

ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON daily_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity" ON daily_activity FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);

-- ============================================================
-- GAMIFICATION: DAILY_CHALLENGES (per-user daily state)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_date DATE NOT NULL,
  challenges JSONB NOT NULL,
  all_completed BOOLEAN DEFAULT false,
  bonus_claimed BOOLEAN DEFAULT false,
  UNIQUE(user_id, challenge_date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own challenges" ON daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenges" ON daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenges" ON daily_challenges FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- GAMIFICATION: XP_EVENTS (admin-managed boost events)
-- ============================================================
CREATE TABLE IF NOT EXISTS xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  multiplier NUMERIC(3,1) DEFAULT 2.0,
  source_filter TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN DEFAULT true
);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active events" ON xp_events FOR SELECT USING (true);

-- ============================================================
-- GAMIFICATION: LEADERBOARD_CACHE (periodically refreshed)
-- ============================================================
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('weekly','monthly','alltime')),
  period_key TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  display_name TEXT,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  badge_count INTEGER DEFAULT 0,
  UNIQUE(user_id, period, period_key)
);

ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard readable by all" ON leaderboard_cache FOR SELECT USING (true);
CREATE POLICY "Users can insert own leaderboard" ON leaderboard_cache FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard" ON leaderboard_cache FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_leaderboard_period ON leaderboard_cache(period, period_key, rank);

-- ============================================================
-- SEED: Badge definitions
-- ============================================================
INSERT INTO badges (id, label, description, icon, rarity, xp_reward, category) VALUES
  ('streak_3', 'Streak Starter', 'Maintain a 3-day streak', 'flame', 'common', 30, 'streak'),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day streak', 'flame', 'uncommon', 30, 'streak'),
  ('streak_14', 'Fortnight Fighter', 'Maintain a 14-day streak', 'flame', 'uncommon', 30, 'streak'),
  ('streak_30', 'Monthly Master', 'Maintain a 30-day streak', 'flame', 'rare', 30, 'streak'),
  ('streak_100', 'Century Club', 'Maintain a 100-day streak', 'flame', 'legendary', 30, 'streak'),
  ('technique_collector', 'Technique Collector', 'Complete all 7 exercises', 'trophy', 'uncommon', 30, 'exercise'),
  ('early_bird', 'Early Bird', 'Complete an exercise before 8 AM', 'sun', 'common', 30, 'exercise'),
  ('speed_runner', 'Speed Runner', 'Complete an exercise in record time', 'zap', 'common', 30, 'exercise'),
  ('chat_25', 'Chat Champion', 'Complete 25 sessions with Dr. Maya', 'message-circle', 'uncommon', 30, 'session'),
  ('chat_50', 'Deep Diver', 'Complete 50 sessions with Dr. Maya', 'message-circle', 'rare', 30, 'session'),
  ('score_climber', 'Score Climber', 'Improve control score by 3 from start', 'trending-up', 'uncommon', 30, 'score'),
  ('confidence_king', 'Confidence King', 'Reach confidence score of 8+', 'crown', 'rare', 30, 'score'),
  ('full_control', 'Full Control', 'Reach control score of 9+', 'shield', 'rare', 30, 'score'),
  ('zen_master', 'Zen Master', 'Reach awareness score of 9+', 'brain', 'rare', 30, 'score'),
  ('triple_threat', 'Triple Threat', 'All three scores at 7+', 'award', 'rare', 30, 'score'),
  ('perfect_10', 'Perfect 10', 'Any score reaches 10', 'star', 'legendary', 30, 'score'),
  ('level_5', 'Level 5', 'Reach Level 5', 'badge', 'uncommon', 30, 'level'),
  ('level_10', 'Level 10', 'Reach Level 10', 'badge', 'rare', 30, 'level'),
  ('level_15', 'Level 15', 'Reach Level 15', 'badge', 'legendary', 30, 'level'),
  ('first_steps', 'First Steps', 'Complete onboarding', 'footprints', 'common', 30, 'special'),
  ('night_owl', 'Night Owl', 'Log scores after 10 PM', 'moon', 'common', 30, 'special'),
  ('consistency_pro', 'Consistency Pro', 'Log scores 20 days in a row', 'calendar-check', 'rare', 30, 'special'),
  ('weekend_warrior', 'Weekend Warrior', 'Exercises on Saturday and Sunday', 'calendar', 'uncommon', 30, 'special'),
  ('explorer', 'Explorer', 'Visit all app sections in one day', 'compass', 'common', 30, 'special')
ON CONFLICT (id) DO NOTHING;
