import { supabase, isSupabaseConfigured } from "./supabase";

// ============================================================
// TYPES
// ============================================================
export interface Participant {
  id: string;
  reference_number: string;
  full_name: string;
  email: string;
  cohort_id?: string;
  track_id?: string;
  department?: string;
  group_id?: string;
  project_id?: string;
  programme_status: string;
  access_status: string;
  first_login: boolean;
  professional_interests?: string[];
  current_skill_areas?: string[];
}

export interface Cohort {
  id: string;
  name: string;
  code: string;
  start_date?: string;
  end_date?: string;
  orientation_date?: string;
  orientation_time?: string;
  orientation_timezone?: string;
  orientation_meeting_link?: string;
  status: string;
}

export interface Track {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Group {
  id: string;
  name: string;
  cohort_id?: string;
  project_id?: string;
  mentor_id?: string;
  team_objective?: string;
  current_milestone?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  participant_id: string;
  role?: string;
  responsibilities?: string;
  participant?: Participant;
}

export interface Mentor {
  id: string;
  name: string;
  role?: string;
  expertise?: string[];
  contact_email?: string;
}

export interface Project {
  id: string;
  title: string;
  code: string;
  subtitle?: string;
  problem_statement?: string;
  why_it_matters?: string;
  objective?: string;
  expected_outcome?: string;
  mentor_id?: string;
  current_phase: string;
  progress: number;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  phase: string;
  status: string;
  due_date?: string;
  completed_at?: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  category: string;
  estimated_duration?: string;
  difficulty: string;
  learning_objectives?: string[];
  video_url?: string;
  document_url?: string;
  external_url?: string;
  completion_status: string;
  sort_order: number;
  /** Content visibility scope */
  scope: "all_participants" | "department_lab" | "specific_project";
  /** Lab/project this content is assigned to (when scope is department_lab or specific_project) */
  assigned_lab?: string;
  /** Whether this module is archived/deactivated */
  archived?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  module_id?: string;
  instructions?: string;
  deadline?: string;
  submission_type: string;
  resources?: string[];
}

export interface Submission {
  id: string;
  assignment_id: string;
  participant_id: string;
  status: string;
  text_response?: string;
  link_response?: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  submitted_at?: string;
  reviewed_at?: string;
}

export interface Session {
  id: string;
  title: string;
  type?: string;
  description?: string;
  session_date: string;
  session_time?: string;
  timezone?: string;
  facilitator?: string;
  meeting_link?: string;
  recording_url?: string;
  resources?: string[];
  is_orientation: boolean;
  agenda?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  body?: string;
  type: string;
  priority: string;
  target_audience: string;
  author?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  sort_order: number;
}

export interface ParticipantSkill {
  id: string;
  participant_id: string;
  skill_id: string;
  level: string;
  evidence?: string;
  updated_by?: string;
}

export interface PortfolioItem {
  id: string;
  participant_id: string;
  type: string;
  title: string;
  description?: string;
  role?: string;
  contributions?: string[];
  skills_demonstrated?: string[];
  link_url?: string;
  file_url?: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: string;
  url?: string;
  file_url?: string;
}

export interface Notification {
  id: string;
  participant_id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportRequest {
  id: string;
  participant_id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  admin_response?: string;
  created_at: string;
}

// ============================================================
// SEED DATA (used when Supabase not configured or tables empty)
// ============================================================
export const SEED_COHORT: Cohort = {
  id: "seed-cohort-1",
  name: "DMA BlueData Hub Cohort 1 — 2026",
  code: "BDH-C1-2026",
  start_date: "2026-08-29",
  end_date: "2026-12-15",
  orientation_date: "2026-08-29",
  status: "active",
};

export const SEED_TRACKS: Track[] = [
  { id: "seed-track-1", name: "Explorer Track", code: "explorer", description: "Foundational maritime data analytics and engineering skills" },
  { id: "seed-track-2", name: "Builder Track", code: "builder", description: "Advanced project development and technical implementation" },
  { id: "seed-track-3", name: "Analyst Track", code: "analyst", description: "Specialized data analysis and business intelligence" },
];

export const PROGRAMME_PHASES = [
  { key: "onboarding", label: "Onboarding", desc: "Welcome, orientation, and platform setup" },
  { key: "foundations", label: "Foundations", desc: "Core maritime and data fundamentals" },
  { key: "skill_building", label: "Skill Building", desc: "Technical skill development across domains" },
  { key: "project_discovery", label: "Project Discovery", desc: "Understanding your project challenge" },
  { key: "project_development", label: "Project Development", desc: "Building your solution" },
  { key: "testing_analysis", label: "Testing & Analysis", desc: "Validating and analyzing results" },
  { key: "final_presentation", label: "Final Presentation", desc: "Presenting your work" },
  { key: "portfolio_completion", label: "Portfolio & Completion", desc: "Finalizing your professional portfolio" },
];

export const PROJECT_PHASES = [
  { key: "understand", label: "Understand" },
  { key: "investigate", label: "Investigate" },
  { key: "design", label: "Design" },
  { key: "build", label: "Build" },
  { key: "measure", label: "Measure" },
  { key: "analyse", label: "Analyse" },
  { key: "validate", label: "Validate" },
  { key: "solve", label: "Solve" },
  { key: "present", label: "Present" },
];

export const SKILL_LEVELS = ["not_started", "exploring", "developing", "applying", "demonstrated"];

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  not_started: "Not Started",
  exploring: "Exploring",
  developing: "Developing",
  applying: "Applying",
  demonstrated: "Demonstrated",
};

export const SKILL_LEVEL_COLORS: Record<string, string> = {
  not_started: "bg-slate-200 text-slate-600",
  exploring: "bg-blue-100 text-blue-700",
  developing: "bg-cyan-100 text-cyan-700",
  applying: "bg-teal-100 text-teal-700",
  demonstrated: "bg-green-100 text-green-700",
};

export const SEED_SKILLS: Skill[] = [
  { id: "s1", name: "Mechanical Systems", category: "Technical", sort_order: 1 },
  { id: "s2", name: "Electrical Fundamentals", category: "Technical", sort_order: 2 },
  { id: "s3", name: "Sensors & IoT", category: "Technical", sort_order: 3 },
  { id: "s4", name: "Excel", category: "Data", sort_order: 4 },
  { id: "s5", name: "SQL", category: "Data", sort_order: 5 },
  { id: "s6", name: "Power BI", category: "Data", sort_order: 6 },
  { id: "s7", name: "Python", category: "Data", sort_order: 7 },
  { id: "s8", name: "Data Visualization", category: "Data", sort_order: 8 },
  { id: "s9", name: "Maritime Analytics", category: "Domain", sort_order: 9 },
  { id: "s10", name: "Maritime Operations", category: "Domain", sort_order: 10 },
  { id: "s11", name: "Reliability Engineering", category: "Domain", sort_order: 11 },
  { id: "s12", name: "Maintenance", category: "Domain", sort_order: 12 },
  { id: "s13", name: "Sustainability", category: "Domain", sort_order: 13 },
  { id: "s14", name: "Decarbonization", category: "Domain", sort_order: 14 },
  { id: "s15", name: "Safety", category: "Domain", sort_order: 15 },
  { id: "s16", name: "AI", category: "Technical", sort_order: 16 },
  { id: "s17", name: "Cybersecurity", category: "Technical", sort_order: 17 },
  { id: "s18", name: "Research", category: "Professional", sort_order: 18 },
  { id: "s19", name: "Communication", category: "Professional", sort_order: 19 },
  { id: "s20", name: "Teamwork", category: "Professional", sort_order: 20 },
  { id: "s21", name: "Problem Solving", category: "Professional", sort_order: 21 },
  { id: "s22", name: "Innovation", category: "Professional", sort_order: 22 },
  { id: "s23", name: "Project Management", category: "Professional", sort_order: 23 },
];

export const SEED_PROJECT: Project = {
  id: "seed-project-1",
  title: "DeeMarine Sentinel",
  code: "DMS-001",
  subtitle: "Machinery Condition Monitoring & Predictive Intelligence",
  problem_statement: "How can machinery condition data help identify abnormal behaviour before failure occurs?",
  why_it_matters: "Unexpected machinery failures cost maritime operators millions in downtime, repairs, and lost revenue. Predictive intelligence can transform maintenance from reactive to proactive.",
  objective: "Build a condition monitoring system that uses sensor data to detect anomalies and predict potential failures before they occur.",
  expected_outcome: "A functional prototype demonstrating data acquisition, anomaly detection, and predictive maintenance insights using real or simulated machinery data.",
  mentor_id: "seed-mentor-1",
  current_phase: "understand",
  progress: 0,
};

export const SEED_PROJECT_MILESTONES: ProjectMilestone[] = [
  { id: "m1", project_id: "seed-project-1", title: "Understand the Problem", description: "Define the machinery monitoring challenge and scope", phase: "understand", status: "pending", due_date: "2026-09-15" },
  { id: "m2", project_id: "seed-project-1", title: "Investigate Data Sources", description: "Research available sensor data and acquisition methods", phase: "investigate", status: "pending", due_date: "2026-09-30" },
  { id: "m3", project_id: "seed-project-1", title: "Design Solution Architecture", description: "Design the monitoring system architecture", phase: "design", status: "pending", due_date: "2026-10-15" },
  { id: "m4", project_id: "seed-project-1", title: "Build Prototype", description: "Implement the condition monitoring prototype", phase: "build", status: "pending", due_date: "2026-11-15" },
  { id: "m5", project_id: "seed-project-1", title: "Measure & Validate", description: "Test the system with real or simulated data", phase: "measure", status: "pending", due_date: "2026-11-30" },
  { id: "m6", project_id: "seed-project-1", title: "Final Presentation", description: "Present findings and demonstrate the solution", phase: "present", status: "pending", due_date: "2026-12-15" },
];

export const SEED_MODULES: Module[] = [
  // ── CORE modules (all participants) ──
  { id: "mod1", title: "BlueData Hub Project Orientation", description: "Project workflow, datasets, deliverables, teamwork, documentation, and portfolio expectations.", instructor: "BlueData Hub Team", category: "Orientation", estimated_duration: "1 hour", difficulty: "beginner", learning_objectives: ["Understand project workflow", "Navigate datasets and deliverables", "Apply teamwork and documentation standards", "Prepare portfolio expectations"], completion_status: "not_started", sort_order: 1, scope: "all_participants" },
  { id: "mod2", title: "Maritime Data & Industry Foundations", description: "Vessels, ports, shipping operations, maritime data sources, and key operational metrics.", instructor: "BlueData Hub Team", category: "Maritime Foundations", estimated_duration: "2 hours", difficulty: "beginner", learning_objectives: ["Identify vessel and port types", "Understand shipping operations", "Locate maritime data sources", "Interpret key operational metrics"], completion_status: "not_started", sort_order: 2, scope: "all_participants" },
  { id: "mod3", title: "Data Cleaning & Preparation", description: "Missing values, duplicates, data types, validation, and preparing maritime datasets.", instructor: "BlueData Hub Team", category: "Data Preparation", estimated_duration: "2 hours", difficulty: "beginner", learning_objectives: ["Handle missing values and duplicates", "Correct data types", "Validate data quality", "Prepare maritime datasets for analysis"], completion_status: "not_started", sort_order: 3, scope: "all_participants" },
  { id: "mod4", title: "Exploratory Data Analysis", description: "Descriptive statistics, trends, distributions, correlations, and interpreting maritime data.", instructor: "BlueData Hub Team", category: "EDA", estimated_duration: "2 hours", difficulty: "beginner", learning_objectives: ["Compute descriptive statistics", "Identify trends and distributions", "Measure correlations", "Interpret maritime data patterns"], completion_status: "not_started", sort_order: 4, scope: "all_participants" },
  { id: "mod5", title: "Excel for Maritime Analytics", description: "Cleaning, formulas, pivot tables, KPIs, and exploratory analysis.", instructor: "BlueData Hub Team", category: "Excel", estimated_duration: "2 hours", difficulty: "beginner", learning_objectives: ["Clean data in Excel", "Build formulas and pivot tables", "Calculate KPIs", "Perform exploratory analysis"], completion_status: "not_started", sort_order: 5, scope: "all_participants" },
  { id: "mod6", title: "SQL for Maritime Data", description: "Filtering, aggregation, joins, and analytical queries using maritime/project datasets.", instructor: "BlueData Hub Team", category: "SQL", estimated_duration: "2 hours", difficulty: "intermediate", learning_objectives: ["Filter and aggregate data", "Join maritime tables", "Write analytical queries", "Query project datasets"], completion_status: "not_started", sort_order: 6, scope: "all_participants" },
  { id: "mod7", title: "Python for Maritime Analytics", description: "Pandas, NumPy, visualization, and reproducible maritime analysis.", instructor: "BlueData Hub Team", category: "Python", estimated_duration: "3 hours", difficulty: "intermediate", learning_objectives: ["Use Pandas and NumPy", "Create visualizations", "Build reproducible analysis", "Apply to maritime datasets"], completion_status: "not_started", sort_order: 7, scope: "all_participants" },
  { id: "mod8", title: "Power BI & Maritime Dashboards", description: "KPIs, data models, interactive dashboards, and communicating operational insights.", instructor: "BlueData Hub Team", category: "Power BI", estimated_duration: "3 hours", difficulty: "intermediate", learning_objectives: ["Define KPIs and data models", "Build interactive dashboards", "Communicate operational insights", "Design maritime visualizations"], completion_status: "not_started", sort_order: 8, scope: "all_participants" },
  { id: "mod9", title: "Data Storytelling & Project Presentation", description: "Turning analysis into findings, recommendations, dashboards, and portfolio presentations.", instructor: "BlueData Hub Team", category: "Communication", estimated_duration: "2 hours", difficulty: "intermediate", learning_objectives: ["Turn analysis into findings", "Formulate recommendations", "Design presentation dashboards", "Deliver portfolio presentations"], completion_status: "not_started", sort_order: 9, scope: "all_participants" },

  // ── PROJECT-SPECIFIC modules (department/lab) ──
  { id: "mod_fleet", title: "Fleet Intelligence Lab", description: "Vessel performance KPIs, fuel consumption, maintenance/reliability indicators, anomaly detection, and performance trends.", instructor: "BlueData Hub Team", category: "Fleet Intelligence", estimated_duration: "4 hours", difficulty: "intermediate", learning_objectives: ["Calculate vessel performance KPIs", "Analyse fuel consumption patterns", "Assess maintenance and reliability indicators", "Detect anomalies and performance trends"], completion_status: "not_started", sort_order: 10, scope: "department_lab", assigned_lab: "Fleet Performance & Reliability" },
  { id: "mod_port", title: "Port Intelligence Lab", description: "Port calls, vessel turnaround time, berth performance, congestion, traffic/cargo patterns, and port-efficiency KPIs.", instructor: "BlueData Hub Team", category: "Port Intelligence", estimated_duration: "4 hours", difficulty: "intermediate", learning_objectives: ["Analyse port calls and turnaround time", "Evaluate berth performance", "Measure congestion and traffic patterns", "Calculate port-efficiency KPIs"], completion_status: "not_started", sort_order: 11, scope: "department_lab", assigned_lab: "Port & Supply Chain Intelligence" },
  { id: "mod_safety", title: "Maritime Safety Analytics Lab", description: "Marine incidents, casualty data, risk factors, incident classification, safety KPIs, trend analysis, and risk visualization.", instructor: "BlueData Hub Team", category: "Safety Analytics", estimated_duration: "4 hours", difficulty: "intermediate", learning_objectives: ["Classify marine incidents and casualty data", "Identify risk factors", "Calculate safety KPIs", "Visualise risk trends"], completion_status: "not_started", sort_order: 12, scope: "department_lab", assigned_lab: "Maritime Safety & Risk Analytics" },
  { id: "mod_cyber", title: "Maritime Cybersecurity Lab", description: "Maritime digital systems, cyber-risk datasets, threat/event classification, vulnerability indicators, risk scoring, and cyber-intelligence dashboards.", instructor: "BlueData Hub Team", category: "Cybersecurity", estimated_duration: "4 hours", difficulty: "intermediate", learning_objectives: ["Map maritime digital systems", "Classify cyber threats and events", "Score vulnerabilities and risk", "Build cyber-intelligence dashboards"], completion_status: "not_started", sort_order: 13, scope: "department_lab", assigned_lab: "CyberSea / Digital Risk Intelligence" },
  { id: "mod_green", title: "Green Ports & Blue Economy Lab", description: "Port emissions, energy use, environmental KPIs, vessel/port sustainability indicators, and green-port performance.", instructor: "BlueData Hub Team", category: "Green Ports", estimated_duration: "4 hours", difficulty: "intermediate", learning_objectives: ["Measure port emissions and energy use", "Calculate environmental KPIs", "Assess sustainability indicators", "Evaluate green-port performance"], completion_status: "not_started", sort_order: 14, scope: "department_lab", assigned_lab: "Green Port Analytics" },

  // ── ARCHIVED (removed from general curriculum) ──
  { id: "mod_arch_mech", title: "Mechanical Systems & Components", description: "Bearings, motors, pumps, alignment, and lubrication fundamentals.", instructor: "BlueData Hub Team", category: "Mechanical Systems", estimated_duration: "3 hours", difficulty: "beginner", learning_objectives: ["Identify mechanical components", "Understand failure modes", "Learn maintenance practices"], completion_status: "not_started", sort_order: 100, scope: "all_participants", archived: true },
  { id: "mod_arch_sensor", title: "Sensors & Data Acquisition", description: "ESP32, microcontrollers, and sensor integration for condition monitoring.", instructor: "BlueData Hub Team", category: "Sensors & IoT", estimated_duration: "3 hours", difficulty: "intermediate", learning_objectives: ["Understand sensor types", "Build data acquisition systems", "Collect vibration/temperature data"], completion_status: "not_started", sort_order: 101, scope: "all_participants", archived: true },
  { id: "mod_arch_anomaly", title: "Anomaly Detection & Predictive Maintenance", description: "Signal analysis, anomaly detection, and predictive maintenance concepts.", instructor: "BlueData Hub Team", category: "Data Analytics", estimated_duration: "3 hours", difficulty: "advanced", learning_objectives: ["Understand signal analysis", "Build anomaly detection models", "Implement predictive maintenance logic"], completion_status: "not_started", sort_order: 102, scope: "department_lab", assigned_lab: "Fleet Performance & Reliability", archived: true },
];

export const SEED_ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Project Orientation Reflection", module_id: "mod1", instructions: "Review the project workflow, deliverables, and portfolio expectations. Write a short reflection on how your team will organise documentation and teamwork.", deadline: "2026-09-15T23:59:59Z", submission_type: "text", resources: ["Orientation materials", "Project workflow guide"] },
  { id: "a2", title: "Maritime Data Exploration", module_id: "mod2", instructions: "Using the provided maritime dataset, identify key data sources, operational metrics, and document your findings.", deadline: "2026-09-30T23:59:59Z", submission_type: "text", resources: ["Sample maritime dataset", "Maritime data dictionary"] },
  { id: "a3", title: "Excel Maritime Analysis", module_id: "mod5", instructions: "Using the provided maritime dataset, clean the data, build pivot tables, calculate KPIs, and perform exploratory analysis in Excel.", deadline: "2026-10-15T23:59:59Z", submission_type: "link", resources: ["Sample dataset", "Excel templates"] },
];

