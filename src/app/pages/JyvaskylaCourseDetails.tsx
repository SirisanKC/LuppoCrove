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
  AlertCircle,
  BarChart3,
  TrendingUp,
  Database
} from "lucide-react";
import { DemoNav } from "@/app/components/DemoNav";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Co-owner" | "Developer" | "Normal";
  avatar: string;
}

export function JyvaskylaCourseDetails() {
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
            <span>University of Jyväskylä</span>
            {" / "}
            <span className="text-gray-700">TIES456</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TIES456 Information Systems Project: Business Intelligence & Analytics
          </h1>

          {/* Subtitle Row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 text-sm font-medium">
                ML
              </div>
              <span className="text-gray-700">Coordinator: Prof. Marja Lehtonen</span>
            </div>
            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
              Fall Semester
            </span>
            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
              Master's Level
            </span>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="px-12 py-6 bg-[#fafaf9]">
          <div 
            className="w-full h-[300px] rounded-[20px] bg-gradient-to-br from-[#30cfd0] to-[#330867] flex items-center justify-center overflow-hidden relative"
          >
            {/* Abstract pattern for data analytics */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/10" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
              <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white/15 rounded-lg rotate-12" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <BarChart3 className="w-24 h-24 text-white/20" strokeWidth={1} />
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
                This advanced course focuses on building data-driven information systems with business intelligence and analytics capabilities. Students learn to design and implement data warehouses, ETL pipelines, analytical dashboards, and predictive models that drive business decisions. The course combines theoretical knowledge with practical experience through real-world company projects involving data integration, visualization, and advanced analytics.
              </p>
            </section>

            {/* Section 2: Methodology & Execution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Methodology & Execution</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Database className="w-6 h-6 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Data Warehousing</h3>
                    <p className="text-sm text-gray-600">
                      Design and implement dimensional models, ETL processes, and data quality frameworks.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Analytics Dashboards</h3>
                    <p className="text-sm text-gray-600">
                      Build interactive visualizations using Power BI, Tableau, or custom web-based solutions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Predictive Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Integrate machine learning models for forecasting and recommendation systems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-cyan-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Monthly Reviews</h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive reviews at project milestones to ensure alignment with business objectives.
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
                    <strong>Sign University of Jyväskylä NDA:</strong> Required for all projects involving business data and analytics.
                  </li>
                  <li className="text-gray-700 text-sm">
                    <strong>Provide data access:</strong> Anonymized or sandbox datasets that represent real business scenarios.
                  </li>
                  <li className="text-gray-700 text-sm">
                    <strong>Business intelligence mentorship:</strong> A BI specialist or data analyst for guidance on requirements and validation.
                  </li>
                  <li className="text-gray-700 text-sm">
                    <strong>Monthly stakeholder reviews:</strong> Participate in milestone reviews to provide business context and feedback.
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
                    Looking for BI & analytics projects
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Teams of 3-4 students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>~10 hours/week per student</span>
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
