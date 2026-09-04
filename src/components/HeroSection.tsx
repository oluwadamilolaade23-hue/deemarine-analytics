import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function LiveTimestamp() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " UTC");
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-[#0f2744] text-white">
      {/* Background gradient layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#0f2744] to-blue-800/30" />
        <div className="hero-gradient-shift absolute inset-0 opacity-30" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle absolute rounded-full bg-blue-400/30"
            style={{
              width: `${2 + Math.random() * 5}px`,
              height: `${2 + Math.random() * 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-light-ray absolute -top-1/2 left-1/4 w-1 h-[200%] bg-gradient-to-b from-transparent via-blue-400/8 to-transparent rotate-12" />
        <div className="hero-light-ray absolute -top-1/2 left-2/3 w-1 h-[200%] bg-gradient-to-b from-transparent via-blue-300/8 to-transparent -rotate-6" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - visible by default, animations enhance */}
          <div className="space-y-8">
            <div className="hero-animate-in" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Sea to Screen</span>
              </div>
            </div>
            <h1 className="text-white leading-tight hero-animate-in" style={{ animationDelay: "0.3s" }}>
              Maritime Decisions<br />
              <span className="text-blue-400">Powered by Data</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-xl hero-animate-in" style={{ animationDelay: "0.5s" }}>
              DeeMarine Analytics helps maritime organizations transform operational data into actionable insights for efficiency, safety, compliance, sustainability, and business performance.
            </p>
            <div className="flex flex-wrap gap-4 hero-animate-in" style={{ animationDelay: "0.7s" }}>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hero-btn-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25">
                <Link to="/services">Explore Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-500/20 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                <Link to="/institute">Join DMA Institute</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-500/20 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-500/20 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Animated Maritime Scene */}
          <div
            className="hidden lg:block relative"
            style={{ transform: `translateY(${scrollY * 0.08}px)`, transition: "transform 0.1s linear" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
              {/* Base image */}
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1323837/2026-06-29/rp5sczqcaijq/hero-maritime-port-aerial.png"
                alt="Maritime port with data analytics overlay"
                className="w-full h-full object-cover"
              />

              {/* Dark overlay for dashboard visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-slate-900/40" />

              {/* Ocean wave overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none">
                <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                  <path className="hero-wave-1" fill="rgba(37,99,235,0.25)" d="M0,60 C150,80 350,40 500,60 C650,80 750,50 800,60 L800,120 L0,120 Z" />
                  <path className="hero-wave-2" fill="rgba(59,130,246,0.18)" d="M0,75 C200,55 400,90 600,70 C700,60 750,80 800,75 L800,120 L0,120 Z" />
                  <path fill="rgba(96,165,250,0.1)" d="M0,90 C300,80 500,95 800,88 L800,120 L0,120 Z" />
                </svg>
              </div>

              {/* Ship animation */}
              <div className="hero-ship absolute bottom-[28%] left-[12%] pointer-events-none">
                <svg width="90" height="35" viewBox="0 0 90 35">
                  <rect x="5" y="12" width="80" height="14" rx="3" fill="rgba(255,255,255,0.75)" />
                  <rect x="10" y="4" width="10" height="10" rx="1" fill="rgba(255,255,255,0.55)" />
                  <rect x="24" y="6" width="8" height="8" rx="1" fill="rgba(255,255,255,0.45)" />
                  <rect x="36" y="6" width="8" height="8" rx="1" fill="rgba(255,255,255,0.45)" />
                  <rect x="48" y="6" width="8" height="8" rx="1" fill="rgba(255,255,255,0.45)" />
                  <rect x="60" y="6" width="8" height="8" rx="1" fill="rgba(255,255,255,0.45)" />
                  <path d="M0,22 Q10,18 5,26 Q15,20 10,28" stroke="rgba(147,197,253,0.4)" strokeWidth="1" fill="none" />
                </svg>
              </div>

              {/* Water ripples */}
              <div className="hero-ripple absolute bottom-[24%] left-[8%] pointer-events-none">
                <svg width="120" height="24" viewBox="0 0 120 24">
                  <ellipse cx="60" cy="12" rx="50" ry="10" fill="none" stroke="rgba(147,197,253,0.35)" strokeWidth="0.8" className="hero-ripple-ring" />
                </svg>
              </div>

              {/* Port crane 1 */}
              <div className="hero-crane absolute top-[6%] left-[58%] pointer-events-none">
                <svg width="50" height="60" viewBox="0 0 50 60">
                  <rect x="22" y="0" width="5" height="60" fill="rgba(255,255,255,0.55)" />
                  <rect x="5" y="0" width="38" height="4" fill="rgba(255,255,255,0.45)" />
                  <line x1="30" y1="4" x2="30" y2="24" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" className="hero-crane-cable" />
                  <rect x="26" y="22" width="8" height="6" rx="1" fill="rgba(255,200,50,0.6)" className="hero-crane-load" />
                </svg>
              </div>

              {/* Port crane 2 */}
              <div className="hero-crane-2 absolute top-[4%] left-[74%] pointer-events-none">
                <svg width="42" height="52" viewBox="0 0 42 52">
                  <rect x="18" y="0" width="4" height="52" fill="rgba(255,255,255,0.45)" />
                  <rect x="3" y="0" width="34" height="3" fill="rgba(255,255,255,0.38)" />
                  <line x1="26" y1="3" x2="26" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="hero-crane-cable-2" />
                  <rect x="23" y="18" width="6" height="5" rx="1" fill="rgba(255,200,50,0.5)" className="hero-crane-load-2" />
                </svg>
              </div>

              {/* Blinking port lights */}
              <div className="absolute top-[14%] left-[54%] w-2 h-2 rounded-full bg-yellow-400/80 hero-blink shadow-lg shadow-yellow-400/30" />
              <div className="absolute top-[10%] left-[68%] w-2 h-2 rounded-full bg-red-400/70 hero-blink shadow-lg shadow-red-400/20" style={{ animationDelay: "1.5s" }} />
              <div className="absolute top-[18%] left-[84%] w-1.5 h-1.5 rounded-full bg-green-400/70 hero-blink shadow-lg shadow-green-400/20" style={{ animationDelay: "0.8s" }} />
              <div className="absolute top-[22%] left-[90%] w-1.5 h-1.5 rounded-full bg-yellow-300/60 hero-blink shadow-lg shadow-yellow-300/20" style={{ animationDelay: "2.2s" }} />
              <div className="absolute top-[8%] left-[48%] w-1.5 h-1.5 rounded-full bg-blue-400/60 hero-blink shadow-lg shadow-blue-400/20" style={{ animationDelay: "1.1s" }} />

              {/* Small vessel traffic */}
              <div className="hero-vessel absolute bottom-[35%] pointer-events-none">
                <svg width="24" height="10" viewBox="0 0 24 10">
                  <polygon points="0,7 18,7 24,5 18,3 0,3" fill="rgba(255,255,255,0.35)" />
                </svg>
              </div>

              {/* Dashboard Overlay - Top Left: KPI Panel */}
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 min-w-[180px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 hero-blink" />
                  <span className="text-[10px] text-green-400 font-mono font-bold tracking-wider">LIVE</span>
                  <span className="text-[9px] text-slate-500 font-mono ml-auto"><LiveTimestamp /></span>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">Vessels</div>
                    <div className="text-sm text-blue-400 font-bold font-mono"><AnimatedCounter target={2847} /></div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">Port Calls</div>
                    <div className="text-sm text-blue-400 font-bold font-mono"><AnimatedCounter target={1243} /></div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">Turnaround</div>
                    <div className="text-sm text-emerald-400 font-bold font-mono"><AnimatedCounter target={18} suffix="h" /></div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">Efficiency</div>
                    <div className="text-sm text-emerald-400 font-bold font-mono"><AnimatedCounter target={94} suffix="%" /></div>
                  </div>
                </div>
              </div>

              {/* Dashboard Overlay - Top Right: Mini Chart */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 min-w-[140px]">
                <div className="text-[10px] text-slate-400 mb-2 font-medium">Fleet Performance</div>
                <svg width="110" height="40" viewBox="0 0 110 40" className="overflow-visible">
                  <polyline
                    points="0,32 12,28 24,22 36,25 48,18 60,20 72,12 84,10 96,6 110,4"
                    fill="none"
                    stroke="rgba(59,130,246,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hero-chart-line"
                  />
                  <polyline
                    points="0,32 12,28 24,22 36,25 48,18 60,20 72,12 84,10 96,6 110,4 110,40 0,40"
                    fill="url(#chartGrad)"
                    className="hero-chart-area"
                  />
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
                      <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[8px] text-slate-600">7d ago</span>
                  <span className="text-[9px] text-emerald-400 font-bold">+12.4%</span>
                  <span className="text-[8px] text-slate-600">Now</span>
                </div>
              </div>

              {/* Dashboard Overlay - Bottom Left: Progress bars */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 min-w-[200px]">
                <div className="text-[10px] text-slate-400 mb-3 font-medium">Operations Status</div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[9px] mb-1">
                      <span className="text-slate-400">Berth Utilization</span>
                      <span className="text-blue-400 font-mono font-bold">87%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full hero-progress-bar" style={{ width: "87%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] mb-1">
                      <span className="text-slate-400">Crane Efficiency</span>
                      <span className="text-emerald-400 font-mono font-bold">92%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full hero-progress-bar" style={{ width: "92%", animationDelay: "0.5s" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] mb-1">
                      <span className="text-slate-400">Emissions CII</span>
                      <span className="text-amber-400 font-mono font-bold">76%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full hero-progress-bar" style={{ width: "76%", animationDelay: "1s" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Overlay - Bottom Right: World Map */}
              <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-blue-500/30">
                <div className="text-[10px] text-slate-400 mb-2 font-medium">Global Routes</div>
                <svg width="110" height="50" viewBox="0 0 110 50">
                  <ellipse cx="55" cy="25" rx="50" ry="22" fill="none" stroke="rgba(100,116,139,0.35)" strokeWidth="0.8" />
                  <line x1="5" y1="25" x2="105" y2="25" stroke="rgba(100,116,139,0.2)" strokeWidth="0.4" />
                  <line x1="55" y1="3" x2="55" y2="47" stroke="rgba(100,116,139,0.2)" strokeWidth="0.4" />
                  <path d="M18,18 Q35,12 55,22 Q75,32 92,17" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="1" className="hero-route-line" />
                  <path d="M22,34 Q40,28 58,30 Q76,33 95,27" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="0.8" className="hero-route-line" style={{ animationDelay: "2s" }} />
                  <circle cx="18" cy="18" r="2" fill="rgba(59,130,246,0.9)" className="hero-pulse-dot" />
                  <circle cx="55" cy="22" r="2.5" fill="rgba(59,130,246,0.9)" className="hero-pulse-dot" style={{ animationDelay: "0.5s" }} />
                  <circle cx="92" cy="17" r="2" fill="rgba(59,130,246,0.9)" className="hero-pulse-dot" style={{ animationDelay: "1s" }} />
                  <circle cx="22" cy="34" r="1.5" fill="rgba(59,130,246,0.7)" className="hero-pulse-dot" style={{ animationDelay: "1.5s" }} />
                  <circle cx="95" cy="27" r="1.5" fill="rgba(59,130,246,0.7)" className="hero-pulse-dot" style={{ animationDelay: "2s" }} />
                </svg>
              </div>

              {/* Data network overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 225">
                  <line x1="80" y1="140" x2="200" y2="80" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" className="hero-data-line" />
                  <line x1="200" y1="80" x2="320" y2="120" stroke="rgba(59,130,246,0.18)" strokeWidth="0.8" className="hero-data-line" style={{ animationDelay: "1s" }} />
                  <line x1="150" y1="160" x2="280" y2="60" stroke="rgba(59,130,246,0.15)" strokeWidth="0.8" className="hero-data-line" style={{ animationDelay: "2s" }} />
                  <line x1="60" y1="100" x2="180" y2="50" stroke="rgba(59,130,246,0.12)" strokeWidth="0.6" className="hero-data-line" style={{ animationDelay: "3s" }} />
                  <circle cx="80" cy="140" r="3" fill="rgba(59,130,246,0.5)" className="hero-pulse-dot" />
                  <circle cx="200" cy="80" r="4" fill="rgba(59,130,246,0.6)" className="hero-pulse-dot" style={{ animationDelay: "0.7s" }} />
                  <circle cx="320" cy="120" r="3" fill="rgba(59,130,246,0.5)" className="hero-pulse-dot" style={{ animationDelay: "1.4s" }} />
                  <circle cx="150" cy="160" r="2.5" fill="rgba(59,130,246,0.4)" className="hero-pulse-dot" style={{ animationDelay: "2.1s" }} />
                  <circle cx="280" cy="60" r="2.5" fill="rgba(59,130,246,0.4)" className="hero-pulse-dot" style={{ animationDelay: "0.3s" }} />
                  <circle cx="60" cy="100" r="2" fill="rgba(59,130,246,0.35)" className="hero-pulse-dot" style={{ animationDelay: "1.8s" }} />
                  <circle cx="180" cy="50" r="2" fill="rgba(59,130,246,0.35)" className="hero-pulse-dot" style={{ animationDelay: "2.5s" }} />
                  <circle r="2" fill="rgba(96,165,250,0.9)" className="hero-data-pulse-1" />
                  <circle r="1.5" fill="rgba(96,165,250,0.7)" className="hero-data-pulse-2" />
                </svg>
              </div>

              {/* Shimmer overlay */}
              <div className="absolute inset-0 pointer-events-none hero-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}