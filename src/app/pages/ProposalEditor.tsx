import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Save,
  Trash2,
  ChevronDown,
  Sparkles,
  FileText,
  Clock,
  Users,
  Shield,
  BookOpen,
  Check,
  AlertTriangle,
} from "lucide-react";
import { CompanyNav } from "../components/CompanyNav";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
interface ProposalField {
  id: string;
  sectionNumber: number;
  label: string;
  icon: React.ReactNode;
  type: "text" | "textarea" | "dropdown";
  placeholder: string;
  value: string;
  options?: string[];
  aiGenerated?: boolean;
  hint?: string;
}

/* ═══════════════════════════════════════════════════════════
   MOCK DATA — simulates a saved AI-generated proposal
   ═══════════════════════════════════════════════════════════ */
const PROPOSALS_DB: Record<
  string,
  { course: string; university: string; fields: Omit<ProposalField, "icon">[] }
> = {
  "1": {
    course: "Advanced Machine Learning Practicum",
    university: "University of Helsinki",
    fields: [
      {
        id: "title",
        sectionNumber: 1,
        label: "Project Title",
        type: "text",
        placeholder: "Enter a concise project title...",
        value: "Predictive Maintenance Model for Telemetry Data",
        aiGenerated: true,
        hint: "The AI generated this from your conversation. Feel free to refine it.",
      },
      {
        id: "goals",
        sectionNumber: 2,
        label: "Project Goals & Benefits",
        type: "textarea",
        placeholder: "Describe the project goals and company benefits...",
        value:
          "To build a functional MVP that analyzes crane telemetry data and predicts equipment failures 48-72 hours before they occur. Students will work with a 3.2TB real-world dataset containing sensor readings including temperature, vibration, pressure, and operational metrics collected over 18 months of continuous operation.\n\nExpected benefits include reduced unplanned downtime by 35%, optimized maintenance scheduling, and a deployable inference pipeline that integrates with existing monitoring systems.",
        aiGenerated: true,
        hint: "Expand on the goals or refine the AI's summary of your chat.",
      },
      {
        id: "nda",
        sectionNumber: 3,
        label: "Legal & NDA Status",
        type: "dropdown",
        placeholder: "Select NDA requirement...",
        value: "Standard LUT NDA Required",
        options: [
          "No NDA Required",
          "Standard LUT NDA Required",
          "Custom Company NDA Required",
          "Conditional — Depends on Team",
        ],
        hint: "Specify any legal requirements for student access.",
      },
      {
        id: "scope",
        sectionNumber: 4,
        label: "Project Scope & Deliverables",
        type: "textarea",
        placeholder: "List expected deliverables...",
        value:
          "• Trained ML model achieving ≥85% precision on failure prediction\n• Interactive dashboard for maintenance scheduling visualization\n• Technical documentation covering model architecture and deployment\n• 12-week sprint report with bi-weekly checkpoint deliverables",
        aiGenerated: true,
      },
      {
        id: "team",
        sectionNumber: 5,
        label: "Team Requirements",
        type: "text",
        placeholder: "e.g. 4-5 students with ML experience...",
        value: "Small team (3-4 students) with Python and ML experience",
        aiGenerated: true,
      },
      {
        id: "timeline",
        sectionNumber: 6,
        label: "Timeline & Duration",
        type: "text",
        placeholder: "e.g. 12 weeks, Fall 2026...",
        value: "12-14 Weeks — Fall Semester 2026",
        aiGenerated: true,
      },
    ],
  },
  "2": {
    course: "Software Engineering Project",
    university: "Aalto University",
    fields: [
      {
        id: "title",
        sectionNumber: 1,
        label: "Project Title",
        type: "text",
        placeholder: "Enter a concise project title...",
        value: "Supply Chain Optimization Dashboard",
        aiGenerated: true,
      },
      {
        id: "goals",
        sectionNumber: 2,
        label: "Project Goals & Benefits",
        type: "textarea",
        placeholder: "Describe the project goals and company benefits...",
        value:
          "Build a real-time supply chain visibility dashboard that aggregates data from multiple logistics providers. Students will design and develop a full-stack web application with interactive visualizations, alerting systems, and a predictive delay estimation module.\n\nBenefit: End-to-end operational visibility reducing supply chain disruption response time by 60%.",
        aiGenerated: true,
      },
      {
        id: "nda",
        sectionNumber: 3,
        label: "Legal & NDA Status",
        type: "dropdown",
        placeholder: "Select NDA requirement...",
        value: "No NDA Required",
        options: [
          "No NDA Required",
          "Standard LUT NDA Required",
          "Custom Company NDA Required",
          "Conditional — Depends on Team",
        ],
      },
      {
        id: "scope",
        sectionNumber: 4,
        label: "Project Scope & Deliverables",
        type: "textarea",
        placeholder: "List expected deliverables...",
        value:
          "• React/TypeScript frontend with real-time data visualization\n• Node.js REST API backend with PostgreSQL\n• Integration with 3 logistics provider APIs\n• CI/CD pipeline and deployment documentation",
        aiGenerated: true,
      },
      {
        id: "team",
        sectionNumber: 5,
        label: "Team Requirements",
        type: "text",
        placeholder: "e.g. 4-5 students...",
        value: "Medium team (5-6 students) with web development experience",
        aiGenerated: true,
      },
      {
        id: "timeline",
        sectionNumber: 6,
        label: "Timeline & Duration",
        type: "text",
        placeholder: "e.g. 10 weeks...",
        value: "10 Weeks — Fall Semester 2026",
        aiGenerated: true,
      },
    ],
  },
  "3": {
    course: "LUT Capstone",
    university: "LUT University",
    fields: [
      {
        id: "title",
        sectionNumber: 1,
        label: "Project Title",
        type: "text",
        placeholder: "Enter a concise project title...",
        value: "Real-Time Anomaly Detection System",
        aiGenerated: true,
        hint: "The AI generated this from your conversation. Feel free to refine it.",
      },
      {
        id: "goals",
        sectionNumber: 2,
        label: "Project Goals & Benefits",
        type: "textarea",
        placeholder: "Describe the project goals and company benefits...",
        value:
          "Develop a streaming anomaly detection system for industrial IoT sensor networks. The system will ingest high-frequency data streams and apply statistical and ML-based detection algorithms to flag irregular patterns in real-time.\n\nBenefit: Early anomaly detection reducing incident response time and preventing cascading failures in production environments.",
        aiGenerated: true,
      },
      {
        id: "nda",
        sectionNumber: 3,
        label: "Legal & NDA Status",
        type: "dropdown",
        placeholder: "Select NDA requirement...",
        value: "Standard LUT NDA Required",
        options: [
          "No NDA Required",
          "Standard LUT NDA Required",
          "Custom Company NDA Required",
          "Conditional — Depends on Team",
        ],
      },
      {
        id: "scope",
        sectionNumber: 4,
        label: "Project Scope & Deliverables",
        type: "textarea",
        placeholder: "List expected deliverables...",
        value:
          "• Real-time streaming data pipeline (Apache Kafka + Python)\n• Anomaly detection model with configurable sensitivity thresholds\n• Alert management dashboard with historical trend analysis\n• Comprehensive technical documentation and test suite",
        aiGenerated: true,
      },
      {
        id: "team",
        sectionNumber: 5,
        label: "Team Requirements",
        type: "text",
        placeholder: "e.g. 4-5 students...",
        value: "Medium team (5-6 students) with data engineering skills",
        aiGenerated: true,
      },
      {
        id: "timeline",
        sectionNumber: 6,
        label: "Timeline & Duration",
        type: "text",
        placeholder: "e.g. 14 weeks...",
        value: "14 Weeks — Fall Semester 2026",
        aiGenerated: true,
      },
    ],
  },
};

