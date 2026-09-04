import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Handshake,
  GraduationCap,
  Award,
  FlaskConical,
  BarChart3,
  Lightbulb,
  Mic,
  Heart,
  Globe,
  Building,
  Ship,
  Cpu,
  BookOpen,
  Landmark,
  Users,
  School,
} from "lucide-react";

const opportunities = [
  { icon: GraduationCap, title: "Training partnerships" },
  { icon: Award, title: "Industry endorsement" },
  { icon: FlaskConical, title: "Research collaboration" },
  { icon: BarChart3, title: "Data dashboard projects" },
  { icon: Lightbulb, title: "Maritime innovation projects" },
  { icon: Mic, title: "Guest lectures and expert sessions" },
  { icon: Heart, title: "Youth and women in maritime technology mentorship" },
  { icon: Globe, title: "Blue economy digital transformation" },
];

const partnerCategories = [
  { icon: Ship, title: "Maritime organizations" },
  { icon: Building, title: "Ports and terminals" },
  { icon: Ship, title: "Shipping companies" },
  { icon: Cpu, title: "Marine technology companies" },
  { icon: BookOpen, title: "Training institutions" },
  { icon: Landmark, title: "Government and regulators" },
  { icon: Users, title: "NGOs and foundations" },
  { icon: Handshake, title: "Industry associations" },
  { icon: School, title: "Universities and colleges" },
];

export default function Partnerships() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-white">Partner With DeeMarine Analytics</h1>
              <p className="text-slate-300 text-xl leading-relaxed">
                We believe in the power of collaboration. Together, we can drive meaningful change across the maritime industry and blue economy.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                <Link to="/contact">Request Partnership Discussion</Link>
              </Button>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1323837/2026-06-29/rp5sfiacaimq/partnerships-collaboration.png"
                alt="Partnership collaboration"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-slate-900 text-center mb-12">Partnership Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunities.map((opp) => (
              <Card key={opp.title} className="border-0 shadow-sm bg-slate-50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                    <opp.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 text-sm">{opp.title}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Categories */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <h2 className="text-slate-900 text-center mb-4">Who We Partner With</h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            We welcome partnerships with organizations across the maritime and blue economy ecosystem.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {partnerCategories.map((cat) => (
              <div key={cat.title} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <cat.icon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-slate-700 font-medium text-sm">{cat.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-white mb-4">Let's Collaborate</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Whether you're a maritime organization, training institution, or technology company, we'd love to explore how we can work together.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer">
            <Link to="/contact">Request Partnership Discussion</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}