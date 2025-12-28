-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Aplikasi: Marketer Berkah - Amalan Harian
-- Version: 2.0
-- Updated: 2025-12-28
-- ============================================

-- ============================================
-- 1. TABLE: user_progress
-- Menyimpan progress amalan harian user
-- ============================================

CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_date_value TEXT NOT NULL,
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON user_progress(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view partner progress" ON user_progress;

-- Policies untuk user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Partner bisa melihat progress partner
CREATE POLICY "Users can view partner progress"
  ON user_progress FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM partnerships
      WHERE (
        (user1_id = auth.uid() AND user2_id = user_progress.user_id) OR
        (user1_id = user_progress.user_id AND user2_id = auth.uid())
      )
      AND status = 'accepted'
    )
  );

-- ============================================
-- 2. TABLE: partnerships
-- Relasi kemitraan antar user
-- ============================================

CREATE TABLE IF NOT EXISTS partnerships (
  id BIGSERIAL PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id)
);

-- Index untuk partnerships
CREATE INDEX IF NOT EXISTS idx_partnerships_user1 ON partnerships(user1_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_user2 ON partnerships(user2_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON partnerships(status);
CREATE INDEX IF NOT EXISTS idx_partnerships_invited_by ON partnerships(invited_by);

-- Enable RLS untuk partnerships
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own partnerships" ON partnerships;
DROP POLICY IF EXISTS "Users can create partnerships" ON partnerships;
DROP POLICY IF EXISTS "Users can update own partnerships" ON partnerships;
DROP POLICY IF EXISTS "Users can delete own partnerships" ON partnerships;

-- Policies untuk partnerships
CREATE POLICY "Users can view own partnerships"
  ON partnerships FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create partnerships"
  ON partnerships FOR INSERT
  WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update own partnerships"
  ON partnerships FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can delete own partnerships"
  ON partnerships FOR DELETE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================
-- 3. TABLE: messages
-- Pesan motivasi antar partner
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (sender_id != receiver_id)
);

-- Index untuk messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);

-- Enable RLS untuk messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update received messages" ON messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON messages;

-- Policies untuk messages
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM partnerships
      WHERE (
        (user1_id = auth.uid() AND user2_id = messages.receiver_id) OR
        (user1_id = messages.receiver_id AND user2_id = auth.uid())
      )
      AND status = 'accepted'
    )
  );

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk user_progress
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk partnerships
DROP TRIGGER IF EXISTS update_partnerships_updated_at ON partnerships;
CREATE TRIGGER update_partnerships_updated_at
  BEFORE UPDATE ON partnerships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. RPC FUNCTIONS
-- ============================================

-- Function: Get partner progress
CREATE OR REPLACE FUNCTION get_partner_progress(partner_user_id UUID)
RETURNS TABLE (
  current_date_value TEXT,
  progress JSONB
) AS $$
BEGIN
  -- Check if partnership exists and is accepted
  IF EXISTS (
    SELECT 1 FROM partnerships
    WHERE (
      (user1_id = auth.uid() AND user2_id = partner_user_id) OR
      (user1_id = partner_user_id AND user2_id = auth.uid())
    )
    AND status = 'accepted'
  ) THEN
    RETURN QUERY
    SELECT up.current_date_value, up.progress
    FROM user_progress up
    WHERE up.user_id = partner_user_id;
  END IF;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user stats (summary)
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_days INTEGER,
  total_completed_habits BIGINT,
  avg_completion_percentage NUMERIC
) AS $$
DECLARE
  uid UUID;
BEGIN
  uid := COALESCE(target_user_id, auth.uid());
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(DISTINCT key)::INTEGER 
     FROM user_progress up, jsonb_each(up.progress) 
     WHERE up.user_id = uid) as total_days,
    (SELECT COALESCE(SUM(jsonb_array_length(value->'completedHabitIds')), 0)::BIGINT
     FROM user_progress up, jsonb_each(up.progress)
     WHERE up.user_id = uid) as total_completed_habits,
    (SELECT COALESCE(AVG(jsonb_array_length(value->'completedHabitIds')::NUMERIC / 15 * 100), 0)
     FROM user_progress up, jsonb_each(up.progress)
     WHERE up.user_id = uid) as avg_completion_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Search user by email (for partnership invitation)
CREATE OR REPLACE FUNCTION search_user_by_email(search_email TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email::TEXT as email,
    COALESCE(au.raw_user_meta_data->>'name', au.email)::TEXT as display_name
  FROM auth.users au
  WHERE au.email = search_email
  AND au.id != auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. REALTIME SUBSCRIPTIONS
-- Enable realtime for tables
-- ============================================

-- Enable realtime for user_progress
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;

-- Enable realtime for partnerships
ALTER PUBLICATION supabase_realtime ADD TABLE partnerships;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================
-- 5. TABLE: app_settings
-- Menyimpan pengaturan aplikasi (nama web, logo, favicon)
-- ============================================

CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);

-- Enable Row Level Security (RLS)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view settings" ON app_settings;
DROP POLICY IF EXISTS "Only admin can update settings" ON app_settings;
DROP POLICY IF EXISTS "Only admin can insert settings" ON app_settings;

-- Policies untuk app_settings
-- Semua user bisa lihat settings (untuk tampilan web)
CREATE POLICY "Anyone can view settings"
  ON app_settings FOR SELECT
  USING (true);

-- Hanya admin yang bisa update settings
CREATE POLICY "Only admin can update settings"
  ON app_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'galuhmediautama@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'galuhmediautama@gmail.com'
    )
  );

-- Policy untuk insert (hanya admin)
CREATE POLICY "Only admin can insert settings"
  ON app_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'galuhmediautama@gmail.com'
    )
  );

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value) 
VALUES 
  ('app_name', 'Amalan Marketer Berkah'),
  ('app_logo', ''),
  ('app_favicon', '')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- PANDUAN PENGGUNAAN
-- ============================================
-- 
-- 1. Buka Supabase Dashboard
-- 2. Pergi ke SQL Editor
-- 3. Copy seluruh isi file ini
-- 4. Paste dan klik "Run"
-- 
-- Jika ada error "already exists":
-- - Ini normal jika tabel/policy sudah ada
-- - Script ini sudah menghandle dengan DROP IF EXISTS
-- 
-- Untuk reset total (HATI-HATI - DATA HILANG):
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS partnerships CASCADE;
-- DROP TABLE IF EXISTS user_progress CASCADE;
-- DROP TABLE IF EXISTS app_settings CASCADE;
-- Lalu jalankan script ini lagi
-- ============================================
