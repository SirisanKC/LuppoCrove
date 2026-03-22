import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Trees,
  BookOpen,
  FileText,
  FolderOpen,
  Calendar,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  Upload,
  FileUp,
  Check,
  Lock,
  AlertTriangle,
  Diamond,
  ExternalLink,
  Users,
  GraduationCap,
  X,
  File,
} from "lucide-react";
import { CompanyNav } from "@/app/components/CompanyNav";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
interface TeamMember {
  id: string;
  name: string;
  initials: string;
  isTeacher: boolean;
}

interface GanttMilestone {
  id: string;
  label: string;
  date: string;
  ganttPosition: number; // 0-100 matching the Gantt chart
  status: "completed" | "active" | "upcoming" | "locked";
  submittedFile?: string;
  submittedDate?: string;
}

interface ActiveProject {
  id: string;
  title: string;
  courseCode: string;
  university: string;
  squad: string;
  currentWeek: number;
  totalWeeks: number;
  progressPercentage: number;
  ganttColor: string;
  ganttBarColor: string;
  team: TeamMember[];
  milestones: GanttMilestone[];
  dateRange: string;
}

/* ═══════════════════════════════════════════════════════════
   DATA — Aligned with CompanyHub Gantt Chart (Fall 2026)
   ═══════════════════════════════════════════════════════════ */
