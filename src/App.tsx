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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Portal login (needs PortalAuthProvider for usePortalAuth) */}
          <Route path="/portal/login" element={
            <PortalAuthProvider>
              <PortalLogin />
            </PortalAuthProvider>
          } />
          {/* Portal admin */}
          <Route path="/portal/admin" element={
            <PortalAuthProvider>
              <PortalAdmin />
            </PortalAuthProvider>
          } />
          {/* Portal authenticated routes */}
          <Route path="/portal" element={
            <PortalAuthProvider>
              <PortalRoutes />
            </PortalAuthProvider>
          }>
            <Route index element={<PortalDashboard />} />
            <Route path="programme" element={<PortalProgramme />} />
            <Route path="learning" element={<PortalLearning />} />
            <Route path="project-lab" element={<PortalProjectLab />} />
            <Route path="team" element={<PortalTeam />} />
            <Route path="assignments" element={<PortalAssignments />} />
            <Route path="sessions" element={<PortalSessions />} />
            <Route path="resources" element={<PortalResources />} />
            <Route path="skill-passport" element={<PortalSkillPassport />} />
            <Route path="progress" element={<PortalProgress />} />
            <Route path="portfolio" element={<PortalPortfolio />} />
            <Route path="announcements" element={<PortalAnnouncements />} />
            <Route path="support" element={<PortalSupport />} />
            <Route path="profile" element={<PortalProfile />} />
          </Route>

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