export type JobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Contract" | "Internship";
  experience: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  status: "active" | "closed";
  createdAt: string;
};

export type JobApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl: string;
  coverNote: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  appliedAt: string;
};

const JOBS_STORAGE_KEY = "deacomart.careers.jobs.v1";
const APPLICATIONS_STORAGE_KEY = "deacomart.careers.applications.v1";
const CAREERS_EVENT = "agrimarket:careers-changed";

export const INITIAL_JOB_POSTINGS: JobPosting[] = [
  {
    id: "job-1",
    title: "Senior Agronomist & Quality Assurance Officer",
    department: "Agronomy & Food Safety",
    location: "Kigali & District Field Hubs",
    type: "Full-Time",
    experience: "3+ Years",
    summary: "Oversee crop quality inspections, train cooperative leaders in GAP protocols, and manage cold-chain pre-shipment sanitization.",
    responsibilities: [
      "Conduct field quality audits across partnered farmer cooperatives in Northern & Western provinces.",
      "Implement post-harvest decay prevention protocols and temperature compliance.",
      "Verify GAP (Good Agricultural Practices) compliance before marketplace aggregation.",
      "Collaborate with Rwanda FDA and RSB inspectors during export batch certification."
    ],
    qualifications: [
      "BSc or MSc in Agronomy, Crop Science, or Food Technology.",
      "Proven experience in Rwandan horticultural supply chains.",
      "Fluent in Kinyarwanda and English.",
      "Valid driving license (Cat. A or B) preferred."
    ],
    status: "active",
    createdAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "job-2",
    title: "Cold-Chain Logistics Coordinator",
    department: "Supply Chain & Operations",
    location: "Kigali Distribution Center",
    type: "Full-Time",
    experience: "2+ Years",
    summary: "Manage daily fleet dispatch, temperature monitoring logs, and delivery fulfillment to supermarket chains and hotels.",
    responsibilities: [
      "Schedule refrigerated truck routes for daily hotel and supermarket deliveries.",
      "Monitor digital temperature logs and maintain cold-room storage parameters.",
      "Coordinate LPO receipt verifications with commercial clients.",
      "Optimize last-mile delivery routes across Kigali City."
    ],
    qualifications: [
      "Degree or Diploma in Supply Chain Management or Business Administration.",
      "Experience with fleet management software and logistics tracking.",
      "Strong problem-solving and communication skills.",
      "Ability to thrive in fast-paced perishable logistics environments."
    ],
    status: "active",
    createdAt: "2026-07-05T09:30:00.000Z"
  },
  {
    id: "job-3",
    title: "Agribusiness Data Analyst (Stata & M&E)",
    department: "Data & Transformation",
    location: "Kigali HQ",
    type: "Full-Time",
    experience: "1+ Years / Fresh MSc Graduates",
    summary: "Analyze yield metrics, post-harvest loss stats, and market price trends to power evidence-based farm management.",
    responsibilities: [
      "Clean and model agricultural data using Stata and Excel statistical tools.",
      "Build impact dashboards tracking farmer revenue flows and yield improvements.",
      "Deliver data literacy workshops to cooperative managers.",
      "Prepare monthly monitoring & evaluation reports for agricultural development partners."
    ],
    qualifications: [
      "BSc/MSc in Agricultural Economics, Statistics, or Applied Mathematics.",
      "Proficiency in Stata, R, or Python data visualization.",
      "Strong analytical mindset and passion for rural development.",
      "Excellent report-writing skills in English."
    ],
    status: "active",
    createdAt: "2026-07-10T11:00:00.000Z"
  },
  {
    id: "job-4",
    title: "Institutional Sales Specialist (HORECA & Retail)",
    department: "Commercial & Trade",
    location: "Kigali City",
    type: "Full-Time",
    experience: "2+ Years",
    summary: "Expand wholesale partnerships with major hotels, restaurants, caterers (HORECA), and supermarket chains.",
    responsibilities: [
      "Onboard commercial buyers for fresh produce and Deacomart beverages.",
      "Negotiate supply agreements and manage LPO invoicing workflows.",
      "Maintain high customer satisfaction and repeat order volume.",
      "Identify emerging market demand for niche horticultural crops."
    ],
    qualifications: [
      "Bachelor's degree in Marketing, Business, or Agribusiness.",
      "Established network in Kigali's hospitality or retail food sector.",
      "Persuasive negotiation and relationship management skills."
    ],
    status: "active",
    createdAt: "2026-07-12T14:15:00.000Z"
  },
  {
    id: "job-5",
    title: "Post-Harvest Management Intern",
    department: "Agronomy & Food Safety",
    location: "Musanze & Nyagatare Hubs",
    type: "Internship",
    experience: "Entry Level / Graduate",
    summary: "Gain hands-on training in fresh produce sorting, grading, cold-storage handling, and cooperative extension.",
    responsibilities: [
      "Assist agronomists in sorting, grading, and weighing fresh produce at collection centers.",
      "Record batch humidity and temperature readings.",
      "Support farmer registration and digital record keeping."
    ],
    qualifications: [
      "Recent graduate in Agriculture, Food Science, or Rural Development.",
      "High enthusiasm for hands-on field experience.",
      "Fluent in Kinyarwanda."
    ],
    status: "active",
    createdAt: "2026-07-15T10:00:00.000Z"
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-101",
    jobId: "job-1",
    jobTitle: "Senior Agronomist & Quality Assurance Officer",
    candidateName: "UWASE Clarisse",
    candidateEmail: "clarisse.uwase@gmail.com",
    candidatePhone: "+250 788 123 456",
    resumeUrl: "https://linkedin.com/in/clarisse-uwase-agri",
    coverNote: "I have 4 years experience leading quality control for horticultural exports in Musanze. Excited to scale GAP adoption with Deacomart.",
    status: "shortlisted",
    appliedAt: "2026-07-16T14:20:00.000Z"
  },
  {
    id: "app-102",
    jobId: "job-2",
    jobTitle: "Cold-Chain Logistics Coordinator",
    candidateName: "MUGISHA Jean Paul",
    candidateEmail: "jp.mugisha@outlook.com",
    candidatePhone: "+250 783 987 654",
    resumeUrl: "https://drive.google.com/file/d/cv-jeanpaul/view",
    coverNote: "Managed fleet operations for 3 years at Kigali Logistics Hub. Familiar with cold-chain temperature telemetry.",
    status: "reviewed",
    appliedAt: "2026-07-18T09:45:00.000Z"
  }
];

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CAREERS_EVENT));
  }
}

