import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, GraduationCap, Video, Download, CheckCircle, Search, ArrowRight, BookOpen, Clock, Users, Play, ShieldAlert, X } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { registerForTraining, WHATSAPP_LINK } from "@/lib/products-store";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Farmer Training Academy & E-Learning — Deacomart Ltd" },
      { name: "description", content: "Empowering Rwandan farmers with agribusiness courses in sustainable agriculture, Hinga Ugwize, food safety, and tax declarations." },
    ],
  }),
  component: TrainingPage,
});

type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  modules: number;
  students: number;
  description: string;
  syllabus: string[];
};

const COURSES: Course[] = [
  {
    id: "c-1",
    title: "Modern Sustainable Agriculture",
    category: "Farming Practices",
    duration: "4 Weeks",
    modules: 6,
    students: 340,
    description: "Learn crop rotations, climate-smart irrigation, integrated pest management, and organic farming techniques tailored for Rwandan soils.",
    syllabus: ["Introduction to Soil Science", "Water Harvesting & Irrigation", "Organic Fertilizer & Compost", "Integrated Pest Control", "Climate-Smart Crops", "Sustainable Harvesting"],
  },
  {
    id: "c-2",
    title: "Hinga Ugwize — Maximum Yields",
    category: "Crop Management",
    duration: "3 Weeks",
    modules: 5,
    students: 420,
    description: "In collaboration with local initiatives, focus on high-yield practices for maize, beans, cassava, and Irish potatoes.",
    syllabus: ["Quality Seed Selection", "Sowing Distances & Depths", "Intercropping Systems", "Disease Identification", "Yield Forecasting"],
  },
  {
    id: "c-3",
    title: "Value Addition & Food Processing",
    category: "Enterprise Development",
    duration: "6 Weeks",
    modules: 8,
    students: 180,
    description: "Transform raw harvests into market-ready items. Focuses on juice extraction, tea blending, honey purification, and egg packaging.",
    syllabus: ["Principles of Value Addition", "Beverage Processing (Juices/Teas)", "Honey Extraction & Packaging", "Drying & Milling Grains", "Packaging Materials & Standards", "Cold Chain Preservation"],
  },
  {
    id: "c-4",
    title: "Food Safety & Quality Assurance Standards",
    category: "Compliance",
    duration: "2 Weeks",
    modules: 4,
    students: 210,
    description: "Master clean handling, contamination prevention, organic certification guidelines, and national compliance audits.",
    syllabus: ["Microbiology & Sanitation", "HACCP Principles", "Organic Certification Audits", "Traceability & Inspection Records"],
  },
  {
    id: "c-5",
    title: "Agribusiness Finance, Cooperatives & Tax Declaration",
    category: "Financial Literacy",
    duration: "4 Weeks",
    modules: 6,
    students: 290,
    description: "Build bookkeeping skills, cooperative leadership skills, register cooperative tax declarations, and access agrilenders.",
    syllabus: ["Agribusiness Financial Accounting", "Cooperative Governance", "Rwanda Tax Declaration & TIN Compliance", "Microfinance & Loan Inquiries", "Agribusiness Business Plan Outline"],
  },
];

const DOWNLOADS = [
  { title: "Rwandan Soil Preparation & Compost Guide (PDF)", size: "2.4 MB" },
  { title: "Organic Pesticides Preparation Manual (PDF)", size: "1.8 MB" },
  { title: "Deacomart Food Handling Safety Protocol (PDF)", size: "1.2 MB" },
  { title: "Cooperative Accounting Ledger Template (XLS)", size: "750 KB" },
];

