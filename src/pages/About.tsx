import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Eye, Compass, Anchor } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">About DeeMarine Analytics</h1>
            <p className="text-slate-300 text-xl leading-relaxed">
              A global maritime intelligence, engineering, and technology company supporting the blue economy through data analytics, business intelligence, AI skills optimization, training, and maritime decision intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 p-8 bg-blue-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-slate-900">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To empower maritime organizations with practical data solutions that improve safety, efficiency, sustainability, compliance, and business performance.
              </p>
            </div>
            <div className="space-y-6 p-8 bg-slate-50 rounded-2xl">
              <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center">
                <Eye className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-slate-900">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To become a leading maritime analytics and digital innovation company supporting the global blue economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <h2 className="text-slate-900 text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Compass className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Practical Innovation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We focus on solutions that work in real maritime environments, not just in theory.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Anchor className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Maritime Expertise</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our team combines deep maritime industry knowledge with modern data analytics capabilities.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Impact-Driven</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every project and programme is designed to create measurable impact for maritime organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="/assets/founder-portrait.png"
                alt="Oluwadamilola Adebamipe - Founder & CEO"
                className="rounded-2xl shadow-lg w-full object-cover aspect-[3/4] max-h-[500px]"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-slate-900">Meet Our Founder</h2>
              <h3 className="text-blue-600 font-semibold">Oluwadamilola Adebamipe</h3>
              <p className="text-slate-500 font-medium">
                Founder & CEO, DeeMarine Analytics
              </p>
              <p className="text-slate-600 leading-relaxed">
                Marine Engineer | Port & Logistics Professional | Maritime Data Analyst | Maritime Educator
              </p>
              <p className="text-slate-600 leading-relaxed">
                With extensive experience across port operations, marine engineering, logistics, lecturing, and data analytics, Oluwadamilola founded DeeMarine Analytics to bridge the gap between maritime operations and data-driven decision making.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Her vision is to empower maritime professionals and organizations with practical digital skills and analytics solutions that drive real operational improvements across the blue economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-white mb-4">Let's Work Together</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Whether you need data analytics, training, or digital innovation support, we're here to help your maritime organization thrive.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer">
            <Link to="/contact">Get In Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}