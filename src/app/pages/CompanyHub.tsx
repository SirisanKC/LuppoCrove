import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Trees,
  Plus,
  BookOpen,
  FileText,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { CompanyNav } from "../components/CompanyNav";
import { AIProjectWizard } from "../components/AIProjectWizard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: "Owner" | "Co-owner" | "Developer";
}

interface TimelineMilestone {
  position: number; // 0-100 within the bar
  label: string;
  date: string;
}

interface TimelineRow {
  name: string;
  barStart: number; // 0-100 across the 6-column grid
  barEnd: number;
  dateLabel: string;
  highlighted?: boolean;
  color: {
    bar: string;
    diamond: string;
  };
  milestones: TimelineMilestone[];
}

interface SemesterData {
  months: string[];
  rows: TimelineRow[];
}

interface CourseCard {
  id: string;
  university: string;
  title: string;
  detail: string;
  imageUrl: string;
  imageGradient: string;
  tags: string[];
  route: string;
}

/* ═══════════════════════════════════════════════════════════
   STATIC DATA
   ═══════════════════════════════════════════════════════════ */
const team: TeamMember[] = [
  { id: "1", name: "Alex Chen", initials: "AC", role: "Owner" },
  { id: "2", name: "Maria Santos", initials: "MS", role: "Co-owner" },
  { id: "3", name: "David Lee", initials: "DL", role: "Developer" },
];

const ROLE_PILL: Record<string, string> = {
  Owner: "bg-[#2d5a47]/12 text-[#2d5a47]",
  "Co-owner": "bg-[#2d5a47]/8 text-[#3d7a5f]",
  Developer: "bg-blue-50 text-blue-600",
};

const semesterOptions = [
  { key: "spring-2025", label: "Spring 2025" },
  { key: "fall-2025", label: "Fall 2025" },
  { key: "spring-2026", label: "Spring 2026" },
  { key: "fall-2026", label: "Fall 2026" },
];

