import { useState } from "react";
import { BarChart3, ExternalLink, Ship } from "lucide-react";
import { Link } from "react-router-dom";

export default function MaritimeIntelligence() {
  const [edition, setEdition] = useState<3 | 4>(4);
  const dashboardUrl = edition === 4 ? '/maritime-intelligence-dashboard.html' : '/maritime-intelligence-edition-3.html';
  return (
    <div className="bg-[#061a33] min-h-screen">
      <section className="bg-[#0f2744] text-white border-b border-blue-900/60">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-sm font-medium mb-4">
                <BarChart3 className="h-4 w-4" />
                Weekly Maritime Intelligence
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">DeeMarine Maritime Intelligence</h1>
              <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
                Weekly maritime developments transformed into structured data, verified intelligence and practical decision insight across ports, shipping, logistics, safety, energy transition and digitalisation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/maritime-intelligence/vessel-tracker"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-400 text-[#061a33] hover:bg-cyan-300 transition-colors text-sm font-bold"
                >
                  <Ship className="h-4 w-4" />
                  DMA Vessel Intelligence
                </Link>
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-colors text-sm font-semibold"
                >
                  Open dashboard full-screen <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#081e39] border-b border-blue-900/60">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-5">
          <h2 className="text-white text-lg font-bold">Maritime Intelligence Editions</h2>
          <p className="text-slate-300 text-sm mt-1 mb-4">Explore the latest weekly analysis or revisit previous editions.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose maritime intelligence edition">
            <button type="button" onClick={() => setEdition(4)} aria-pressed={edition === 4} className={edition === 4 ? "rounded-lg px-4 py-2.5 font-semibold bg-cyan-400 text-[#061a33]" : "rounded-lg px-4 py-2.5 font-semibold border border-blue-400/40 text-white hover:bg-blue-500/20"}>Edition 4 · Latest</button>
            <button type="button" onClick={() => setEdition(3)} aria-pressed={edition === 3} className={edition === 3 ? "rounded-lg px-4 py-2.5 font-semibold bg-cyan-400 text-[#061a33]" : "rounded-lg px-4 py-2.5 font-semibold border border-blue-400/40 text-white hover:bg-blue-500/20"}>Edition 3 · Archive</button>
          </div>
        </div>
      </section>
      <section className="w-full bg-[#061a33]">
        <iframe
          title="DeeMarine Maritime Intelligence dashboard"
          key={edition}
          src={dashboardUrl}
          className="w-full border-0 block"
          style={{ minHeight: "calc(100vh - 84px)", height: "1500px" }}
          loading="eager"
        />
      </section>

      <div className="bg-[#061a33] text-center text-xs text-slate-400 pb-6 px-4">
        Original dashboard design by <span className="text-blue-300 font-semibold">Engr. Olumide</span>
      </div>
    </div>
  );
}
