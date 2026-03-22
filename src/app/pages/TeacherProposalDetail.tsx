import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Trees,
  ArrowLeft,
  Mail,
  Linkedin,
  Phone,
  Check,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { TeacherNav } from "../components/TeacherNav";

/* ═══════════════════════════════════════════════════════════
   DATA — Same proposals visible in CourseGallery (teacher view)
   ═══════════════════════════════════════════════════════════ */

interface ContactPerson {
  name: string;
  initials: string;
  role: "Owner" | "Co-owner" | "Developer";
  email: string;
  linkedin: string;
  phone?: string;
}

interface ProposalDetail {
  id: string;
  title: string;
  company: string;
  category: string;
  duration: string;
  ndaRequired: boolean;
  heroGradient: string;
  heroImage: string;
  about: string;
  offerings: string[];
  team: ContactPerson[];
}

const ROLE_PILL: Record<string, { bg: string; text: string }> = {
  Owner: { bg: "rgba(45,90,71,0.08)", text: "#2d5a47" },
  "Co-owner": { bg: "rgba(99,102,241,0.08)", text: "#6366f1" },
  Developer: { bg: "rgba(245,158,11,0.06)", text: "#d97706" },
};

const PROPOSALS: Record<string, ProposalDetail> = {
  "proj-1": {
    id: "proj-1",
    title: "Predictive Maintenance Algorithm",
    company: "Konecranes Ltd.",
    category: "Software Engineering",
    duration: "12 Weeks",
    ndaRequired: true,
    heroGradient: "linear-gradient(135deg, #2d5a47 0%, #4a7c5d 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1762889597634-264f0907820b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY3JhbmUlMjBtYWNoaW5lcnklMjBlbmdpbmVlcmluZ3xlbnwxfHx8fDE3NzIzOTQ4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Konecranes Ltd., a global leader in lifting equipment and industrial service technology, is seeking a student team to develop a predictive maintenance algorithm for their fleet of industrial cranes. The company collects over 3TB of telemetry data from sensors embedded in crane components\u2014including motor vibrations, load cycles, temperature readings, and operational hours. Currently, maintenance is scheduled based on fixed intervals, leading to either premature servicing (wasted resources) or unexpected breakdowns (costly downtime). The goal is to build a machine learning pipeline that predicts component failure 2\u20134 weeks in advance, enabling condition-based maintenance scheduling.",
    offerings: [
      "Access to 3TB of anonymized crane telemetry data (vibration, load, temperature sensors)",
      "Weekly 90-minute mentorship meetings with Konecranes' Lead Data Scientist",
      "Cloud computing credits (Azure ML) for model training and deployment",
      "Potential for summer internship placement upon project completion",
      "Letter of recommendation from CTO for outstanding contributions",
    ],
    team: [
      {
        name: "Alex Chen",
        initials: "AC",
        role: "Owner",
        email: "alex.chen@konecranes.com",
        linkedin: "linkedin.com/in/alexchen",
        phone: "+358 40 123 4567",
      },
      {
        name: "Maria Santos",
        initials: "MS",
        role: "Co-owner",
        email: "maria.santos@konecranes.com",
        linkedin: "linkedin.com/in/mariasantos",
      },
    ],
  },
  "proj-2": {
    id: "proj-2",
    title: "Customer Behavior Analytics Dashboard",
    company: "Nordea Bank",
    category: "Data Analytics",
    duration: "10 Weeks",
    ndaRequired: false,
    heroGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwc2NyZWVufGVufDF8fHx8MTc3MjM3NjI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Nordea Bank is looking for a data analytics team to create a comprehensive customer behavior analytics dashboard. The project involves analyzing transaction patterns, user engagement metrics, and cross-channel journey data to identify opportunities for personalized financial products.",
    offerings: [
      "Anonymized customer transaction dataset (500K+ records)",
      "Bi-weekly sprint reviews with VP of Data Analytics",
      "AWS cloud infrastructure for development and testing",
      "Access to Nordea's internal analytics toolchain (Tableau, Snowflake)",
    ],
    team: [
      {
        name: "Elina Virtanen",
        initials: "EV",
        role: "Owner",
        email: "elina.virtanen@nordea.com",
        linkedin: "linkedin.com/in/elinavirtanen",
        phone: "+358 50 987 6543",
      },
      {
        name: "Mikko Lehto",
        initials: "ML",
        role: "Co-owner",
        email: "mikko.lehto@nordea.com",
        linkedin: "linkedin.com/in/mikkolehto",
      },
    ],
  },
  "proj-3": {
    id: "proj-3",
    title: "AI-Powered Content Moderation",
    company: "Supercell",
    category: "AI",
    duration: "14 Weeks",
    ndaRequired: true,
    heroGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1761223956849-c6912f2179aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBhYnN0cmFjdCUyMG5ldXJhbHxlbnwxfHx8fDE3NzIzOTQ4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Supercell, the creators of Clash of Clans and Brawl Stars, needs an AI-driven content moderation system for their in-game chat and community forums. The system should automatically detect and flag toxic messages, spam, and inappropriate content while maintaining low false-positive rates.",
    offerings: [
      "Sample dataset of 1M+ labeled chat messages",
      "Weekly meetings with Supercell's AI/ML team",
      "GPU computing resources for model training",
      "Game industry networking opportunities",
    ],
    team: [
      {
        name: "Tommi Korhonen",
        initials: "TK",
        role: "Owner",
        email: "tommi.k@supercell.com",
        linkedin: "linkedin.com/in/tommikorhonen",
      },
      {
        name: "Sanna M\u00e4kel\u00e4",
        initials: "SM",
        role: "Developer",
        email: "sanna.m@supercell.com",
        linkedin: "linkedin.com/in/sannamakela",
      },
    ],
  },
  "proj-4": {
    id: "proj-4",
    title: "Supply Chain Optimization Tool",
    company: "W\u00e4rtsil\u00e4",
    category: "Software Engineering",
    duration: "12 Weeks",
    ndaRequired: false,
    heroGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwbHklMjBjaGFpbiUyMGxvZ2lzdGljcyUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NzIzNjEyNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "W\u00e4rtsil\u00e4 is seeking a software engineering team to build an optimization tool for their global marine supply chain. The tool should model inventory, lead times, and logistics constraints to minimize costs and delivery times for spare parts across 200+ service locations.",
    offerings: [
      "Real supply chain data (anonymized) from 200+ global locations",
      "Access to W\u00e4rtsil\u00e4's logistics APIs and ERP sandbox",
      "Mentoring from VP of Supply Chain Operations",
      "Potential patent co-authorship for novel algorithms",
    ],
    team: [
      {
        name: "Henrik Nylund",
        initials: "HN",
        role: "Owner",
        email: "henrik.nylund@wartsila.com",
        linkedin: "linkedin.com/in/henriknylund",
        phone: "+358 40 555 1234",
      },
    ],
  },
  "proj-5": {
    id: "proj-5",
    title: "Real-Time Sentiment Analysis",
    company: "YLE",
    category: "AI",
    duration: "8 Weeks",
    ndaRequired: false,
    heroGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1760895653496-b28ed02f3705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9hZGNhc3QlMjBtZWRpYSUyMHN0dWRpbyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyMzk0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "YLE, Finland's national public broadcasting company, wants a real-time sentiment analysis tool to gauge audience reactions across news articles, social media mentions, and live broadcast feedback. The tool should visualize sentiment trends and alert editors to emerging stories.",
    offerings: [
      "Access to YLE's article archive and social media API feeds",
      "Weekly meetings with YLE's digital innovation team",
      "Press credentials for research purposes",
      "Public credit in any deployed feature",
    ],
    team: [
      {
        name: "Kaisa Rinne",
        initials: "KR",
        role: "Owner",
        email: "kaisa.rinne@yle.fi",
        linkedin: "linkedin.com/in/kaisarinne",
      },
    ],
  },
  "proj-6": {
    id: "proj-6",
    title: "IoT Device Management Platform",
    company: "Nokia",
    category: "Software Engineering",
    duration: "16 Weeks",
    ndaRequired: true,
    heroGradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1746017187853-936e4c4e4895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBzbWFydCUyMGRldmljZSUyMGNpcmN1aXQlMjBib2FyZHxlbnwxfHx8fDE3NzIzOTQ4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Nokia is looking for a team to build a scalable IoT device management platform that can provision, monitor, and update firmware on thousands of connected devices. The platform should include a real-time dashboard, alerting system, and OTA update pipeline.",
    offerings: [
      "IoT device test lab with 50+ devices",
      "Nokia's internal IoT SDK and documentation",
      "Weekly technical reviews with Nokia's IoT architecture team",
      "Cloud credits for AWS IoT Core",
    ],
    team: [
      {
        name: "Jari Salminen",
        initials: "JS",
        role: "Owner",
        email: "jari.salminen@nokia.com",
        linkedin: "linkedin.com/in/jarisalminen",
        phone: "+358 50 123 7890",
      },
      {
        name: "Laura Heikkinen",
        initials: "LH",
        role: "Co-owner",
        email: "laura.h@nokia.com",
        linkedin: "linkedin.com/in/lauraheikkinen",
      },
    ],
  },
};

