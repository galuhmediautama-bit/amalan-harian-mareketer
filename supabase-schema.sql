-- Supabase Database Schema untuk Marketer Berkah

-- Table untuk menyimpan progress user
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

-- Policy: User hanya bisa akses data miliknya sendiri
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update updated_at
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table untuk partnerships (partner relationships)
CREATE TABLE IF NOT EXISTS partnerships (
  id BIGSERIAL PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
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

-- Enable RLS untuk partnerships
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view partnerships they're involved in
CREATE POLICY "Users can view own partnerships"
  ON partnerships
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policy: Users can create partnerships
CREATE POLICY "Users can create partnerships"
  ON partnerships
  FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policy: Users can update partnerships they're involved in
CREATE POLICY "Users can update own partnerships"
  ON partnerships
  FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Trigger untuk auto-update updated_at pada partnerships
CREATE TRIGGER update_partnerships_updated_at
  BEFORE UPDATE ON partnerships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table untuk messages (pesan motivasi antar partner)
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

-- Enable RLS untuk messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
  ON messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Users can send messages
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
  ON messages
  FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Function to get partner progress (allows viewing partner's data if partnership exists)
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

-- Alternative: RLS policy to allow viewing partner's progress
-- This allows partners to see each other's progress
CREATE POLICY "Users can view partner progress"
  ON user_progress
  FOR SELECT
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

