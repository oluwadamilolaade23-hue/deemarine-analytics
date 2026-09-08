import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Globe,
  Zap,
  Ship,
  Anchor,
  BarChart3,
  Cpu,
  Fuel,
  Lock,
  LifeBuoy,
  Wrench,
  MapPin,
  Mail,
  Phone,
  Star,
  Target,
  GraduationCap,
  Handshake,
  User,
  Building,
  Compass,
  Code,
  ShieldCheck,
  HelpCircle,
  Users,
  Award,
  Database,
  FileText,
  Brain,
  Layers,
  TrendingUp,
  Package,
  Leaf,
  ArrowRight,
  Sparkles,
  FolderOpen,
  BookOpen,
  Presentation,
  Lightbulb,
  Network,
  Trophy,
  Repeat,
  Monitor,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const projectLabs = [
  { name: "Fleet Intelligence Lab", icon: Ship, desc: "Vessel tracking, fleet optimization, and performance analytics" },
  { name: "Port Intelligence Lab", icon: Anchor, desc: "Port operations analytics, turnaround optimization, and smart port solutions" },
  { name: "Fuel & Energy Analytics Lab", icon: Fuel, desc: "Fuel consumption monitoring, energy efficiency, and cost optimization" },
  { name: "Decarbonization & Sustainability Lab", icon: Globe, desc: "CII compliance, carbon footprint tracking, and green shipping initiatives" },
  { name: "Green Ports & Blue Economy Lab", icon: Leaf, desc: "Sustainable port development, blue economy analytics, and environmental impact" },
  { name: "Maritime Cybersecurity Lab", icon: Lock, desc: "Threat detection, vulnerability assessment, and security compliance" },
  { name: "Maritime Safety Analytics Lab", icon: LifeBuoy, desc: "Incident analysis, risk assessment, and safety performance monitoring" },
  { name: "Maintenance & Reliability Lab", icon: Wrench, desc: "Predictive maintenance, equipment reliability, and downtime reduction" },
  { name: "Business Intelligence Lab", icon: BarChart3, desc: "Data visualization, reporting dashboards, and strategic insights" },
  { name: "Supply Chain Analytics Lab", icon: Package, desc: "Logistics optimization, supply chain visibility, and trade flow analytics" },
  { name: "AI Innovation Lab", icon: Brain, desc: "Machine learning, AI-powered analytics, and intelligent automation" },
  { name: "DeeMarine Navigator Lab", icon: Cpu, desc: "Product development, feature prototyping, and platform innovation" },
];

const membershipTracks = [
  {
    name: "Explorer",
    fullName: "BlueData Hub Explorer",
    desc: "For students beginning their maritime analytics journey",
    icon: Compass,
    color: "from-cyan-500 to-blue-500",
    features: ["Guided learning paths", "Foundational datasets", "Community access", "Mentorship pairing"],
  },
  {
    name: "Analyst",
    fullName: "BlueData Hub Analyst",
    desc: "For professionals with foundational analytics knowledge",
    icon: BarChart3,
    color: "from-blue-500 to-indigo-500",
    features: ["Real project assignments", "Dashboard building", "SQL & Power BI practice", "Portfolio development"],
  },
  {
    name: "Professional",
    fullName: "BlueData Hub Professional",
    desc: "For experienced analysts and engineers",
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-500",
    features: ["Advanced analytics projects", "AI/ML implementations", "Industry collaborations", "Leadership opportunities"],
  },
  {
    name: "Research",
    fullName: "BlueData Hub Research",
    desc: "For innovation, publications, AI, and sustainability",
    icon: Lightbulb,
    color: "from-purple-500 to-pink-500",
    features: ["Research publications", "AI innovation projects", "Sustainability analytics", "Conference presentations"],
  },
  {
    name: "Industry",
    fullName: "BlueData Hub Industry",
    desc: "For companies, ports, universities, startups, and maritime organizations",
    icon: Building,
    color: "from-emerald-500 to-teal-500",
    features: ["Corporate projects", "Team collaboration", "Custom analytics", "Strategic partnerships"],
  },
];

