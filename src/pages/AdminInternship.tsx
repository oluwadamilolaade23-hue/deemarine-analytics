import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Search,
  Download,
  LogOut,
  Eye,
  Star,
  Briefcase,
  Globe,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const STATUS_OPTIONS = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Waitlisted",
  "Not Selected",
  "Withdrawn",
] as const;

type StatusType = (typeof STATUS_OPTIONS)[number];

const SCORE_BANDS = [
  { min: 80, max: 100, label: "Strong Candidate", color: "bg-green-100 text-green-700" },
  { min: 65, max: 79, label: "Competitive", color: "bg-blue-100 text-blue-700" },
  { min: 50, max: 64, label: "Review Required", color: "bg-yellow-100 text-yellow-700" },
  { min: 0, max: 49, label: "Low Priority", color: "bg-red-100 text-red-700" },
];

const STATUS_COLORS: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  Interview: "bg-indigo-100 text-indigo-700",
  Selected: "bg-green-100 text-green-700",
  Waitlisted: "bg-orange-100 text-orange-700",
  "Not Selected": "bg-red-100 text-red-700",
  Withdrawn: "bg-slate-100 text-slate-700",
};

interface Review {
  id: string;
  reviewer_id: string;
  maritime_background_score: number;
  analytics_knowledge_score: number;
  portfolio_score: number;
  motivation_score: number;
  applied_challenge_score: number;
  communication_commitment_score: number;
  total_score: number;
  reviewer_comments: string;
  recommendation: string;
  created_at: string;
}

interface Application {
  id: string;
  application_reference: string;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
  linkedin_url: string;
  current_status: string;
  current_role: string;
  organization: string;
  maritime_discipline: string;
  years_maritime_experience: number;
  maritime_background: string;
  analytics_tools: string[];
  analytics_level: string;
  analytics_project_description: string;
  cv_url: string;
  portfolio_url: string;
  github_url: string;
  powerbi_url: string;
  tableau_url: string;
  first_department_choice: string;
  second_department_choice: string;
  third_department_choice: string;
  department_motivation: string;
  internship_motivation: string;
  expected_outcome: string;
  maritime_problem: string;
  applied_challenge_response: string;
  timezone: string;
  application_status: string;
  maritime_background_score: number;
  analytics_knowledge_score: number;
  portfolio_score: number;
  motivation_score: number;
  applied_challenge_score: number;
  communication_commitment_score: number;
  total_score: number;
  reviewer_notes: string;
  internal_notes: string;
  submitted_at: string;
  updated_at: string;
  reviewed_at: string;
}

function getScoreBand(score: number) {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) || SCORE_BANDS[3];
}

