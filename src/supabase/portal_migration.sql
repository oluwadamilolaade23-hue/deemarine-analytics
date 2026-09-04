-- DMA BlueData Hub Portal Migration
-- Extends existing BlueData Hub application system into a full participant management platform
-- Run this in Supabase Dashboard > SQL Editor

BEGIN;

-- ============================================================
-- COHORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_cohorts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  start_date DATE,
  end_date DATE,
  orientation_date DATE,
  orientation_time TEXT,
  orientation_timezone TEXT,
  orientation_meeting_link TEXT,
  status TEXT DEFAULT 'planned',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRACKS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARTICIPANTS (linked to existing applications)
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES dma_bluedata_hub_applications(id) ON DELETE SET NULL,
  reference_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  cohort_id UUID REFERENCES portal_cohorts(id) ON DELETE SET NULL,
  track_id UUID REFERENCES portal_tracks(id) ON DELETE SET NULL,
  department TEXT,
  group_id UUID,
  project_id UUID,
  programme_status TEXT DEFAULT 'active',
  access_status TEXT DEFAULT 'active',
  first_login BOOLEAN DEFAULT TRUE,
  professional_interests TEXT[],
  current_skill_areas TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARTICIPANT ACCESS (PIN-based auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_participant_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE UNIQUE,
  pin_hash TEXT NOT NULL,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GROUPS / TEAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cohort_id UUID REFERENCES portal_cohorts(id) ON DELETE CASCADE,
  project_id UUID,
  mentor_id UUID,
  team_objective TEXT,
  current_milestone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES portal_groups(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  role TEXT,
  responsibilities TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, participant_id)
);

-- ============================================================
-- MENTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_mentors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  expertise TEXT[],
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_mentor_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES portal_mentors(id) ON DELETE CASCADE,
  group_id UUID REFERENCES portal_groups(id) ON DELETE CASCADE,
  project_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mentor_id, group_id)
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  problem_statement TEXT,
  why_it_matters TEXT,
  objective TEXT,
  expected_outcome TEXT,
  mentor_id UUID REFERENCES portal_mentors(id) ON DELETE SET NULL,
  current_phase TEXT DEFAULT 'understand',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES portal_projects(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, participant_id)
);

CREATE TABLE IF NOT EXISTS portal_project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES portal_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEARNING MODULES & LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  category TEXT,
  estimated_duration TEXT,
  difficulty TEXT DEFAULT 'beginner',
  learning_objectives TEXT[],
  video_url TEXT,
  document_url TEXT,
  external_url TEXT,
  assignment_id UUID,
  completion_status TEXT DEFAULT 'not_started',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES portal_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  document_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ASSIGNMENTS & SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  module_id UUID REFERENCES portal_modules(id) ON DELETE SET NULL,
  instructions TEXT,
  deadline TIMESTAMPTZ,
  submission_type TEXT DEFAULT 'text',
  resources TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES portal_assignments(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  text_response TEXT,
  link_response TEXT,
  file_url TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, participant_id)
);

-- ============================================================
-- SESSIONS & ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  description TEXT,
  session_date DATE NOT NULL,
  session_time TEXT,
  timezone TEXT,
  facilitator TEXT,
  meeting_link TEXT,
  recording_url TEXT,
  resources TEXT[],
  is_orientation BOOLEAN DEFAULT FALSE,
  agenda TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES portal_sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, participant_id)
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'normal',
  target_audience TEXT DEFAULT 'all',
  target_cohort_id UUID REFERENCES portal_cohorts(id),
  target_group_id UUID REFERENCES portal_groups(id),
  target_track_id UUID REFERENCES portal_tracks(id),
  target_project_id UUID REFERENCES portal_projects(id),
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_announcement_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID REFERENCES portal_announcements(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(announcement_id, participant_id)
);

-- ============================================================
-- SKILLS & SKILL PASSPORT
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portal_participant_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES portal_skills(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'not_started',
  evidence TEXT,
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, skill_id)
);

