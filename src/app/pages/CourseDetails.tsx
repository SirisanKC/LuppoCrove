import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  Trees, 
  Plus, 
  BookOpen, 
  FileText, 
  FolderOpen,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle
} from "lucide-react";
import { DemoNav } from "@/app/components/DemoNav";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Co-owner" | "Developer" | "Normal";
  avatar: string;
}

export function CourseDetails() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeNav, setActiveNav] = useState("browse");

  const team: TeamMember[] = [
    { id: "1", name: "Alex Chen", email: "alex@company.com", role: "Owner", avatar: "AC" },
    { id: "2", name: "Maria Santos", email: "maria@company.com", role: "Co-owner", avatar: "MS" },
    { id: "3", name: "David Lee", email: "david@company.com", role: "Developer", avatar: "DL" },
    { id: "4", name: "Emma Wilson", email: "emma@company.com", role: "Normal", avatar: "EW" },
  ];

  const getRolePillColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-primary/15 text-primary";
      case "Co-owner":
        return "bg-accent text-foreground";
      case "Developer":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <DemoNav />
      {/* Left Sidebar - Team Management & Navigation */}
      <aside className="w-[280px] bg-white border-r border-border flex flex-col p-6 fixed h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Trees className="w-6 h-6 text-primary" strokeWidth={1.5} />
          <span className="text-lg font-medium text-foreground">LuppoGrove</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => navigate("/company")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
              activeNav === "browse"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            Browse Courses
          </button>
          <button
            onClick={() => navigate("/company/proposals")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
              activeNav === "proposals"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            My Proposals
          </button>
          <button
            onClick={() => navigate("/company/projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
              activeNav === "projects"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <FolderOpen className="w-4 h-4" strokeWidth={1.5} />
            Active Projects
          </button>
        </nav>

        {/* Team Hierarchy Section */}
        <div className="border-t border-border pt-6 mt-6">
          <h3 className="text-xs uppercase text-muted-foreground mb-4 font-medium tracking-wide">
            Team Hierarchy
          </h3>
          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{member.name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getRolePillColor(member.role)}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2 py-2">
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[280px] flex-1">
        {/* Header Section */}
        <div className="px-12 pt-12 pb-6 bg-[#fafaf9]">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <button 
              onClick={() => navigate("/company")}
              className="hover:text-gray-700 transition-colors"
            >
              Courses
            </button>
            {" / "}
            <span>Software Engineering</span>
            {" / "}
            <span className="text-gray-700">CT60A9800</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CT60A9800 Capstone Project for Software and Systems Engineering
          </h1>

          {/* Subtitle Row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#2d5a47]/10 flex items-center justify-center text-[#2d5a47] text-sm font-medium">
                MP
              </div>
              <span className="text-gray-700">Coordinator: Prof. Maria Paasivaara</span>
            </div>
            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
              Spring Semester
            </span>
            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
              Master's Level
            </span>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="px-12 py-6 bg-[#fafaf9]">
          <div 
            className="w-full h-[300px] rounded-[20px] bg-gradient-to-br from-[#2d5a47] to-[#4a7c5d] flex items-center justify-center overflow-hidden"
          >
            {/* Abstract Nordic geometric pattern */}
            <div className="relative w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-lg bg-white/15 rotate-45" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Trees className="w-24 h-24 text-white/20" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Split Layout */}
        <div className="px-12 py-12 bg-[#fafaf9] grid grid-cols-[65%_35%] gap-12">
          {/* Left Column - Course Details */}
          <div className="space-y-8">
            {/* Section 1: About this Course */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Course</h2>
              <p className="text-gray-700 leading-relaxed">
                During this capstone, students apply software engineering skills to run a real project in collaboration with a customer, from requirements to implementation and delivery. The course emphasizes practical application of agile methodologies, team collaboration, and professional software development practices in a real-world context.
              </p>
            </section>

            {/* Section 2: Methodology & Execution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Methodology & Execution</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[#2d5a47]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-[#2d5a47]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Scrum Framework</h3>
                    <p className="text-sm text-gray-600">
                      Teams work independently using agile methods and self-organize their workflow.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[#2d5a47]/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#2d5a47]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">2-Week Sprints</h3>
                    <p className="text-sm text-gray-600">
                      Structured short iterations with clear goals and deliverables at the end of each sprint.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[#2d5a47]/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#2d5a47]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Weekly Checkups</h3>
                    <p className="text-sm text-gray-600">
                      15-30 minute syncs required with the company to ensure alignment and progress.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[#2d5a47]/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#2d5a47]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Professional Standards</h3>
                    <p className="text-sm text-gray-600">
                      Students follow industry best practices for code quality, documentation, and testing.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Company Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Requirements</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 font-medium">
                    To ensure a successful partnership, companies must commit to the following:
                  </p>
                </div>
                <ul className="space-y-3 ml-8">
                  <li className="text-gray-700 text-sm">
                    <strong>Sign LUT NDA template:</strong> Required to protect intellectual property and ensure mutual confidentiality.
                  </li>
                  <li className="text-gray-700 text-sm">
                    <strong>Provide a dedicated Product Owner:</strong> A single point of contact who can answer questions and provide domain expertise.
                  </li>
                  <li className="text-gray-700 text-sm">
                    <strong>Available for sprint reviews:</strong> Attend 2-3 hour reviews every 2 weeks to evaluate progress and provide feedback.
                  </li>
                  <li className="text-gray-700 text-sm">
                    <strong>Respond to student inquiries:</strong> Timely responses to technical questions and clarifications (within 24-48 hours).
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* Right Column - Sticky Action Card */}
          <div>
            <div className="sticky top-12 bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Looking for real-world projects
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Teams of 4-6 students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>~15 hours/week per student</span>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                <button 
                  onClick={() => navigate(`/company/wizard/${courseId}`)}
                  className="w-full px-6 py-4 bg-[#2d5a47] text-white rounded-xl hover:bg-[#234739] hover:scale-[1.02] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Submit Idea to this Course
                </button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Our AI assistant will help you format your idea into the mandatory course syllabus template.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
