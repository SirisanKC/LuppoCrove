# 🚀 LuppoGrove Deployment Checklist

## Pre-Deployment Verification

### ✅ Frontend Build

- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Environment variables configured
- [ ] Production build successful (`npm run build`)
- [ ] Build size optimized (< 2MB)

```bash
# Verify build
npm run build
ls -lh dist/

# Test production build locally
npm run preview
```

### ✅ Backend Integration

- [ ] Backend API deployed and accessible
- [ ] Health endpoint responding: `GET /health`
- [ ] CORS configured for frontend domain
- [ ] API key generated and secured
- [ ] Database migrations completed
- [ ] Environment variables set on backend

```bash
# Test backend connectivity
curl https://your-backend.rahtiapp.fi/health

# Test API endpoint
curl -X POST https://your-backend.rahtiapp.fi/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"messages": [{"role": "user", "content": "test"}]}'
```

### ✅ Authentication Setup

#### Haka SSO
- [ ] Service registered with Haka federation
- [ ] SAML metadata uploaded
- [ ] Redirect URI whitelisted
- [ ] Attribute mapping configured
- [ ] Test login completed

#### Google OAuth
- [ ] OAuth credentials created in Google Cloud Console
- [ ] Authorized redirect URIs configured
- [ ] Client ID and secret secured
- [ ] Test login completed

```bash
# Verify OAuth redirect URI
echo "Frontend URL: https://luppogrove.rahtiapp.fi"
echo "Callback URL: https://luppogrove.rahtiapp.fi/auth/callback"
```

### ✅ Environment Variables

**Frontend (.env):**
```bash
VITE_LANGGRAPH_API_URL=https://backend.rahtiapp.fi/api
VITE_LANGGRAPH_API_KEY=sk_prod_abc123xyz789
VITE_BACKEND_AUTH_URL=https://backend.rahtiapp.fi/auth
VITE_AUTH_REDIRECT_URI=https://luppogrove.rahtiapp.fi/auth/callback
VITE_HAKA_SSO_URL=https://your-haka-endpoint.funet.fi/shibboleth
VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
```

**Backend (Python):**
```bash
DATABASE_URL=postgresql://user:pass@postgres:5432/luppogrove
LANGGRAPH_API_KEY=sk_prod_abc123xyz789
JWT_SECRET=your-secure-jwt-secret-256-bits
HAKA_SP_ENTITY_ID=https://luppogrove.rahtiapp.fi
GOOGLE_CLIENT_SECRET=your-google-client-secret
CORS_ORIGINS=https://luppogrove.rahtiapp.fi
```

## Rahti CSC Deployment

### 1. Setup Rahti CLI

```bash
# Install OpenShift CLI
# macOS
brew install openshift-cli

# Linux
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz
tar xvf openshift-client-linux.tar.gz
sudo mv oc /usr/local/bin/

# Verify installation
oc version

# Login to Rahti
oc login https://api.2.rahti.csc.fi:6443
# Enter your CSC username and password
```

### 2. Create Project

```bash
# Create new project
oc new-project luppogrove-prod

# Verify current project
oc project
```

### 3. Deploy Backend (Python/FastAPI)

```bash
# Create app from Git repository
oc new-app python:3.11~https://github.com/your-org/luppogrove-backend.git \
  --name=backend \
  --strategy=docker

# Set environment variables
oc set env deployment/backend \
  DATABASE_URL="postgresql://user:pass@postgres:5432/luppogrove" \
  LANGGRAPH_API_KEY="sk_prod_abc123" \
  JWT_SECRET="your-jwt-secret" \
  CORS_ORIGINS="https://luppogrove.rahtiapp.fi"

# Expose service
oc expose svc/backend --hostname=luppogrove-backend.rahtiapp.fi

# Scale to 2 replicas
oc scale deployment/backend --replicas=2

# Check status
oc get pods -w
oc logs deployment/backend -f
```

### 4. Deploy Database (PostgreSQL)

```bash
# Deploy PostgreSQL
oc new-app postgresql-persistent \
  --param DATABASE_SERVICE_NAME=postgres \
  --param POSTGRESQL_DATABASE=luppogrove \
  --param POSTGRESQL_USER=luppogrove \
  --param POSTGRESQL_PASSWORD=secure-password-here

# Wait for database to be ready
oc get pods -l name=postgres -w

# Run migrations
oc rsh deployment/backend
python manage.py migrate
exit
```

### 5. Deploy Frontend (React/Vite)

```bash
# Create build config
cat <<EOF | oc create -f -
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: frontend
spec:
  source:
    git:
      uri: https://github.com/your-org/luppogrove-frontend.git
    type: Git
  strategy:
    dockerStrategy:
      dockerfilePath: Dockerfile
    type: Docker
  output:
    to:
      kind: ImageStreamTag
      name: frontend:latest
EOF

# Create image stream
oc create imagestream frontend

# Start build
oc start-build frontend --follow

# Create deployment
oc new-app frontend:latest --name=frontend

# Set environment variables
oc set env deployment/frontend \
  VITE_LANGGRAPH_API_URL="https://luppogrove-backend.rahtiapp.fi/api" \
  VITE_BACKEND_AUTH_URL="https://luppogrove-backend.rahtiapp.fi/auth" \
  VITE_AUTH_REDIRECT_URI="https://luppogrove.rahtiapp.fi/auth/callback" \
  VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"

# Expose route with TLS
oc create route edge frontend \
  --service=frontend \
  --hostname=luppogrove.rahtiapp.fi \
  --insecure-policy=Redirect

# Scale to 3 replicas
oc scale deployment/frontend --replicas=3

# Check status
oc get pods
oc get routes
```