export const SEED_SESSIONS: Session[] = [
  {
    id: "sess1",
    title: "DMA BlueData Hub — Cohort 1 Orientation",
    type: "orientation",
    description: "Welcome to the DMA BlueData Hub. This orientation session introduces you to the programme, your team, your project, and the portal.",
    session_date: "2026-08-29",
    facilitator: "BlueData Hub Team",
    is_orientation: true,
    agenda: ["Welcome to DMA BlueData Hub", "Meet the BlueData Team", "Understanding Your Track", "Meet Your Project Group", "How Projects Will Work", "Learning & Skills Development", "Using the BlueData Portal", "Expectations & Participation", "Q&A", "Next Steps"],
  },
];

export const SEED_RESOURCES: Resource[] = [
  { id: "r1", title: "Maritime Engineering Handbook", description: "Comprehensive guide to ship machinery and systems", category: "Maritime Engineering", type: "Document" },
  { id: "r2", title: "ESP32 Sensor Guide", description: "Complete guide to ESP32-based data acquisition", category: "Sensors", type: "Guide" },
  { id: "r3", title: "Python Data Analysis Tutorial", description: "Step-by-step Pandas and NumPy tutorial", category: "Python", type: "Video" },
  { id: "r4", title: "Power BI Dashboard Templates", description: "Pre-built maritime dashboard templates", category: "Power BI", type: "Template" },
  { id: "r5", title: "SQL Query Library", description: "Common maritime data SQL queries", category: "SQL", type: "Reference" },
  { id: "r6", title: "Vibration Analysis Reference", description: "Guide to machinery vibration analysis", category: "Mechanical", type: "Reference" },
  { id: "r7", title: "Decarbonization Framework", description: "IMO decarbonization strategy documentation", category: "Sustainability", type: "Document" },
  { id: "r8", title: "Cybersecurity Best Practices", description: "Maritime cybersecurity guidelines", category: "Cybersecurity", type: "Guide" },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann1", title: "Welcome to DMA BlueData Hub Cohort 1", body: "Welcome to the DMA BlueData Hub! We are thrilled to have you join our founding cohort. Orientation is scheduled for Saturday, August 29, 2026. Stay tuned for more details.", type: "programme", priority: "high", target_audience: "all", author: "BlueData Hub Team", created_at: "2026-08-13T10:00:00Z" },
  { id: "ann2", title: "Orientation Details Coming Soon", body: "We are finalizing the orientation schedule and meeting link. You will receive an email and see the details on your portal dashboard once confirmed.", type: "session_update", priority: "normal", target_audience: "all", author: "BlueData Hub Team", created_at: "2026-08-13T12:00:00Z" },
];

