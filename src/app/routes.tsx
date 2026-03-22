import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { EntryPortal } from "./pages/EntryPortal";
import { CompanyHub } from "./pages/CompanyHub";
import { CourseDetails } from "./pages/CourseDetails";
import { AaltoCourseDetails } from "./pages/AaltoCourseDetails";
import { HelsinkiCourseDetails } from "./pages/HelsinkiCourseDetails";
import { OuluCourseDetails } from "./pages/OuluCourseDetails";
import { TampereCourseDetails } from "./pages/TampereCourseDetails";
import { JyvaskylaCourseDetails } from "./pages/JyvaskylaCourseDetails";
import { MyProposals } from "./pages/MyProposals";
import { ProposalEditor } from "./pages/ProposalEditor";
import { ActiveProjects } from "./pages/ActiveProjects";
import { ProjectWorkspace } from "./pages/ProjectWorkspace";
import { ProjectOverview } from "./pages/ProjectOverview";
import { CourseGallery } from "./pages/CourseGallery";
import { ProjectMarketplace } from "./pages/ProjectMarketplace";
import { TeacherProposalReview } from "./pages/TeacherProposalReview";
import { TeacherProposalDetail } from "./pages/TeacherProposalDetail";
import { TeacherCourseBuilder } from "./pages/TeacherCourseBuilder";
import { CoordinatorProposalPipeline } from "./pages/CoordinatorProposalPipeline";
import { UpdatePassword } from "./pages/UpdatePassword";
import { RoleGuard } from "./components/RoleGuard";

export const router = createBrowserRouter([
  // ── Public routes ──
  {
    path: "/",
    Component: Root,
  },
  {
    path: "/login",
    Component: EntryPortal,
  },
  {
    path: "update-password",
    element: <UpdatePassword />,
  },

  // ── Company routes (role: company) ──
  {
    path: "/company",
    element: <RoleGuard allowedRoles={["company"]}><CompanyHub /></RoleGuard>,
  },
  {
    path: "/company/courses/:courseId",
    element: <RoleGuard allowedRoles={["company"]}><CourseDetails /></RoleGuard>,
  },
  {
    path: "/company/courses/aalto/:courseId",
    element: <RoleGuard allowedRoles={["company"]}><AaltoCourseDetails /></RoleGuard>,
  },
  {
    path: "/company/courses/helsinki/:courseId",
    element: <RoleGuard allowedRoles={["company"]}><HelsinkiCourseDetails /></RoleGuard>,
  },
  {
    path: "/company/courses/oulu/:courseId",
    element: <RoleGuard allowedRoles={["company"]}><OuluCourseDetails /></RoleGuard>,
  },
  {
    path: "/company/courses/tampere/:courseId",
    element: <RoleGuard allowedRoles={["company"]}><TampereCourseDetails /></RoleGuard>,
  },
  {
    path: "/company/courses/jyvaskyla/:courseId",
    element: <RoleGuard allowedRoles={["company"]}><JyvaskylaCourseDetails /></RoleGuard>,
  },
  {
    path: "/company/proposals",
    element: <RoleGuard allowedRoles={["company"]}><MyProposals /></RoleGuard>,
  },
  {
    path: "/company/proposals/:proposalId/edit",
    element: <RoleGuard allowedRoles={["company"]}><ProposalEditor /></RoleGuard>,
  },
  {
    path: "/company/projects",
    element: <RoleGuard allowedRoles={["company"]}><ActiveProjects /></RoleGuard>,
  },
  {
    path: "/company/projects/:projectId/workspace",
    element: <RoleGuard allowedRoles={["company"]}><ProjectWorkspace /></RoleGuard>,
  },
  {
    path: "/company/overview/:projectId",
    element: <RoleGuard allowedRoles={["company"]}><ProjectOverview /></RoleGuard>,
  },

  // ── Teacher routes (role: teacher) ──
  {
    path: "/teacher",
    element: <RoleGuard allowedRoles={["teacher"]}><CourseGallery /></RoleGuard>,
  },
  {
    path: "/teacher/course-builder",
    element: <RoleGuard allowedRoles={["teacher"]}><TeacherCourseBuilder /></RoleGuard>,
  },
  {
    path: "/teacher/courses/:courseId/proposals",
    element: <RoleGuard allowedRoles={["teacher"]}><CoordinatorProposalPipeline /></RoleGuard>,
  },
  {
    path: "/teacher/proposals/:proposalId/review",
    element: <RoleGuard allowedRoles={["teacher"]}><TeacherProposalReview /></RoleGuard>,
  },
  {
    path: "/teacher/proposals/:proposalId/details",
    element: <RoleGuard allowedRoles={["teacher"]}><TeacherProposalDetail /></RoleGuard>,
  },

  // ── Student routes (role: student) ──
  {
    path: "/student",
    element: <RoleGuard allowedRoles={["student"]}><ProjectMarketplace /></RoleGuard>,
  },

  // ── 404 ──
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground mb-8">Page not found</p>
          <a
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);