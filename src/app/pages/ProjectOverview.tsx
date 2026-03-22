import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Trees,
  BookOpen,
  FileText,
  FolderOpen,
  Plus,
  ArrowLeft,
  Mail,
  Linkedin,
  Phone,
  ExternalLink,
  Check,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import { CompanyNav } from "../components/CompanyNav";
import { AIProjectWizard } from "../components/AIProjectWizard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */
interface ContactPerson {
  name: string;
  initials: string;
  role: "Owner" | "Co-owner" | "Developer";
  email: string;
  linkedin: string;
  phone?: string;
}

interface ProjectData {
  id: string;
  title: string;
  company: string;
  category: string;
  duration: string;
  heroGradient: string;
  heroImage: string;
  about: string;
  offerings: string[];
  team: ContactPerson[];
}

const PROJECTS: Record<string, ProjectData> = {
  "proj-1": {
    id: "proj-1",
    title: "Predictive Maintenance Algorithm",
    company: "Konecranes Ltd.",
    category: "Software Engineering",
    duration: "12 Weeks",
    heroGradient: "linear-gradient(135deg, #2d5a47 0%, #4a7c5d 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1762889597634-264f0907820b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwY3JhbmUlMjBtYWNoaW5lcnklMjBlbmdpbmVlcmluZ3xlbnwxfHx8fDE3NzIzOTQ4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Konecranes Ltd., a global leader in lifting equipment and industrial service technology, is seeking a student team to develop a predictive maintenance algorithm for their fleet of industrial cranes. The company collects over 3TB of telemetry data from sensors embedded in crane components—including motor vibrations, load cycles, temperature readings, and operational hours. Currently, maintenance is scheduled based on fixed intervals, leading to either premature servicing (wasted resources) or unexpected breakdowns (costly downtime). The goal is to build a machine learning pipeline that predicts component failure 2-4 weeks in advance, enabling condition-based maintenance scheduling.",
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
      {
        name: "David Lee",
        initials: "DL",
        role: "Developer",
        email: "david.lee@konecranes.com",
        linkedin: "linkedin.com/in/davidlee",
      },
    ],
  },
  "proj-2": {
    id: "proj-2",
    title: "Customer Behavior Analytics Dashboard",
    company: "Nordea Bank",
    category: "Data Analytics",
    duration: "10 Weeks",
    heroGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwc2NyZWVufGVufDF8fHx8MTc3MjM3NjI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Nordea Bank is looking for a data analytics team to create a comprehensive customer behavior analytics dashboard. The project involves analyzing transaction patterns, user engagement metrics, and cross-channel journey data to identify opportunities for personalized financial products. The dashboard should provide real-time insights into customer segments and predictive models for churn prevention.",
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
    heroGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1761223956849-c6912f2179aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjBhYnN0cmFjdCUyMG5ldXJhbHxlbnwxfHx8fDE3NzIzOTQ4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about:
      "Supercell, the creators of Clash of Clans and Brawl Stars, needs an AI-driven content moderation system for their in-game chat and community forums. The system should automatically detect and flag toxic messages, spam, and inappropriate content while maintaining low false-positive rates to preserve the gaming experience.",
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
        name: "Sanna Mäkelä",
        initials: "SM",
        role: "Developer",
        email: "sanna.m@supercell.com",
        linkedin: "linkedin.com/in/sannamakela",
      },
    ],
  },
};

// Fallback for unknown project IDs
const DEFAULT_PROJECT: ProjectData = {
  id: "default",
  title: "Project Overview",
  company: "Company",
  category: "Engineering",
  duration: "12 Weeks",
  heroGradient: "linear-gradient(135deg, #2d5a47 0%, #4a7c5d 100%)",
  heroImage:
    "https://images.unsplash.com/photo-1772050138768-2107c6e62a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBkaWdpdGFsJTIwbmV0d29yayUyMGdyZWVufGVufDF8fHx8MTc3MjM5NDgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  about: "Detailed project information will be available soon.",
  offerings: ["Mentorship meetings", "Cloud infrastructure", "Industry networking"],
  team: [
    {
      name: "Contact Person",
      initials: "CP",
      role: "Owner",
      email: "contact@company.com",
      linkedin: "linkedin.com/in/contact",
    },
  ],
};

