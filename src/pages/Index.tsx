import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroAnimation from "@/components/HeroAnimation";
import {
  BarChart3,
  Ship,
  GraduationCap,
  Globe,
  Anchor,
  Leaf,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: BarChart3,
    title: "Maritime Data Analytics",
    description: "Fleet performance, port operations, voyage analysis, and executive reporting.",
  },
  {
    icon: Ship,
    title: "Fleet Performance & Planned & Preventive Maintenance",
    description: "Downtime analysis, planned and preventive maintenance insights, and equipment reliability.",
  },
  {
    icon: Leaf,
    title: "Fuel & Energy Consumption and Carbon Emissions",
    description: "Fuel and energy monitoring, emissions tracking, CII/EEXI awareness, and sustainability reporting.",
  },
  {
    icon: Anchor,
    title: "Port Operations & Logistics Analytics",
    description: "Berth performance, cargo flow, dwell time, and port KPI dashboards.",
  },
  {
    icon: Shield,
    title: "Maritime Cybersecurity",
    description: "Data security awareness, risk monitoring, and intelligence reporting.",
  },
  {
    icon: AlertTriangle,
    title: "Safety Performance",
    description: "Safety KPI tracking, incident analysis, compliance monitoring, and safety reporting dashboards.",
  },
  {
    icon: TrendingUp,
    title: "DeeMarine Navigator",
    description: "Maritime decision intelligence platform for connected operational dashboards.",
  },
];

const programmes = [
  "Certified Maritime Data Analyst Programme",
  "Maritime Security Data Analytics & Intelligence",
  "Port Performance Analytics",
  "Fleet Performance Analytics",
];

const projects = [
  {
    title: "Green Port Intelligence Platform",
    description: "Smart ports, sustainability, and operational visibility.",
  },
  {
    title: "DeeMarine Navigator",
    description: "Maritime SaaS dashboard for fleet, port, and emissions.",
  },
  {
    title: "Smart Port Dashboard",
    description: "Berth performance, vessel calls, and port efficiency.",
  },
];

export default function Index() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0f2744] text-white">
        <div className="absolute inset-0 hero-gradient-shift" />
        <div className="container-max section-padding relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 hero-animate-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Sea to Screen</span>
              </div>
              <h1 className="text-white leading-tight">
                Maritime Decisions<br />
                <span className="text-blue-400">Powered by Data</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-xl">
                DeeMarine Analytics helps maritime organizations transform operational data into actionable insights for efficiency, safety, compliance, sustainability, and business performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hero-btn-glow">
                  <Link to="/services">Explore Our Services</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-500/20 hover:text-white cursor-pointer hero-btn-glow">
                  <Link to="/institute">Join DMA Institute</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-500/20 hover:text-white cursor-pointer hero-btn-glow">
                  <Link to="/projects">View Projects</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-500/20 hover:text-white cursor-pointer hero-btn-glow">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="hero-dashboard-fade">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-slate-900">Who We Are</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                DeeMarine Analytics is a global maritime intelligence, engineering, and technology company supporting the blue economy through data analytics, business intelligence, AI skills optimization, training, and maritime decision intelligence.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We bridge the gap between maritime operations and data-driven decision making, helping organizations across the maritime industry harness the power of their operational data.
              </p>
              <Button asChild variant="outline" className="cursor-pointer">
                <Link to="/about" className="flex items-center gap-2">
                  Learn More About Us <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-6 space-y-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Data Analytics</h4>
                <p className="text-sm text-slate-600">Transforming maritime data into insights</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 space-y-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Training</h4>
                <p className="text-sm text-slate-600">Practical skills for maritime professionals</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 space-y-2">
                <Globe className="h-8 w-8 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Innovation</h4>
                <p className="text-sm text-slate-600">Digital solutions for the blue economy</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 space-y-2">
                <Users className="h-8 w-8 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Community</h4>
                <p className="text-sm text-slate-600">Building maritime tech talent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-slate-900 mb-4">What We Do</h2>
            <p className="text-slate-600 text-lg">
              We provide maritime data analytics, training, research, and digital innovation services to organizations across the blue economy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Training */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1323837/2026-06-29/rp5seoicaika/dma-institute-training.png"
                alt="DMA Institute training session"
                className="rounded-2xl shadow-lg w-full object-cover aspect-video"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 text-sm font-medium">DMA Institute</span>
              </div>
              <h2 className="text-slate-900">Featured Training Programmes</h2>
              <p className="text-slate-600 leading-relaxed">
                Practical maritime technology and data training designed to equip maritime professionals with digital and analytics skills.
              </p>
              <ul className="space-y-3">
                {programmes.map((prog) => (
                  <li key={prog} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                    <span className="text-slate-700 font-medium">{prog}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                <Link to="/institute">Explore DMA Institute</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-slate-900 mb-4">Featured Projects</h2>
            <p className="text-slate-600 text-lg">
              Building practical data solutions for the maritime industry.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.title} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                  <p className="text-slate-600 text-sm">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="cursor-pointer">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max text-center">
          <h2 className="text-white mb-6">Our Impact</h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-12">
            Supporting maritime organizations in their digital transformation journey through data analytics, practical training, and innovative solutions.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">Analytics</div>
              <p className="text-slate-400 text-sm">Data-driven maritime insights</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">Training</div>
              <p className="text-slate-400 text-sm">Practical professional development</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">Innovation</div>
              <p className="text-slate-400 text-sm">Digital solutions for blue economy</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">Community</div>
              <p className="text-slate-400 text-sm">Building maritime tech talent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="text-slate-900 mb-4">Ready to Transform Your Maritime Data?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
            Let's learn, analyze and transform together. Get in touch to discuss how DeeMarine Analytics can support your organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="cursor-pointer">
              <Link to="/partnerships">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}