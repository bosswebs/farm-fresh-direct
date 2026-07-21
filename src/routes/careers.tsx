import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
  Search,
  Filter,
  Building2,
  Award,
  Sparkles,
  FileText,
  User,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/lib/i18n";
import {
  getJobPostings,
  submitJobApplication,
  subscribeCareers,
  type JobPosting,
  type JobApplication,
} from "@/lib/careers-store";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Internships — Deacomart Ltd" },
      {
        name: "description",
        content:
          "Join Deacomart Ltd — driving sustainable agribusiness, cold-chain logistics, food safety, and data transformation across Rwanda.",
      },
    ],
  }),
  component: CareersPage,
});

export function CareersPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [applicant, setApplicant] = useState({
    name: "",
    email: "",
    phone: "",
    coverNote: "",
    resumeUrl: "",
  });
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const loadJobs = () => {
      const allJobs = getJobPostings();
      setJobs(allJobs.filter((j) => j.status === "active"));
    };
    loadJobs();
    return subscribeCareers(loadJobs);
  }, []);

  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDepartment === "all" || job.department === selectedDepartment;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedJob) return;

    setBusy(true);
    setTimeout(() => {
      const app = submitJobApplication({
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        candidateName: applicant.name,
        candidateEmail: applicant.email,
        candidatePhone: applicant.phone,
        resumeUrl: applicant.resumeUrl,
        coverNote: applicant.coverNote,
      });

      setBusy(false);
      setSubmittedApp(app);
      setApplicant({ name: "", email: "", phone: "", coverNote: "", resumeUrl: "" });
    }, 600);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <Briefcase className="w-4 h-4 text-leaf" /> {t("careers.badge")}
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.08] font-display">
            {t("careers.title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {t("careers.subtitle")}
          </p>

          {/* Quick Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm text-center">
              <div className="text-2xl font-extrabold text-leaf font-display">{jobs.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Active Job Openings</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm text-center">
              <div className="text-2xl font-extrabold text-leaf font-display">30 Districts</div>
              <div className="text-xs text-muted-foreground mt-0.5">National Impact</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm text-center">
              <div className="text-2xl font-extrabold text-leaf font-display">GAP & FDA</div>
              <div className="text-xs text-muted-foreground mt-0.5">Quality Standards</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm text-center">
              <div className="text-2xl font-extrabold text-leaf font-display">100%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Fair Value Distribution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Search */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Search & Department Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search job title, keyword, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-input bg-card text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedDepartment("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedDepartment === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All Departments ({jobs.length})
            </button>
            {departments.map((dept) => {
              const count = jobs.filter((j) => j.department === dept).length;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedDepartment === dept
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-3xl p-8 max-w-lg mx-auto">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold font-display">No Matching Positions Found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search criteria or select another department tab.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-leaf/10 text-leaf text-xs font-bold hover:bg-leaf hover:text-primary-foreground transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-card border border-border hover:border-leaf/50 transition-all flex flex-col justify-between shadow-[var(--shadow-soft)] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-leaf/10 text-leaf border border-leaf/20">
                      {job.department}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-leaf" /> {job.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-leaf transition-colors font-display">
                    {job.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-leaf" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> {job.experience}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {job.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Posted: {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setSubmittedApp(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf hover:underline cursor-pointer"
                  >
                    View Details & Apply <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full bg-card border border-border rounded-3xl p-6 md:p-8 shadow-[var(--shadow-glow)] max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {submittedApp ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold font-display text-foreground">Application Received!</h3>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Tracking ID:</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">{submittedApp.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="font-semibold text-foreground">{submittedApp.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Candidate:</span>
                    <span className="font-semibold text-foreground">{submittedApp.candidateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold text-foreground">{submittedApp.candidateEmail}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your application has been stored in Deacomart’s recruitment database. Our HR selection team will review your profile and contact you within 3 business days.
                </p>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-leaf/10 text-leaf border border-leaf/20">
                    {selectedJob.department}
                  </span>
                  <h2 className="text-2xl font-bold font-display mt-2">{selectedJob.title}</h2>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-leaf" /> {selectedJob.location}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-leaf" /> {selectedJob.type}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border text-xs">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-leaf" /> Key Responsibilities:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>

                  <div className="font-bold text-foreground flex items-center gap-1.5 pt-2 border-t border-border">
                    <Award className="w-4 h-4 text-amber-500" /> Required Qualifications:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                    {selectedJob.qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleApply} className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-bold font-display flex items-center gap-2">
                    <FileText className="w-4 h-4 text-leaf" /> Submit Candidate Application
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. UWASE Clarisse"
                          value={applicant.name}
                          onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                          className="flex h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +250 788 123 456"
                          value={applicant.phone}
                          onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                          className="flex h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. clarisse@gmail.com"
                        value={applicant.email}
                        onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                        className="flex h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      LinkedIn Profile or CV Link *
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/profile or Google Drive CV link"
                        value={applicant.resumeUrl}
                        onChange={(e) => setApplicant({ ...applicant, resumeUrl: e.target.value })}
                        className="flex h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Brief Cover Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Highlight relevant agronomy, supply chain, or technical experience..."
                      value={applicant.coverNote}
                      onChange={(e) => setApplicant({ ...applicant, coverNote: e.target.value })}
                      className="flex w-full rounded-xl border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-[var(--shadow-soft)]"
                  >
                    {busy ? "Storing Candidate Application…" : "Submit Application"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
