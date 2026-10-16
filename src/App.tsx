import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import MaritimeIntelligence from "@/pages/MaritimeIntelligence";
import VesselTracker from "@/pages/VesselTracker";
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

const PracticeAnalytics = lazy(() => import("@/pages/PracticeAnalytics"));

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

// Reset each destination page while preserving links to specific sections.
function RouteScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const resetScroll = () => {
      if (hash) {
        let id = hash.slice(1);
        try {
          id = decodeURIComponent(id);
        } catch {
          // Keep malformed fragments usable as literal IDs.
        }
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "instant", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    resetScroll();

    // Menus lock body scrolling and restore focus after their exit animation.
    // Apply the destination position after that cleanup has finished as well.
    let firstFrame = 0;
    let secondFrame = 0;
    const afterMenuCleanup = () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(resetScroll);
      });
    };
    const observer = new MutationObserver(() => {
      if (!document.body.hasAttribute("data-scroll-locked")) {
        observer.disconnect();
        afterMenuCleanup();
      }
    });
    if (document.body.hasAttribute("data-scroll-locked")) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-scroll-locked"],
      });
    } else {
      afterMenuCleanup();
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteScrollReset />
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
                  <Route path="/practice-analytics" element={<Suspense fallback={<div className="p-12 text-center" role="status">Loading Practice Analytics…</div>}><PracticeAnalytics /></Suspense>} />
                  <Route path="/institute" element={<Institute />} />
                  <Route path="/dma-bluedata-hub" element={<Internship />} />
                  <Route path="/internship" element={<Internship />} />
                  <Route path="/dma-internship/apply" element={<Internship />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/awards" element={<Awards />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/maritime-intelligence" element={<MaritimeIntelligence />} />
                  <Route path="/maritime-intelligence/vessel-tracker" element={<VesselTracker />} />
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