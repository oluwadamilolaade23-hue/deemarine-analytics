import { useEffect, useState } from "react";
import {
  BookOpen, FlaskConical, Users, ClipboardList, Clock, Lock,
  CheckCircle, AlertCircle, FileText, Video, ExternalLink,
  Target, Lightbulb, ArrowRight, Send, ChevronRight, User,
  Wrench, Cpu, Database, TrendingUp, MessageSquare,
  FolderOpen, Search, Globe, Code, FileCheck, Scale, Beaker,
  Download, RefreshCw,
} from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getModules, getAssignments, getSubmissions, getProjects,
  getProjectMilestones, getGroupMembers, getMentor,
  submitAssignment, logActivity,
  MODULE_CATEGORIES, PROJECT_PHASES, SEED_MENTOR,
  PROJECT_RESOURCES, HUB_ESSENTIALS, MENTOR_TOUCHPOINTS,
  SKILL_AREAS, RESOURCE_TYPES,
  type Module, type Assignment, type Submission,
  type Project, type ProjectMilestone, type GroupMember, type Mentor,
} from "@/lib/portal-data";

const RESOURCE_TYPE_ICONS: Record<string, React.ElementType> = {
  "Guide": BookOpen,
  "Dataset": Database,
  "Template": FileText,
  "Technical Reference": Wrench,
  "Research Paper": Beaker,
  "Video": Video,
  "Tutorial": BookOpen,
  "Tool": Cpu,
  "Code / Notebook": Code,
  "Case Study": FileCheck,
  "Standard / Regulation": Scale,
  "External Link": Globe,
};

// ============================================================
// SESSION TOKEN HELPER
// ============================================================
function getPortalAccessToken(): string | null {
  try {
    const stored = sessionStorage.getItem("bdh_portal_session");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.expiresAt && Date.now() >= parsed.expiresAt) return null;
    return parsed.accessToken || null;
  } catch {
    return null;
  }
}

// ============================================================
// PROJECT RESOURCE HUB (formerly Learning Hub)
// ============================================================
export function PortalLearning() {
  const { participant } = usePortalAuth();
  const [activeTab, setActiveTab] = useState("project-resources");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [search, setSearch] = useState("");

    const dynamicResources = [
    {
      id: "project-dataset",
      title: "Project Dataset",
      description: participant?.department
        ? `Primary dataset for the ${participant.department} project.`
        : "Primary dataset for your assigned BlueData Hub project.",
      type: "Dataset",
      phase: "understand",
      skillArea: "Data Analysis",
    },
    {
      id: "data-dictionary",
      title: "Data Dictionary",
      description:
        "Field definitions, units and interpretation notes for your project dataset.",
      type: "Technical Reference",
      phase: "understand",
      skillArea: "Data Analysis",
    },
    {
      id: "project-brief",
      title: "Project Brief",
      description:
        "Business challenge, project pathway, KPIs and expected outcomes for your assigned project.",
      type: "Guide",
      phase: "understand",
      skillArea: "Project Management",
    },
  ];
const filteredResources = dynamicResources.filter((r) => {
    const matchPhase = phaseFilter === "all" || r.phase === phaseFilter;
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchSkill = skillFilter === "all" || r.skillArea === skillFilter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase());
    return matchPhase && matchType && matchSkill && matchSearch;
  });

  const phasesWithResources = PROJECT_PHASES
    .filter((p) => dynamicResources.some((r) => r.phase === p.key))
    .map((phase) => ({
      ...phase,
    resources: dynamicResources.filter((r) => r.phase === phase.key),
    }));

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Project Resource Hub</h1>
        <p className="text-slate-500 text-sm">Knowledge, tools and references to help teams solve maritime problems.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="project-resources" className="text-xs">Project Resources</TabsTrigger>
          <TabsTrigger value="hub-essentials" className="text-xs">Hub Essentials</TabsTrigger>
          <TabsTrigger value="browse" className="text-xs">Browse All</TabsTrigger>
        </TabsList>

        {/* Project Resources by Phase */}
        <TabsContent value="project-resources">
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <FlaskConical className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
  {participant?.department || "Your Project Group"}
</p>

