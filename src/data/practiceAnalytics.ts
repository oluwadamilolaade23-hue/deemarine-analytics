export type LabId = 'ports' | 'fleet' | 'emissions';
export type Metric = { key: string; label: string; unit: string; aggregation: 'sum' | 'mean'; description: string };
export type PracticeRow = { date: string; entity: string; values: Record<string, number> };
export type PracticeLab = { id: LabId; title: string; subtitle: string; entityLabel: string; entities: string[]; metrics: Metric[]; rows: PracticeRow[] };
const round = (n: number) => Math.round(n * 100) / 100;
const metrics: Record<LabId, Metric[]> = {
  ports: [
    { key: 'calls', label: 'Vessel calls', unit: 'calls', aggregation: 'sum', description: 'Number of vessel calls recorded for one fictional terminal on one day.' },
    { key: 'cargo', label: 'Cargo handled', unit: 'TEU', aggregation: 'sum', description: 'Container volume in twenty-foot equivalent units.' },
    { key: 'turnaround', label: 'Mean turnaround', unit: 'hours', aggregation: 'mean', description: 'Daily terminal mean from arrival to departure. Dashboard averages daily terminal means equally; not weighted by vessel calls.' },
    { key: 'waiting', label: 'Mean waiting time', unit: 'hours', aggregation: 'mean', description: 'Daily terminal mean wait before berthing; dashboard uses an unweighted mean of daily terminal means.' },
  ],
  fleet: [
    { key: 'distance', label: 'Distance sailed', unit: 'nm', aggregation: 'sum', description: 'Daily vessel distance in nautical miles.' },
    { key: 'fuel', label: 'Fuel consumed', unit: 'tonnes', aggregation: 'sum', description: 'Simulated daily vessel fuel consumption in metric tonnes.' },
    { key: 'operating', label: 'Operating time', unit: 'hours', aggregation: 'sum', description: 'Hours of operation per vessel per day; aggregated totals are vessel-hours.' },
    { key: 'downtime', label: 'Downtime', unit: 'hours', aggregation: 'sum', description: 'Hours unavailable per vessel per day; aggregated totals are vessel-hours.' },
  ],
  emissions: [
    { key: 'fuel', label: 'Fuel consumed', unit: 'tonnes', aggregation: 'sum', description: 'Simulated daily fuel use by a fictional terminal activity.' },
    { key: 'co2', label: 'Estimated CO₂', unit: 'tonnes CO₂', aggregation: 'sum', description: 'Illustrative combustion estimate: fuel tonnes × an assumed factor of 3.2 tonnes CO₂ per tonne of fuel. Excludes upstream emissions and other greenhouse gases; not an official inventory.' },
    { key: 'energy', label: 'Electricity used', unit: 'kWh', aggregation: 'sum', description: 'Simulated daily electricity consumption; not included in the fuel-only CO₂ estimate.' },
  ],
};
const definitions = [
  { id: 'ports' as const, title: 'Port Operations', subtitle: 'Explore congestion, vessel calls and cargo flow.', entityLabel: 'Terminal', entities: ['Harbour Alpha', 'Harbour Bravo', 'Harbour Charlie'] },
  { id: 'fleet' as const, title: 'Fleet Performance', subtitle: 'Compare fuel use, distance and vessel availability.', entityLabel: 'Vessel', entities: ['DMA Voyager', 'DMA Horizon', 'DMA Pioneer'] },
  { id: 'emissions' as const, title: 'Emissions & Energy', subtitle: 'Connect fuel use with an illustrative carbon estimate.', entityLabel: 'Activity', entities: ['Cargo handling', 'Harbour craft', 'Yard transport'] },
];
export const practiceLabs: PracticeLab[] = definitions.map(def => ({
  ...def, metrics: metrics[def.id],
  rows: Array.from({ length: 30 }, (_, day) => def.entities.map((entity, e) => {
    const wave = ((day * 7 + e * 11) % 17) / 17;
    const fuel = round(9 + e * 5 + wave * 8);
    let values: Record<string, number>;
    if (def.id === 'ports') values = { calls: 4 + e * 2 + day % 5, cargo: 480 + e * 170 + day % 7 * 62, turnaround: round(15 + e * 4 + wave * 12), waiting: round(1.5 + e * 1.2 + wave * 5) };
    else if (def.id === 'fleet') {
      const downtime = round((day + e) % 9 === 0 ? 5 + wave * 3 : wave * 1.5);
      values = { distance: round(180 + e * 45 + wave * 130), fuel, operating: round(24 - downtime), downtime };
    } else values = { fuel, co2: round(fuel * 3.2), energy: Math.round(900 + e * 450 + wave * 700) };
    return { date: `2026-09-${String(day + 1).padStart(2, '0')}`, entity, values };
  })).flat(),
}));
export function filterRows(lab: PracticeLab, entity: string, start: string, end: string) {
  return lab.rows.filter(row => (entity === 'all' || row.entity === entity) && row.date >= start && row.date <= end);
}
export function aggregate(rows: PracticeRow[], metric: Metric) {
  if (!rows.length) return 0;
  const sum = rows.reduce((total, row) => total + row.values[metric.key], 0);
  return metric.aggregation === 'mean' ? sum / rows.length : sum;
}
export function chartRows(rows: PracticeRow[], metric: Metric, groupBy: 'date' | 'entity') {
  const groups = new Map<string, PracticeRow[]>();
  rows.forEach(row => { const key = row[groupBy]; groups.set(key, [...(groups.get(key) || []), row]); });
  return Array.from(groups, ([name, grouped]) => ({ name, value: round(aggregate(grouped, metric)) })).sort((a, b) => a.name.localeCompare(b.name));
}
export function csvFor(lab: PracticeLab, rows: PracticeRow[]) {
  const quote = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [ ['date', lab.entityLabel.toLowerCase(), ...lab.metrics.map(m => `${m.key} (${m.unit})`)], ...rows.map(r => [r.date, r.entity, ...lab.metrics.map(m => r.values[m.key])]) ].map(row => row.map(quote).join(',')).join('\r\n');
}
