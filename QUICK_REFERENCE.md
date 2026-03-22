# 🚀 LuppoGrove Quick Reference Card

## 📦 Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## 🌐 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Root | Landing page |
| `/login` | EntryPortal | SSO login (Haka/Google) |
| `/company` | CompanyHub | Company dashboard + Gantt |
| `/company/wizard/:id` | AIProjectWizard | AI proposal builder |
| `/company/proposals` | MyProposals | Submitted proposals |
| `/company/projects` | ActiveProjects | Active collaborations |
| `/teacher` | CourseGallery | Teacher dashboard |
| `/teacher/course-builder` | TeacherCourseBuilder | Create course + AI paste |
| `/student` | ProjectMarketplace | Drag-drop team builder |

## 🔑 Environment Variables

```bash
# Backend API
VITE_LANGGRAPH_API_URL=http://localhost:8000/api
VITE_LANGGRAPH_API_KEY=YOUR_API_KEY_HERE  # Mock mode

# Authentication
VITE_BACKEND_AUTH_URL=http://localhost:8000/auth
VITE_HAKA_SSO_URL=https://testsp.funet.fi/shibboleth
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

## 🔧 Services

```typescript
// API Service
import { langGraphAPI } from '@/app/services/api';

const response = await langGraphAPI.chatWithAI(messages);
const proposal = await langGraphAPI.submitProposal(data);
const parsed = await langGraphAPI.smartParseCourseInfo({ rawText });

// Auth Service
import { useAuth } from '@/app/contexts/AuthContext';

const { user, loginWithHaka, loginWithGoogle, logout } = useAuth();
```

## 🎨 Design Tokens

```css
/* Colors */
--background: #fafaf9;    /* Warm Stone */
--primary: #2d5a47;       /* Forest Green */
--card: #ffffff;          /* Pure White */

/* Spacing */
--radius: 12px;           /* Border radius */

/* Typography */
font-family: Inter, sans-serif;
```

## 🐳 Docker

```bash
# Build
docker build -t luppogrove .

# Run
docker run -p 8080:8080 \
  -e VITE_LANGGRAPH_API_URL=https://api.example.fi \
  luppogrove

# Test
curl http://localhost:8080/health
```

## 🚀 Rahti Deployment

```bash
# Login
oc login https://api.2.rahti.csc.fi:6443

# Deploy
oc new-project luppogrove
oc new-app https://github.com/org/luppogrove.git
oc expose svc/luppogrove
oc scale deployment/luppogrove --replicas=3

# Monitor
oc logs deployment/luppogrove -f
oc get pods -w
```

## 🧪 Testing

```bash
# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Test backend health
curl https://backend.rahtiapp.fi/health
```

## 📚 Documentation

- **Overview:** `README.md`
- **Backend:** `BACKEND_INTEGRATION.md`
- **Deploy:** `DEPLOYMENT_CHECKLIST.md`
- **Services:** `src/app/services/README.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`

## 🔍 Common Commands

```bash
# View logs (Rahti)
oc logs deployment/luppogrove --tail=100 -f

# Scale replicas
oc scale deployment/luppogrove --replicas=5

# Restart deployment
oc rollout restart deployment/luppogrove

# Check status
oc get pods
oc get routes
oc describe pod <pod-name>

# Environment variables
oc set env deployment/luppogrove --list
oc set env deployment/luppogrove KEY=value
```

## 🚨 Troubleshooting

**Mock data still showing?**
```bash
# Check environment
echo $VITE_LANGGRAPH_API_KEY
# Should NOT be: YOUR_API_KEY_HERE

# Rebuild
npm run build
```

**CORS errors?**
```python
# Backend: Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://luppogrove.rahtiapp.fi"],
    allow_credentials=True
)
```

**SSO login fails?**
```bash
# Check redirect URI matches
echo $VITE_AUTH_REDIRECT_URI
# Must match OAuth provider config
```

**Build fails?**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

## 📞 Support

- **CSC Rahti:** servicedesk@csc.fi
- **Haka:** https://wiki.eduuni.fi/display/CSCHAKA/
- **Docs:** https://docs.csc.fi/cloud/rahti/

---

**Quick Start:** `npm install && npm run dev`

**Production:** See `DEPLOYMENT_CHECKLIST.md`