const timelineData: Record<string, SemesterData> = {
  "spring-2025": {
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
    rows: [
      {
        name: "Aalto: Design Factory",
        barStart: 8,
        barEnd: 83,
        dateLabel: "Jan 15, 2025 – May 20, 2025",
        color: { bar: "bg-blue-200/70", diamond: "bg-blue-500" },
        milestones: [],
      },
      {
        name: "Helsinki: Full Stack",
        barStart: 17,
        barEnd: 67,
        dateLabel: "Feb 1, 2025 – Apr 30, 2025",
        color: { bar: "bg-purple-200/70", diamond: "bg-purple-500" },
        milestones: [],
      },
      {
        name: "Tampere: SW Project",
        barStart: 0,
        barEnd: 97,
        dateLabel: "Jan 6, 2025 – Jun 27, 2025",
        color: { bar: "bg-amber-200/70", diamond: "bg-amber-500" },
        milestones: [],
      },
    ],
  },
  "fall-2025": {
    months: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    rows: [
      {
        name: "Aalto: SW Project",
        barStart: 33,
        barEnd: 97,
        dateLabel: "Sep 1, 2025 – Dec 19, 2025",
        color: { bar: "bg-blue-200/70", diamond: "bg-blue-500" },
        milestones: [],
      },
      {
        name: "Helsinki: OHTU",
        barStart: 33,
        barEnd: 67,
        dateLabel: "Sep 1, 2025 – Oct 31, 2025",
        color: { bar: "bg-purple-200/70", diamond: "bg-purple-500" },
        milestones: [],
      },
      {
        name: "LUT: Capstone",
        barStart: 33,
        barEnd: 97,
        dateLabel: "Sep 1, 2025 – Dec 19, 2025",
        highlighted: true,
        color: { bar: "bg-emerald-200/70", diamond: "bg-emerald-500" },
        milestones: [],
      },
    ],
  },
  "spring-2026": {
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
    rows: [
      {
        name: "Aalto: Web Dev Studio",
        barStart: 0,
        barEnd: 83,
        dateLabel: "Jan 12, 2026 – May 22, 2026",
        color: { bar: "bg-blue-200/70", diamond: "bg-blue-500" },
        milestones: [
          { position: 40, label: "Architecture Review", date: "Mar 6, 2026" },
          { position: 70, label: "User Testing", date: "Apr 17, 2026" },
          { position: 95, label: "Final Presentation", date: "May 20, 2026" },
        ],
      },
      {
        name: "Oulu: Digital Service",
        barStart: 17,
        barEnd: 83,
        dateLabel: "Feb 3, 2026 – May 29, 2026",
        color: { bar: "bg-rose-200/70", diamond: "bg-rose-500" },
        milestones: [
          { position: 60, label: "Prototype Due", date: "Apr 10, 2026" },
          { position: 90, label: "Demo Day", date: "May 22, 2026" },
        ],
      },
      {
        name: "Jyväskylä: IS Project",
        barStart: 8,
        barEnd: 67,
        dateLabel: "Jan 19, 2026 – Apr 24, 2026",
        color: { bar: "bg-cyan-200/70", diamond: "bg-cyan-500" },
        milestones: [
          { position: 65, label: "Mid-Review", date: "Mar 23, 2026" },
        ],
      },
    ],
  },
  "fall-2026": {
    months: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    rows: [
      {
        name: "Aalto: SW Project",
        barStart: 25,
        barEnd: 97,
        dateLabel: "Aug 15, 2026 – Dec 18, 2026",
        color: { bar: "bg-blue-200/70", diamond: "bg-blue-500" },
        milestones: [
          { position: 15, label: "Submit Selection", date: "Sep 22, 2026" },
          { position: 42, label: "Mid-Review", date: "Oct 28, 2026" },
          { position: 72, label: "Code Freeze", date: "Dec 4, 2026" },
          { position: 95, label: "Final Demo", date: "Dec 16, 2026" },
        ],
      },
      {
        name: "Helsinki: OHTU",
        barStart: 25,
        barEnd: 60,
        dateLabel: "Aug 15, 2026 – Oct 30, 2026",
        color: { bar: "bg-purple-200/70", diamond: "bg-purple-500" },
        milestones: [
          { position: 35, label: "Team Allocation", date: "Sep 22, 2026" },
          { position: 85, label: "Sprint Review", date: "Oct 22, 2026" },
        ],
      },
      {
        name: "LUT: Capstone",
        barStart: 25,
        barEnd: 97,
        dateLabel: "Aug 15, 2026 – Dec 18, 2026",
        highlighted: true,
        color: { bar: "bg-emerald-200/70", diamond: "bg-emerald-500" },
        milestones: [
          { position: 10, label: "Proposal Due", date: "Sep 15, 2026" },
          { position: 35, label: "Progress Report", date: "Oct 15, 2026" },
          { position: 62, label: "Submit Draft", date: "Nov 10, 2026" },
          { position: 92, label: "Final Demo", date: "Dec 15, 2026" },
        ],
      },
    ],
  },
};

