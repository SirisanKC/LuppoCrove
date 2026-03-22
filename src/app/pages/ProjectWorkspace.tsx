import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  Trees, 
  BookOpen, 
  FileText, 
  FolderOpen,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileIcon,
  Eye
} from "lucide-react";
import { CompanyNav } from "../components/CompanyNav";

// Company Active Projects & Submissions - Moodle-style Interface for B2B Users
// Rebuild: force module reload v3

interface TeacherRequest {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "completed";
  submittedFile?: {
    name: string;
    submittedOn: string;
  };
}

export function ProjectWorkspace() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});

  const projectTitle = "LUT Capstone: Predictive Maintenance";
  const teacher = "Prof. Maria Paasivaara";
  const currentWeek = 4;
  const totalWeeks = 14;
  const progressPercentage = Math.round((currentWeek / totalWeeks) * 100);

  const teacherRequests: TeacherRequest[] = [
    {
      id: "1",
      title: "Architecture Review Document",
      description: "Upload the final system architecture diagram showing data flow and component interactions",
      deadline: "March 6, 2026",
      status: "pending",
    },
    {
      id: "2",
      title: "Telemetry Data Analysis Report",
      description: "Provide analysis of the sample telemetry data with statistical summaries",
      deadline: "March 10, 2026",
      status: "pending",
    },
    {
      id: "3",
      title: "Initial Concept Pitch",
      description: "Project proposal and initial approach presentation",
      deadline: "Feb 15, 2026",
      status: "completed",
      submittedFile: {
        name: "Concept_Pitch_Konecranes.pdf",
        submittedOn: "Feb 25",
      },
    },
    {
      id: "4",
      title: "Team Member NDA Confirmation",
      description: "Signed NDA documents from all participating team members",
      deadline: "Feb 20, 2026",
      status: "completed",
      submittedFile: {
        name: "Team_NDAs_Signed.pdf",
        submittedOn: "Feb 19",
      },
    },
  ];

  const pendingRequests = teacherRequests.filter(req => req.status === "pending");
  const completedRequests = teacherRequests.filter(req => req.status === "completed");

  const handleFileUpload = (requestId: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [requestId]: file }));
  };

  const handleDragEnter = (requestId: string) => {
    setDragActive(prev => ({ ...prev, [requestId]: true }));
  };

  const handleDragLeave = (requestId: string) => {
    setDragActive(prev => ({ ...prev, [requestId]: false }));
  };

  const handleDrop = (requestId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [requestId]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(requestId, files[0]);
    }
  };

  const handleFileSelect = (requestId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(requestId, files[0]);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf9]">
      <CompanyNav />

      {/* Main Content Area */}
      <main className="ml-[260px] flex-1 p-10">
        <div className="max-w-[1200px] space-y-8">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/company/projects")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            Back to Active Projects
          </button>

          {/* Main Content Header */}
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold text-gray-900">Active Projects</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Monitor your ongoing collaborations and manage pending requests from course coordinators.
            </p>
          </div>

          {/* Project Tracking Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
            {/* Card Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{projectTitle}</h2>
                  <p className="text-sm text-gray-600">Sponsored by Konecranes • Teacher: {teacher}</p>
                </div>
                <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700">
                  Week {currentWeek} of {totalWeeks}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Overall Progress</span>
                  <span className="text-xs font-semibold text-[#2d5a47]">{progressPercentage}%</span>
                </div>
                <div className="w-full h-3 bg-[#f0f0ed] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2d5a47] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Teacher Requests & Submission Section (The Moodle Vibe) */}
            <div className="space-y-6">
              {/* Section Header */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-bold text-gray-800">
                  Pending Action Items from {teacher}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Complete these deliverables and submit them to your course coordinator
                </p>
              </div>

              {/* Pending Tasks List */}
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all bg-white">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left Side - Task Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                              {request.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {request.description}
                            </p>
                            <p className="text-xs text-amber-600 font-medium mt-2">
                              Deadline: {request.deadline}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - File Dropzone */}
                      <div className="flex-shrink-0 w-[320px]">
                        {uploadedFiles[request.id] ? (
                          <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <FileIcon className="w-5 h-5 text-green-700" strokeWidth={1.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-green-900 truncate">{uploadedFiles[request.id].name}</p>
                                <p className="text-xs text-green-700">Ready to submit</p>
                              </div>
                            </div>
                            <button className="w-full mt-3 px-4 py-2 bg-[#2d5a47] text-white rounded-lg hover:bg-[#234739] transition-all font-semibold text-sm">
                              Submit to Teacher
                            </button>
                          </div>
                        ) : (
                          <div
                            onDragEnter={() => handleDragEnter(request.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragLeave={() => handleDragLeave(request.id)}
                            onDrop={(e) => handleDrop(request.id, e)}
                            className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                              dragActive[request.id]
                                ? "border-[#2d5a47] bg-[#2d5a47]/5"
                                : "border-gray-300 bg-[#f0f0ed] hover:border-[#2d5a47] hover:bg-[#2d5a47]/5"
                            }`}
                          >
                            <input
                              type="file"
                              id={`file-upload-${request.id}`}
                              accept=".pdf,.ppt,.pptx"
                              onChange={(e) => handleFileSelect(request.id, e)}
                              className="hidden"
                            />
                            <label htmlFor={`file-upload-${request.id}`} className="cursor-pointer">
                              <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Upload className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {dragActive[request.id] ? "Drop file here" : "Drag and drop PDF/PPTX here"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
                                </div>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Completed Tasks Section */}
              {completedRequests.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-bold text-gray-800">Completed Submissions</h3>
                  <div className="space-y-3">
                    {completedRequests.map((request) => (
                      <div key={request.id} className="border border-green-200 bg-green-50/50 rounded-xl p-5">
                        <div className="flex items-center justify-between gap-6">
                          {/* Left Side - Task Info */}
                          <div className="flex items-start gap-3 flex-1">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{request.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{request.description}</p>
                            </div>
                          </div>

                          {/* Right Side - Submission Info */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {request.submittedFile?.name}
                              </p>
                              <p className="text-xs text-gray-600">Submitted on {request.submittedFile?.submittedOn}</p>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 font-medium text-sm whitespace-nowrap">
                              <Eye className="w-4 h-4" strokeWidth={1.5} />
                              View Submission
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
