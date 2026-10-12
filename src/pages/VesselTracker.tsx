import { useMemo, useState } from "react";
import { AlertTriangle, Clock3, Compass, Gauge, MapPin, Search, Ship, Wifi } from "lucide-react";

type VesselResult = {
  mmsi: string;
  shipName?: string;
  latitude: number;
  longitude: number;
  sog?: number;
  cog?: number;
  heading?: number;
  receivedAt: string;
  source: string;
};

export default function VesselTracker() {
  const [mmsi, setMmsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VesselResult | null>(null);
  const [error, setError] = useState("");

  const mapUrl = useMemo(() => {
    if (!result) return "";
    const d = 0.18;
    const left = result.longitude - d;
    const right = result.longitude + d;
    const bottom = result.latitude - d;
    const top = result.latitude + d;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${result.latitude}%2C${result.longitude}`;
  }, [result]);

  async function searchVessel(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const cleaned = mmsi.trim();
    if (!/^\d{9}$/.test(cleaned)) {
      setError("Enter a valid 9-digit MMSI number.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ais?mmsi=${encodeURIComponent(cleaned)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to retrieve vessel position.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retrieve vessel position.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#061a33] text-white">
      <section className="border-b border-blue-900/60 bg-[#0f2744]">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-200">
              <Ship className="h-4 w-4" />
              DMA Vessel Intelligence
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Track. Analyze. Understand.</h1>
            <p className="mt-4 max-w-3xl text-slate-300 text-base md:text-lg leading-relaxed">
              Search a vessel by MMSI and view its latest AIS position, speed, course and data freshness directly inside DeeMarine Maritime Intelligence.
            </p>
          </div>

          <form onSubmit={searchVessel} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                value={mmsi}
                onChange={(e) => setMmsi(e.target.value)}
                inputMode="numeric"
                maxLength={9}
                placeholder="Enter 9-digit MMSI (e.g. 368207620)"
                className="w-full rounded-xl border border-slate-600 bg-[#071b30] py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-[#061a33] transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? "Listening for AIS…" : "Track vessel"}
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-400">
            Free MVP powered by AISStream. A result appears when a fresh AIS message is received during the lookup window.
          </p>
          {error && (
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 flex gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      <section className="container-max px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {!result && !loading && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["Latest AIS Position", "Latitude, longitude and data freshness from the latest received AIS message.", MapPin],
              ["Voyage Motion", "Speed over ground, course over ground and heading when reported.", Compass],
              ["Data Confidence", "DMA clearly shows when data is fresh, delayed or unavailable instead of guessing.", Wifi],
            ].map(([title, text, Icon]: any) => (
              <div key={title} className="rounded-2xl border border-blue-900/70 bg-[#0b223d] p-5">
                <Icon className="h-6 w-6 text-cyan-300" />
                <h2 className="mt-4 font-semibold text-lg">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-blue-900/70 bg-[#0b223d] p-10 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-4 border-cyan-300/25 border-t-cyan-300 animate-spin" />
            <p className="mt-4 text-slate-300">Listening for a fresh AIS position for MMSI {mmsi}…</p>
          </div>
        )}

        {result && (
          <div className="grid xl:grid-cols-[1.1fr_.9fr] gap-6">
            <div className="overflow-hidden rounded-2xl border border-blue-900/70 bg-[#0b223d]">
              <div className="p-5 border-b border-blue-900/60">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Live vessel position</p>
                <h2 className="mt-1 text-2xl font-bold">{result.shipName?.trim() || "AIS Vessel"}</h2>
                <p className="mt-1 text-slate-400">MMSI {result.mmsi}</p>
              </div>
              <iframe title="Vessel position map" src={mapUrl} className="w-full h-[460px] border-0" loading="lazy" />
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Metric icon={MapPin} label="Position" value={`${result.latitude.toFixed(5)}, ${result.longitude.toFixed(5)}`} />
                <Metric icon={Gauge} label="Speed" value={result.sog != null ? `${result.sog.toFixed(1)} kn` : "Not reported"} />
                <Metric icon={Compass} label="Course" value={result.cog != null ? `${result.cog.toFixed(1)}°` : "Not reported"} />
                <Metric icon={Ship} label="Heading" value={result.heading != null && result.heading <= 360 ? `${result.heading}°` : "Not reported"} />
                <Metric icon={Clock3} label="Received" value={new Date(result.receivedAt).toLocaleString()} />
                <Metric icon={Wifi} label="Data confidence" value="Fresh AIS observation" />
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                <h3 className="font-semibold text-cyan-100">DMA Intelligence Layer</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  This free MVP starts with live position and motion. Next phases can add vessel-name/IMO search, voyage history, ETA variance, route risk, destination-port context and estimated emissions once we persist AIS events in Supabase.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-900/70 bg-[#0b223d] p-5 text-xs leading-relaxed text-slate-400">
                AIS information is provided for situational awareness and analytics only. It is not intended for navigation, collision avoidance or safety-critical decisions. Coverage depends on participating AIS receivers and vessel transmissions.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-900/70 bg-[#0b223d] p-4">
      <Icon className="h-5 w-5 text-cyan-300" />
      <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-100">{value}</div>
    </div>
  );
}