### 6. Configure SSL/TLS

```bash
# Rahti provides automatic TLS certificates via Let's Encrypt
# Verify HTTPS is working
curl -I https://luppogrove.rahtiapp.fi

# Should see: HTTP/2 200
```

### 7. Setup Health Checks

```bash
# Configure liveness probe
oc set probe deployment/backend --liveness \
  --get-url=http://:8000/health \
  --initial-delay-seconds=30 \
  --timeout-seconds=3

# Configure readiness probe
oc set probe deployment/backend --readiness \
  --get-url=http://:8000/health \
  --initial-delay-seconds=10 \
  --timeout-seconds=3

# Same for frontend
oc set probe deployment/frontend --liveness \
  --get-url=http://:8080/ \
  --initial-delay-seconds=15

oc set probe deployment/frontend --readiness \
  --get-url=http://:8080/ \
  --initial-delay-seconds=5
```

### 8. Setup Auto-Scaling

```bash
# Horizontal Pod Autoscaler for backend
oc autoscale deployment/backend \
  --min=2 \
  --max=10 \
  --cpu-percent=70

# Horizontal Pod Autoscaler for frontend
oc autoscale deployment/frontend \
  --min=2 \
  --max=5 \
  --cpu-percent=80

# Check autoscalers
oc get hpa
```

## Post-Deployment Verification

### ✅ Smoke Tests

```bash
# 1. Test frontend accessibility
curl -I https://luppogrove.rahtiapp.fi
# Expected: HTTP/2 200

# 2. Test backend health
curl https://luppogrove-backend.rahtiapp.fi/health
# Expected: {"status": "healthy"}

# 3. Test API endpoint
curl -X POST https://luppogrove-backend.rahtiapp.fi/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"messages": [{"role": "user", "content": "test"}]}'
# Expected: Valid JSON response

# 4. Test SSO login flow
# Open browser: https://luppogrove.rahtiapp.fi/login
# Click "University Login" → Should redirect to Haka
# Click "Company Login" → Should redirect to Google
```

### ✅ Security Checks

- [ ] HTTPS enforced (no HTTP access)
- [ ] CORS properly configured
- [ ] API keys not exposed in frontend
- [ ] Database not publicly accessible
- [ ] Security headers present

```bash
# Check security headers
curl -I https://luppogrove.rahtiapp.fi | grep -E "X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security"

# Verify no sensitive data in frontend bundle
curl https://luppogrove.rahtiapp.fi/assets/*.js | grep -E "password|secret|api_key"
```

### ✅ Performance Tests

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://luppogrove.rahtiapp.fi --view

# Load testing (optional)
npm install -g artillery
artillery quick --count 10 -n 20 https://luppogrove.rahtiapp.fi
```

## Monitoring & Logging

### View Logs

```bash
# Backend logs
oc logs deployment/backend -f --tail=100

# Frontend logs
oc logs deployment/frontend -f --tail=100

# Database logs
oc logs deployment/postgres -f --tail=100

# All pods
oc logs -l app=backend -f --all-containers=true
```

### Monitor Resources

```bash
# Pod status
oc get pods -w

# Resource usage
oc adm top pods
oc adm top nodes

# Events
oc get events --sort-by='.lastTimestamp'
```

### Setup Alerts (Optional)

```bash
# Create alert for pod failures
oc create -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: luppogrove-alerts
spec:
  groups:
  - name: luppogrove
    rules:
    - alert: PodDown
      expr: up{job="backend"} == 0
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "Backend pod is down"
EOF
```

## Rollback Procedures

### Rollback Deployment

```bash
# Check deployment history
oc rollout history deployment/backend
oc rollout history deployment/frontend

# Rollback to previous version
oc rollout undo deployment/backend
oc rollout undo deployment/frontend

# Rollback to specific revision
oc rollout undo deployment/backend --to-revision=2

# Check rollout status
oc rollout status deployment/backend
```

### Emergency Procedures

```bash
# Scale down to 0 (emergency stop)
oc scale deployment/backend --replicas=0

# Delete pods to force restart
oc delete pods -l app=backend

# Restore from backup (database)
oc rsh deployment/postgres
psql -U luppogrove -d luppogrove < /backup/dump.sql
exit
```

## Maintenance

### Update Application

```bash
# Trigger new build from latest Git commit
oc start-build backend --follow
oc start-build frontend --follow

# Or update image
oc set image deployment/backend backend=new-image:tag
oc set image deployment/frontend frontend=new-image:tag
```

### Database Backup

```bash
# Create backup job
oc create -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/sh
            - -c
            - pg_dump -U luppogrove luppogrove > /backup/dump-\$(date +%Y%m%d).sql
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres
                  key: database-password
          restartPolicy: OnFailure
EOF
```

## Support Contacts

- **CSC Support:** servicedesk@csc.fi
- **Rahti Documentation:** https://docs.csc.fi/cloud/rahti/
- **Haka Support:** https://wiki.eduuni.fi/display/CSCHAKA/

## Final Checklist

- [ ] All pods running and healthy
- [ ] Routes accessible via HTTPS
- [ ] Authentication flows working
- [ ] API endpoints responding correctly
- [ ] Database connections stable
- [ ] Logs showing no errors
- [ ] SSL certificates valid
- [ ] Auto-scaling configured
- [ ] Backup jobs scheduled
- [ ] Monitoring alerts active
- [ ] Documentation updated
- [ ] Team notified of deployment

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Version:** _______________  
**Notes:** _______________

---

🎉 **Congratulations! LuppoGrove is now live on Rahti CSC!**
