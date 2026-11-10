import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Download, ExternalLink, Ship, Wrench } from "lucide-react";

const slug = "/blog/transforming-raw-operational-data-into-active-reliability";
const photos = {
  control: "https://unsplash.com/photos/nuMOBM0qtv4/download?force=true&w=1800",
  engine: "https://unsplash.com/photos/nuMOBM0qtv4/download?force=true&w=1400",
  machinery: "https://unsplash.com/photos/JKTTnxWhNeg/download?force=true&w=1400",
};

const paragraphs = [
  "As a Chief Engineer, I make daily decisions that affect the safety of the crew, the availability of the machinery and the cost of operating the vessel.",
  "Good decisions begin with understanding what the machinery is telling us: not simply the latest reading, but what has changed, why it matters and what needs checking.",
  "Fuel consumption, exhaust gas temperatures, engine load, pressures and cylinder oil feed rates each provide part of the picture. A single reading rarely tells the full story.",
  "The useful information is in the trend, especially when it is compared with engine load and previous performance readings.",
  "A steady rise in one cylinder’s exhaust temperature, or an increasing pressure differential between cylinders, is a signal to investigate before it develops into a more serious problem.",
  "A change in fuel consumption may also point to reduced engine efficiency.",
  "Cylinder oil parameters, together with drain oil analysis and inspections, help assess lubrication and wear in individual cylinders.",
  "These indications guide troubleshooting and adjustments within the engine manufacturer’s recommended limits, but they do not replace engineering judgement or physical checks.",
  "In my role as Chief Engineer, predictive maintenance supports 98% fleet uptime. DeeMarine Navigator brings operational trends and key figures into one connected dashboard for ship and shore teams.",
  "For a Chief Engineer, that means a clearer shared view of developing issues during discussions with the office, superintendents and technical teams.",
  "It also gives the Chief Engineer a stronger basis for requesting critical spares, planning an overhaul or asking for a maintenance window. Instead of a general request, the engineer can show what is changing, which checks supports the concern and what delay could mean for the vessel.The aim is to identify developing issues early enough to plan a response.",
  "Used well, predictive maintenance gives engineers time to act before a fault becomes an unplanned stop.",
];

function Photo({ src, alt, credit, link }: {src: string; alt: string; credit: string; link: string}) {
  return <figure className="my-10 overflow-hidden rounded-2xl bg-slate-100 print:break-inside-avoid">
    <img src={src} alt={alt} loading="lazy" className="h-72 w-full object-cover md:h-[390px]" />
    <figcaption className="px-4 py-2 text-xs text-slate-500">Documentary photograph: <a className="underline hover:text-blue-700" href={link} target="_blank" rel="noopener noreferrer">{credit} / Unsplash</a>. Illustrative only; not a portrait of the author.</figcaption>
  </figure>;
}

