import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, Calendar, Megaphone, FolderOpen, LifeBuoy, User,
  Clock, Video, Lock, Download, CheckCircle, AlertCircle, Ship,
  BookOpen, FileText, ExternalLink, Search, Send, ChevronRight,
} from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PROGRAMME_PHASES, SEED_COHORT, SEED_TRACKS,
  getSessions, getAnnouncements, getResources,
  createSupportRequest, getSupportRequests,
  SUPPORT_CATEGORIES, RESOURCE_CATEGORIES, RESOURCE_TYPES,
  type Session, type Announcement, type Resource, type SupportRequest,
} from "@/lib/portal-data";

// ============================================================
// MY PROGRAMME
// ============================================================
export function PortalProgramme() {
  const { participant } = usePortalAuth();
  const trackName = SEED_TRACKS.find((t) => t.id === participant?.track_id)?.name || "Explorer Track";
  const currentPhase = 0;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Programme</h1>
      <p className="text-slate-500 text-sm mb-6">Your structured journey through the DMA BlueData Hub.</p>

      <Card className="mb-8 border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-xs">Programme</p>
              <p className="font-semibold text-slate-900 text-sm">DMA BlueData Hub</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Cohort</p>
              <p className="font-semibold text-slate-900 text-sm">Cohort 1 — 2026</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Track</p>
              <p className="font-semibold text-slate-900 text-sm">{trackName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Department</p>
              <p className="font-semibold text-slate-900 text-sm">{participant?.department || "Fleet Performance & Reliability"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Start Date</p>
              <p className="font-semibold text-slate-900 text-sm">Aug 29, 2026</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Expected Completion</p>
              <p className="font-semibold text-slate-900 text-sm">Dec 15, 2026</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Duration</p>
              <p className="font-semibold text-slate-900 text-sm">~16 weeks</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Current Phase</p>
              <p className="font-semibold text-blue-600 text-sm">{PROGRAMME_PHASES[currentPhase].label}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Programme Journey</h2>
      <div className="space-y-0">
        {PROGRAMME_PHASES.map((phase, idx) => (
          <div key={phase.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                idx < currentPhase ? "bg-green-500 text-white" :
                idx === currentPhase ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                "bg-slate-200 text-slate-400"
              }`}>
                {idx < currentPhase ? <CheckCircle className="h-5 w-5" /> : idx + 1}
              </div>
              {idx < PROGRAMME_PHASES.length - 1 && (
                <div className={`w-0.5 h-12 ${idx < currentPhase ? "bg-green-500" : "bg-slate-200"}`} />
              )}
            </div>
            <div className="pb-8">
              <p className={`font-semibold text-sm ${idx <= currentPhase ? "text-slate-900" : "text-slate-400"}`}>
                {phase.label}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{phase.desc}</p>
              {idx === currentPhase && (
                <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs">You are here</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SESSIONS
// ============================================================
export function PortalSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const upcoming = sessions.filter((s) => new Date(s.session_date) >= new Date(new Date().toDateString()));
  const past = sessions.filter((s) => new Date(s.session_date) < new Date(new Date().toDateString()));

  const renderSession = (session: Session) => (
    <Card key={session.id} className="border-slate-200 mb-4">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {session.is_orientation && <Badge className="bg-blue-100 text-blue-700 text-xs">Orientation</Badge>}
              {session.type && <Badge variant="outline" className="text-xs capitalize">{session.type}</Badge>}
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{session.title}</h3>
            <p className="text-slate-500 text-xs mt-1">{session.description}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(session.session_date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
              </span>
              {session.session_time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{session.session_time}</span>}
              {session.facilitator && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{session.facilitator}</span>}
            </div>
            {session.agenda && session.agenda.length > 0 && (
              <div className="mt-4 bg-slate-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-600 mb-2">Agenda</p>
                <ol className="space-y-1">
                  {session.agenda.map((item, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2">
                      <span className="text-slate-400 font-mono">{i + 1}.</span> {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 min-w-[140px]">
            {session.meeting_link ? (
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Video className="h-3.5 w-3.5 mr-1.5" /> Join Session
                </a>
              </Button>
            ) : (
              <Button size="sm" disabled variant="outline">
                <Lock className="h-3.5 w-3.5 mr-1.5" /> No Link Yet
              </Button>
            )}
            {session.recording_url && (
              <Button asChild size="sm" variant="outline">
                <a href={session.recording_url} target="_blank" rel="noopener noreferrer">
                  <Video className="h-3.5 w-3.5 mr-1.5" /> Recording
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Mentor Check-Ins</h1>
      <p className="text-slate-500 text-sm mb-6">Periodic mentor touchpoints: project kickoffs, design reviews, midpoint reviews, industry check-ins, and final project reviews.</p>

      <h2 className="text-lg font-bold text-slate-900 mb-3">Upcoming Sessions</h2>
      {upcoming.length > 0 ? upcoming.map(renderSession) : (
        <Card className="border-slate-200 mb-6"><CardContent className="p-8 text-center">
          <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No upcoming sessions scheduled.</p>
        </CardContent></Card>
      )}

      {past.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-3 mt-8">Past Sessions</h2>
          {past.map(renderSession)}
        </>
      )}
    </div>
  );
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================
export function PortalAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements().then((data) => {
      setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Announcements</h1>
      <p className="text-slate-500 text-sm mb-6">Important updates from the BlueData Hub team.</p>

      {announcements.length === 0 ? (
        <Card className="border-slate-200"><CardContent className="p-8 text-center">
          <Megaphone className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No announcements yet.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {ann.priority === "high" && <Badge className="bg-red-100 text-red-700 text-xs">Important</Badge>}
                    <Badge variant="outline" className="text-xs capitalize">{ann.type.replace(/_/g, " ")}</Badge>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(ann.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{ann.title}</h3>
                <p className="text-slate-600 text-sm">{ann.body}</p>
                {ann.author && <p className="text-xs text-slate-400 mt-2">— {ann.author}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// RESOURCES
// ============================================================
export function PortalResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResources().then((data) => {
      setResources(data);
      setLoading(false);
    });
  }, []);

  const filtered = resources.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || r.category === categoryFilter;
    const matchType = typeFilter === "all" || r.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  if (loading) return <div className="p-8"><div className="animate-pulse h-48 bg-slate-200 rounded-xl" /></div>;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Resource Library</h1>
      <p className="text-slate-500 text-sm mb-6">Documents, datasets, videos, and tools for your programme.</p>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {RESOURCE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-slate-200"><CardContent className="p-8 text-center">
          <FolderOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No resources found.</p>
          <p className="text-slate-400 text-xs mt-1">Resources selected for your programme will appear here.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    {r.type === "Video" ? <Video className="h-5 w-5 text-blue-600" /> :
                     r.type === "Document" ? <FileText className="h-5 w-5 text-blue-600" /> :
                     <BookOpen className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{r.category}</Badge>
                      <Badge variant="outline" className="text-xs">{r.type}</Badge>
                    </div>
                    {r.url && (
                      <Button asChild size="sm" variant="ghost" className="mt-2 -ml-2 text-blue-600">
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          Open <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUPPORT
// ============================================================
export function PortalSupport() {
  const { participant } = usePortalAuth();
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<SupportRequest[]>([]);

  useEffect(() => {
    if (participant) {
      getSupportRequests(participant.id).then(setRequests);
    }
  }, [participant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participant || !category || !subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setError("");
    const result = await createSupportRequest(participant.id, category, subject, message);
    if (result.success) {
      setSuccess(true);
      setSubject("");
      setMessage("");
      setCategory("");
      const updated = await getSupportRequests(participant.id);
      setRequests(updated);
    } else {
      setError(result.error || "Failed to submit request.");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Support</h1>
      <p className="text-slate-500 text-sm mb-6">Need help? Submit a support request and our team will get back to you.</p>

      <Card className="border-slate-200 mb-6">
        <CardHeader><CardTitle className="text-base">New Support Request</CardTitle></CardHeader>
        <CardContent>
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-green-700 text-sm">Your request has been submitted. We'll respond soon.</p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {SUPPORT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary of your issue" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail" rows={4} />
            </div>
            <Button type="submit" disabled={submitting || !category || !subject.trim() || !message.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? "Submitting..." : <><Send className="h-4 w-4 mr-1.5" /> Submit Request</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Your Requests</h2>
          <div className="space-y-3">
            {requests.map((req) => (
              <Card key={req.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-slate-900 text-sm">{req.subject}</p>
                    <Badge className={req.status === "open" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}>{req.status}</Badge>
                  </div>
                  <p className="text-slate-500 text-xs">{req.category}</p>
                  <p className="text-slate-600 text-sm mt-1">{req.message}</p>
                  {req.admin_response && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-slate-700">
                      <span className="font-semibold">Response: </span>{req.admin_response}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// PROFILE
// ============================================================
export function PortalProfile() {
  const { participant } = usePortalAuth();
  const trackName = SEED_TRACKS.find((t) => t.id === participant?.track_id)?.name || "Explorer Track";

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Profile</h1>
      <p className="text-slate-500 text-sm mb-6">Your participant information and programme details.</p>

      <Card className="border-slate-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{participant?.full_name || "Participant"}</p>
              <p className="text-slate-500 text-sm font-mono">{participant?.reference_number || "BDH-2026-0000"}</p>
              <Badge className="mt-1 bg-green-100 text-green-700 text-xs">{participant?.programme_status?.toUpperCase() || "ACTIVE"}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-xs">Email</p>
              <p className="font-medium text-slate-900 text-sm">{participant?.email || "—"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Cohort</p>
              <p className="font-medium text-slate-900 text-sm">Cohort 1 — 2026</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Track</p>
              <p className="font-medium text-slate-900 text-sm">{trackName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Department</p>
              <p className="font-medium text-slate-900 text-sm">{participant?.department || "Fleet Performance & Reliability"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Programme Status</p>
              <p className="font-medium text-slate-900 text-sm capitalize">{participant?.programme_status || "Active"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Access Status</p>
              <p className="font-medium text-slate-900 text-sm capitalize">{participant?.access_status || "Active"}</p>
            </div>
          </div>

          {participant?.professional_interests && participant.professional_interests.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-slate-400 text-xs mb-2">Professional Interests</p>
              <div className="flex flex-wrap gap-2">
                {participant.professional_interests.map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{interest}</Badge>
                ))}
              </div>
            </div>
          )}

          {participant?.current_skill_areas && participant.current_skill_areas.length > 0 && (
            <div className="mt-4">
              <p className="text-slate-400 text-xs mb-2">Current Skill Areas</p>
              <div className="flex flex-wrap gap-2">
                {participant.current_skill_areas.map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardContent className="p-6">
          <p className="text-slate-500 text-sm">
            Need to update your information? <Link to="/portal/support" className="text-blue-600 font-medium">Contact support</Link> to request changes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}