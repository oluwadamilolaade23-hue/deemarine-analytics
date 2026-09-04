import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Globe, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const subjects = [
  "Maritime Data Analytics",
  "Fleet Performance & Planned & Preventive Maintenance",
  "Fuel & Energy Consumption and Carbon Emissions",
  "Port Operations & Logistics Analytics",
  "Maritime Cybersecurity",
  "Safety Performance",
  "DMA Institute Training",
  "Partnership Opportunity",
  "DeeMarine Navigator",
  "Other",
];

interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
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

    const insertPayload = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      organization: formData.organization || null,
      subject: selectedSubject,
      message: formData.message,
      status: "New",
    };

    console.log("=== Contact Form Submission Start ===");
    console.log("Inserting into table: contact_messages");
    console.log("Insert payload:", JSON.stringify(insertPayload, null, 2));

    try {
      const result = await supabase
        .from("contact_messages")
        .insert([insertPayload]);

      console.log("Full Supabase response:", JSON.stringify(result, null, 2));

      if (result.error) {
        const sbErr = result.error;
        console.error("Supabase insert error object:", sbErr);
        console.error("Error message:", sbErr.message);
        console.error("Error code:", sbErr.code);
        console.error("Error details:", sbErr.details);
        console.error("Error hint:", sbErr.hint);
        throw sbErr;
      }

      console.log("Contact message saved successfully (error === null).");
      setSuccess(true);
    } catch (err) {
      console.error("Contact form submission failed. Full error:", err);
      setError(
        "Sorry, we couldn't submit your enquiry at this time. Please contact us directly at info@deemarineanalytics.ca."
      );
    } finally {
      setSubmitting(false);
      console.log("=== Contact Form Submission End ===");
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      organization: "",
      subject: "",
      message: "",
    });
    setSelectedSubject("");
  };

  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-[#0f2744] text-white">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Contact Us</h1>
            <p className="text-slate-300 text-xl leading-relaxed">
              Ready to transform your maritime data into actionable insights? Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-slate-900 font-semibold mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <a href="mailto:info@deemarineanalytics.ca" className="text-slate-900 font-medium hover:text-blue-600 transition-colors">
                        info@deemarineanalytics.ca
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <a href="tel:+19025370926" className="text-slate-900 font-medium hover:text-blue-600 transition-colors">
                        +1 902 537 0926
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="text-slate-900 font-medium">Nova Scotia, Canada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Website</p>
                      <p className="text-slate-900 font-medium">www.deemarineanalytics.ca</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-8">
                  {success ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">Enquiry Received</h3>
                      <p className="text-slate-600">
                        Thank you for contacting DeeMarine Analytics. Your enquiry has been received successfully. A member of our team will respond as soon as possible.
                      </p>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="cursor-pointer mt-4"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
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
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 555 123 4567"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization / Company (Optional)</Label>
                          <Input
                            id="organization"
                            name="organization"
                            placeholder="Your company or organization"
                            value={formData.organization}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          required
                          value={selectedSubject}
                          onValueChange={(value) => {
                            setSelectedSubject(value);
                            setFormData((prev) => ({ ...prev, subject: value }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Brief About Your Enquiry *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us briefly how we can assist you or what you would like to discuss."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
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
                        {submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}