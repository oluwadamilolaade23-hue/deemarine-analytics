import { useState } from "react";
import { Link } from "react-router-dom";
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
  GraduationCap,
  Clock,
  Monitor,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";
import { supabase, supabaseConfig } from "@/lib/supabase";

const courses = [
  "Certified Maritime Data Analyst",
  "Maritime Security Data Analytics & Intelligence",
  "Decarbonisation and Future Shipping",
  "Fleet Performance Analytics",
  "Port Performance Analytics",
  "Maritime Cybersecurity Awareness",
  "Smart Port and Digital Transformation",
];

const targetAudience = [
  "Seafarers",
  "Marine engineers",
  "Deck officers",
  "Port operations professionals",
  "Logistics and supply chain professionals",
  "Maritime graduates",
  "Shipping professionals",
  "Marine surveyors",
  "Maritime safety professionals",
  "Naval and maritime security professionals",
  "Blue economy professionals",
];

const upcomingProgrammes = [
  "Maritime Security Data Analytics & Intelligence",
  "Decarbonisation and Future Shipping",
  "Port Performance Analytics",
  "Fleet Performance Analytics",
  "Maritime Data Reporting for Executives",
  "Maritime Cybersecurity Awareness",
  "Smart Port and Digital Transformation Training",
];

interface RegistrationFormData {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  course: string;
  position: string;
  company: string;
  maritime_experience: string;
  message: string;
  consent: boolean;
}

