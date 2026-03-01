-- Gamification Migration
-- Run this in Supabase SQL Editor to add gamification tables to existing database
-- Safe to run multiple times (IF NOT EXISTS / ON CONFLICT)

-- 1. user_gamification
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
DO $$ BEGIN
  CREATE POLICY "Users can view own gamification" ON user_gamification FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own gamification" ON user_gamification FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own gamification" ON user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. xp_transactions
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
DO $$ BEGIN
  CREATE POLICY "Users can view own xp_transactions" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own xp_transactions" ON xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_date ON xp_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_source ON xp_transactions(user_id, source, source_id);

-- 3. badges
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
DO $$ BEGIN
  CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT REFERENCES badges(id) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

-- 5. daily_activity
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
DO $$ BEGIN
  CREATE POLICY "Users can view own activity" ON daily_activity FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own activity" ON daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own activity" ON daily_activity FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);

-- 6. daily_challenges
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
DO $$ BEGIN
  CREATE POLICY "Users can view own challenges" ON daily_challenges FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own challenges" ON daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own challenges" ON daily_challenges FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. xp_events
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
DO $$ BEGIN
  CREATE POLICY "Anyone can read active events" ON xp_events FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. leaderboard_cache
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
DO $$ BEGIN
  CREATE POLICY "Leaderboard readable by all" ON leaderboard_cache FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own leaderboard" ON leaderboard_cache FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own leaderboard" ON leaderboard_cache FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_cache(period, period_key, rank);

-- 9. Seed badge definitions
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

-- 10. Initialize gamification for existing users
INSERT INTO user_gamification (user_id, total_xp, level, current_streak, longest_streak, streak_shields, leaderboard_opt_in)
SELECT id, 0, 1, 0, 0, 0, false FROM profiles
WHERE id NOT IN (SELECT user_id FROM user_gamification)
ON CONFLICT (user_id) DO NOTHING;
