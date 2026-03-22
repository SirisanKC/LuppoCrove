import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Trees,
  Plus,
  BookOpen,
  FileText,
  FolderOpen,
  Target,
  Calendar,
  Eye,
  Edit,
  Sparkles,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { CompanyNav } from "../components/CompanyNav";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
type ProposalStatus = "draft" | "under-review" | "approved" | "rejected";
type FilterStatus = "all" | "draft" | "under-review" | "approved";

interface Proposal {
  id: string;
  title: string;
  targetTopic: string;
  submittedDate: string;
  status: ProposalStatus;
  university: string;
  timeline: string;
  aiGenerated?: boolean;
  courseRoute: string;
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const proposals: Proposal[] = [
  {
    id: "1",
    title: "Predictive Maintenance Modeling via Telemetry Data",
    targetTopic: "AI & Analytics",
    submittedDate: "Oct 12, 2026",
    status: "under-review",
    university: "University of Helsinki",
    timeline: "12-14 Weeks",
    aiGenerated: true,
    courseRoute: "/company/courses/helsinki/ML-ADV",
  },
  {
    id: "2",
    title: "Supply Chain Optimization Dashboard",
    targetTopic: "Data Analytics",
    submittedDate: "Oct 8, 2026",
    status: "approved",
    university: "Aalto University",
    timeline: "10 Weeks",
    aiGenerated: true,
    courseRoute: "/company/courses/aalto/CS-C3170",
  },
  {
    id: "3",
    title: "Real-Time Anomaly Detection System",
    targetTopic: "Software Engineering",
    submittedDate: "Oct 15, 2026",
    status: "draft",
    university: "LUT University",
    timeline: "14 Weeks",
    aiGenerated: true,
    courseRoute: "/company/courses/CT60A9800",
  },
  {
    id: "4",
    title: "Customer Sentiment Analysis Tool",
    targetTopic: "AI & Analytics",
    submittedDate: "Oct 1, 2026",
    status: "approved",
    university: "Tampere University",
    timeline: "8 Weeks",
    courseRoute: "/company/courses/tampere/COMP.CS.400",
  },
  {
    id: "5",
    title: "IoT Device Fleet Management Platform",
    targetTopic: "Software Engineering",
    submittedDate: "Oct 10, 2026",
    status: "under-review",
    university: "University of Oulu",
    timeline: "16 Weeks",
    aiGenerated: true,
    courseRoute: "/company/courses/oulu/DSD-2026",
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
   TEAM
   ═══════════════════════════════════════════════════════════ */
const TEAM = [
  { id: "1", name: "Alex Chen", initials: "AC", role: "Owner" },
  { id: "2", name: "Maria Santos", initials: "MS", role: "Co-owner" },
  { id: "3", name: "David Lee", initials: "DL", role: "Developer" },
  { id: "4", name: "Emma Wilson", initials: "EW", role: "Developer" },
];

const ROLE_PILL: Record<string, string> = {
  Owner: "bg-[#2d5a47]/12 text-[#2d5a47]",
  "Co-owner": "bg-[#2d5a47]/8 text-[#3d7a5f]",
  Developer: "bg-blue-50 text-blue-600",
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const STATUS_CONFIG: Record<
  ProposalStatus,
  { label: string; bg: string; color: string; dotColor: string }
> = {
  draft: {
    label: "Draft",
    bg: "rgba(100, 116, 139, 0.08)",
    color: "#64748b",
    dotColor: "#94a3b8",
  },
  "under-review": {
    label: "Under Review",
    bg: "rgba(245, 158, 11, 0.08)",
    color: "#b45309",
    dotColor: "#f59e0b",
  },
  approved: {
    label: "Approved",
    bg: "rgba(34, 197, 94, 0.08)",
    color: "#15803d",
    dotColor: "#22c55e",
  },
  rejected: {
    label: "Rejected",
    bg: "rgba(239, 68, 68, 0.08)",
    color: "#dc2626",
    dotColor: "#ef4444",
  },
};

const FILTER_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "under-review", label: "Under Review" },
  { key: "approved", label: "Approved" },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT: MyProposals
   ═══════════════════════════════════════════════════════════ */
export function MyProposals() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filteredProposals = proposals.filter(
    (p) => activeFilter === "all" || p.status === activeFilter
  );

  const counts = {
    all: proposals.length,
    draft: proposals.filter((p) => p.status === "draft").length,
    "under-review": proposals.filter((p) => p.status === "under-review").length,
    approved: proposals.filter((p) => p.status === "approved").length,
  };

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
        <div style={{ padding: "40px 40px 100px 40px" }}>
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
                My Proposals
              </h1>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Track and manage your submitted academic project proposals
              </p>
            </div>

            <button
              onClick={() => navigate("/company#partnerships")}
              className="transition-all flex items-center gap-2"
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: "#2d5a47",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#234739";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 12px rgba(45,90,71,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#2d5a47";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <Plus size={16} />
              New Proposal
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div
            className="flex items-center gap-4"
            style={{ marginBottom: 24 }}
          >
            {[
              { label: "Total", count: counts.all, color: "#374151" },
              { label: "Drafts", count: counts.draft, color: "#64748b" },
              { label: "In Review", count: counts["under-review"], color: "#b45309" },
              { label: "Approved", count: counts.approved, color: "#15803d" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.05)",
                  minWidth: 100,
                }}
              >
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: stat.color,
                    margin: 0,
                    lineHeight: 1.2,
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
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* ── Filter Bar ── */}
          <div
            className="flex items-center gap-2"
            style={{ marginBottom: 24 }}
          >
            {FILTER_OPTIONS.map((opt) => {
              const active = activeFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setActiveFilter(opt.key)}
                  className="transition-all"
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    backgroundColor: active ? "#2d5a47" : "transparent",
                    color: active ? "#ffffff" : "#6b7280",
                    border: active ? "none" : "1px solid #e5e5e5",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                  {counts[opt.key] > 0 && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        opacity: active ? 0.7 : 0.5,
                      }}
                    >
                      {counts[opt.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Proposals List ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {filteredProposals.map((proposal) => {
              const status = STATUS_CONFIG[proposal.status];
              const isEditable =
                proposal.status === "draft" || proposal.status === "under-review";

              return (
                <div
                  key={proposal.id}
                  className="group"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.05)",
                    padding: "20px 24px",
                    transition:
                      "border-color 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,90,71,0.2)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.05)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                  onClick={() =>
                    navigate(`/company/proposals/${proposal.id}/edit`)
                  }
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      {/* Top row: Status + AI badge */}
                      <div
                        className="flex items-center gap-2"
                        style={{ marginBottom: 8 }}
                      >
                        {/* Status Pill */}
                        <span
                          className="flex items-center gap-1.5"
                          style={{
                            display: "inline-flex",
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor: status.bg,
                            color: status.color,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: status.dotColor,
                              display: "inline-block",
                            }}
                          />
                          {status.label}
                        </span>

                        {proposal.aiGenerated && (
                          <span
                            className="flex items-center gap-1"
                            style={{
                              display: "inline-flex",
                              padding: "3px 8px",
                              borderRadius: 999,
                              fontSize: 10,
                              fontWeight: 600,
                              backgroundColor: "rgba(251, 191, 36, 0.08)",
                              color: "#b45309",
                            }}
                          >
                            <Sparkles size={10} />
                            AI
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: 17,
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                          marginBottom: 8,
                          lineHeight: 1.3,
                        }}
                      >
                        {proposal.title}
                      </h3>

                      {/* Meta */}
                      <div
                        className="flex items-center flex-wrap"
                        style={{ gap: "6px 16px", fontSize: 13, color: "#6b7280" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Target size={13} strokeWidth={1.5} />
                          {proposal.targetTopic}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} strokeWidth={1.5} />
                          {proposal.status === "draft"
                            ? `Created ${proposal.submittedDate}`
                            : `Submitted ${proposal.submittedDate}`}
                        </span>
                        {proposal.university && (
                          <span style={{ color: "#9ca3af" }}>
                            • {proposal.university}
                          </span>
                        )}
                        <span style={{ color: "#9ca3af" }}>
                          • {proposal.timeline}
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      style={{ marginTop: 4 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/company/proposals/${proposal.id}/edit`);
                        }}
                        className="flex items-center gap-1.5 transition-all"
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#374151",
                          backgroundColor: "transparent",
                          border: "1px solid #e5e7eb",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "#2d5a47";
                          (e.currentTarget as HTMLElement).style.color = "#2d5a47";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                          (e.currentTarget as HTMLElement).style.color = "#374151";
                        }}
                      >
                        {isEditable ? (
                          <>
                            <Edit size={13} strokeWidth={1.5} />
                            Edit
                          </>
                        ) : (
                          <>
                            <Eye size={13} strokeWidth={1.5} />
                            View
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(proposal.courseRoute);
                        }}
                        className="flex items-center gap-1.5 transition-all"
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#2d5a47",
                          backgroundColor: "rgba(45,90,71,0.06)",
                          border: "1px solid rgba(45,90,71,0.12)",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(45,90,71,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(45,90,71,0.06)";
                        }}
                      >
                        <ExternalLink size={13} strokeWidth={1.5} />
                        View Template
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Empty State ── */}
          {filteredProposals.length === 0 && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ padding: "80px 0", textAlign: "center" }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "#f5f5f4",
                  marginBottom: 16,
                }}
              >
                <FileText size={28} color="#9ca3af" strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                No proposals found
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                {activeFilter === "all"
                  ? "You haven't created any proposals yet."
                  : `You don't have any ${activeFilter.replace("-", " ")} proposals.`}
              </p>
              <button
                onClick={() => navigate("/company#partnerships")}
                className="flex items-center gap-2 transition-all"
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor: "#2d5a47",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                Create Your First Proposal
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}