export default function Institute() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                <GraduationCap className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">DMA Institute</span>
              </div>
              <h1 className="text-white">
                Practical Maritime Technology &amp; Data Training
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                DMA Institute is the training arm of DeeMarine Analytics, designed to equip maritime professionals, graduates, seafarers, port workers, logistics professionals, regulators, and blue economy professionals with practical digital and analytics skills.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  <Link to="/contact">Register Interest</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-500/20 hover:text-white cursor-pointer">
                  <Link to="/contact">Contact DMA Institute</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1323837/2026-06-29/rp5seoicaika/dma-institute-training.png"
                alt="DMA Institute training"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programme */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">Featured Programme</Badge>
            <h2 className="text-slate-900">Certified Maritime Data Analyst Programme</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6 text-center space-y-2">
                <Clock className="h-8 w-8 text-blue-600 mx-auto" />
                <p className="font-semibold text-slate-900">8 Weeks</p>
                <p className="text-sm text-slate-600">80 Hours Total</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6 text-center space-y-2">
                <Monitor className="h-8 w-8 text-blue-600 mx-auto" />
                <p className="font-semibold text-slate-900">Virtual</p>
                <p className="text-sm text-slate-600">Instructor-Led Training</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6 text-center space-y-2">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto" />
                <p className="font-semibold text-slate-900">August 2026</p>
                <p className="text-sm text-slate-600">Start Date</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6 text-center space-y-2">
                <Award className="h-8 w-8 text-blue-600 mx-auto" />
                <p className="font-semibold text-slate-900">Certificate</p>
                <p className="text-sm text-slate-600">+ 6 Months Mentorship</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-slate-900 font-semibold">What You&apos;ll Learn</h3>
              <ul className="space-y-3">
                {["Excel for maritime data analysis", "SQL for database querying", "Power BI for dashboard creation", "Maritime case studies and analytics", "Analytics reporting and presentation", "Practical labs and assignments", "Capstone project and final presentation"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-slate-900 font-semibold">Who Can Register</h3>
              <div className="flex flex-wrap gap-2">
                {targetAudience.map((audience) => (
                  <Badge key={audience} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                    {audience}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Programmes */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <h2 className="text-slate-900 text-center mb-12">Upcoming Programmes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingProgrammes.map((prog) => (
              <Card key={prog} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{prog}</h4>
                    <p className="text-slate-500 text-xs mt-1">Coming soon</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Class Registration Form */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="text-white mb-4">Register for a Class</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Fill out the form below to register for one of our training programmes. We&apos;ll get back to you with next steps.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <RegistrationForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function RegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    course: "",
    position: "",
    company: "",
    maritime_experience: "",
    message: "",
    consent: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!consent) {
      setError("You must agree to the consent checkbox to submit your registration.");
      setSubmitting(false);
      return;
    }

    const insertPayload = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      course: selectedCourse,
      position: formData.position || null,
      company: formData.company || null,
      maritime_experience: formData.maritime_experience || null,
      message: formData.message || null,
      consent: true,
      status: "New",
      email_notification_status: "Pending",
    };

    console.log("=== Supabase Debug Start ===");
    console.log("Supabase URL loaded:", supabaseConfig.urlLoaded, supabaseConfig.url);
    console.log("Supabase Anon Key loaded:", supabaseConfig.keyLoaded, supabaseConfig.keyPrefix);
    console.log("Inserting into table: dma_registrations");
    console.log("Insert payload:", JSON.stringify(insertPayload, null, 2));

    try {
      const result = await supabase
        .from("dma_registrations")
        .insert([insertPayload]);

      console.log("Full Supabase response:", JSON.stringify(result, null, 2));

      if (result.error) {
        const sbErr = result.error;
        console.error("Supabase insert error object:", sbErr);
        console.error("Error message:", sbErr.message);
        console.error("Error code:", sbErr.code);
        console.error("Error details:", sbErr.details);
        console.error("Error hint:", sbErr.hint);
        console.error("Error JSON:", JSON.stringify(sbErr, null, 2));
        throw sbErr;
      }

      console.log("Registration saved successfully (error === null).");
      setSuccess(true);
    } catch (err) {
      console.error("Registration submission failed. Full error:", err);
      setError(
        "Sorry, your registration could not be submitted at this time. Please try again or email info@deemarineanalytics.ca."
      );
    } finally {
      setSubmitting(false);
      console.log("=== Supabase Debug End ===");
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Registration Submitted!</h3>
        <p className="text-slate-600">
          Thank you for registering. We have received your application and our team will contact you shortly.
        </p>
        <Button
          onClick={() => {
            setSuccess(false);
            setFormData({
              full_name: "",
              email: "",
              phone: "",
              country: "",
              course: "",
              position: "",
              company: "",
              maritime_experience: "",
              message: "",
              consent: false,
            });
            setSelectedCourse("");
            setConsent(false);
          }}
          variant="outline"
          className="mt-4 cursor-pointer"
        >
          Submit Another Registration
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Your full name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country / Location *</Label>
          <Input
            id="country"
            name="country"
            placeholder="Your country or location"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="course">Course Selected *</Label>
        <Select
          required
          value={selectedCourse}
          onValueChange={(value) => {
            setSelectedCourse(value);
            setFormData((prev) => ({ ...prev, course: value }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Current Position</Label>
          <Input
            id="position"
            name="position"
            placeholder="e.g. Marine Engineer, Deck Officer"
            value={formData.position}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input
            id="company"
            name="company"
            placeholder="Your company or organization"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="maritime_experience">Maritime Experience</Label>
        <Input
          id="maritime_experience"
          name="maritime_experience"
          placeholder="e.g. 5 years as Deck Officer, 3 years in port operations"
          value={formData.maritime_experience}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Brief About Your Qualifications</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Briefly describe your educational background, professional qualifications, maritime experience, certifications, or any relevant skills that will help us understand your suitability for this programme."
          rows={4}
          value={formData.message}
          onChange={handleChange}
        />
        <p className="text-xs text-slate-500 italic">
          This information helps us better understand your background and tailor the learning experience to your professional needs.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => {
            setConsent(checked === true);
            setFormData((prev) => ({ ...prev, consent: checked === true }));
          }}
          className="mt-1"
        />
        <Label htmlFor="consent" className="text-sm text-slate-600 font-normal leading-relaxed">
          I consent to DeeMarine Analytics storing my personal information to process my registration and contact me regarding this programme. *
        </Label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Register Now"}
      </Button>

    </form>
  );
}