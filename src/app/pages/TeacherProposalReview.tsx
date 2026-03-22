import { useState } from "react";
import { Trees, Check, MessageSquare, Sparkles, X, Mail, Linkedin, ExternalLink } from "lucide-react";
import { TeacherNav } from "../components/TeacherNav";
import { useNavigate } from "react-router";

export function TeacherProposalReview() {
  const navigate = useNavigate();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);

  const checklistItems = [
    { id: 1, text: "1. Introduction" },
    { id: 2, text: "2. Project Goals" },
    { id: 3, text: "3. Technologies" },
    { id: 4, text: "4. Student Requirements" },
    { id: 5, text: "5. Legal Issues", sublabel: "Status: LUT NDA Required" },
    { id: 6, text: "6. Client Info" },
  ];

  const handleApprove = () => {
    setShowApproveSuccess(true);
    setTimeout(() => {
      navigate("/teacher/courses/CT60A9800/proposals");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf9]">
      <TeacherNav />

      <div className="flex-1 flex flex-col" style={{ marginLeft: 260 }}>
        {/* Top Header Navigation */}
        <header className="bg-white border-b border-[#eaeaea] h-20 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trees className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <span className="text-lg font-medium text-foreground">LuppoGrove</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button
                onClick={() => navigate("/teacher")}
                className="hover:text-foreground cursor-pointer"
              >
                Courses
              </button>
              <span>/</span>
              <button
                onClick={() => navigate("/teacher/courses/CT60A9800/proposals")}
                className="hover:text-foreground cursor-pointer"
              >
                CT60A9800 Capstone Project
              </button>
              <span>/</span>
              <span className="text-foreground font-medium">Proposal Review</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Prof. Maria Paasivaara</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Course Coordinator
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
              MP
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-1 p-10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-[65%_35%] gap-8">
            {/* LEFT COLUMN - Proposal Document */}
            <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-12">
              <h1 className="text-[32px] font-bold text-foreground mb-8 leading-tight">
                Code Ananas: AI-Powered Food Waste Reduction App
              </h1>

              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    1. Introduction (Business view & end users)
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Code Ananas Oy is developing an intelligent mobile application designed to combat household food waste through predictive expiration tracking and personalized recipe recommendations. The platform targets environmentally-conscious consumers aged 25-45 who seek practical tools to reduce their carbon footprint while saving money on groceries. Our solution integrates computer vision for receipt scanning, machine learning for consumption pattern analysis, and a community-driven recipe database to transform how families manage their kitchen inventory.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    2. Project Goals (MVP scope)
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The student team will deliver a functional MVP consisting of three core modules: (1) a mobile-responsive web application with user authentication and profile management, (2) an inventory tracking system with manual entry and camera-based receipt OCR, and (3) an expiration notification engine that sends timely alerts via push notifications. The deliverable must include comprehensive unit tests achieving 80% code coverage, responsive design supporting iOS Safari and Android Chrome, and full deployment to Azure App Service with CI/CD pipelines established through GitHub Actions.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    3. Technologies
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Frontend:</strong> React 18 with TypeScript, Tailwind CSS for styling, and Progressive Web App (PWA) capabilities for mobile installation.
                    <br /><br />
                    <strong>Backend:</strong> Node.js 20 with Express.js framework, PostgreSQL 15 for relational data storage, and Azure Blob Storage for image assets.
                    <br /><br />
                    <strong>Cloud Infrastructure:</strong> Azure App Service for hosting, Azure Computer Vision API for OCR processing, and Azure DevOps for project management and sprint tracking.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    4. Requirements for Students
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Team Size:</strong> 4-5 students with diverse skill sets.
                    <br /><br />
                    <strong>Technical Prerequisites:</strong> Proficiency in JavaScript/TypeScript, experience with React or similar component frameworks, understanding of RESTful API design, and familiarity with Git version control. Previous exposure to cloud platforms (preferably Azure) is beneficial but not mandatory.
                    <br /><br />
                    <strong>Commitment:</strong> Weekly 2-hour sprint meetings with the product owner, 12-week project timeline with milestone deliverables every 3 weeks, and final presentation to Code Ananas executive team.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    5. Legal Issues (IPR & NDA specifics)
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Intellectual Property Rights:</strong> All code developed during the project will be jointly owned by LUT University and Code Ananas Oy, with Code Ananas holding commercial exploitation rights and LUT retaining academic publication rights. Students will be credited as contributors in any commercial deployment.
                    <br /><br />
                    <strong>Non-Disclosure Agreement:</strong> Students and supervising faculty must sign the LUT Standard NDA (Template #LUT-2024-TECH) before accessing proprietary business documentation, including market research data and competitive analysis materials. The NDA remains in effect for 2 years post-project completion.
                    <br /><br />
                    <strong>Data Privacy:</strong> The project will handle simulated user data only; no real customer information will be accessible to the student team during development.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    6. Client (Company details & Product Owner)
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>Company:</strong> Code Ananas Oy, a sustainability-focused software startup based in Lappeenranta, Finland. Founded in 2023, the company specializes in consumer applications addressing environmental challenges through behavioral technology.
                    <br /><br />
                    <strong>Product Owner:</strong> Antti Virtanen, CTO & Co-Founder (antti.virtanen@codeananas.fi, +358 40 123 4567). Antti holds an M.Sc. in Computer Science from Aalto University and has 8 years of experience in mobile application development, including previous roles at Wolt and Supercell.
                    <br /><br />
                    <strong>Availability:</strong> Bi-weekly sprint reviews (Tuesdays 14:00-16:00 EET), asynchronous Slack communication for daily questions, and on-site visit to student team workspace during Week 6 milestone demo.
                  </p>
                </section>
              </div>
            </div>

            {/* RIGHT COLUMN - Checklist & Actions */}
            <div className="space-y-6">
              {/* AI Compliance Checklist */}
              <div className="bg-white rounded-xl border border-[#eaeaea] p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      CT60A9800 Template Compliance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The AI assistant successfully mapped the company's idea to your course requirements.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2d5a47] flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{item.text}</p>
                        {item.sublabel && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            {item.sublabel}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordinator Actions */}
              <div className="bg-white rounded-xl border border-[#eaeaea] p-6 sticky top-28">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Coordinator Actions
                </h3>
                <div className="space-y-3">
                  {showApproveSuccess ? (
                    <div className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                      <span className="text-sm font-medium">Published to Marketplace!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleApprove}
                      className="w-full px-5 py-3 bg-[#2d5a47] text-white rounded-xl hover:bg-[#234538] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                      Approve & Publish to Marketplace
                    </button>
                  )}
                  <button
                    onClick={() => setShowContactPopup(true)}
                    className="w-full px-5 py-3 bg-white border border-[#eaeaea] text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                    Request Revisions from Company
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
                  Revision requests direct you to the company's external contact details.
                  LuppoGrove does not provide in-app messaging.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CONTACT POPUP MODAL
          ═══════════════════════════════════════════════════════ */}
      {showContactPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowContactPopup(false)}
        >
          <div
            className="bg-white relative"
            style={{
              width: 460,
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowContactPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X size={16} color="#6b7280" />
            </button>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 8 }}>
              Contact the Company
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0, marginBottom: 24, lineHeight: 1.5 }}>
              LuppoGrove is not a communication tool. Please use the contact details below to request revisions via email or LinkedIn.
            </p>

            {/* Contact Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Primary Contact */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  backgroundColor: "#fafaf9",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="shrink-0 rounded-full bg-[#2d5a47]/10 text-[#2d5a47] flex items-center justify-center"
                    style={{ width: 40, height: 40, fontSize: 13, fontWeight: 600 }}
                  >
                    TW
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                      Tekla Wannas
                    </p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                      Code Ananas Oy — Product Owner
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-[52px]">
                  <a
                    href="mailto:tekla.wannas@codeananas.fi"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#2d5a47] hover:text-[#2d5a47] transition-all"
                    style={{ fontSize: 12, fontWeight: 500, color: "#374151", textDecoration: "none" }}
                  >
                    <Mail size={13} strokeWidth={1.5} />
                    tekla.wannas@codeananas.fi
                  </a>
                  <a
                    href="https://linkedin.com/in/teklawannas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#0077b5] hover:text-[#0077b5] transition-all"
                    style={{ fontSize: 12, fontWeight: 500, color: "#374151", textDecoration: "none" }}
                  >
                    <Linkedin size={13} strokeWidth={1.5} />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Secondary Contact */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  backgroundColor: "#fafaf9",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="shrink-0 rounded-full bg-[#2d5a47]/10 text-[#2d5a47] flex items-center justify-center"
                    style={{ width: 40, height: 40, fontSize: 13, fontWeight: 600 }}
                  >
                    RV
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                      Roope Vuorinen
                    </p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                      Code Ananas Oy — Technical Lead
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-[52px]">
                  <a
                    href="mailto:roope.vuorinen@codeananas.fi"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#2d5a47] hover:text-[#2d5a47] transition-all"
                    style={{ fontSize: 12, fontWeight: 500, color: "#374151", textDecoration: "none" }}
                  >
                    <Mail size={13} strokeWidth={1.5} />
                    roope.vuorinen@codeananas.fi
                  </a>
                  <a
                    href="https://linkedin.com/in/roopevuorinen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#0077b5] hover:text-[#0077b5] transition-all"
                    style={{ fontSize: 12, fontWeight: 500, color: "#374151", textDecoration: "none" }}
                  >
                    <Linkedin size={13} strokeWidth={1.5} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 10, color: "#9ca3af", margin: "16px 0 0 0", textAlign: "center" }}>
              All communication happens on external third-party platforms
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