-- ============================================================
-- PORTFOLIO
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  role TEXT,
  contributions TEXT[],
  skills_demonstrated TEXT[],
  link_url TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  type TEXT,
  url TEXT,
  file_url TEXT,
  assigned_cohorts UUID[],
  assigned_groups UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPORT REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_support_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES portal_participants(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_participants_ref ON portal_participants(reference_number);
CREATE INDEX IF NOT EXISTS idx_participants_cohort ON portal_participants(cohort_id);
CREATE INDEX IF NOT EXISTS idx_access_participant ON portal_participant_access(participant_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON portal_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON portal_project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON portal_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_participant ON portal_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON portal_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON portal_announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_participant ON portal_notifications(participant_id);
CREATE INDEX IF NOT EXISTS idx_activity_participant ON portal_activity_logs(participant_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE portal_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_participant_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_participant_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_tracks ENABLE ROW LEVEL SECURITY;

-- Public read for shared reference data
CREATE POLICY "public_read_cohorts" ON portal_cohorts FOR SELECT USING (true);
CREATE POLICY "public_read_tracks" ON portal_tracks FOR SELECT USING (true);
CREATE POLICY "public_read_modules" ON portal_modules FOR SELECT USING (true);
CREATE POLICY "public_read_lessons" ON portal_lessons FOR SELECT USING (true);
CREATE POLICY "public_read_assignments" ON portal_assignments FOR SELECT USING (true);
CREATE POLICY "public_read_sessions" ON portal_sessions FOR SELECT USING (true);
CREATE POLICY "public_read_projects" ON portal_projects FOR SELECT USING (true);
CREATE POLICY "public_read_project_milestones" ON portal_project_milestones FOR SELECT USING (true);
CREATE POLICY "public_read_mentors" ON portal_mentors FOR SELECT USING (true);
CREATE POLICY "public_read_skills" ON portal_skills FOR SELECT USING (true);
CREATE POLICY "public_read_resources" ON portal_resources FOR SELECT USING (true);
CREATE POLICY "public_read_groups" ON portal_groups FOR SELECT USING (true);
CREATE POLICY "public_read_group_members" ON portal_group_members FOR SELECT USING (true);
CREATE POLICY "public_read_project_members" ON portal_project_members FOR SELECT USING (true);

-- Announcements: public read (filtering by target happens in app)
CREATE POLICY "public_read_announcements" ON portal_announcements FOR SELECT USING (true);

-- Participants: read and insert (admin activation), update
CREATE POLICY "participant_read_own" ON portal_participants FOR SELECT USING (true);
CREATE POLICY "participant_insert_all" ON portal_participants FOR INSERT USING (true);
CREATE POLICY "participant_update_own" ON portal_participants FOR UPDATE USING (true);

-- Participant access: allow read/write (security is via hashed PIN, not record visibility)
-- Login flow needs SELECT to verify PIN; admin needs full CRUD for access management
CREATE POLICY "access_read_all" ON portal_participant_access FOR SELECT USING (true);
CREATE POLICY "access_insert_all" ON portal_participant_access FOR INSERT USING (true);
CREATE POLICY "access_update_all" ON portal_participant_access FOR UPDATE USING (true);

-- Submissions: read own, insert own, update own
CREATE POLICY "submission_read_own" ON portal_submissions FOR SELECT USING (true);
CREATE POLICY "submission_insert_own" ON portal_submissions FOR INSERT USING (true);
CREATE POLICY "submission_update_own" ON portal_submissions FOR UPDATE USING (true);

-- Participant skills: read own
CREATE POLICY "skills_read_own" ON portal_participant_skills FOR SELECT USING (true);

-- Portfolio: read own, insert own, update own
CREATE POLICY "portfolio_read_own" ON portal_portfolio_items FOR SELECT USING (true);
CREATE POLICY "portfolio_insert_own" ON portal_portfolio_items FOR INSERT USING (true);
CREATE POLICY "portfolio_update_own" ON portal_portfolio_items FOR UPDATE USING (true);

-- Attendance: read own
CREATE POLICY "attendance_read_own" ON portal_attendance FOR SELECT USING (true);

-- Notifications: read own, update own
CREATE POLICY "notif_read_own" ON portal_notifications FOR SELECT USING (true);
CREATE POLICY "notif_update_own" ON portal_notifications FOR UPDATE USING (true);

-- Announcement reads: insert own
CREATE POLICY "announce_read_insert_own" ON portal_announcement_reads FOR INSERT USING (true);

-- Support requests: insert own, read own
CREATE POLICY "support_insert_own" ON portal_support_requests FOR INSERT USING (true);
CREATE POLICY "support_read_own" ON portal_support_requests FOR SELECT USING (true);

-- Activity logs: insert own
CREATE POLICY "activity_insert_own" ON portal_activity_logs FOR INSERT USING (true);

-- ============================================================
-- SEED DATA: Cohort 1
-- ============================================================
INSERT INTO portal_cohorts (name, code, start_date, end_date, orientation_date, status)
VALUES ('DMA BlueData Hub Cohort 1 — 2026', 'BDH-C1-2026', '2026-08-29', '2026-12-15', '2026-08-29', 'active')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED DATA: Tracks
-- ============================================================
INSERT INTO portal_tracks (name, code, description) VALUES
  ('Explorer Track', 'explorer', 'Foundational maritime data analytics and engineering skills'),
  ('Builder Track', 'builder', 'Advanced project development and technical implementation'),
  ('Analyst Track', 'analyst', 'Specialized data analysis and business intelligence')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED DATA: Skills
-- ============================================================
INSERT INTO portal_skills (name, category, sort_order) VALUES
  ('Mechanical Systems', 'Technical', 1),
  ('Electrical Fundamentals', 'Technical', 2),
  ('Sensors & IoT', 'Technical', 3),
  ('Excel', 'Data', 4),
  ('SQL', 'Data', 5),
  ('Power BI', 'Data', 6),
  ('Python', 'Data', 7),
  ('Data Visualization', 'Data', 8),
  ('Maritime Analytics', 'Domain', 9),
  ('Maritime Operations', 'Domain', 10),
  ('Reliability Engineering', 'Domain', 11),
  ('Maintenance', 'Domain', 12),
  ('Sustainability', 'Domain', 13),
  ('Decarbonization', 'Domain', 14),
  ('Safety', 'Domain', 15),
  ('AI', 'Technical', 16),
  ('Cybersecurity', 'Technical', 17),
  ('Research', 'Professional', 18),
  ('Communication', 'Professional', 19),
  ('Teamwork', 'Professional', 20),
  ('Problem Solving', 'Professional', 21),
  ('Innovation', 'Professional', 22),
  ('Project Management', 'Professional', 23)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- SEED DATA: Orientation Session
-- ============================================================
INSERT INTO portal_sessions (title, type, description, session_date, session_time, timezone, facilitator, is_orientation, agenda)
VALUES (
  'DMA BlueData Hub — Cohort 1 Orientation',
  'orientation',
  'Welcome to the DMA BlueData Hub. This orientation session introduces you to the programme, your team, your project, and the portal.',
  '2026-08-29',
  NULL,
  NULL,
  'BlueData Hub Team',
  TRUE,
  ARRAY[
    'Welcome to DMA BlueData Hub',
    'Meet the BlueData Team',
    'Understanding Your Track',
    'Meet Your Project Group',
    'How Projects Will Work',
    'Learning & Skills Development',
    'Using the BlueData Portal',
    'Expectations & Participation',
    'Q&A',
    'Next Steps'
  ]
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: DeeMarine Sentinel Project
-- ============================================================
INSERT INTO portal_projects (title, code, subtitle, problem_statement, why_it_matters, objective, expected_outcome, current_phase, progress)
VALUES (
  'DeeMarine Sentinel',
  'DMS-001',
  'Machinery Condition Monitoring & Predictive Intelligence',
  'How can machinery condition data help identify abnormal behaviour before failure occurs?',
  'Unexpected machinery failures cost maritime operators millions in downtime, repairs, and lost revenue. Predictive intelligence can transform maintenance from reactive to proactive.',
  'Build a condition monitoring system that uses sensor data to detect anomalies and predict potential failures before they occur.',
  'A functional prototype demonstrating data acquisition, anomaly detection, and predictive maintenance insights using real or simulated machinery data.',
  'understand',
  0
)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED DATA: Learning Modules
-- ============================================================
INSERT INTO portal_modules (title, description, instructor, category, estimated_duration, difficulty, learning_objectives, sort_order) VALUES
  ('Introduction to Maritime Engineering', 'Foundational concepts of maritime machinery, systems, and operations.', 'BlueData Hub Team', 'Maritime Foundations', '2 hours', 'beginner', ARRAY['Understand maritime machinery basics', 'Identify key ship systems', 'Learn maintenance fundamentals'], 1),
  ('Mechanical Systems & Components', 'Bearings, motors, pumps, alignment, and lubrication fundamentals.', 'BlueData Hub Team', 'Mechanical Systems', '3 hours', 'beginner', ARRAY['Identify mechanical components', 'Understand failure modes', 'Learn maintenance practices'], 2),
  ('Sensors & Data Acquisition', 'ESP32, microcontrollers, and sensor integration for condition monitoring.', 'BlueData Hub Team', 'Sensors & IoT', '3 hours', 'intermediate', ARRAY['Understand sensor types', 'Build data acquisition systems', 'Collect vibration/temperature data'], 3),
  ('Excel for Maritime Data', 'Data cleaning, pivot tables, and trend analysis in Excel.', 'BlueData Hub Team', 'Excel', '2 hours', 'beginner', ARRAY['Clean and structure data', 'Create pivot tables', 'Build trend analysis'], 4),
  ('SQL Fundamentals', 'Querying maritime datasets and building analytical views.', 'BlueData Hub Team', 'SQL', '2 hours', 'beginner', ARRAY['Write SQL queries', 'Join and aggregate data', 'Create analytical views'], 5),
  ('Power BI Dashboards', 'Building interactive maritime performance dashboards.', 'BlueData Hub Team', 'Power BI', '3 hours', 'intermediate', ARRAY['Connect data sources', 'Build interactive dashboards', 'Create KPI visualizations'], 6),
  ('Python for Data Analysis', 'Pandas, NumPy, and data manipulation for maritime datasets.', 'BlueData Hub Team', 'Python', '4 hours', 'intermediate', ARRAY['Use Pandas for data manipulation', 'Perform statistical analysis', 'Build data pipelines'], 7),
  ('Anomaly Detection & Predictive Maintenance', 'Signal analysis, anomaly detection, and predictive maintenance concepts.', 'BlueData Hub Team', 'Data Analytics', '3 hours', 'advanced', ARRAY['Understand signal analysis', 'Build anomaly detection models', 'Implement predictive maintenance logic'], 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Assignments
-- ============================================================
INSERT INTO portal_assignments (title, module_id, instructions, deadline, submission_type, resources)
SELECT 'Maritime Systems Overview', id, 'Research and document the key mechanical systems on a commercial vessel. Include components, functions, and common failure modes.', '2026-09-15T23:59:59Z', 'text', ARRAY['Module 1 resources', 'Maritime Engineering Handbook']
FROM portal_modules WHERE title = 'Introduction to Maritime Engineering'
ON CONFLICT DO NOTHING;

INSERT INTO portal_assignments (title, module_id, instructions, deadline, submission_type, resources)
SELECT 'Sensor Data Collection Plan', id, 'Design a data acquisition plan for monitoring a specific machine. Specify sensors, sampling rate, and data storage approach.', '2026-09-30T23:59:59Z', 'text', ARRAY['ESP32 documentation', 'Sensor datasheets']
FROM portal_modules WHERE title = 'Sensors & Data Acquisition'
ON CONFLICT DO NOTHING;

INSERT INTO portal_assignments (title, module_id, instructions, deadline, submission_type, resources)
SELECT 'Excel Trend Analysis', id, 'Using the provided machinery dataset, create a trend analysis report identifying patterns and potential anomalies.', '2026-10-15T23:59:59Z', 'link', ARRAY['Sample dataset', 'Excel templates']
FROM portal_modules WHERE title = 'Excel for Maritime Data'
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Resources
-- ============================================================
INSERT INTO portal_resources (title, description, category, type, url) VALUES
  ('Maritime Engineering Handbook', 'Comprehensive guide to ship machinery and systems', 'Maritime Engineering', 'Document', ''),
  ('ESP32 Sensor Guide', 'Complete guide to ESP32-based data acquisition', 'Sensors', 'Guide', ''),
  ('Python Data Analysis Tutorial', 'Step-by-step Pandas and NumPy tutorial', 'Python', 'Video', ''),
  ('Power BI Dashboard Templates', 'Pre-built maritime dashboard templates', 'Power BI', 'Template', ''),
  ('SQL Query Library', 'Common maritime data SQL queries', 'SQL', 'Reference', ''),
  ('Vibration Analysis Reference', 'Guide to machinery vibration analysis', 'Mechanical', 'Reference', ''),
  ('Decarbonization Framework', 'IMO decarbonization strategy documentation', 'Sustainability', 'Document', ''),
  ('Cybersecurity Best Practices', 'Maritime cybersecurity guidelines', 'Cybersecurity', 'Guide', '')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Project Milestones (DeeMarine Sentinel)
-- ============================================================
INSERT INTO portal_project_milestones (project_id, title, description, phase, status, due_date)
SELECT id, 'Understand the Problem', 'Define the machinery monitoring challenge and scope', 'understand', 'pending', '2026-09-15'
FROM portal_projects WHERE code = 'DMS-001'
ON CONFLICT DO NOTHING;

INSERT INTO portal_project_milestones (project_id, title, description, phase, status, due_date)
SELECT id, 'Investigate Data Sources', 'Research available sensor data and acquisition methods', 'investigate', 'pending', '2026-09-30'
FROM portal_projects WHERE code = 'DMS-001'
ON CONFLICT DO NOTHING;

INSERT INTO portal_project_milestones (project_id, title, description, phase, status, due_date)
SELECT id, 'Design Solution Architecture', 'Design the monitoring system architecture', 'design', 'pending', '2026-10-15'
FROM portal_projects WHERE code = 'DMS-001'
ON CONFLICT DO NOTHING;

INSERT INTO portal_project_milestones (project_id, title, description, phase, status, due_date)
SELECT id, 'Build Prototype', 'Implement the condition monitoring prototype', 'build', 'pending', '2026-11-15'
FROM portal_projects WHERE code = 'DMS-001'
ON CONFLICT DO NOTHING;

INSERT INTO portal_project_milestones (project_id, title, description, phase, status, due_date)
SELECT id, 'Measure & Validate', 'Test the system with real or simulated data', 'measure', 'pending', '2026-11-30'
FROM portal_projects WHERE code = 'DMS-001'
ON CONFLICT DO NOTHING;

INSERT INTO portal_project_milestones (project_id, title, description, phase, status, due_date)
SELECT id, 'Final Presentation', 'Present findings and demonstrate the solution', 'present', 'pending', '2026-12-15'
FROM portal_projects WHERE code = 'DMS-001'
ON CONFLICT DO NOTHING;

-- ============================================================
-- UPDATED_AT trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at' AND table_schema = 'public' AND table_name LIKE 'portal_%'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated ON %s', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_updated BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END $$;

COMMIT;