export const SEED_MENTOR: Mentor = {
  id: "seed-mentor-1",
  name: "BlueData Hub Mentor",
  role: "Programme Mentor",
  expertise: ["Mechanical Systems", "Data Analytics", "Predictive Maintenance"],
  contact_email: "mentor@bluedatahub.com",
};

export const MODULE_CATEGORIES = [
  "Orientation", "Maritime Foundations", "Data Preparation", "EDA",
  "Excel", "SQL", "Python", "Power BI", "Communication",
  "Fleet Intelligence", "Port Intelligence", "Safety Analytics", "Cybersecurity", "Green Ports",
  "Mechanical Systems", "Sensors & IoT", "Data Analytics", "Electrical & Electronics", "Maritime Operations",
  "Sustainability", "Decarbonization", "Maritime Safety", "Artificial Intelligence",
  "Cybersecurity", "Project Development", "Professional Skills",
];

export const RESOURCE_CATEGORIES = [
  "Maritime Engineering", "Port Operations", "Fleet Performance", "Data Analytics",
  "Power BI", "Excel", "Python", "SQL", "Mechanical", "Electrical",
  "Sensors", "IoT", "Sustainability", "Safety", "AI", "Cybersecurity",
  "Research", "Career Development",
];

export const RESOURCE_TYPES = [
  "Guide", "Dataset", "Template", "Technical Reference", "Research Paper",
  "Video", "Tutorial", "Tool", "Code / Notebook", "Case Study",
  "Standard / Regulation", "External Link",
];

