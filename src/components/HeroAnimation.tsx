import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

function useCountUp(target: number, duration = 2000, delay = 0): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased * 10) / 10);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return value;
}

function CircularGauge({
  value, label, size = 68, strokeWidth = 5, color = "#3b82f6", suffix = "%",
}: {
  value: number; label: string; size?: number; strokeWidth?: number; color?: string; suffix?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(30,58,95,0.5)" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 2s ease-out" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color }}>{value}{suffix}</span>
        </div>
      </div>
      <span className="text-[8px] text-slate-400 text-center leading-tight font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function MetricCard({
  label, value, unit, trend, trendUp, color = "#60a5fa",
}: {
  label: string; value: string | number; unit?: string; trend?: string; trendUp?: boolean; color?: string;
}) {
  return (
    <div className="px-2.5 py-2 rounded-lg bg-[#0d1f3c]/80 border border-blue-900/30">
      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">{label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-sm font-bold" style={{ color }}>{value}</span>
        {unit && <span className="text-[9px] text-slate-400">{unit}</span>}
        {trend && (
          <span className={`text-[9px] font-semibold ${trendUp ? "text-emerald-400" : "text-amber-400"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniLineChart() {
  const data = [35, 42, 38, 50, 45, 55, 52, 62, 58, 68, 65, 72];
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const w = 200, h = 60, pad = 5;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - minVal) / range) * (h - 2 * pad);
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;
  const areaD = `${pathD} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14">
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line key={i} x1={pad} y1={h * p} x2={w - pad} y2={h * p} stroke="#1e3a5f" strokeWidth="0.5" />
      ))}
      <path d={areaD} fill="url(#chartAreaGrad)" opacity="0.3" className="hero-chart-area" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="1.5" className="hero-chart-line" />
      <circle cx={w - pad} cy={h - pad - ((data[data.length - 1] - minVal) / range) * (h - 2 * pad)}
        r="2.5" fill="#60a5fa" className="hero-pulse-dot" />
      <defs>
        <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MiniWorldMap() {
  const ports = [
    { x: 50, y: 28 }, { x: 80, y: 48 }, { x: 165, y: 25 }, { x: 148, y: 45 },
    { x: 210, y: 30 }, { x: 240, y: 28 }, { x: 275, y: 32 }, { x: 295, y: 22 },
  ];
  const routes = [[0,2],[2,4],[4,5],[5,6],[6,7],[1,2],[3,4],[0,1]];
  return (
    <svg viewBox="0 0 320 60" className="w-full h-16">
      {[15, 30, 45].map((y, i) => (
        <line key={`h${i}`} x1="10" y1={y} x2="310" y2={y} stroke="#1e3a5f" strokeWidth="0.3" />
      ))}
      {[80, 160, 240].map((x, i) => (
        <line key={`v${i}`} x1={x} y1="5" x2={x} y2="55" stroke="#1e3a5f" strokeWidth="0.3" />
      ))}
      {routes.map(([from, to], i) => (
        <line key={`r${i}`} x1={ports[from].x} y1={ports[from].y} x2={ports[to].x} y2={ports[to].y}
          stroke="#2563eb" strokeWidth="0.6" className="hero-route-line" opacity="0.4" />
      ))}
      {ports.map((port, i) => (
        <g key={`p${i}`}>
          <circle cx={port.x} cy={port.y} r="5" fill="#2563eb" opacity="0.12"
            className="hero-radar-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          <circle cx={port.x} cy={port.y} r="1.5" fill="#60a5fa"
            className="hero-pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
        </g>
      ))}
    </svg>
  );
}

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const fleetEff = useCountUp(94.2, 2500, 600);
  const compliance = useCountUp(92, 2500, 1200);
  const fuel = useCountUp(14.6, 2000, 800);
  const carbon = useCountUp(265, 2000, 1000);
  const portTurn = useCountUp(18.5, 2000, 700);
  const vessels = useCountUp(24, 1500, 400);
  const eevi = useCountUp(8.2, 2000, 900);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  const dashGlow = isHovering ? 0.3 : 0.08 + mousePos.x * 0.12;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      className="relative w-full aspect-video max-h-[560px] overflow-hidden rounded-2xl bg-[#060e1a]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* SVG SCENE */}
      <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050d18" />
            <stop offset="40%" stopColor="#0a1628" />
            <stop offset="70%" stopColor="#0f2744" />
            <stop offset="100%" stopColor="#132d4f" />
          </linearGradient>
          <linearGradient id="oceanGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c2240" />
            <stop offset="50%" stopColor="#081a33" />
            <stop offset="100%" stopColor="#050e1c" />
          </linearGradient>
          <linearGradient id="dataGrad3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05" />
            <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="wakeGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="moonGlowR" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.12" />
            <stop offset="40%" stopColor="#93c5fd" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0a1628" stopOpacity="0" />
          </radialGradient>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow3">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="heavyGlow">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1000" height="600" fill="url(#skyGrad3)" />

        {/* Moon */}
        <circle cx="820" cy="80" r="120" fill="url(#moonGlowR)" />
        <circle cx="820" cy="80" r="18" fill="#e2e8f0" opacity="0.08" />
        <circle cx="820" cy="80" r="10" fill="#f1f5f9" opacity="0.12" />

        {/* Stars */}
        {[
          [80,40,1.2,0.5,7],[200,25,0.8,0.3,9],[350,55,1,0.4,6],[480,30,0.6,0.3,8],
          [600,65,1,0.4,10],[720,35,0.8,0.3,7.5],[150,80,0.7,0.3,11],[420,20,1,0.5,6.5],
          [550,75,0.6,0.2,9],[680,50,0.9,0.4,8],[900,45,0.7,0.3,7],[300,70,0.5,0.2,10],
        ].map(([cx,cy,r,opacity,dur], i) => (
          <circle key={`star${i}`} cx={cx} cy={cy} r={r as number} fill="#93c5fd"
            opacity={opacity as number} className="hero-particle"
            style={{ animationDuration: `${dur}s`, animationDelay: `${i * 0.4}s` }} />
        ))}

        {/* Fog */}
        <ellipse cx="300" cy="385" rx="250" ry="15" fill="#0f2744" opacity="0.4" />
        <ellipse cx="700" cy="390" rx="200" ry="12" fill="#0f2744" opacity="0.3" />

        {/* Ocean */}
        <rect x="0" y="385" width="1000" height="215" fill="url(#oceanGrad3)" />
        <path d="M0,392 C80,382 160,400 250,388 C340,376 430,396 520,384 C610,372 700,392 790,380 C860,372 930,388 1000,382 L1000,600 L0,600 Z"
          fill="#0d2240" opacity="0.9" className="hero-wave-1" />
        <path d="M0,400 C120,390 240,410 380,396 C520,382 640,406 780,392 L1000,400 L1000,600 L0,600 Z"
          fill="#0a1c35" opacity="0.7" className="hero-wave-2" />
        <path d="M0,408 C100,400 200,415 320,405 C440,395 560,412 680,402 C780,394 880,408 1000,400 L1000,600 L0,600 Z"
          fill="#081630" opacity="0.5" className="hero-wave-1" style={{ animationDelay: "2s" }} />
        <path d="M0,395 C80,388 180,402 280,392 C380,382 480,398 580,388 C680,378 780,394 880,384 L1000,390"
          stroke="#2563eb" strokeWidth="0.6" fill="none" opacity="0.15" className="hero-wave-1" />

        {/* Ocean reflections */}
        <ellipse cx="250" cy="430" rx="60" ry="2.5" fill="#2563eb" opacity="0.06" />
        <ellipse cx="280" cy="445" rx="40" ry="1.5" fill="#3b82f6" opacity="0.04" />

        {/* CONTAINER SHIP */}
        <g className="hero-ship-2" style={{ transformOrigin: "260px 395px" }}>
          {/* Hull */}
          <path d="M95,408 C100,400 115,388 140,382 L360,382 C375,388 388,400 392,408 L382,420 L105,420 Z"
            fill="#162a47" stroke="#1e40af" strokeWidth="0.6" />
          <rect x="110" y="406" width="268" height="3" rx="1" fill="#1e40af" opacity="0.25" />
          <rect x="180" y="410" width="80" height="4" rx="1" fill="#0f2744" opacity="0.6" />
          <path d="M95,408 L88,406 L95,404" stroke="#1e40af" strokeWidth="0.4" fill="none" opacity="0.5" />

          {/* Container Row 1 */}
          <rect x="135" y="370" width="22" height="12" rx="1" fill="#1e40af" opacity="0.85" />
          <rect x="159" y="370" width="22" height="12" rx="1" fill="#991b1b" opacity="0.75" />
          <rect x="183" y="370" width="22" height="12" rx="1" fill="#1e40af" opacity="0.85" />
          <rect x="207" y="370" width="22" height="12" rx="1" fill="#166534" opacity="0.7" />
          <rect x="231" y="370" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.8" />
          <rect x="255" y="370" width="22" height="12" rx="1" fill="#991b1b" opacity="0.7" />
          <rect x="279" y="370" width="22" height="12" rx="1" fill="#1e40af" opacity="0.85" />
          <rect x="303" y="370" width="22" height="12" rx="1" fill="#166534" opacity="0.7" />
          <rect x="327" y="370" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.8" />

          {/* Container Row 2 */}
          <rect x="147" y="358" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.75" />
          <rect x="171" y="358" width="22" height="12" rx="1" fill="#166534" opacity="0.65" />
          <rect x="195" y="358" width="22" height="12" rx="1" fill="#1e40af" opacity="0.75" />
          <rect x="219" y="358" width="22" height="12" rx="1" fill="#991b1b" opacity="0.65" />
          <rect x="243" y="358" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.75" />
          <rect x="267" y="358" width="22" height="12" rx="1" fill="#1e40af" opacity="0.75" />
          <rect x="291" y="358" width="22" height="12" rx="1" fill="#166534" opacity="0.65" />
          <rect x="315" y="358" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.75" />

          {/* Container Row 3 */}
          <rect x="159" y="346" width="22" height="12" rx="1" fill="#1e40af" opacity="0.65" />
          <rect x="183" y="346" width="22" height="12" rx="1" fill="#991b1b" opacity="0.55" />
          <rect x="207" y="346" width="22" height="12" rx="1" fill="#166534" opacity="0.6" />
          <rect x="231" y="346" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.65" />
          <rect x="255" y="346" width="22" height="12" rx="1" fill="#1e40af" opacity="0.65" />
          <rect x="279" y="346" width="22" height="12" rx="1" fill="#991b1b" opacity="0.55" />
          <rect x="303" y="346" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.65" />

          {/* Container Row 4 */}
          <rect x="183" y="334" width="22" height="12" rx="1" fill="#1e3a8a" opacity="0.55" />
          <rect x="207" y="334" width="22" height="12" rx="1" fill="#1e40af" opacity="0.55" />
          <rect x="231" y="334" width="22" height="12" rx="1" fill="#991b1b" opacity="0.45" />
          <rect x="255" y="334" width="22" height="12" rx="1" fill="#166534" opacity="0.5" />
          <rect x="279" y="334" width="22" height="12" rx="1" fill="#1e40af" opacity="0.55" />

          {/* Crane/derrick */}
          <line x1="200" y1="346" x2="200" y2="318" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="200" y1="318" x2="175" y2="330" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="200" y1="318" x2="225" y2="330" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="175" y1="330" x2="175" y2="345" stroke="#64748b" strokeWidth="0.4" className="hero-crane-cable" />

          {/* Superstructure / Bridge */}
          <rect x="330" y="348" width="45" height="34" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.4" />
          <rect x="330" y="348" width="45" height="4" rx="1" fill="#1e3a5f" opacity="0.4" />
          <rect x="335" y="354" width="8" height="6" rx="1" fill="#3b82f6" opacity="0.8" />
          <rect x="345" y="354" width="8" height="6" rx="1" fill="#3b82f6" opacity="0.8" />
          <rect x="355" y="354" width="8" height="6" rx="1" fill="#3b82f6" opacity="0.8" />
          <rect x="365" y="354" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.6" />
          <rect x="335" y="366" width="5" height="4" rx="0.5" fill="#60a5fa" opacity="0.4" />
          <rect x="343" y="366" width="5" height="4" rx="0.5" fill="#60a5fa" opacity="0.4" />
          <rect x="351" y="366" width="5" height="4" rx="0.5" fill="#60a5fa" opacity="0.4" />
          <rect x="359" y="366" width="5" height="4" rx="0.5" fill="#60a5fa" opacity="0.4" />

          {/* Mast with radar dome */}
          <line x1="352" y1="348" x2="352" y2="310" stroke="#94a3b8" strokeWidth="1.2" />
          <ellipse cx="352" cy="310" rx="6" ry="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.3" />
          <line x1="346" y1="310" x2="358" y2="310" stroke="#60a5fa" strokeWidth="0.5" opacity="0.6" className="hero-radar-sweep" />
          <circle cx="352" cy="306" r="2.5" fill="#60a5fa" className="hero-blink" filter="url(#glow3)" />

          {/* Funnel */}
          <rect x="362" y="338" width="12" height="16" rx="2" fill="#1e3a5f" stroke="#2563eb" strokeWidth="0.4" />
          <rect x="362" y="342" width="12" height="3" rx="0.5" fill="#2563eb" opacity="0.4" />

          {/* Smoke */}
          <circle cx="368" cy="332" r="5" fill="#475569" opacity="0.1" className="hero-smoke-1" />
          <circle cx="374" cy="325" r="7" fill="#475569" opacity="0.07" className="hero-smoke-2" />
          <circle cx="380" cy="316" r="10" fill="#475569" opacity="0.04" className="hero-smoke-3" />

          {/* Navigation lights */}
          <circle cx="97" cy="400" r="2.5" fill="#ef4444" opacity="0.9" className="hero-blink" filter="url(#glow3)" />
          <circle cx="390" cy="400" r="2.5" fill="#22c55e" opacity="0.9" className="hero-blink" style={{ animationDelay: "1s" }} filter="url(#glow3)" />

          {/* Anchor */}
          <circle cx="110" cy="410" r="2" fill="#94a3b8" opacity="0.4" />
          <line x1="110" y1="410" x2="110" y2="418" stroke="#94a3b8" strokeWidth="0.6" opacity="0.4" />
          <path d="M107,416 L110,418 L113,416" stroke="#94a3b8" strokeWidth="0.5" fill="none" opacity="0.4" />

          {/* Wake */}
          <path d="M95,412 Q60,416 30,412 Q10,408 -10,412" stroke="url(#wakeGrad)" strokeWidth="1.5" fill="none" />
          <path d="M95,408 Q55,414 20,410 Q0,406 -20,410" stroke="url(#wakeGrad)" strokeWidth="0.8" fill="none" opacity="0.6" />
          <path d="M95,416 Q65,420 40,416 Q20,412 0,416" stroke="url(#wakeGrad)" strokeWidth="0.5" fill="none" opacity="0.3" />
          <ellipse cx="100" cy="414" rx="12" ry="2" fill="#93c5fd" opacity="0.08" />
          <ellipse cx="130" cy="416" rx="8" ry="1.5" fill="#93c5fd" opacity="0.05" />
        </g>

        {/* DATA STREAMS */}
        <path d="M370,370 C420,340 460,280 510,230 C540,200 560,170 580,145"
          stroke="url(#dataGrad3)" strokeWidth="3" fill="none" className="hero-data-line" filter="url(#glow3)" />
        <path d="M360,385 C430,355 480,300 530,255 C555,235 575,205 595,180"
          stroke="url(#dataGrad3)" strokeWidth="2" fill="none" className="hero-data-line" style={{ animationDelay: "0.8s" }} filter="url(#glow3)" />
        <path d="M350,395 C440,370 500,320 550,280 C570,260 590,235 610,210"
          stroke="url(#dataGrad3)" strokeWidth="1.2" fill="none" className="hero-data-line" style={{ animationDelay: "1.6s" }} filter="url(#glow3)" />

        {/* Data particles */}
        <circle r="4" fill="#60a5fa" filter="url(#glow3)" opacity="0.9">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M370,370 C420,340 460,280 510,230 C540,200 560,170 580,145" />
        </circle>
        <circle r="3" fill="#93c5fd" filter="url(#glow3)" opacity="0.7">
          <animateMotion dur="4s" repeatCount="indefinite" path="M360,385 C430,355 480,300 530,255 C555,235 575,205 595,180" begin="1s" />
        </circle>
        <circle r="3.5" fill="#60a5fa" filter="url(#glow3)" opacity="0.8">
          <animateMotion dur="4.5s" repeatCount="indefinite" path="M350,395 C440,370 500,320 550,280 C570,260 590,235 610,210" begin="2s" />
        </circle>
        <circle r="2.5" fill="#93c5fd" filter="url(#glow3)" opacity="0.6">
          <animateMotion dur="5s" repeatCount="indefinite" path="M370,370 C420,340 460,280 510,230 C540,200 560,170 580,145" begin="2.5s" />
        </circle>
        <circle r="2" fill="#bfdbfe" filter="url(#glow3)" opacity="0.5">
          <animateMotion dur="5.5s" repeatCount="indefinite" path="M360,385 C430,355 480,300 530,255 C555,235 575,205 595,180" begin="3.5s" />
        </circle>
        <circle r="2" fill="#60a5fa" filter="url(#glow3)" opacity="0.5">
          <animateMotion dur="6s" repeatCount="indefinite" path="M350,395 C440,370 500,320 550,280 C570,260 590,235 610,210" begin="4s" />
        </circle>

        {/* Binary fragments */}
        <text fontSize="7" fill="#3b82f6" opacity="0.35" fontFamily="monospace">
          <animateMotion dur="5s" repeatCount="indefinite" path="M365,375 C415,345 455,285 505,235 C535,205 555,175 575,150" begin="0.5s" />
          01101
        </text>
        <text fontSize="6" fill="#60a5fa" opacity="0.25" fontFamily="monospace">
          <animateMotion dur="6s" repeatCount="indefinite" path="M355,390 C425,360 475,305 525,260 C550,240 570,210 590,185" begin="2.5s" />
          10010
        </text>
        <text fontSize="5" fill="#93c5fd" opacity="0.2" fontFamily="monospace">
          <animateMotion dur="7s" repeatCount="indefinite" path="M345,400 C435,375 495,325 545,285 C565,265 585,240 605,215" begin="4s" />
          11001
        </text>

        {/* Dashboard entry glow */}
        <circle cx="590" cy="170" r="30" fill="#3b82f6" opacity="0.06" filter="url(#heavyGlow)" />
        <circle cx="590" cy="170" r="15" fill="#60a5fa" opacity="0.04" filter="url(#softGlow3)" />

        {/* Ambient glow */}
        <circle cx="260" cy="395" r="60" fill="#2563eb" opacity="0.03" filter="url(#softGlow3)" />
        <line x1="95" y1="410" x2="30" y2="410" stroke="#60a5fa" strokeWidth="0.3" opacity="0.15" className="hero-light-ray" />
      </svg>

      {/* HOLOGRAPHIC DASHBOARD */}
      <motion.div
        className="absolute right-[1.5%] top-[1.5%] w-[58%] h-[95%] flex flex-col rounded-xl overflow-hidden hero-holographic"
        style={{
          background: `rgba(8, 20, 40, ${0.7 + dashGlow * 0.15})`,
          backdropFilter: "blur(24px)",
          border: `1px solid rgba(59, 130, 246, ${0.18 + dashGlow * 0.25})`,
          boxShadow: `0 0 ${40 + dashGlow * 50}px rgba(59, 130, 246, ${dashGlow * 0.35}), inset 0 0 ${25 + dashGlow * 25}px rgba(59, 130, 246, ${dashGlow * 0.1})`,
          transform: "perspective(1200px) rotateY(-2deg)",
        }}
        initial={{ opacity: 0, scale: 0.92, x: 40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      >
        <div className="absolute inset-0 pointer-events-none hero-scan-line z-10" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-900/30 bg-[#0a1e36]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[11px] font-bold text-blue-400 tracking-wide">DeeMarine Navigator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-slate-500 italic">Sea to Screen Intelligence</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 hero-blink" />
            <span className="text-[8px] text-emerald-400 font-semibold">LIVE</span>
          </div>
        </div>

        {/* Widget Grid */}
        <div className="flex-1 p-2.5 grid grid-cols-3 gap-2 overflow-hidden auto-rows-min">
          {/* Fleet Efficiency Gauge */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-[#0d1f3c]/60 border border-blue-900/20 p-2.5">
            <CircularGauge value={fleetEff} label="Fleet Efficiency" color="#3b82f6" />
          </div>

          {/* Metrics column */}
          <div className="flex flex-col gap-1.5">
            <MetricCard label="Fuel Consumption" value={fuel} unit="MT/day" trend="2.3%" trendUp={false} />
            <MetricCard label="CII Rating" value="A" color="#22c55e" />
            <MetricCard label="EEOI" value={eevi} unit="gCO2/t.nm" trend="1.8%" trendUp={false} color="#60a5fa" />
          </div>

          {/* Compliance Gauge */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-[#0d1f3c]/60 border border-blue-900/20 p-2.5">
            <CircularGauge value={compliance} label="Compliance" color="#22c55e" />
          </div>

          {/* Voyage Performance Chart */}
          <div className="col-span-2 rounded-lg bg-[#0d1f3c]/60 border border-blue-900/20 p-2.5">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Voyage Performance</div>
            <MiniLineChart />
          </div>

          {/* Port + Carbon */}
          <div className="flex flex-col gap-1.5">
            <MetricCard label="Port Turnaround" value={portTurn} unit="h" trend="12%" trendUp={false} color="#60a5fa" />
            <MetricCard label="Carbon Emissions" value={carbon} unit="MT/day" trend="5.1%" trendUp={false} color="#f59e0b" />
          </div>

          {/* Global Routes Map */}
          <div className="col-span-2 rounded-lg bg-[#0d1f3c]/60 border border-blue-900/20 p-2.5">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Global Routes</div>
            <MiniWorldMap />
          </div>

          {/* Status + Active Vessels */}
          <div className="flex flex-col gap-1.5">
            <MetricCard label="Active Vessels" value={vessels} color="#60a5fa" />
            <div className="px-2.5 py-2 rounded-lg bg-[#0d1f3c]/80 border border-blue-900/30">
              <div className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Compliance Status</div>
              <div className="flex flex-col gap-0.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] text-slate-400">Weather: Clear</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] text-slate-400">Maintenance: Optimal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] text-slate-400">Compliance: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-blue-900/30 bg-[#0a1e36]/40 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[8px] text-slate-500">Data Points: <span className="text-blue-400 font-semibold">1.2M</span></span>
            <span className="text-[8px] text-slate-500">Uptime: <span className="text-emerald-400 font-semibold">99.9%</span></span>
          </div>
          <span className="text-[8px] text-slate-600">DeeMarine Analytics &copy; 2026</span>
        </div>
      </motion.div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 pointer-events-none hero-shimmer rounded-2xl" />
    </motion.div>
  );
}