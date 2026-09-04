import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Ship,
  Leaf,
  Anchor,
  Shield,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: BarChart3,
    title: "Maritime Data Analytics",
    description: "Transform raw maritime data into actionable business intelligence.",
    features: [
      "Fleet performance analytics",
      "Port operations analytics",
      "Voyage performance analysis",
      "Operational KPI dashboards",
      "Executive reporting",
    ],
  },
  {
    icon: Ship,
    title: "Fleet Performance & Planned & Preventive Maintenance Analytics",
    description: "Optimize fleet operations through data-driven planned and preventive maintenance strategies.",
    features: [
      "Downtime analysis",
      "Planned and preventive maintenance insights",
      "Equipment reliability tracking",
      "Maintenance KPI dashboards",
    ],
  },
  {
    icon: Leaf,
    title: "Fuel & Energy Consumption and Carbon Emissions Analytics",
    description: "Monitor and reduce environmental impact with comprehensive fuel, energy, and emissions tracking.",
    features: [
      "Fuel and energy consumption monitoring",
      "Carbon emissions tracking",
      "CII, EEXI, EEOI awareness",
      "Sustainability reporting",
    ],
  },
  {
    icon: Anchor,
    title: "Port Operations & Logistics Analytics",
    description: "Improve port operations efficiency and logistics performance with data insights.",
    features: [
      "Berth performance",
      "Cargo flow analysis",
      "Dwell time optimization",
      "Turnaround time tracking",
      "Port KPI dashboards",
    ],
  },
  {
    icon: Shield,
    title: "Maritime Cybersecurity & Intelligence Analytics",
    description: "Protect maritime operations with security intelligence and risk monitoring.",
    features: [
      "Maritime data security awareness",
      "Risk monitoring dashboards",
      "Security intelligence reporting",
      "Training for maritime security professionals",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Safety Performance Analytics",
    description: "Monitor and improve maritime safety performance with comprehensive tracking and reporting.",
    features: [
      "Safety KPI tracking",
      "Incident analysis and reporting",
      "Compliance monitoring",
      "Safety performance dashboards",
    ],
  },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Our Services</h1>
            <p className="text-slate-300 text-xl leading-relaxed">
              Comprehensive maritime data analytics and digital innovation services designed to transform how maritime organizations operate and make decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="space-y-8">
            {services.map((service) => (
              <Card key={service.title} className="border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-3 gap-0">
                  <CardHeader className="bg-slate-50 p-8 flex flex-col justify-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <service.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{service.title}</CardTitle>
                    <p className="text-slate-600 text-sm mt-2">{service.description}</p>
                  </CardHeader>
                  <CardContent className="md:col-span-2 p-8">
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DeeMarine Navigator */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 text-sm font-medium">Digital Product</span>
              </div>
              <h2 className="text-slate-900">DeeMarine Navigator</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                DeeMarine Navigator is DeeMarine Analytics' maritime intelligence platform designed to help companies connect operational data and generate dashboards for fleet, port, fuel, emissions, maintenance, safety, and executive reporting.
              </p>
              <ul className="space-y-3">
                {["Fleet Performance & Planned & Preventive Maintenance", "Port Operations & Logistics Analytics", "Fuel & Energy Consumption and Carbon Emissions", "Maritime Cybersecurity", "Safety Performance", "Executive Reporting"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1323837/2026-06-29/rp5sduycaimq/services-maritime-analytics.png"
                alt="DeeMarine Navigator maritime intelligence platform"
                className="rounded-xl w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-white mb-4">Need Maritime Analytics Support?</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Let's discuss how our services can help your organization make better data-driven maritime decisions.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}