/** Project Resource Hub — organisation axes */
export const PROJECT_RESOURCE_ORGANISATION = ["Project", "Project Group", "Project Phase", "Skill Area", "Resource Type"] as const;

/** Skill areas for resource tagging */
export const SKILL_AREAS = [
  "Mechanical Systems", "Sensors & IoT", "Data Acquisition", "Data Analysis",
  "Excel", "Python", "Power BI", "SQL", "Signal Analysis",
  "Anomaly Detection", "Predictive Maintenance", "Maritime Operations",
  "Reliability Engineering", "Research", "Communication", "Project Management",
];

/** Mentor touchpoint types (periodic, not continuous classes) */
export const MENTOR_TOUCHPOINTS = [
  { key: "project_kickoff", label: "Project Kickoff", desc: "Initial project scoping and team alignment" },
  { key: "design_review", label: "Design / Approach Review", desc: "Review proposed solution approach and architecture" },
  { key: "midpoint_review", label: "Midpoint Review", desc: "Assess progress, pivot if needed" },
  { key: "industry_checkin", label: "Industry Check-In", desc: "Real-world context and industry perspective" },
  { key: "final_review", label: "Final Project Review", desc: "Evaluate deliverables and presentation readiness" },
];

/** Hub Essentials — programme-wide foundational material (NOT a course curriculum) */
export const HUB_ESSENTIALS = [
  { id: "he1", title: "Welcome to BlueData Hub", type: "Guide", description: "Introduction to the programme, your team, and what to expect." },
  { id: "he2", title: "How BlueData Hub Works", type: "Guide", description: "The project-based learning model, mentor touchpoints, and milestones." },
  { id: "he3", title: "Project Methodology", type: "Guide", description: "The Understand → Measure → Analyse → Validate → Present framework." },
  { id: "he4", title: "Working with Maritime Data", type: "Technical Reference", description: "Data sources, formats, quality, and common maritime datasets." },
  { id: "he5", title: "Research & Data Integrity", type: "Guide", description: "Ethical data use, citation, and maintaining research integrity." },
  { id: "he6", title: "Project Documentation Standards", type: "Template", description: "How to document your project, code, and findings." },
  { id: "he7", title: "Team Collaboration", type: "Guide", description: "Working effectively in multidisciplinary teams." },
  { id: "he8", title: "Presenting Technical Solutions", type: "Guide", description: "Structuring and delivering technical presentations to industry audiences." },
];

/** Project-linked resources — DeeMarine Sentinel example */
export const PROJECT_RESOURCES: Array<{
  id: string; title: string; type: string; phase: string;
  skillArea?: string; description?: string; url?: string;
}> = [
  // UNDERSTAND
  { id: "pr1", title: "Pump and Motor Fundamentals", type: "Guide", phase: "understand", skillArea: "Mechanical Systems", description: "Core principles of pumps and motors in maritime applications." },
  { id: "pr2", title: "Bearing Failure Modes", type: "Technical Reference", phase: "understand", skillArea: "Mechanical Systems", description: "Common bearing failure patterns and root causes." },
  { id: "pr3", title: "Lubrication Fundamentals", type: "Guide", phase: "understand", skillArea: "Mechanical Systems", description: "Lubrication types, schedules, and analysis." },
  { id: "pr4", title: "Machinery Condition Monitoring", type: "Research Paper", phase: "understand", skillArea: "Predictive Maintenance", description: "Overview of condition monitoring techniques and standards." },
  // MEASURE
  { id: "pr5", title: "Sensor Selection Guide", type: "Guide", phase: "measure", skillArea: "Sensors & IoT", description: "Choosing the right sensors for vibration, temperature, and current." },
  { id: "pr6", title: "ESP32 Setup Tutorial", type: "Tutorial", phase: "measure", skillArea: "Sensors & IoT", description: "Step-by-step ESP32 development environment setup." },
  { id: "pr7", title: "Temperature Measurement", type: "Technical Reference", phase: "measure", skillArea: "Data Acquisition", description: "Thermocouple, RTD, and infrared measurement methods." },
  { id: "pr8", title: "Vibration Measurement", type: "Technical Reference", phase: "measure", skillArea: "Data Acquisition", description: "Accelerometer placement, sampling rates, and signal basics." },
  // ANALYSE
  { id: "pr9", title: "Excel Analysis Template", type: "Template", phase: "analyse", skillArea: "Excel", description: "Pre-built Excel workbook for machinery data trend analysis." },
  { id: "pr10", title: "Python Starter Notebook", type: "Code / Notebook", phase: "analyse", skillArea: "Python", description: "Jupyter notebook with Pandas/NumPy starter code for sensor data." },
  { id: "pr11", title: "Power BI Template", type: "Template", phase: "analyse", skillArea: "Power BI", description: "Maritime dashboard template with KPI cards and trend charts." },
  { id: "pr12", title: "Signal Analysis Reference", type: "Technical Reference", phase: "analyse", skillArea: "Signal Analysis", description: "FFT, time-domain, and frequency-domain analysis methods." },
  // VALIDATE
  { id: "pr13", title: "Testing Methodology", type: "Guide", phase: "validate", skillArea: "Project Management", description: "How to validate your prototype with real or simulated data." },
  { id: "pr14", title: "Engineering Validation Checklist", type: "Template", phase: "validate", skillArea: "Reliability Engineering", description: "Checklist for engineering validation and acceptance testing." },
  // PRESENT
  { id: "pr15", title: "Technical Report Template", type: "Template", phase: "present", skillArea: "Communication", description: "Standard technical report structure for project deliverables." },
  { id: "pr16", title: "Project Presentation Template", type: "Template", phase: "present", skillArea: "Communication", description: "Slide deck template for final project presentations." },
];

/** Skill Passport evidence sources — project-first, not course-based */
export const SKILL_EVIDENCE_SOURCES = [
  "Project tasks", "Analysis", "Research", "Dashboards", "Code",
  "Engineering work", "Prototype development", "Presentations",
  "Team contributions", "Mentor assessments", "Final deliverables",
];

export const SUPPORT_CATEGORIES = [
  "Portal Access Issue", "Programme Question", "Project Question",
  "Assignment Question", "Technical Issue", "Other",
];

export const ATTENTION_FLAGS: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  good_progress: { label: "Good Progress", color: "bg-blue-100 text-blue-700" },
  assignment_overdue: { label: "Assignment Overdue", color: "bg-red-100 text-red-700" },
  low_attendance: { label: "Low Attendance", color: "bg-orange-100 text-orange-700" },
  no_recent_activity: { label: "No Recent Activity", color: "bg-yellow-100 text-yellow-700" },
  project_delay: { label: "Project Delay", color: "bg-purple-100 text-purple-700" },
  needs_support: { label: "Needs Support", color: "bg-pink-100 text-pink-700" },
};

