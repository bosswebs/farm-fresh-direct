import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, Calendar, FileText, CheckCircle, ArrowRight, User, Mail, Phone, Layers, Info, Check, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { bookConsultancy, formatRWF, WHATSAPP_LINK } from "@/lib/products-store";

export const Route = createFileRoute("/consultancy")({
  head: () => ({
    meta: [
      { title: "Agribusiness Consultancy & Audits — Deacomart Ltd" },
      { name: "description", content: "Professional agricultural project planning, value chain optimization, and food safety audits in Kigali and all Districts of Rwanda." },
    ],
  }),
  component: ConsultancyPage,
});

type Service = {
  id: string;
  title: string;
  priceEstimate: number;
  timeframe: string;
  deliverables: string[];
  description: string;
};

const SERVICES: Service[] = [
  {
    id: "s-1",
    title: "Food Safety Audits & Quality Assurance",
    priceEstimate: 350000,
    timeframe: "3-5 Days",
    description: "Prepare your production facility for national regulatory inspections and establish organic quality standards.",
    deliverables: ["Gap Analysis Report", "HACCP Manual Template", "Hygiene Standard Operating Procedures (SOPs)"],
  },
  {
    id: "s-2",
    title: "Agribusiness Business Planning & Feasibility",
    priceEstimate: 600000,
    timeframe: "2 Weeks",
    description: "Complete financial models, crop feasibility reviews, and bank-ready plans to secure agriculture credit.",
    deliverables: ["Cash Flow Projections", "Market Size Assessments", "Agronomic Feasibility Review"],
  },
  {
    id: "s-3",
    title: "Agricultural Project Design & Value Chain",
    priceEstimate: 800000,
    timeframe: "3 Weeks",
    description: "Optimize crop production logistics, reduce post-harvest waste, and build linkages with urban buyers.",
    deliverables: ["Logistics Optimization Flow", "Farmer Sourcing Agreements", "Waste Reduction Protocol"],
  },
  {
    id: "s-4",
    title: "Digital Transformation & ICT Solutions",
    priceEstimate: 500000,
    timeframe: "10 Days",
    description: "Deploy inventory tracing systems, setup WhatsApp commerce automation, and structure digital payment methods.",
    deliverables: ["WhatsApp Bot Workflow Config", "Inventory Dashboard Design", "Employee Digital Toolkit Training"],
  },
];

const CALENDAR_DAYS = [
  { day: "Mon", date: 22, month: "Jun" },
  { day: "Tue", date: 23, month: "Jun" },
  { day: "Wed", date: 24, month: "Jun" },
  { day: "Thu", date: 25, month: "Jun" },
  { day: "Fri", date: 26, month: "Jun" },
  { day: "Mon", date: 29, month: "Jun" },
];

const CALENDAR_HOURS = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