const memberGains = [
  { icon: Database, title: "Practical Project Experience", desc: "Work on real maritime datasets and industry challenges" },
  { icon: FolderOpen, title: "Portfolio Development", desc: "Build a professional portfolio of completed analytics projects" },
  { icon: Handshake, title: "Industry Mentorship", desc: "One-on-one guidance from senior maritime analysts and data scientists" },
  { icon: Network, title: "Professional Networking", desc: "Connect with maritime professionals and organizations worldwide" },
  { icon: BarChart3, title: "Real Maritime Datasets", desc: "Access authentic operational data from the maritime industry" },
  { icon: Zap, title: "Power BI Dashboards", desc: "Design and build interactive business intelligence dashboards" },
  { icon: Code, title: "SQL Practice", desc: "Hands-on SQL experience with real maritime data structures" },
  { icon: Brain, title: "AI Projects", desc: "Contribute to machine learning and AI-powered analytics solutions" },
  { icon: BookOpen, title: "Research Opportunities", desc: "Collaborate on research papers and industry publications" },
  { icon: Users, title: "Industry Collaboration", desc: "Work alongside ports, shipping companies, and maritime organizations" },
  { icon: Award, title: "Recognition Certificates", desc: "Earn certificates for completed projects and contributions" },
  { icon: FileText, title: "Letters of Contribution", desc: "Receive formal recognition for significant project contributions" },
  { icon: Sparkles, title: "Product Contributions", desc: "Opportunities to contribute to DeeMarine Analytics products and client projects" },
];

const whoCanJoin = [
  { category: "Individuals", members: ["Students", "Graduates", "Marine Engineers", "Nautical Officers", "Port Professionals", "Maritime Logistics Professionals", "Researchers", "Data Analysts", "Software Developers", "Cybersecurity Professionals", "Blue Economy Professionals", "Industry Experts"] },
  { category: "Organizations", members: ["Universities", "Research Institutes", "Shipping Companies", "Ports & Terminals", "Startups", "Maritime Organizations"] },
];

const memberJourneySteps = [
  { step: "Discover", icon: Compass, desc: "Explore the BlueData Hub and learn about our mission" },
  { step: "Join the Community", icon: Users, desc: "Become part of the DeeMarine Analytics community" },
  { step: "Choose a Project Lab", icon: Layers, desc: "Select a lab aligned with your interests and expertise" },
  { step: "Collaborate with a Team", icon: Network, desc: "Work alongside peers on real maritime datasets" },
  { step: "Receive Mentorship", icon: GraduationCap, desc: "Get guidance from experienced maritime analytics professionals" },
  { step: "Build Solutions", icon: Wrench, desc: "Develop dashboards, models, and analytics solutions" },
  { step: "Present Your Work", icon: Presentation, desc: "Showcase your projects to the community and industry" },
  { step: "Earn Recognition", icon: Trophy, desc: "Receive certificates and formal acknowledgment" },
  { step: "Become a Contributor", icon: Star, desc: "Transition from participant to active contributor and mentor" },
  { step: "Join Future Projects", icon: Repeat, desc: "Continue growing with new challenges and opportunities" },
];

const showcaseCategories = [
  { icon: BarChart3, title: "Interactive Dashboards", desc: "Real-time maritime operational dashboards" },
  { icon: BookOpen, title: "Research Papers", desc: "Peer-reviewed maritime analytics research" },
  { icon: Zap, title: "Power BI Reports", desc: "Professional business intelligence reports" },
  { icon: Brain, title: "AI Solutions", desc: "Machine learning models for maritime operations" },
  { icon: TrendingUp, title: "Predictive Models", desc: "Forecasting and predictive analytics solutions" },
  { icon: FileText, title: "Case Studies", desc: "In-depth analyses of maritime data challenges" },
  { icon: Briefcase, title: "Client Projects", desc: "Solutions delivered to industry partners" },
  { icon: Sparkles, title: "Future Publications", desc: "Upcoming research and innovation outputs" },
];