/* Default fallback for any proposal ID not in DB */
const DEFAULT_PROPOSAL = PROPOSALS_DB["1"];

/* ═══════════════════════════════════════════════════════════
   ICON MAP
   ═══════════════════════════════════════════════════════════ */
const SECTION_ICONS: Record<string, React.ReactNode> = {
  title: <FileText size={16} color="#94a3b8" strokeWidth={1.8} />,
  goals: <Sparkles size={16} color="#94a3b8" strokeWidth={1.8} />,
  nda: <Shield size={16} color="#94a3b8" strokeWidth={1.8} />,
  scope: <BookOpen size={16} color="#94a3b8" strokeWidth={1.8} />,
  team: <Users size={16} color="#94a3b8" strokeWidth={1.8} />,
  timeline: <Clock size={16} color="#94a3b8" strokeWidth={1.8} />,
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT: ProposalEditor
   ═══════════════════════════════════════════════════════════ */
export function ProposalEditor() {
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const source = PROPOSALS_DB[proposalId ?? ""] ?? DEFAULT_PROPOSAL;

  const [fields, setFields] = useState<ProposalField[]>(
    source.fields.map((f) => ({
      ...f,
      icon: SECTION_ICONS[f.id] ?? <FileText size={16} color="#94a3b8" />,
    }))
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset when proposal changes
  useEffect(() => {
    const src = PROPOSALS_DB[proposalId ?? ""] ?? DEFAULT_PROPOSAL;
    setFields(
      src.fields.map((f) => ({
        ...f,
        icon: SECTION_ICONS[f.id] ?? <FileText size={16} color="#94a3b8" />,
      }))
    );
    setSaved(false);
    setHasChanges(false);
  }, [proposalId]);

  const updateField = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#0f172a",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <CompanyNav />

      <div className="flex-1 flex flex-col" style={{ marginLeft: 260 }}>
      {/* ╔═══════════════════════════════════════════════╗
         ║    STICKY TOP HEADER                           ║
         ╚═══════════════════════════════════════════════╝ */}
      <header
        className="sticky top-0 z-30"
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center justify-between mx-auto"
          style={{ maxWidth: 900, padding: "20px 0" }}
        >
          {/* Left: Back */}
          <button
            onClick={() => navigate("/company/proposals")}
            className="flex items-center gap-2 transition-colors group"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div
              className="flex items-center justify-center rounded-lg transition-colors group-hover:bg-white/10"
              style={{
                width: 32,
                height: 32,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              <ArrowLeft size={16} color="#e2e8f0" />
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#e2e8f0",
              }}
            >
              Back to My Proposals
            </span>
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Save indicator */}
            {saved && (
              <div
                className="flex items-center gap-1.5"
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                }}
              >
                <Check size={14} color="#4ade80" strokeWidth={2.5} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#4ade80" }}>
                  Saved
                </span>
              </div>
            )}

            {/* Discard Draft */}
            <button
              onClick={() => navigate("/company/proposals")}
              className="transition-all"
              style={{
                padding: "9px 18px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: "#e2e8f0",
                backgroundColor: "transparent",
                border: "1.5px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <span className="flex items-center gap-2">
                <Trash2 size={14} />
                Discard Draft
              </span>
            </button>

            {/* Save Changes */}
            <button
              onClick={handleSave}
              className="transition-all"
              style={{
                padding: "9px 22px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: "#2d5a47",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#234739";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,90,71,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#2d5a47";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <span className="flex items-center gap-2">
                <Save size={14} />
                Save Changes
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ╔═══════════════════════════════════════════════╗
         ║    DOCUMENT BODY — 900px centered               ║
         ╚═══════════════════════════════════════════════╝ */}
      <div
        className="mx-auto"
        style={{ maxWidth: 900, padding: "48px 0 120px 0" }}
      >
        {/* ── Document Header ── */}
        <div style={{ marginBottom: 40 }}>
          <div
            className="flex items-center gap-2"
            style={{ marginBottom: 12 }}
          >
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                backgroundColor: "rgba(45, 90, 71, 0.2)",
              }}
            >
              <Sparkles size={14} color="#4ade80" strokeWidth={2} />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#4ade80",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              AI-Generated Proposal
            </span>
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#f8fafc",
              margin: 0,
              lineHeight: 1.25,
              marginBottom: 12,
            }}
          >
            Review your submission for {source.course}
          </h1>
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 680,
            }}
          >
            The AI has formatted your chat into the required fields. You can
            manually edit any embossed field below before publishing.
          </p>
        </div>

        {/* ── AI Context Banner ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "16px 20px",
            borderRadius: 12,
            backgroundColor: "rgba(251, 191, 36, 0.06)",
            border: "1px solid rgba(251, 191, 36, 0.12)",
            marginBottom: 32,
          }}
        >
          <AlertTriangle size={18} color="#fbbf24" className="shrink-0 mt-0.5" />
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#fbbf24",
                margin: 0,
                marginBottom: 4,
              }}
            >
              Fields marked with ✦ were AI-generated
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Review each field carefully. Click into any card to edit the content directly — your
              changes override the AI's suggestions.
            </p>
          </div>
        </div>

        {/* ── Embossed Editable Cards ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {fields.map((field) => (
            <EmbossedCard
              key={field.id}
              field={field}
              isFocused={focusedField === field.id}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => setFocusedField(null)}
              onChange={(val) => updateField(field.id, val)}
            />
          ))}
        </div>

        {/* ── Bottom Actions ── */}
        <div
          className="flex items-center justify-between"
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => navigate("/company/proposals")}
            className="transition-colors"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#64748b",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#64748b";
            }}
          >
            Delete this proposal
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="transition-all"
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: "#e2e8f0",
                backgroundColor: "transparent",
                border: "1.5px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Save as Draft
            </button>

            <button
              onClick={() => {
                handleSave();
                navigate("/company/proposals");
              }}
              className="transition-all"
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: "#2d5a47",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#234739";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,90,71,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#2d5a47";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Publish to Course Marketplace
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENT: EmbossedCard
   ═══════════════════════════════════════════════════════════ */
