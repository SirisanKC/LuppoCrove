# LuppoGrove Backend Integration Guide

This document explains how to connect your LuppoGrove frontend to the LangGraph backend and configure SSO authentication for production deployment on Rahti CSC cloud.

## Architecture Overview

```
┌─────────────────┐      HTTPS/REST      ┌──────────────────┐
│                 │  ──────────────────>  │                  │
│  React Frontend │                       │  LangGraph API   │
│  (Vite/Tailwind)│  <────────────────── │  (Python/FastAPI)│
│                 │      JSON Response    │                  │
└─────────────────┘                       └──────────────────┘
         │                                         │
         │                                         │
         v                                         v
┌─────────────────┐                       ┌──────────────────┐
│   Haka SSO      │                       │   PostgreSQL     │
│   (SAML 2.0)    │                       │   Database       │
└─────────────────┘                       └──────────────────┘
┌─────────────────┐
│   Google SSO    │
│   (OAuth 2.0)   │
└─────────────────┘
```

## Environment Variables

### Required Frontend Environment Variables

Create a `.env` file in the root of your project:

```bash
# LangGraph Backend API
VITE_LANGGRAPH_API_URL=https://your-backend.rahtiapp.fi/api
VITE_LANGGRAPH_API_KEY=your_secure_api_key_here

# Authentication Backend
VITE_BACKEND_AUTH_URL=https://your-backend.rahtiapp.fi/auth
VITE_AUTH_REDIRECT_URI=https://your-frontend.rahtiapp.fi/auth/callback

# Haka SSO Configuration
VITE_HAKA_SSO_URL=https://testsp.funet.fi/shibboleth

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Development Mode (Mock Data)

If environment variables are not set or contain placeholder values (e.g., `YOUR_API_KEY_HERE`), the application will automatically use mock/stub responses for development and demo purposes.

## Backend API Endpoints

Your LangGraph backend should implement the following REST API endpoints:

### 1. Chat with AI (AI Project Wizard)

**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Software MVP",
      "timestamp": "2026-02-24T10:30:00Z"
    }
  ],
  "context": {
    "courseId": "CT60A9800",
    "companyId": "demo_company_1"
  }
}
```

**Response:**
```json
{
  "message": {
    "role": "ai",
    "content": "Great choice. Could you give me a quick description of the project?",
    "timestamp": "2026-02-24T10:30:01Z"
  }
}
```

### 2. Submit Proposal

**Endpoint:** `POST /api/proposals`

**Request:**
```json
{
  "topic": "Software MVP",
  "description": "Build a predictive maintenance system...",
  "courseId": "CT60A9800",
  "companyId": "konecranes_001",
  "requiresNDA": true
}
```

**Response:**
```json
{
  "proposalId": "prop_abc123xyz",
  "title": "Predictive Maintenance Modeling via Telemetry Data",
  "topic": "Software MVP",
  "scope": "This project involves...",
  "timeline": "12-14 Weeks",
  "ndaStatus": "NDA Required",
  "status": "submitted"
}
```

### 3. Smart Parse Course Info (AI Smart Paste)

**Endpoint:** `POST /api/courses/smart-parse`

**Request:**
```json
{
  "rawText": "CS-C3170 Software Engineering\nPeriod: September 1, 2026 - December 15, 2026\nThis course focuses on...",
  "context": "Finnish university course syllabus"
}
```

**Response:**
```json
{
  "courseTitle": "CS-C3170 Software Engineering Project",
  "courseDescription": "This course focuses on applying...",
  "startDate": "2026-09-01",
  "endDate": "2026-12-15",
  "proposalDeadline": "2026-08-15",
  "suggestedFields": [
    {
      "id": "1",
      "name": "Project Goals",
      "type": "text_paragraph",
      "maxLength": 500,
      "required": true
    }
  ],
  "confidence": 0.92
}
```

### 4. Create Course

**Endpoint:** `POST /api/courses`

