-- ============================================================
-- DMA Internship Portal — Complete Supabase Backend
-- Run this SQL in your Supabase SQL Editor
-- Does NOT touch existing dma_registrations or contact_messages tables
-- Safe to rerun: uses IF NOT EXISTS and conditional drops
-- ============================================================

BEGIN;

-- ============================================================
-- 1. APPLICATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS dma_internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Information
  application_reference TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  linkedin_url TEXT,
  professional_photo_url TEXT,
  referral_source TEXT,

  -- Professional Background
  current_status TEXT NOT NULL,
  current_role TEXT,
  organization TEXT,
  maritime_discipline TEXT NOT NULL,
  years_maritime_experience NUMERIC DEFAULT 0,
  maritime_background TEXT NOT NULL,

  -- Analytics Skills
  analytics_tools TEXT[] NOT NULL,
  analytics_level TEXT NOT NULL,
  analytics_training_completed BOOLEAN DEFAULT FALSE,
  analytics_course TEXT,
  analytics_provider TEXT,
  analytics_completion_date DATE,
  analytics_project_description TEXT NOT NULL,

  -- Portfolio & Documents
  cv_url TEXT NOT NULL,
  portfolio_url TEXT,
  github_url TEXT,
  powerbi_url TEXT,
  tableau_url TEXT,
  project_files TEXT[],
  supporting_document_url TEXT,

  -- Department Preferences
  first_department_choice TEXT NOT NULL,
  second_department_choice TEXT NOT NULL,
  third_department_choice TEXT NOT NULL,
  department_motivation TEXT,

  -- Motivation & Challenge
  internship_motivation TEXT NOT NULL,
  expected_outcome TEXT NOT NULL,
  maritime_problem TEXT NOT NULL,
  applied_challenge_response TEXT NOT NULL,

  -- Availability & Declarations
  weekly_commitment BOOLEAN NOT NULL DEFAULT FALSE,
  virtual_session_availability BOOLEAN NOT NULL DEFAULT FALSE,
  device_and_internet_access BOOLEAN NOT NULL DEFAULT FALSE,
  timezone TEXT NOT NULL,
  accessibility_needs TEXT,

  declaration_accuracy BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_unpaid_virtual BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_limited_positions BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_commitment BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
  terms_consent BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,

  -- Application Status & Scoring
  application_status TEXT NOT NULL DEFAULT 'Submitted',
  maritime_background_score INTEGER DEFAULT 0,
  analytics_knowledge_score INTEGER DEFAULT 0,
  portfolio_score INTEGER DEFAULT 0,
  motivation_score INTEGER DEFAULT 0,
  applied_challenge_score INTEGER DEFAULT 0,
  communication_commitment_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,

  assigned_reviewer UUID,
  reviewer_notes TEXT,
  internal_notes TEXT,

  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ============================================================
-- 2. DATABASE CONSTRAINTS (drop first for rerun safety)
-- ============================================================
DO $$
BEGIN
  -- Application status constraint
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_application_status') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_application_status;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_application_status
    CHECK (application_status IN (
      'Draft', 'Submitted', 'Under Review', 'Shortlisted',
      'Interview', 'Selected', 'Waitlisted', 'Not Selected', 'Withdrawn'
    ));

  -- Analytics level constraint
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_analytics_level') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_analytics_level;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_analytics_level
    CHECK (analytics_level IN ('Beginner', 'Intermediate', 'Advanced'));

  -- Score range constraints
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_maritime_bg_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_maritime_bg_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_maritime_bg_score
    CHECK (maritime_background_score BETWEEN 0 AND 20);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_analytics_knowledge_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_analytics_knowledge_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_analytics_knowledge_score
    CHECK (analytics_knowledge_score BETWEEN 0 AND 20);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_portfolio_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_portfolio_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_portfolio_score
    CHECK (portfolio_score BETWEEN 0 AND 20);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_motivation_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_motivation_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_motivation_score
    CHECK (motivation_score BETWEEN 0 AND 15);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_applied_challenge_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_applied_challenge_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_applied_challenge_score
    CHECK (applied_challenge_score BETWEEN 0 AND 15);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_communication_commitment_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_communication_commitment_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_communication_commitment_score
    CHECK (communication_commitment_score BETWEEN 0 AND 10);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_total_score') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_total_score;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_total_score
    CHECK (total_score BETWEEN 0 AND 100);

  -- Department choices must differ
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_dept_choices_differ') THEN
    ALTER TABLE dma_internship_applications DROP CONSTRAINT chk_dept_choices_differ;
  END IF;
  ALTER TABLE dma_internship_applications ADD CONSTRAINT chk_dept_choices_differ
    CHECK (first_department_choice != second_department_choice
      AND first_department_choice != third_department_choice
      AND second_department_choice != third_department_choice);
