import { useNavigate, useLocation } from "react-router";
import { Home, LogIn, Building2, GraduationCap, Users, FileText, FolderOpen, Briefcase, FileCheck, Inbox, Sparkles, PenLine, Eye, Wrench } from "lucide-react";

export function DemoNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: "/", label: "Home", icon: Home },
    { path: "/login", label: "Login Portal", icon: LogIn },
    { path: "/company", label: "Company View", icon: Building2 },
    { path: "/company/wizard/CT60A9800", label: "AI Wizard", icon: Sparkles },
    { path: "/company/proposals", label: "Company Proposals", icon: FileText },
    { path: "/company/proposals/1/edit", label: "Proposal Editor", icon: PenLine },
    { path: "/company/projects", label: "Company - Active Projects", icon: FolderOpen },
    { path: "/company/projects/1/workspace", label: "Workspace", icon: Briefcase },
    { path: "/company/overview/proj-1", label: "Project Overview", icon: Eye },
    { path: "/teacher", label: "Teacher View", icon: GraduationCap },
    { path: "/teacher/course-builder", label: "Course Builder", icon: Wrench },
    { path: "/teacher/courses/CT60A9800/proposals", label: "Teacher Pipeline", icon: Inbox },
    { path: "/teacher/proposals/1/review", label: "Teacher Review", icon: FileCheck },
    { path: "/student", label: "Student View", icon: Users },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-border px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-2">Demo Navigation:</span>
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = location.pathname === route.path;
          return (
            <button
              key={route.path}
              onClick={() => navigate(route.path)}
              className={`px-3 py-2 rounded-full text-xs transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
              title={route.label}
            >
              <Icon className="w-3 h-3" strokeWidth={1.5} />
              <span className="hidden md:inline">{route.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}