const communityFeatures = [
  { icon: Zap, title: "Announcements", desc: "Latest updates and opportunities" },
  { icon: Users, title: "Discussion Spaces", desc: "Topic-focused conversations" },
  { icon: Layers, title: "Project Teams", desc: "Collaborative working groups" },
  { icon: Calendar, title: "Events", desc: "Webinars, workshops, and meetups" },
  { icon: GraduationCap, title: "Mentorship", desc: "Guided learning and growth" },
  { icon: Database, title: "Resources", desc: "Datasets, tools, and templates" },
  { icon: Network, title: "Networking", desc: "Connect with professionals globally" },
  { icon: BookOpen, title: "Knowledge Library", desc: "Guides, tutorials, and documentation" },
  { icon: Trophy, title: "Future Hackathons", desc: "Competitive analytics challenges" },
];

const faqs = [
  { q: "What is the DMA BlueData Hub?", a: "The DMA BlueData Hub is DeeMarine Analytics' collaborative maritime data and innovation ecosystem where aspiring and experienced professionals work on real-world datasets, solve industry challenges, build professional portfolios, and contribute to practical maritime analytics solutions." },
  { q: "Is this an internship or training programme?", a: "No. The BlueData Hub is a collaborative innovation and applied analytics ecosystem — not a traditional internship or classroom-based training. Members work on real projects with real data, contributing to solutions that impact the maritime industry." },
  { q: "Who can join the BlueData Hub?", a: "The Hub is open to students, graduates, maritime professionals, data analysts, software developers, researchers, cybersecurity professionals, blue economy experts, and organizations including universities, research institutes, shipping companies, and ports." },
  { q: "What tools and technologies will I work with?", a: "Members work with industry-standard tools including Power BI, SQL, Python, Excel, and DeeMarine Navigator, our proprietary maritime analytics platform, along with AI/ML frameworks and specialized maritime data systems." },
  { q: "How do Project Labs work?", a: "Project Labs are specialized focus areas aligned with key maritime analytics domains. When you join, you select a lab that matches your interests and expertise. Each lab has dedicated datasets, projects, and mentorship." },
  { q: "What are the Membership Tracks?", a: "Membership Tracks are tailored pathways: Explorer for students, Analyst for professionals with foundational knowledge, Professional for experienced analysts, Research for innovation and publications, and Industry for organizations seeking collaboration." },
  { q: "Is the BlueData Hub virtual or in-person?", a: "The BlueData Hub is a global virtual ecosystem. All collaboration, mentorship, and project work happens online, allowing members from anywhere in the world to participate." },
  { q: "What do I receive upon completing projects?", a: "Members earn recognition certificates, letters of contribution where applicable, and build a professional portfolio of real maritime analytics work. Outstanding contributors may receive opportunities to work on DeeMarine Analytics products and client projects." },
];

const ANALYTICS_TOOLS = [
  "Microsoft Excel", "Google Sheets", "SQL", "Python", "R",
  "Power BI", "Tableau", "Google Data Studio", "Looker",
  "DeeMarine Navigator", "AIS Platforms", "ERP Systems",
  "GIS Tools", "MATLAB", "SAP", "Other",
];

const ANALYTICS_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const PRIMARY_INTERESTS = [
  "Fleet Analytics", "Port Analytics", "Fuel & Energy", "Decarbonization",
  "Cybersecurity", "Safety Analytics", "Maintenance", "Business Intelligence",
  "Supply Chain", "AI & Machine Learning", "Product Development", "Research",
];

const REFERRAL_SOURCES = [
  "LinkedIn", "Twitter/X", "Instagram", "Facebook",
  "DeeMarine Website", "WhatsApp Community", "University/Campus",
  "Friend/Colleague", "Maritime Forum", "Other",
];

interface RegistrationData {
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  current_status: string;
  organization: string;
  maritime_background: string;
  analytics_level: string;
  analytics_tools: string[];
  primary_interests: string[];
  first_department_choice: string;
  linkedin_url: string;
  portfolio_url: string;
  github_url: string;
  internship_motivation: string;
  referral_source: string;
  privacy_consent: boolean;
  terms_consent: boolean;
  marketing_consent: boolean;
}

