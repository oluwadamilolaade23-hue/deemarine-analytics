BEGIN;

CREATE TABLE IF NOT EXISTS dma_bluedata_hub_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_reference TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  current_status TEXT,
  organization TEXT,
  maritime_background TEXT NOT NULL,
  analytics_level TEXT NOT NULL,
  analytics_tools TEXT[] DEFAULT '{}',
  primary_interests TEXT[] DEFAULT '{}',
  first_department_choice TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  internship_motivation TEXT NOT NULL,
  referral_source TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT false,
  terms_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  application_status TEXT NOT NULL DEFAULT 'Submitted',
  maritime_background_score INTEGER DEFAULT 0,
  analytics_knowledge_score INTEGER DEFAULT 0,
  portfolio_score INTEGER DEFAULT 0,
  motivation_score INTEGER DEFAULT 0,
  applied_challenge_score INTEGER DEFAULT 0,
  communication_commitment_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  reviewer_notes TEXT,
  internal_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION generate_bluedata_hub_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_reference IS NULL OR NEW.application_reference = '' THEN
    NEW.application_reference := 'BDH-' || EXTRACT(YEAR FROM NOW()) || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bluedata_hub_reference ON dma_bluedata_hub_applications;
CREATE TRIGGER trg_bluedata_hub_reference
  BEFORE INSERT ON dma_bluedata_hub_applications
  FOR EACH ROW EXECUTE FUNCTION generate_bluedata_hub_reference();

CREATE OR REPLACE FUNCTION update_bluedata_hub_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bluedata_hub_updated_at ON dma_bluedata_hub_applications;
CREATE TRIGGER trg_bluedata_hub_updated_at
  BEFORE UPDATE ON dma_bluedata_hub_applications
  FOR EACH ROW EXECUTE FUNCTION update_bluedata_hub_updated_at();

CREATE OR REPLACE FUNCTION calculate_bluedata_hub_total_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_score := COALESCE(NEW.maritime_background_score, 0)
                   + COALESCE(NEW.analytics_knowledge_score, 0)
                   + COALESCE(NEW.portfolio_score, 0)
                   + COALESCE(NEW.motivation_score, 0)
                   + COALESCE(NEW.applied_challenge_score, 0)
                   + COALESCE(NEW.communication_commitment_score, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bluedata_hub_total_score ON dma_bluedata_hub_applications;
CREATE TRIGGER trg_bluedata_hub_total_score
  BEFORE INSERT OR UPDATE ON dma_bluedata_hub_applications
  FOR EACH ROW EXECUTE FUNCTION calculate_bluedata_hub_total_score();

CREATE INDEX IF NOT EXISTS idx_bluedata_hub_email ON dma_bluedata_hub_applications(email);
CREATE INDEX IF NOT EXISTS idx_bluedata_hub_status ON dma_bluedata_hub_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_bluedata_hub_department ON dma_bluedata_hub_applications(first_department_choice);
CREATE INDEX IF NOT EXISTS idx_bluedata_hub_country ON dma_bluedata_hub_applications(country);
CREATE INDEX IF NOT EXISTS idx_bluedata_hub_submitted ON dma_bluedata_hub_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_bluedata_hub_total_score ON dma_bluedata_hub_applications(total_score DESC);

ALTER TABLE dma_bluedata_hub_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anonymous_insert_bluedata_hub"
  ON dma_bluedata_hub_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_read_bluedata_hub"
  ON dma_bluedata_hub_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_authenticated_update_bluedata_hub"
  ON dma_bluedata_hub_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_delete_bluedata_hub"
  ON dma_bluedata_hub_applications
  FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS dma_bluedata_hub_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES dma_bluedata_hub_applications(id) ON DELETE CASCADE,
  reviewer_id UUID,
  maritime_background_score INTEGER DEFAULT 0,
  analytics_knowledge_score INTEGER DEFAULT 0,
  portfolio_score INTEGER DEFAULT 0,
  motivation_score INTEGER DEFAULT 0,
  applied_challenge_score INTEGER DEFAULT 0,
  communication_commitment_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  reviewer_comments TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bluedata_hub_reviews_app ON dma_bluedata_hub_reviews(application_id);

ALTER TABLE dma_bluedata_hub_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_authenticated_read_bluedata_hub_reviews"
  ON dma_bluedata_hub_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_authenticated_insert_bluedata_hub_reviews"
  ON dma_bluedata_hub_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_update_bluedata_hub_reviews"
  ON dma_bluedata_hub_reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_delete_bluedata_hub_reviews"
  ON dma_bluedata_hub_reviews
  FOR DELETE
  TO authenticated
  USING (true);

COMMIT;