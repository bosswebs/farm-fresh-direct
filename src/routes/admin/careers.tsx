import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  ExternalLink,
  Search,
  Filter,
  Users,
  Building2,
  FileText,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import {
  getJobPostings,
  getJobApplications,
  saveJobPosting,
  deleteJobPosting,
  updateApplicationStatus,
  deleteJobApplication,
  subscribeCareers,
  type JobPosting,
  type JobApplication,
} from "@/lib/careers-store";

export const Route = createFileRoute("/admin/careers")({
  head: () => ({
    meta: [{ title: "Careers & Recruitment Management — Admin Dashboard" }],
  }),
  component: AdminCareersPage,
});

function AdminCareersPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<"applications" | "postings">("applications");
  
  // Job modal state
  const [editingJob, setEditingJob] = useState<Partial<JobPosting> | null>(null);
  const [jobForm, setJobForm] = useState({
    id: "",
    title: "",
    department: "Agronomy & Food Safety",
    location: "Kigali & District Field Hubs",
    type: "Full-Time" as JobPosting["type"],
    experience: "2+ Years",
    summary: "",
    responsibilities: "",
    qualifications: "",
    status: "active" as JobPosting["status"],
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    const loadData = () => {
      setJobs(getJobPostings());
      setApplications(getJobApplications());
    };
    loadData();
    return subscribeCareers(loadData);
  }, []);

  const openNewJobModal = () => {
    setEditingJob({});
    setJobForm({
      id: "",
      title: "",
      department: "Agronomy & Food Safety",
      location: "Kigali HQ",
      type: "Full-Time",
      experience: "2+ Years",
      summary: "",
      responsibilities: "Conduct agronomic audits\nTrain farmer cooperative leaders\nManage quality verification",
      qualifications: "BSc in Agronomy or Food Science\nFluent in English & Kinyarwanda",
      status: "active",
    });
  };

  const openEditJobModal = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      summary: job.summary,
      responsibilities: job.responsibilities.join("\n"),
      qualifications: job.qualifications.join("\n"),
      status: job.status,
    });
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    const respArray = jobForm.responsibilities
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const qualArray = jobForm.qualifications
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    saveJobPosting({
      id: jobForm.id || undefined,
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      type: jobForm.type,
      experience: jobForm.experience,
      summary: jobForm.summary,
      responsibilities: respArray.length > 0 ? respArray : ["General responsibilities"],
      qualifications: qualArray.length > 0 ? qualArray : ["Relevant qualifications"],
      status: jobForm.status,
    });

    setEditingJob(null);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteJobPosting(id);
    }
  };

  const handleDeleteApp = (id: string) => {
    if (confirm("Remove candidate application entry?")) {
      deleteJobApplication(id);
      if (selectedApp?.id === id) setSelectedApp(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const shortlistedCount = applications.filter((a) => a.status === "shortlisted").length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header & Navigation Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/admin" className="hover:text-foreground">Admin Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Careers & Recruitment</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-leaf" /> Careers & Recruitment Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage job postings, review applicant profiles, and shortlist top agribusiness talent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNewJobModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Create Job Posting
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Active Job Openings <Building2 className="w-4 h-4 text-leaf" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 font-display">{activeJobsCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Total Applications <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 font-display">{applications.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Shortlisted Candidates <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2 font-display">{shortlistedCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            Departments Recruiting <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 font-display">
            {new Set(jobs.map((j) => j.department)).size}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "applications"
              ? "border-leaf text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("postings")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "postings"
              ? "border-leaf text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Job Postings ({jobs.length})
        </button>
      </div>

      {/* Applications Tab Content */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, email or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Tracking ID</th>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Target Position</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No candidate applications found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-primary">{app.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-foreground">{app.candidateName}</div>
                          <div className="text-[11px] text-muted-foreground">{app.candidateEmail}</div>
                        </td>
                        <td className="p-4 font-medium text-foreground">{app.jobTitle}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-4">
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value as JobApplication["status"])}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border ${
                              app.status === "shortlisted"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                                : app.status === "reviewed"
                                ? "bg-blue-500/10 text-blue-700 border-blue-500/30"
                                : app.status === "rejected"
                                ? "bg-red-500/10 text-red-700 border-red-500/30"
                                : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-2.5 py-1 rounded-lg bg-leaf/10 text-leaf font-bold hover:bg-leaf hover:text-primary-foreground transition-all cursor-pointer"
                          >
                            View CV
                          </button>
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="p-1 text-muted-foreground hover:text-red-500 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Job Postings Tab Content */}
      {activeTab === "postings" && (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between shadow-[var(--shadow-soft)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-leaf/10 text-leaf">
                    {job.department}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      job.status === "active"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                        : "bg-gray-500/10 text-gray-600 border-gray-500/30"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground font-display">{job.title}</h3>
                <div className="mt-1 text-xs text-muted-foreground">
                  {job.location} · {job.type} · Exp: {job.experience}
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {job.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Created: {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditJobModal(job)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-leaf" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-glow)] space-y-4">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-leaf/10 text-leaf">
                Application Review
              </span>
              <h2 className="text-xl font-bold font-display">{selectedApp.candidateName}</h2>
              <p className="text-xs text-muted-foreground">Target: {selectedApp.jobTitle}</p>
            </div>

            <div className="space-y-2 text-xs bg-muted/40 p-4 rounded-2xl border border-border">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-leaf shrink-0" />
                <a href={`mailto:${selectedApp.candidateEmail}`} className="hover:underline font-semibold">
                  {selectedApp.candidateEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-leaf shrink-0" />
                <span className="font-semibold">{selectedApp.candidatePhone}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-bold hover:underline truncate"
                >
                  {selectedApp.resumeUrl}
                </a>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-foreground">Cover Note / Summary:</div>
              <p className="text-muted-foreground leading-relaxed bg-background p-3 rounded-xl border border-border italic">
                "{selectedApp.coverNote || "No cover note provided."}"
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <select
                value={selectedApp.status}
                onChange={(e) => {
                  const newStatus = e.target.value as JobApplication["status"];
                  updateApplicationStatus(selectedApp.id, newStatus);
                  setSelectedApp({ ...selectedApp, status: newStatus });
                }}
                className="h-9 px-3 rounded-xl border border-input bg-card text-xs font-semibold"
              >
                <option value="pending">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-glow)] max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setEditingJob(null)}
              className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold font-display">
              {jobForm.id ? "Edit Job Posting" : "Create New Job Posting"}
            </h2>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Cold-Chain Operations Specialist"
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Department *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Type *</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as JobPosting["type"] })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Location *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Experience *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={jobForm.summary}
                  onChange={(e) => setJobForm({ ...jobForm, summary: e.target.value })}
                  placeholder="Overview of position responsibilities and impact..."
                  className="w-full p-3 rounded-xl border border-input bg-background"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Responsibilities (1 per line)</label>
                <textarea
                  rows={3}
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  className="w-full p-3 rounded-xl border border-input bg-background font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-muted-foreground mb-1 block">Qualifications (1 per line)</label>
                <textarea
                  rows={3}
                  value={jobForm.qualifications}
                  onChange={(e) => setJobForm({ ...jobForm, qualifications: e.target.value })}
                  className="w-full p-3 rounded-xl border border-input bg-background font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-bold uppercase text-[10px] text-muted-foreground">Status:</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as JobPosting["status"] })}
                    className="h-8 px-2 rounded-lg border border-input bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
                >
                  Save Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