function EmbossedCard({
  field,
  isFocused,
  onFocus,
  onBlur,
  onChange,
}: {
  field: ProposalField;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [field.value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
      {/* Section Label */}
      <div
        className="flex items-center gap-2"
        style={{ marginBottom: 10 }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 6,
            backgroundColor: "rgba(255,255,255,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: "#64748b",
          }}
        >
          {field.sectionNumber}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#e2e8f0",
          }}
        >
          {field.label}
        </span>
        {field.aiGenerated && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#fbbf24",
              marginLeft: 4,
            }}
          >
            ✦ AI
          </span>
        )}
      </div>

      {/* Embossed Input Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 12,
          padding: field.type === "dropdown" ? 0 : 24,
          boxShadow: isFocused
            ? "inset 0 2px 4px rgba(0,0,0,0.06), 0 0 0 2px rgba(45,90,71,0.4)"
            : "inset 0 2px 4px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s ease",
          position: "relative" as const,
        }}
      >
        {field.type === "text" && (
          <input
            type="text"
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={field.placeholder}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 18,
              fontWeight: 500,
              color: "#1e293b",
              backgroundColor: "transparent",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.4,
            }}
          />
        )}

        {field.type === "textarea" && (
          <textarea
            ref={textareaRef}
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={4}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 15,
              fontWeight: 400,
              color: "#1e293b",
              backgroundColor: "transparent",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.7,
              resize: "none",
              minHeight: 120,
            }}
          />
        )}

        {field.type === "dropdown" && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                if (!dropdownOpen) onFocus();
              }}
              className="flex items-center justify-between w-full transition-colors"
              style={{
                padding: "18px 24px",
                fontSize: 16,
                fontWeight: 500,
                color: "#1e293b",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left" as const,
              }}
            >
              <div className="flex items-center gap-3">
                <Shield size={18} color="#2d5a47" strokeWidth={1.8} />
                <span>{field.value || field.placeholder}</span>
              </div>
              <ChevronDown
                size={18}
                color="#94a3b8"
                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#ffffff",
                  borderRadius: "0 0 12px 12px",
                  borderTop: "1px solid #f1f5f9",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                  zIndex: 20,
                  padding: 6,
                }}
              >
                {field.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setDropdownOpen(false);
                      onBlur();
                    }}
                    className="w-full text-left transition-colors hover:bg-gray-50"
                    style={{
                      padding: "10px 18px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: option === field.value ? 600 : 400,
                      color: option === field.value ? "#2d5a47" : "#475569",
                      backgroundColor: option === field.value ? "rgba(45,90,71,0.04)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {option === field.value && (
                      <Check size={14} color="#2d5a47" strokeWidth={2.5} />
                    )}
                    <span style={{ marginLeft: option === field.value ? 0 : 22 }}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint text */}
      {field.hint && (
        <p
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "#64748b",
            marginTop: 8,
            marginLeft: 2,
            lineHeight: 1.4,
          }}
        >
          {field.hint}
        </p>
      )}
    </div>
  );
}
