import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  FlaskConical,
  ClipboardList,
  TrendingUp,
  Megaphone,
  Clock,
  ArrowRight,
  Video,
  Lock,
  BookOpen,
  Award,
  Users,
} from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getSessions,
  getAnnouncements,
  getProjects,
  getAssignments,
  getSubmissions,
  SEED_COHORT,
  SEED_TRACKS,
  type Session,
  type Announcement,
  type Project,
  type Assignment,
  type Submission,
} from "@/lib/portal-data";

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-3">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-slate-800 rounded-lg px-3 py-2 min-w-[3rem]">
            <span className="text-xl font-bold text-cyan-400 tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-slate-500 text-xs mt-1 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-slate-700 font-medium text-sm">{title}</p>
      <p className="text-slate-400 text-xs mt-1">{desc}</p>
    </div>
  );
}

export function PortalDashboard() {
  const { participant } = usePortalAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [sess, ann, proj, assign] = await Promise.all([
        getSessions(),
        getAnnouncements(),
        getProjects(),
        getAssignments(),
      ]);
      setSessions(sess);
      setAnnouncements(ann);
      setProjects(proj);
      setAssignments(assign);

      if (participant) {
        const subs = await getSubmissions(participant.id);
        setSubmissions(subs);
      }
      setLoading(false);
    };
    loadData();
  }, [participant]);

  const firstName = participant?.full_name?.split(" ")[0] || "Participant";
  const trackName = SEED_TRACKS.find((t) => t.id === participant?.track_id)?.name || "Explorer Track";
  const upcomingSessions = sessions
    .filter((s) => new Date(s.session_date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
  const nextSession = upcomingSessions[0];
  const currentProject = projects[0];
  const nextAssignment = assignments.find(
    (a) => !submissions.some((s) => s.assignment_id === a.id && s.status === "submitted")
  );
  const latestAnnouncement = announcements[0];
  const programmeProgress = 12;

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-slate-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Hero Greeting */}
      <div className="mb-8 bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            Welcome Back, {firstName.toUpperCase()}
          </h1>
          <p className="text-cyan-400 text-sm lg:text-base font-medium mb-4">
            Your BlueData journey continues.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Reference:</span>
              <span className="font-mono font-semibold">{participant?.reference_number || "BDH-2026-0000"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Cohort:</span>
              <span className="font-semibold">Cohort 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Track:</span>
              <span className="font-semibold">{trackName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Department:</span>
              <span className="font-semibold">{participant?.department || "Fleet Performance & Reliability"}</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">ACTIVE</Badge>
          </div>
        </div>
      </div>

      {/* Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Next Session */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Next Session
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {nextSession ? (
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{nextSession.title}</p>
                <p className="text-slate-500 text-xs mb-3">
                  {new Date(nextSession.session_date).toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                  {nextSession.session_time && ` at ${nextSession.session_time}`}
                </p>
                {nextSession.meeting_link ? (
                  <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <a href={nextSession.meeting_link} target="_blank" rel="noopener noreferrer">
                      <Video className="h-3.5 w-3.5 mr-1.5" /> Join Session
                    </a>
                  </Button>
                ) : (
                  <p className="text-slate-400 text-xs italic flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> Meeting access will appear here once published.
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-slate-400 text-xs mb-2">Countdown</p>
                  <Countdown targetDate={`${nextSession.session_date}T${nextSession.session_time || "10:00"}:00`} />
                </div>
              </div>
            ) : (
              <EmptyState icon={Calendar} title="No Upcoming Session" desc="Your next session will appear here." />
            )}
          </CardContent>
        </Card>

        {/* Current Project */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-cyan-600" />
              Current Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentProject ? (
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{currentProject.title}</p>
                <p className="text-slate-500 text-xs mb-3">{currentProject.subtitle}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs capitalize">{currentProject.current_phase}</Badge>
                  <Badge variant="outline" className="text-xs">{currentProject.code}</Badge>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-slate-700">{currentProject.progress}%</span>
                  </div>
                  <Progress value={currentProject.progress} className="h-2" />
                </div>
                <Link to="/portal/project-lab">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Project <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <EmptyState icon={FlaskConical} title="Project Details Coming Soon" desc="Your project team is being prepared." />
            )}
          </CardContent>
        </Card>

        {/* Next Assignment */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-orange-600" />
              Next Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextAssignment ? (
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{nextAssignment.title}</p>
                <p className="text-slate-500 text-xs mb-2 line-clamp-2">{nextAssignment.instructions}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    Due {new Date(nextAssignment.deadline || "").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <Badge className="bg-orange-100 text-orange-700 text-xs">Not Started</Badge>
                </div>
                <Link to="/portal/assignments">
                  <Button variant="outline" size="sm" className="w-full">
                    View Assignment <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <EmptyState icon={ClipboardList} title="No Assignment Yet" desc="Your next challenge will appear here." />
            )}
          </CardContent>
        </Card>

        {/* Programme Progress */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Programme Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-2">
              <p className="text-4xl font-bold text-slate-900">{programmeProgress}%</p>
              <p className="text-slate-500 text-xs mt-1">Complete</p>
              <Progress value={programmeProgress} className="h-2 mt-3" />
              <Link to="/portal/progress">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Details <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Latest Announcement */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-purple-600" />
              Latest Announcement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestAnnouncement ? (
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{latestAnnouncement.title}</p>
                <p className="text-slate-500 text-xs line-clamp-3 mb-3">{latestAnnouncement.body}</p>
                <Link to="/portal/announcements">
                  <Button variant="outline" size="sm" className="w-full">
                    Read More <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <EmptyState icon={Megaphone} title="No Announcements" desc="Important updates will appear here." />
            )}
          </CardContent>
        </Card>

        {/* Quick Links — Project-first flow */}
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Project Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/portal/project-lab">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FlaskConical className="h-3.5 w-3.5 mr-1.5" /> My Project
                </Button>
              </Link>
              <Link to="/portal/team">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-3.5 w-3.5 mr-1.5" /> My Team
                </Button>
              </Link>
              <Link to="/portal/learning">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Resources
                </Button>
              </Link>
              <Link to="/portal/skill-passport">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Award className="h-3.5 w-3.5 mr-1.5" /> Skills
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}