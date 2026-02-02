-- ============================================
-- Supabase Database Schema
-- ============================================
-- Run these SQL commands in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)

-- Enable Row Level Security
-- This ensures users can only modify their own data

-- ============================================
-- 1. TRAILER TABLE
-- ============================================
-- Stores information about the trailer location

CREATE TABLE IF NOT EXISTS trailer (
    id BIGSERIAL PRIMARY KEY,
    current_location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trailer ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read trailer info
CREATE POLICY "Allow public read access" ON trailer
    FOR SELECT USING (true);

-- Only authenticated users can update
CREATE POLICY "Allow authenticated users to update" ON trailer
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can insert
CREATE POLICY "Allow authenticated users to insert" ON trailer
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 2. RESERVATIONS TABLE
-- ============================================
-- Stores trailer reservations

CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read reservations (so they can see availability)
CREATE POLICY "Allow public read access" ON reservations
    FOR SELECT USING (true);

-- Only authenticated users can create reservations
CREATE POLICY "Allow authenticated users to insert" ON reservations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can only update their own reservations
CREATE POLICY "Allow users to update own reservations" ON reservations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own reservations
CREATE POLICY "Allow users to delete own reservations" ON reservations
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================
-- Update the updated_at timestamp automatically

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. INSERT DEFAULT DATA
-- ============================================
-- Insert a default trailer entry

INSERT INTO trailer (current_location, latitude, longitude)
VALUES ('Home Base', 37.7749, -122.4194)
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES FOR SETUP:
-- ============================================
-- 1. Go to https://app.supabase.com
-- 2. Create a new project
-- 3. Go to SQL Editor
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute
-- 6. Go to Settings > API to get your:
--    - Project URL
--    - anon/public key
-- 7. Add these to config.js file
-- ============================================