const DEFAULT_PROPOSAL: ProposalDetail = PROPOSALS["proj-1"];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function TeacherProposalDetail() {
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const proposal = PROPOSALS[proposalId ?? ""] ?? DEFAULT_PROPOSAL;

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#fafaf9", fontFamily: "Inter, sans-serif" }}
    >
      <TeacherNav />

      {/* ── MAIN CONTENT ── */}

      <main style={{ marginLeft: 260, flex: 1, minHeight: "100vh" }}>
        <div style={{ padding: "40px 48px 120px 48px", maxWidth: 1400, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6" style={{ fontSize: 13, color: "#6b7280" }}>
            <button
              onClick={() => navigate("/teacher")}
              className="flex items-center gap-1.5 hover:text-[#2d5a47] transition-colors"
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "inherit" }}
            >
              <ArrowLeft size={14} />
              Available Proposals
            </button>
            <span>/</span>
            <span>{proposal.category}</span>
            <span>/</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>{proposal.company}</span>
          </div>

          {/* Title Row */}
          <div className="flex items-start justify-between gap-6 mb-3">
            <h1 style={{ fontSize: 36, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.2 }}>
              {proposal.title}
            </h1>

            {/* Save / Star button */}
            <button
              onClick={handleSave}
              className="shrink-0 flex items-center gap-2 transition-all"
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: isSaved ? "rgba(45,90,71,0.06)" : "#ffffff",
                color: isSaved ? "#2d5a47" : "#374151",
                border: isSaved ? "1.5px solid rgba(45,90,71,0.2)" : "1.5px solid #d1d5db",
                cursor: "pointer",
              }}
            >
              <Star
                size={16}
                strokeWidth={2}
                fill={isSaved ? "#2d5a47" : "none"}
                color={isSaved ? "#2d5a47" : "#6b7280"}
              />
              {isSaved ? "Saved to Shortlist" : "Save to Shortlist"}
            </button>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-1.5" style={{ fontSize: 14, color: "#6b7280" }}>
              <Clock size={14} strokeWidth={1.5} />
              {proposal.duration}
            </span>
            <span style={{ fontSize: 14, color: "#d1d5db" }}>&bull;</span>
            <span className="flex items-center gap-1.5" style={{ fontSize: 14, color: "#6b7280" }}>
              <Users size={14} strokeWidth={1.5} />
              {proposal.category}
            </span>
            <span style={{ fontSize: 14, color: "#d1d5db" }}>&bull;</span>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: proposal.ndaRequired ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                color: proposal.ndaRequired ? "#dc2626" : "#059669",
              }}
            >
              {proposal.ndaRequired ? "NDA Required" : "No NDA"}
            </span>
          </div>

          {/* Hero Image */}
          <div
            className="relative overflow-hidden mb-10"
            style={{ height: 300, borderRadius: 20, background: proposal.heroGradient }}
          >
            <ImageWithFallback
              src={proposal.heroImage}
              alt={proposal.title}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div
              className="absolute bottom-6 left-8 bg-white/95 backdrop-blur-sm"
              style={{ padding: "8px 16px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                {proposal.company}
              </span>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
            {/* LEFT — Project Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {/* About */}
              <section>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 16 }}>
                  About this Project
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#374151", margin: 0 }}>
                  {proposal.about}
                </p>
              </section>

              {/* Offerings */}
              <section>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 16 }}>
                  What the company offers
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {proposal.offerings.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                      style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}
                    >
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full mt-0.5"
                        style={{ width: 22, height: 22, backgroundColor: "rgba(45,90,71,0.08)" }}
                      >
                        <Check size={12} color="#2d5a47" strokeWidth={2.5} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* RIGHT — Sticky Contact Card + Teacher Actions */}
            <div>
              <div
                className="sticky"
                style={{
                  top: 40,
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {/* Teacher Actions */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, marginBottom: 12 }}>
                    Teacher Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleSave}
                      className="w-full flex items-center justify-center gap-2 transition-all"
                      style={{
                        height: 44,
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        backgroundColor: isSaved ? "rgba(45,90,71,0.06)" : "#2d5a47",
                        color: isSaved ? "#2d5a47" : "#ffffff",
                        border: isSaved ? "1.5px solid rgba(45,90,71,0.2)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <Star
                        size={15}
                        fill={isSaved ? "#2d5a47" : "none"}
                        color={isSaved ? "#2d5a47" : "#ffffff"}
                      />
                      {isSaved ? "Saved to Shortlist" : "Save to Shortlist"}
                    </button>
                    <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "4px 0 0 0" }}>
                      Saved proposals appear in your shortlist on the main page
                    </p>
                  </div>
                </div>

                <div style={{ height: 1, backgroundColor: "#f0f0ed", margin: "0 0 24px 0" }} />

                {/* Team Contacts */}
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 24 }}>
                  Company Contacts
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {proposal.team.map((person) => {
                    const pill = ROLE_PILL[person.role] ?? ROLE_PILL["Developer"];
                    return (
                      <div key={person.name}>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="shrink-0 rounded-full flex items-center justify-center"
                            style={{
                              width: 40,
                              height: 40,
                              fontSize: 13,
                              fontWeight: 600,
                              backgroundColor: "rgba(45,90,71,0.08)",
                              color: "#2d5a47",
                            }}
                          >
                            {person.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                              {person.name}
                            </p>
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: 2,
                                padding: "2px 8px",
                                borderRadius: 6,
                                fontSize: 10,
                                fontWeight: 600,
                                backgroundColor: pill.bg,
                                color: pill.text,
                              }}
                            >
                              {person.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-[52px]">
                          <a
                            href={`mailto:${person.email}`}
                            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                            style={{ width: 32, height: 32 }}
                            title={person.email}
                          >
                            <Mail size={14} color="#6b7280" strokeWidth={1.5} />
                          </a>
                          <a
                            href={`https://${person.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                            style={{ width: 32, height: 32 }}
                            title="LinkedIn"
                          >
                            <Linkedin size={14} color="#6b7280" strokeWidth={1.5} />
                          </a>
                          {person.phone && (
                            <a
                              href={`tel:${person.phone}`}
                              className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                              style={{ width: 32, height: 32 }}
                              title={person.phone}
                            >
                              <Phone size={14} color="#6b7280" strokeWidth={1.5} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Saved toast */}
      {showSavedToast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50"
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            backgroundColor: "#2d5a47",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          <Star size={14} fill="#ffffff" />
          Proposal saved to your shortlist
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}