const initialFormData: RegistrationData = {
  full_name: "",
  email: "",
  whatsapp: "",
  country: "",
  current_status: "",
  organization: "",
  maritime_background: "",
  analytics_level: "",
  analytics_tools: [],
  primary_interests: [],
  first_department_choice: "",
  linkedin_url: "",
  portfolio_url: "",
  github_url: "",
  internship_motivation: "",
  referral_source: "",
  privacy_consent: false,
  terms_consent: false,
  marketing_consent: false,
};

export default function Internship() {
  return (
    <div>
      <div className="bg-slate-800 text-center py-2 px-4 flex items-center justify-center gap-4">
        <p className="text-blue-300 text-sm font-medium tracking-wide">Applications Closed • Thank you for your interest</p>
        <span className="text-slate-500">|</span>
        <a href="https://bluedata-hub-staging.vercel.app" className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">Enter BlueData Hub Portal →</a>
      </div>
      <HeroSection />
      <WhatIsSection />
      <ProjectLabsSection />
      <MemberJourneySection />
      <MembershipTracksSection />
      <WhatMembersGainSection />
      <WhoCanJoinSection />
      <ProjectShowcaseSection />
      <CommunitySection />
      <RegistrationSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="section-padding bg-[#0f2744] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-30" />
      </div>
      <div className="container-max relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">DMA BlueData Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            DMA <span className="text-blue-400">BlueData</span> Hub
          </h1>
          <p className="text-blue-300 text-xl md:text-2xl font-medium">
            Real Maritime Data. Real Projects. Real Impact.
          </p>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            The DMA BlueData Hub is DeeMarine Analytics' collaborative maritime data and innovation ecosystem where aspiring and experienced professionals work on real-world datasets, solve industry challenges, build professional portfolios, and contribute to practical maritime analytics solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-4 py-2 text-sm">
              <Globe className="h-4 w-4 mr-2" /> Global
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-2 text-sm">
              <Monitor className="h-4 w-4 mr-2" /> Virtual
            </Badge>
            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-4 py-2 text-sm">
              <Users className="h-4 w-4 mr-2" /> Collaborative
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/30 px-4 py-2 text-sm">
              <Layers className="h-4 w-4 mr-2" /> Project-Based
            </Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-lg px-8 py-6 font-semibold shadow-lg">
              <a href="https://bluedata-hub-staging.vercel.app">
                Enter BlueData Hub Portal
              </a>
            </Button>
            <Button size="lg" disabled className="bg-slate-500/50 text-slate-300 cursor-not-allowed text-lg px-8 py-6">
              Applications Closed
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-500/20 hover:text-white cursor-pointer text-lg px-8 py-6">
              <a href="#project-labs">Explore Projects</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatIsSection() {
  const items = [
    { icon: Database, text: "Real maritime datasets" },
    { icon: FileText, text: "Industry case studies" },
    { icon: BarChart3, text: "Operational dashboards" },
    { icon: Zap, text: "Business Intelligence" },
    { icon: Brain, text: "AI-powered analytics" },
    { icon: BookOpen, text: "Research" },
    { icon: Lightbulb, text: "Maritime innovation" },
    { icon: Cpu, text: "Product development" },
    { icon: Handshake, text: "Industry collaborations" },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">About the Hub</Badge>
            <h2 className="text-slate-900">What is the BlueData Hub?</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              The DMA BlueData Hub is NOT an internship. It is NOT a traditional training programme.
            </p>
            <p className="text-slate-600 leading-relaxed">
              It is the collaborative innovation and applied analytics ecosystem of DeeMarine Analytics — where members work on real maritime data, solve industry challenges, and build solutions that matter.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Practical experience, not classroom learning.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectLabsSection() {
  return (
    <section id="project-labs" className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Project Labs</Badge>
          <h2 className="text-slate-900">Choose Your Project Lab</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Twelve specialized labs, each focused on a critical domain of maritime analytics and digital transformation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projectLabs.map((lab) => {
            const Icon = lab.icon;
            return (
              <Card key={lab.name} className="border-0 shadow-sm bg-white hover:shadow-md hover:bg-blue-50/50 transition-all duration-300 group">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{lab.name}</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{lab.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MemberJourneySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Member Journey</Badge>
          <h2 className="text-slate-900">Your Path in the BlueData Hub</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            From discovery to contribution — a structured journey designed for growth and impact.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Animated vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 md:-translate-x-0.5" />
            {memberJourneySteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className={`relative flex items-start gap-6 mb-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block flex-1" />
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-lg shadow-blue-200">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-16 md:ml-0 md:flex-1">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Step {index + 1}</Badge>
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm">{item.step}</h4>
                        <p className="text-slate-600 text-xs mt-1">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MembershipTracksSection() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Membership Tracks</Badge>
          <h2 className="text-slate-900">Choose Your Track</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Five tailored pathways designed for every stage of your maritime analytics journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {membershipTracks.map((track) => {
            const Icon = track.icon;
            return (
              <Card key={track.name} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${track.color}`} />
                <CardContent className="p-6 pt-5 space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{track.name}</h4>
                    <p className="text-xs text-blue-600 font-medium">{track.fullName}</p>
                  </div>
                  <p className="text-slate-600 text-sm">{track.desc}</p>
                  <ul className="space-y-1.5">
                    {track.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhatMembersGainSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">What Members Gain</Badge>
          <h2 className="text-slate-900">Build, Learn, and Grow</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Members receive practical experience, professional development, and industry recognition.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {memberGains.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-0 shadow-sm text-center hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-slate-600 text-xs">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhoCanJoinSection() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Eligibility</Badge>
          <h2 className="text-slate-900">Who Can Join?</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            The BlueData Hub welcomes individuals and organizations from across the maritime and data analytics spectrum.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {whoCanJoin.map((group) => (
            <Card key={group.category} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  {group.category === "Individuals" ? <User className="h-5 w-5 text-blue-600" /> : <Building className="h-5 w-5 text-blue-600" />}
                  {group.category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.members.map((member) => (
                    <div key={member} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="text-slate-700 text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectShowcaseSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Project Showcase</Badge>
          <h2 className="text-slate-900">What Members Build</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            A premium gallery of completed BlueData Hub projects — dashboards, research, AI solutions, and more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseCategories.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group bg-gradient-to-br from-slate-50 to-white">
                <CardContent className="p-6 space-y-3 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                  <Badge variant="outline" className="text-xs text-slate-400">Coming Soon</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="section-padding bg-[#0f2744] text-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">Community</Badge>
            <h2 className="text-white">Collaborate Inside the DeeMarine Community</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              BlueData Hub members collaborate inside the DeeMarine Community — a dedicated space for announcements, discussions, project teams, and professional networking.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <a href="https://chat.whatsapp.com/K6uFQ7CzR1F5051W5ZQlgs?s=cl&p=a&ilr=0" target="_blank" rel="noopener noreferrer">
                Join the Community <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {communityFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/15 transition-colors">
                  <Icon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function RegistrationSection() {
  return (
    <section id="join" className="section-padding bg-blue-600 text-white">
      <div className="container-max">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-10 w-10 text-blue-200" />
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-bold">Applications Closed</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
            Thank you for the overwhelming interest in the DMA BlueData Hub.
          </p>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
            Applications for the Founding Cohort officially closed on <strong>1 August 2026</strong>.
          </p>
          <p className="text-blue-100 leading-relaxed max-w-2xl mx-auto">
            We sincerely appreciate everyone who applied from around the world. Our review process is now underway, and shortlisted applicants will be contacted via email.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto border border-white/20 space-y-6">
            <div>
              <p className="text-white text-sm font-semibold mb-2">Already a Fellow?</p>
              <Button asChild size="lg" className="bg-cyan-500 text-white hover:bg-cyan-400 cursor-pointer font-semibold">
                <a href="https://bluedata-hub-staging.vercel.app">
                  Enter BlueData Hub Portal <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
            <div className="border-t border-white/20 pt-4">
              <p className="text-blue-100 text-sm leading-relaxed">
                If you would like to stay connected and be among the first to hear about future cohorts, programmes, and opportunities, please join our community.
              </p>
              <div className="mt-4">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer font-semibold">
                  <a href="https://chat.whatsapp.com/K6uFQ7CzR1F5051W5ZQlgs?s=cl&p=a&ilr=0" target="_blank" rel="noopener noreferrer">
                    Join the DMA BlueData Hub Community <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <p className="text-blue-200/60 text-xs mt-6">Applications Closed • Thank you for your interest</p>
        </div>
      </div>
    </section>
  );
}

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState("");
  const [formData, setFormData] = useState<RegistrationData>(initialFormData);

  const totalSteps = 4;
  const stepLabels = ["Personal", "Background", "Interests", "Consent"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      analytics_tools: prev.analytics_tools.includes(tool)
        ? prev.analytics_tools.filter((t) => t !== tool)
        : [...prev.analytics_tools, tool],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      primary_interests: prev.primary_interests.includes(interest)
        ? prev.primary_interests.filter((i) => i !== interest)
        : [...prev.primary_interests, interest],
    }));
  };

  const generateApplicationReference = (): string => {
    const year = new Date().getFullYear();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BDH-${year}-${code}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.privacy_consent || !formData.terms_consent) {
      setError("You must agree to the privacy policy and terms to register.");
      setSubmitting(false);
      return;
    }

    const reference = generateApplicationReference();

    const insertPayload = {
      application_reference: reference,
      full_name: formData.full_name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      country: formData.country,
      current_status: formData.current_status || null,
      organization: formData.organization || null,
      maritime_background: formData.maritime_background,
      analytics_level: formData.analytics_level,
      analytics_tools: formData.analytics_tools.length > 0 ? formData.analytics_tools : [],
      primary_interests: formData.primary_interests.length > 0 ? formData.primary_interests : [],
      first_department_choice: formData.first_department_choice,
      linkedin_url: formData.linkedin_url || null,
      portfolio_url: formData.portfolio_url || null,
      github_url: formData.github_url || null,
      internship_motivation: formData.internship_motivation,
      referral_source: formData.referral_source || null,
      privacy_consent: formData.privacy_consent,
      terms_consent: formData.terms_consent,
      marketing_consent: formData.marketing_consent,
      application_status: "Submitted",
    };

    try {
      console.log("[BlueData Hub] Submitting registration to dma_bluedata_hub_applications...");
      console.log("[BlueData Hub] Generated reference:", reference);
      console.log("[BlueData Hub] Supabase URL configured:", Boolean(import.meta.env.VITE_SUPABASE_URL));
      console.log("[BlueData Hub] Supabase Anon Key configured:", Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY));
      console.log("[BlueData Hub] Insert payload fields:", Object.keys(insertPayload).join(", "));

      const { error: insertError } = await supabase
        .from("dma_bluedata_hub_applications")
        .insert([insertPayload]);

      if (insertError) {
        console.error("[BlueData Hub] Supabase insert error FULL:", JSON.stringify(insertError, null, 2));
        console.error("[BlueData Hub] Error code:", insertError.code);
        console.error("[BlueData Hub] Error message:", insertError.message);
        console.error("[BlueData Hub] Error details:", insertError.details);
        console.error("[BlueData Hub] Error hint:", insertError.hint);

        if (insertError.code === "23505" && insertError.message.includes("email")) {
          throw new Error("A registration with this email already exists. Each person may register only once.");
        }
        if (insertError.code === "23505" && insertError.message.includes("application_reference")) {
          throw new Error("A duplicate reference was generated. Please try submitting again.");
        }
        if (insertError.code === "42P01" || insertError.message.includes("Could not find") || insertError.message.includes("schema cache") || insertError.message.includes("does not exist")) {
          throw new Error("The registration table has not been created yet. Please run the SQL migration in your Supabase Dashboard first. See supabase/dma_bluedata_hub_migration.sql for the migration script.");
        }
        if (insertError.code === "42501" || insertError.message.includes("policy") || insertError.message.includes("permission")) {
          throw new Error("Permission denied: the database is not accepting registrations. Please contact info@deemarineanalytics.ca. (Error: " + insertError.message + ")");
        }
        if (insertError.code === "22P02") {
          throw new Error("Data format error: one of the fields has an invalid value. Details: " + insertError.message);
        }
        if (insertError.code === "23502") {
          throw new Error("A required field is missing. Details: " + insertError.message);
        }
        throw new Error("Registration failed: " + insertError.message + (insertError.hint ? " (Hint: " + insertError.hint + ")" : "") + " [Code: " + insertError.code + "]");
      }

      setRefNumber(reference);
      setSuccess(true);
      console.log("[BlueData Hub] Registration successful! Reference:", reference);
    } catch (err: any) {
      console.error("[BlueData Hub] Registration failed FULL:", err);
      console.error("[BlueData Hub] Error type:", typeof err);
      console.error("[BlueData Hub] Error keys:", Object.keys(err || {}).join(", "));
      const msg = err?.message
        ? String(err.message)
        : "Sorry, your registration could not be submitted. Please try again or email info@deemarineanalytics.ca.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Welcome to the BlueData Hub!</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Thank you for registering for the DMA BlueData Hub — DeeMarine Analytics' collaborative maritime data and innovation ecosystem. Your registration has been successfully received.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-sm mx-auto">
          <p className="text-sm text-slate-500 mb-1">Your Registration Reference</p>
          <p className="text-2xl font-bold text-blue-600 font-mono tracking-wider">{refNumber}</p>
          <p className="text-xs text-slate-400 mt-2">Save this reference number for future communication</p>
        </div>
        <div className="text-sm text-slate-500 space-y-1">
          <p>Mode: <strong>Global & Virtual</strong></p>
          <p>Format: <strong>Project-Based Collaboration</strong></p>
          <p className="mt-2 text-xs">You will receive further details about your Project Lab and onboarding via email.</p>
        </div>
        <p className="text-xs text-slate-400">Sea to Screen — Transforming Maritime Data into Better Decisions.</p>
      </div>
    );
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(formData.full_name && formData.email && formData.whatsapp && formData.country);
      case 2:
        return !!(formData.maritime_background && formData.analytics_level);
      case 3:
        return !!(formData.first_department_choice && formData.internship_motivation);
      case 4:
        return !!(formData.privacy_consent && formData.terms_consent);
      default:
        return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Step {step} of {totalSteps}</span>
          <span className="text-xs text-slate-400">{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          {stepLabels.map((label, i) => (
            <span key={label} className={`text-xs ${i + 1 <= step ? "text-blue-600 font-medium" : "text-slate-400"}`}>{label}</span>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" /> Personal Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" name="full_name" placeholder="Your full name" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+1 555 123 4567" value={formData.whatsapp} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" name="country" placeholder="Your country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input id="linkedin_url" name="linkedin_url" placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedin_url} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral_source">How did you hear about us?</Label>
              <Select value={formData.referral_source} onValueChange={(v) => setFormData((p) => ({ ...p, referral_source: v }))}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {REFERRAL_SOURCES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Background & Analytics */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-600" /> Background & Analytics Experience
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_status">Current Occupation</Label>
              <Input id="current_status" name="current_status" placeholder="e.g. Student, Data Analyst, Marine Engineer" value={formData.current_status} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input id="organization" name="organization" placeholder="Your organization or university" value={formData.organization} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritime_background">Maritime Background *</Label>
            <Textarea id="maritime_background" name="maritime_background" placeholder="Describe your maritime experience, roles, and key achievements..." rows={3} value={formData.maritime_background} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Analytics Proficiency Level *</Label>
            <Select required value={formData.analytics_level} onValueChange={(v) => setFormData((p) => ({ ...p, analytics_level: v }))}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
                {ANALYTICS_LEVELS.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Analytics Tools You Use <span className="text-xs text-slate-400">(select all that apply)</span></Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ANALYTICS_TOOLS.map((tool) => (
                <label key={tool} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-colors ${formData.analytics_tools.includes(tool) ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  <Checkbox checked={formData.analytics_tools.includes(tool)} onCheckedChange={() => toggleTool(tool)} />
                  {tool}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Interests & Motivation */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" /> Interests & Motivation
          </h3>
          <div className="space-y-2">
            <Label>Preferred Project Lab *</Label>
            <Select required value={formData.first_department_choice} onValueChange={(v) => setFormData((p) => ({ ...p, first_department_choice: v }))}>
              <SelectTrigger><SelectValue placeholder="Select your preferred lab" /></SelectTrigger>
              <SelectContent>
                {projectLabs.map((lab) => (<SelectItem key={lab.name} value={lab.name}>{lab.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Primary Interests <span className="text-xs text-slate-400">(select all that apply)</span></Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRIMARY_INTERESTS.map((interest) => (
                <label key={interest} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-colors ${formData.primary_interests.includes(interest) ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  <Checkbox checked={formData.primary_interests.includes(interest)} onCheckedChange={() => toggleInterest(interest)} />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio Link</Label>
              <Input id="portfolio_url" name="portfolio_url" placeholder="Link to your portfolio" value={formData.portfolio_url} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub Profile</Label>
              <Input id="github_url" name="github_url" placeholder="https://github.com/yourprofile" value={formData.github_url} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="internship_motivation">Why do you want to join the BlueData Hub? *</Label>
            <Textarea id="internship_motivation" name="internship_motivation" placeholder="Tell us what motivates you and what you hope to contribute..." rows={4} value={formData.internship_motivation} onChange={handleChange} required />
          </div>
        </div>
      )}

      {/* Step 4: Consent */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" /> Privacy & Consent
          </h3>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={formData.privacy_consent} onCheckedChange={(c) => setFormData((p) => ({ ...p, privacy_consent: c === true }))} className="mt-0.5" />
                <span className="text-sm text-slate-600">I consent to DeeMarine Analytics storing my personal information for BlueData Hub membership, project assignment, communication, and programme administration. *</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={formData.terms_consent} onCheckedChange={(c) => setFormData((p) => ({ ...p, terms_consent: c === true }))} className="mt-0.5" />
                <span className="text-sm text-slate-600">I agree to the terms and conditions of the DMA BlueData Hub. *</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={formData.marketing_consent} onCheckedChange={(c) => setFormData((p) => ({ ...p, marketing_consent: c === true }))} className="mt-0.5" />
                <span className="text-sm text-slate-600">I agree to receive information about future DeeMarine programmes and opportunities. <span className="text-slate-400">(optional)</span></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="cursor-pointer">
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
        ) : (
          <div />
        )}
        {step < totalSteps ? (
          <Button type="button" onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" disabled={!canProceed()}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={submitting || !canProceed()} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Registering..." : "Join the Hub"}
          </Button>
        )}
      </div>
    </form>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">FAQ</Badge>
          <h2 className="text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-0">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-4 text-left cursor-pointer">
                  <span className="font-medium text-slate-900 text-sm pr-4">{faq.q}</span>
                  <HelpCircle className={`h-5 w-5 text-blue-600 shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openIndex === index && (<div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed">{faq.a}</div>)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Get in Touch</Badge>
          <h2 className="text-slate-900">Have Questions?</h2>
          <p className="text-slate-600 mt-4">
            Reach out to our team for any questions about the BlueData Hub, membership, or project opportunities.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <a href="mailto:info@deemarineanalytics.ca" className="text-blue-600 text-sm font-medium hover:underline">
                info@deemarineanalytics.ca
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <a href="tel:+19025370926" className="text-blue-600 text-sm font-medium hover:underline">
                +1 902 537 0926
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-slate-600 text-sm">Nova Scotia, Canada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}