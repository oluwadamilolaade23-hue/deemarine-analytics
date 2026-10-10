import { useState } from "react";
import { BarChart3, ExternalLink, Archive } from "lucide-react";

const editions = [
  {
    id: "edition-2",
    label: "Edition 2",
    period: "Latest",
    src: "/maritime-intelligence-dashboard.html",
  },
  {
    id: "edition-1",
    label: "Edition 1",
    period: "27 Sep–3 Oct 2026",
    src: "/maritime-intelligence-edition-1.html",
  },
];

export default function MaritimeIntelligence() {
  const [activeEdition, setActiveEdition] = useState(editions[0]);
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
            </div>
            <a
              href={activeEdition.src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start lg:self-auto px-4 py-2.5 rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-colors text-sm font-semibold"
            >
              Open full-screen <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-7 rounded-xl border border-blue-400/20 bg-[#0a2a55]/70 p-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200 mb-1">
                  <Archive className="h-4 w-4" />
                  Edition Slicer
                </div>
                <p className="text-xs text-slate-400">
                  Select any published DeeMarine Maritime Intelligence edition.
                </p>
              </div>
              <div className="w-full md:w-[360px]">
                <label htmlFor="edition-slicer" className="block text-xs font-semibold text-blue-100 mb-2">
                  Choose edition
                </label>
                <select
                  id="edition-slicer"
                  value={activeEdition.id}
                  onChange={(e) => {
                    const selected = editions.find((edition) => edition.id === e.target.value);
                    if (selected) setActiveEdition(selected);
                  }}
                  className="w-full rounded-lg border border-blue-400/35 bg-[#071d3b] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                >
                  {editions.map((edition) => (
                    <option key={edition.id} value={edition.id}>
                      {edition.label} — {edition.period}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#061a33]">
        <iframe
          key={activeEdition.src}
          title={`DeeMarine Maritime Intelligence ${activeEdition.label}`}
          src={activeEdition.src}
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
