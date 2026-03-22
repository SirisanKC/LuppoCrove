import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
} from "@mui/material";
import { Sparkles, Send, X, Check, ChevronDown, Info } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  options?: string[];
  showOtherInput?: boolean;
  typing?: boolean;
}

interface AIProjectWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ProjectData) => void;
}

interface ProjectData {
  topic: string;
  description: string;
  title: string;
  benefit: string;
  ndaStatus: "required" | "not-required" | "conditional" | "pending";
  teamSize: string;
  duration: string;
}

interface DuplicationCourse {
  id: string;
  label: string;
  selected: boolean;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
let msgIdCounter = 0;
const genId = () => `msg-${++msgIdCounter}`;

const INITIAL_MESSAGE: Message = {
  id: genId(),
  type: "ai",
  content:
    "Hi! I'm here to assist you with submitting an idea to the LUT Capstone. To get started, what general topic does your project fall under?",
  options: ["Software MVP", "Data Analytics", "Service Design"],
  showOtherInput: true,
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT: AIProjectWizard
   ═══════════════════════════════════════════════════════════ */
export function AIProjectWizard({ open, onClose, onSubmit }: AIProjectWizardProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [currentInput, setCurrentInput] = useState("");
  const [otherInput, setOtherInput] = useState("");
  const [step, setStep] = useState(0);
  const [projectData, setProjectData] = useState<ProjectData>({
    topic: "",
    description: "",
    title: "",
    benefit: "",
    ndaStatus: "pending",
    teamSize: "",
    duration: "",
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showDuplicationDropdown, setShowDuplicationDropdown] = useState(false);
  const [dupCourses, setDupCourses] = useState<DuplicationCourse[]>([
    { id: "aalto-sw", label: "Aalto SW", selected: true },
    { id: "helsinki-ohtu", label: "Helsinki OHTU", selected: true },
    { id: "tampere-sw", label: "Tampere SW", selected: false },
    { id: "oulu-dsd", label: "Oulu DSD", selected: false },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDuplicationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      msgIdCounter = 0;
      setMessages([{ ...INITIAL_MESSAGE, id: genId() }]);
      setCurrentInput("");
      setOtherInput("");
      setStep(0);
      setProjectData({
        topic: "",
        description: "",
        title: "",
        benefit: "",
        ndaStatus: "pending",
        teamSize: "",
        duration: "",
      });
      setIsComplete(false);
      setShowDuplicationDropdown(false);
    }
  }, [open]);

  /* ── Add a typing-then-real message ── */
  const addAIMessage = useCallback(
    (msg: Omit<Message, "id" | "type">, delay = 600) => {
      const typingId = genId();
      // Show typing indicator
      setMessages((prev) => [
        ...prev,
        { id: typingId, type: "ai", content: "", typing: true },
      ]);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === typingId
              ? { ...m, ...msg, typing: false }
              : m
          )
        );
      }, delay);
    },
    []
  );

  /* ── Handle option pill click ── */
  const handleOptionClick = useCallback(
    (option: string) => {
      // Add user bubble
      setMessages((prev) => [
        ...prev,
        { id: genId(), type: "user", content: option },
      ]);

      if (step === 0) {
        setProjectData((prev) => ({ ...prev, topic: option }));
        addAIMessage({
          content:
            "Great choice. Could you give me a quick description of the project in a few sentences?",
        });
        setStep(1);
      } else if (step === 2) {
        setProjectData((prev) => ({ ...prev, teamSize: option }));
        addAIMessage({
          content: "Perfect. How long do you envision this project taking?",
          options: [
            "One semester (3-4 months)",
            "Two semesters (6-8 months)",
            "Flexible",
          ],
        });
        setStep(3);
      } else if (step === 3) {
        setProjectData((prev) => ({ ...prev, duration: option }));
        addAIMessage({
          content:
            "Almost there! Will students need to sign an NDA (Non-Disclosure Agreement)?",
          options: [
            "Yes, required",
            "No, not needed",
            "Maybe — depends on the team",
          ],
        });
        setStep(4);
      } else if (step === 4) {
        const ndaStatus: ProjectData["ndaStatus"] =
          option === "Yes, required"
            ? "required"
            : option === "No, not needed"
            ? "not-required"
            : "conditional";
        setProjectData((prev) => ({ ...prev, ndaStatus }));
        addAIMessage(
          {
            content:
              "All done! I've assembled your submission on the right panel. Review the live preview, then hit Publish when you're ready.",
          },
          800
        );
        setStep(5);
        setTimeout(() => setIsComplete(true), 1200);
      }
    },
    [step, addAIMessage]
  );

  /* ── Handle free-text send ── */
  const handleSendMessage = useCallback(() => {
    if (!currentInput.trim()) return;
    const text = currentInput.trim();
    setMessages((prev) => [
      ...prev,
      { id: genId(), type: "user", content: text },
    ]);
    setCurrentInput("");

    if (step === 1) {
      // Generate a title from the description
      const words = text.split(" ").slice(0, 4).join(" ");
      const suggestedTitle =
        words.charAt(0).toUpperCase() + words.slice(1) + "...";
      const benefit =
        text.toLowerCase().includes("mvp") || text.toLowerCase().includes("prototype")
          ? "MVP Prototype"
          : text.toLowerCase().includes("data") || text.toLowerCase().includes("analytics")
          ? "Data-Driven Insights"
          : text.toLowerCase().includes("design")
          ? "Service Blueprint"
          : "Student-Built Solution";

      setProjectData((prev) => ({
        ...prev,
        description: text,
        title: suggestedTitle,
        benefit,
      }));
      addAIMessage({
        content:
          "Thanks! I've generated a suggested title and identified your key benefit. What size team would work best?",
        options: [
          "Small (3-4 students)",
          "Medium (5-6 students)",
          "Large (7+ students)",
        ],
      });
      setStep(2);
    }
  }, [currentInput, step, addAIMessage]);

  const handleOtherSubmit = useCallback(() => {
    if (!otherInput.trim()) return;
    handleOptionClick(otherInput.trim());
    setOtherInput("");
  }, [otherInput, handleOptionClick]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePublish = () => {
    if (onSubmit) onSubmit(projectData);
    onClose();
  };

  const toggleDupCourse = (id: string) => {
    setDupCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const selectedDupCount = dupCourses.filter((c) => c.selected).length;

  /* ── NDA display ── */
  const getNdaDisplay = () => {
    switch (projectData.ndaStatus) {
      case "required":
        return { text: "Required", bg: "#fee2e2", color: "#991b1b" };
      case "not-required":
        return { text: "Not Required", bg: "#d1fae5", color: "#065f46" };
      case "conditional":
        return {
          text: "Iffy / Conditional — Awaiting Input",
          bg: "#fef3c7",
          color: "#92400e",
        };
      default:
        return {
          text: "Iffy / Conditional — Awaiting Input",
          bg: "#fef3c7",
          color: "#92400e",
        };
    }
  };

  const ndaDisplay = getNdaDisplay();

  /* ── Check if input area should show ── */
  const showFreeTextInput = step === 1;
  const lastMessage = messages[messages.length - 1];
  const showOptions =
    lastMessage?.options && !lastMessage.typing && lastMessage.type === "ai";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "1100px",
          height: "720px",
          maxWidth: "95vw",
          maxHeight: "92vh",
          borderRadius: "20px",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.40)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: "100%", overflow: "hidden" }}>
        <Box sx={{ display: "flex", height: "100%" }}>
          {/* ╔═══════════════════════════════════════════════╗
             ║   LEFT PANE — Conversational Chatbot           ║
             ╚═══════════════════════════════════════════════╝ */}
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: "24px 32px 20px 32px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "rgba(45, 90, 71, 0.08)",
                  }}
                >
                  <Sparkles size={16} color="#2d5a47" strokeWidth={2} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    Project Assistant
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#6b7280",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    LUT Capstone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                style={{ width: 32, height: 32 }}
              >
                <X size={18} color="#9ca3af" />
              </button>
            </div>

            {/* ── Chat History Area ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                padding: "20px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {messages.map((message) => (
                <div key={message.id}>
                  {/* Typing indicator */}
                  {message.typing ? (
                    <div className="flex justify-start">
                      <div
                        style={{
                          padding: "12px 20px",
                          borderRadius: 18,
                          backgroundColor: "#fafaf9",
                          display: "flex",
                          gap: 4,
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="inline-block rounded-full bg-gray-400"
                          style={{
                            width: 6,
                            height: 6,
                            animation: "pulse 1.2s infinite 0s",
                          }}
                        />
                        <span
                          className="inline-block rounded-full bg-gray-400"
                          style={{
                            width: 6,
                            height: 6,
                            animation: "pulse 1.2s infinite 0.2s",
                          }}
                        />
                        <span
                          className="inline-block rounded-full bg-gray-400"
                          style={{
                            width: 6,
                            height: 6,
                            animation: "pulse 1.2s infinite 0.4s",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Message Bubble */}
                      <div
                        className="flex"
                        style={{
                          justifyContent:
                            message.type === "ai" ? "flex-start" : "flex-end",
                          marginBottom: message.options ? 12 : 0,
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "85%",
                            padding: "12px 18px",
                            borderRadius:
                              message.type === "ai"
                                ? "18px 18px 18px 6px"
                                : "18px 18px 6px 18px",
                            backgroundColor:
                              message.type === "ai" ? "#fafaf9" : "#2d5a47",
                            color:
                              message.type === "ai" ? "#1f2937" : "#ffffff",
                            fontSize: 14,
                            lineHeight: 1.65,
                            fontWeight: 400,
                          }}
                        >
                          {message.content}
                        </div>
                      </div>

                      {/* ── Interactive Options (only on latest AI message with options) ── */}
                      {message.options &&
                        message.id === lastMessage?.id &&
                        !lastMessage.typing && (
                          <div
                            className="flex flex-wrap items-center"
                            style={{ gap: 8, marginLeft: 4, marginTop: 4 }}
                          >
                            {message.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="transition-all"
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: 999,
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: "#374151",
                                  backgroundColor: "transparent",
                                  border: "1.5px solid #d1d5db",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "#2d5a47";
                                  (e.currentTarget as HTMLElement).style.backgroundColor = "#f0fdf4";
                                  (e.currentTarget as HTMLElement).style.color = "#2d5a47";
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db";
                                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                  (e.currentTarget as HTMLElement).style.color = "#374151";
                                }}
                              >
                                {option}
                              </button>
                            ))}
                            {message.showOtherInput && (
                              <input
                                type="text"
                                placeholder="Other (please specify)..."
                                value={otherInput}
                                onChange={(e) => setOtherInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleOtherSubmit();
                                }}
                                style={{
                                  padding: "7px 16px",
                                  borderRadius: 999,
                                  fontSize: 13,
                                  fontWeight: 400,
                                  color: "#374151",
                                  backgroundColor: "#fafaf9",
                                  border: "1.5px solid #e5e7eb",
                                  outline: "none",
                                  width: 180,
                                  fontFamily: "Inter, sans-serif",
                                }}
                                onFocus={(e) => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "#2d5a47";
                                }}
                                onBlur={(e) => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                                }}
                              />
                            )}
                          </div>
                        )}
                    </>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* ── Input Area (pinned bottom) ── */}
            <div
              className="shrink-0"
              style={{
                padding: "16px 32px 24px 32px",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              {showFreeTextInput ? (
                <div
                  className="flex items-center"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: 999,
                    border: "1.5px solid #e5e7eb",
                    padding: "4px 4px 4px 20px",
                    gap: 8,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type your response..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: 14,
                      color: "#111827",
                      fontFamily: "Inter, sans-serif",
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim()}
                    className="flex items-center justify-center rounded-full transition-all shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      backgroundColor: currentInput.trim()
                        ? "#2d5a47"
                        : "#e5e7eb",
                      cursor: currentInput.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    <Send
                      size={15}
                      color={currentInput.trim() ? "#ffffff" : "#9ca3af"}
                    />
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: 999,
                    border: "1.5px solid #e5e7eb",
                    padding: "10px 20px",
                    opacity: 0.6,
                  }}
                >
                  <span style={{ fontSize: 14, color: "#9ca3af" }}>
                    {step >= 5
                      ? "Conversation complete — review your submission"
                      : "Select an option above to continue..."}
                  </span>
                </div>
              )}
            </div>
          </Box>

          {/* ╔═══════════════════════════════════════════════╗
             ║   RIGHT PANE — Live Template Preview           ║
             ╚═══════════════════════════════════════════════╝ */}
          <Box
            sx={{
              width: "50%",
              backgroundColor: "#f5f5f4",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ── Preview Header ── */}
            <div
              className="shrink-0 flex items-center justify-between"
              style={{ padding: "24px 40px 16px 40px" }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9ca3af",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Live Preview
              </p>
              {isComplete && (
                <div
                  className="flex items-center gap-1.5"
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    backgroundColor: "#d1fae5",
                  }}
                >
                  <Check size={12} color="#065f46" strokeWidth={2.5} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#065f46",
                    }}
                  >
                    Ready
                  </span>
                </div>
              )}
            </div>

            {/* ── Document Container ── */}
            <div
              className="flex-1 overflow-y-auto mx-10 mb-4"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 32,
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              {/* Document Title */}
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: 24 }}
              >
                <div
                  style={{
                    width: 4,
                    height: 20,
                    borderRadius: 2,
                    backgroundColor: "#2d5a47",
                  }}
                />
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Project Submission Form
                </p>
              </div>

              {/* Structured Fields */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {/* Suggested Title */}
                <TemplateField
                  label="Suggested Title:"
                  value={projectData.title || null}
                  pending
                />

                {/* Project Topic */}
                <TemplateField
                  label="Project Topic:"
                  value={projectData.topic || null}
                />

                {/* Description */}
                <TemplateField
                  label="Project Description:"
                  value={projectData.description || null}
                  multiline
                />

                {/* Company Benefit */}
                <TemplateField
                  label="Company Benefit:"
                  value={projectData.benefit || null}
                  valueColor="#2d5a47"
                />

                {/* Team Size */}
                <TemplateField
                  label="Preferred Team Size:"
                  value={projectData.teamSize || null}
                />

                {/* Duration */}
                <TemplateField
                  label="Project Duration:"
                  value={projectData.duration || null}
                />

                {/* NDA Status — always show the amber pill as default */}
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#374151",
                      margin: 0,
                      marginBottom: 6,
                    }}
                  >
                    NDA Status:
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: ndaDisplay.bg,
                      color: ndaDisplay.color,
                    }}
                  >
                    {ndaDisplay.text}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div
              className="shrink-0"
              style={{
                padding: "16px 40px 24px 40px",
                borderTop: "1px solid #e8e8e6",
              }}
            >
              {isComplete ? (
                /* ── SUCCESS & DUPLICATION STATE ── */
                <>
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 12 }}
                  >
                    {/* Left: Saved text */}
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#d1fae5",
                        }}
                      >
                        <Check size={12} color="#065f46" strokeWidth={2.5} />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#065f46",
                        }}
                      >
                        Saved to My Proposals
                      </span>
                    </div>

                    {/* Right: Publish button */}
                    <button
                      onClick={handlePublish}
                      className="transition-all"
                      style={{
                        padding: "8px 20px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
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
                      Publish Proposals
                    </button>
                  </div>

                  {/* Duplication Multi-Select */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setShowDuplicationDropdown(!showDuplicationDropdown)
                      }
                      className="flex items-center gap-2 w-full transition-all"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #e5e7eb",
                        cursor: "pointer",
                        color: "#374151",
                      }}
                    >
                      <span style={{ color: "#6b7280", fontSize: 12 }}>
                        Submit to other courses:
                      </span>
                      {/* Selected tags */}
                      <div
                        className="flex items-center gap-1.5 flex-1 flex-wrap"
                        style={{ minHeight: 22 }}
                      >
                        {dupCourses
                          .filter((c) => c.selected)
                          .map((c) => (
                            <span
                              key={c.id}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 8px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                backgroundColor: "rgba(45, 90, 71, 0.08)",
                                color: "#2d5a47",
                              }}
                            >
                              {c.label}
                            </span>
                          ))}
                      </div>
                      <ChevronDown
                        size={14}
                        color="#9ca3af"
                        className={`transition-transform ${
                          showDuplicationDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {showDuplicationDropdown && (
                      <div
                        className="absolute bottom-full left-0 w-full mb-2"
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: 12,
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                          padding: 6,
                          zIndex: 50,
                        }}
                      >
                        {dupCourses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => toggleDupCourse(course.id)}
                            className="flex items-center gap-2.5 w-full transition-colors hover:bg-gray-50"
                            style={{
                              padding: "8px 10px",
                              borderRadius: 8,
                              cursor: "pointer",
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                          >
                            <div
                              className="flex items-center justify-center shrink-0 rounded"
                              style={{
                                width: 18,
                                height: 18,
                                border: course.selected
                                  ? "none"
                                  : "1.5px solid #d1d5db",
                                backgroundColor: course.selected
                                  ? "#2d5a47"
                                  : "transparent",
                                borderRadius: 5,
                              }}
                            >
                              {course.selected && (
                                <Check
                                  size={12}
                                  color="#ffffff"
                                  strokeWidth={2.5}
                                />
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#374151",
                              }}
                            >
                              {course.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dev Note */}
                  <div
                    className="flex items-start gap-2 mt-3"
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <Info
                      size={13}
                      color="#92400e"
                      className="shrink-0 mt-0.5"
                    />
                    <p
                      style={{
                        fontSize: 10,
                        color: "#92400e",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>DEV NOTE:</span> This
                      allows companies to effortlessly submit the same extracted
                      info to multiple courses at once.
                    </p>
                  </div>
                </>
              ) : (
                /* ── DEFAULT FOOTER ── */
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="transition-colors"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#6b7280",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled
                    style={{
                      padding: "8px 20px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      backgroundColor: "#e5e7eb",
                      color: "#9ca3af",
                      border: "none",
                      cursor: "not-allowed",
                    }}
                  >
                    Submit to Coordinator
                  </button>
                </div>
              )}
            </div>
          </Box>
        </Box>
      </DialogContent>

      {/* ── Typing animation keyframes ── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENT: TemplateField
   ═══════════════════════════════════════════════════════════ */
function TemplateField({
  label,
  value,
  pending,
  multiline,
  valueColor,
}: {
  label: string;
  value: string | null;
  pending?: boolean;
  multiline?: boolean;
  valueColor?: string;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          margin: 0,
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: value ? 400 : 400,
          color: value ? (valueColor ?? "#111827") : "#9ca3af",
          margin: 0,
          lineHeight: multiline ? 1.65 : 1.4,
          fontStyle: value ? "normal" : "italic",
        }}
      >
        {value || "Pending..."}
      </p>
    </div>
  );
}