END;
$$;

-- ============================================================
-- 3. APPLICATION REFERENCE GENERATION
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS dma_internship_ref_seq START 1;

CREATE OR REPLACE FUNCTION generate_internship_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val BIGINT;
  ref_text TEXT;
BEGIN
  next_val := nextval('dma_internship_ref_seq');
  ref_text := 'DMA-2026-' || LPAD(next_val::TEXT, 4, '0');
  RETURN ref_text;
END;
$$;

CREATE OR REPLACE FUNCTION trg_generate_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.application_reference IS NULL OR NEW.application_reference = '' THEN
    NEW.application_reference := generate_internship_reference();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_internship_ref_before_insert ON dma_internship_applications;
CREATE TRIGGER trg_internship_ref_before_insert
  BEFORE INSERT ON dma_internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION trg_generate_reference();

-- ============================================================
-- 4. AUTOMATIC SCORE CALCULATION
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_internship_total_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.total_score :=
    COALESCE(NEW.maritime_background_score, 0) +
    COALESCE(NEW.analytics_knowledge_score, 0) +
    COALESCE(NEW.portfolio_score, 0) +
    COALESCE(NEW.motivation_score, 0) +
    COALESCE(NEW.applied_challenge_score, 0) +
    COALESCE(NEW.communication_commitment_score, 0);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calculate_total_score ON dma_internship_applications;
CREATE TRIGGER trg_calculate_total_score
  BEFORE INSERT OR UPDATE OF
    maritime_background_score,
    analytics_knowledge_score,
    portfolio_score,
    motivation_score,
    applied_challenge_score,
    communication_commitment_score
  ON dma_internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION calculate_internship_total_score();

-- ============================================================
-- 5. UPDATED TIMESTAMP TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_internship_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_internship_updated_at ON dma_internship_applications;
CREATE TRIGGER trg_internship_updated_at
  BEFORE UPDATE ON dma_internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_internship_updated_at();

-- ============================================================
-- 6. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_internship_app_status ON dma_internship_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_internship_app_email ON dma_internship_applications(email);
CREATE INDEX IF NOT EXISTS idx_internship_app_dept1 ON dma_internship_applications(first_department_choice);
CREATE INDEX IF NOT EXISTS idx_internship_app_country ON dma_internship_applications(country);
CREATE INDEX IF NOT EXISTS idx_internship_app_submitted ON dma_internship_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_internship_app_total_score ON dma_internship_applications(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_internship_app_discipline ON dma_internship_applications(maritime_discipline);

-- ============================================================
-- 7. ROW-LEVEL SECURITY
-- ============================================================
ALTER TABLE dma_internship_applications ENABLE ROW LEVEL SECURITY;

-- Public: may insert a new application
DROP POLICY IF EXISTS "public_insert_internship_application" ON dma_internship_applications;
CREATE POLICY "public_insert_internship_application" ON dma_internship_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Authenticated applicants: can read/update only their own Draft
DROP POLICY IF EXISTS "applicant_read_own_draft" ON dma_internship_applications;
CREATE POLICY "applicant_read_own_draft" ON dma_internship_applications
  FOR SELECT TO authenticated
  USING (email = auth.email() AND application_status = 'Draft');

DROP POLICY IF EXISTS "applicant_update_own_draft" ON dma_internship_applications;
CREATE POLICY "applicant_update_own_draft" ON dma_internship_applications
  FOR UPDATE TO authenticated
  USING (email = auth.email() AND application_status = 'Draft')
  WITH CHECK (email = auth.email() AND application_status = 'Draft');

-- Administrators: full access
DROP POLICY IF EXISTS "admin_read_all_internship" ON dma_internship_applications;
CREATE POLICY "admin_read_all_internship" ON dma_internship_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "admin_update_all_internship" ON dma_internship_applications;
CREATE POLICY "admin_update_all_internship" ON dma_internship_applications
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

-- ============================================================
-- 8. ADMIN PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_admin_role') THEN
    ALTER TABLE admin_profiles DROP CONSTRAINT chk_admin_role;
  END IF;
  ALTER TABLE admin_profiles ADD CONSTRAINT chk_admin_role
    CHECK (role IN ('Super Admin', 'Programme Director', 'Application Reviewer', 'Community Manager'));
END;
$$;

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_profiles" ON admin_profiles;
CREATE POLICY "admin_read_profiles" ON admin_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid() AND ap.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "super_admin_manage_profiles" ON admin_profiles;
CREATE POLICY "super_admin_manage_profiles" ON admin_profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
      AND ap.role IN ('Super Admin', 'Programme Director')
      AND ap.is_active = TRUE
    )
  );