function Article() {
  return <article className="bg-white">
    <header className="bg-[#0b2039] text-white">
      <div className="container-max px-5 py-7 md:py-10"><Link to="/blog" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm"><ArrowLeft size={16}/> All Knowledge Insight Articles</Link></div>
      <div className="container-max grid gap-8 px-5 pb-12 md:grid-cols-2 md:items-center md:pb-20">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-200">Expert Knowledge Insights · Fleet Performance & Reliability</div>
          <h1 className="mb-6 max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">Transforming Raw Operational Data Into Active Reliability</h1>
          <div className="flex items-center gap-4">
            <img src="/uchenna-ogbonnaya-headshot.svg" alt="Portrait of Chief Engineer Uchenna Godwin Ogbonnaya Menestrel" className="h-20 w-20 flex-none rounded-full border-2 border-cyan-300 object-cover shadow-lg" />
            <div>
              <p className="text-lg font-semibold text-slate-100">Chief Engineer Uchenna Godwin Ogbonnaya Menestrel, MIMarEST</p>
              <p className="mt-1 text-sm text-slate-300">MCA III/2 Unlimited · Expert Knowledge Insights contributor</p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 print:hidden">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"><Download size={18}/> Save article as PDF</button>
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="rounded-lg border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10">Copy article link</button>
          </div>
        </div>
        <img className="h-72 w-full rounded-2xl object-cover shadow-2xl md:h-[430px]" src={photos.control} alt="Photograph of marine engine-room equipment" />
      </div>
    </header>
    <div className="container-max grid gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:py-20">
      <div className="max-w-3xl">
        <div className="mb-10 border-l-4 border-cyan-600 bg-slate-50 px-6 py-5 text-slate-700">
          <p className="font-semibold text-slate-900">From the engine room</p>
          <p className="mt-2 text-sm leading-7">An expert perspective on interpreting performance trends, investigating machinery anomalies, and communicating maintenance priorities across ship and shore teams.</p>
        </div>
        <div className="space-y-7 text-[17px] leading-[1.95] text-slate-800">
          {paragraphs.slice(0,4).map((p,i)=><p key={i}>{p}</p>)}
        </div>
        <Photo src={photos.engine} alt="Real ship main engine pipework and machinery" credit="iSawRed" link="https://unsplash.com/photos/a-row-of-pipes-lined-up-in-a-factory-nuMOBM0qtv4" />
        <div className="space-y-7 text-[17px] leading-[1.95] text-slate-800">
          {paragraphs.slice(4,8).map((p,i)=><p key={i+4}>{p}</p>)}
        </div>
        <Photo src={photos.machinery} alt="Actual compressor equipment in a container vessel engine room" credit="Bernd Dittrich" link="https://unsplash.com/photos/a-couple-of-green-machines-sitting-inside-of-a-building-JKTTnxWhNeg" />
        <div className="space-y-7 text-[17px] leading-[1.95] text-slate-800">
          {paragraphs.slice(8).map((p,i)=><p key={i+8}>{p}</p>)}
        </div>
        <section className="mt-12 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <img src="/uchenna-ogbonnaya-headshot.svg" alt="Chief Engineer Uchenna Godwin Ogbonnaya Menestrel" loading="lazy" className="h-28 w-28 flex-none rounded-2xl object-cover shadow-sm" />
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-cyan-700">Meet the author</p>
            <h2 className="text-xl font-bold text-slate-900">Chief Engineer Uchenna Godwin Ogbonnaya Menestrel, MIMarEST</h2>
            <p className="mt-2 leading-7 text-slate-700">An MCA III/2 Unlimited Chief Engineer with over 10 years of maritime experience across LNG and crude tankers, ferries, RoPax and offshore vessels. Recognised as NSML HSE Person of the Year 2024, she specialises in safe operations, machinery reliability and maintenance leadership.</p>
            <a href="https://www.linkedin.com/in/uchennaogbonnaya/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">Connect with the author on LinkedIn <ExternalLink size={15}/></a>
          </div>
        </section>
        <section className="mt-12 rounded-2xl bg-[#0e2e50] p-7 text-white print:hidden">
          <h2 className="text-2xl font-bold text-white">Explore more maritime knowledge</h2>
          <p className="my-3 text-slate-200">Read specialist perspectives on fleet reliability, maritime technology, decarbonization, ports and data-driven decisions.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-cyan-200 hover:text-white">Explore Knowledge Insight Articles <ArrowRight size={16}/></Link>
        </section>
        <div className="mt-10 text-xs leading-6 text-slate-500">
          <p>Photography: iSawRed and Bernd Dittrich / Unsplash (credited above). Photos illustrate marine engineering settings and do not depict the contributor.</p>
          <p>Original contributor text reproduced without substantive editing; PDF text ligatures are normalized for screen accessibility.</p>
        </div>
      </div>
      <aside className="hidden lg:block print:hidden"><div className="sticky top-28 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 text-cyan-700"><Wrench size={18}/><span className="text-sm font-semibold uppercase tracking-wide">Knowledge area</span></div>
        <h2 className="mt-3 text-xl font-bold text-slate-900">Fleet Performance & Reliability</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">Engine monitoring · Machinery trends · Maintenance planning · Engineering judgement</p>
        <div className="my-5 border-t border-slate-200" />
        <p className="text-xs text-slate-500">Expert Knowledge Insights series</p>
        <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline" to="/maritime-intelligence">Maritime Intelligence <ExternalLink size={14}/></Link>
      </div></aside>
    </div>
  </article>;
}

export default function Blog() {
  const { pathname } = useLocation();
  if (pathname === slug || pathname === slug + "/") return <Article/>;
  return <div className="bg-white">
    <section className="bg-[#0b2039] px-5 py-20 text-white"><div className="container-max">
      <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">DeeMarine Analytics · Knowledge Hub</p>
      <h1 className="max-w-3xl text-4xl font-bold text-white md:text-6xl">Knowledge Insight Articles</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Real-world perspectives from maritime engineers, captains, researchers and technical specialists—connecting experience at sea with better decisions on screen.</p>
    </div></section>
    <section className="container-max px-5 py-14 md:py-20">
      <div className="mb-7 flex items-center gap-3"><BookOpen className="text-cyan-700"/><h2 className="text-2xl font-bold text-slate-900">Featured Expert Insight</h2></div>
      <Link to={slug} className="group grid overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-xl md:grid-cols-[1.05fr_1fr]">
        <img src={photos.control} alt="Documentary photograph of shipboard machinery" className="h-72 w-full object-cover md:h-full md:min-h-[380px]" />
        <div className="flex flex-col justify-center p-8 md:p-11">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-cyan-700">Fleet Performance & Reliability</p>
          <h3 className="text-2xl font-bold leading-snug text-slate-900 group-hover:text-blue-800 md:text-3xl">Transforming Raw Operational Data Into Active Reliability</h3>
          <div className="mt-4 flex items-center gap-3"><img src="/uchenna-ogbonnaya-headshot.svg" alt="" className="h-12 w-12 rounded-full object-cover" /><p className="text-sm font-semibold text-slate-700">Chief Engineer Uchenna Godwin Ogbonnaya Menestrel</p></div>
          <p className="mt-5 leading-7 text-slate-600">From operational data to engineering action: a shipboard perspective on machinery trends, maintenance planning, and communication between vessel and shore teams.</p>
          <span className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-700">Read expert insight <ArrowRight size={18}/></span>
        </div>
      </Link>
      <div className="mt-16 rounded-2xl bg-slate-50 px-7 py-10">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Expert Knowledge Insights</h2>
        <p className="max-w-3xl leading-8 text-slate-600">This series welcomes professional perspectives on Fleet Performance & Reliability, Port & Supply Chain Intelligence, Maritime Safety, Energy & Decarbonization, Green Ports & Blue Economy, Maritime BI & AI, and Maritime Cybersecurity.</p>
        <Link to="/contact" className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline">Propose an article <ArrowRight size={16}/></Link>
      </div>
    </section>
  </div>;
}
