import { useEffect, useState, useCallback } from "react";
import {
  Users, FlaskConical, Calendar, ClipboardList, TrendingUp,
  AlertTriangle, Search, KeyRound, UserCheck, UserX, Eye,
  Download, Megaphone, BookOpen, Settings, Shield, Activity,
  Ship, ChevronRight, CheckCircle2, XCircle, Lock, Copy,
  UserPlus, RefreshCw, AlertCircle, FileDown, X, FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  getAllParticipantsWithAccess, getSessions, getAnnouncements, getModules,
  getAllApplications, getActivatedApplicationIds,
  activateParticipantFromApplication, bulkActivateParticipants,
  updateSelectionStatus, bulkUpdateSelectionStatus,
  resetParticipantPin, deactivateParticipantAccess, reactivateParticipantAccess,
  diagnoseApplicationsConnection,
  generatePinAccessVerificationReport,
  SELECTION_STATUSES, SELECTION_STATUS_CONFIG,
  type SelectionStatus,
  type PinAccessVerificationReport,
  SEED_SESSIONS, SEED_ANNOUNCEMENTS, SEED_MODULES,
  type ParticipantWithAccess, type Session, type Announcement, type Module,
  type BlueDataHubApplication, type PinGenerationResult,
} from "@/lib/portal-data";
import { isSupabaseConfigured } from "@/lib/supabase";

// ============================================================
// ACCESS STATUS HELPERS
// ============================================================
function getAccessStatus(p: ParticipantWithAccess): "not_activated" | "active" | "locked" | "deactivated" {
  if (!p.access) return "not_activated";
  if (!p.access.is_active) return "deactivated";
  if (p.access.locked_until && new Date(p.access.locked_until) > new Date()) return "locked";
  return "active";
}

const ACCESS_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  not_activated: { label: "Not Activated", color: "bg-slate-100 text-slate-600" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  locked: { label: "Locked", color: "bg-amber-100 text-amber-700" },
  deactivated: { label: "Deactivated", color: "bg-red-100 text-red-700" },
};