-- ============================================================
-- 9. REVIEWER SCORE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS dma_internship_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES dma_internship_applications(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  maritime_background_score INTEGER,
  analytics_knowledge_score INTEGER,
  portfolio_score INTEGER,
  motivation_score INTEGER,
  applied_challenge_score INTEGER,
  communication_commitment_score INTEGER,
  total_score INTEGER,
  reviewer_comments TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, reviewer_id)
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_recommendation') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_recommendation;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_recommendation
    CHECK (recommendation IN ('Strongly Recommend', 'Recommend', 'Hold', 'Do Not Recommend'));

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_maritime_bg_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_maritime_bg_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_maritime_bg_score
    CHECK (maritime_background_score BETWEEN 0 AND 20);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_analytics_knowledge_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_analytics_knowledge_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_analytics_knowledge_score
    CHECK (analytics_knowledge_score BETWEEN 0 AND 20);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_portfolio_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_portfolio_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_portfolio_score
    CHECK (portfolio_score BETWEEN 0 AND 20);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_motivation_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_motivation_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_motivation_score
    CHECK (motivation_score BETWEEN 0 AND 15);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_applied_challenge_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_applied_challenge_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_applied_challenge_score
    CHECK (applied_challenge_score BETWEEN 0 AND 15);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_communication_commitment_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_communication_commitment_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_communication_commitment_score
    CHECK (communication_commitment_score BETWEEN 0 AND 10);

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rev_total_score') THEN
    ALTER TABLE dma_internship_reviews DROP CONSTRAINT chk_rev_total_score;
  END IF;
  ALTER TABLE dma_internship_reviews ADD CONSTRAINT chk_rev_total_score
    CHECK (total_score BETWEEN 0 AND 100);
END;
$$;

-- Auto-calculate reviewer total score
CREATE OR REPLACE FUNCTION calculate_review_total_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.total_score :=
    COALESCE(NEW.maritime_background_score, 0) +
    COALESCE(NEW.analytics_knowledge_score, 0) +
    COALESCE(NEW.portfolio_score, 0) +
    COALESCE(NEW.motivation_score, 0) +
    COALESCE(NEW.applied_challenge_score, 0) +
    COALESCE(NEW.communication_commitment_score, 0);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calculate_review_total_score ON dma_internship_reviews;
CREATE TRIGGER trg_calculate_review_total_score
  BEFORE INSERT OR UPDATE OF
    maritime_background_score,
    analytics_knowledge_score,
    portfolio_score,
    motivation_score,
    applied_challenge_score,
    communication_commitment_score
  ON dma_internship_reviews
  FOR EACH ROW
  EXECUTE FUNCTION calculate_review_total_score();

-- Review updated_at trigger
CREATE OR REPLACE FUNCTION update_review_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_review_updated_at ON dma_internship_reviews;
CREATE TRIGGER trg_review_updated_at
  BEFORE UPDATE ON dma_internship_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_review_updated_at();

ALTER TABLE dma_internship_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_reviews" ON dma_internship_reviews;
CREATE POLICY "admin_read_reviews" ON dma_internship_reviews
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "admin_insert_reviews" ON dma_internship_reviews;
CREATE POLICY "admin_insert_reviews" ON dma_internship_reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "admin_update_reviews" ON dma_internship_reviews;
CREATE POLICY "admin_update_reviews" ON dma_internship_reviews
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