const PROJECTS: ActiveProject[] = [
  {
    id: "1",
    title: "LUT Capstone: Software Engineering",
    courseCode: "CT60A9800",
    university: "LUT University",
    squad: "Data Analytics Squad",
    currentWeek: 4,
    totalWeeks: 18,
    progressPercentage: 22,
    ganttColor: "#10b981",
    ganttBarColor: "rgba(16, 185, 129, 0.15)",
    dateRange: "Aug 15, 2026 – Dec 18, 2026",
    team: [
      { id: "s1", name: "Sara Korhonen", initials: "SK", isTeacher: false },
      { id: "s2", name: "Mikko Virtanen", initials: "MV", isTeacher: false },
      { id: "s3", name: "Emma Laaksonen", initials: "EL", isTeacher: false },
      { id: "s4", name: "Jani Mäkinen", initials: "JM", isTeacher: false },
      { id: "t1", name: "Prof. Jonas Hämäläinen", initials: "JH", isTeacher: true },
    ],
    milestones: [
      {
        id: "m1",
        label: "Project Plan & NDA Sign-off",
        date: "Sep 15, 2026",
        ganttPosition: 10,
        status: "active",
      },
      {
        id: "m2",
        label: "Mid-term Progress Report",
        date: "Oct 15, 2026",
        ganttPosition: 35,
        status: "upcoming",
      },
      {
        id: "m3",
        label: "Beta Testing & Draft Submission",
        date: "Nov 10, 2026",
        ganttPosition: 62,
        status: "locked",
      },
      {
        id: "m4",
        label: "Final Demo & Handover",
        date: "Dec 15, 2026",
        ganttPosition: 92,
        status: "locked",
      },
    ],
  },
  {
    id: "2",
    title: "Aalto: Software Engineering Project",
    courseCode: "CS-C3170",
    university: "Aalto University",
    squad: "Software Engineering Team",
    currentWeek: 7,
    totalWeeks: 18,
    progressPercentage: 39,
    ganttColor: "#3b82f6",
    ganttBarColor: "rgba(59, 130, 246, 0.15)",
    dateRange: "Aug 15, 2026 – Dec 18, 2026",
    team: [
      { id: "s5", name: "Liisa Niemi", initials: "LN", isTeacher: false },
      { id: "s6", name: "Petri Hämäläinen", initials: "PH", isTeacher: false },
      { id: "s7", name: "Anna Mäki", initials: "AM", isTeacher: false },
      { id: "s8", name: "Tero Saarinen", initials: "TS", isTeacher: false },
      { id: "s9", name: "Riikka Lehtonen", initials: "RL", isTeacher: false },
      { id: "t2", name: "Dr. Maria Rantanen", initials: "MR", isTeacher: true },
    ],
    milestones: [
      {
        id: "a1",
        label: "Team Selection Submitted",
        date: "Sep 22, 2026",
        ganttPosition: 15,
        status: "completed",
        submittedFile: "team-selection-v2.pdf",
        submittedDate: "Sep 20, 2026",
      },
      {
        id: "a2",
        label: "Mid-term Review",
        date: "Oct 28, 2026",
        ganttPosition: 42,
        status: "active",
      },
      {
        id: "a3",
        label: "Code Freeze",
        date: "Dec 4, 2026",
        ganttPosition: 72,
        status: "locked",
      },
      {
        id: "a4",
        label: "Final Demo",
        date: "Dec 16, 2026",
        ganttPosition: 95,
        status: "locked",
      },
    ],
  },
  {
    id: "3",
    title: "Helsinki: OHTU — Software Production",
    courseCode: "TKT20006",
    university: "University of Helsinki",
    squad: "Full-Stack Dev Team",
    currentWeek: 5,
    totalWeeks: 10,
    progressPercentage: 50,
    ganttColor: "#a855f7",
    ganttBarColor: "rgba(168, 85, 247, 0.15)",
    dateRange: "Aug 15, 2026 – Oct 30, 2026",
    team: [
      { id: "s10", name: "Kari Lahtinen", initials: "KL", isTeacher: false },
      { id: "s11", name: "Sanna Peltonen", initials: "SP", isTeacher: false },
      { id: "s12", name: "Ville Koivisto", initials: "VK", isTeacher: false },
      { id: "t3", name: "Prof. Antti Salminen", initials: "AS", isTeacher: true },
    ],
    milestones: [
      {
        id: "h1",
        label: "Team Allocation",
        date: "Sep 22, 2026",
        ganttPosition: 35,
        status: "completed",
        submittedFile: "allocation-confirmation.pdf",
        submittedDate: "Sep 21, 2026",
      },
      {
        id: "h2",
        label: "Sprint Review",
        date: "Oct 22, 2026",
        ganttPosition: 85,
        status: "upcoming",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   NAV ITEMS
   ═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "browse", label: "Browse Courses", icon: BookOpen, path: "/company" },
  { id: "proposals", label: "My Proposals", icon: FileText, path: "/company/proposals" },
  { id: "projects", label: "Active Projects", icon: FolderOpen, path: "/company/projects", notif: true },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT: ActiveProjects
   ═══════════════════════════════════════════════════════════ */
export function ActiveProjects() {
  const navigate = useNavigate();
  const [expandedProject, setExpandedProject] = useState<string | null>("1"); // LUT expanded by default

  const toggleProject = (id: string) => {
    setExpandedProject((prev) => (prev === id ? null : id));
  };

  const activeCount = PROJECTS.length;
  const milestonesDue = PROJECTS.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.status === "active").length,
    0
  );
  const completedMilestones = PROJECTS.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.status === "completed").length,
    0
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#fafaf9", fontFamily: "Inter, sans-serif" }}
    >
      <CompanyNav />

      {/* ╔═══════════════════════════════════════════════╗
         ║          MAIN CONTENT AREA                      ║
         ╚═══════════════════════════════════════════════╝ */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: "100vh" }}>
        <div style={{ padding: "40px 40px 120px 40px" }}>
          {/* ── Header ── */}
          <div
            className="flex items-start justify-between"
            style={{ marginBottom: 32 }}
          >
            <div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                  marginBottom: 6,
                }}
              >
                Active Projects Workspace
              </h1>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Monitor your ongoing collaborations and manage pending requests
                from course coordinators.
              </p>
            </div>

            <button
              className="flex items-center gap-2 transition-all"
              style={{
                padding: "9px 18px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 8px rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <Download size={15} strokeWidth={1.5} />
              Export Reports
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div
            className="flex items-center gap-4"
            style={{ marginBottom: 28 }}
          >
            {[
              {
                label: "Active Projects",
                count: activeCount,
                color: "#2d5a47",
                iconEl: <FolderOpen size={16} color="#2d5a47" strokeWidth={1.5} />,
              },
              {
                label: "Milestones Due",
                count: milestonesDue,
                color: "#b45309",
                iconEl: <AlertTriangle size={16} color="#f59e0b" strokeWidth={1.5} />,
              },
              {
                label: "Completed",
                count: completedMilestones,
                color: "#15803d",
                iconEl: <Check size={16} color="#22c55e" strokeWidth={2} />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3"
                style={{
                  padding: "14px 20px",
                  borderRadius: 12,
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: `${stat.color}0a`,
                  }}
                >
                  {stat.iconEl}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: stat.color,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.count}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#9ca3af",
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Project Cards ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PROJECTS.map((project) => {
              const isExpanded = expandedProject === project.id;
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isExpanded={isExpanded}
                  onToggle={() => toggleProject(project.id)}
                  onNavigate={() =>
                    navigate(`/company/projects/${project.id}/workspace`)
                  }
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENT: ProjectCard
   ═══════════════════════════════════════════════════════════ */
function ProjectCard({
  project,
  isExpanded,
  onToggle,
  onNavigate,
}: {
  project: ActiveProject;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        border: isExpanded
          ? `1.5px solid ${project.ganttColor}25`
          : "1px solid rgba(0,0,0,0.05)",
        overflow: "hidden",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isExpanded
          ? `0 4px 20px ${project.ganttColor}08`
          : "none",
      }}
    >
      {/* ── Card Header ── */}
      <div
        className="flex items-center justify-between cursor-pointer"
        style={{ padding: "24px 28px" }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Color indicator */}
          <div
            className="shrink-0 rounded-lg"
            style={{
              width: 6,
              height: 48,
              backgroundColor: project.ganttColor,
              borderRadius: 3,
            }}
          />

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-3 mb-2">
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {project.title}
              </h3>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  color: "#15803d",
                }}
              >
                Week {project.currentWeek}/{project.totalWeeks}
              </span>
            </div>

            {/* Meta row */}
            <div
              className="flex items-center flex-wrap"
              style={{ gap: "4px 14px", fontSize: 13, color: "#6b7280" }}
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap size={13} strokeWidth={1.5} />
                {project.university}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={13} strokeWidth={1.5} />
                {project.squad}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} strokeWidth={1.5} />
                {project.dateRange}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {/* Progress */}
          <div className="flex items-center gap-2.5" style={{ width: 160 }}>
            <div
              style={{
                flex: 1,
                height: 6,
                backgroundColor: "#f0f0ed",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${project.progressPercentage}%`,
                  height: "100%",
                  backgroundColor: project.ganttColor,
                  borderRadius: 3,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: project.ganttColor,
                minWidth: 32,
              }}
            >
              {project.progressPercentage}%
            </span>
          </div>

          {/* Team avatars */}
          <div className="flex -space-x-1.5">
            {project.team.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-center rounded-full"
                title={m.name}
                style={{
                  width: 28,
                  height: 28,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: m.isTeacher
                    ? "rgba(45, 90, 71, 0.1)"
                    : "#f3f4f6",
                  color: m.isTeacher ? "#2d5a47" : "#6b7280",
                  border: m.isTeacher
                    ? "2px solid #2d5a47"
                    : "2px solid #ffffff",
                }}
              >
                {m.initials}
              </div>
            ))}
            {project.team.length > 4 && (
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  color: "#9ca3af",
                  border: "2px solid #ffffff",
                }}
              >
                +{project.team.length - 4}
              </div>
            )}
          </div>

          {/* Expand toggle */}
          <div
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: 32,
              height: 32,
              backgroundColor: isExpanded
                ? `${project.ganttColor}0d`
                : "#f9fafb",
            }}
          >
            {isExpanded ? (
              <ChevronUp size={16} color={project.ganttColor} />
            ) : (
              <ChevronDown size={16} color="#9ca3af" />
            )}
          </div>
        </div>
      </div>

      {/* ── Expanded: Milestones Section ── */}
      {isExpanded && (
        <div
          style={{
            borderTop: "1px solid #f3f4f6",
            padding: "24px 28px 28px 28px",
          }}
        >
          {/* Mini Gantt Bar */}
          <div style={{ marginBottom: 24 }}>
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 10 }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Project Milestones
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#9ca3af",
                }}
              >
                Matches Gantt Chart Timeline
              </span>
            </div>

            {/* Visual mini-gantt bar with diamond positions */}
            <div
              className="relative"
              style={{
                height: 28,
                backgroundColor: project.ganttBarColor,
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              {/* Progress fill */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${project.progressPercentage}%`,
                  backgroundColor: `${project.ganttColor}20`,
                  borderRadius: "8px 0 0 8px",
                }}
              />
              {/* Diamond markers */}
              {project.milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${ms.ganttPosition}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                    width: 12,
                    height: 12,
                    backgroundColor:
                      ms.status === "completed"
                        ? project.ganttColor
                        : ms.status === "active"
                        ? "#f59e0b"
                        : "#d1d5db",
                    borderRadius: 2,
                  }}
                />
              ))}
              {/* "Now" marker */}
              <div
                style={{
                  position: "absolute",
                  left: `${project.progressPercentage}%`,
                  top: -3,
                  bottom: -3,
                  width: 2,
                  backgroundColor: project.ganttColor,
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* Milestone Task List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {project.milestones.map((milestone, index) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                index={index}
                ganttColor={project.ganttColor}
              />
            ))}
          </div>

          {/* Open Workspace button */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={onNavigate}
              className="flex items-center justify-center gap-2 w-full transition-all"
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: project.ganttColor,
                backgroundColor: `${project.ganttColor}08`,
                border: `1.5px solid ${project.ganttColor}20`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  project.ganttColor;
                (e.currentTarget as HTMLElement).style.color = "#ffffff";
                (e.currentTarget as HTMLElement).style.borderColor =
                  project.ganttColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = `${project.ganttColor}08`;
                (e.currentTarget as HTMLElement).style.color =
                  project.ganttColor;
                (e.currentTarget as HTMLElement).style.borderColor = `${project.ganttColor}20`;
              }}
            >
              <ExternalLink size={15} />
              Open Full Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENT: MilestoneItem
   ═══════════════════════════════════════════════════════════ */