export function getJobPostings(): JobPosting[] {
  if (typeof window === "undefined") return INITIAL_JOB_POSTINGS;
  try {
    const raw = window.localStorage.getItem(JOBS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOB_POSTINGS));
      return INITIAL_JOB_POSTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_JOB_POSTINGS;
  }
}

export function saveJobPosting(job: Omit<JobPosting, "id" | "createdAt"> & { id?: string }): JobPosting {
  const jobs = getJobPostings();
  let updatedJob: JobPosting;

  if (job.id) {
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index !== -1) {
      updatedJob = { ...jobs[index], ...job };
      jobs[index] = updatedJob;
    } else {
      updatedJob = {
        ...job,
        id: job.id,
        createdAt: new Date().toISOString(),
      } as JobPosting;
      jobs.unshift(updatedJob);
    }
  } else {
    updatedJob = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as JobPosting;
    jobs.unshift(updatedJob);
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    notify();
  }

  return updatedJob;
}

export function deleteJobPosting(id: string) {
  const jobs = getJobPostings().filter((j) => j.id !== id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    notify();
  }
}

export function getJobApplications(): JobApplication[] {
  if (typeof window === "undefined") return INITIAL_APPLICATIONS;
  try {
    const raw = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function submitJobApplication(app: Omit<JobApplication, "id" | "status" | "appliedAt">): JobApplication {
  const applications = getJobApplications();
  const newApp: JobApplication = {
    ...app,
    id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "pending",
    appliedAt: new Date().toISOString(),
  };

  applications.unshift(newApp);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
    notify();
  }

  return newApp;
}

export function updateApplicationStatus(id: string, status: JobApplication["status"]) {
  const apps = getJobApplications().map((a) => (a.id === id ? { ...a, status } : a));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
    notify();
  }
}

export function deleteJobApplication(id: string) {
  const apps = getJobApplications().filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
    notify();
  }
}

export function subscribeCareers(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(CAREERS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CAREERS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
