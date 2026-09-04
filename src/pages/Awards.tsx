import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Star,
  Users,
  BookOpen,
  Globe,
  Heart,
  Rocket,
  Shield,
} from "lucide-react";

const milestones = [
  {
    icon: Award,
    title: "Mitacs Business Strategy Internship",
    description: "Project recognition through the Mitacs Business Strategy Internship programme, supporting research and innovation in maritime analytics.",
    type: "Recognition",
  },
  {
    icon: BookOpen,
    title: "NSCC Lab to Market / TRLUP",
    description: "Involvement in the NSCC Lab to Market and Technology Readiness Level-Up Programme, advancing maritime technology solutions.",
    type: "Engagement",
  },
  {
    icon: Star,
    title: "ECO Canada Certification Pathway",
    description: "Engagement with ECO Canada training certification pathway, supporting environmental and sustainability professional development.",
    type: "Pathway",
  },
  {
    icon: Globe,
    title: "Ocean Alliance Canada",
    description: "Involvement with Ocean Alliance Canada, contributing to the Canadian ocean technology and blue economy ecosystem.",
    type: "Collaboration",
  },
  {
    icon: Shield,
    title: "CIMarE Membership",
    description: "Membership with the Chartered Institute of Marine Engineering, Science and Technology (CIMarE), maintaining professional standards.",
    type: "Membership",
  },
  {
    icon: Users,
    title: "MARPRO Forum",
    description: "Community engagement with MARPRO Forum, a maritime professional community supporting mentorship, knowledge sharing, and professional development across the maritime industry.",
    type: "Engagement",
  },
  {
    icon: Heart,
    title: "Women in Maritime & Blue Economy",
    description: "Community engagement supporting women in maritime and blue economy, promoting diversity and inclusion in the industry.",
    type: "Engagement",
  },
  {
    icon: Users,
    title: "Maritime Mentorship & Youth Advocacy",
    description: "Active involvement in maritime mentorship and youth technology advocacy, inspiring the next generation of maritime professionals.",
    type: "Advocacy",
  },
  {
    icon: Rocket,
    title: "DeeMarine Analytics Launch",
    description: "Milestone launch of DeeMarine Analytics as a global maritime intelligence, engineering, and technology company serving the blue economy.",
    type: "Milestone",
  },
];

export default function Awards() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Awards & Recognition</h1>
            <p className="text-slate-300 text-xl leading-relaxed">
              Milestones, recognitions, and engagements that reflect our commitment to maritime innovation and community development.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-6">
            {milestones.map((milestone) => (
              <Card key={milestone.title} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <milestone.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs">
                      {milestone.type}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{milestone.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}