const courses: CourseCard[] = [
  {
    id: "aalto-design",
    university: "Aalto University",
    title: "Design Factory — Product Development Project",
    detail: "20 Weeks \u2022 Interdisciplinary Design",
    imageUrl: "https://images.unsplash.com/photo-1768044325587-65a9dfdb562f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNpZ24lMjBzY2hvb2wlMjBhcmNoaXRlY3R1cmUlMjBzdHVkaW98ZW58MXx8fHwxNzczNzQzNjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #2d5a47 0%, #4a7c5d 100%)",
    tags: ["Software", "Service Design"],
    route: "/company/courses/aalto/design-factory",
  },
  {
    id: "helsinki-fullstack",
    university: "University of Helsinki",
    title: "Full Stack Web Development Project",
    detail: "7 Weeks \u2022 Software Engineering",
    imageUrl: "https://images.unsplash.com/photo-1572382817039-2beeb0ce8dfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIZWxzaW5raSUyMHVuaXZlcnNpdHklMjBsaWJyYXJ5JTIwRmlubGFuZCUyMGFjYWRlbWljfGVufDF8fHx8MTc3Mzc0MzY5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    tags: ["Software"],
    route: "/company/courses/helsinki/fullstack",
  },
  {
    id: "oulu-digital",
    university: "University of Oulu",
    title: "Digital Service Development",
    detail: "16 Weeks \u2022 Service Design",
    imageUrl: "https://images.unsplash.com/photo-1675005882031-9a992de76eee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGaW5uaXNoJTIwdW5pdmVyc2l0eSUyMGNhbXB1cyUyMHdpbnRlciUyME5vcmRpY3xlbnwxfHx8fDE3NzM3NDM2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    tags: ["Service Design"],
    route: "/company/courses/oulu/digital-service",
  },
  {
    id: "tampere-sw",
    university: "Tampere University",
    title: "Software Engineering Project",
    detail: "14 Weeks \u2022 Software Engineering",
    imageUrl: "https://images.unsplash.com/photo-1591812187037-bcd060f1bd00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYW1wZXJlJTIwRmlubGFuZCUyMGNpdHklMjB0ZWNobm9sb2d5JTIwY2FtcHVzfGVufDF8fHx8MTc3Mzc0MzY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    tags: ["Software"],
    route: "/company/courses/tampere/sw-project",
  },
  {
    id: "jyvaskyla-is",
    university: "University of Jyväskylä",
    title: "Information Systems Project",
    detail: "12 Weeks \u2022 Data Analytics",
    imageUrl: "https://images.unsplash.com/photo-1573365295861-d7e8e19d2372?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKeXZhc2t5bGElMjBGaW5sYW5kJTIwbGFrZSUyMHVuaXZlcnNpdHklMjBuYXR1cmV8ZW58MXx8fHwxNzczNzQzNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageGradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    tags: ["Data Analytics"],
    route: "/company/courses/jyvaskyla/is-project",
  },
];

const TOPIC_FILTERS = ["Software", "Service Design", "Data Analytics", "AI"];

/* ═══════════════════════════════════════════════════════════
   COMPONENT: CompanyHub
   ═══════════════════════════════════════════════════════════ */
