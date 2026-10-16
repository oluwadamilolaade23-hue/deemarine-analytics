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
    title: "GreenPort IQ — In Development",
    description: "Developing data insights for port operations and emissions. MVP scoping and data-source research are underway.",
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
          <article id="greenport-iq" aria-labelledby="greenport-heading" className="mb-10 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm scroll-mt-24">
            <figure className="relative bg-slate-900">
              <div className="grid md:grid-cols-[2fr_1fr] gap-1">
              <img src="https://images.unsplash.com/photo-1770068511943-aad3cc27860d?auto=format&amp;fit=crop&amp;w=1200&amp;q=85" alt="Container ship and cargo cranes at the Port of Vancouver, Canada" width="1600" height="720" loading="lazy" className="h-64 md:h-96 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1769144256227-5185141c3aca?auto=format&amp;fit=crop&amp;w=800&amp;q=85" alt="Aerial view of colourful shipping containers at the Port of Vancouver" width="800" height="720" loading="lazy" className="hidden md:block h-96 w-full object-cover" />
              </div>
              <figcaption className="px-6 py-3 text-xs text-slate-300">Port of Vancouver • Illustrative port photography; not a GreenPort IQ deployment. Photos: <a className="underline hover:text-white" href="https://unsplash.com/photos/A0IOJ34brD0" target="_blank" rel="noopener noreferrer">Daniel Miksha / Unsplash</a></figcaption>
            </figure>
            <div className="grid lg:grid-cols-2">
              <div className="bg-[#0f2744] p-6 md:p-10 text-white space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
                  <Leaf className="h-4 w-4" aria-hidden="true" /> In Development
                </div>
                <p className="text-sm font-semibold tracking-widest uppercase text-slate-300">Innovation &amp; Projects</p>
                <h3 id="greenport-heading" className="text-3xl md:text-4xl font-bold text-white">GreenPort IQ</h3>
                <p className="text-lg text-emerald-200">Better port decisions, powered by data.</p>
                <p className="text-slate-300 leading-relaxed">
                  DeeMarine Analytics is developing GreenPort IQ to help ports understand operational performance and emissions through data.
                </p>
                <Button asChild className="bg-emerald-400 hover:bg-emerald-300 text-slate-950">
                  <a href="mailto:info@deemarineanalytics.ca?subject=GreenPort%20IQ%20pilot%20enquiry">Express Interest in Testing <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
                </Button>
                <p className="text-xs text-slate-400">Pilot interest enquiries are welcome. Testing dates and access will be confirmed as development progresses.</p>
              </div>
              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h4 className="text-xl font-semibold text-slate-900">Development progress</h4>
                  <p className="text-xs text-slate-500">Updated <time dateTime="2026-10-16">16 October 2026</time></p>
                </div>
                <ul className="space-y-5">
                  <li className="border-l-2 border-emerald-500 pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Current focus</p>
                    <p className="font-semibold text-slate-900 mt-1">Defining the first MVP</p>
                    <p className="text-sm text-slate-600 mt-1">Scoping the first version around port performance and emissions insights.</p>
                  </li>
                  <li className="border-l-2 border-blue-400 pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Research underway</p>
                    <p className="font-semibold text-slate-900 mt-1">Exploring relevant data sources</p>
                    <p className="text-sm text-slate-600 mt-1">Assessing available datasets and how they could support a practical port analytics solution.</p>
                  </li>
                  <li className="border-l-2 border-slate-200 pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next step</p>
                    <p className="font-semibold text-slate-900 mt-1">Exploring pilot opportunities</p>
                    <p className="text-sm text-slate-600 mt-1">Welcoming conversations with ports, researchers and potential collaborators to help shape a future pilot.</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 p-6 md:p-10">
              <h4 className="text-xl font-semibold text-slate-900">What we are working towards</h4>
              <p className="mt-2 text-slate-600">Designed for port and terminal teams, sustainability professionals and maritime researchers who need a clearer view of their data. Planned capabilities will be refined through research and pilot feedback.</p>
              <div className="mt-6 grid md:grid-cols-3 gap-6">
                <div><Anchor className="h-6 w-6 text-blue-600 mb-3" aria-hidden="true" /><h5 className="font-semibold text-slate-900">Understand port performance</h5><p className="mt-2 text-sm text-slate-600">Explore vessel calls, turnaround times and operational patterns to help identify areas for improvement.</p></div>
                <div><Leaf className="h-6 w-6 text-emerald-600 mb-3" aria-hidden="true" /><h5 className="font-semibold text-slate-900">Build emissions visibility</h5><p className="mt-2 text-sm text-slate-600">Investigate how operational and energy data can support emissions estimates and sustainability decisions.</p></div>
                <div><BarChart3 className="h-6 w-6 text-blue-600 mb-3" aria-hidden="true" /><h5 className="font-semibold text-slate-900">Turn data into clear insights</h5><p className="mt-2 text-sm text-slate-600">Bring useful indicators into an accessible dashboard to support discussion, planning and future pilot evaluation.</p></div>
              </div>
              <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-100 p-5">
                <h5 className="font-semibold text-slate-900">Help shape GreenPort IQ</h5>
                <p className="mt-2 text-sm text-slate-700">Tell us about your port, your operational or sustainability challenges, and the datasets you work with. We welcome prospective pilot participants, data collaborators and research partners.</p>
                <Link to="/contact?subject=GreenPort%20IQ%20collaboration" className="mt-3 inline-flex items-center gap-2 font-semibold text-emerald-800 underline">Contact the GreenPort IQ team <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 p-6 md:px-10">
              <h4 className="text-lg font-semibold text-slate-900">Project acknowledgements</h4>
              <p className="mt-2 text-sm text-slate-600">GreenPort IQ acknowledges sponsorship from Mitacs and the support of Nova Scotia Community College (NSCC).</p>
              <div className="mt-5 flex flex-wrap gap-6">
                <a href="https://www.mitacs.ca/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white p-6 min-w-48"><img src="https://www.mitacs.ca/wp-content/uploads/2023/11/Mitacs_logo_blue.png" alt="Mitacs" loading="lazy" className="h-12 w-40 object-contain object-left" /><span className="mt-4 block text-sm text-slate-600">Project sponsor</span></a>
                <a href="https://www.nscc.ca/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white p-6 min-w-48"><img src="https://www.nscc.ca/img/aboutnscc/visual-identity-guidelines/artwork/nscc-logo.png" alt="Nova Scotia Community College (NSCC)" loading="lazy" className="h-12 w-40 object-contain object-left" /><span className="mt-4 block text-sm text-slate-600">Project support</span></a>
              </div>
            </div>
          </article>
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


      {/* Maritime Intelligence */}
      <section className="section-padding bg-[#071d3b] text-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-400/10 border border-cyan-300/25 rounded-full text-cyan-200 text-sm font-medium">
                <BarChart3 className="h-4 w-4" />
                Weekly Maritime Intelligence
              </div>
              <h2 className="text-white">From maritime developments to decision intelligence.</h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                Follow DeeMarine's weekly intelligence across Canada, the United States, Europe and West Africa. We structure maritime news into data, verify the sources, identify risk and opportunity signals, and translate the developments into practical industry insight.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-blue-100">
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20">Ports & Infrastructure</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20">Trade & Logistics</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20">Energy Transition</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20">Safety & Security</span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20">Digitalisation</span>
              </div>
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
                <Link to="/maritime-intelligence" className="flex items-center gap-2">
                  Explore Maritime Intelligence <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-blue-400/25 bg-gradient-to-br from-[#0b2b56] to-[#0d4775] p-6 md:p-8 shadow-2xl">
              <div className="text-cyan-300 text-sm font-semibold mb-2">DEEMARINE INTELLIGENCE FLOW</div>
              <div className="text-2xl md:text-3xl font-bold leading-tight mb-5">NEWS → DATA → SIGNAL → IMPACT → INSIGHT → DECISION</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Updated weekly with sourced developments, interactive filters, regional analysis, strategic themes, risk and opportunity signals, and DeeMarine's decision-intelligence brief.
              </p>
              <div className="mt-6 pt-5 border-t border-white/10 text-xs text-slate-400">
                Original dashboard design by <span className="text-cyan-200 font-semibold">Engr. Olumide</span>
              </div>
            </div>
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