const VIDEOS = [
  { id: "v1", title: "Video 1: Organic Fertilization Techniques", duration: "12 mins", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "v2", title: "Video 2: Seed Spacing & Sowing - Maize", duration: "8 mins", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "v3", title: "Video 3: Safe Post-Harvest Storage Solutions", duration: "15 mins", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0]);
  
  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDistrict, setRegDistrict] = useState("Kigali");
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Verification Checker State
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    status: "idle" | "valid" | "invalid";
    name?: string;
    courseName?: string;
    date?: string;
  }>({ status: "idle" });

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse) return;

    registerForTraining({
      courseTitle: selectedCourse.title,
      name: regName,
      email: regEmail,
      phone: regPhone,
      district: regDistrict,
    });

    // Notify WhatsApp
    const message = `Hello Deacomart Academy! I have registered for the course:\n\n` +
      `*Course:* ${selectedCourse.title}\n` +
      `*Name:* ${regName}\n` +
      `*Phone:* ${regPhone}\n` +
      `*District:* ${regDistrict}\n\n` +
      `Please confirm my attendance. Thank you!`;
    
    setRegisteredSuccess(true);
    setTimeout(() => {
      window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, "_blank");
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegisteredSuccess(false);
      setSelectedCourse(null);
    }, 1500);
  }

  function handleVerifyCertificate(e: React.FormEvent) {
    e.preventDefault();
    const id = certificateId.trim().toUpperCase();
    if (!id) return;

    // Simulate database lookup
    if (id.startsWith("DM-") && id.length >= 6) {
      // Return a simulated credential
      const names = ["Niyonsaba Jeanclaude", "Habimana Joseph", "Dukuzumuremyi Eric", "Claudine Ahishakiye", "Turimaso Innocent"];
      const index = id.charCodeAt(3) % names.length;
      const courseIndex = id.charCodeAt(4) % COURSES.length;
      
      setVerificationResult({
        status: "valid",
        name: names[index],
        courseName: COURSES[courseIndex].title,
        date: "May 10, 2026",
      });
    } else {
      setVerificationResult({ status: "invalid" });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-[image:var(--gradient-soft)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-xs font-semibold text-primary">
            <GraduationCap className="w-4 h-4 text-leaf" /> {t("training.badge")}
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold max-w-3xl mx-auto leading-[1.05]">
            {t("training.title")}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            {t("training.subtitle")}
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-bold">Course Catalog</h2>
          <p className="text-muted-foreground mt-2">Pick a curriculum to enhance your agricultural productivity, quality standards, or business logistics.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-3xl p-6 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:border-leaf transition-all group">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{course.category}</span>
                <h3 className="font-display font-bold text-xl text-foreground mt-4 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{course.description}</p>
                
                <div className="mt-6 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block">Syllabus Overview</span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.syllabus.slice(0, 3).map((item) => (
                      <span key={item} className="text-[10px] bg-background border border-border rounded px-2 py-0.5 font-medium">{item}</span>
                    ))}
                    {course.syllabus.length > 3 && <span className="text-[10px] text-muted-foreground font-semibold">+{course.syllabus.length - 3} more</span>}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.modules} Modules</span>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all cursor-pointer"
                >
                  Register <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Lesson Player Panel */}
      <section className="bg-secondary/40 border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[2fr_1fr] gap-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Video className="w-7 h-7 text-leaf" /> Sample Video Lessons
            </h2>
            <p className="text-muted-foreground mt-2 mb-8">Access free snippets of our agronomy lectures on-demand. Register for access to Full Academy courses.</p>
            
            <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-border relative flex items-center justify-center shadow-[var(--shadow-soft)]">
              <video key={activeVideo.id} controls className="w-full h-full object-cover">
                <source src={activeVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-full text-xs text-white font-medium">
                Now Playing: {activeVideo.title}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg mb-4 text-foreground">Academy Playlist</h3>
              <div className="space-y-3">
                {VIDEOS.map((vid) => {
                  const isPlaying = vid.id === activeVideo.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isPlaying ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border hover:border-leaf text-foreground"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isPlaying ? "bg-white/20 text-white" : "bg-secondary text-leaf"}`}>
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{vid.title}</div>
                        <div className={`text-[10px] mt-0.5 ${isPlaying ? "text-white/75" : "text-muted-foreground"}`}>{vid.duration}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guides/Downloadables */}
            <div className="mt-8 lg:mt-0 pt-8 border-t border-border lg:border-t-0 lg:pt-0">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-leaf" /> Downloads & Guidebooks
              </h3>
              <div className="space-y-2">
                {DOWNLOADS.map((dl) => (
                  <a
                    key={dl.title}
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-leaf transition-colors text-xs font-medium"
                  >
                    <span className="truncate">{dl.title}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold shrink-0 ml-2">{dl.size}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Verification Checker */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
          <Award className="w-4 h-4" /> Credentials Verification
        </div>
        <h2 className="text-3xl font-bold">Verify Training Certificate</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Type the verified training credential ID (e.g. `DM-MA-2026-042`) provided by Deacomart Ltd to confirm course completion authenticity.
        </p>

        <form onSubmit={handleVerifyCertificate} className="mt-8 max-w-lg mx-auto flex gap-2">
          <input
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="Enter Certificate ID (e.g. DM-MA-2026-042)"
            className="input text-center font-mono font-bold tracking-widest"
          />
          <button type="submit" className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
            Verify ID
          </button>
        </form>

        {/* Verification Result Display */}
        {verificationResult.status !== "idle" && (
          <div className="mt-6 max-w-lg mx-auto animate-in fade-in duration-200">
            {verificationResult.status === "valid" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-3 text-left">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-500 text-sm">Valid Certificate Authenticated</h4>
                  <p className="text-xs text-foreground/80 mt-1">
                    This certifies that <strong>{verificationResult.name}</strong> successfully completed all modules of the curriculum <strong>"{verificationResult.courseName}"</strong>.
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono">Verified: {verificationResult.date} · Credential ID: {certificateId.toUpperCase()}</p>
                </div>
              </div>
            ) : (
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5 flex items-start gap-3 text-left">
                <ShieldAlert className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-destructive text-sm">Verification Failed</h4>
                  <p className="text-xs text-foreground/80 mt-1">
                    No active credentials match the ID requested. Please ensure the formatting is correct and prefix is set to `DM-`.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Course Registration Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={() => setSelectedCourse(null)}>
          <form
            onSubmit={handleRegister}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-3xl shadow-[var(--shadow-glow)] w-full max-w-md p-6 relative"
          >
            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <GraduationCap className="w-10 h-10 mx-auto text-leaf mb-2" />
              <h3 className="font-display font-bold text-xl text-foreground">Course Registration</h3>
              <p className="text-xs text-muted-foreground mt-1">Registering for: <strong>{selectedCourse.title}</strong></p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</span>
                <input
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Jean Bosco"
                  className="input mt-1.5"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</span>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. bosco@gmail.com"
                  className="input mt-1.5"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</span>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +250 780 165 257"
                  className="input mt-1.5"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">District</span>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="input mt-1.5"
                >
                  <option value="Kigali">Kigali City</option>
                  <option value="Musanze">Musanze</option>
                  <option value="Nyagatare">Nyagatare</option>
                  <option value="Huye">Huye</option>
                  <option value="Bugesera">Bugesera</option>
                  <option value="Nyabihu">Nyabihu</option>
                </select>
              </label>

              {registeredSuccess ? (
                <div className="text-center py-2 text-emerald-500 font-semibold animate-pulse text-sm">
                  Registration Successful! Opening WhatsApp...
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity mt-4 cursor-pointer"
                >
                  Confirm & Open WhatsApp
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