// ============================================================
// ADMIN CONTENT (authenticated)
// ============================================================
function PortalAdminContent() {
  const [participants, setParticipants] = useState<ParticipantWithAccess[]>([]);
  const [applications, setApplications] = useState<BlueDataHubApplication[]>([]);
  const [activatedAppIds, setActivatedAppIds] = useState<Set<string>>(new Set());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectionFilter, setSelectionFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Applicant selection for bulk actions
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [activating, setActivating] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Applicant search & sort
  const [applicantSearch, setApplicantSearch] = useState("");
  const [applicantSort, setApplicantSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "total_score", dir: "desc" });

  // Applicant detail dialog
  const [detailApplicant, setDetailApplicant] = useState<BlueDataHubApplication | null>(null);

  // Connection diagnostic
  const [diagnostic, setDiagnostic] = useState<{ configured: boolean; error?: string; rowCount?: number; rlsBlocked?: boolean; columnMissing?: string } | null>(null);

  // PIN access verification report
  const [verificationReport, setVerificationReport] = useState<PinAccessVerificationReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // PIN display dialog
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinResults, setPinResults] = useState<PinGenerationResult[]>([]);
  const [singlePinResult, setSinglePinResult] = useState<PinGenerationResult | null>(null);

  // Reset PIN dialog
  const [resettingPin, setResettingPin] = useState(false);
  const [resetPinParticipant, setResetPinParticipant] = useState<ParticipantWithAccess | null>(null);

  // Deactivate/Reactivate
  const [togglingAccess, setTogglingAccess] = useState(false);

  // Toast-like feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showFeedback = useCallback((type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [parts, apps, activatedIds, sess, ann, mods, diag] = await Promise.all([
      getAllParticipantsWithAccess(),
      getAllApplications(),
      getActivatedApplicationIds(),
      getSessions(),
      getAnnouncements(),
      getModules(),
      diagnoseApplicationsConnection(),
    ]);
    setParticipants(parts);
    setApplications(apps);
    setActivatedAppIds(activatedIds);
    setSessions(sess);
    setAnnouncements(ann);
    setModules(mods);
    setDiagnostic(diag);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ---- Applicant helpers ----
  const toggleApplicant = (id: string) => {
    setSelectedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllApplicants = () => {
    const selectable = applications.filter((a) => !activatedAppIds.has(a.id));
    if (selectedAppIds.size === selectable.length) {
      setSelectedAppIds(new Set());
    } else {
      setSelectedAppIds(new Set(selectable.map((a) => a.id)));
    }
  };

  // ---- Selection status actions ----
  const handleUpdateSelection = async (appId: string, status: SelectionStatus) => {
    setUpdatingStatus(true);
    const ok = await updateSelectionStatus(appId, status);
    setUpdatingStatus(false);
    if (ok) {
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, selection_status: status } : a));
      showFeedback("success", `Applicant marked as ${SELECTION_STATUS_CONFIG[status].label}.`);
    } else {
      showFeedback("error", "Failed to update selection status.");
    }
  };

  const handleBulkSelection = async (status: SelectionStatus) => {
    const ids = Array.from(selectedAppIds);
    if (ids.length === 0) return;
    setUpdatingStatus(true);
    const result = await bulkUpdateSelectionStatus(ids, status);
    setUpdatingStatus(false);
    if (result.failed === 0) {
      setApplications((prev) => prev.map((a) => ids.includes(a.id) ? { ...a, selection_status: status } : a));
      showFeedback("success", `${result.updated} applicant(s) marked as ${SELECTION_STATUS_CONFIG[status].label}.`);
      setSelectedAppIds(new Set());
    } else {
      showFeedback("error", `Updated ${result.updated}, failed ${result.failed}.`);
      await loadData();
    }
  };

  // ---- Activate single applicant (only if selected) ----
  const handleActivateSingle = async (app: BlueDataHubApplication) => {
    if (app.selection_status !== "selected") {
      showFeedback("error", `Cannot activate: applicant status is "${app.selection_status}". Only "selected" applicants can be activated.`);
      return;
    }
    setActivating(true);
    const result = await activateParticipantFromApplication(app);
    setActivating(false);
    if (result) {
      setSinglePinResult(result);
      setPinDialogOpen(true);
      await loadData();
      setSelectedAppIds(new Set());
    } else {
      showFeedback("error", "Failed to activate participant. They may already be activated.");
    }
  };

  // ---- Bulk activate (only selected applicants) ----
  const handleBulkActivate = async () => {
    const selectedApps = applications.filter(
      (a) => selectedAppIds.has(a.id) && !activatedAppIds.has(a.id) && a.selection_status === "selected"
    );
    if (selectedApps.length === 0) {
      showFeedback("error", "No selected applicants to activate. Only applicants with selection_status = Selected can be activated.");
      return;
    }
    setActivating(true);
    const results = await bulkActivateParticipants(selectedApps);
    setActivating(false);
    if (results.length > 0) {
      setPinResults(results);
      setSinglePinResult(null);
      setPinDialogOpen(true);
      await loadData();
      setSelectedAppIds(new Set());
    } else {
      showFeedback("error", "No participants were activated. They may already be activated or not have selection_status = Selected.");
    }
  };

  // ---- Reset PIN ----
  const handleResetPin = async () => {
    if (!resetPinParticipant) return;
    setResettingPin(true);
    const newPin = await resetParticipantPin(resetPinParticipant.id);
    setResettingPin(false);
    if (newPin) {
      setSinglePinResult({
        participantId: resetPinParticipant.id,
        referenceNumber: resetPinParticipant.reference_number,
        fullName: resetPinParticipant.full_name,
        temporaryPin: newPin,
        accessStatus: "active",
      });
      setPinResults([]);
      setPinDialogOpen(true);
      setResetPinParticipant(null);
      await loadData();
    } else {
      showFeedback("error", "Failed to reset PIN.");
    }
  };

  // ---- Deactivate ----
  const handleDeactivate = async (p: ParticipantWithAccess) => {
    setTogglingAccess(true);
    const ok = await deactivateParticipantAccess(p.id);
    setTogglingAccess(false);
    if (ok) {
      showFeedback("success", `Deactivated access for ${p.full_name}.`);
      await loadData();
    } else {
      showFeedback("error", "Failed to deactivate access.");
    }
  };

  // ---- Reactivate ----
  const handleReactivate = async (p: ParticipantWithAccess) => {
    setTogglingAccess(true);
    const ok = await reactivateParticipantAccess(p.id);
    setTogglingAccess(false);
    if (ok) {
      showFeedback("success", `Reactivated access for ${p.full_name}.`);
      await loadData();
    } else {
      showFeedback("error", "Failed to reactivate access.");
    }
  };

  // ---- Copy & Download ----
  const copyAccessDetails = (results: PinGenerationResult[]) => {
    const text = results.map((r) =>
      `${r.fullName}\t${r.referenceNumber}\t${r.temporaryPin}\t${r.accessStatus}`
    ).join("\n");
    navigator.clipboard.writeText(`Name\tReference\tPIN\tStatus\n${text}`);
    showFeedback("success", "Access details copied to clipboard.");
  };

  const downloadAccessList = (results: PinGenerationResult[]) => {
    const csv = [
      "Name,Reference Number,Temporary PIN,Access Status",
      ...results.map((r) => `"${r.fullName}","${r.referenceNumber}","${r.temporaryPin}","${r.accessStatus}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bluedata-hub-access-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Filtering ----
  const filteredParticipants = participants.filter((p) => {
    const matchSearch = !search ||
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference_number?.toLowerCase().includes(search.toLowerCase());
    const status = getAccessStatus(p);
    const matchStatus = statusFilter === "all" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ---- Applicant search and sort ----
  const filteredApplications = applications
    .filter((a) => {
      if (selectionFilter !== "all" && a.selection_status !== selectionFilter) return false;
      if (applicantSearch) {
        const q = applicantSearch.toLowerCase();
        return (
          (a.full_name || "").toLowerCase().includes(q) ||
          (a.email || "").toLowerCase().includes(q) ||
          (a.application_reference || "").toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const { key, dir } = applicantSort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "total_score") return mul * ((a.total_score ?? 0) - (b.total_score ?? 0));
      if (key === "full_name") return mul * (a.full_name || "").localeCompare(b.full_name || "");
      if (key === "application_reference") return mul * (a.application_reference || "").localeCompare(b.application_reference || "");
      if (key === "selection_status") return mul * (a.selection_status || "").localeCompare(b.selection_status || "");
      return 0;
    });

  const handleSort = (key: string) => {
    setApplicantSort((prev) => ({ key, dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc" }));
  };

  const sortIcon = (key: string) => {
    if (applicantSort.key !== key) return " ";
    return applicantSort.dir === "asc" ? " \u2191" : " \u2193";
  };

  const activeCount = participants.filter((p) => getAccessStatus(p) === "active").length;
  const needsAttentionCount = participants.filter((p) => p.programme_status !== "active").length;
  const selectedCount = applications.filter((a) => a.selection_status === "selected").length;
  const pendingCount = applications.filter((a) => a.selection_status === "pending").length;
  const waitlistCount = applications.filter((a) => a.selection_status === "waitlist").length;
  const notSelectedCount = applications.filter((a) => a.selection_status === "not_selected").length;
  const activatedCount = applications.filter((a) => activatedAppIds.has(a.id)).length;

  const metrics = [
    { label: "Total Applicants", value: applications.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Selected", value: selectedCount, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Review", value: pendingCount, icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Waitlisted", value: waitlistCount, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Not Selected", value: notSelectedCount, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
    { label: "Portal Activated", value: activatedCount, icon: UserPlus, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Participants", value: activeCount, icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Need Attention", value: needsAttentionCount, icon: AlertTriangle, color: "text-pink-600", bg: "bg-pink-50" },
  ];

  // All PIN results to display in dialog
  const allPinResults = singlePinResult ? [singlePinResult] : pinResults;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">BlueData Hub Admin</p>
              <p className="text-slate-400 text-xs">Command Centre</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {feedback && (
              <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${
                feedback.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
              }`}>
                {feedback.type === "success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                {feedback.message}
              </div>
            )}
            <a href="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
              <Ship className="h-4 w-4" /> Main Site
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="applicants" className="text-xs">
              Applicants {pendingCount > 0 && <Badge className="ml-1.5 bg-orange-500 text-white text-[10px] px-1.5">{pendingCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="participants" className="text-xs">Participants</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs">Sessions</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs">Announcements</TabsTrigger>
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="verification" className="text-xs">
              <FileCheck className="h-3 w-3 mr-1" />PIN Verify
            </TabsTrigger>
          </TabsList>

          {/* ======== OVERVIEW ======== */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {metrics.map((m) => (
                <Card key={m.label} className="border-slate-200">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
                      <m.icon className={`h-5 w-5 ${m.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{m.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader><CardTitle className="text-base">Upcoming Sessions</CardTitle></CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <p className="text-slate-400 text-sm">No sessions scheduled.</p>
                  ) : (
                    <div className="space-y-3">
                      {sessions.slice(0, 5).map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{s.title}</p>
                            <p className="text-slate-400 text-xs">{new Date(s.session_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                          </div>
                          {s.meeting_link ? <Badge className="bg-green-100 text-green-700 text-xs">Link Set</Badge> : <Badge className="bg-orange-100 text-orange-700 text-xs">No Link</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader><CardTitle className="text-base">Recent Announcements</CardTitle></CardHeader>
                <CardContent>
                  {announcements.length === 0 ? (
                    <p className="text-slate-400 text-sm">No announcements.</p>
                  ) : (
                    <div className="space-y-3">
                      {announcements.slice(0, 5).map((a) => (
                        <div key={a.id} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-slate-900 text-sm">{a.title}</p>
                            {a.priority === "high" && <Badge className="bg-red-100 text-red-700 text-xs">Important</Badge>}
                          </div>
                          <p className="text-slate-400 text-xs">{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ======== APPLICANTS (Selection Workflow) ======== */}
          <TabsContent value="applicants">
            {/* Workflow indicator */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-xs font-semibold mb-1">Required Workflow</p>
              <div className="flex items-center gap-1.5 text-xs text-blue-700 flex-wrap">
                <span className="font-medium">Application</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-green-700">Selected</span>
                <ChevronRight className="h-3 w-3" />
                <span>Assign Group / Track / Project</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-purple-700">Activate Participant</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-amber-700">Generate Portal Access + PIN</span>
              </div>
              <p className="text-blue-600 text-[11px] mt-1">Only applicants with <strong>selection_status = Selected</strong> can be activated for portal access.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Applicant Selection</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Review and select applicants. Only selected applicants can be activated for portal access.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={loadData} disabled={loading}>
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
                </Button>
              </div>
            </div>

            {/* Diagnostic panel (shown when no data or connection issues) */}
            {applications.length === 0 && diagnostic && (
              <Card className="border-amber-200 bg-amber-50 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-amber-800">
                      <p className="font-semibold mb-1">No applications loaded from database</p>
                      {!diagnostic.configured ? (
                        <p>Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.</p>
                      ) : diagnostic.columnMissing ? (
                        <p>The <code className="bg-amber-100 px-1 rounded">selection_status</code> column does not exist yet. Run the migration SQL in <code className="bg-amber-100 px-1 rounded">applicant_selection_workflow_migration.sql</code> against your Supabase project.</p>
                      ) : diagnostic.rlsBlocked ? (
                        <p>RLS policies may be blocking reads. Run the migration SQL to add public SELECT/UPDATE policies for <code className="bg-amber-100 px-1 rounded">dma_bluedata_hub_applications</code>.</p>
                      ) : diagnostic.error ? (
                        <p>Query error: {diagnostic.error}</p>
                      ) : (
                        <p>The table exists but contains 0 rows, or all rows are blocked by RLS. Check that applications were submitted and RLS allows anon reads.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or reference..."
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Selection status filter buttons with dynamic counts */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                size="sm"
                variant={selectionFilter === "all" ? "default" : "outline"}
                className={selectionFilter === "all" ? "bg-slate-800 hover:bg-slate-900 text-white" : ""}
                onClick={() => setSelectionFilter("all")}
              >
                All ({applications.length})
              </Button>
              {SELECTION_STATUSES.map((s) => {
                const cfg = SELECTION_STATUS_CONFIG[s];
                const count = applications.filter((a) => a.selection_status === s).length;
                return (
                  <Button
                    key={s}
                    size="sm"
                    variant={selectionFilter === s ? "default" : "outline"}
                    className={selectionFilter === s ? "bg-slate-800 hover:bg-slate-900 text-white" : ""}
                    onClick={() => setSelectionFilter(s)}
                  >
                    {cfg.label} ({count})
                  </Button>
                );
              })}
            </div>

            {/* Bulk action bar */}
            {selectedAppIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
                <span className="text-sm font-medium text-slate-700">{selectedAppIds.size} selected</span>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                  disabled={updatingStatus}
                  onClick={() => handleBulkSelection("selected")}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />Mark as Selected
                </Button>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white h-7 text-xs"
                  disabled={updatingStatus}
                  onClick={() => handleBulkSelection("waitlist")}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />Mark as Waitlist
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white h-7 text-xs"
                  disabled={updatingStatus}
                  onClick={() => handleBulkSelection("not_selected")}
                >
                  <XCircle className="h-3 w-3 mr-1" />Mark as Not Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs text-slate-700"
                  disabled={updatingStatus}
                  onClick={() => handleBulkSelection("pending")}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />Restore to Pending
                </Button>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
                  disabled={activating || selectedAppIds.size === 0}
                  onClick={handleBulkActivate}
                >
                  {activating ? (
                    <><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Activating...</>
                  ) : (
                    <><UserPlus className="h-3 w-3 mr-1" />Activate Portal Access</>
                  )}
                </Button>
              </div>
            )}

            {applications.length === 0 ? (
              <Card className="border-slate-200"><CardContent className="p-8 text-center">
                <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No applications found.</p>
                <p className="text-slate-400 text-xs mt-1">Applications will appear here once submitted through the BlueData Hub registration portal.</p>
                {!isSupabaseConfigured && (
                  <p className="text-amber-600 text-xs mt-2 font-medium">Supabase is not configured. Set environment variables to connect.</p>
                )}
              </CardContent></Card>
            ) : filteredApplications.length === 0 ? (
              <Card className="border-slate-200"><CardContent className="p-8 text-center">
                <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No applicants match your search or filter.</p>
              </CardContent></Card>
            ) : (
              <Card className="border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-10">
                          <Checkbox
                            checked={selectedAppIds.size > 0 && selectedAppIds.size === filteredApplications.filter((a) => !activatedAppIds.has(a.id)).length}
                            onCheckedChange={toggleAllApplicants}
                          />
                        </TableHead>
                        <TableHead className="text-xs cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort("full_name")}>Name{sortIcon("full_name")}</TableHead>
                        <TableHead className="text-xs cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort("application_reference")}>Reference{sortIcon("application_reference")}</TableHead>
                        <TableHead className="text-xs">Email</TableHead>
                        <TableHead className="text-xs">1st Choice</TableHead>
                        <TableHead className="text-xs">2nd Choice</TableHead>
                        <TableHead className="text-xs">3rd Choice</TableHead>
                        <TableHead className="text-xs cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort("total_score")}>Score{sortIcon("total_score")}</TableHead>
                        <TableHead className="text-xs cursor-pointer select-none hover:bg-slate-100" onClick={() => handleSort("selection_status")}>Status{sortIcon("selection_status")}</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => {
                        const isActivated = activatedAppIds.has(app.id);
                        const isChecked = selectedAppIds.has(app.id);
                        const selCfg = SELECTION_STATUS_CONFIG[app.selection_status as SelectionStatus] || SELECTION_STATUS_CONFIG.pending;
                        return (
                          <TableRow key={app.id} className={isActivated ? "opacity-60" : ""}>
                            <TableCell>
                              <Checkbox
                                checked={isActivated || isChecked}
                                disabled={isActivated}
                                onCheckedChange={() => toggleApplicant(app.id)}
                              />
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              <button className="hover:text-blue-600 hover:underline text-left" onClick={() => setDetailApplicant(app)}>
                                {app.full_name}
                              </button>
                            </TableCell>
                            <TableCell className="text-xs font-mono">{app.application_reference}</TableCell>
                            <TableCell className="text-xs">{app.email}</TableCell>
                            <TableCell className="text-xs">{app.first_department_choice}</TableCell>
                            <TableCell className="text-xs text-slate-500">{app.second_department_choice || "\u2014"}</TableCell>
                            <TableCell className="text-xs text-slate-500">{app.third_department_choice || "\u2014"}</TableCell>
                            <TableCell className="text-xs">{app.total_score ?? "\u2014"}</TableCell>
                            <TableCell>
                              <Badge className={`${selCfg.color} text-xs`}>{selCfg.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {isActivated ? (
                                <Badge className="bg-green-50 text-green-600 text-xs">In Portal</Badge>
                              ) : (
                                <div className="flex gap-1 flex-wrap">
                                  {app.selection_status !== "selected" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50"
                                      disabled={updatingStatus}
                                      onClick={() => handleUpdateSelection(app.id, "selected")}
                                    >
                                      Select
                                    </Button>
                                  )}
                                  {app.selection_status !== "waitlist" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                                      disabled={updatingStatus}
                                      onClick={() => handleUpdateSelection(app.id, "waitlist")}
                                    >
                                      Waitlist
                                    </Button>
                                  )}
                                  {app.selection_status !== "not_selected" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs text-red-700 border-red-300 hover:bg-red-50"
                                      disabled={updatingStatus}
                                      onClick={() => handleUpdateSelection(app.id, "not_selected")}
                                    >
                                      Not Select
                                    </Button>
                                  )}
                                  {app.selection_status !== "pending" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs text-slate-600 border-slate-300 hover:bg-slate-50"
                                      disabled={updatingStatus}
                                      onClick={() => handleUpdateSelection(app.id, "pending")}
                                    >
                                      Pending
                                    </Button>
                                  )}
                                  {app.selection_status === "selected" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs text-blue-700 border-blue-300 hover:bg-blue-50"
                                      disabled={activating}
                                      onClick={() => handleActivateSingle(app)}
                                    >
                                      <UserPlus className="h-3 w-3 mr-1" />Activate
                                    </Button>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-xs text-slate-400">
                  Showing {filteredApplications.length} of {applications.length} applicants
                </div>
              </Card>
            )}
          </TabsContent>

          {/* ======== PARTICIPANTS (with Portal Access) ======== */}
          <TabsContent value="participants">
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search by name or reference..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not_activated">Not Activated</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredParticipants.length === 0 ? (
              <Card className="border-slate-200"><CardContent className="p-8 text-center">
                <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No participants found.</p>
                <p className="text-slate-400 text-xs mt-1">Activate accepted applicants from the Applicants tab to create participant portal access.</p>
              </CardContent></Card>
            ) : (
              <Card className="border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Reference</TableHead>
                        <TableHead className="text-xs">Track</TableHead>
                        <TableHead className="text-xs">Portal Access</TableHead>
                        <TableHead className="text-xs">Last Login</TableHead>
                        <TableHead className="text-xs">Failed Attempts</TableHead>
                        <TableHead className="text-xs">Lockout</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParticipants.map((p) => {
                        const status = getAccessStatus(p);
                        const statusCfg = ACCESS_STATUS_CONFIG[status];
                        const isLocked = status === "locked";
                        const lockoutEnd = p.access?.locked_until ? new Date(p.access.locked_until) : null;
                        const lockoutMins = lockoutEnd && lockoutEnd > new Date()
                          ? Math.ceil((lockoutEnd.getTime() - Date.now()) / 60000)
                          : null;

                        return (
                          <TableRow key={p.id}>
                            <TableCell className="text-sm font-medium">{p.full_name}</TableCell>
                            <TableCell className="text-xs font-mono">{p.reference_number}</TableCell>
                            <TableCell className="text-xs">{p.track_id || "—"}</TableCell>
                            <TableCell>
                              <Badge className={`${statusCfg.color} text-xs`}>{statusCfg.label}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">
                              {p.access?.last_login_at
                                ? new Date(p.access.last_login_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                                : "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {p.access ? (
                                <span className={p.access.failed_attempts > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                                  {p.access.failed_attempts}
                                </span>
                              ) : "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {isLocked && lockoutMins ? (
                                <span className="text-amber-600 font-medium">{lockoutMins}m left</span>
                              ) : "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="View"><Eye className="h-3.5 w-3.5" /></Button>
                                {status === "not_activated" ? (
                                  <Button
                                    size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                    title="Activate Portal Access"
                                    disabled={togglingAccess}
                                    onClick={async () => {
                                      setTogglingAccess(true);
                                      const pin = await resetParticipantPin(p.id);
                                      setTogglingAccess(false);
                                      if (pin) {
                                        setSinglePinResult({ participantId: p.id, referenceNumber: p.reference_number, fullName: p.full_name, temporaryPin: pin, accessStatus: "active" });
                                        setPinResults([]);
                                        setPinDialogOpen(true);
                                        await loadData();
                                      } else {
                                        showFeedback("error", "Failed to activate access.");
                                      }
                                    }}
                                  >
                                    <UserPlus className="h-3.5 w-3.5" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                      title="Reset PIN"
                                      onClick={() => setResetPinParticipant(p)}
                                    >
                                      <KeyRound className="h-3.5 w-3.5" />
                                    </Button>
                                    {status === "active" || status === "locked" ? (
                                      <Button
                                        size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        title="Deactivate"
                                        disabled={togglingAccess}
                                        onClick={() => handleDeactivate(p)}
                                      >
                                        <UserX className="h-3.5 w-3.5" />
                                      </Button>
                                    ) : status === "deactivated" ? (
                                      <Button
                                        size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                        title="Reactivate"
                                        disabled={togglingAccess}
                                        onClick={() => handleReactivate(p)}
                                      >
                                        <UserCheck className="h-3.5 w-3.5" />
                                      </Button>
                                    ) : null}
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* ======== SESSIONS ======== */}
          <TabsContent value="sessions">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Session Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Calendar className="h-4 w-4 mr-1.5" />Add Session</Button>
            </div>
            <div className="space-y-4">
              {sessions.map((s) => (
                <Card key={s.id} className="border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {s.is_orientation && <Badge className="bg-blue-100 text-blue-700 text-xs">Orientation</Badge>}
                          <Badge variant="outline" className="text-xs">{new Date(s.session_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</Badge>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{s.title}</p>
                        <p className="text-slate-500 text-xs mt-1">{s.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          {s.session_time && <span>Time: {s.session_time}</span>}
                          {s.facilitator && <span>Facilitator: {s.facilitator}</span>}
                          {s.meeting_link ? <Badge className="bg-green-100 text-green-700 text-xs">Link Set</Badge> : <Badge className="bg-orange-100 text-orange-700 text-xs">No Link</Badge>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== ANNOUNCEMENTS ======== */}
          <TabsContent value="announcements">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Announcement Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Megaphone className="h-4 w-4 mr-1.5" />New Announcement</Button>
            </div>
            <div className="space-y-4">
              {announcements.map((a) => (
                <Card key={a.id} className="border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {a.priority === "high" && <Badge className="bg-red-100 text-red-700 text-xs">Important</Badge>}
                          <Badge variant="outline" className="text-xs capitalize">{a.type.replace(/_/g, " ")}</Badge>
                          <Badge variant="outline" className="text-xs">Target: {a.target_audience}</Badge>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{a.title}</p>
                        <p className="text-slate-500 text-xs mt-1">{a.body}</p>
                        <p className="text-slate-400 text-xs mt-2">{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== CONTENT ======== */}
          <TabsContent value="content">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Learning Content</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{modules.filter((m) => !m.archived).length} active</Badge>
                <Badge variant="outline" className="text-xs">{modules.filter((m) => m.archived).length} archived</Badge>
              </div>
            </div>
            <div className="space-y-4">
              {modules.filter((m) => !m.archived).map((m) => (
                <Card key={m.id} className="border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{m.title}</p>
                        <p className="text-slate-500 text-xs mt-1">{m.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">{m.difficulty}</Badge>
                          {m.estimated_duration && <Badge variant="outline" className="text-xs">{m.estimated_duration}</Badge>}
                          <Badge className={m.scope === "all_participants" ? "bg-blue-50 text-blue-700 text-xs" : m.scope === "department_lab" ? "bg-purple-50 text-purple-700 text-xs" : "bg-amber-50 text-amber-700 text-xs"}>
                            {m.scope === "all_participants" ? "All Participants" : m.scope === "department_lab" ? "Department / Lab" : "Specific Project"}
                          </Badge>
                          {m.assigned_lab && <Badge className="bg-cyan-50 text-cyan-700 text-xs">{m.assigned_lab}</Badge>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {modules.some((m) => m.archived) && (
                <details className="mt-4">
                  <summary className="text-slate-400 text-xs cursor-pointer hover:text-slate-600">Show archived content ({modules.filter((m) => m.archived).length})</summary>
                  <div className="space-y-3 mt-3">
                    {modules.filter((m) => m.archived).map((m) => (
                      <Card key={m.id} className="border-slate-200 opacity-60">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-500 text-sm">{m.title}</p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">{m.difficulty}</Badge>
                                <Badge variant="outline" className="text-xs">Archived</Badge>
                                {m.assigned_lab && <Badge className="bg-cyan-50 text-cyan-700 text-xs">{m.assigned_lab}</Badge>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </TabsContent>

          {/* ======== PIN ACCESS VERIFICATION ======== */}
          <TabsContent value="verification">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">PIN Access Verification Report</h2>
                <p className="text-slate-500 text-xs mt-1">Audit participant portal access, selection gating, and PIN status</p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={generatingReport}
                onClick={async () => {
                  setGeneratingReport(true);
                  try {
                    const report = await generatePinAccessVerificationReport();
                    setVerificationReport(report);
                  } catch (err) {
                    showFeedback("error", "Failed to generate verification report");
                  } finally {
                    setGeneratingReport(false);
                  }
                }}
              >
                {generatingReport ? <><RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />Generating...</> : <><FileCheck className="h-4 w-4 mr-1.5" />Generate Report</>}
              </Button>
            </div>

            {verificationReport ? (
              <div className="space-y-6">
                {/* Query Failure Banner */}
                {verificationReport.queryFailed && (
                  <Card className="border-red-300 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        Verification failed. Participant data could not be loaded.
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-red-600 mb-2">
                        One or more database queries failed. The counts below may be incomplete or zero. Fix the errors before trusting this report.
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {verificationReport.errors.map((err, i) => (
                          <li key={i} className="text-xs text-red-700 font-mono break-all">{err}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Non-fatal warnings (e.g. 0 rows but no error) */}
                {!verificationReport.queryFailed && verificationReport.errors.length > 0 && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                        <AlertCircle className="h-4 w-4" />
                        Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {verificationReport.errors.map((err, i) => (
                          <li key={i} className="text-xs text-amber-700 font-mono break-all">{err}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900">{verificationReport.totalApplications}</p>
                      <p className="text-xs text-slate-500">Applications</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{verificationReport.selectedCount}</p>
                      <p className="text-xs text-slate-500">Selected</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">{verificationReport.explorerCount}</p>
                      <p className="text-xs text-slate-500">Explorer</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-500">{verificationReport.declinedCount}</p>
                      <p className="text-xs text-slate-500">Declined</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-700">{verificationReport.totalParticipants}</p>
                      <p className="text-xs text-slate-500">Participants</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{verificationReport.activatedCount}</p>
                      <p className="text-xs text-slate-500">Activated</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-amber-600">{verificationReport.pinSetCount}</p>
                      <p className="text-xs text-slate-500">PINs Set</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-500">{verificationReport.totalAccessRecords}</p>
                      <p className="text-xs text-slate-500">Access Records</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-orange-600">{verificationReport.selectedNotActivated.length}</p>
                      <p className="text-xs text-slate-500">Selected Not Activated</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-rose-600">{verificationReport.missingInvalidPhoneCount}</p>
                      <p className="text-xs text-slate-500">Missing/Invalid Phone</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-xs text-slate-400 mt-1">Application phone field used: <span className="font-mono font-semibold text-slate-600">{verificationReport.phoneFieldUsed}</span></p>

                {/* Gating Violations */}
                {verificationReport.gatingViolations.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        Gating Violations ({verificationReport.gatingViolations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-red-600 mb-2">
                        These participants have portal access but their application selection_status is NOT "selected". Activation should have been blocked.
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">Reference</TableHead>
                            <TableHead className="text-xs">Selection Status</TableHead>
                            <TableHead className="text-xs">Access Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {verificationReport.gatingViolations.map((v, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-sm font-medium">{v.participantName}</TableCell>
                              <TableCell className="text-xs font-mono">{v.referenceNumber}</TableCell>
                              <TableCell className="text-xs"><Badge variant="outline" className="text-xs">{v.selectionStatus}</Badge></TableCell>
                              <TableCell className="text-xs"><Badge className="bg-red-100 text-red-700 text-xs">{v.accessStatus}</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* Orphaned Access Records */}
                {verificationReport.orphanedAccess.length > 0 && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                        <AlertCircle className="h-4 w-4" />
                        Orphaned Access Records ({verificationReport.orphanedAccess.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-amber-600 mb-2">
                        Portal access records with no matching application in dma_bluedata_hub_applications.
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">Reference</TableHead>
                            <TableHead className="text-xs">PIN Set</TableHead>
                            <TableHead className="text-xs">Is Active</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {verificationReport.orphanedAccess.map((o, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-sm font-medium">{o.participantName}</TableCell>
                              <TableCell className="text-xs font-mono">{o.referenceNumber}</TableCell>
                              <TableCell className="text-xs">{o.pinSet ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-xs">{o.isActive ? "Yes" : "No"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Not Yet Activated */}
                {verificationReport.selectedNotActivated.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                        <UserPlus className="h-4 w-4" />
                        Selected — Not Yet Activated ({verificationReport.selectedNotActivated.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-blue-600 mb-2">
                        These applicants are selected but do not yet have portal access. Ready for activation.
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">Reference</TableHead>
                            <TableHead className="text-xs">Country</TableHead>
                            <TableHead className="text-xs">Total Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {verificationReport.selectedNotActivated.map((s, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-sm font-medium">{s.fullName}</TableCell>
                              <TableCell className="text-xs font-mono">{s.referenceNumber}</TableCell>
                              <TableCell className="text-xs">{s.country}</TableCell>
                              <TableCell className="text-xs font-bold">{s.totalScore ?? "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* All Clear — only when queries succeeded and data was loaded */}
                {!verificationReport.queryFailed && verificationReport.totalApplications > 0 && verificationReport.gatingViolations.length === 0 && verificationReport.orphanedAccess.length === 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-5 text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-bold text-green-700">All Clear</p>
                      <p className="text-xs text-green-600 mt-1">
                        No gating violations or orphaned access records found. Activation is correctly limited to selected applicants only.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Report Metadata */}
                <p className="text-xs text-slate-400 text-right">
                  Report generated: {new Date(verificationReport.generatedAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="p-8 text-center">
                  <FileCheck className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Click "Generate Report" to audit PIN access and selection gating integrity.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ======== PIN DISPLAY DIALOG ======== */}
      <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              Portal Access Details
            </DialogTitle>
            <DialogDescription>
              Temporary PINs are shown once. Copy them now and share securely with each participant.
              PINs will not be displayed again after closing this dialog.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Participant</TableHead>
                  <TableHead className="text-xs">Reference</TableHead>
                  <TableHead className="text-xs">Temporary PIN</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPinResults.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{r.fullName}</TableCell>
                    <TableCell className="text-xs font-mono">{r.referenceNumber}</TableCell>
                    <TableCell>
                      <code className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono text-sm font-bold tracking-widest">
                        {r.temporaryPin}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 text-xs">{r.accessStatus}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyAccessDetails(allPinResults)}
            >
              <Copy className="h-4 w-4 mr-1.5" />Copy Access Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadAccessList(allPinResults)}
            >
              <FileDown className="h-4 w-4 mr-1.5" />Download CSV
            </Button>
            <Button size="sm" onClick={() => setPinDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======== RESET PIN CONFIRMATION DIALOG ======== */}
      <Dialog open={!!resetPinParticipant} onOpenChange={(open) => { if (!open) setResetPinParticipant(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              Reset PIN
            </DialogTitle>
            <DialogDescription>
              This will generate a new temporary password for{" "}
              <strong>{resetPinParticipant?.full_name}</strong> ({resetPinParticipant?.reference_number}).
              The new PIN will be shown once. Any lockout will also be cleared.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setResetPinParticipant(null)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={resettingPin}
              onClick={handleResetPin}
            >
              {resettingPin ? <><RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />Resetting...</> : "Reset PIN"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======== APPLICANT DETAIL DIALOG ======== */}
      <Dialog open={!!detailApplicant} onOpenChange={(open) => { if (!open) setDetailApplicant(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {detailApplicant?.full_name}
            </DialogTitle>
            <DialogDescription>
              {detailApplicant?.application_reference} — {SELECTION_STATUS_CONFIG[detailApplicant?.selection_status as SelectionStatus]?.label || "Unknown"} Applicant
            </DialogDescription>
          </DialogHeader>
          {detailApplicant && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-slate-500 text-xs">Email</span><p className="font-medium">{detailApplicant.email}</p></div>
                <div><span className="text-slate-500 text-xs">WhatsApp</span><p className="font-medium">{detailApplicant.whatsapp}</p></div>
                <div><span className="text-slate-500 text-xs">Phone</span><p className="font-medium">{detailApplicant.phone || "\u2014"}</p></div>
                <div><span className="text-slate-500 text-xs">Country</span><p className="font-medium">{detailApplicant.country}</p></div>
                <div><span className="text-slate-500 text-xs">Organization</span><p className="font-medium">{detailApplicant.organization || "\u2014"}</p></div>
                <div><span className="text-slate-500 text-xs">Maritime Background</span><p className="font-medium">{detailApplicant.maritime_background}</p></div>
                <div><span className="text-slate-500 text-xs">Analytics Level</span><p className="font-medium">{detailApplicant.analytics_level}</p></div>
                <div><span className="text-slate-500 text-xs">Application Status</span><p className="font-medium">{detailApplicant.application_status}</p></div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Department Choices</p>
                <div className="grid grid-cols-3 gap-3">
                  <div><span className="text-slate-400 text-xs">1st</span><p className="font-medium text-sm">{detailApplicant.first_department_choice}</p></div>
                  <div><span className="text-slate-400 text-xs">2nd</span><p className="font-medium text-sm">{detailApplicant.second_department_choice || "\u2014"}</p></div>
                  <div><span className="text-slate-400 text-xs">3rd</span><p className="font-medium text-sm">{detailApplicant.third_department_choice || "\u2014"}</p></div>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Scores</p>
                <div className="grid grid-cols-3 gap-3">
                  <div><span className="text-slate-400 text-xs">Maritime</span><p className="font-medium">{detailApplicant.maritime_background_score ?? "\u2014"}</p></div>
                  <div><span className="text-slate-400 text-xs">Analytics</span><p className="font-medium">{detailApplicant.analytics_knowledge_score ?? "\u2014"}</p></div>
                  <div><span className="text-slate-400 text-xs">Portfolio</span><p className="font-medium">{detailApplicant.portfolio_score ?? "\u2014"}</p></div>
                  <div><span className="text-slate-400 text-xs">Motivation</span><p className="font-medium">{detailApplicant.motivation_score ?? "\u2014"}</p></div>
                  <div><span className="text-slate-400 text-xs">Challenge</span><p className="font-medium">{detailApplicant.applied_challenge_score ?? "\u2014"}</p></div>
                  <div><span className="text-slate-400 text-xs">Communication</span><p className="font-medium">{detailApplicant.communication_commitment_score ?? "\u2014"}</p></div>
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded text-center">
                  <span className="text-xs text-blue-600">Total Score</span>
                  <p className="text-lg font-bold text-blue-700">{detailApplicant.total_score ?? "\u2014"}</p>
                </div>
              </div>
              {detailApplicant.internship_motivation && (
                <div className="border-t pt-3">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">Motivation</p>
                  <p className="text-slate-700 text-xs leading-relaxed">{detailApplicant.internship_motivation}</p>
                </div>
              )}
              <div className="border-t pt-3">
                <p className="text-xs text-slate-500 mb-1 font-semibold">Submitted</p>
                <p className="text-slate-700 text-xs">{new Date(detailApplicant.submitted_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setDetailApplicant(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// ADMIN PIN GATE (exported wrapper)
// ============================================================
// Admin PIN hash (SHA-256 of the admin PIN — never store plaintext in client code)
// To change the admin PIN, update this hash. Generate with: echo -n "YOUR_PIN" | sha256sum
const ADMIN_PIN_HASH = "e0a42d37e55955b0e7651be670aee1e31c6c9daa12c382db860c1f9e1296088a";
const ADMIN_MAX_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MINUTES = 15;

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function PortalAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  
  // Persist rate limiting state to prevent bypass via refresh
  const [pinAttempts, setPinAttempts] = useState(() => {
    const stored = localStorage.getItem("admin_pin_attempts");
    return stored ? parseInt(stored, 10) : 0;
  });
  const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
    const stored = localStorage.getItem("admin_locked_until");
    return stored ? parseInt(stored, 10) : null;
  });

  const isLockedOut = lockedUntil !== null && Date.now() < lockedUntil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const inputHash = await sha256(pinInput);
    if (inputHash === ADMIN_PIN_HASH) {
      setAuthenticated(true);
      setPinError(false);
      setPinAttempts(0);
      localStorage.removeItem("admin_pin_attempts");
      localStorage.removeItem("admin_locked_until");
    } else {
      const newAttempts = pinAttempts + 1;
      setPinError(true);
      setPinAttempts(newAttempts);
      localStorage.setItem("admin_pin_attempts", newAttempts.toString());
      setPinInput("");
      
      if (newAttempts >= ADMIN_MAX_ATTEMPTS) {
        const lockTime = Date.now() + ADMIN_LOCKOUT_MINUTES * 60 * 1000;
        setLockedUntil(lockTime);
        localStorage.setItem("admin_locked_until", lockTime.toString());
      }
    }
  };

  if (authenticated) {
    return <PortalAdminContent />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Command Centre</h1>
          <p className="text-slate-400 text-sm">BlueData Hub Administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-pin" className="text-slate-300 text-sm mb-2 block">
              Enter Admin Password
            </Label>
            <Input
              id="admin-pin"
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter admin password"
              className="bg-slate-800 border-slate-700 text-white h-14 placeholder:text-slate-600"
              autoFocus
              disabled={isLockedOut}
            />
          </div>
          {isLockedOut && (
            <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
              <XCircle className="h-4 w-4" />
              <span>Too many failed attempts. Locked for {ADMIN_LOCKOUT_MINUTES} minutes.</span>
            </div>
          )}
          {pinError && !isLockedOut && (
            <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
              <XCircle className="h-4 w-4" />
              <span>Incorrect password{pinAttempts >= 3 ? ` — ${ADMIN_MAX_ATTEMPTS - pinAttempts} attempt(s) remaining` : ""}</span>
            </div>
          )}
          <Button
            type="submit"
            disabled={isLockedOut || !pinInput.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-11 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isLockedOut ? "Account Locked" : "Access Admin Centre"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="/portal/login" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
            ← Back to Portal Login
          </a>
        </div>
      </div>
    </div>
  );
}