import { Trees, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { TeacherNav } from "@/app/components/TeacherNav";

interface Proposal {
  id: string;
  title: string;
  company: string;
  contacts: string;
  techStack: string[];
  aiScore: number;
  maxScore: number;
}

export function CoordinatorProposalPipeline() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const proposals: Proposal[] = [
    {
      id: "1",
      title: "AI-Powered Food Waste Reduction App",
      company: "Code Ananas",
      contacts: "Tekla Wannas / Roope Vuorinen",
      techStack: ["Node.js", "React", "Cosmos DB"],
      aiScore: 6,
      maxScore: 6,
    },
    {
      id: "2",
      title: "Post-Tinder Relationship Platform MVP",
      company: "Lovnity Oy",
      contacts: "Tomi Verkkomäki",
      techStack: ["Python", "React", "PostgreSQL"],
      aiScore: 6,
      maxScore: 6,
    },
    {
      id: "3",
      title: "Automating Retail Inventory with Computer Vision",
      company: "ReEmber Oy",
      contacts: "Oona Linna",
      techStack: ["NextJS", "AWS", "PyTorch"],
      aiScore: 6,
      maxScore: 6,
    },
    {
      id: "4",
      title: "Keys2Balance Training & Assessment Platform",
      company: "Keys2Balance Oy",
      contacts: "Carita Nyberg",
      techStack: ["Full-stack Web", "Wix"],
      aiScore: 6,
      maxScore: 6,
    },
    {
      id: "5",
      title: "Aihana Mobile Invoice Approval App",
      company: "Virnex",
      contacts: "Tom Gustafsson",
      techStack: ["React Native", "REST API"],
      aiScore: 6,
      maxScore: 6,
    },
    {
      id: "6",
      title: "Peikko 3D Step-file Converter SaaS",
      company: "Peikko Group",
      contacts: "Sampo Pilli-Sihvola",
      techStack: ["Blazor C#", "Azure"],
      aiScore: 6,
      maxScore: 6,
    },
  ];

  const checklistLabels = ["Intro", "Goals", "Tech", "Students", "Legal (LUT NDA)", "Client"];

  return (
    <div className="min-h-screen flex bg-[#fafaf9]">
      <TeacherNav />

      <div className="flex-1 flex flex-col" style={{ marginLeft: 260 }}>
        {/* Top Header Navigation */}
        <header className="bg-white border-b border-[#eaeaea] h-20 flex items-center justify-between px-10 sticky top-0 z-10">
          {/* Left Side - Logo & Breadcrumb */}
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
                My Courses
              </button>
              <span>/</span>
              <span className="text-foreground font-medium">CT60A9800 Capstone Project</span>
            </div>
          </div>

          {/* Right Side - User Profile */}
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

        {/* Main Content Area */}
        <main className="flex-1 p-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Title Area */}
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-[32px] font-bold text-gray-900">
                Incoming Industry Proposals
              </h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {proposals.length} Total Submissions
              </span>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 mb-6">
              <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                Status: Ready for Review ({proposals.length})
              </button>
              <button className="px-4 py-2 rounded-lg bg-white text-gray-600 text-sm font-medium border border-[#eaeaea] hover:bg-gray-50 transition-colors">
                Status: Missing Info (0)
              </button>
              <button className="px-4 py-2 rounded-lg bg-white text-gray-600 text-sm font-medium border border-[#eaeaea] hover:bg-gray-50 transition-colors">
                Filter by Tech Stack
              </button>
            </div>

            {/* Proposal Pipeline List */}
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white rounded-xl border border-[#eaeaea] p-6 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] group cursor-pointer"
                  onClick={() => navigate(`/teacher/proposals/${proposal.id}/review`)}
                >
                  <div className="flex items-center justify-between gap-6">
                    {/* Left Side - Project Context */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {proposal.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {proposal.company} ({proposal.contacts})
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          {proposal.techStack.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Middle - AI Compliance Checklist */}
                    <div className="flex flex-col items-center gap-2 px-6 border-l border-r border-[#eaeaea]">
                      <p className="text-xs font-bold text-gray-700">
                        AI Extraction Score: {proposal.aiScore}/{proposal.maxScore}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: proposal.maxScore }).map((_, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center"
                            title={checklistLabels[idx]}
                          >
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 text-center max-w-[280px]">
                        {checklistLabels.join(" | ")}
                      </p>
                    </div>

                    {/* Right Side - Action Button */}
                    <div className="flex-shrink-0">
                      <button className="px-5 py-2.5 rounded-lg border border-[#eaeaea] text-sm font-medium text-gray-700 bg-white group-hover:bg-[#2d5a47] group-hover:text-white group-hover:border-[#2d5a47] transition-all">
                        View Full Proposal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