export function CompanyHub() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("browse");
  const [selectedSemester, setSelectedSemester] = useState("fall-2026");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardCourseId, setWizardCourseId] = useState<string | null>(null);
  const [zoomedMonth, setZoomedMonth] = useState<number | null>(null);

  // Scroll to #partnerships anchor on mount if hash present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#partnerships") {
      setTimeout(() => {
        document.getElementById("partnerships")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const currentSemesterIdx = semesterOptions.findIndex((s) => s.key === selectedSemester);
  const currentTimeline = timelineData[selectedSemester];

  const goToPrev = () => {
    if (currentSemesterIdx > 0) {
      setSelectedSemester(semesterOptions[currentSemesterIdx - 1].key);
      setZoomedMonth(null);
    }
  };
  const goToNext = () => {
    if (currentSemesterIdx < semesterOptions.length - 1) {
      setSelectedSemester(semesterOptions[currentSemesterIdx + 1].key);
      setZoomedMonth(null);
    }
  };

  const filteredCourses = activeFilter
    ? courses.filter((c) => c.tags.includes(activeFilter))
    : courses;

  const openWizardForCourse = (courseId: string) => {
    setWizardCourseId(courseId);
    setWizardOpen(true);
  };

  // ── Zoomed month helpers ──
  const fullMonthNames: Record<string, string> = {
    JAN: "January", FEB: "February", MAR: "March", APR: "April",
    MAY: "May", JUN: "June", JUL: "July", AUG: "August",
    SEP: "September", OCT: "October", NOV: "November", DEC: "December",
  };

  const getWeekLabels = (monthAbbr: string) => {
    const daysInMonth: Record<string, number> = {
      JAN: 31, FEB: 28, MAR: 31, APR: 30, MAY: 31, JUN: 30,
      JUL: 31, AUG: 31, SEP: 30, OCT: 31, NOV: 30, DEC: 31,
    };
    const days = daysInMonth[monthAbbr] || 30;
    return [`1–7`, `8–14`, `15–21`, `22–${days}`];
  };

  const getZoomedRowData = (row: TimelineRow, monthIndex: number) => {
    const mw = 100 / 6;
    const ms = monthIndex * mw;
    const me = (monthIndex + 1) * mw;
    const cs = Math.max(row.barStart, ms);
    const ce = Math.min(row.barEnd, me);
    if (cs >= me || ce <= ms) return null;
    const zStart = ((cs - ms) / mw) * 100;
    const zEnd = ((ce - ms) / mw) * 100;
    const bw = row.barEnd - row.barStart;
    const zMilestones = row.milestones
      .map((m) => {
        const abs = row.barStart + (m.position / 100) * bw;
        if (abs >= ms && abs <= me) {
          return { ...m, zoomedPos: ((abs - ms) / mw) * 100 };
        }
        return null;
      })
      .filter(Boolean) as (TimelineMilestone & { zoomedPos: number })[];
    return { zStart, zEnd, zMilestones };
  };

  // Determine header text from selected semester
  const semesterLabel = semesterOptions.find((s) => s.key === selectedSemester)?.label ?? "";

  /* ═══════════════════════════════════════════════════════
     NAV ITEMS
     ═══════════════════════════════════════════════════════ */
  const navItems = [
    { id: "browse", label: "Browse Courses", icon: BookOpen, notif: false, onClick: () => setActiveNav("browse") },
    { id: "proposals", label: "My Proposals", icon: FileText, notif: false, onClick: () => { setActiveNav("proposals"); navigate("/company/proposals"); } },
    { id: "projects", label: "Active Projects", icon: FolderOpen, notif: true, onClick: () => { setActiveNav("projects"); navigate("/company/projects"); } },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fafaf9", fontFamily: "Inter, sans-serif" }}>
      <CompanyNav />

      {/* ╔═══════════════════════════════════════════════════╗
         ║           MAIN CONTENT AREA                       ║
         ╚═══════════════════════════════════════════════════╝ */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: "100vh" }}>

        {/* ─────────────────────────────────────────────────
            TOP SECTION: GANTT TIMELINE
            ───────────────────────────────────────────────── */}
        <div style={{ padding: "40px 40px 0 40px" }}>
          {/* Header Row */}
          <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", margin: 0 }}>
              Strategic Partnership Timelines
            </h2>

            {/* Pill-style toggle group with arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrev}
                disabled={currentSemesterIdx <= 0}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                {semesterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setSelectedSemester(opt.key); setZoomedMonth(null); }}
                    className="transition-all whitespace-nowrap"
                    style={{
                      padding: "6px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: opt.key === selectedSemester ? 600 : 400,
                      backgroundColor: opt.key === selectedSemester ? "#2d5a47" : "transparent",
                      color: opt.key === selectedSemester ? "#ffffff" : "#6b6b6b",
                      boxShadow: opt.key === selectedSemester ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={goToNext}
                disabled={currentSemesterIdx >= semesterOptions.length - 1}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Timeline Canvas Card */}
          <div
            className="bg-white"
            style={{
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            {zoomedMonth !== null && currentTimeline ? (
              /* ── ZOOMED MONTH VIEW ── */
              <>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setZoomedMonth(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#2d5a47] transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Semester
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomedMonth(Math.max(0, zoomedMonth - 1))}
                      disabled={zoomedMonth <= 0}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
                      {currentTimeline.months.map((month, idx) => (
                        <button
                          key={month}
                          onClick={() => setZoomedMonth(idx)}
                          className="transition-all whitespace-nowrap"
                          style={{
                            padding: "4px 10px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: idx === zoomedMonth ? 600 : 400,
                            backgroundColor: idx === zoomedMonth ? "#2d5a47" : "transparent",
                            color: idx === zoomedMonth ? "#fff" : "#6b6b6b",
                          }}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setZoomedMonth(Math.min(5, zoomedMonth + 1))}
                      disabled={zoomedMonth >= 5}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#2d5a47" }}>
                    {fullMonthNames[currentTimeline.months[zoomedMonth]]} — Weekly View
                  </span>
                </div>

                {/* Week Column Headers */}
                <div className="grid grid-cols-[180px_1fr]" style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>Course / Program</div>
                  <div className="grid grid-cols-4 gap-1 text-center" style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {getWeekLabels(currentTimeline.months[zoomedMonth]).map((lbl) => (
                      <div key={lbl}>{lbl}</div>
                    ))}
                  </div>
                </div>

                {/* Zoomed Rows */}
                <div className="space-y-5">
                  {currentTimeline.rows.map((row, ri) => {
                    const z = getZoomedRowData(row, zoomedMonth);
                    if (!z) {
                      return (
                        <div key={`z-${ri}`} className="grid grid-cols-[180px_1fr] items-center py-2">
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db" }}>{row.name}</div>
                          <div style={{ fontSize: 11, color: "#d1d5db", fontStyle: "italic" }}>Not active this month</div>
                        </div>
                      );
                    }
                    const bw = z.zEnd - z.zStart;
                    return (
                      <div
                        key={`z-${ri}`}
                        className={`grid grid-cols-[180px_1fr] items-center -mx-3 px-3 py-2 rounded-lg transition-colors ${
                          row.highlighted ? "bg-gray-50/70" : "hover:bg-gray-50/50"
                        }`}
                      >
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{row.name}</div>
                        <div className="relative" style={{ height: 40 }}>
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 rounded-full ${row.color.bar}`}
                            style={{ left: `${z.zStart}%`, width: `${bw}%`, height: 10 }}
                          />
                          {z.zMilestones.map((ms, mi) => (
                            <div
                              key={mi}
                              className="absolute z-10 cursor-pointer group/ms"
                              style={{ left: `${ms.zoomedPos}%`, top: "50%", transform: "translate(-50%, -50%)" }}
                            >
                              <div className={`w-4 h-4 ${row.color.diamond} rotate-45 border-2 border-white`} style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }} />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/ms:opacity-100 transition-all duration-150 pointer-events-none z-30">
                                <div className="bg-white whitespace-nowrap" style={{ padding: "8px 14px", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)" }}>
                                  <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0 }}>{ms.label}</p>
                                  <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0 0" }}>{ms.date}</p>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bg-white border-r border-b rotate-45" style={{ width: 8, height: 8, bottom: -4, borderColor: "rgba(0,0,0,0.04)" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100" style={{ fontSize: 11, color: "#9ca3af" }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-gray-300 rotate-45" />
                    <span>Milestone / Deadline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
                    <span>Project Duration</span>
                  </div>
                  <span className="ml-auto" style={{ fontStyle: "italic" }}>Click a month above to navigate — zoomed to weekly resolution</span>
                </div>
              </>
            ) : (
              /* ── SEMESTER VIEW ── */
              <>
                {/* Table Header */}
                <div className="grid grid-cols-[180px_1fr]" style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>Course / Program</div>
                  <div
                    className="grid grid-cols-6 text-center"
                    style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}
                  >
                    {currentTimeline?.months.map((month, monthIdx) => (
                      <div
                        key={month}
                        onClick={() => setZoomedMonth(monthIdx)}
                        className="cursor-pointer hover:text-[#2d5a47] hover:underline underline-offset-4 transition-colors"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Rows */}
                <div className="space-y-1">
                  {currentTimeline?.rows.map((row, ri) => {
                    const barWidth = row.barEnd - row.barStart;
                    return (
                      <div
                        key={`${selectedSemester}-${ri}`}
                        className={`grid grid-cols-[180px_1fr] items-center -mx-3 px-3 py-3 rounded-xl transition-colors cursor-pointer ${
                          row.highlighted
                            ? "bg-gray-50/80 hover:bg-gray-100/60"
                            : "hover:bg-gray-50/50"
                        }`}
                      >
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                          {row.name}
                        </div>
                        <div className="relative" style={{ height: 40 }}>
                          {/* Duration Bar */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 group/bar cursor-pointer"
                            style={{ left: `${row.barStart}%`, width: `${barWidth}%`, height: 24 }}
                          >
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 w-full rounded-full ${row.color.bar}`}
                              style={{ height: 10 }}
                            />
                            {/* Bar hover tooltip */}
                            <div
                              className="absolute left-1/2 -translate-x-1/2 -top-10 opacity-0 group-hover/bar:opacity-100 transition-all duration-150 pointer-events-none z-20"
                            >
                              <div
                                className="bg-white whitespace-nowrap"
                                style={{
                                  padding: "8px 14px",
                                  borderRadius: 12,
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                                  border: "1px solid rgba(0,0,0,0.04)",
                                }}
                              >
                                <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0 }}>
                                  {row.dateLabel}
                                </p>
                              </div>
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bg-white border-r border-b rotate-45"
                                style={{ width: 8, height: 8, bottom: -4, borderColor: "rgba(0,0,0,0.04)" }}
                              />
                            </div>
                          </div>

                          {/* Milestone Diamonds */}
                          {row.milestones.map((ms, mi) => {
                            const absPos = row.barStart + (ms.position / 100) * barWidth;
                            return (
                              <div
                                key={`${selectedSemester}-${ri}-m${mi}`}
                                className="absolute z-10 cursor-pointer group/ms"
                                style={{
                                  left: `${absPos}%`,
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                                onClick={() => navigate("/company/projects")}
                              >
                                {/* Diamond */}
                                <div
                                  className={`w-[14px] h-[14px] ${row.color.diamond} rotate-45 border-2 border-white`}
                                  style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/ms:opacity-100 transition-all duration-150 pointer-events-none z-30">
                                  <div
                                    className="bg-white whitespace-nowrap"
                                    style={{
                                      padding: "8px 14px",
                                      borderRadius: 12,
                                      boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                                      border: "1px solid rgba(0,0,0,0.04)",
                                    }}
                                  >
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0 }}>
                                      {ms.label}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0 0" }}>
                                      {ms.date}
                                    </p>
                                  </div>
                                  <div
                                    className="absolute left-1/2 -translate-x-1/2 bg-white border-r border-b rotate-45"
                                    style={{ width: 8, height: 8, bottom: -4, borderColor: "rgba(0,0,0,0.04)" }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Row */}
                <div className="flex items-center gap-5 mt-6 pt-4 border-t border-gray-100" style={{ fontSize: 11, color: "#9ca3af" }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-gray-300 rotate-45" />
                    <span>Milestone / Deadline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
                    <span>Project Duration</span>
                  </div>
                  <span className="ml-auto" style={{ fontStyle: "italic" }}>
                    Click a month to zoom in — hover diamonds &amp; bars for dates
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            BOTTOM SECTION: COURSE GALLERY
            ───────────────────────────────────────────────── */}
        <div id="partnerships" style={{ padding: 40 }}>
          {/* Section Header */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", margin: 0, marginBottom: 20 }}>
            Available University Courses
          </h2>

          {/* Topic Filter Bar */}
          <div className="flex items-center gap-3" style={{ marginBottom: 28 }}>
            {TOPIC_FILTERS.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(active ? null : f)}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white overflow-hidden group flex flex-col"
                style={{
                  width: 340,
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
                {/* Image Header — 140px */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: 140, background: course.imageGradient }}
                  onClick={() => navigate(course.route)}
                >
                  <ImageWithFallback
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                  />
                  {/* University Overlay Pill */}
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
                      {course.university}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  onClick={() => navigate(course.route)}
                  style={{ padding: "16px 20px 0 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", lineHeight: 1.3, margin: 0 }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                    {course.detail}
                  </p>
                </div>

                {/* Card Footer — Pinned to bottom */}
                <div style={{ padding: "12px 20px 20px 20px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(course.route);
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
                    View Course Requirements
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacer for DemoNav */}
        <div style={{ height: 100 }} />
      </main>

      {/* ╔═══════════════════════════════════════════════════╗
         ║          AI PROJECT WIZARD MODAL                  ║
         ╚═══════════════════════════════════════════════════╝ */}
      <AIProjectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={(data) => {
          console.log("Project submitted for course:", wizardCourseId, data);
          navigate("/company/proposals");
        }}
      />
    </div>
  );
}
