import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Trees,
  Copy,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Calendar,
  FileUp,
  Check,
  ClipboardPaste,
  ListChecks,
  LayoutTemplate,
  Eye,
  ArrowRight,
  ArrowLeft,
  X,
  Info,
  Sparkles,
  Wand2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { extractCourseFromAI, polishCourseDescription } from "../services/ai";

/* ═══════════════════════════════════════════════════════════
   TYPES — Supabase-ready data structures
   ═══════════════════════════════════════════════════════════ */

interface CourseData {
  title: string;
  courseCode: string;
  semester: string;
  startDate: string;
  endDate: string;
  proposalDeadline: string;
  description: string;
  pastedFromUrl: boolean;
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  requiresUpload: boolean;
}

interface TemplateField {
  id: string;
  label: string;
  fieldType: "text-paragraph" | "short-text" | "number" | "dropdown" | "file-upload" | "date";
  required: boolean;
  characterLimit?: number;
  hasCharacterLimit: boolean;
  placeholder: string;
  dropdownOptions: string[];
  acceptedFileTypes: string[];
  maxFileSizeMB: number;
}

interface PastCourse {
  id: string;
  title: string;
  code: string;
  semester: string;
  milestoneCount: number;
  fieldCount: number;
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const STEPS = [
  { id: 1, label: "Getting Started", icon: Sparkles, description: "Import or start fresh" },
  { id: 2, label: "Course Details", icon: Calendar, description: "Name, dates & deadline" },
  { id: 3, label: "Description", icon: ClipboardPaste, description: "Describe your course" },
  { id: 4, label: "Proposal Template", icon: LayoutTemplate, description: "What companies provide" },
  { id: 5, label: "Milestones", icon: ListChecks, description: "Key dates & deliverables" },
  { id: 6, label: "Review & Publish", icon: Eye, description: "Final check" },
];

const PAST_COURSES: PastCourse[] = [
  { id: "past-1", title: "Capstone Project", code: "CT60A9800", semester: "Spring 2026", milestoneCount: 4, fieldCount: 6 },
  { id: "past-2", title: "Capstone Project", code: "CT60A9800", semester: "Fall 2025", milestoneCount: 5, fieldCount: 5 },
  { id: "past-3", title: "Software Engineering", code: "CT50A6000", semester: "Spring 2025", milestoneCount: 3, fieldCount: 4 },
];

const SEMESTERS = ["Fall 2026", "Spring 2027", "Fall 2027", "Spring 2028"];

const FIELD_TYPE_OPTIONS: { value: TemplateField["fieldType"]; label: string; description: string }[] = [
  { value: "text-paragraph", label: "Long Text", description: "Multi-line text area" },
  { value: "short-text", label: "Short Text", description: "Single line input" },
  { value: "number", label: "Number", description: "Numeric value" },
  { value: "dropdown", label: "Dropdown", description: "Select from options" },
  { value: "file-upload", label: "File Upload", description: "Document/image upload" },
  { value: "date", label: "Date", description: "Date picker" },
];

const DEFAULT_TEMPLATE_FIELDS: TemplateField[] = [
  {
    id: "default-1",
    label: "Project Title",
    fieldType: "short-text",
    required: true,
    hasCharacterLimit: true,
    characterLimit: 120,
    placeholder: "e.g., Predictive Maintenance System",
    dropdownOptions: [],
    acceptedFileTypes: [],
    maxFileSizeMB: 10,
  },
  {
    id: "default-2",
    label: "Project Description & Goals",
    fieldType: "text-paragraph",
    required: true,
    hasCharacterLimit: true,
    characterLimit: 2000,
    placeholder: "Describe what the project aims to achieve...",
    dropdownOptions: [],
    acceptedFileTypes: [],
    maxFileSizeMB: 10,
  },
  {
    id: "default-3",
    label: "NDA Requirements",
    fieldType: "dropdown",
    required: true,
    hasCharacterLimit: false,
    placeholder: "",
    dropdownOptions: ["No NDA Required", "Standard University NDA", "Custom Company NDA"],
    acceptedFileTypes: [],
    maxFileSizeMB: 10,
  },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function mapAIFieldTypeToTemplateFieldType(
  type: string
): TemplateField["fieldType"] {
  switch (type) {
    case "long-text":
      return "text-paragraph";
    case "short-text":
      return "short-text";
    case "number":
      return "number";
    case "dropdown":
      return "dropdown";
    case "file-upload":
      return "file-upload";
    case "date":
      return "date";
    default:
      return "short-text";
  }
}

function normalizeTemplateFieldsFromAI(data: unknown): TemplateField[] {
  if (!Array.isArray(data)) return [];

  return data.map((field, index) => {
    const item = field as Record<string, unknown>;

    return {
      id: typeof item.id === "string" ? item.id : `ai-field-${index + 1}`,
      label: typeof item.label === "string" ? item.label : "",
      fieldType: mapAIFieldTypeToTemplateFieldType(
        typeof item.fieldType === "string" ? item.fieldType : "short-text"
      ),
      required: Boolean(item.required),
      hasCharacterLimit: Boolean(item.hasCharacterLimit),
      characterLimit:
        typeof item.characterLimit === "number"
          ? item.characterLimit
          : typeof item.characterLimit === "string" && item.characterLimit.trim() !== ""
          ? Number(item.characterLimit)
          : undefined,
      placeholder: typeof item.placeholder === "string" ? item.placeholder : "",
      dropdownOptions: Array.isArray(item.dropdownOptions)
        ? item.dropdownOptions.map(String).filter(Boolean)
        : [],
      acceptedFileTypes: Array.isArray(item.acceptedFileTypes)
        ? item.acceptedFileTypes.map(String).filter(Boolean)
        : [],
      maxFileSizeMB:
        typeof item.maxFileSizeMB === "number"
          ? item.maxFileSizeMB
          : typeof item.maxFileSizeMB === "string" && item.maxFileSizeMB.trim() !== ""
          ? Number(item.maxFileSizeMB)
          : 10,
    };
  });
}

function normalizeMilestonesFromAI(data: unknown): Milestone[] {
  if (!Array.isArray(data)) return [];

  return data.map((milestone, index) => {
    const item = milestone as Record<string, unknown>;

    return {
      id: typeof item.id === "string" ? item.id : `ai-m-${index + 1}`,
      name: typeof item.name === "string" ? item.name : "",
      date: typeof item.date === "string" ? item.date : "",
      requiresUpload: Boolean(item.requiresUpload),
    };
  });
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT: TeacherCourseBuilder
   ═══════════════════════════════════════════════════════════ */

export function TeacherCourseBuilder() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [showDuplicateMenu, setShowDuplicateMenu] = useState(false);
  const [duplicatedFrom, setDuplicatedFrom] = useState<string | null>(null);

  const [course, setCourse] = useState<CourseData>({
    title: "",
    courseCode: "",
    semester: "",
    startDate: "",
    endDate: "",
    proposalDeadline: "",
    description: "",
    pastedFromUrl: false,
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "m-1", name: "", date: "", requiresUpload: false },
  ]);

  const [templateFields, setTemplateFields] = useState<TemplateField[]>(DEFAULT_TEMPLATE_FIELDS);

  const [editingDropdownId, setEditingDropdownId] = useState<string | null>(null);
  const [newOptionText, setNewOptionText] = useState("");

  const [smartPasteText, setSmartPasteText] = useState("");
  const [isSmartParsing, setIsSmartParsing] = useState(false);
  const [smartPasteUsed, setSmartPasteUsed] = useState(false);

  const [isPolishing, setIsPolishing] = useState(false);
  const [prePolishDescription, setPrePolishDescription] = useState<string | null>(null);
  const [polishApplied, setPolishApplied] = useState(false);

  const updateCourse = (field: keyof CourseData, value: string | boolean) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return course.title.trim() !== "" && course.proposalDeadline !== "";
      case 3:
        return true;
      case 4:
        return templateFields.length > 0;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (currentStep < 6 && canProceedFromStep(currentStep)) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep + 1 && canProceedFromStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  const handleDuplicate = (pastCourse: PastCourse) => {
    setCourse({
      title: pastCourse.title,
      courseCode: pastCourse.code,
      semester: "",
      startDate: "",
      endDate: "",
      proposalDeadline: "",
      description: `Duplicated from ${pastCourse.semester} ${pastCourse.title}. Update the description for the new semester.`,
      pastedFromUrl: false,
    });
    setMilestones([
      { id: "dup-1", name: "Team Formation & Registration", date: "", requiresUpload: false },
      { id: "dup-2", name: "Project Plan Submission", date: "", requiresUpload: true },
      { id: "dup-3", name: "Mid-term Review Presentation", date: "", requiresUpload: true },
      { id: "dup-4", name: "Final Demo & Report", date: "", requiresUpload: true },
    ]);
    setDuplicatedFrom(`${pastCourse.semester} ${pastCourse.title}`);
    setShowDuplicateMenu(false);
    setCurrentStep(2);
  };

  const addMilestone = () => {
    setMilestones((prev) => [...prev, { id: `m-${Date.now()}`, name: "", date: "", requiresUpload: false }]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string | boolean) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const addTemplateField = () => {
    setTemplateFields((prev) => [
      ...prev,
      {
        id: `f-${Date.now()}`,
        label: "",
        fieldType: "short-text",
        required: false,
        hasCharacterLimit: false,
        placeholder: "",
        dropdownOptions: [],
        acceptedFileTypes: [],
        maxFileSizeMB: 10,
      },
    ]);
  };

  const updateTemplateField = (id: string, updates: Partial<TemplateField>) => {
    setTemplateFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeTemplateField = (id: string) => {
    setTemplateFields((prev) => prev.filter((f) => f.id !== id));
  };

  const addDropdownOption = (fieldId: string) => {
    if (!newOptionText.trim()) return;

    setTemplateFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, dropdownOptions: [...f.dropdownOptions, newOptionText.trim()] }
          : f
      )
    );

    setNewOptionText("");
  };