**Request:**
```json
{
  "title": "CS-C3170 Software Engineering Project",
  "description": "This course focuses on...",
  "startDate": "2026-09-01",
  "endDate": "2026-12-15",
  "proposalDeadline": "2026-08-15",
  "customFields": [
    {
      "id": "1",
      "name": "Project Goals",
      "type": "text_paragraph",
      "maxLength": 500,
      "required": true
    }
  ]
}
```

**Response:**
```json
{
  "courseId": "course_xyz789abc"
}
```

## Authentication Setup

### Haka Federation (University SSO)

#### Requirements:
1. Register your service as a SAML Service Provider with Haka
2. Obtain SAML metadata from Haka federation
3. Configure your backend to handle SAML assertions

#### Backend Implementation (Python/FastAPI Example):

```python
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
import xmltodict

app = FastAPI()

@app.get("/auth/haka/login")
async def haka_login(request: Request):
    """Redirect to Haka SSO"""
    saml_request = create_saml_auth_request()
    haka_url = f"https://testsp.funet.fi/shibboleth?SAMLRequest={saml_request}"
    return RedirectResponse(haka_url)

@app.post("/auth/callback/haka")
async def haka_callback(request: Request):
    """Handle SAML assertion from Haka"""
    saml_response = await request.form()
    
    # Parse SAML assertion
    user_data = parse_saml_assertion(saml_response['SAMLResponse'])
    
    # Extract funetEduPerson attributes
    role = determine_role(user_data['eduPersonAffiliation'])
    
    # Create session token
    access_token = create_jwt_token({
        'user_id': user_data['hakaId'],
        'email': user_data['mail'],
        'role': role,
        'organization': user_data['schacHomeOrganization']
    })
    
    return {
        'user': {
            'id': user_data['hakaId'],
            'email': user_data['mail'],
            'name': user_data['displayName'],
            'role': role,
            'organization': user_data['schacHomeOrganization']
        },
        'tokens': {
            'accessToken': access_token,
            'expiresAt': int(time.time()) + 3600
        }
    }
```

#### Haka Attribute Mapping:

| Haka Attribute | LuppoGrove Field | Description |
|----------------|------------------|-------------|
| `urn:oid:1.3.6.1.4.1.5923.1.1.1.9` | `eduPersonAffiliation` | Role: faculty, student, staff |
| `urn:oid:0.9.2342.19200300.100.1.3` | `mail` | Email address |
| `urn:oid:2.5.4.42` | `givenName` | First name |
| `urn:oid:2.5.4.4` | `sn` | Last name |
| `urn:oid:1.3.6.1.4.1.5923.1.1.1.13` | `schacHomeOrganization` | Home institution domain |

### Google OAuth (Company SSO)

#### Setup Steps:
1. Create OAuth 2.0 credentials in Google Cloud Console
2. Configure authorized redirect URIs
3. Enable Google+ API

#### Backend Implementation:

```python
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()
oauth.register(
    name='google',
    client_id='YOUR_GOOGLE_CLIENT_ID',
    client_secret='YOUR_GOOGLE_CLIENT_SECRET',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.get("/auth/google/login")
async def google_login(request: Request):
    redirect_uri = request.url_for('google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback/google")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')
    
    # Create user session
    access_token = create_jwt_token({
        'user_id': user_info['sub'],
        'email': user_info['email'],
        'role': 'company',
        'organization': extract_company_domain(user_info['email'])
    })
    
    return {
        'user': {
            'id': user_info['sub'],
            'email': user_info['email'],
            'name': user_info['name'],
            'role': 'company',
            'organization': extract_company_domain(user_info['email']),
            'avatar': user_info.get('picture')
        },
        'tokens': {
            'accessToken': access_token,
            'expiresAt': int(time.time()) + 3600
        }
    }
```

## LangGraph Integration

### LangGraph Agent Configuration

Your LangGraph backend should implement a conversational agent with the following graph structure:

```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class ProjectWizardState(TypedDict):
    messages: List[BaseMessage]
    topic: Optional[str]
    description: Optional[str]
    nda_required: Optional[bool]
    proposal: Optional[dict]

def topic_node(state: ProjectWizardState):
    """Extract project topic"""
    # LLM call to extract topic
    return {"topic": extracted_topic}

def description_node(state: ProjectWizardState):
    """Extract project description"""
    # LLM call to structure description
    return {"description": structured_description}

def nda_node(state: ProjectWizardState):
    """Determine NDA requirement"""
    # LLM call to extract NDA intent
    return {"nda_required": nda_bool}

def generate_proposal_node(state: ProjectWizardState):
    """Generate final proposal"""
    proposal = {
        "title": generate_title(state['topic'], state['description']),
        "scope": state['description'],
        "nda_status": "NDA Required" if state['nda_required'] else "No NDA Required"
    }
    return {"proposal": proposal}

# Build graph
workflow = StateGraph(ProjectWizardState)
workflow.add_node("topic", topic_node)
workflow.add_node("description", description_node)
workflow.add_node("nda", nda_node)
workflow.add_node("generate", generate_proposal_node)

workflow.set_entry_point("topic")
workflow.add_edge("topic", "description")
workflow.add_edge("description", "nda")
workflow.add_edge("nda", "generate")
workflow.add_edge("generate", END)

app = workflow.compile()
```

## Deployment on Rahti CSC

### Frontend Deployment (Nginx)

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Backend Deployment (Python/FastAPI)

**Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Rahti Deployment Commands:

```bash
# Login to Rahti
oc login https://api.2.rahti.csc.fi:6443

# Create new project
oc new-project luppogrove-prod

# Deploy frontend
oc new-app https://github.com/your-org/luppogrove-frontend.git --name=frontend
oc expose svc/frontend

# Deploy backend
oc new-app https://github.com/your-org/luppogrove-backend.git --name=backend
oc expose svc/backend

# Set environment variables
oc set env deployment/backend \
  LANGGRAPH_API_KEY=your_secure_key \
  DATABASE_URL=postgresql://user:pass@postgres:5432/luppogrove

# Scale replicas
oc scale deployment/frontend --replicas=3
oc scale deployment/backend --replicas=2
```

## Security Considerations

### CORS Configuration

Backend must allow requests from frontend domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://luppogrove.rahtiapp.fi"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### JWT Token Security

- Use strong secret keys (minimum 256 bits)
- Set appropriate expiration times (1 hour for access tokens)
- Implement refresh token rotation
- Store tokens securely (httpOnly cookies or secure localStorage)

### Data Privacy (GDPR Compliance)

- Do NOT store PII without explicit consent
- Implement data retention policies
- Provide data export/deletion mechanisms
- Use encrypted connections (HTTPS/TLS)

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check backend CORS configuration
   - Verify frontend domain is whitelisted

2. **SSO Callback Fails:**
   - Verify redirect URI matches OAuth configuration
   - Check SAML assertion signature validation

3. **API Connection Timeout:**
   - Check backend health endpoint: `GET /health`
   - Verify network connectivity
   - Check Rahti pod logs: `oc logs deployment/backend`

4. **Mock Data Still Showing:**
   - Verify environment variables are set correctly
   - Rebuild frontend with new env vars
   - Clear browser cache and localStorage

## Testing

### Manual API Testing (curl):

```bash
# Test chat endpoint
curl -X POST https://your-backend.rahtiapp.fi/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "messages": [{"role": "user", "content": "Software MVP"}],
    "context": {"courseId": "test"}
  }'

# Test smart parse
curl -X POST https://your-backend.rahtiapp.fi/api/courses/smart-parse \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "rawText": "CS-C3170 Software Engineering...",
    "context": "Finnish university course"
  }'
```

## Support & Documentation

- **Rahti Documentation:** https://docs.csc.fi/cloud/rahti/
- **Haka Federation:** https://wiki.eduuni.fi/display/CSCHAKA/
- **LangGraph Docs:** https://langchain-ai.github.io/langgraph/

## License

This integration guide is part of the LuppoGrove project, deployed on CSC Rahti infrastructure.