-- ============================================================
-- 10. APPLICATION EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS dma_internship_application_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES dma_internship_applications(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dma_internship_application_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_events" ON dma_internship_application_events;
CREATE POLICY "admin_read_events" ON dma_internship_application_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "admin_insert_events" ON dma_internship_application_events;
CREATE POLICY "admin_insert_events" ON dma_internship_application_events
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

-- Auto-log status changes
CREATE OR REPLACE FUNCTION log_internship_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.application_status IS DISTINCT FROM NEW.application_status THEN
    INSERT INTO dma_internship_application_events (application_id, event_type, old_value, new_value, performed_by)
    VALUES (NEW.id, 'Status Changed', OLD.application_status, NEW.application_status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_status_change ON dma_internship_applications;
CREATE TRIGGER trg_log_status_change
  AFTER UPDATE OF application_status ON dma_internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_internship_status_change();

-- Auto-log score changes
CREATE OR REPLACE FUNCTION log_internship_score_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.maritime_background_score IS DISTINCT FROM NEW.maritime_background_score
    OR OLD.analytics_knowledge_score IS DISTINCT FROM NEW.analytics_knowledge_score
    OR OLD.portfolio_score IS DISTINCT FROM NEW.portfolio_score
    OR OLD.motivation_score IS DISTINCT FROM NEW.motivation_score
    OR OLD.applied_challenge_score IS DISTINCT FROM NEW.applied_challenge_score
    OR OLD.communication_commitment_score IS DISTINCT FROM NEW.communication_commitment_score
  THEN
    INSERT INTO dma_internship_application_events (application_id, event_type, old_value, new_value, performed_by)
    VALUES (NEW.id, 'Score Updated',
      'Total: ' || OLD.total_score,
      'Total: ' || NEW.total_score,
      auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_score_change ON dma_internship_applications;
CREATE TRIGGER trg_log_score_change
  AFTER UPDATE OF
    maritime_background_score,
    analytics_knowledge_score,
    portfolio_score,
    motivation_score,
    applied_challenge_score,
    communication_commitment_score
  ON dma_internship_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_internship_score_change();

-- ============================================================
-- 11. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('dma-internship-cvs', 'dma-internship-cvs', FALSE),
  ('dma-internship-portfolios', 'dma-internship-portfolios', FALSE),
  ('dma-internship-projects', 'dma-internship-projects', FALSE),
  ('dma-internship-supporting-documents', 'dma-internship-supporting-documents', FALSE),
  ('dma-internship-photos', 'dma-internship-photos', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Applicants can upload to their own folder
DROP POLICY IF EXISTS "applicant_upload_cv" ON storage.objects;
CREATE POLICY "applicant_upload_cv" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dma-internship-cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "applicant_upload_portfolio" ON storage.objects;
CREATE POLICY "applicant_upload_portfolio" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dma-internship-portfolios'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "applicant_upload_project" ON storage.objects;
CREATE POLICY "applicant_upload_project" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dma-internship-projects'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "applicant_upload_supporting" ON storage.objects;
CREATE POLICY "applicant_upload_supporting" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dma-internship-supporting-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "applicant_upload_photo" ON storage.objects;
CREATE POLICY "applicant_upload_photo" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dma-internship-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all files
DROP POLICY IF EXISTS "admin_read_internship_files" ON storage.objects;
CREATE POLICY "admin_read_internship_files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('dma-internship-cvs', 'dma-internship-portfolios', 'dma-internship-projects', 'dma-internship-supporting-documents', 'dma-internship-photos')
    AND EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

-- ============================================================
-- 12. ADMIN DASHBOARD VIEWS
-- ============================================================

CREATE OR REPLACE VIEW dma_internship_score_bands AS
SELECT
  id,
  application_reference,
  full_name,
  email,
  country,
  first_department_choice,
  application_status,
  total_score,
  CASE
    WHEN total_score >= 80 THEN 'Strong Candidate'
    WHEN total_score >= 65 THEN 'Competitive'
    WHEN total_score >= 50 THEN 'Review Required'
    ELSE 'Low Priority'
  END AS score_band
FROM dma_internship_applications
WHERE application_status NOT IN ('Draft', 'Withdrawn');

CREATE OR REPLACE VIEW dma_internship_summary AS
SELECT
  application_status,
  COUNT(*) AS count
FROM dma_internship_applications
GROUP BY application_status;

CREATE OR REPLACE VIEW dma_internship_dept_distribution AS
SELECT
  first_department_choice AS department,
  COUNT(*) AS applications
FROM dma_internship_applications
WHERE application_status != 'Draft'
GROUP BY first_department_choice
ORDER BY applications DESC;

CREATE OR REPLACE VIEW dma_internship_country_distribution AS
SELECT
  country,
  COUNT(*) AS applications
FROM dma_internship_applications
WHERE application_status != 'Draft'
GROUP BY country
ORDER BY applications DESC;

CREATE OR REPLACE VIEW dma_internship_review_flags AS
SELECT
  a.id AS application_id,
  a.application_reference,
  a.full_name,
  r1.reviewer_id AS reviewer_1,
  r1.total_score AS reviewer_1_score,
  r2.reviewer_id AS reviewer_2,
  r2.total_score AS reviewer_2_score,
  ABS(r1.total_score - r2.total_score) AS score_difference,
  CASE WHEN ABS(r1.total_score - r2.total_score) > 15 THEN TRUE ELSE FALSE END AS flagged
FROM dma_internship_applications a
JOIN dma_internship_reviews r1 ON r1.application_id = a.id
JOIN dma_internship_reviews r2 ON r2.application_id = a.id
  AND r2.reviewer_id > r1.reviewer_id;

COMMIT;