const ROLE_PILL: Record<string, { bg: string; text: string }> = {
  Owner: { bg: "rgba(45, 90, 71, 0.12)", text: "#2d5a47" },
  "Co-owner": { bg: "rgba(45, 90, 71, 0.08)", text: "#3d7a5f" },
  Developer: { bg: "rgba(59, 130, 246, 0.08)", text: "#2563eb" },
};

const NAV_ITEMS = [
  { id: "browse", label: "Browse Courses", icon: BookOpen, path: "/company" },
  { id: "proposals", label: "My Proposals", icon: FileText, path: "/company/proposals" },
  { id: "projects", label: "Active Projects", icon: FolderOpen, path: "/company/projects", notif: true },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function ProjectOverview() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [wizardOpen, setWizardOpen] = useState(false);

  const project = PROJECTS[projectId ?? ""] ?? DEFAULT_PROJECT;

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#fafaf9", fontFamily: "Inter, sans-serif" }}
    >
      <CompanyNav />

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: "100vh" }}>
        <div style={{ padding: "40px 48px 120px 48px", maxWidth: 1400, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6" style={{ fontSize: 13, color: "#6b7280" }}>
            <button
              onClick={() => navigate("/company")}
              className="flex items-center gap-1.5 hover:text-[#2d5a47] transition-colors"
            >
              <ArrowLeft size={14} />
              Projects
            </button>
            <span>/</span>
            <span>{project.category}</span>
            <span>/</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>{project.company}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 8 }}>
            {project.title}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-1.5" style={{ fontSize: 14, color: "#6b7280" }}>
              <Clock size={14} strokeWidth={1.5} />
              {project.duration}
            </span>
            <span style={{ fontSize: 14, color: "#d1d5db" }}>&bull;</span>
            <span className="flex items-center gap-1.5" style={{ fontSize: 14, color: "#6b7280" }}>
              <Users size={14} strokeWidth={1.5} />
              {project.category}
            </span>
          </div>

          {/* Hero Image */}
          <div
            className="relative overflow-hidden mb-10"
            style={{ height: 300, borderRadius: 20, background: project.heroGradient }}
          >
            <ImageWithFallback
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div
              className="absolute bottom-6 left-8 bg-white/95 backdrop-blur-sm"
              style={{ padding: "8px 16px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                {project.company}
              </span>
            </div>
          </div>

          {/* 2-Column Split Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
            {/* LEFT COLUMN — Project Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {/* About this Project */}
              <section>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 16 }}>
                  About this Project
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#374151", margin: 0 }}>
                  {project.about}
                </p>
              </section>

              {/* What the company offers */}
              <section>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 16 }}>
                  What the company offers
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {project.offerings.map((item, i) => (
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

            {/* RIGHT COLUMN — Sticky Team Hierarchy & Contact Card */}
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
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 24 }}>
                  Team Hierarchy & Contacts
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {project.team.map((person) => {
                    const pill = ROLE_PILL[person.role];
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

                        {/* Contact icons */}
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

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: "#f0f0ed", margin: "24px 0" }} />

                {/* CTA: Submit Idea */}
                <button
                  onClick={() => setWizardOpen(true)}
                  className="w-full flex items-center justify-center gap-2 transition-all"
                  style={{
                    height: 48,
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    backgroundColor: "#2d5a47",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#234739";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,90,71,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#2d5a47";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  Submit Idea to this Course
                </button>
                <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "8px 0 0 0" }}>
                  Opens the AI Project Wizard
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Project Wizard Modal */}
      <AIProjectWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={(data) => {
          console.log("Project submitted:", data);
          navigate("/company/proposals");
        }}
      />
    </div>
  );
}
