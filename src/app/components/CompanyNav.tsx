import { useNavigate, useLocation } from "react-router";
import { Trees, BookOpen, FileText, FolderOpen, Shield, LogOut, PenLine, Briefcase, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const COMPANY_NAV = [
  { id: "browse", label: "Browse Courses", icon: BookOpen, path: "/company" },
  { id: "proposals", label: "My Proposals", icon: FileText, path: "/company/proposals" },
  { id: "editor", label: "Proposal Editor", icon: PenLine, path: "/company/proposals/1/edit" },
  { id: "projects", label: "Active Projects", icon: FolderOpen, path: "/company/projects" },
  { id: "workspace", label: "Workspace", icon: Briefcase, path: "/company/projects/1/workspace" },
  { id: "overview", label: "Project Overview", icon: Eye, path: "/company/overview/proj-1" },
];

/**
 * Sidebar navigation for company pages.
 * Fixed left sidebar (260px) with logo, role badge, nav links, and logout.
 */
export function CompanyNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col bg-white z-20"
      style={{ width: 260, padding: 24, borderRight: "1px solid #e8e8e6" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <Trees className="w-6 h-6 text-[#2d5a47]" strokeWidth={1.5} />
        <span style={{ fontSize: 20, fontWeight: 700, color: "#2d5a47", letterSpacing: "-0.02em" }}>
          LuppoGrove
        </span>
      </div>

      {/* Role badge */}
      <div
        className="flex items-center gap-2 mb-6"
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          backgroundColor: "rgba(45,90,71,0.05)",
          border: "1px solid rgba(45,90,71,0.1)",
        }}
      >
        <Shield size={13} color="#2d5a47" />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#2d5a47", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Company View
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {COMPANY_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-[#2d5a47] text-white font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={{ fontSize: 14, border: "none", cursor: "pointer", background: isActive ? "#2d5a47" : "none" }}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t pt-4" style={{ borderColor: "#e8e8e6" }}>
        <div className="flex items-center gap-3 mb-3 px-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ backgroundColor: "#2d5a47" }}
          >
            {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Company User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.organization || ""}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          style={{ fontSize: 13, border: "none", cursor: "pointer", background: "none" }}
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
