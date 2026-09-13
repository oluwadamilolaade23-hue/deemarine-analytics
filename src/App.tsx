import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Institute from "@/pages/Institute";
import Projects from "@/pages/Projects";
import Awards from "@/pages/Awards";
import Partnerships from "@/pages/Partnerships";
import Community from "@/pages/Community";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Internship from "@/pages/Internship";
import AdminInternship from "@/pages/AdminInternship";
import { PortalAuthProvider, usePortalAuth } from "@/portal/PortalAuth";
import { PortalLogin } from "@/portal/PortalLogin";
import { PortalWelcome } from "@/portal/PortalWelcome";
import { PortalLayout } from "@/portal/PortalLayout";
import { PortalDashboard } from "@/portal/PortalDashboard";
import { PortalProgramme, PortalSessions, PortalAnnouncements, PortalResources, PortalSupport, PortalProfile } from "@/portal/PortalPages";
import { PortalLearning, PortalProjectLab, PortalTeam, PortalAssignments } from "@/portal/PortalProject";
import { PortalSkillPassport, PortalProgress, PortalPortfolio } from "@/portal/PortalSkills";
import { PortalAdmin } from "@/portal/PortalAdmin";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { participant, loading } = usePortalAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div>;
  if (!participant) return <Navigate to="/portal/login" replace />;
  return <>{children}</>;
}

function PortalRoutes() {
  const { participant, isFirstLogin } = usePortalAuth();
  if (participant && isFirstLogin) return <PortalWelcome />;
  return (
    <ProtectedRoute>
      <PortalLayout />
    </ProtectedRoute>
  );
}

function RedirectToNewPortal() {
  useEffect(() => {
    window.location.replace("https://institute.deemarineanalytics.ca/portal");
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] text-white">
      <div className="text-center space-y-4 p-8">
        <p className="text-xl font-medium text-blue-200">Redirecting to BlueData Hub Portal...</p>
        <p className="text-slate-400 text-sm">Please wait while we transfer you to the operational portal.</p>
        <div className="pt-2">
          <a
            href="https://institute.deemarineanalytics.ca/portal"
            className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* BlueData Hub Fellow Portal redirect to operational staging portal */}
          <Route path="/portal/login" element={<RedirectToNewPortal />} />
          {/* Portal admin */}
          <Route path="/portal/admin" element={
            <PortalAuthProvider>
              <PortalAdmin />
            </PortalAuthProvider>
          } />
          {/* Legacy portal routes redirect */}
          <Route path="/portal" element={<RedirectToNewPortal />} />
          <Route path="/portal/*" element={<RedirectToNewPortal />} />

          {/* Main site routes (with header/footer) */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/institute" element={<Institute />} />
                  <Route path="/dma-bluedata-hub" element={<Internship />} />
                  <Route path="/internship" element={<Internship />} />
                  <Route path="/dma-internship/apply" element={<Internship />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/awards" element={<Awards />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/bluedata-hub" element={<AdminInternship />} />
                  <Route path="/admin/internships" element={<AdminInternship />} />
                  <Route path="/admin/dma-internship" element={<AdminInternship />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;