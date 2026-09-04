import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ship, Waves, BarChart3, Activity } from "lucide-react";

const topics = [
  "Maritime Data Analytics",
  "Smart Ports & Digital Transformation",
  "Fleet Performance & Planned & Preventive Maintenance Analytics",
  "Fuel & Energy Consumption and Carbon Emissions",
  "Maritime Cybersecurity",
  "Safety Performance",
  "Shipping & Port Operations",
  "AI Skills Optimization & Business Intelligence for Maritime",
  "Career Development for Maritime Professionals",
  "Blue Economy Innovation",
];

export default function Blog() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Maritime Insights</h1>
            <p className="text-slate-300 text-xl leading-relaxed">
              Practical, research-informed content for maritime professionals, organizations, and aspiring digital leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Subtle background illustration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Ocean waves */}
          <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.04]">
            <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
              <path fill="#2563eb" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
          </div>
          {/* Floating data elements */}
          <div className="absolute top-20 right-10 md:right-32 opacity-[0.06]">
            <BarChart3 className="h-32 w-32 text-blue-600" />
          </div>
          <div className="absolute top-40 left-10 md:left-20 opacity-[0.05]">
            <Activity className="h-24 w-24 text-blue-600" />
          </div>
          <div className="absolute bottom-32 right-20 md:right-48 opacity-[0.05]">
            <Waves className="h-28 w-28 text-blue-600" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
            <Ship className="h-64 w-64 text-blue-800" />
          </div>
        </div>

        <div className="container-max relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Coming Soon Badge */}
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-sm px-4 py-1.5 font-medium">
              Coming Soon
            </Badge>

            {/* Headline */}
            <h2 className="text-slate-900 text-3xl md:text-4xl font-bold">
              Knowledge Hub Coming Soon
            </h2>

            {/* Body Text */}
            <div className="space-y-6 text-left md:text-center">
              <p className="text-slate-600 text-lg leading-relaxed">
                Our Maritime Insights Centre is currently being developed to provide practical, research-informed content for maritime professionals, organizations, and aspiring digital leaders.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Soon, you'll find expert articles, industry insights, case studies, and practical guides covering topics such as:
              </p>
            </div>

            {/* Topics List */}
            <div className="flex flex-wrap justify-center gap-3 py-4">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-700 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Closing paragraph */}
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Our goal is to bridge maritime expertise with data-driven decision-making by sharing practical knowledge that helps the industry work smarter, safer, and more sustainably.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-8">
                <Link to="/contact">Stay Connected</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}