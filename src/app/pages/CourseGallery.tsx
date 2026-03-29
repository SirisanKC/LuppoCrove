import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router";
import {
  Plus,
  Inbox,
  CheckCircle2,
  Star,
  X,
  Lock,
  Eye,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { TeacherNav } from "../components/TeacherNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface DbCourse {
  id: string;
  title: string;
  course_code: string | null;
  semester: string | null;
  created_at: string;
}

interface ProjectProposal {
  id: string;
  title: string;
  company: string;
  duration: string;
  topic: string;
  ndaRequired: boolean;
  imageUrl: string;
  imageGradient: string;
  detail: string;
}

const PROPOSAL_TOPIC_FILTERS = ["Software", "Service Design", "Data Analytics", "AI"];

const projectProposals: ProjectProposal[] = [
  {
    id: "proj-1",
    company: "Konecranes Ltd.",
    title: "Predictive Maintenance Algorithm",
    detail: "12 Weeks \u2022 Software Engineering",
    duration: "12 Weeks",
    topic: "Software",
    ndaRequired: true,
    imageUrl: "https://images.unsplash.com/photo-1762889597634-264f0907820b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY3JhbmUlMjBtYWNoaW5lcnklMjBlbmdpbmVlcmluZ3xlbnwxfHx8fDE3NzIzOTQ4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #2d5a47 0%, #4a7c5d 100%)",
  },
  {
    id: "proj-2",
    company: "Nordea Bank",
    title: "Customer Behavior Analytics Dashboard",
    detail: "10 Weeks \u2022 Data Analytics",
    duration: "10 Weeks",
    topic: "Data Analytics",
    ndaRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwc2NyZWVufGVufDF8fHx8MTc3MjM3NjI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "proj-3",
    company: "Supercell",
    title: "AI-Powered Content Moderation",
    detail: "14 Weeks \u2022 AI",
    duration: "14 Weeks",
    topic: "AI",
    ndaRequired: true,
    imageUrl: "https://images.unsplash.com/photo-1761223956849-c6912f2179aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBhYnN0cmFjdCUyMG5ldXJhbHxlbnwxfHx8fDE3NzIzOTQ4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "proj-4",
    company: "W\u00e4rtsil\u00e4",
    title: "Supply Chain Optimization Tool",
    detail: "12 Weeks \u2022 Software Engineering",
    duration: "12 Weeks",
    topic: "Software",
    ndaRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwbHklMjBjaGFpbiUyMGxvZ2lzdGljcyUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NzIzNjEyNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "proj-5",
    company: "YLE",
    title: "Real-Time Sentiment Analysis",
    detail: "8 Weeks \u2022 AI",
    duration: "8 Weeks",
    topic: "AI",
    ndaRequired: false,
    imageUrl: "https://images.unsplash.com/photo-1760895653496-b28ed02f3705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9hZGNhc3QlMjBtZWRpYSUyMHN0dWRpbyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyMzk0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "proj-6",
    company: "Nokia",
    title: "IoT Device Management Platform",
    detail: "16 Weeks \u2022 Software Engineering",
    duration: "16 Weeks",
    topic: "Software",
    ndaRequired: true,
    imageUrl: "https://images.unsplash.com/photo-1746017187853-936e4c4e4895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBzbWFydCUyMGRldmljZSUyMGNpcmN1aXQlMjBib2FyZHxlbnwxfHx8fDE3NzIzOTQ4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
];

/* ═══════════════════════════════════════════════════════════
   PAST COURSES DATA
   ═══════════════════════════════════════════════════════════ */
interface PastCourse {
  id: string;
  code: string;
  title: string;
  semester: string;
  approved: number;
  students: number;
}

const PAST_COURSES: PastCourse[] = [
  { id: "past-spring-2025", code: "CT60A9800", title: "Capstone Project", semester: "Spring 2025", approved: 4, students: 38 },
  { id: "past-fall-2024", code: "CT60A9800", title: "Capstone Project", semester: "Fall 2024", approved: 5, students: 42 },
  { id: "past-spring-2024", code: "CT50A6000", title: "Software Engineering", semester: "Spring 2024", approved: 8, students: 32 },
];

export function CourseGallery() {
  const navigate = useNavigate();
  const [activeProposalFilter, setActiveProposalFilter] = useState<string | null>(null);
  const [savedProposalIds, setSavedProposalIds] = useState<Set<string>>(new Set(["proj-1", "proj-3"])); // demo: 2 pre-saved
  const [showShortlist, setShowShortlist] = useState(false);
  const [showPastCourses, setShowPastCourses] = useState(false);
  const [dbCourses, setDbCourses] = useState<DbCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  console.log("CourseGallery component loaded");
  const filteredProposals = activeProposalFilter
    ? projectProposals.filter((p) => p.topic === activeProposalFilter)
    : projectProposals;

useEffect(() => {
  const fetchCourses = async () => {
    console.log("fetchCourses started");
    setLoadingCourses(true);

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, course_code, semester, created_at")
      .order("created_at", { ascending: false });

    console.log("COURSES FROM DB:", data);
    console.log("COURSES ERROR:", error);

    if (error) {
      console.error("Error fetching courses:", error);
      setDbCourses([]);
    } else {
      setDbCourses(data || []);
    }

    setLoadingCourses(false);
    console.log("fetchCourses finished");
  };

  fetchCourses();
}, []);

  const savedProposals = projectProposals.filter((p) => savedProposalIds.has(p.id));

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedProposalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fafaf9", fontFamily: "Inter, sans-serif" }}>
      <TeacherNav />

      <div className="flex-1 max-w-7xl mx-auto px-6 py-12" style={{ marginLeft: 260 }}>
        {/* ═══════════════════════════════════════════
            MY COURSES SECTION
            ═══════════════════════════════════════════ */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", margin: 0, marginBottom: 6 }}>
                My Courses
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                Manage your courses and review incoming industry proposals
              </p>
            </div>
            <button
              onClick={() => navigate("/teacher/course-builder")}
              className="flex items-center gap-2 transition-all"
              style={{
                padding: "10px 20px",
                backgroundColor: "#2d5a47",
                color: "#ffffff",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#234739";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#2d5a47";
              }}
            >
              <Plus className="w-4 h-4" />
              Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {loadingCourses ? (
    <div
      className="bg-white"
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        padding: 24,
      }}
    >
      <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Loading courses...</p>
    </div>
  ) : dbCourses.length === 0 ? (
    <div
      className="bg-white"
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        padding: 24,
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 8 }}>
        No courses yet
      </h3>
      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
        Click “Add New Course” to create your first course.
      </p>
    </div>
  ) : (
    dbCourses.map((dbCourse) => (
      <div
        key={dbCourse.id}
        onClick={() => navigate(`/teacher/courses/${dbCourse.id}/proposals`)}
        className="bg-white overflow-hidden group"
        style={{
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          padding: 24,
          cursor: "pointer",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 4 }}>
              {(dbCourse.course_code || "NO-CODE")} {dbCourse.title}
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              {dbCourse.semester || "No semester"}
            </p>
          </div>
          <div
            className="flex items-center gap-2"
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              backgroundColor: "rgba(45,90,71,0.1)",
              color: "#2d5a47",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span>Published</span>
          </div>
        </div>

        <div className="flex items-center gap-4" style={{ fontSize: 13, color: "#6b7280" }}>
          <div>
            <span>Created: {new Date(dbCourse.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    ))
  )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            AVAILABLE PROJECT PROPOSALS + SHORTLIST SIDEBAR
            ═══════════════════════════════════════════ */}
        <div className="flex gap-8">
          {/* Main proposals area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", margin: 0 }}>
                Available Project Proposals
              </h2>

              {/* Shortlist toggle button */}
              <button
                onClick={() => setShowShortlist(!showShortlist)}
                className="flex items-center gap-2 transition-all"
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: showShortlist ? "rgba(45,90,71,0.06)" : "#ffffff",
                  color: showShortlist ? "#2d5a47" : "#374151",
                  border: showShortlist ? "1.5px solid rgba(45,90,71,0.2)" : "1.5px solid #e5e7eb",
                  cursor: "pointer",
                }}
              >
                <Star size={14} fill={showShortlist ? "#2d5a47" : "none"} color={showShortlist ? "#2d5a47" : "#6b7280"} />
                {savedProposalIds.size > 0 && (
                  <span
                    style={{
                      padding: "1px 7px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: "#2d5a47",
                      color: "#ffffff",
                    }}
                  >
                    {savedProposalIds.size}
                  </span>
                )}
              </button>
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0, marginBottom: 20 }}>
              Browse industry-sponsored projects and save the ones that fit your course
            </p>

            {/* Topic Filter Bar */}
            <div className="flex items-center gap-3" style={{ marginBottom: 28 }}>
              {PROPOSAL_TOPIC_FILTERS.map((f) => {
                const active = activeProposalFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveProposalFilter(active ? null : f)}
                    className="transition-all"
                    style={{
                      padding: "8px 20px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                      backgroundColor: active ? "#2d5a47" : "#ffffff",
                      color: active ? "#ffffff" : "#4a4a4a",
                      border: active ? "1px solid #2d5a47" : "1px solid #e5e5e5",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.borderColor = "#2d5a47";
                        (e.currentTarget as HTMLElement).style.color = "#2d5a47";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5";
                        (e.currentTarget as HTMLElement).style.color = "#4a4a4a";
                      }
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Gallery Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: showShortlist ? "flex-start" : "center" }}>
              {filteredProposals.map((proposal) => {
                const isSaved = savedProposalIds.has(proposal.id);
                return (
                  <div
                    key={proposal.id}
                    className="bg-white overflow-hidden group flex flex-col relative"
                    style={{
                      width: showShortlist ? 310 : 340,
                      height: 420,
                      borderRadius: 16,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                    }}
                  >
                    {/* Image Header */}
                    <div
                      className="relative overflow-hidden"
                      style={{ height: 140, background: proposal.imageGradient }}
                    >
                      <ImageWithFallback
                        src={proposal.imageUrl}
                        alt={proposal.title}
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                      />
                      {/* Company Overlay Pill */}
                      <div className="absolute bottom-3 left-4">
                        <span
                          className="bg-white/95 text-gray-700 backdrop-blur-sm"
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 600,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          }}
                        >
                          {proposal.company}
                        </span>
                      </div>
                      {/* NDA Badge */}
                      <div className="absolute top-3 right-4">
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            backgroundColor: proposal.ndaRequired ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                            color: proposal.ndaRequired ? "#dc2626" : "#059669",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {proposal.ndaRequired ? "NDA Required" : "No NDA"}
                        </span>
                      </div>
                      {/* Save star overlay */}
                      <button
                        onClick={(e) => toggleSave(proposal.id, e)}
                        className="absolute top-3 left-4 flex items-center justify-center rounded-full transition-all"
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: isSaved ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.3)",
                          backdropFilter: "blur(8px)",
                          border: "none",
                          cursor: "pointer",
                        }}
                        title={isSaved ? "Remove from shortlist" : "Save to shortlist"}
                      >
                        <Star
                          size={14}
                          fill={isSaved ? "#2d5a47" : "none"}
                          color={isSaved ? "#2d5a47" : "#ffffff"}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div
                      style={{ padding: "16px 20px 0 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}
                    >
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", lineHeight: 1.3, margin: 0 }}>
                        {proposal.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                        {proposal.detail}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div style={{ padding: "12px 20px 20px 20px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teacher/proposals/${proposal.id}/details`);
                        }}
                        className="w-full transition-all"
                        style={{
                          height: 44,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 500,
                          backgroundColor: "#2d5a47",
                          color: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#234739";
                          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(45,90,71,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#2d5a47";
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }}
                      >
                        View Project Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProposals.length === 0 && (
              <div className="text-center py-20">
                <p style={{ fontSize: 14, color: "#6b7280" }}>No proposals match your filters.</p>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════
              SHORTLIST SIDEBAR (collapsible)
              ═══════════════════════════════════════════ */}
          {showShortlist && (
            <div
              className="shrink-0"
              style={{ width: 320 }}
            >
              <div
                className="sticky"
                style={{
                  top: 100,
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                {/* Shortlist Header */}
                <div
                  className="flex items-center justify-between"
                  style={{ padding: "18px 20px", borderBottom: "1px solid #f3f4f6" }}
                >
                  <div className="flex items-center gap-2">
                    <Star size={16} fill="#2d5a47" color="#2d5a47" />
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: "rgba(45,90,71,0.08)",
                        color: "#2d5a47",
                      }}
                    >
                      {savedProposals.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowShortlist(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
                  >
                    <X size={16} color="#9ca3af" />
                  </button>
                </div>

                {/* Shortlist Items */}
                {savedProposals.length === 0 ? (
                  <div style={{ padding: "32px 20px", textAlign: "center" }}>
                    <Star size={28} color="#d1d5db" className="mx-auto mb-3" />
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
                      No saved proposals yet.
                      <br />
                      Click the star on any proposal card to add it here.
                    </p>
                  </div>
                ) : (
                  <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
                    {savedProposals.map((proposal, idx) => (
                      <div
                        key={proposal.id}
                        className="flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer"
                        style={{
                          padding: "14px 20px",
                          borderBottom: idx < savedProposals.length - 1 ? "1px solid #f3f4f6" : "none",
                        }}
                        onClick={() => navigate(`/teacher/proposals/${proposal.id}/details`)}
                      >
                        {/* Mini gradient square */}
                        <div
                          className="shrink-0 rounded-lg overflow-hidden"
                          style={{ width: 40, height: 40, background: proposal.imageGradient }}
                        />
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                            {proposal.title}
                          </p>
                          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, marginTop: 3 }}>
                            {proposal.company} &bull; {proposal.duration}
                          </p>
                        </div>
                        <button
                          onClick={(e) => toggleSave(proposal.id, e)}
                          className="shrink-0 mt-1"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
                          title="Remove from shortlist"
                        >
                          <X size={13} color="#d1d5db" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shortlist Footer */}
                {savedProposals.length > 0 && (
                  <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, textAlign: "center" }}>
                      Saved proposals are visible only to you
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacer for DemoNav */}
        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}