// ============================================================
// DATA ACCESS FUNCTIONS
// ============================================================
async function fetchOrSeed<T>(table: string, seed: T[]): Promise<T[]> {
  if (!isSupabaseConfigured) return seed;
  try {
    const { data, error } = await supabase.from(table).select("*");
    if (error || !data || data.length === 0) return seed;
    return data as T[];
  } catch {
    return seed;
  }
}

export async function getCohorts(): Promise<Cohort[]> {
  return fetchOrSeed("portal_cohorts", [SEED_COHORT]);
}

export async function getTracks(): Promise<Track[]> {
  return fetchOrSeed("portal_tracks", SEED_TRACKS);
}

export async function getSkills(): Promise<Skill[]> {
  return fetchOrSeed("portal_skills", SEED_SKILLS);
}

export async function getModules(): Promise<Module[]> {
  return fetchOrSeed("portal_modules", SEED_MODULES);
}

export async function getAssignments(): Promise<Assignment[]> {
  return fetchOrSeed("portal_assignments", SEED_ASSIGNMENTS);
}

export async function getSessions(): Promise<Session[]> {
  return fetchOrSeed("portal_sessions", SEED_SESSIONS);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return fetchOrSeed("portal_announcements", SEED_ANNOUNCEMENTS);
}

export async function getResources(): Promise<Resource[]> {
  return fetchOrSeed("portal_resources", SEED_RESOURCES);
}

export async function getProjects(): Promise<Project[]> {
  return fetchOrSeed("portal_projects", [SEED_PROJECT]);
}

export async function getProjectMilestones(projectId?: string): Promise<ProjectMilestone[]> {
  if (!isSupabaseConfigured) return SEED_PROJECT_MILESTONES;
  try {
    let query = supabase.from("portal_project_milestones").select("*");
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error || !data || data.length === 0) return SEED_PROJECT_MILESTONES;
    return data as ProjectMilestone[];
  } catch {
    return SEED_PROJECT_MILESTONES;
  }
}

export async function getParticipantSkills(participantId: string): Promise<ParticipantSkill[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_participant_skills")
      .select("*")
      .eq("participant_id", participantId);
    if (error) return [];
    return (data || []) as ParticipantSkill[];
  } catch {
    return [];
  }
}

export async function getSubmissions(participantId: string): Promise<Submission[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_submissions")
      .select("*")
      .eq("participant_id", participantId);
    if (error) return [];
    return (data || []) as Submission[];
  } catch {
    return [];
  }
}

export async function getPortfolioItems(participantId: string): Promise<PortfolioItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_portfolio_items")
      .select("*")
      .eq("participant_id", participantId);
    if (error) return [];
    return (data || []) as PortfolioItem[];
  } catch {
    return [];
  }
}

export async function getNotifications(participantId: string): Promise<Notification[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_notifications")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data || []) as Notification[];
  } catch {
    return [];
  }
}

export async function getSupportRequests(participantId: string): Promise<SupportRequest[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_support_requests")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data || []) as SupportRequest[];
  } catch {
    return [];
  }
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_group_members")
      .select("*, participant:portal_participants(*)")
      .eq("group_id", groupId);
    if (error) return [];
    return (data || []) as GroupMember[];
  } catch {
    return [];
  }
}

export async function getMentor(mentorId: string): Promise<Mentor | null> {
  if (!isSupabaseConfigured) return SEED_MENTOR;
  try {
    const { data, error } = await supabase
      .from("portal_mentors")
      .select("*")
      .eq("id", mentorId)
      .single();
    if (error) return SEED_MENTOR;
    return data as Mentor;
  } catch {
    return SEED_MENTOR;
  }
}

export async function getAllParticipants(): Promise<Participant[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from("portal_participants").select("*");
    if (error) return [];
    return (data || []) as Participant[];
  } catch {
    return [];
  }
}