export default function AdminInternship() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "scoring" | "reviews">("details");

  // Scoring state
  const [scores, setScores] = useState({
    maritime_background_score: 0,
    analytics_knowledge_score: 0,
    portfolio_score: 0,
    motivation_score: 0,
    applied_challenge_score: 0,
    communication_commitment_score: 0,
  });
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("dma_bluedata_hub_applications")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("application_status", statusFilter);
      }
      if (deptFilter !== "all") {
        query = query.eq("first_department_choice", deptFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setApplications((data as Application[]) || []);
    } catch {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, deptFilter]);

  const fetchReviews = useCallback(async (appId: string) => {
    try {
      const { data, error } = await supabase
        .from("dma_bluedata_hub_reviews")
        .select("*")
        .eq("application_id", appId);
      if (error) throw error;
      setReviews((data as Review[]) || []);
    } catch {
      console.error("Failed to fetch reviews");
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchApplications();
    }
  }, [loggedIn, fetchApplications]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setLoggedIn(true);
    } catch {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    navigate("/");
  };

  const updateStatus = async (id: string, newStatus: StatusType) => {
    try {
      const { error } = await supabase
        .from("dma_bluedata_hub_applications")
        .update({ application_status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, application_status: newStatus } : a))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, application_status: newStatus });
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const saveScores = async () => {
    if (!selectedApp) return;
    try {
      const { error } = await supabase
        .from("dma_bluedata_hub_applications")
        .update({
          ...scores,
          reviewer_notes: reviewerNotes,
          internal_notes: internalNotes,
        })
        .eq("id", selectedApp.id);
      if (error) throw error;
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedApp.id
            ? { ...a, ...scores, reviewer_notes: reviewerNotes, internal_notes: internalNotes }
            : a
        )
      );
      setSelectedApp({ ...selectedApp, ...scores, reviewer_notes: reviewerNotes, internal_notes: internalNotes });
    } catch {
      console.error("Failed to save scores");
    }
  };

  const openApplication = (app: Application) => {
    setSelectedApp(app);
    setScores({
      maritime_background_score: app.maritime_background_score || 0,
      analytics_knowledge_score: app.analytics_knowledge_score || 0,
      portfolio_score: app.portfolio_score || 0,
      motivation_score: app.motivation_score || 0,
      applied_challenge_score: app.applied_challenge_score || 0,
      communication_commitment_score: app.communication_commitment_score || 0,
    });
    setReviewerNotes(app.reviewer_notes || "");
    setInternalNotes(app.internal_notes || "");
    setActiveTab("details");
    fetchReviews(app.id);
  };

  const filteredApplications = applications.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.full_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.application_reference.toLowerCase().includes(q) ||
      (a.first_department_choice || "").toLowerCase().includes(q) ||
      (a.maritime_discipline || "").toLowerCase().includes(q)
    );
  });

  const totalApplications = applications.length;
  const selectedCount = applications.filter((a) => a.application_status === "Selected").length;
  const shortlistedCount = applications.filter((a) => a.application_status === "Shortlisted").length;
  const submittedCount = applications.filter((a) => a.application_status === "Submitted").length;
  const underReviewCount = applications.filter((a) => a.application_status === "Under Review").length;
  const positionsRemaining = Math.max(0, 30 - selectedCount);

  const uniqueDepts = Array.from(
    new Set(applications.map((a) => a.first_department_choice).filter(Boolean))
  );

  const deptCounts: Record<string, number> = {};
  applications.forEach((a) => {
    if (a.first_department_choice) {
      deptCounts[a.first_department_choice] = (deptCounts[a.first_department_choice] || 0) + 1;
    }
  });

  const countryCounts: Record<string, number> = {};
  applications.forEach((a) => {
    countryCounts[a.country] = (countryCounts[a.country] || 0) + 1;
  });

  const disciplineCounts: Record<string, number> = {};
  applications.forEach((a) => {
    if (a.maritime_discipline) {
      disciplineCounts[a.maritime_discipline] = (disciplineCounts[a.maritime_discipline] || 0) + 1;
    }
  });

  const scoreBandCounts = SCORE_BANDS.map((band) => ({
    ...band,
    count: applications.filter((a) => a.total_score >= band.min && a.total_score <= band.max).length,
  }));

  const exportCSV = (type: "standard" | "review" | "shortlist") => {
    let appsToExport = filteredApplications;
    let filename = "bluedata-hub-members";

    if (type === "shortlist") {
      appsToExport = appsToExport.filter((a) =>
        ["Shortlisted", "Interview", "Selected", "Waitlisted"].includes(a.application_status)
      );
      filename = "bluedata-hub-shortlist";
    }

    const headers = type === "review"
      ? ["Ref", "Name", "Email", "Country", "Dept 1", "Status", "Maritime BG (0-20)", "Analytics (0-20)", "Portfolio (0-20)", "Motivation (0-15)", "Challenge (0-15)", "Communication (0-10)", "Total (0-100)", "Band", "Reviewer Notes"]
      : ["Ref", "Name", "Email", "WhatsApp", "Country", "City", "Status", "Current Role", "Organization", "Discipline", "Years Exp", "Analytics Level", "Tools", "Dept 1", "Dept 2", "Dept 3", "Total Score", "Band", "Timezone", "Submitted"];

    const rows = appsToExport.map((a) => {
      const band = getScoreBand(a.total_score);
      if (type === "review") {
        return [
          a.application_reference, a.full_name, a.email, a.country,
          a.first_department_choice, a.application_status,
          a.maritime_background_score, a.analytics_knowledge_score,
          a.portfolio_score, a.motivation_score,
          a.applied_challenge_score, a.communication_commitment_score,
          a.total_score, band.label, a.reviewer_notes || "",
        ];
      }
      return [
        a.application_reference, a.full_name, a.email, a.whatsapp,
        a.country, a.city || "", a.application_status,
        a.current_role || "", a.organization || "",
        a.maritime_discipline, a.years_maritime_experience,
        a.analytics_level, (a.analytics_tools || []).join("; "),
        a.first_department_choice, a.second_department_choice, a.third_department_choice,
        a.total_score, band.label, a.timezone,
        a.submitted_at ? new Date(a.submitted_at).toLocaleString() : "",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-slate-900">BlueData Hub Admin Login</CardTitle>
            <p className="text-sm text-slate-500">Sign in to manage BlueData Hub memberships</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@deemarineanalytics.ca" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {loginError && (<div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{loginError}</div>)}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" disabled={loggingIn}>
                {loggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="section-padding bg-slate-50 min-h-screen">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-slate-900">BlueData Hub Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage memberships — collaborative maritime analytics ecosystem
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => exportCSV("standard")} className="cursor-pointer">
              <Download className="h-4 w-4 mr-1" /> Standard CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV("review")} className="cursor-pointer">
              <FileText className="h-4 w-4 mr-1" /> Review CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV("shortlist")} className="cursor-pointer">
              <CheckCircle className="h-4 w-4 mr-1" /> Shortlist CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-xl font-bold text-slate-900">{totalApplications}</p><p className="text-xs text-slate-500">Total</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center"><UserPlus className="h-5 w-5 text-cyan-600" /></div>
              <div><p className="text-xl font-bold text-slate-900">{submittedCount}</p><p className="text-xs text-slate-500">Registered</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-600" /></div>
              <div><p className="text-xl font-bold text-slate-900">{underReviewCount}</p><p className="text-xs text-slate-500">Under Review</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Filter className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-xl font-bold text-slate-900">{shortlistedCount}</p><p className="text-xs text-slate-500">Shortlisted</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Briefcase className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-xl font-bold text-slate-900">{selectedCount}</p><p className="text-xs text-slate-500">Accepted</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><Globe className="h-5 w-5 text-orange-600" /></div>
              <div><p className="text-xl font-bold text-slate-900">{Object.keys(countryCounts).length}</p><p className="text-xs text-slate-500">Countries</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdowns */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base text-slate-900">By Project Lab</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(deptCounts).sort(([, a], [, b]) => b - a).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 truncate mr-2">{dept}</span>
                  <Badge variant="secondary" className="shrink-0">{count}</Badge>
                </div>
              ))}
              {Object.keys(deptCounts).length === 0 && <p className="text-sm text-slate-400">No data yet</p>}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base text-slate-900">By Country</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(countryCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([country, count]) => (
                <div key={country} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">{country}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {Object.keys(countryCounts).length === 0 && <p className="text-sm text-slate-400">No data yet</p>}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base text-slate-900">By Discipline</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(disciplineCounts).sort(([, a], [, b]) => b - a).map(([disc, count]) => (
                <div key={disc} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 truncate mr-2">{disc}</span>
                  <Badge variant="secondary" className="shrink-0">{count}</Badge>
                </div>
              ))}
              {Object.keys(disciplineCounts).length === 0 && <p className="text-sm text-slate-400">No data yet</p>}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base text-slate-900">By Score Band</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {scoreBandCounts.map((band) => (
                <div key={band.label} className="flex justify-between items-center text-sm">
                  <Badge className={band.color}>{band.label}</Badge>
                  <span className="text-slate-700 font-medium">{band.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search by name, email, country, ref, discipline..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Filter by lab" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Project Labs</SelectItem>
                  {uniqueDepts.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Application Detail Panel */}
        {selectedApp && (
          <Card className="border-0 shadow-sm mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Application Details</h3>
                  <p className="text-sm text-blue-600 font-mono">{selectedApp.application_reference}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedApp(null); setReviews([]); }} className="cursor-pointer">Close</Button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b">
                {(["details", "scoring", "reviews"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium cursor-pointer border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                    {tab === "details" ? "Details" : tab === "scoring" ? "Scoring" : "Reviews"}
                  </button>
                ))}
              </div>

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-slate-500">Name:</span> <span className="text-slate-900 font-medium">{selectedApp.full_name}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="text-slate-900 font-medium">{selectedApp.email}</span></div>
                    <div><span className="text-slate-500">WhatsApp:</span> <span className="text-slate-900 font-medium">{selectedApp.whatsapp}</span></div>
                    <div><span className="text-slate-500">Country:</span> <span className="text-slate-900 font-medium">{selectedApp.country}</span></div>
                    <div><span className="text-slate-500">City:</span> <span className="text-slate-900 font-medium">{selectedApp.city || "N/A"}</span></div>
                    <div><span className="text-slate-500">Discipline:</span> <span className="text-slate-900 font-medium">{selectedApp.maritime_discipline}</span></div>
                    <div><span className="text-slate-500">Current Status:</span> <span className="text-slate-900 font-medium">{selectedApp.current_status}</span></div>
                    <div><span className="text-slate-500">Role:</span> <span className="text-slate-900 font-medium">{selectedApp.current_role || "N/A"}</span></div>
                    <div><span className="text-slate-500">Organization:</span> <span className="text-slate-900 font-medium">{selectedApp.organization || "N/A"}</span></div>
                    <div><span className="text-slate-500">Years Exp:</span> <span className="text-slate-900 font-medium">{selectedApp.years_maritime_experience}</span></div>
                    <div><span className="text-slate-500">Analytics Level:</span> <span className="text-slate-900 font-medium">{selectedApp.analytics_level}</span></div>
                    <div><span className="text-slate-500">Timezone:</span> <span className="text-slate-900 font-medium">{selectedApp.timezone}</span></div>
                  </div>
                  <div className="text-sm"><span className="text-slate-500">Tools:</span> <span className="text-slate-900">{(selectedApp.analytics_tools || []).join(", ")}</span></div>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-slate-500">Project Lab:</span> <span className="text-slate-900 font-medium">{selectedApp.first_department_choice}</span></div>
                    <div><span className="text-slate-500">Lab 2:</span> <span className="text-slate-900 font-medium">{selectedApp.second_department_choice}</span></div>
                    <div><span className="text-slate-500">Lab 3:</span> <span className="text-slate-900 font-medium">{selectedApp.third_department_choice}</span></div>
                  </div>
                  {selectedApp.maritime_background && <div className="text-sm"><span className="text-slate-500">Maritime Background:</span> <span className="text-slate-900">{selectedApp.maritime_background}</span></div>}
                  {selectedApp.internship_motivation && <div className="text-sm"><span className="text-slate-500">Why BlueData Hub:</span> <span className="text-slate-900">{selectedApp.internship_motivation}</span></div>}
                  {selectedApp.maritime_problem && <div className="text-sm"><span className="text-slate-500">Maritime Problem:</span> <span className="text-slate-900">{selectedApp.maritime_problem}</span></div>}
                  {selectedApp.applied_challenge_response && <div className="text-sm"><span className="text-slate-500">Challenge Response:</span> <span className="text-slate-900">{selectedApp.applied_challenge_response}</span></div>}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {selectedApp.cv_url && <a href={selectedApp.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View CV</a>}
                    {selectedApp.portfolio_url && <a href={selectedApp.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Portfolio</a>}
                    {selectedApp.github_url && <a href={selectedApp.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub</a>}
                    {selectedApp.powerbi_url && <a href={selectedApp.powerbi_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Power BI</a>}
                    {selectedApp.tableau_url && <a href={selectedApp.tableau_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tableau</a>}
                    {selectedApp.linkedin_url && <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-sm text-slate-500">Status:</span>
                    <Badge className={STATUS_COLORS[selectedApp.application_status] || "bg-slate-100 text-slate-700"}>{selectedApp.application_status}</Badge>
                    <Select value={selectedApp.application_status} onValueChange={(value) => updateStatus(selectedApp.id, value as StatusType)}>
                      <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Scoring Tab */}
              {activeTab === "scoring" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Maritime Background (0-20)</Label>
                      <Input type="number" min={0} max={20} value={scores.maritime_background_score} onChange={(e) => setScores((p) => ({ ...p, maritime_background_score: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Analytics Knowledge (0-20)</Label>
                      <Input type="number" min={0} max={20} value={scores.analytics_knowledge_score} onChange={(e) => setScores((p) => ({ ...p, analytics_knowledge_score: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Portfolio / Projects (0-20)</Label>
                      <Input type="number" min={0} max={20} value={scores.portfolio_score} onChange={(e) => setScores((p) => ({ ...p, portfolio_score: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Motivation / Hub Fit (0-15)</Label>
                      <Input type="number" min={0} max={15} value={scores.motivation_score} onChange={(e) => setScores((p) => ({ ...p, motivation_score: Math.min(15, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Applied Challenge (0-15)</Label>
                      <Input type="number" min={0} max={15} value={scores.applied_challenge_score} onChange={(e) => setScores((p) => ({ ...p, applied_challenge_score: Math.min(15, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Communication / Commitment (0-10)</Label>
                      <Input type="number" min={0} max={10} value={scores.communication_commitment_score} onChange={(e) => setScores((p) => ({ ...p, communication_commitment_score: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) }))} />
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-slate-500">Total Score:</span>
                      <span className="text-2xl font-bold text-slate-900 ml-2">
                        {scores.maritime_background_score + scores.analytics_knowledge_score + scores.portfolio_score + scores.motivation_score + scores.applied_challenge_score + scores.communication_commitment_score}
                      </span>
                      <span className="text-slate-400 text-sm"> / 100</span>
                    </div>
                    <Badge className={getScoreBand(scores.maritime_background_score + scores.analytics_knowledge_score + scores.portfolio_score + scores.motivation_score + scores.applied_challenge_score + scores.communication_commitment_score).color}>
                      {getScoreBand(scores.maritime_background_score + scores.analytics_knowledge_score + scores.portfolio_score + scores.motivation_score + scores.applied_challenge_score + scores.communication_commitment_score).label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Reviewer Notes</Label>
                    <Textarea value={reviewerNotes} onChange={(e) => setReviewerNotes(e.target.value)} placeholder="Add reviewer notes..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Internal Notes</Label>
                    <Textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Add internal notes (not visible to applicant)..." rows={2} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveScores} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                      Save Scores & Notes
                    </Button>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No reviewer scores submitted yet.</p>
                  ) : (
                    <>
                      {reviews.map((review, idx) => (
                        <Card key={review.id} className="border shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-slate-900 text-sm">Reviewer {idx + 1}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-slate-900">{review.total_score}</span>
                                <span className="text-xs text-slate-400">/ 100</span>
                                {review.recommendation && <Badge className={review.recommendation === "Strongly Recommend" ? "bg-green-100 text-green-700" : review.recommendation === "Recommend" ? "bg-blue-100 text-blue-700" : review.recommendation === "Hold" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>{review.recommendation}</Badge>}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                              <div className="text-center"><p className="text-slate-400">Maritime</p><p className="font-medium text-slate-900">{review.maritime_background_score}/20</p></div>
                              <div className="text-center"><p className="text-slate-400">Analytics</p><p className="font-medium text-slate-900">{review.analytics_knowledge_score}/20</p></div>
                              <div className="text-center"><p className="text-slate-400">Portfolio</p><p className="font-medium text-slate-900">{review.portfolio_score}/20</p></div>
                              <div className="text-center"><p className="text-slate-400">Motivation</p><p className="font-medium text-slate-900">{review.motivation_score}/15</p></div>
                              <div className="text-center"><p className="text-slate-400">Challenge</p><p className="font-medium text-slate-900">{review.applied_challenge_score}/15</p></div>
                              <div className="text-center"><p className="text-slate-400">Commit</p><p className="font-medium text-slate-900">{review.communication_commitment_score}/10</p></div>
                            </div>
                            {review.reviewer_comments && <p className="text-sm text-slate-600 mt-2">{review.reviewer_comments}</p>}
                          </CardContent>
                        </Card>
                      ))}
                      {reviews.length >= 2 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Score Comparison</span>
                          </div>
                          <div className="grid sm:grid-cols-3 gap-3 text-sm">
                            <div><span className="text-amber-600">Average Score:</span> <span className="font-medium text-slate-900">{Math.round(reviews.reduce((s, r) => s + r.total_score, 0) / reviews.length)}</span></div>
                            <div><span className="text-amber-600">Score Difference:</span> <span className="font-medium text-slate-900">{Math.abs(reviews[0].total_score - reviews[reviews.length - 1].total_score)}</span></div>
                            <div>
                              {Math.abs(reviews[0].total_score - reviews[reviews.length - 1].total_score) > 15 && (
                                <Badge className="bg-red-100 text-red-700">Flagged: 15+ point difference</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Applications Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Project Lab</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Band</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-slate-500">Loading applications...</TableCell></TableRow>
                  ) : filteredApplications.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-slate-500">No applications found</TableCell></TableRow>
                  ) : (
                    filteredApplications.map((app) => {
                      const band = getScoreBand(app.total_score);
                      return (
                        <TableRow key={app.id}>
                          <TableCell className="font-mono text-xs text-blue-600">{app.application_reference}</TableCell>
                          <TableCell className="font-medium text-slate-900">{app.full_name}</TableCell>
                          <TableCell className="text-slate-600 text-sm">{app.email}</TableCell>
                          <TableCell className="text-slate-600 text-sm max-w-[130px] truncate">{app.first_department_choice || "N/A"}</TableCell>
                          <TableCell className="text-slate-600 text-sm">{app.country}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{app.total_score}</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge className={band.color}>{band.label}</Badge></TableCell>
                          <TableCell><Badge className={STATUS_COLORS[app.application_status] || "bg-slate-100 text-slate-700"}>{app.application_status}</Badge></TableCell>
                          <TableCell className="text-slate-500 text-sm">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openApplication(app)} className="cursor-pointer"><Eye className="h-4 w-4" /></Button>
                              <Select value={app.application_status} onValueChange={(value) => updateStatus(app.id, value as StatusType)}>
                                <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {STATUS_OPTIONS.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}