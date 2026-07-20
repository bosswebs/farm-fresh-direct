import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  GraduationCap, Users, Award, Calendar, MapPin, User,
  CheckCircle, Clock, Plus, Eye, Edit, Trash2, MoreHorizontal, BookOpen, X
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { getStatusColor } from "../../lib/admin-data";
import {
  getTrainingCourses,
  getStaff,
  createTrainingCourse,
  updateTrainingCourse,
  deleteTrainingCourse
} from "../../lib/admin-data.server";

export const Route = createFileRoute("/admin/training")({
  loader: async () => {
    const [trainingCourses, staff] = await Promise.all([getTrainingCourses(), getStaff()]);
    return { trainingCourses, staff };
  },
  component: TrainingPage,
});

const topics = [
  "Modern Agriculture", "Sustainable Agriculture", "Hinga Ugwize", "Value Addition",
  "Food Safety", "Post-Harvest Management", "Financial Literacy", "Cooperative Management",
  "Agribusiness Development", "Tax Declaration",
];

const inputClass =
  "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50";

function TrainingPage() {
  const { trainingCourses: loadedCourses, staff } = Route.useLoaderData();
  const router = useRouter();
  const [trainingCourses, setTrainingCourses] = useState(loadedCourses);
  const [activeTab, setActiveTab] = useState<"courses" | "sessions" | "reports">("courses");

  // Modal states
  const [editingCourse, setEditingCourse] = useState<typeof loadedCourses[0] | null>(null);
  const [viewingCourse, setViewingCourse] = useState<typeof loadedCourses[0] | null>(null);
  const [participantsCourse, setParticipantsCourse] = useState<typeof loadedCourses[0] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Modern Agriculture",
    trainer: staff.find((s) => s.role === "trainer")?.name || staff[0]?.name || "Lead Agronomist",
    duration: "2 Days",
    sessions: 4,
    participants: 25,
    completionRate: 0,
    nextSession: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    district: "Kigali",
    status: "upcoming" as "active" | "upcoming" | "completed",
  });

  useEffect(() => {
    setTrainingCourses(loadedCourses);
  }, [loadedCourses]);

  const totalParticipants = trainingCourses.reduce((s, c) => s + c.participants, 0);
  const completedCourses = trainingCourses.filter((c) => c.status === "completed").length;
  const avgCompletion = trainingCourses.length > 0
    ? Math.round(trainingCourses.reduce((s, c) => s + c.completionRate, 0) / trainingCourses.length)
    : 0;

  function emptyForm() {
    return {
      title: "",
      category: "Modern Agriculture",
      trainer: staff.find((s) => s.role === "trainer")?.name || staff[0]?.name || "Lead Agronomist",
      duration: "2 Days",
      sessions: 4,
      participants: 25,
      completionRate: 0,
      nextSession: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      district: "Kigali",
      status: "upcoming" as const,
    };
  }

  function formFromCourse(course: typeof loadedCourses[0]) {
    return {
      title: course.title,
      category: course.category,
      trainer: course.trainer,
      duration: course.duration,
      sessions: course.sessions,
      participants: course.participants,
      completionRate: course.completionRate,
      nextSession: course.nextSession,
      district: course.district,
      status: course.status as "active" | "upcoming" | "completed",
    };
  }

  function openCreateForm() {
    setEditingCourse(null);
    setForm(emptyForm());
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(course: typeof loadedCourses[0]) {
    setEditingCourse(course);
    setForm(formFromCourse(course));
    setFormError(null);
    setFormOpen(true);
  }

  async function refreshCourses() {
    await router.invalidate();
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingCourse) {
        const saved = await updateTrainingCourse({ data: { id: editingCourse.id, ...form } });
        setTrainingCourses((current) => current.map((c) => c.id === saved.id ? saved : c));
        toast.success(`Training course "${saved.title}" was updated.`);
      } else {
        const saved = await createTrainingCourse({ data: form });
        setTrainingCourses((current) => [saved, ...current]);
        toast.success(`Training course "${saved.title}" was created.`);
      }
      setFormOpen(false);
      setEditingCourse(null);
      await refreshCourses();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save training course.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function issueCertificates(course: typeof loadedCourses[0]) {
    setBusyId(course.id);
    try {
      const updated = await updateTrainingCourse({
        data: {
          ...formFromCourse(course),
          id: course.id,
          completionRate: 100,
          status: "completed",
        },
      });
      setTrainingCourses((current) => current.map((c) => c.id === course.id ? updated : c));
      toast.success(`Issued certificates to ${course.participants} farmers for "${course.title}".`);
      await refreshCourses();
    } catch {
      toast.error("Could not issue certificates.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteCourseAction(course: typeof loadedCourses[0]) {
    if (!confirm(`Are you sure you want to delete course "${course.title}"?`)) return;
    setBusyId(course.id);
    try {
      await deleteTrainingCourse({ data: { id: course.id } });
      setTrainingCourses((current) => current.filter((c) => c.id !== course.id));
      toast.success(`Deleted course "${course.title}".`);
      if (viewingCourse?.id === course.id) setViewingCourse(null);
      await refreshCourses();
    } catch {
      toast.error("Could not delete course.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Farmer Training Academy</h1>
          <p className="text-sm text-gray-500">Manage nationwide training programs and farmer capacity building</p>
        </div>
        <Button onClick={openCreateForm} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" />New Course
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: trainingCourses.length, icon: BookOpen, color: "from-violet-500 to-violet-700" },
          { label: "Total Participants", value: totalParticipants.toLocaleString(), icon: Users, color: "from-emerald-500 to-emerald-700" },
          { label: "Completed Courses", value: completedCourses, icon: CheckCircle, color: "from-teal-500 to-teal-700" },
          { label: "Avg Completion Rate", value: `${avgCompletion}%`, icon: Award, color: "from-blue-500 to-blue-700" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3 shadow-sm`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-display">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Training Topics */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 font-display mb-3">Training Topics Offered</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span key={topic} className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {(["courses", "sessions", "reports"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all border
              ${activeTab === tab ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trainingCourses.map((course) => (
            <div key={course.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all ${busyId === course.id ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{course.id}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">{course.title}</h3>
                  <p className="text-xs text-emerald-600 mt-1">{course.category}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setViewingCourse(course)}>
                      <Eye className="w-3.5 h-3.5" />View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEditForm(course)}>
                      <Edit className="w-3.5 h-3.5" />Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => issueCertificates(course)}>
                      <Award className="w-3.5 h-3.5" />Issue Certificates
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setParticipantsCourse(course)}>
                      <Users className="w-3.5 h-3.5" />View Participants
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-600" onClick={() => deleteCourseAction(course)}>
                      <Trash2 className="w-3.5 h-3.5" />Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg py-2">
                  <div className="text-sm font-bold text-gray-800">{course.sessions}</div>
                  <div className="text-[10px] text-gray-400">Sessions</div>
                </div>
                <div className="bg-emerald-50 rounded-lg py-2 cursor-pointer" onClick={() => setParticipantsCourse(course)}>
                  <div className="text-sm font-bold text-emerald-700">{course.participants}</div>
                  <div className="text-[10px] text-emerald-600">Participants</div>
                </div>
                <div className="bg-blue-50 rounded-lg py-2">
                  <div className="text-sm font-bold text-blue-700">{course.completionRate}%</div>
                  <div className="text-[10px] text-blue-600">Completed</div>
                </div>
              </div>

              {/* Completion Bar */}
              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1"><User className="w-3 h-3" />{course.trainer}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{course.district}</div>
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {course.status === "completed" ? "Completed" : `Next: ${course.nextSession}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 font-display">Upcoming Training Sessions</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {trainingCourses.filter((c) => c.status !== "completed").map((course) => (
              <div key={course.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    <div className="text-xs text-gray-400">{course.trainer} · {course.district}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{course.nextSession}</div>
                  <div className="text-xs text-gray-400">{course.duration}</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ml-4 ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Training Summary Report</h2>
            <div className="space-y-3">
              {trainingCourses.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{c.title}</span>
                      <span className="text-xs font-bold text-gray-800">{c.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full" style={{ width: `${c.completionRate}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-20 text-right">{c.participants} farmers</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Certificates Issued</h2>
            <div className="space-y-3">
              {trainingCourses.map((c) => {
                const issued = Math.round(c.participants * c.completionRate / 100);
                return (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-700">{c.title.substring(0, 30)}...</span>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-gray-800">{issued}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Course Form Modal */}
      {formOpen && (
        <CourseFormModal
          form={form}
          mode={editingCourse ? "edit" : "create"}
          error={formError}
          saving={saving}
          staff={staff}
          onChange={setForm}
          onSubmit={submitForm}
          onClose={() => {
            if (!saving) setFormOpen(false);
          }}
        />
      )}

      {/* Course Detail Modal */}
      {viewingCourse && (
        <CourseDetailModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
          onEdit={() => {
            const current = viewingCourse;
            setViewingCourse(null);
            openEditForm(current);
          }}
          onIssueCertificates={() => issueCertificates(viewingCourse)}
          onViewParticipants={() => {
            const current = viewingCourse;
            setViewingCourse(null);
            setParticipantsCourse(current);
          }}
        />
      )}

      {/* Participants Modal */}
      {participantsCourse && (
        <ParticipantsModal
          course={participantsCourse}
          onClose={() => setParticipantsCourse(null)}
        />
      )}
    </div>
  );
}

function CourseFormModal({
  form,
  mode,
  error,
  saving,
  staff,
  onChange,
  onSubmit,
  onClose,
}: {
  form: {
    title: string;
    category: string;
    trainer: string;
    duration: string;
    sessions: number;
    participants: number;
    completionRate: number;
    nextSession: string;
    district: string;
    status: "active" | "upcoming" | "completed";
  };
  mode: "create" | "edit";
  error: string | null;
  saving: boolean;
  staff: Array<{ id: string; name: string; role: string }>;
  onChange: (val: any) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-gray-900 font-display">
            {mode === "create" ? "New Training Course" : "Edit Training Course"}
          </h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Course Title">
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Modern Climate-Smart Agriculture Techniques"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category / Topic">
              <select
                value={form.category}
                onChange={(e) => onChange({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="Trainer / Instructor">
              <input
                required
                type="text"
                list="trainer-suggestions"
                value={form.trainer}
                onChange={(e) => onChange({ ...form, trainer: e.target.value })}
                className={inputClass}
                placeholder="Trainer Name"
              />
              <datalist id="trainer-suggestions">
                {staff.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                ))}
              </datalist>
            </Field>

            <Field label="Duration">
              <input
                required
                type="text"
                value={form.duration}
                onChange={(e) => onChange({ ...form, duration: e.target.value })}
                className={inputClass}
                placeholder="e.g. 2 Days or 4 Weeks"
              />
            </Field>

            <Field label="District / Location">
              <input
                required
                type="text"
                value={form.district}
                onChange={(e) => onChange({ ...form, district: e.target.value })}
                className={inputClass}
                placeholder="e.g. Musanze"
              />
            </Field>

            <Field label="Total Sessions">
              <input
                required
                type="number"
                min="1"
                value={form.sessions || ""}
                onChange={(e) => onChange({ ...form, sessions: parseInt(e.target.value) || 0 })}
                className={inputClass}
              />
            </Field>

            <Field label="Enrolled Participants">
              <input
                required
                type="number"
                min="0"
                value={form.participants || ""}
                onChange={(e) => onChange({ ...form, participants: parseInt(e.target.value) || 0 })}
                className={inputClass}
              />
            </Field>

            <Field label="Next Session Date">
              <input
                required
                type="date"
                value={form.nextSession}
                onChange={(e) => onChange({ ...form, nextSession: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => onChange({ ...form, status: e.target.value as any })}
                className={inputClass}
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
          </div>

          <Field label="Completion Rate (%)">
            <input
              required
              type="number"
              min="0"
              max="100"
              value={form.completionRate}
              onChange={(e) => onChange({ ...form, completionRate: parseFloat(e.target.value) || 0 })}
              className={inputClass}
            />
          </Field>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? "Saving..." : mode === "create" ? "Create Course" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CourseDetailModal({
  course,
  onClose,
  onEdit,
  onIssueCertificates,
  onViewParticipants,
}: {
  course: any;
  onClose: () => void;
  onEdit: () => void;
  onIssueCertificates: () => void;
  onViewParticipants: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">{course.id}</span>
            <h2 className="text-lg font-bold text-gray-900 font-display mt-0.5">{course.title}</h2>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${getStatusColor(course.status)}`}>
              {course.status}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Category</div>
            <div className="font-semibold text-emerald-700 mt-0.5">{course.category}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Trainer</div>
            <div className="font-semibold text-gray-800 mt-0.5">{course.trainer}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Location</div>
            <div className="font-semibold text-gray-800 mt-0.5">{course.district} District</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Duration</div>
            <div className="font-semibold text-gray-800 mt-0.5">{course.duration}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="text-lg font-bold text-gray-900">{course.sessions}</div>
            <div className="text-[10px] text-gray-400">Sessions</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <div className="text-lg font-bold text-emerald-700">{course.participants}</div>
            <div className="text-[10px] text-emerald-600">Participants</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <div className="text-lg font-bold text-blue-700">{course.completionRate}%</div>
            <div className="text-[10px] text-blue-600">Completion</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onEdit} className="gap-1.5 text-xs">
            <Edit className="w-3.5 h-3.5" />Edit
          </Button>
          <Button variant="outline" onClick={onViewParticipants} className="gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5" />Participants
          </Button>
          <Button onClick={onIssueCertificates} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs">
            <Award className="w-3.5 h-3.5" />Issue Certificates
          </Button>
        </div>
      </div>
    </div>
  );
}

function ParticipantsModal({ course, onClose }: { course: any; onClose: () => void }) {
  const sampleFarmers = [
    { name: "Jean-Paul Habimana", phone: "+250 788 123 456", district: course.district, status: "Attended" },
    { name: "Marie-Claire Mukamana", phone: "+250 788 234 567", district: course.district, status: "Attended" },
    { name: "Emmanuel Nzeyimana", phone: "+250 788 345 678", district: course.district, status: "Registered" },
    { name: "Divine Uwase", phone: "+250 788 456 789", district: course.district, status: "Certified" },
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 font-display">Enrolled Farmers</h3>
            <p className="text-xs text-gray-500">{course.title} ({course.participants} Total)</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
          {sampleFarmers.map((f, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-gray-800">{f.name}</div>
                <div className="text-gray-400">{f.phone} · {f.district}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                {f.status}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-gray-700 flex flex-col">
      <span>{label}</span>
      {children}
    </label>
  );
}
