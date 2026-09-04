import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  Globe,
  Compass,
  Sparkles,
  Ship,
  BookOpen,
} from "lucide-react";

const initiatives = [
  {
    icon: GraduationCap,
    title: "Maritime Graduates & Early Career Professionals",
    description:
      "Helping students and recent graduates bridge the gap between education and industry through practical training, mentorship, and career development opportunities.",
  },
  {
    icon: Ship,
    title: "Seafarers Transitioning into Technology",
    description:
      "Supporting seafarers who want to combine their operational experience with digital skills, data analytics, business intelligence, and emerging maritime technologies.",
  },
  {
    icon: Users,
    title: "Maritime Professionals & Industry Leaders",
    description:
      "Creating opportunities for professionals across shipping, ports, logistics, marine engineering, offshore operations, and maritime administration to collaborate, exchange ideas, and embrace digital innovation.",
  },
  {
    icon: Sparkles,
    title: "Youth Maritime Technology Education",
    description:
      "Introducing young people to the exciting opportunities at the intersection of maritime, technology, artificial intelligence, and data, helping inspire the next generation of maritime innovators.",
  },
  {
    icon: BookOpen,
    title: "High School Maritime Technology Mentorship",
    description:
      "Providing mentorship, career guidance, and technology awareness programmes for secondary school students interested in maritime careers and the blue economy.",
  },
  {
    icon: Globe,
    title: "African Blue Economy Talent Development",
    description:
      "Supporting talent development across Africa by promoting digital skills, innovation, research, and international collaboration within the maritime sector.",
  },
  {
    icon: Compass,
    title: "Maritime Data Challenges & Community Learning",
    description:
      "Encouraging collaborative learning through webinars, workshops, case studies, industry discussions, practical projects, and maritime data challenges that promote continuous professional development.",
  },
];

export default function Community() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Community & Mentorship</h1>
            <p className="text-slate-300 text-xl leading-relaxed">
              At DeeMarine Analytics, we believe that the future of the maritime
              industry will be shaped by collaboration, continuous learning,
              innovation, and knowledge sharing. Beyond delivering analytics and
              training solutions, we are committed to building a global community
              where maritime professionals can connect, grow, and lead digital
              transformation across the blue economy.
            </p>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 mb-4">Our Community Initiatives</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              We are building an inclusive maritime technology community that
              supports professionals at every stage of their journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {initiatives.map((initiative) => (
              <Card
                key={initiative.title}
                className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <initiative.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {initiative.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {initiative.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-slate-50">
        <div className="container-max text-center max-w-3xl mx-auto">
          <h2 className="text-slate-900 mb-6">
            Let's Learn, Analyze and Transform Together
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            Whether you're a seafarer, marine engineer, port professional,
            logistics specialist, maritime graduate, researcher, educator,
            student, or industry leader, there's a place for you in the
            DeeMarine Analytics community.
          </p>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Together, we're building a smarter, more connected, and more
            data-driven maritime industry.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <a
              href="https://chat.whatsapp.com/K6uFQ7CzR1F5051W5ZQlgs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Our Community
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}