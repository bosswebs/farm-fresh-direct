import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap, Users, Award, Calendar, MapPin, User,
  CheckCircle, Clock, Plus, Eye, MoreHorizontal, BookOpen
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { trainingCourses, getStatusColor } from "../../lib/admin-data";

export const Route = createFileRoute("/admin/training")({
  component: TrainingPage,
});

const topics = [
  "Modern Agriculture", "Sustainable Agriculture", "Hinga Ugwize", "Value Addition",
  "Food Safety", "Post-Harvest Management", "Financial Literacy", "Cooperative Management",
  "Agribusiness Development", "Tax Declaration",
];

function TrainingPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "sessions" | "reports">("courses");

  const totalParticipants = trainingCourses.reduce((s, c) => s + c.participants, 0);
  const completedCourses = trainingCourses.filter((c) => c.status === "completed").length;
  const avgCompletion = Math.round(trainingCourses.reduce((s, c) => s + c.completionRate, 0) / trainingCourses.length);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">Farmer Training Academy</h1>
          <p className="text-sm text-gray-500">Manage nationwide training programs and farmer capacity building</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"><Plus className="w-4 h-4" />New Course</Button>
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
            <div key={course.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <span className="text-[10px] text-gray-400">{course.id}</span>
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
                    <DropdownMenuItem className="gap-2 cursor-pointer"><Eye className="w-3.5 h-3.5" />View Details</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer"><Award className="w-3.5 h-3.5" />Issue Certificates</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer"><Users className="w-3.5 h-3.5" />View Participants</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg py-2">
                  <div className="text-sm font-bold text-gray-800">{course.sessions}</div>
                  <div className="text-[10px] text-gray-400">Sessions</div>
                </div>
                <div className="bg-emerald-50 rounded-lg py-2">
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
    </div>
  );
}