  const removeDropdownOption = (fieldId: string, idx: number) => {
    setTemplateFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, dropdownOptions: f.dropdownOptions.filter((_, i) => i !== idx) }
          : f
      )
    );
  };

  const handleSmartPaste = async () => {
    if (!smartPasteText.trim()) return;

    setIsSmartParsing(true);

    try {
      const data = await extractCourseFromAI(smartPasteText);

      setCourse((prev) => ({
        ...prev,
        title: data.title || "",
        courseCode: data.courseCode || "",
        semester: data.semester || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        proposalDeadline: data.proposalDeadline || "",
        description: data.description || "",
        pastedFromUrl: true,
      }));

      const normalizedFields = normalizeTemplateFieldsFromAI(data.templateFields);
      if (normalizedFields.length > 0) {
        setTemplateFields(normalizedFields);
      }

      const normalizedMilestones = normalizeMilestonesFromAI(data.milestones);
      if (normalizedMilestones.length > 0) {
        setMilestones(normalizedMilestones);
      }

      setSmartPasteUsed(true);
      setDuplicatedFrom(null);
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "AI extraction failed. Please try again.";
      alert(message);
    } finally {
      setIsSmartParsing(false);
    }
  };

  const handlePolishDescription = async () => {
    if (!course.description.trim()) return;

    setIsPolishing(true);
    setPrePolishDescription(course.description);

    try {
      const data = await polishCourseDescription(course.description);

      setCourse((prev) => ({
        ...prev,
        description: data.polishedDescription || prev.description,
      }));

      setPolishApplied(true);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "AI polish failed. Please try again.";
      alert(message);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleUndoPolish = () => {
    if (prePolishDescription !== null) {
      setCourse((prev) => ({ ...prev, description: prePolishDescription }));
      setPrePolishDescription(null);
      setPolishApplied(false);
    }
  };

  const handlePublish = () => {
    const payload = {
      course,
      milestones: milestones.filter((m) => m.name.trim()),
      templateFields,
    };
    console.log("Publishing course payload (Supabase-ready):", JSON.stringify(payload, null, 2));
    alert("Course published successfully!");
    navigate("/teacher");
  };

  const fieldTypeLabel = (t: TemplateField["fieldType"]) =>
    FIELD_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fafaf9", fontFamily: "Inter, sans-serif" }}>
      <aside
        className="fixed left-0 top-0 h-screen flex flex-col bg-white z-20"
        style={{ width: 280, borderRight: "1px solid #e8e8e6" }}
      >
        <div className="flex items-center gap-2.5 px-6 pt-6 pb-4">
          <Trees className="w-6 h-6 text-[#2d5a47]" strokeWidth={1.5} />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#2d5a47", letterSpacing: "-0.02em" }}>
            LuppoGrove
          </span>
        </div>

        <button
          onClick={() => navigate("/teacher")}
          className="flex items-center gap-2 px-6 py-2 text-gray-500 hover:text-[#2d5a47] transition-colors"
          style={{ fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={14} />
          Back to My Courses
        </button>

        <div className="px-6 pt-6 pb-3">
          <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
            Adding New Course
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isAccessible = step.id <= currentStep || (step.id === currentStep + 1 && canProceedFromStep(currentStep));

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && goToStep(step.id)}
                disabled={!isAccessible}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                style={{
                  cursor: isAccessible ? "pointer" : "default",
                  backgroundColor: isActive ? "#2d5a47" : "transparent",
                  opacity: isAccessible ? 1 : 0.4,
                  border: "none",
                }}
              >
                <div
                  className="shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: isActive ? "rgba(255,255,255,0.15)" : isCompleted ? "rgba(45,90,71,0.08)" : "#f3f4f6",
                  }}
                >
                  {isCompleted ? (
                    <Check size={14} color="#2d5a47" strokeWidth={2.5} />
                  ) : (
                    <Icon size={14} color={isActive ? "#ffffff" : "#6b7280"} strokeWidth={1.5} />
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#ffffff" : isCompleted ? "#2d5a47" : "#374151", margin: 0 }}>
                    {step.label}
                  </p>
                  <p style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.65)" : "#9ca3af", margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div
              className="shrink-0 rounded-full bg-[#2d5a47]/8 text-[#2d5a47] flex items-center justify-center"
              style={{ width: 32, height: 32, fontSize: 11, fontWeight: 600 }}
            >
              JH
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Prof. Hämäläinen</p>
              <p style={{ fontSize: 12, fontWeight: 400, color: "#6b7280", margin: 0 }}>LUT University</p>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ marginLeft: 280, flex: 1, minHeight: "100vh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px 120px" }}>
          {currentStep === 1 && (
            <div>
              <StepHeader
                number={1}
                title="Let's set up your new course"
                subtitle="Choose how to get started. You can paste from your university webpage to auto-fill fields, start manually, or duplicate a previous course."
              />

              <div className="space-y-4 mt-8">
                <div
                  style={{
                    borderRadius: 16,
                    backgroundColor: "#ffffff",
                    border: "2px solid #c4b5fd",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ padding: 24 }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="shrink-0 flex items-center justify-center rounded-xl"
                        style={{ width: 48, height: 48, backgroundColor: "rgba(139,92,246,0.08)" }}
                      >
                        <Sparkles size={22} color="#8b5cf6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 4 }}>
                          Import from your university webpage
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                          Paste your syllabus or course page from Sisu, Peppi, or Moodle. AI will extract the title, dates, milestones, and description — you just review and adjust.
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={smartPasteText}
                      onChange={(e) => setSmartPasteText(e.target.value)}
                      placeholder={"Paste your course info here...\n\nExample:\nCourse: Software Engineering Project\nCode: CT60A9800\nPeriod: 01/09/2026 - 18/12/2026\nDeadline: Project Plan due 22/09/2026\nDeadline: Mid-term Review 28/10/2026\nDeadline: Final Demo 16/12/2026\n\nStudents work in teams of 4-5 on real industry projects..."}
                      style={{
                        ...inputStyle,
                        minHeight: 160,
                        resize: "vertical",
                        lineHeight: 1.6,
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                        fontSize: 13,
                        borderColor: "#c4b5fd",
                      }}
                      className="w-full"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                        {smartPasteText.length > 0 ? `${smartPasteText.length} characters pasted` : "Supports plain text, formatted course pages, or raw syllabi"}
                      </p>
                      <button
                        onClick={handleSmartPaste}
                        disabled={!smartPasteText.trim() || isSmartParsing}
                        className="flex items-center gap-2"
                        style={{
                          padding: "9px 20px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          color: !smartPasteText.trim() || isSmartParsing ? "#9ca3af" : "#ffffff",
                          backgroundColor: !smartPasteText.trim() || isSmartParsing ? "#e5e7eb" : "#8b5cf6",
                          border: "none",
                          cursor: !smartPasteText.trim() || isSmartParsing ? "default" : "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSmartParsing ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Wand2 size={14} />
                            Extract & Auto-fill
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-1">
                  <div className="flex-1 border-t border-gray-200" />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>or start manually</span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full text-left group"
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    backgroundColor: "#ffffff",
                    border: "2px solid rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#2d5a47";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,90,71,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="shrink-0 flex items-center justify-center rounded-xl"
                      style={{ width: 48, height: 48, backgroundColor: "rgba(45,90,71,0.06)" }}
                    >
                      <Plus size={22} color="#2d5a47" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 4 }}>
                        Start from scratch
                      </p>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                        Fill in every field manually. Best when you're creating a completely new course format.
                      </p>
                    </div>
                    <ArrowRight size={18} color="#9ca3af" className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowDuplicateMenu(!showDuplicateMenu)}
                    className="w-full text-left group"
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      backgroundColor: "#ffffff",
                      border: "2px dashed rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#2d5a47";
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#fafff8";
                    }}
                    onMouseLeave={(e) => {
                      if (!showDuplicateMenu) {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.1)";
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="shrink-0 flex items-center justify-center rounded-xl"
                        style={{ width: 48, height: 48, backgroundColor: "#f3f4f6" }}
                      >
                        <Copy size={20} color="#6b7280" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 4 }}>
                          Duplicate from a past course
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                          Re-use milestones, proposal templates, and settings from a previous semester. Courses can be repeated — just pick the one to clone.
                        </p>
                      </div>
                      <ChevronDown
                        size={18}
                        color="#9ca3af"
                        className="transition-transform"
                        style={{ transform: showDuplicateMenu ? "rotate(180deg)" : "none" }}
                      />
                    </div>
                  </button>

                  {showDuplicateMenu && (
                    <div
                      className="mt-2 overflow-hidden"
                      style={{ borderRadius: 14, border: "1px solid #e5e7eb", backgroundColor: "#ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    >
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>
                          Select a course to duplicate
                        </p>
                      </div>
                      {PAST_COURSES.map((pc) => (
                        <button
                          key={pc.id}
                          onClick={() => handleDuplicate(pc)}
                          className="w-full text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          style={{ padding: "14px 16px", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", backgroundColor: "transparent" }}
                        >
                          <div className="flex-1">
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                              {pc.semester}: {pc.title}
                            </p>
                            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, marginTop: 2 }}>
                              {pc.code} • {pc.milestoneCount} milestones • {pc.fieldCount} template fields
                            </p>
                          </div>
                          <ChevronRight size={14} color="#9ca3af" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <StepHeader
                number={2}
                title="Course details"
                subtitle="Basic information about your course. The proposal deadline is when companies must submit their project proposals."
              />

              {smartPasteUsed && (
                <div
                  className="flex items-center gap-2 mt-4"
                  style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.15)" }}
                >
                  <Sparkles size={14} color="#8b5cf6" />
                  <span style={{ fontSize: 13, color: "#6d28d9", fontWeight: 500 }}>
                    AI extracted these fields from your pasted text — review and adjust as needed
                  </span>
                </div>
              )}

              {duplicatedFrom && (
                <div
                  className="flex items-center gap-2 mt-4"
                  style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(45,90,71,0.05)", border: "1px solid rgba(45,90,71,0.1)" }}
                >
                  <Copy size={14} color="#2d5a47" />
                  <span style={{ fontSize: 13, color: "#2d5a47", fontWeight: 500 }}>
                    Duplicated from {duplicatedFrom} — update the details for the new semester
                  </span>
                </div>
              )}

              <div className="space-y-6 mt-8">
                <FieldGroup label="Course Title" required hint="This is what companies and students will see.">
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => updateCourse("title", e.target.value)}
                    placeholder="e.g., Software Engineering Capstone Project"
                    className="w-full"
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Course Code" hint="Your university's official code (e.g., CT60A9800).">
                  <input
                    type="text"
                    value={course.courseCode}
                    onChange={(e) => updateCourse("courseCode", e.target.value)}
                    placeholder="e.g., CT60A9800"
                    className="w-full"
                    style={inputStyle}
                  />
                </FieldGroup>

                <FieldGroup label="Semester">
                  <div className="flex flex-wrap gap-2">
                    {SEMESTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateCourse("semester", s)}
                        style={{
                          padding: "8px 18px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: course.semester === s ? 600 : 400,
                          backgroundColor: course.semester === s ? "#2d5a47" : "#ffffff",
                          color: course.semester === s ? "#ffffff" : "#374151",
                          border: course.semester === s ? "none" : "1px solid #d1d5db",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Start Date">
                    <input
                      type="date"
                      value={course.startDate}
                      onChange={(e) => updateCourse("startDate", e.target.value)}
                      className="w-full"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="End Date">
                    <input
                      type="date"
                      value={course.endDate}
                      onChange={(e) => updateCourse("endDate", e.target.value)}
                      className="w-full"
                      style={inputStyle}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup
                  label="Proposal Submission Deadline"
                  required
                  hint="Companies must submit their project proposals before this date. This is separate from course milestones."
                >
                  <input
                    type="date"
                    value={course.proposalDeadline}
                    onChange={(e) => updateCourse("proposalDeadline", e.target.value)}
                    className="w-full"
                    style={inputStyle}
                  />
                </FieldGroup>
              </div>

              <StepNavigation
                onBack={goBack}
                onNext={goNext}
                canProceed={canProceedFromStep(2)}
                nextLabel="Continue to Description"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <StepHeader
                number={3}
                title="Describe your course"
                subtitle="Write a description or paste directly from your university's webpage (Sisu, Peppi, Moodle, etc.). Companies will see this when browsing available courses."
              />

              <div
                className="flex items-start gap-3 mt-6"
                style={{ padding: "14px 18px", borderRadius: 12, backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
              >
                <ClipboardPaste size={16} color="#3b82f6" className="shrink-0 mt-0.5" />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e40af", margin: 0, marginBottom: 2 }}>
                    Write freely, polish with AI later
                  </p>
                  <p style={{ fontSize: 12, color: "#3b82f6", margin: 0, lineHeight: 1.5 }}>
                    Paste from your university webpage or write a rough draft — then use AI to clean up the language and structure before companies see it.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <textarea
                  value={course.description}
                  onChange={(e) => {
                    updateCourse("description", e.target.value);
                    if (polishApplied) setPolishApplied(false);
                  }}
                  placeholder={"Paste your course description here...\n\nFor example:\n• Course overview and learning objectives\n• What kinds of projects are suitable\n• Team size expectations\n• Any prerequisites for companies\n• Grading criteria or deliverable expectations\n\nWrite freely — there's no character limit. You can polish it with AI afterwards."}
                  style={{
                    ...inputStyle,
                    minHeight: 260,
                    resize: "vertical",
                    lineHeight: 1.7,
                    fontFamily: "Inter, sans-serif",
                  }}
                  className="w-full"
                />

                <div className="flex items-center justify-between mt-3">
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                    {course.description.length > 0 ? `${course.description.length} characters` : "No limit — write as much as needed"}
                  </p>

                  <div className="flex items-center gap-2">
                    {polishApplied && prePolishDescription !== null && (
                      <button
                        onClick={handleUndoPolish}
                        className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#6b7280",
                          backgroundColor: "transparent",
                          border: "1px solid #e5e7eb",
                          cursor: "pointer",
                        }}
                      >
                        <RotateCcw size={12} />
                        Undo polish
                      </button>
                    )}

                    <button
                      onClick={handlePolishDescription}
                      disabled={!course.description.trim() || isPolishing}
                      className="flex items-center gap-1.5"
                      style={{
                        padding: "7px 16px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        color: !course.description.trim() || isPolishing ? "#9ca3af" : "#8b5cf6",
                        backgroundColor: !course.description.trim() || isPolishing ? "#f3f4f6" : "rgba(139,92,246,0.06)",
                        border: !course.description.trim() || isPolishing ? "1px solid #e5e7eb" : "1px solid rgba(139,92,246,0.2)",
                        cursor: !course.description.trim() || isPolishing ? "default" : "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isPolishing ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Polishing...
                        </>
                      ) : (
                        <>
                          <Wand2 size={12} />
                          AI Polish
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {polishApplied && (
                  <div
                    className="flex items-center gap-2 mt-3"
                    style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}
                  >
                    <Sparkles size={13} color="#8b5cf6" />
                    <span style={{ fontSize: 12, color: "#6d28d9", fontWeight: 500 }}>
                      AI polished your description. You can edit it further or undo to restore the original.
                    </span>
                  </div>
                )}
              </div>

              <StepNavigation
                onBack={goBack}
                onNext={goNext}
                canProceed={true}
                nextLabel="Continue to Proposal Template"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <StepHeader
                number={4}
                title="What should companies provide?"
                subtitle="Define the fields companies will fill out when submitting a project proposal. Each field can have its own type, character limit, and requirements. Different courses can have completely different templates."
              />

              <div
                className="flex items-start gap-3 mt-6"
                style={{ padding: "14px 18px", borderRadius: 12, backgroundColor: "rgba(45,90,71,0.04)", border: "1px solid rgba(45,90,71,0.1)" }}
              >
                <Info size={16} color="#2d5a47" className="shrink-0 mt-0.5" />
                <p style={{ fontSize: 12, color: "#2d5a47", margin: 0, lineHeight: 1.5 }}>
                  You have full flexibility here. Add text fields with character limits, file upload areas for visual documents, dropdowns for structured choices, or date fields. Companies will see exactly this form when submitting proposals.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                {templateFields.map((field) => (
                  <div
                    key={field.id}
                    style={{
                      padding: 20,
                      borderRadius: 14,
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1 cursor-move">
                        <GripVertical size={16} className="text-gray-300" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-[1fr_180px] gap-3">
                          <div>
                            <label style={labelStyle}>Field Label</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateTemplateField(field.id, { label: e.target.value })}
                              placeholder="e.g., Project Description"
                              className="w-full"
                              style={inputStyleSmall}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Type</label>
                            <select
                              value={field.fieldType}
                              onChange={(e) => updateTemplateField(field.id, { fieldType: e.target.value as TemplateField["fieldType"] })}
                              className="w-full"
                              style={{ ...inputStyleSmall, cursor: "pointer" }}
                            >
                              {FIELD_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {(field.fieldType === "text-paragraph" || field.fieldType === "short-text") && (
                          <div>
                            <label style={labelStyle}>Placeholder text (optional)</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateTemplateField(field.id, { placeholder: e.target.value })}
                              placeholder="Hint text shown inside the field..."
                              className="w-full"
                              style={inputStyleSmall}
                            />
                          </div>
                        )}

                        {(field.fieldType === "text-paragraph" || field.fieldType === "short-text") && (
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 13 }}>
                              <input
                                type="checkbox"
                                checked={field.hasCharacterLimit}
                                onChange={(e) => updateTemplateField(field.id, { hasCharacterLimit: e.target.checked })}
                                style={{ accentColor: "#2d5a47" }}
                              />
                              <span style={{ color: "#374151", fontWeight: 500 }}>Character limit</span>
                            </label>
                            {field.hasCharacterLimit && (
                              <input
                                type="number"
                                value={field.characterLimit ?? ""}
                                onChange={(e) =>
                                  updateTemplateField(field.id, {
                                    characterLimit: parseInt(e.target.value, 10) || undefined,
                                  })
                                }
                                placeholder="e.g., 500"
                                style={{ ...inputStyleSmall, width: 100 }}
                              />
                            )}
                          </div>
                        )}

                        {field.fieldType === "dropdown" && (
                          <div>
                            <label style={labelStyle}>Dropdown Options</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {field.dropdownOptions.map((opt, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1.5"
                                  style={{ padding: "4px 10px", borderRadius: 8, backgroundColor: "#f3f4f6", fontSize: 12, fontWeight: 500, color: "#374151" }}
                                >
                                  {opt}
                                  <button
                                    onClick={() => removeDropdownOption(field.id, i)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                                  >
                                    <X size={12} color="#9ca3af" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingDropdownId === field.id ? newOptionText : ""}
                                onChange={(e) => {
                                  setEditingDropdownId(field.id);
                                  setNewOptionText(e.target.value);
                                }}
                                onFocus={() => setEditingDropdownId(field.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addDropdownOption(field.id);
                                  }
                                }}
                                placeholder="Add option..."
                                style={{ ...inputStyleSmall, flex: 1 }}
                              />
                              <button
                                onClick={() => addDropdownOption(field.id)}
                                style={{ ...inputStyleSmall, width: "auto", padding: "6px 14px", cursor: "pointer", backgroundColor: "#f3f4f6", fontWeight: 500 }}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        )}

                        {field.fieldType === "file-upload" && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label style={labelStyle}>Accepted types</label>
                              <input
                                type="text"
                                value={field.acceptedFileTypes.join(", ")}
                                onChange={(e) =>
                                  updateTemplateField(field.id, {
                                    acceptedFileTypes: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  })
                                }
                                placeholder="e.g., pdf, docx, pptx"
                                className="w-full"
                                style={inputStyleSmall}
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>Max file size (MB)</label>
                              <input
                                type="number"
                                value={field.maxFileSizeMB}
                                onChange={(e) =>
                                  updateTemplateField(field.id, {
                                    maxFileSizeMB: parseInt(e.target.value, 10) || 10,
                                  })
                                }
                                className="w-full"
                                style={inputStyleSmall}
                              />
                            </div>
                          </div>
                        )}

                        <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 13 }}>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateTemplateField(field.id, { required: e.target.checked })}
                            style={{ accentColor: "#2d5a47" }}
                          />
                          <span style={{ color: "#374151", fontWeight: 500 }}>Required field</span>
                        </label>
                      </div>

                      <button
                        onClick={() => removeTemplateField(field.id)}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                      >
                        <Trash2 size={15} color="#d1d5db" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addTemplateField}
                className="w-full flex items-center justify-center gap-2 mt-4 transition-all hover:border-[#2d5a47] hover:bg-[#fafff8]"
                style={{
                  padding: "14px 0",
                  borderRadius: 14,
                  border: "2px dashed #d1d5db",
                  backgroundColor: "transparent",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#6b7280",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                Add Field
              </button>

              <StepNavigation
                onBack={goBack}
                onNext={goNext}
                canProceed={canProceedFromStep(4)}
                nextLabel="Continue to Milestones"
              />
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <StepHeader
                number={5}
                title="Define milestones & deliverables"
                subtitle="These are the key dates during the course where companies must submit deliverables. Each milestone can optionally require a file upload. They'll appear as diamond markers on the company's Gantt chart."
              />

              <div className="space-y-3 mt-8">
                {milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="flex items-center gap-3"
                    style={{ padding: "14px 16px", borderRadius: 12, backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
                  >
                    <GripVertical size={16} className="text-gray-300 shrink-0 cursor-move" />

                    <div className="flex-1 grid grid-cols-[1fr_160px] gap-3">
                      <input
                        type="text"
                        value={ms.name}
                        onChange={(e) => updateMilestone(ms.id, "name", e.target.value)}
                        placeholder="e.g., Mid-term Review Presentation"
                        className="w-full"
                        style={inputStyleSmall}
                      />
                      <input
                        type="date"
                        value={ms.date}
                        onChange={(e) => updateMilestone(ms.id, "date", e.target.value)}
                        className="w-full"
                        style={inputStyleSmall}
                      />
                    </div>

                    <label className="flex items-center gap-1.5 shrink-0 cursor-pointer" style={{ fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={ms.requiresUpload}
                        onChange={(e) => updateMilestone(ms.id, "requiresUpload", e.target.checked)}
                        style={{ accentColor: "#2d5a47" }}
                      />
                      <FileUp size={13} color="#6b7280" />
                      <span style={{ color: "#6b7280", fontWeight: 500 }}>Upload</span>
                    </label>

                    <button
                      onClick={() => removeMilestone(ms.id)}
                      className="shrink-0 p-1 rounded-lg hover:bg-red-50 transition-colors"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Trash2 size={14} color="#d1d5db" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addMilestone}
                className="w-full flex items-center justify-center gap-2 mt-4 transition-all hover:border-[#2d5a47] hover:bg-[#fafff8]"
                style={{
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "2px dashed #d1d5db",
                  backgroundColor: "transparent",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#6b7280",
                  cursor: "pointer",
                }}
              >
                <Plus size={15} />
                Add Milestone
              </button>

              <StepNavigation
                onBack={goBack}
                onNext={goNext}
                canProceed={true}
                nextLabel="Review & Publish"
              />
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <StepHeader
                number={6}
                title="Review & publish"
                subtitle="Here's a summary of your course. You can go back to any step to make changes before publishing."
              />

              <div className="space-y-6 mt-8">
                <ReviewSection title="Course Details" stepLink={() => goToStep(2)}>
                  <ReviewRow label="Title" value={course.title || "—"} />
                  <ReviewRow label="Code" value={course.courseCode || "—"} />
                  <ReviewRow label="Semester" value={course.semester || "—"} />
                  <ReviewRow label="Dates" value={course.startDate && course.endDate ? `${course.startDate} → ${course.endDate}` : "—"} />
                  <ReviewRow label="Proposal Deadline" value={course.proposalDeadline || "—"} highlight />
                </ReviewSection>

                <ReviewSection title="Description" stepLink={() => goToStep(3)}>
                  {course.description ? (
                    <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {course.description.length > 300
                        ? `${course.description.slice(0, 300)}...`
                        : course.description}
                    </p>
                  ) : (
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, fontStyle: "italic" }}>No description provided</p>
                  )}
                </ReviewSection>

                <ReviewSection title={`Proposal Template (${templateFields.length} fields)`} stepLink={() => goToStep(4)}>
                  <div className="space-y-2">
                    {templateFields.map((f, i) => (
                      <div key={f.id} className="flex items-center gap-3" style={{ padding: "8px 0", borderBottom: i < templateFields.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", flex: 1 }}>
                          {f.label || <span style={{ color: "#d1d5db" }}>Untitled field</span>}
                          {f.required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", padding: "2px 8px", borderRadius: 6, backgroundColor: "#f3f4f6" }}>
                          {fieldTypeLabel(f.fieldType)}
                        </span>
                        {f.hasCharacterLimit && f.characterLimit && (
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>max {f.characterLimit} chars</span>
                        )}
                      </div>
                    ))}
                  </div>
                </ReviewSection>

                <ReviewSection title={`Milestones (${milestones.filter((m) => m.name.trim()).length})`} stepLink={() => goToStep(5)}>
                  {milestones.filter((m) => m.name.trim()).length === 0 ? (
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, fontStyle: "italic" }}>No milestones defined</p>
                  ) : (
                    <div className="space-y-2">
                      {milestones.filter((m) => m.name.trim()).map((ms) => (
                        <div key={ms.id} className="flex items-center gap-3" style={{ padding: "6px 0" }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#2d5a47", transform: "rotate(45deg)", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#111827", flex: 1 }}>{ms.name}</span>
                          {ms.date && <span style={{ fontSize: 12, color: "#6b7280" }}>{ms.date}</span>}
                          {ms.requiresUpload && (
                            <span className="flex items-center gap-1" style={{ fontSize: 11, color: "#2d5a47" }}>
                              <FileUp size={11} />
                              Upload
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ReviewSection>
              </div>

              <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: "1px solid #e5e7eb" }}>
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 transition-colors hover:text-[#2d5a47]"
                  style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
                >
                  <ArrowLeft size={16} />
                  Back to Milestones
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      console.log("Saved as draft");
                      alert("Saved as draft!");
                    }}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#374151",
                      backgroundColor: "transparent",
                      border: "1.5px solid #d1d5db",
                      cursor: "pointer",
                    }}
                  >
                    Save as Draft
                  </button>

                  <button
                    onClick={handlePublish}
                    disabled={!course.title.trim()}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ffffff",
                      backgroundColor: course.title.trim() ? "#2d5a47" : "#d1d5db",
                      border: "none",
                      cursor: course.title.trim() ? "pointer" : "default",
                      boxShadow: course.title.trim() ? "0 2px 8px rgba(45,90,71,0.2)" : "none",
                    }}
                  >
                    Publish Course
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StepHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div>
      <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
        <span
          className="flex items-center justify-center rounded-lg"
          style={{ width: 24, height: 24, backgroundColor: "rgba(45,90,71,0.08)", fontSize: 12, fontWeight: 700, color: "#2d5a47" }}
        >
          {number}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#2d5a47", letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Step {number} of 6
        </span>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 8, lineHeight: 1.3 }}>
        {title}
      </h1>
      <p style={{ fontSize: 15, color: "#6b7280", margin: 0, lineHeight: 1.6, maxWidth: 600 }}>
        {subtitle}
      </p>
    </div>
  );
}

function FieldGroup({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
      </label>
      {hint && (
        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, marginBottom: 8, lineHeight: 1.4 }}>{hint}</p>
      )}
      {children}
    </div>
  );
}

function StepNavigation({
  onBack,
  onNext,
  canProceed,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  nextLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: "1px solid #e5e7eb" }}>
      <button
        onClick={onBack}
        className="flex items-center gap-2 transition-colors hover:text-[#2d5a47]"
        style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="flex items-center gap-2"
        style={{
          padding: "10px 24px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          color: canProceed ? "#ffffff" : "#9ca3af",
          backgroundColor: canProceed ? "#2d5a47" : "#e5e7eb",
          border: "none",
          cursor: canProceed ? "pointer" : "default",
          transition: "all 0.15s ease",
        }}
      >
        {nextLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function ReviewSection({ title, stepLink, children }: { title: string; stepLink: () => void; children: React.ReactNode }) {
  return (
    <div style={{ padding: 20, borderRadius: 14, backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>{title}</h3>
        <button
          onClick={stepLink}
          className="transition-colors hover:text-[#2d5a47]"
          style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3" style={{ padding: "6px 0" }}>
      <span style={{ fontSize: 13, color: "#6b7280", width: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: highlight ? 600 : 500, color: highlight ? "#2d5a47" : "#111827" }}>
        {value}
      </span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1.5px solid #e5e7eb",
  fontSize: 14,
  color: "#111827",
  backgroundColor: "#ffffff",
  outline: "none",
  transition: "border-color 0.15s ease",
  fontFamily: "Inter, sans-serif",
};

const inputStyleSmall: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  fontSize: 13,
  color: "#111827",
  backgroundColor: "#ffffff",
  outline: "none",
  fontFamily: "Inter, sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: 4,
};