export async function submitAssignment(
  assignmentId: string,
  participantId: string,
  submission: { text_response?: string; link_response?: string; file_url?: string }
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Database not configured. Please contact support." };
  }
  try {
    const { error } = await supabase.from("portal_submissions").upsert({
      assignment_id: assignmentId,
      participant_id: participantId,
      status: "submitted",
      text_response: submission.text_response || null,
      link_response: submission.link_response || null,
      file_url: submission.file_url || null,
      submitted_at: new Date().toISOString(),
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function createSupportRequest(
  participantId: string,
  category: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Database not configured. Please contact support." };
  }
  try {
    const { error } = await supabase.from("portal_support_requests").insert({
      participant_id: participantId,
      category,
      subject,
      message,
      status: "open",
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

async function logActivityImpl(participantId: string, action: string, details?: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from("portal_activity_logs").insert({
      participant_id: participantId,
      action,
      details: details || null,
    });
  } catch {
    // silent fail
  }
}export const logActivity = logActivityImpl;

// ============================================================
// ADMIN: PARTICIPANT ACCESS MANAGEMENT
// ============================================================

export interface BlueDataHubApplication {
  id: string;
  application_reference: string;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string; 
  current_status?: string;
  organization?: string;
  maritime_background: string;
  analytics_level: string;
  analytics_tools?: string[];
  primary_interests?: string[];
  first_department_choice: string;
  second_department_choice?: string;
  third_department_choice?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  internship_motivation?: string;
  referral_source?: string;
  application_status: string;
  selection_status: "pending" | "selected" | "waitlist" | "not_selected";
  maritime_background_score?: number;
  analytics_knowledge_score?: number;
  portfolio_score?: number;
  motivation_score?: number;
  applied_challenge_score?: number;
  communication_commitment_score?: number;
  total_score?: number;
  reviewer_notes?: string;
  internal_notes?: string;
  submitted_at: string;
  updated_at?: string;
  reviewed_at?: string;
}

/** Allowed selection statuses for applicant workflow. */
export const SELECTION_STATUSES = ["pending", "selected", "waitlist", "not_selected"] as const;
export type SelectionStatus = typeof SELECTION_STATUSES[number];

export const SELECTION_STATUS_CONFIG: Record<SelectionStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-slate-100 text-slate-600" },
  selected: { label: "Selected", color: "bg-green-100 text-green-700" },
  waitlist: { label: "Waitlist", color: "bg-amber-100 text-amber-700" },
  not_selected: { label: "Not Selected", color: "bg-red-100 text-red-700" },
};

export interface ParticipantAccessRecord {
  id: string;
  participant_id: string;
  pin_hash: string;
  failed_attempts: number;
  locked_until?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ParticipantWithAccess extends Participant {
  access?: ParticipantAccessRecord | null;
}

export interface PinGenerationResult {
  participantId: string;
  referenceNumber: string;
  fullName: string;
  temporaryPin: string;
  pinSource?: "phone" | "random";
  accessStatus: string;
}

/**
 * Generate a random 16-byte hex salt for sha256_salted format.
 */
function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Compute SHA-256 hex digest of a string.
 */
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Centralized PIN hashing.
 * Produces sha256_salted$salt$SHA256(salt:pin) format, matching
 * the format used in the database for all 41 participant access records.
 */
export async function hashPin(pin: string): Promise<string> {
  const salt = generateSalt();
  const hash = await sha256Hex(salt + ":" + pin);
  return `sha256_salted$${salt}$${hash}`;
}

/**
 * Verify a PIN against a stored hash.
 * Supports:
 *   - sha256_salted$salt$hash format (current, used by all 41 records)
 *   - Legacy plain SHA-256 format (pin + "::bdh_salt_2026") for backward compat
 */
export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith("sha256_salted$")) {
    const parts = storedHash.split("$");
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const expectedHash = parts[2];
    const computedHash = await sha256Hex(salt + ":" + pin);
    return computedHash === expectedHash;
  }
  // Legacy format: plain SHA-256 with hardcoded salt
  const legacyHash = await sha256Hex(pin + "::bdh_salt_2026");
  return legacyHash === storedHash;
}

/**
 * Password validation rules.
 * Enforces: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters long.");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter.");
  if (!/\d/.test(password)) errors.push("Password must contain at least one digit.");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Password must contain at least one special character (!@#$%^&* etc.).");
  return { valid: errors.length === 0, errors };
}

/**
 * Generate a cryptographically random 10-character temporary password
 * that satisfies the password policy (uppercase, lowercase, digit, special char).
 */
export function generateTemporaryPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;

  const getSecureRandom = (max: number): number => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  };

  // Guarantee at least one of each required category
  const required = [
    upper[getSecureRandom(upper.length)],
    lower[getSecureRandom(lower.length)],
    digits[getSecureRandom(digits.length)],
    special[getSecureRandom(special.length)],
  ];

  // Fill remaining 6 characters from the full pool
  for (let i = 0; i < 6; i++) {
    required.push(all[getSecureRandom(all.length)]);
  }

  // Shuffle using Fisher-Yates
  for (let i = required.length - 1; i > 0; i--) {
    const j = getSecureRandom(i + 1);
    [required[i], required[j]] = [required[j], required[i]];
  }

  return required.join("");
}

/** @deprecated Use generateTemporaryPassword() instead. Kept for backward compatibility. */
export function generatePin(): string {
  return generateTemporaryPassword();
}

/**
 * Get the initial password for an application.
 * Always generates a secure random password (phone-derived PINs removed for security).
 */
export async function getInitialPinForApplication(
  _application: BlueDataHubApplication,
): Promise<{ pin: string; source: "phone" | "random"; phoneUsed?: string }> {
  return { pin: generateTemporaryPassword(), source: "random" };
}

/** Fetch all applications from dma_bluedata_hub_applications (for admin applicant workflow). */
export async function getAllApplications(): Promise<BlueDataHubApplication[]> {
  if (!isSupabaseConfigured) {
    console.warn("getAllApplications: Supabase not configured");
    return [];
  }
  try {
    const { data, error } = await supabase
      .from("dma_bluedata_hub_applications")
      .select("*")
      .order("total_score", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("getAllApplications error:", JSON.stringify(error, null, 2));
      // If selection_status column missing, try without it
      if (error.code === "42703") {
        console.warn("getAllApplications: selection_status column may not exist yet. Run the migration SQL.");
      }
      return [];
    }
    if (!data || data.length === 0) {
      console.warn("getAllApplications: query returned 0 rows. Check RLS policies and table data.");
    }
    // Normalize: ensure selection_status defaults to 'pending' if column not yet in DB
    const apps = (data || []) as BlueDataHubApplication[];
    return apps.map((a) => ({
      ...a,
      selection_status: a.selection_status || "pending",
    }));
  } catch (e) {
    console.error("getAllApplications exception:", e);
    return [];
  }
}

/** Diagnostic: test Supabase connection and RLS for applications table. */
export async function diagnoseApplicationsConnection(): Promise<{
  configured: boolean;
  error?: string;
  rowCount?: number;
  rlsBlocked?: boolean;
  columnMissing?: string;
}> {
  if (!isSupabaseConfigured) {
    return { configured: false, error: "Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." };
  }
  try {
    const { data, error, count } = await supabase
      .from("dma_bluedata_hub_applications")
      .select("id", { count: "exact" });
    if (error) {
      const columnMissing = error.code === "42703" ? error.message : undefined;
      return { configured: true, error: error.message, columnMissing };
    }
    return {
      configured: true,
      rowCount: data?.length ?? 0,
      rlsBlocked: (data?.length ?? 0) === 0 && (count ?? 0) === 0,
    };
  } catch (e) {
    return { configured: true, error: String(e) };
  }
}

/** Backward-compatible alias — returns all applications. */
export async function getAcceptedApplications(): Promise<BlueDataHubApplication[]> {
  return getAllApplications();
}

/** Update selection_status for a single application. */
export async function updateSelectionStatus(
  applicationId: string,
  status: SelectionStatus,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("dma_bluedata_hub_applications")
      .update({ selection_status: status })
      .eq("id", applicationId);
    if (error) { console.error("updateSelectionStatus:", error); return false; }
    return true;
  } catch (e) {
    console.error("updateSelectionStatus:", e);
    return false;
  }
}

/** Bulk-update selection_status for multiple applications. */
export async function bulkUpdateSelectionStatus(
  applicationIds: string[],
  status: SelectionStatus,
): Promise<{ updated: number; failed: number }> {
  if (!isSupabaseConfigured) return { updated: 0, failed: applicationIds.length };
  let updated = 0;
  let failed = 0;
  for (const id of applicationIds) {
    const ok = await updateSelectionStatus(id, status);
    if (ok) updated++; else failed++;
  }
  return { updated, failed };
}

/** Fetch all participants with their access records joined. */
export async function getAllParticipantsWithAccess(): Promise<ParticipantWithAccess[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("portal_participants")
      .select("*, access:portal_participant_access(*)")
      .order("created_at", { ascending: false });
    if (error) { console.error("getAllParticipantsWithAccess:", error); return []; }
    return (data || []) as ParticipantWithAccess[];
  } catch (e) {
    console.error("getAllParticipantsWithAccess:", e);
    return [];
  }
}

/** Get the set of application_ids that already have a participant record. */
export async function getActivatedApplicationIds(): Promise<Set<string>> {
  if (!isSupabaseConfigured) return new Set();
  try {
    const { data, error } = await supabase
      .from("portal_participants")
      .select("application_id")
      .not("application_id", "is", null);
    if (error) return new Set();
    return new Set((data || []).map((d: { application_id: string }) => d.application_id));
  } catch {
    return new Set();
  }
}

/**
 * Activate a single participant from an accepted application.
 * Creates portal_participants + portal_participant_access records.
 * Returns the generated PIN (shown once to admin).
 * SAFETY: Only applicants with selection_status = "selected" can be activated.
 */
export async function activateParticipantFromApplication(
  application: BlueDataHubApplication,
  cohortId?: string,
  trackId?: string,
): Promise<PinGenerationResult | null> {
  if (!isSupabaseConfigured) return null;
  // Safety gate: only selected applicants can be activated
  if (application.selection_status !== "selected") {
    console.error("activateParticipant: applicant selection_status is", application.selection_status, "— only 'selected' can be activated");
    return null;
  }
  try {
    // Idempotency: skip if already activated
    const { data: existing } = await supabase
      .from("portal_participants")
      .select("id")
      .eq("application_id", application.id)
      .maybeSingle();
    if (existing) return null;

    // Derive initial PIN from phone number (last 4 digits), fallback to random
    const { pin, source: pinSource } = await getInitialPinForApplication(application);
    const pinHash = await hashPin(pin);

    // 1. Create participant record linked to the original application
    const { data: participantData, error: pErr } = await supabase
      .from("portal_participants")
      .insert({
        application_id: application.id,
        reference_number: application.application_reference,
        full_name: application.full_name,
        email: application.email,
        cohort_id: cohortId || null,
        track_id: trackId || null,
        programme_status: "active",
        access_status: "active",
        first_login: true,
      })
      .select()
      .single();

    if (pErr || !participantData) {
      console.error("activateParticipant: insert participant failed:", pErr);
      return null;
    }

    // 2. Create access record with hashed PIN
    const { error: aErr } = await supabase
      .from("portal_participant_access")
      .insert({
        participant_id: participantData.id,
        pin_hash: pinHash,
        failed_attempts: 0,
        is_active: true,
      });

    if (aErr) {
      console.error("activateParticipant: insert access failed:", aErr);
      return null;
    }

    console.info(`activateParticipant: PIN derived from ${pinSource} for ${application.full_name}`);
    return {
      participantId: participantData.id,
      referenceNumber: application.application_reference,
      fullName: application.full_name,
      temporaryPin: pin,
      pinSource,
      accessStatus: "active",
    };
  } catch (e) {
    console.error("activateParticipant:", e);
    return null;
  }
}