<p className="text-slate-500 text-xs">
  {participant?.department === "Port Intelligence Lab"
    ? "Port & Supply Chain Intelligence"
    : participant?.department === "Fleet Performance & Reliability"
    ? "Fleet Performance & Reliability Analytics"
    : participant?.department === "Maritime Safety & Risk Analytics"
    ? "Maritime Safety & Risk Analytics"
    : participant?.department === "Energy & Decarbonization Analytics"
    ? "Energy & Decarbonization Analytics"
    : participant?.department === "Green Port Analytics"
    ? "Green Ports & Blue Economy Analytics"
    : participant?.department === "Maritime BI & AI"
    ? "Maritime Business Intelligence & AI"
    : participant?.department === "CyberSea / Digital Risk Intelligence"
    ? "Maritime Cybersecurity & Digital Risk Intelligence"
    : "Your assigned BlueData Hub project"}
</p>
                </div>
              </div>
              <p className="text-slate-600 text-xs">Resources organised by project phase. Each resource is linked to a specific stage of the Understand &rarr; Measure &rarr; Analyse &rarr; Validate &rarr; Present framework.</p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {phasesWithResources.map((phase) => (
              <div key={phase.key}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{PROJECT_PHASES.findIndex((p) => p.key === phase.key) + 1}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{phase.label}</h2>
                  <Badge variant="outline" className="text-xs">{phase.resources.length} resources</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.resources.map((r) => {
                    const Icon = RESOURCE_TYPE_ICONS[r.type] || BookOpen;
                    return (
                      <Card key={r.id} className="border-slate-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                              {r.description && <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{r.description}</p>}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <Badge variant="outline" className="text-xs">{r.type}</Badge>
                                {r.skillArea && <Badge className="bg-cyan-50 text-cyan-700 text-xs">{r.skillArea}</Badge>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Hub Essentials */}
        <TabsContent value="hub-essentials">
          <Card className="border-slate-200 mb-6 bg-gradient-to-r from-slate-50 to-blue-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h2 className="font-bold text-slate-900 text-sm">Hub Essentials</h2>
              </div>
              <p className="text-slate-600 text-xs">Programme-wide foundational material. These are supporting resources, NOT a traditional course curriculum.</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HUB_ESSENTIALS.map((item) => {
              const Icon = RESOURCE_TYPE_ICONS[item.type] || BookOpen;
              return (
                <Card key={item.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                        {item.description && <p className="text-slate-500 text-xs mt-1">{item.description}</p>}
                        <Badge variant="outline" className="text-xs mt-2">{item.type}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Browse All */}
        <TabsContent value="browse">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Project Phase" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {PROJECT_PHASES.filter((p) => dynamicResources.some((r) => r.phase === p.key)).map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Resource Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Skill Area" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {SKILL_AREAS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {filteredResources.length === 0 ? (
            <Card className="border-slate-200"><CardContent className="p-8 text-center">
              <FolderOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No resources match your filters.</p>
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((r) => {
                const Icon = RESOURCE_TYPE_ICONS[r.type] || BookOpen;
                return (
                  <Card key={r.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                          {r.description && <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{r.description}</p>}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <Badge variant="outline" className="text-xs">{r.type}</Badge>
                            <Badge className="bg-blue-50 text-blue-700 text-xs capitalize">{r.phase}</Badge>
                            {r.skillArea && <Badge className="bg-cyan-50 text-cyan-700 text-xs">{r.skillArea}</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// PROJECT LAB (dynamic — loads from bdh-portal-auth Edge Function)
// ============================================================

interface ProjectStage {
  stage_number: number;
  title: string;
  description: string;
  deliverable: string;
}

interface ProjectResourceItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  status?: string;
  url?: string;
}

interface ProjectDeliverable {
  number: number;
  title: string;
  description: string;
  required: boolean;
}

interface ProjectInfo {
  challenge: string;
  business_question: string;
  objective: string;
  expected_outcome: string;
}

interface ParticipantProject {
  group_name: string;
  project: ProjectInfo;
  current_stage: number;
  dataset_status: string;
  stages: ProjectStage[];
  resources: ProjectResourceItem[];
  deliverables: ProjectDeliverable[];
}

const RESOURCE_TYPE_ICONS_LAB: Record<string, React.ElementType> = {
  dataset: Database,
  data_dictionary: BookOpen,
  project_brief: FileText,
  template: FileCheck,
  learning: BookOpen,
  reference: Globe,
};

export function PortalProjectLab() {
  const { participant } = usePortalAuth();
  const [projectData, setProjectData] = useState<ParticipantProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!participant) {
      setLoading(false);
      setError("Please log in to view your project.");
      return;
    }

    const loadProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = getPortalAccessToken();
        if (!accessToken) {
          setError("Your session has expired. Please log in again.");
          setLoading(false);
          return;
        }

        const { data, error: efError } = await supabase.functions.invoke("bdh-portal-auth", {
          body: {
            action: "project",
            access_token: accessToken,
          },
        });

        if (efError) {
          setError("We couldn't load your project details. Please try again.");
          setLoading(false);
          return;
        }

        if (!data?.success || !data.project) {
          setError(data?.error || "No project assignment found for your account.");
          setLoading(false);
          return;
        }

        setProjectData({
          group_name: data.group_name || participant.department || "",
          project: data.project,
          current_stage: data.current_stage || 1,
          dataset_status: data.dataset_status || "available",
          stages: data.stages || [],
          resources: (data.resources || []).filter((r: ProjectResourceItem) => r.status !== "archived"),
          deliverables: data.deliverables || [],
        });
      } catch {
        setError("Something went wrong loading your project. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [participant]);

  const handleDownloadDataset = async () => {
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const accessToken = getPortalAccessToken();
      if (!accessToken) {
        setDownloadError("Your session has expired. Please log in again.");
        setDownloadLoading(false);
        return;
      }

      const { data, error: dlError } = await supabase.functions.invoke("bdh-project-download", {
        body: { access_token: accessToken },
      });

      if (dlError || !data?.success || !data?.download_url) {
        setDownloadError("We couldn't prepare your project dataset. Please try again.");
        setDownloadLoading(false);
        return;
      }

      // Use the temporary signed URL to initiate download
      const link = document.createElement("a");
      link.href = data.download_url;
      link.download = data.filename || "project-dataset.xlsx";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setDownloadError("We couldn't prepare your project dataset. Please try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  if (error || !projectData) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <Card className="border-slate-200"><CardContent className="p-8 text-center">
          <FlaskConical className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">{error || "Project details are not available yet."}</p>
          <p className="text-slate-400 text-xs mt-1">If this persists, please contact BlueData Hub Support.</p>
        </CardContent></Card>
      </div>
    );
  }

  const { group_name, project, current_stage, dataset_status, stages, resources, deliverables } = projectData;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Project Lab</h1>
        <p className="text-slate-500 text-sm">Your maritime analytics project workspace.</p>
      </div>

      {/* Project Status Bar */}
      <Card className="border-slate-200 mb-6 bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-xs">Assigned Group</p>
              <p className="font-semibold text-slate-900 text-sm">{group_name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Current Stage</p>
              <p className="font-semibold text-blue-600 text-sm">Stage {current_stage} of 5</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Dataset Status</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${dataset_status === "available" ? "bg-green-500" : "bg-amber-500"}`} />
                <p className="font-semibold text-slate-900 text-sm capitalize">{dataset_status}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Programme</p>
              <p className="font-semibold text-slate-900 text-sm">DMA BlueData Hub</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge & Business Question */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" />The Challenge</CardTitle></CardHeader>
          <CardContent><p className="text-slate-700 text-sm">{project.challenge}</p></CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-blue-500" />Business Question</CardTitle></CardHeader>
          <CardContent><p className="text-slate-700 text-sm">{project.business_question}</p></CardContent>
        </Card>
      </div>

      {/* Objective & Expected Outcome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-green-500" />Project Objective</CardTitle></CardHeader>
          <CardContent><p className="text-slate-700 text-sm">{project.objective}</p></CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-cyan-500" />Expected Outcome</CardTitle></CardHeader>
          <CardContent><p className="text-slate-700 text-sm">{project.expected_outcome}</p></CardContent>
        </Card>
      </div>

      {/* Project Dataset Download */}
      <Card className="border-slate-200 mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-indigo-500" />Project Dataset</CardTitle></CardHeader>
        <CardContent>
          <p className="text-slate-600 text-sm mb-4">Your project dataset package is available for download. This is the primary data source for your team's analysis.</p>
          {downloadError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{downloadError}</p>
            </div>
          )}
          <Button
            onClick={handleDownloadDataset}
            disabled={downloadLoading || dataset_status === "unavailable"}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {downloadLoading ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Preparing download...</>
            ) : (
              <><Download className="h-4 w-4 mr-2" />Download Project Dataset</>
            )}
          </Button>
          {dataset_status === "unavailable" && (
            <p className="text-amber-600 text-xs mt-2">Your dataset is being prepared and will be available soon.</p>
          )}
        </CardContent>
      </Card>

      {/* 5-Stage Project Roadmap */}
      {stages.length > 0 && (
        <Card className="border-slate-200 mb-6">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ArrowRight className="h-4 w-4 text-blue-500" />Project Roadmap</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {stages.map((stage, idx) => {
                const isCurrent = stage.stage_number === current_stage;
                const isCompleted = stage.stage_number < current_stage;
                const isUpcoming = stage.stage_number > current_stage;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        isCompleted ? "bg-green-500 text-white" :
                        isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                        "bg-slate-200 text-slate-400"
                      }`}>
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : stage.stage_number}
                      </div>
                      {idx < stages.length - 1 && (
                        <div className={`w-0.5 h-16 ${isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-300" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <div className="pb-8 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-semibold text-sm ${isUpcoming ? "text-slate-400" : "text-slate-900"}`}>
                          Stage {stage.stage_number}: {stage.title}
                        </p>
                        {isCurrent && <Badge className="bg-blue-100 text-blue-700 text-xs">Current</Badge>}
                        {isCompleted && <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>}
                      </div>
                      <p className={`text-xs ${isUpcoming ? "text-slate-400" : "text-slate-500"}`}>{stage.description}</p>
                      {stage.deliverable && (
                        <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600"><span className="font-semibold">Required deliverable:</span> {stage.deliverable}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Resources */}
      {resources.length > 0 && (
        <Card className="border-slate-200 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><FolderOpen className="h-4 w-4 text-cyan-500" />Project Resources</CardTitle>
              <Badge variant="outline" className="text-xs">{resources.length} resources</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resources.map((r) => {
                const Icon = RESOURCE_TYPE_ICONS_LAB[r.type] || BookOpen;
                return (
                  <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                      {r.description && <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{r.description}</p>}
                      <Badge variant="outline" className="text-xs mt-1.5 capitalize">{r.type.replace(/_/g, " ")}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Deliverables */}
      {deliverables.length > 0 && (
        <Card className="border-slate-200 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4 text-orange-500" />Required Deliverables</CardTitle>
              <Badge variant="outline" className="text-xs">{deliverables.filter((d) => d.required).length} required</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliverables.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    d.required ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {d.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm">{d.title}</p>
                      {d.required && <Badge className="bg-orange-50 text-orange-700 text-xs">Required</Badge>}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// MY TEAM
// ============================================================
export function PortalTeam() {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroupMembers("placeholder").then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Team</h1>
      <p className="text-slate-500 text-sm mb-6">Your project team workspace and collaboration hub.</p>

      {members.length === 0 ? (
        <Card className="border-slate-200"><CardContent className="p-8 text-center">
          <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Team Assignment Coming Soon</p>
          <p className="text-slate-400 text-xs mt-1">Your project team is being prepared. Check back after orientation.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Team Name</p>
                  <p className="font-semibold text-slate-900 text-sm">Team Sentinel</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Project</p>
                  <p className="font-semibold text-slate-900 text-sm">DeeMarine Sentinel</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Current Milestone</p>
                  <p className="font-semibold text-slate-900 text-sm">Understand the Problem</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Team Objective</p>
                  <p className="font-semibold text-slate-900 text-sm">Build a predictive maintenance prototype</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((m) => (
              <Card key={m.id} className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{m.participant?.full_name || "Member"}</p>
                      <p className="text-slate-500 text-xs">{m.role || "Team Member"}</p>
                    </div>
                  </div>
                  {m.responsibilities && <p className="text-slate-600 text-xs">{m.responsibilities}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ASSIGNMENTS (My Tasks)
// ============================================================
export function PortalAssignments() {
  const { participant } = usePortalAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("not_started");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [textResponse, setTextResponse] = useState("");
  const [linkResponse, setLinkResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [assigns, subs] = await Promise.all([
        getAssignments(),
        participant ? getSubmissions(participant.id) : Promise.resolve([]),
      ]);
      setAssignments(assigns);
      setSubmissions(subs);
      setLoading(false);
    };
    loadData();
  }, [participant]);

  const getAssignmentStatus = (assignmentId: string): string => {
    const sub = submissions.find((s) => s.assignment_id === assignmentId);
    if (!sub) return "not_started";
    return sub.status;
  };

  const filtered = assignments.filter((a) => getAssignmentStatus(a.id) === activeTab);

  const handleSubmit = async () => {
    if (!participant || !selectedAssignment) return;
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    const result = await submitAssignment(selectedAssignment.id, participant.id, {
      text_response: textResponse || undefined,
      link_response: linkResponse || undefined,
    });
    if (result.success) {
      setSubmitSuccess(true);
      logActivity(participant.id, "assignment_submitted", `Submitted: ${selectedAssignment.title}`);
      const subs = await getSubmissions(participant.id);
      setSubmissions(subs);
      setSelectedAssignment(null);
      setTextResponse("");
      setLinkResponse("");
    } else {
      setSubmitError(result.error || "Failed to submit.");
    }
    setSubmitting(false);
  };

  const statusTabs = [
    { key: "not_started", label: "Not Started" },
    { key: "in_progress", label: "In Progress" },
    { key: "submitted", label: "Submitted" },
    { key: "reviewed", label: "Reviewed" },
    { key: "completed", label: "Completed" },
  ];

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Tasks</h1>
      <p className="text-slate-500 text-sm mb-6">Project tasks, deadlines, and deliverables.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto mb-4">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="text-xs">{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            {filtered.length === 0 ? (
              <Card className="border-slate-200"><CardContent className="p-8 text-center">
                <ClipboardList className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No tasks in this category.</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-4">
                {filtered.map((assignment) => {
                  const sub = submissions.find((s) => s.assignment_id === assignment.id);
                  return (
                    <Card key={assignment.id} className="border-slate-200">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{assignment.title}</h3>
                            <p className="text-slate-500 text-xs mb-2 line-clamp-2">{assignment.instructions}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                              {assignment.deadline && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Due {new Date(assignment.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs capitalize">{assignment.submission_type}</Badge>
                            </div>
                            {sub?.feedback && (
                              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-slate-700">
                                <span className="font-semibold">Feedback: </span>{sub.feedback}
                                {sub.score !== null && sub.score !== undefined && <span className="ml-2 font-semibold">Score: {sub.score}/100</span>}
                              </div>
                            )}
                          </div>
                          {getAssignmentStatus(assignment.id) === "not_started" && (
                            <Button
                              size="sm"
                              onClick={() => { setSelectedAssignment(assignment); setSubmitSuccess(false); setSubmitError(""); }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Start <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Submission Dialog */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAssignment(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 text-lg mb-1">{selectedAssignment.title}</h3>
            <p className="text-slate-500 text-sm mb-4">{selectedAssignment.instructions}</p>

            {submitSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-green-700 text-sm">Task submitted successfully!</p>
              </div>
            )}
            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            {selectedAssignment.submission_type === "text" && (
              <div className="space-y-2 mb-4">
                <Label className="text-sm">Your Response</Label>
                <Textarea value={textResponse} onChange={(e) => setTextResponse(e.target.value)} rows={6} placeholder="Enter your response..." />
              </div>
            )}
            {selectedAssignment.submission_type === "link" && (
              <div className="space-y-2 mb-4">
                <Label className="text-sm">Submission Link</Label>
                <Input value={linkResponse} onChange={(e) => setLinkResponse(e.target.value)} placeholder="https://..." />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedAssignment(null)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {submitting ? "Submitting..." : <><Send className="h-4 w-4 mr-1.5" />Submit</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}