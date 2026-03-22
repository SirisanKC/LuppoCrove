# LuppoGrove - University-Industry Collaboration Platform

<div align="center">

**A Nordic Minimalist collaboration ecosystem connecting universities and companies through real-world project execution**

[![Deployed on Rahti](https://img.shields.io/badge/Deployed%20on-Rahti%20CSC-blue)](https://rahti.csc.fi)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org)
[![Powered by LangGraph](https://img.shields.io/badge/Powered%20by-LangGraph-FF6B6B)](https://langchain-ai.github.io/langgraph/)

</div>

---

## Project Overview

LuppoGrove transforms academic-industry partnerships by functioning as a sophisticated, dual-sided marketplace—an **"Airbnb for Collaboration"**—where university courses serve as the hosting environments and corporate project topics seek placement through tangible, outcome-driven execution.

### Key Innovation

Traditional hiring relies on CVs and artificial interviews that fail to reflect real capabilities. LuppoGrove replaces this with:

- ✅ **Real-world project execution** instead of static documentation
- ✅ **AI-powered project matching** via LangGraph conversational interface
- ✅ **Minimal administrative overhead** for teachers through smart automation
- ✅ **Verified academic achievement** as proof of capability for students

### Stakeholder Hierarchy

| Priority | Stakeholder | Role | Key Need |
|----------|-------------|------|----------|
| 🥇 Primary | **Teachers** | Gatekeepers | Frictionless industry partnerships with zero administrative bloat |
| 🥈 Secondary | **Students** | Execution Engine | Intuitive team formation and real-world project experience |
| 🥉 Tertiary | **Companies** | Demand Side | Low-risk testing ground for experimental R&D and talent |

---

## Architecture

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Routing:** React Router v7 (Data Mode)
- **Styling:** Tailwind CSS v4 + MUI Components
- **State:** React Context API
- **Build:** Vite

### Backend Stack (Integration Ready)
- **AI Framework:** LangGraph (Python)
- **API:** FastAPI / REST
- **Database:** PostgreSQL
- **Authentication:** Haka SAML 2.0 + Google OAuth 2.0
- **Deployment:** Rahti CSC (Docker/Kubernetes)

### Design System: Nordic Minimalism

| Token | Value | Purpose |
|-------|-------|---------|
| **Background** | `#fafaf9` | Warm Stone - reduces optical fatigue |
| **Primary** | `#2d5a47` | Deep Forest Green - trust & growth |
| **Surface** | `#ffffff` | Pure White - elevated cards |
| **Radius** | `12-16px` | Soft corners - "cute" professional aesthetic |
| **Typography** | Inter | Maximum legibility across dense data |

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- (Optional) Backend API endpoint

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/luppogrove.git
cd luppogrove

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URLs

# Start development server
npm run dev
```

### Development Mode (Mock Data)

The application works **out of the box** with mock data. No backend required for frontend development!

```bash
# Default .env uses mock mode
VITE_LANGGRAPH_API_KEY=YOUR_API_KEY_HERE  # Triggers mock responses
```

---

## Core Features

### 1️⃣ Entry Portal (SSO Authentication)

**Nordic-styled login** with dual authentication pathways:

- **University Login** → Haka Federation (SAML 2.0 via Microsoft Entra ID)
- **Company Login** → Google Workspace (OAuth 2.0)

Automatically routes users based on organizational role detection.

**File:** `src/app/pages/EntryPortal.tsx`

---

### 2️⃣ Company Hub (Dashboard + Gantt Timeline)

**B2B SaaS-inspired dashboard** featuring:

- **Gantt Chart Timeline** - Visual course schedules with hover tooltips
- **Course Gallery** - Airbnb-style cards filtered by university
- **Team Hierarchy** - Role-based access control (Owner, Co-owner, Developer)
- **Submit Idea CTA** - Opens AI Project Wizard

**File:** `src/app/pages/CompanyHub.tsx`

---

### 3️⃣ AI Project Wizard (Conversational Interface)

**Split-pane modal** with real-time proposal generation:

**Left Pane:** Conversational chatbot
- Quick-select topic buttons (Software, Data, AI)
- Natural language input
- Progressive disclosure (Topic → Description → NDA)

**Right Pane:** Live document preview
- Auto-generated proposal title
- Structured academic format
- Real-time NDA status indicator

**Backend Integration:** Powered by LangGraph multi-agent system

**File:** `src/app/pages/AIProjectWizard.tsx`

---

### 4️⃣ Teacher Course Builder (AI Smart Paste)

**Flexible template engine** with smart automation:

- **AI Smart Paste** - Paste syllabus from Sisu/Moodle → Auto-extract fields
- **Gantt Milestones** - Define proposal deadline, mid-term, final delivery
- **Custom Proposal Fields** - Dynamic form builder
  - Text paragraph (with character limits)
  - Short text
  - File upload / folder

**Backend Integration:** LangGraph NLP for course info extraction

**File:** `src/app/pages/TeacherCourseBuilder.tsx`

---

### 5️⃣ Project Marketplace (Drag-and-Drop Squad Builder)

**Canva-style team formation** interface:

- **Student Pool** - Draggable peer cards with major badges
- **Role Slots** - Drop zones with role requirements
- **Live Team Roster** - Visual squad composition
- **Constraint Validation** - Enforces project requirements

**Library:** `react-dnd` with HTML5 backend

**File:** `src/app/pages/ProjectMarketplace.tsx`

---

## 🔧 Services & API Integration

### Service Architecture

```
src/app/services/
├── api.ts          # LangGraph API client
├── auth.ts         # SSO authentication service
├── apiUtils.ts     # HTTP utilities (retry, upload, WebSocket)
└── README.md       # Service documentation
```

### Example: Using the API

```typescript
import { langGraphAPI } from '@/app/services/api';

// AI Chat
const response = await langGraphAPI.chatWithAI(messages, {
  courseId: 'CT60A9800',
  companyId: 'company_123'
});

// Submit Proposal
const proposal = await langGraphAPI.submitProposal({
  topic: 'Software MVP',
  description: 'Build a predictive maintenance system...',
  courseId: 'CT60A9800',
  companyId: 'company_123',
  requiresNDA: true
});
```

### Example: Authentication

```typescript
import { useAuth } from '@/app/contexts/AuthContext';

function MyComponent() {
  const { user, loginWithHaka, logout } = useAuth();
  
  return user ? (
    <button onClick={logout}>Logout {user.name}</button>
  ) : (
    <button onClick={loginWithHaka}>Login with University</button>
  );
}
```

**Detailed Guide:** See `src/app/services/README.md`

---

## Authentication & Security

### Haka Federation (Universities)

- **Protocol:** SAML 2.0
- **Identity Provider:** Microsoft Entra ID
- **Attributes:** funetEduPerson schema
  - `eduPersonAffiliation` → Role detection (faculty, student)
  - `schacHomeOrganization` → University domain
  - `mail`, `displayName` → User profile

### Google OAuth (Companies)

- **Protocol:** OAuth 2.0
- **Scopes:** `openid email profile`
- **Domain Extraction:** Company identification from email domain

### Security Features

- ✅ **JWT token-based sessions** with automatic refresh
- ✅ **CSRF protection** via state parameter validation
- ✅ **Secure token storage** (localStorage with expiration)
- ✅ **Role-based access control** (RBAC)
- ✅ **HTTPS-only** in production

**Setup Guide:** See `BACKEND_INTEGRATION.md`

---

## Deployment (Rahti CSC Cloud)

### Prerequisites
- OpenShift CLI (`oc`)
- Docker
- Rahti CSC account

### Deploy Frontend

```bash
# Login to Rahti
oc login https://api.2.rahti.csc.fi:6443

# Create project
oc new-project luppogrove-prod

# Deploy from Git
oc new-app https://github.com/your-org/luppogrove.git --name=frontend

# Expose route
oc expose svc/frontend

# Set environment variables
oc set env deployment/frontend \
  VITE_LANGGRAPH_API_URL=https://backend.rahtiapp.fi/api \
  VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Scale replicas
oc scale deployment/frontend --replicas=3
```

### Health Checks

```bash
# Check pod status
oc get pods

# View logs
oc logs deployment/frontend

# Check routes
oc get routes
```

**Complete Guide:** See `BACKEND_INTEGRATION.md` (Section: Deployment)

---

## Development

### Project Structure

```
luppogrove/
├── src/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context providers
│   │   ├── pages/            # Route components
│   │   ├── services/         # API & auth services
│   │   ├── App.tsx           # Root component
│   │   └── routes.tsx        # React Router config
│   └── styles/
│       ├── theme.css         # Design tokens
│       └── tailwind.css      # Tailwind imports
├── BACKEND_INTEGRATION.md    # Backend setup guide
├── .env.example              # Environment template
└── package.json
```

### Available Scripts

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_LANGGRAPH_API_URL` | Backend API base URL | `https://api.example.fi/api` |
| `VITE_LANGGRAPH_API_KEY` | API authentication key | `sk_live_abc123...` |
| `VITE_HAKA_SSO_URL` | Haka SSO endpoint | `https://testsp.funet.fi/shibboleth` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456.apps.googleusercontent.com` |

**Template:** `.env.example`

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** | Complete backend setup, API specs, SSO config |
| **[src/app/services/README.md](./src/app/services/README.md)** | Service layer documentation |
| **[.env.example](./.env.example)** | Environment variable template |

---

## Design Philosophy

### Nordic Minimalism Principles

1. **Form Follows Function** - Every element serves a clear purpose
2. **Warmth Through Simplicity** - Soft colors, generous whitespace
3. **High Contrast Typography** - Inter font for maximum legibility
4. **Soft Geometry** - 12-16px border radius for approachable feel
5. **Subtle Elevation** - Diffused shadows mimicking natural light

### Component Guidelines

- ✅ Use design tokens from `theme.css`
- ✅ Prefer composition over configuration
- ✅ Keep components single-responsibility
- ✅ Use TypeScript for type safety
- ✅ Follow React hooks best practices

---

## Contributing

### Development Workflow

1. **Fork & Clone** the repository
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Implement changes** with tests
4. **Commit** (`git commit -m 'Add amazing feature'`)
5. **Push** (`git push origin feature/amazing-feature`)
6. **Open Pull Request**

### Code Standards

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Meaningful commit messages
- ✅ Component documentation
- ✅ Responsive design (mobile-first)

---

## Roadmap

### Phase 1: Foundation (Current)
- ✅ UI components with Nordic design system
- ✅ Mock data for development
- ✅ Authentication context
- ✅ API service layer

### Phase 2: Backend Integration
- 🔄 LangGraph API deployment
- 🔄 PostgreSQL database setup
- 🔄 Haka SSO production config
- 🔄 Google OAuth production config

### Phase 3: Advanced Features
- 📋 Real-time collaboration (WebSocket)
- 📋 File upload/download
- 📋 Notification system
- 📋 Analytics dashboard

### Phase 4: Scale & Optimize
- 📋 Multi-language support (Finnish, Swedish, English)
- 📋 Performance optimization
- 📋 Mobile app (React Native)
- 📋 Integration with university LMS (Moodle, Canvas)

---

## Technical Specifications

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance Targets
- ⚡ First Contentful Paint: < 1.5s
- ⚡ Time to Interactive: < 3.5s
- ⚡ Lighthouse Score: > 90

### Accessibility
- ♿ WCAG 2.1 Level AA compliant
- ♿ Keyboard navigation support
- ♿ Screen reader compatible
- ♿ High contrast mode support

---

## 📄 License

This project is developed for deployment on **Rahti CSC Cloud Infrastructure** and adheres to CSC's usage policies.

---

## Acknowledgments

- **CSC - IT Center for Science** for Rahti cloud infrastructure
- **Funet / Haka Federation** for university authentication
- **LangChain** for LangGraph framework
- **Nordic design community** for aesthetic inspiration

---

## Support

- **Technical Issues:** Open a GitHub issue
- **Backend Integration:** See `BACKEND_INTEGRATION.md`
- **Rahti Support:** https://docs.csc.fi/cloud/rahti/
- **Haka Support:** https://wiki.eduuni.fi/display/CSCHAKA/

---

<div align="center">

*"Transforming academic-industry partnerships through intelligent collaboration"*

</div>

*(... whatever Mon9ka already wrote in the file ...)*

---

## 🚀 Testing Register and Login

### 1. Install Dependencies
Run this command in the project folder:
\`\`\`
npm install
\`\`\`

### 2. Set Up Environment Variables (CRITICAL)
Create a new file named `.env` in the root folder and add these lines in .env file:

VITE_SUPABASE_URL=xxxxxxxxxxxx

VITE_SUPABASE_ANON_KEY=xxxxxxxxxxx

### 3. Start the Server
\`\`\`
npm run dev
\`\`\`