/** Bulk-activate multiple applicants. Only those with selection_status = "selected" are activated. Returns results for each successful activation. */
export async function bulkActivateParticipants(
  applications: BlueDataHubApplication[],
  cohortId?: string,
  trackId?: string,
): Promise<PinGenerationResult[]> {
  const results: PinGenerationResult[] = [];
  for (const app of applications) {
    // Safety: skip non-selected applicants
    if (app.selection_status !== "selected") continue;
    const result = await activateParticipantFromApplication(app, cohortId, trackId);
    if (result) results.push(result);
  }
  return results;
}

/**
 * Reset a participant's PIN.
 * Returns the new temporary PIN (shown once to admin).
 * Also clears lockout and reactivates access.
 */
export async function resetParticipantPin(participantId: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const pin = generatePin();
    const pinHash = await hashPin(pin);

    const { error } = await supabase
      .from("portal_participant_access")
      .update({ pin_hash: pinHash, failed_attempts: 0, locked_until: null, is_active: true })
      .eq("participant_id", participantId);

    if (error) { console.error("resetParticipantPin:", error); return null; }

    await supabase
      .from("portal_participants")
      .update({ access_status: "active" })
      .eq("id", participantId);

    return pin;
  } catch (e) {
    console.error("resetParticipantPin:", e);
    return null;
  }
}

/** Activate portal access for an existing participant who has no access record yet. */
export async function activateExistingParticipant(participantId: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data: existing } = await supabase
      .from("portal_participant_access")
      .select("id")
      .eq("participant_id", participantId)
      .maybeSingle();

    if (existing) return resetParticipantPin(participantId);

    const pin = generatePin();
    const pinHash = await hashPin(pin);

    const { error } = await supabase
      .from("portal_participant_access")
      .insert({ participant_id: participantId, pin_hash: pinHash, failed_attempts: 0, is_active: true });

    if (error) { console.error("activateExistingParticipant:", error); return null; }

    await supabase
      .from("portal_participants")
      .update({ access_status: "active" })
      .eq("id", participantId);

    return pin;
  } catch (e) {
    console.error("activateExistingParticipant:", e);
    return null;
  }
}

/** Deactivate a participant's portal access. */
export async function deactivateParticipantAccess(participantId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error: a1 } = await supabase
      .from("portal_participant_access")
      .update({ is_active: false })
      .eq("participant_id", participantId);
    const { error: a2 } = await supabase
      .from("portal_participants")
      .update({ access_status: "deactivated" })
      .eq("id", participantId);
    return !a1 && !a2;
  } catch { return false; }
}

/** Reactivate a deactivated participant's portal access. */
export async function reactivateParticipantAccess(participantId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error: a1 } = await supabase
      .from("portal_participant_access")
      .update({ is_active: true, failed_attempts: 0, locked_until: null })
      .eq("participant_id", participantId);
    const { error: a2 } = await supabase
      .from("portal_participants")
      .update({ access_status: "active" })
      .eq("id", participantId);
    return !a1 && !a2;
  } catch { return false; }
}

/**
 * Change PIN (participant self-service after first login).
 * Uses bdh-portal-auth Edge Function to avoid RLS 401 on direct table queries.
 * The Edge Function verifies the current PIN and sets the new one server-side.
 */
