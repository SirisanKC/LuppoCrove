# LuppoGrove Services Documentation

This directory contains the core service modules for connecting the LuppoGrove frontend to the backend infrastructure.

## Service Architecture

```
src/app/services/
├── api.ts          # LangGraph API client
├── auth.ts         # SSO authentication service
└── apiUtils.ts     # HTTP utilities and helpers
```

## Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your actual backend URLs and credentials.

### 2. Using the API Service

```typescript
import { langGraphAPI } from '@/app/services/api';

// AI Chat conversation
const response = await langGraphAPI.chatWithAI(messages, { 
  courseId: 'CT60A9800',
  companyId: 'company_123'
});

// Submit proposal
const proposal = await langGraphAPI.submitProposal({
  topic: 'Software MVP',
  description: 'Build a system...',
  courseId: 'CT60A9800',
  companyId: 'company_123',
  requiresNDA: true
});

// Smart parse course info
const parsed = await langGraphAPI.smartParseCourseInfo({
  rawText: 'CS-C3170 Software Engineering...',
  context: 'Finnish university course'
});
```

### 3. Using Authentication

```typescript
import { useAuth } from '@/app/contexts/AuthContext';

function MyComponent() {
  const { user, loginWithHaka, loginWithGoogle, logout } = useAuth();
  
  if (!user) {
    return (
      <button onClick={loginWithHaka}>
        Login with University
      </button>
    );
  }
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 4. Making Authenticated Requests

```typescript
import { authenticatedFetch } from '@/app/services/apiUtils';

// Automatically includes auth token and handles refresh
const data = await authenticatedFetch('/api/some-endpoint', {
  method: 'POST',
  body: JSON.stringify({ data: 'value' })
});
```

## Features

### API Service (`api.ts`)

- ✅ **Auto-fallback to mock data** - Works without backend for development
- ✅ **Type-safe API calls** - Full TypeScript definitions
- ✅ **Error handling** - Automatic retry and error recovery
- ✅ **Configurable** - Environment variable configuration

### Auth Service (`auth.ts`)

- ✅ **Dual SSO** - Haka (SAML 2.0) and Google (OAuth 2.0)
- ✅ **Session persistence** - localStorage with expiration
- ✅ **Role-based routing** - Automatic redirect based on user role
- ✅ **CSRF protection** - State parameter validation
- ✅ **Token refresh** - Automatic token renewal

### API Utilities (`apiUtils.ts`)

- ✅ **Authenticated fetch** - Auto token injection and refresh
- ✅ **Retry logic** - Exponential backoff for failed requests
- ✅ **File upload/download** - Progress tracking support
- ✅ **WebSocket support** - Authenticated real-time connections
- ✅ **Health checks** - Backend connectivity testing

## Development Mode

When environment variables contain placeholder values (e.g., `YOUR_API_KEY_HERE`), the services automatically use **mock data**. This allows:

- ✅ Full UI development without backend
- ✅ Realistic demo presentations
- ✅ Component testing
- ✅ Rapid prototyping

To force mock mode even with valid credentials:
```bash
VITE_USE_MOCK_DATA=true
```

## Production Deployment

### Backend Requirements

Your backend must implement these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | AI conversation processing |
| `/api/proposals` | POST | Submit project proposals |
| `/api/courses/smart-parse` | POST | AI course info extraction |
| `/api/courses` | POST | Create new course |
| `/auth/haka/login` | GET | Initiate Haka SSO |
| `/auth/callback/haka` | POST | Handle Haka callback |
| `/auth/google/login` | GET | Initiate Google OAuth |
| `/auth/callback/google` | GET | Handle Google callback |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Revoke tokens |
| `/health` | GET | Health check |

See `BACKEND_INTEGRATION.md` for complete implementation guide.

### Environment Variables

Production configuration for Rahti CSC deployment:

```bash
VITE_LANGGRAPH_API_URL=https://luppogrove-backend.rahtiapp.fi/api
VITE_BACKEND_AUTH_URL=https://luppogrove-backend.rahtiapp.fi/auth
VITE_AUTH_REDIRECT_URI=https://luppogrove.rahtiapp.fi/auth/callback
VITE_HAKA_SSO_URL=https://your-haka-endpoint.funet.fi/shibboleth
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

## Error Handling

All services throw `APIError` with structured error information:

```typescript
try {
  const data = await langGraphAPI.chatWithAI(messages);
} catch (error) {
  if (error instanceof APIError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    
    // Handle specific errors
    if (error.code === 'AUTH_REQUIRED') {
      // Redirect to login
    } else if (error.status >= 500) {
      // Show server error message
    }
  }
}
```

## Testing

### Unit Testing API Service

```typescript
import { langGraphAPI } from './api';

test('chat API returns valid response', async () => {
  const response = await langGraphAPI.chatWithAI([
    { role: 'user', content: 'Software MVP' }
  ]);
  
  expect(response.role).toBe('ai');
  expect(response.content).toBeDefined();
});
```

### Integration Testing with Mock Backend

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/chat', (req, res, ctx) => {
    return res(ctx.json({
      message: { role: 'ai', content: 'Mock response' }
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Security Best Practices

### API Keys
- ❌ **Never commit** `.env` file to version control
- ✅ Use environment-specific configuration
- ✅ Rotate keys regularly
- ✅ Use least-privilege access

### Authentication
- ✅ Store tokens securely (httpOnly cookies preferred)
- ✅ Implement token refresh before expiration
- ✅ Clear tokens on logout
- ✅ Validate redirect URIs

### Data Privacy
- ✅ Never log sensitive user data
- ✅ Implement GDPR-compliant data handling
- ✅ Use HTTPS for all API calls
- ✅ Sanitize user inputs

## Troubleshooting

### "Not authenticated" Error
```typescript
// Check auth state
const authState = authService.getAuthState();
console.log('Authenticated:', authState.isAuthenticated);
console.log('Token expires:', new Date(authState.tokens?.expiresAt || 0));

// If expired, refresh or re-login
if (authState.tokens?.refreshToken) {
  await authService.refreshToken(authState.tokens.refreshToken);
}
```

### CORS Errors
Ensure backend has correct CORS configuration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://luppogrove.rahtiapp.fi"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Mock Data Not Showing
Check environment variables:
```bash
# Should see placeholder value
echo $VITE_LANGGRAPH_API_KEY
# Output: YOUR_API_KEY_HERE (triggers mock mode)
```

## Migration from Mock to Production

1. **Deploy backend** to Rahti CSC
2. **Configure environment** variables with production URLs
3. **Test authentication** flow with real SSO providers
4. **Verify API endpoints** return expected data
5. **Monitor errors** in production logs
6. **Implement analytics** for usage tracking

## Support

- **Backend Integration:** See `BACKEND_INTEGRATION.md`
- **Rahti Deployment:** https://docs.csc.fi/cloud/rahti/
- **Haka Setup:** https://wiki.eduuni.fi/display/CSCHAKA/
- **Issues:** Contact your technical lead

---

Last updated: 2026-02-24