function MilestoneItem({
  milestone,
  index,
  ganttColor,
}: {
  milestone: GanttMilestone;
  index: number;
  ganttColor: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    milestone.submittedFile ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isActive = milestone.status === "active";
  const isCompleted = milestone.status === "completed";
  const isLocked = milestone.status === "locked";
  const isUpcoming = milestone.status === "upcoming";

  const canUpload = isActive || isUpcoming;

  /* ── Native HTML5 Drag & Drop ── */
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!canUpload) return;
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    },
    [canUpload]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (!canUpload) return;
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        setUploadedFile(files[0].name);
      }
    },
    [canUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setUploadedFile(files[0].name);
      }
    },
    []
  );

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  /* ── Status icon ── */
  const StatusIcon = () => {
    if (isCompleted || uploadedFile) {
      return (
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 28,
            height: 28,
            backgroundColor: "#d1fae5",
          }}
        >
          <Check size={14} color="#065f46" strokeWidth={2.5} />
        </div>
      );
    }
    if (isActive) {
      return (
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 28,
            height: 28,
            backgroundColor: "#fef3c7",
          }}
        >
          <AlertTriangle size={14} color="#b45309" strokeWidth={2} />
        </div>
      );
    }
    if (isUpcoming) {
      return (
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 28,
            height: 28,
            backgroundColor: "#f3f4f6",
          }}
        >
          <Clock size={14} color="#9ca3af" strokeWidth={1.8} />
        </div>
      );
    }
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "#f3f4f6",
        }}
      >
        <Lock size={13} color="#d1d5db" strokeWidth={2} />
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "16px 20px",
        borderRadius: 12,
        backgroundColor: isActive && !uploadedFile
          ? "rgba(245, 158, 11, 0.04)"
          : isCompleted || uploadedFile
          ? "rgba(34, 197, 94, 0.03)"
          : "#fafaf9",
        border: isActive && !uploadedFile
          ? "1px solid rgba(245, 158, 11, 0.12)"
          : isCompleted || uploadedFile
          ? "1px solid rgba(34, 197, 94, 0.1)"
          : "1px solid rgba(0,0,0,0.04)",
        opacity: isLocked ? 0.55 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {/* Left: Status + Label */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <StatusIcon />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#9ca3af",
              }}
            >
              M{index + 1}
            </span>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: isLocked ? "#9ca3af" : "#111827",
                margin: 0,
              }}
            >
              {milestone.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} color="#9ca3af" strokeWidth={1.5} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: "#9ca3af",
              }}
            >
              Due: {milestone.date}
            </span>
            {isActive && !uploadedFile && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                }}
              >
                ACTION REQUIRED
              </span>
            )}
            {(isCompleted || uploadedFile) && milestone.submittedDate && (
              <span style={{ fontSize: 12, color: "#065f46" }}>
                Submitted {milestone.submittedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Dropzone / Completed file / Locked */}
      <div className="shrink-0" style={{ width: 260 }}>
        {isCompleted && !uploadedFile ? (
          /* Already submitted from server data */
          <div
            className="flex items-center gap-2"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              backgroundColor: "#d1fae5",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            <File size={14} color="#065f46" strokeWidth={1.5} />
            <span
              className="flex-1 truncate"
              style={{ fontSize: 12, fontWeight: 500, color: "#065f46" }}
            >
              {milestone.submittedFile}
            </span>
            <Check size={14} color="#065f46" strokeWidth={2.5} />
          </div>
        ) : uploadedFile ? (
          /* Just uploaded */
          <div
            className="flex items-center gap-2"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              backgroundColor: "#d1fae5",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            <File size={14} color="#065f46" strokeWidth={1.5} />
            <span
              className="flex-1 truncate"
              style={{ fontSize: 12, fontWeight: 500, color: "#065f46" }}
            >
              {uploadedFile}
            </span>
            <button
              onClick={handleRemoveFile}
              className="flex items-center justify-center rounded-full transition-colors hover:bg-red-100"
              style={{ width: 20, height: 20 }}
            >
              <X size={12} color="#dc2626" />
            </button>
          </div>
        ) : canUpload ? (
          /* Active/Upcoming dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="transition-all"
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              backgroundColor: dragOver ? "rgba(45, 90, 71, 0.06)" : "#f0f0ed",
              border: dragOver
                ? "2px dashed #2d5a47"
                : "2px dashed #d1d5db",
              textAlign: "center" as const,
              cursor: "pointer",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.zip,.pptx"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <div className="flex flex-col items-center gap-1.5">
              <FileUp
                size={16}
                color={dragOver ? "#2d5a47" : "#9ca3af"}
                strokeWidth={1.5}
              />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: dragOver ? "#2d5a47" : "#6b7280",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {dragOver ? "Drop to upload" : "Drag & drop PDF here"}
              </p>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: dragOver ? "#2d5a47" : "#9ca3af",
                  textDecoration: "underline",
                }}
              >
                Browse files
              </span>
            </div>
          </div>
        ) : (
          /* Locked */
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              backgroundColor: "#f9fafb",
              border: "2px dashed #e5e7eb",
              textAlign: "center" as const,
              opacity: 0.6,
            }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <Lock size={14} color="#d1d5db" strokeWidth={1.8} />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#d1d5db",
                  margin: 0,
                }}
              >
                Locked — previous milestone required
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
