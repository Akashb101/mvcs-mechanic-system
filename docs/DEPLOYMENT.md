# MVCS Deployment Guide

Guide for deploying MVCS to production environments.

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)
### Option 2: Platform as a Service (Heroku, Railway, Render)
### Option 3: Containerized (Docker + Kubernetes)

---

## Option 1: VPS Deployment (Ubuntu 22.04)

### Prerequisites

- Ubuntu 22.04 server
- Root or sudo access
- Domain name (optional)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE mvcs_prod;
CREATE USER mvcs_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mvcs_prod TO mvcs_user;
\q
```

### 3. Application Deployment

```bash
# Create app directory
sudo mkdir -p /var/www/mvcs
sudo chown $USER:$USER /var/www/mvcs

# Clone repository
cd /var/www/mvcs
git clone https://github.com/Akashb101/mvcs-mechanic-system.git .

# Backend setup
cd backend
npm install --production
cp .env.example .env
nano .env  # Edit with production values
```

**Production .env:**
```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://mvcs_user:your_secure_password@localhost:5432/mvcs_prod
CORS_ORIGIN=https://yourdomain.com
```

```bash
# Initialize database
npm run init-db

# Start with PM2
pm2 start src/server.js --name mvcs-backend
pm2 save
pm2 startup  # Follow instructions
```

### 4. Frontend Build

```bash
cd /var/www/mvcs/frontend
npm install
npm run build

# Build output is in dist/
```

### 5. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/mvcs
```

**Nginx config:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/mvcs/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mvcs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 7. Firewall Setup

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## Option 2: Railway Deployment

### 1. Prepare for Railway

**Create `railway.json`:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Update `backend/package.json`:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "echo 'No build needed'"
  }
}
```

### 2. Deploy Backend

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add postgresql

# Deploy
railway up
```

### 3. Configure Environment

```bash
# Set environment variables
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app
```

### 4. Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

**Configure environment:**
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Option 3: Docker Deployment

### 1. Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: mvcs
      POSTGRES_USER: mvcs_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://mvcs_user:${DB_PASSWORD}@postgres:5432/mvcs
      CORS_ORIGIN: http://localhost
    depends_on:
      - postgres
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3. Deploy

```bash
# Build and start
docker-compose up -d

# Initialize database
docker-compose exec backend npm run init-db

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Environment Variables

### Backend Production Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Security
CORS_ORIGIN=https://yourdomain.com

# Future
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

### Frontend Production Variables

```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Database Migrations

### Backup

```bash
# Backup database
pg_dump -U mvcs_user mvcs_prod > backup_$(date +%Y%m%d).sql

# Restore
psql -U mvcs_user mvcs_prod < backup_20260115.sql
```

### Schema Updates

```bash
# Connect to production database
psql -U mvcs_user mvcs_prod

# Run migration SQL
\i migrations/001_add_new_table.sql
```

---

## Monitoring

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs mvcs-backend

# Monitor resources
pm2 monit

# Restart
pm2 restart mvcs-backend
```

### Database Monitoring

```bash
# Check connections
psql -U mvcs_user mvcs_prod -c "SELECT count(*) FROM pg_stat_activity;"

# Check table sizes
psql -U mvcs_user mvcs_prod -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

## Performance Optimization

### Database

```sql
-- Add indexes
CREATE INDEX CONCURRENTLY idx_conversation_created ON conversation_history(created_at);

-- Analyze tables
ANALYZE conversation_history;
ANALYZE vehicle_snapshots;

-- Vacuum
VACUUM ANALYZE;
```

### Nginx Caching

```nginx
# Add to nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    add_header X-Cache-Status $upstream_cache_status;
    # ... other proxy settings
}
```

---

## Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong database passwords
- [ ] Configure firewall (UFW)
- [ ] Enable fail2ban for SSH
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled (future)
- [ ] Input validation active

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
pm2 logs mvcs-backend

# Check database connection
psql -U mvcs_user mvcs_prod -c "SELECT 1;"

# Check port availability
sudo netstat -tulpn | grep 3000
```

### Database connection errors

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Nginx errors

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

---

## Rollback Procedure

```bash
# Stop application
pm2 stop mvcs-backend

# Restore database backup
psql -U mvcs_user mvcs_prod < backup_previous.sql

# Checkout previous version
git checkout <previous-commit>

# Reinstall dependencies
cd backend && npm install

# Restart
pm2 restart mvcs-backend
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check disk space
- Review performance metrics

**Weekly:**
- Database backup
- Security updates
- Performance analysis

**Monthly:**
- Full system backup
- Dependency updates
- Security audit

---

## Support

For deployment issues:
- GitHub Issues
- Email: akashb101@gmail.com
