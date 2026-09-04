-- DMA Internship Applications Table
-- Run this SQL in your Supabase SQL Editor to create the table

BEGIN;

-- Create internship_applications table
CREATE TABLE IF NOT EXISTS internship_applications (
  id BIGSERIAL PRIMARY KEY,
  reference_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  date_of_birth DATE,
  education_level TEXT,
  field_of_study TEXT,
  institution TEXT,
  graduation_year TEXT,
  current_role TEXT,
  years_experience TEXT,
  maritime_background TEXT,
  department_preference_1 TEXT,
  department_preference_2 TEXT,
  motivation TEXT,
  relevant_skills TEXT,
  cv_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Submitted',
  score INTEGER CHECK (score IS NULL OR (score >= 1 AND score <= 5)),
  reviewer_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for query optimization
CREATE INDEX IF NOT EXISTS internship_app_status_idx ON internship_applications(status);
CREATE INDEX IF NOT EXISTS internship_app_dept_idx ON internship_applications(department_preference_1);
CREATE INDEX IF NOT EXISTS internship_app_email_idx ON internship_applications(email);
CREATE INDEX IF NOT EXISTS internship_app_created_idx ON internship_applications(created_at DESC);

-- Setup Row Level Security (RLS)
ALTER TABLE internship_applications ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (application submissions)
CREATE POLICY "allow_public_insert_internship" ON internship_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all applications (admin dashboard)
CREATE POLICY "allow_admin_read_internship" ON internship_applications
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update applications (admin dashboard)
CREATE POLICY "allow_admin_update_internship" ON internship_applications
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_internship_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER internship_applications_updated_at
  BEFORE UPDATE ON internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_internship_updated_at();

COMMIT;