function ConsultancyPage() {
  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectScale, setProjectScale] = useState("Smallholder Cooperative");
  const [projectNotes, setProjectNotes] = useState("");
  
  // Calendar scheduling choices
  const [scheduledDay, setScheduledDay] = useState(CALENDAR_DAYS[0]);
  const [scheduledHour, setScheduledHour] = useState(CALENDAR_HOURS[0]);
  
  // Proposal generator variables
  const [proposalDistrict, setProposalDistrict] = useState("Nyarugenge");
  const [proposalCrop, setProposalCrop] = useState("Maize & Beans");
  const [proposalDraft, setProposalDraft] = useState<any | null>(null);
  
  const [bookingSuccess, setBookingSuccess] = useState(false);

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    const bookingDateStr = `${scheduledDay.day}, ${scheduledDay.month} ${scheduledDay.date} @ ${scheduledHour}`;
    
    bookConsultancy({
      serviceTitle: selectedService.title,
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      scale: projectScale,
      notes: projectNotes || `Scheduled date: ${bookingDateStr}`,
      date: `${scheduledDay.month} ${scheduledDay.date}, 2026`,
    });

    const message = `Hello Deacomart Consulting! I have requested an Agribusiness Consultation.\n\n` +
      `*Service:* ${selectedService.title}\n` +
      `*Name:* ${clientName}\n` +
      `*Preferred Date:* ${bookingDateStr}\n` +
      `*Project Scale:* ${projectScale}\n\n` +
      `Please let me know if this slot is confirmed. Thank you!`;

    setBookingSuccess(true);
    setTimeout(() => {
      window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, "_blank");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setProjectNotes("");
      setBookingSuccess(false);
    }, 1500);
  }

  function handleGenerateProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert("Please fill in the client contact info in the booking wizard first.");
      return;
    }

    setProposalDraft({
      title: `Advisory & Development Strategy Plan`,
      service: selectedService.title,
      client: clientName,
      location: `${proposalDistrict} District, Rwanda`,
      crops: proposalCrop,
      estimate: selectedService.priceEstimate,
      timeframe: selectedService.timeframe,
      scope: projectScale,
      actions: selectedService.deliverables,
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <Briefcase className="w-4 h-4 text-leaf" /> Professional Services
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.05]">
            Agribusiness Consulting & Food Safety Audits.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            Structured business planning, market access strategies, and certification guidelines. Build a transparent, scalable agricultural project in Rwanda.
          </p>
        </div>
      </section>

      {/* Page Body: Catalog, Wizard and Preview */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-2 gap-12">
        {/* Left Side: Services Catalog & Booking Wizard */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-leaf" /> Advisory Services Catalog
            </h2>
            <p className="text-muted-foreground text-sm">Select a consultancy module to activate the proposal builder and scheduler.</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {SERVICES.map((serv) => {
                const isSelected = selectedService.id === serv.id;
                return (
                  <button
                    key={serv.id}
                    onClick={() => {
                      setSelectedService(serv);
                      setProposalDraft(null); // reset preview on type change
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-[var(--shadow-soft)] ring-1 ring-primary"
                        : "border-border hover:border-leaf bg-card text-foreground"
                    }`}
                  >
                    <div>
                      <h3 className="font-display font-bold text-sm truncate">{serv.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{serv.description}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-border/60 flex items-center justify-between w-full text-xs font-semibold">
                      <span>Rate: {formatRWF(serv.priceEstimate)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{serv.timeframe}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Wizard form */}
          <form onSubmit={handleBooking} className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-5">
            <h3 className="font-display font-bold text-lg text-foreground">Agribusiness Booking Wizard</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Client Name</span>
                <div className="mt-1.5 relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Jean Bosco"
                    className="input pl-9 text-sm"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</span>
                <div className="mt-1.5 relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+250 780 165 257"
                    className="input pl-9 text-sm"
                  />
                </div>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Email Address</span>
                <div className="mt-1.5 relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="bosco@deacomart.com"
                    className="input pl-9 text-sm"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Project Scale</span>
                <select
                  value={projectScale}
                  onChange={(e) => setProjectScale(e.target.value)}
                  className="input mt-1.5 text-sm font-semibold"
                >
                  <option value="Smallholder Cooperative">Smallholder Cooperative</option>
                  <option value="Commercial Farm">Commercial Estate</option>
                  <option value="Processing Facility">Food Factory / Processor</option>
                  <option value="Supermarket / Retailer">Supermarket Chain</option>
                </select>
              </label>
            </div>

            {/* Calendar Grid Selector */}
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-leaf" /> Select Consultation Slot
              </span>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                {CALENDAR_DAYS.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setScheduledDay(day)}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                      scheduledDay.date === day.date
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:border-leaf"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold opacity-80">{day.day}</div>
                    <div className="text-sm font-extrabold mt-0.5">{day.date}</div>
                    <div className="text-[9px] opacity-75">{day.month}</div>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {CALENDAR_HOURS.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setScheduledHour(hour)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      scheduledHour === hour
                        ? "bg-leaf text-primary-foreground border-leaf"
                        : "bg-background border-border text-foreground hover:border-leaf"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-2 text-emerald-500 font-semibold animate-pulse text-sm">
                Slot Booked! Redirecting to WhatsApp...
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Schedule Consultation Slot
              </button>
            )}
          </form>
        </div>

        {/* Right Side: Interactive Proposal Generator Preview */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-leaf" /> Instant Proposal Generator
            </h3>
            <p className="text-xs text-muted-foreground">
              Define crop and regional parameters below to draft an immediate project proposal scope statement.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Target District</span>
                <select
                  value={proposalDistrict}
                  onChange={(e) => setProposalDistrict(e.target.value)}
                  className="input mt-1 text-xs"
                >
                  <option value="Musanze">Musanze (Northern)</option>
                  <option value="Nyagatare">Nyagatare (Eastern)</option>
                  <option value="Nyarugenge">Nyarugenge (Kigali)</option>
                  <option value="Huye">Huye (Southern)</option>
                  <option value="Nyabihu">Nyabihu (Western)</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Core Crops / Product</span>
                <input
                  value={proposalCrop}
                  onChange={(e) => setProposalCrop(e.target.value)}
                  placeholder="e.g. Avocado & Passion juice"
                  className="input mt-1 text-xs"
                />
              </label>
            </div>

            <button
              onClick={handleGenerateProposal}
              className="w-full py-2.5 rounded-xl border border-primary text-primary font-semibold text-xs hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            >
              Draft Proposal Blueprint
            </button>
          </div>

          {/* Render generated draft */}
          {proposalDraft ? (
            <div className="bg-card border border-dashed border-primary rounded-3xl p-6 shadow-[var(--shadow-glow)] animate-in zoom-in-95 duration-300 relative overflow-hidden max-h-[500px] overflow-y-auto">
              
              {/* Draft badge */}
              <div className="absolute top-4 right-4 text-[9px] font-mono font-bold text-primary border border-primary px-2 py-0.5 rounded rotate-12">
                PROPOSAL DRAFT
              </div>

              <div className="space-y-4 text-xs font-mono text-foreground/80">
                <div className="text-center pb-4 border-b border-border">
                  <div className="font-extrabold text-base tracking-widest text-primary">DEACOMART LTD ADVISORY</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">Kigali, Rwanda · TIN 150039210</div>
                </div>

                <div className="space-y-1">
                  <div><strong>Document:</strong> Agribusiness Advisory Proposal</div>
                  <div><strong>Target Project:</strong> Sustainable Development for {proposalDraft.crops}</div>
                  <div><strong>Client Entity:</strong> {proposalDraft.client} ({proposalDraft.scope})</div>
                  <div><strong>Project Zone:</strong> {proposalDraft.location}</div>
                </div>

                <div className="pt-2 border-t border-border">
                  <span className="font-extrabold block text-primary mb-1">1. Objective Scope</span>
                  <p className="leading-relaxed text-[11px]">
                    To provide expert consultancy support under the Deacomart pillar: <strong>"{proposalDraft.service}"</strong>. This advisory targets upgrading yield standards, reducing post-harvest waste, and connecting key producers to local supermarket chains.
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <span className="font-extrabold block text-primary mb-1">2. Delivery Outline & Milestones</span>
                  <ul className="space-y-1 pl-4 list-disc">
                    {proposalDraft.actions.map((act: string) => (
                      <li key={act}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-border bg-secondary/35 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-extrabold block text-foreground">Estimated Fee</span>
                    <span className="text-[10px] text-muted-foreground">Standard pricing</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-primary">{formatRWF(proposalDraft.estimate)}</span>
                    <div className="text-[9px] text-muted-foreground">Est. Time: {proposalDraft.timeframe}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border text-[9px] text-muted-foreground text-center">
                  Terms of Deacomart Ltd apply. LPO/Confirmation required. Payment details: Equity Bank (4014201311299).
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/30 border border-border rounded-3xl p-10 text-center text-muted-foreground">
              <Info className="w-8 h-8 mx-auto opacity-50 mb-2" />
              <p className="text-sm font-semibold">No Proposal Drafted Yet</p>
              <p className="text-xs mt-1">Fill client details and click "Draft Proposal Blueprint" to generate the contract layout details.</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
