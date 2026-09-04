import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Ship,
  Leaf,
  Anchor,
  GraduationCap,
  Recycle,
} from "lucide-react";

const projects = [
  {
    icon: Leaf,
    title: "Green Port Intelligence Platform",
    category: "Sustainability",
    description: "A decision intelligence project focused on smart ports, sustainability, port KPIs, emissions, and operational visibility. Designed to help port authorities make data-driven decisions for environmental compliance and operational efficiency.",
    tags: ["Smart Ports", "Sustainability", "KPIs", "Emissions"],
  },
  {
    icon: BarChart3,
    title: "DeeMarine Navigator",
    category: "SaaS Platform",
    description: "DeeMarine Analytics' maritime intelligence platform for fleet, port, maintenance, emissions, safety, and executive reporting. Connecting operational data sources into unified decision intelligence dashboards.",
    tags: ["Fleet", "Port", "Emissions", "Executive Reporting"],
  },
  {
    icon: Anchor,
    title: "Smart Port Dashboard",
    category: "Analytics",
    description: "A dashboard project using realistic port data to analyze berth performance, vessel calls, cargo flow, dwell time, and port efficiency. Built with Power BI and real-world maritime datasets.",
    tags: ["Berth Performance", "Vessel Calls", "Cargo Flow", "Dwell Time"],
  },
  {
    icon: Ship,
    title: "Fleet Performance Dashboard",
    category: "Analytics",
    description: "A dashboard for vessel performance, maintenance, fuel, emissions, and operational KPIs. Helping fleet managers track and optimize vessel operations in real time.",
    tags: ["Vessel Performance", "Maintenance", "Fuel", "KPIs"],
  },
  {
    icon: GraduationCap,
    title: "Maritime Training Outcome Dashboard",
    category: "Education",
    description: "A system for tracking student registration, attendance, completion, capstone projects, certificates, and graduate outcomes. Measuring the impact of maritime training programmes.",
    tags: ["Registration", "Attendance", "Certificates", "Outcomes"],
  },
  {
    icon: Recycle,
    title: "Blue Cycle Analytics",
    category: "Environment",
    description: "An environmental and circular economy analytics initiative focused on waste, sustainability, port environment, and blue economy impact. Supporting the transition to sustainable maritime operations.",
    tags: ["Circular Economy", "Waste", "Sustainability", "Blue Economy"],
  },
];

export default function Projects() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-white">Our Projects</h1>
              <p className="text-slate-300 text-xl leading-relaxed">
                Building practical data solutions and intelligence platforms for the maritime industry and blue economy.
              </p>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1323837/2026-06-29/rp5se3iaaijq/projects-smart-port.png"
                alt="Smart port with data visualization"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.title} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <project.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100">
                      {project.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs text-slate-500 border-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-slate-50">
        <div className="container-max text-center">
          <h2 className="text-slate-900 mb-4">Interested in Collaborating?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
            We're always looking for partners to collaborate on maritime data projects and research initiatives.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
            <Link to="/partnerships">Explore Partnerships</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}