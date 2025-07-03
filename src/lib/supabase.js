import { createClient } from '@supabase/supabase-js'

// These would normally be environment variables
// For demo purposes, you'll need to replace these with your actual Supabase project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema for games table:
/*
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id TEXT UNIQUE NOT NULL,
  player_x_name TEXT,
  player_o_name TEXT,
  board JSONB DEFAULT '[]'::jsonb,
  current_turn TEXT DEFAULT 'X',
  winner TEXT,
  winning_line JSONB,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'playing', 'finished'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you might want to restrict this in production)
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
*/