export async function changeParticipantPin(
  participantId: string,
  currentPin: string,
  newPin: string,
  reference?: string,
  accessToken?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: "Database not configured." };

  // Enforce password policy before sending to server
  const { valid, errors: validationErrors } = validatePassword(newPin);
  if (!valid) {
    return { success: false, error: validationErrors[0] || "Password does not meet requirements." };
  }

  try {
    const body: Record<string, string> = {
      action: "change_pin",
      current_pin: currentPin,
      new_pin: newPin,
    };
    // Include reference + access_token if available (required by Edge Function for session)
    if (reference) body.reference = reference;
    if (accessToken) body.access_token = accessToken;

    const { data, error } = await supabase.functions.invoke("bdh-pin-mgmt", { body });

    if (error) return { success: false, error: error.message || "Edge Function error." };
    if (!data?.success) return { success: false, error: data?.error || "Password change failed." };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/**
 * Comprehensive PIN Access Verification Report.
 * Audits all participant access records and returns a structured report
 * covering: active/locked/deactivated counts, lockout details,
 * failed-attempt distribution, last-login recency, and phone-derived PIN
 * consistency checks.
 */
export interface PinAccessVerificationReport {
  generatedAt: string;
  queryFailed: boolean;
  errors: string[];
  totalParticipants: number;
  totalAccessRecords: number;
  totalApplications: number;
  selectedCount: number;
  explorerCount: number;
  declinedCount: number;
  activatedCount: number;
  pinSetCount: number;
  summary: {
    active: number;
    locked: number;
    deactivated: number;
    neverLoggedIn: number;
  };
  lockouts: Array<{
    participantId: string;
    referenceNumber: string;
    fullName: string;
    lockedUntil: string;
    failedAttempts: number;
  }>;
  failedAttemptDistribution: Record<string, number>;
  lastLoginBuckets: {
    within24h: number;
    within7d: number;
    within30d: number;
    older: number;
    never: number;
  };
  phonePinConsistency: {
    checked: number;
    matchPhone: number;
    noPhoneAvailable: number;
    mismatches: Array<{
      participantId: string;
      referenceNumber: string;
      fullName: string;
      phone?: string;
      derivedPin: string;
      note: string;
    }>;
  };
  selectionStatusGate: {
    totalApplications: number;
    selected: number;
    activated: number;
    activatedWithoutSelected: number;
  };
  gatingViolations: Array<{
    participantName: string;
    referenceNumber: string;
    selectionStatus: string;
    accessStatus: string;
  }>;
  orphanedAccess: Array<{
    participantName: string;
    referenceNumber: string;
    pinSet: boolean;
    isActive: boolean;
  }>;
  selectedNotActivated: Array<{
    fullName: string;
    referenceNumber: string;
    country: string;
    totalScore: number | null;
  }>;
  phoneFieldUsed: string;
  missingInvalidPhoneCount: number;
}

export async function generatePinAccessVerificationReport(): Promise<PinAccessVerificationReport> {
  const now = new Date().toISOString();
  const errors: string[] = [];
  let queryFailed = false;
  const report: PinAccessVerificationReport = {
    generatedAt: now,
    queryFailed: false,
    errors: [],
    totalParticipants: 0,
    totalAccessRecords: 0,
    totalApplications: 0,
    selectedCount: 0,
    explorerCount: 0,
    declinedCount: 0,
    activatedCount: 0,
    pinSetCount: 0,
    summary: { active: 0, locked: 0, deactivated: 0, neverLoggedIn: 0 },
    lockouts: [],
    failedAttemptDistribution: {},
    lastLoginBuckets: { within24h: 0, within7d: 0, within30d: 0, older: 0, never: 0 },
    phonePinConsistency: { checked: 0, matchPhone: 0, noPhoneAvailable: 0, mismatches: [] },
    selectionStatusGate: { totalApplications: 0, selected: 0, activated: 0, activatedWithoutSelected: 0 },
    gatingViolations: [],
    orphanedAccess: [],
    selectedNotActivated: [],
    phoneFieldUsed: "whatsapp",
    missingInvalidPhoneCount: 0,
  };

  if (!isSupabaseConfigured) {
    report.queryFailed = true;
    report.errors.push("Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
    return report;
  }

  try {
    // ── Secure path: Edge Function only (service role bypasses RLS) ──
    // NO fallback to anon direct queries for sensitive tables.
    // If the Edge Function is unavailable, the report shows an
    // admin configuration error — never silently reads via anon key.
    let participants: any[] | null = null;
    let accessRecords: any[] | null = null;
    let appsList: any[] = [];
    let usedEdgeFunction = false;

    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("admin-pin-verify");
      if (!fnError && fnData && !fnData.error) {
        participants = fnData.participants ?? [];
        accessRecords = fnData.accessRecords ?? [];
        appsList = fnData.applications ?? [];
        usedEdgeFunction = true;
        report.phoneFieldUsed = fnData.phoneFieldUsed ?? "whatsapp";
        if (fnData.errors?.length) {
          errors.push(...fnData.errors);
          queryFailed = true;
        }
        console.info("PIN Verify: used admin-pin-verify Edge Function (service role)");
      } else {
        const detail = fnError?.message || fnData?.error || "unknown error";
        const msg = `Admin configuration error: the admin-pin-verify Edge Function is not deployed or returned an error. Deploy it with: supabase functions deploy admin-pin-verify. Detail: ${detail}`;
        errors.push(msg);
        console.error("PIN Verify:", msg);
        queryFailed = true;
      }
    } catch (fnErr) {
      const msg = `Admin configuration error: the admin-pin-verify Edge Function could not be invoked. Deploy it with: supabase functions deploy admin-pin-verify. Detail: ${fnErr instanceof Error ? fnErr.message : String(fnErr)}`;
      errors.push(msg);
      console.error("PIN Verify:", msg);
      queryFailed = true;
    }

    if (!usedEdgeFunction) {
      // Do NOT fall back to anon direct queries on sensitive tables.
      // Return the report with queryFailed=true so the UI shows
      // "Verification failed. Participant data could not be loaded."
      report.queryFailed = true;
      report.errors = errors;
      return report;
    }

    report.totalParticipants = participants?.length ?? 0;
    report.totalAccessRecords = accessRecords?.length ?? 0;

    const participantMap = new Map((participants ?? []).map((p: any) => [p.id, p]));

    for (const access of accessRecords ?? []) {
      const participant = participantMap.get(access.participant_id);

      // Summary counts
      if (!access.is_active) {
        report.summary.deactivated++;
      } else if (access.locked_until && new Date(access.locked_until) > new Date()) {
        report.summary.locked++;
        report.lockouts.push({
          participantId: access.participant_id,
          referenceNumber: participant?.reference_number ?? "—",
          fullName: participant?.full_name ?? "—",
          lockedUntil: access.locked_until,
          failedAttempts: access.failed_attempts ?? 0,
        });
      } else {
        report.summary.active++;
      }

      // PIN set count
      if (access.pin_hash) report.pinSetCount++;

      // Failed attempt distribution
      const attempts = String(access.failed_attempts ?? 0);
      report.failedAttemptDistribution[attempts] = (report.failedAttemptDistribution[attempts] ?? 0) + 1;

      // Last login buckets
      if (!access.last_login_at) {
        report.lastLoginBuckets.never++;
        report.summary.neverLoggedIn++;
      } else {
        const hoursSince = (Date.now() - new Date(access.last_login_at).getTime()) / 3600000;
        if (hoursSince <= 24) report.lastLoginBuckets.within24h++;
        else if (hoursSince <= 168) report.lastLoginBuckets.within7d++;
        else if (hoursSince <= 720) report.lastLoginBuckets.within30d++;
        else report.lastLoginBuckets.older++;
      }
    }

    // Applications were fetched by the Edge Function (service role).
    // No anon direct query fallback — that path returned early above.

    // Zero-application guard: the database should contain existing
    // BlueData Hub applications. A zero count is not a successful result.
    if (appsList.length === 0 && !queryFailed) {
      const msg = "Zero applications returned from admin-pin-verify Edge Function. The database should contain existing BlueData Hub applications. This may indicate a schema mismatch, empty table, or Edge Function query error that was not surfaced.";
      errors.push(msg);
      console.error("PIN Verify:", msg);
      queryFailed = true;
    }

    report.selectionStatusGate.totalApplications = appsList.length;
    report.totalApplications = appsList.length;
    report.selectionStatusGate.selected = appsList.filter((a) => a.selection_status === "selected").length;
    report.selectedCount = report.selectionStatusGate.selected;
    report.explorerCount = appsList.filter((a) => a.selection_status === "explorer").length;
    report.declinedCount = appsList.filter((a) => a.selection_status === "declined").length;

    const activatedAppIds = new Set(
      (participants ?? []).filter((p: any) => p.application_id).map((p: any) => p.application_id),
    );
    report.selectionStatusGate.activated = activatedAppIds.size;
    report.activatedCount = activatedAppIds.size;

    // Check for activated participants whose application is NOT selected (gating violations)
    const appMap = new Map(appsList.map((a: any) => [a.id, a]));
    for (const participant of (participants ?? [])) {
      if (!participant.application_id) continue;
      const app = appMap.get(participant.application_id);
      if (!app) {
        // Orphaned: participant has application_id but no matching application
        const access = (accessRecords ?? []).find((a: any) => a.participant_id === participant.id);
        report.orphanedAccess.push({
          participantName: participant.full_name ?? "—",
          referenceNumber: participant.reference_number ?? "—",
          pinSet: !!access?.pin_hash,
          isActive: access?.is_active ?? false,
        });
        continue;
      }
      if (app.selection_status !== "selected") {
        // Gating violation: activated but not selected
        const access = (accessRecords ?? []).find((a: any) => a.participant_id === participant.id);
        report.gatingViolations.push({
          participantName: participant.full_name ?? "—",
          referenceNumber: participant.reference_number ?? "—",
          selectionStatus: app.selection_status ?? "pending",
          accessStatus: access?.is_active ? "active" : "deactivated",
        });
        report.selectionStatusGate.activatedWithoutSelected++;
      }
    }

    // Selected but not yet activated
    for (const app of appsList) {
      if (app.selection_status === "selected" && !activatedAppIds.has(app.id)) {
        report.selectedNotActivated.push({
          fullName: app.full_name ?? "—",
          referenceNumber: app.application_reference ?? "—",
          country: app.country ?? "—",
          totalScore: app.total_score ?? null,
        });
      }
    }

    // Phone-derived PIN consistency check (informational only — we cannot reverse-hash)
    for (const app of appsList) {
      if (!activatedAppIds.has(app.id)) continue;
      report.phonePinConsistency.checked++;
      const phoneSource = app.whatsapp;
      const derivedPin = derivePinFromPhone(phoneSource);
      if (derivedPin) {
        report.phonePinConsistency.matchPhone++;
      } else {
        report.phonePinConsistency.noPhoneAvailable++;
        report.phonePinConsistency.mismatches.push({
          participantId: "—",
          referenceNumber: "—",
          fullName: app.full_name ?? "—",
          phone: phoneSource ?? undefined,
          derivedPin: "(random)",
          note: "No phone number available; PIN was randomly generated",
        });
      }
    }

    // Count missing/invalid phone values across ALL applications (not just activated)
    report.missingInvalidPhoneCount = appsList.filter((a: any) => {
      const digits = (a.whatsapp || "").replace(/\D/g, "");
      return digits.length < 4;
    }).length;
  } catch (e) {
    const msg = `Unexpected error: ${e instanceof Error ? e.message : String(e)}`;
    errors.push(msg);
    console.error("generatePinAccessVerificationReport:", e);
    queryFailed = true;
  }

  report.queryFailed = queryFailed;
  report.errors = errors;
  return report;
}