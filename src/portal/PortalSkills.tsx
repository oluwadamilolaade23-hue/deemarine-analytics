import { useEffect, useState } from "react";
import {
  Award, TrendingUp, Briefcase, CheckCircle, Target, Star,
  BarChart3, BookOpen, FlaskConical, Calendar, Users, Trophy,
  Plus, X, ExternalLink, FileText, Code, Presentation,
  Lightbulb, ArrowRight,
} from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getSkills, getParticipantSkills, getPortfolioItems,
  SEED_SKILLS, SKILL_LEVELS, SKILL_LEVEL_LABELS, SKILL_LEVEL_COLORS,
  SKILL_EVIDENCE_SOURCES,
  type Skill, type ParticipantSkill, type PortfolioItem,
} from "@/lib/portal-data";

// ============================================================
// SKILL PASSPORT
// ============================================================
export function PortalSkillPassport() {
  const { participant } = usePortalAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [participantSkills, setParticipantSkills] = useState<ParticipantSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [sk, ps] = await Promise.all([
        getSkills(),
        participant ? getParticipantSkills(participant.id) : Promise.resolve([]),
      ]);
      setSkills(sk);
      setParticipantSkills(ps);
      setLoading(false);
    };
    loadData();
  }, [participant]);

  const getSkillLevel = (skillId: string): string => {
    const ps = participantSkills.find((s) => s.skill_id === skillId);
    return ps?.level || "not_started";
  };

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  // Top skills for profile section
  const topSkills = skills
    .map((s) => ({ ...s, level: getSkillLevel(s.id) }))
    .filter((s) => s.level !== "not_started")
    .sort((a, b) => SKILL_LEVELS.indexOf(b.level) - SKILL_LEVELS.indexOf(a.level))
    .slice(0, 6);

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Award className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Blue Data Skill Passport</h1>
            <p className="text-cyan-400 text-sm">Learn what you need &rarr; Apply it &rarr; Build evidence &rarr; Demonstrate the skill.</p>
          </div>
        </div>
      </div>

      {/* Evidence Sources — project-first, not course-based */}
      <Card className="border-slate-200 mb-6 bg-gradient-to-r from-slate-50 to-cyan-50">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" />How Skills Are Earned</CardTitle></CardHeader>
        <CardContent>
          <p className="text-slate-600 text-xs mb-3">You do NOT need to complete courses to earn skills. Evidence can come from any of these sources:</p>
          <div className="flex flex-wrap gap-2">
            {SKILL_EVIDENCE_SOURCES.map((src) => (
              <Badge key={src} variant="outline" className="text-xs bg-white">{src}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Profile - Top Areas */}
      {topSkills.length > 0 && (
        <Card className="border-slate-200 mb-6">
          <CardHeader><CardTitle className="text-base">Your Strongest Areas</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {topSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{skill.name}</p>
                    <p className="text-slate-400 text-xs">{skill.category}</p>
                  </div>
                  <Badge className={`text-xs ${SKILL_LEVEL_COLORS[skill.level]}`}>{SKILL_LEVEL_LABELS[skill.level]}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Skill Grid by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.filter((s) => s.category === category).map((skill) => {
              const level = getSkillLevel(skill.id);
              const levelIdx = SKILL_LEVELS.indexOf(level);
              return (
                <Card key={skill.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 text-sm">{skill.name}</p>
                      <Badge className={`text-xs ${SKILL_LEVEL_COLORS[level]}`}>{SKILL_LEVEL_LABELS[level]}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {SKILL_LEVELS.map((_, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 h-1.5 rounded-full ${idx <= levelIdx ? "bg-cyan-500" : "bg-slate-200"}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MY PROGRESS
// ============================================================
export function PortalProgress() {
  const { participant } = usePortalAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [participantSkills, setParticipantSkills] = useState<ParticipantSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [sk, ps] = await Promise.all([
        getSkills(),
        participant ? getParticipantSkills(participant.id) : Promise.resolve([]),
      ]);
      setSkills(sk);
      setParticipantSkills(ps);
      setLoading(false);
    };
    loadData();
  }, [participant]);

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  const developedSkills = participantSkills.filter((s) => s.level !== "not_started").length;
  const totalSkills = skills.length;
  const skillPct = totalSkills > 0 ? Math.round((developedSkills / totalSkills) * 100) : 0;

  const stats = [
    { label: "Overall Progress", value: "12%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Modules Completed", value: "0 / 14", icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
    { label: "Assignments Done", value: "0 / 3", icon: CheckCircle, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Sessions Attended", value: "0", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Milestones Done", value: "0 / 6", icon: Target, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Skills Developed", value: `${developedSkills} / ${totalSkills}`, icon: Award, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  const achievements = [
    { title: "Project Contributor", desc: "Contributed to a project milestone", icon: FlaskConical, earned: false },
    { title: "Data Analysis Milestone", desc: "Completed a data analysis assignment", icon: BarChart3, earned: false },
    { title: "Technical Communicator", desc: "Presented technical findings", icon: Presentation, earned: false },
    { title: "Team Collaborator", desc: "Collaborated effectively with team", icon: Users, earned: false },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Progress</h1>
      <p className="text-slate-500 text-sm mb-6">Track your journey through the BlueData Hub programme.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skill Development Progress */}
      <Card className="border-slate-200 mb-8">
        <CardHeader><CardTitle className="text-base">Skill Development</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">{developedSkills} of {totalSkills} skills in progress</span>
            <span className="text-sm font-bold text-slate-900">{skillPct}%</span>
          </div>
          <Progress value={skillPct} className="h-3" />
        </CardContent>
      </Card>

      {/* Achievements */}
      <h2 className="text-lg font-bold text-slate-900 mb-3">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <Card key={ach.title} className={`border-slate-200 ${ach.earned ? "bg-amber-50" : ""}`}>
            <CardContent className="p-5 text-center">
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${ach.earned ? "bg-amber-200" : "bg-slate-100"}`}>
                <ach.icon className={`h-6 w-6 ${ach.earned ? "text-amber-700" : "text-slate-400"}`} />
              </div>
              <p className={`font-semibold text-sm ${ach.earned ? "text-amber-900" : "text-slate-500"}`}>{ach.title}</p>
              <p className="text-slate-400 text-xs mt-1">{ach.desc}</p>
              {ach.earned ? (
                <Badge className="mt-2 bg-amber-200 text-amber-800 text-xs">Earned</Badge>
              ) : (
                <Badge variant="outline" className="mt-2 text-xs text-slate-400">Locked</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PORTFOLIO
// ============================================================
export function PortalPortfolio() {
  const { participant } = usePortalAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ type: "project", title: "", description: "", role: "", contributions: "", skills: "", link_url: "" });

  useEffect(() => {
    if (participant) {
      getPortfolioItems(participant.id).then((data) => {
        setItems(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [participant]);

  const typeIcons: Record<string, React.ElementType> = {
    project: FlaskConical,
    dashboard: BarChart3,
    report: FileText,
    code: Code,
    research: BookOpen,
    presentation: Presentation,
    certificate: Award,
  };

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Evidence &amp; Deliverables</h1>
          <p className="text-slate-500 text-sm">Your project evidence, deliverables, and professional portfolio.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> Add Item
        </Button>
      </div>

      {showAdd && (
        <Card className="border-slate-200 mb-6">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Add Portfolio Item</h3>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Type</Label>
                <Select value={newItem.type} onValueChange={(v) => setNewItem({ ...newItem, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(typeIcons).map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Title</Label>
                <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="e.g., Vibration Analysis Report" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm">Description</Label>
                <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} rows={2} placeholder="Brief description of the work" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Your Role</Label>
                <Input value={newItem.role} onChange={(e) => setNewItem({ ...newItem, role: e.target.value })} placeholder="e.g., Data Analyst" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Link (optional)</Label>
                <Input value={newItem.link_url} onChange={(e) => setNewItem({ ...newItem, link_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Contributions (comma-separated)</Label>
                <Input value={newItem.contributions} onChange={(e) => setNewItem({ ...newItem, contributions: e.target.value })} placeholder="Data prep, Analysis, Visualization" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Skills Demonstrated (comma-separated)</Label>
                <Input value={newItem.skills} onChange={(e) => setNewItem({ ...newItem, skills: e.target.value })} placeholder="Excel, Python, Power BI" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  // Add to local state (Supabase insert would happen if configured)
                  const item: PortfolioItem = {
                    id: `local-${Date.now()}`,
                    participant_id: participant?.id || "",
                    type: newItem.type,
                    title: newItem.title,
                    description: newItem.description,
                    role: newItem.role,
                    contributions: newItem.contributions ? newItem.contributions.split(",").map((s) => s.trim()) : [],
                    skills_demonstrated: newItem.skills ? newItem.skills.split(",").map((s) => s.trim()) : [],
                    link_url: newItem.link_url || undefined,
                  };
                  setItems([item, ...items]);
                  setShowAdd(false);
                  setNewItem({ type: "project", title: "", description: "", role: "", contributions: "", skills: "", link_url: "" });
                }}
                disabled={!newItem.title.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add to Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="border-slate-200"><CardContent className="p-8 text-center">
          <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Your portfolio is empty.</p>
          <p className="text-slate-400 text-xs mt-1">Add projects, reports, dashboards, and certificates to build your professional profile.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const Icon = typeIcons[item.type] || FileText;
            return (
              <Card key={item.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                      {item.description && <p className="text-slate-500 text-xs mt-1">{item.description}</p>}
                      {item.role && <p className="text-slate-600 text-xs mt-2"><span className="font-semibold">Role:</span> {item.role}</p>}
                      {item.contributions && item.contributions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-slate-400 text-xs font-semibold mb-1">Contributions</p>
                          <ul className="space-y-0.5">
                            {item.contributions.map((c, i) => <li key={i} className="text-xs text-slate-600">• {c}</li>)}
                          </ul>
                        </div>
                      )}
                      {item.skills_demonstrated && item.skills_demonstrated.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.skills_demonstrated.map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)}
                        </div>
                      )}
                      {item.link_url && (
                        <Button asChild size="sm" variant="ghost" className="mt-2 -ml-2 text-blue-600">
                          <a href={item.link_url} target="_blank" rel="noopener noreferrer">Open <ExternalLink className="h-3 w-3 ml-1" /></a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}