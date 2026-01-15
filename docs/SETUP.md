# MVCS Setup Guide

Complete step-by-step guide to set up and run the MVCS project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Akashb101/mvcs-mechanic-system.git
cd mvcs-mechanic-system
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mvcs;

# Create user (optional)
CREATE USER mvcs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mvcs TO mvcs_user;

# Exit
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

**Update `.env` file:**

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://mvcs_user:your_password@localhost:5432/mvcs
CORS_ORIGIN=http://localhost:5173
```

#### Initialize Database

```bash
# Run database initialization script
npm run init-db
```

This will:
- Create all required tables
- Seed initial data (symptoms, DTC codes, components, solutions)

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-15T...",
  "version": "1.0.0"
}
```

### 2. Test API Endpoints

```bash
# Get vehicle profiles
curl http://localhost:3000/api/vehicle/profiles

# Get diagnostic codes
curl http://localhost:3000/api/diagnostic/codes

# Get simulated OBD data
curl http://localhost:3000/api/vehicle/obd/deadBattery
```

### 3. Access Frontend

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## Testing the System

### Test Diagnostic Flow

1. Go to http://localhost:5173
2. Click "Start Diagnosis"
3. Try these test messages:
   - "My car won't start and makes clicking noises"
   - "Engine is misfiring and shaking"
   - "Check engine light is on"

### Test with Simulated OBD Data

1. In the chat interface, select a simulation profile (e.g., "Dead Battery")
2. Click "Load Simulated Data"
3. Send a message describing symptoms
4. The system will use OBD data to improve diagnosis accuracy

## Common Issues

### Database Connection Error

**Error:** `Failed to initialize database`

**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in `.env`
3. Ensure database exists: `psql -l | grep mvcs`

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
1. Change PORT in backend `.env`
2. Update VITE_API_URL in frontend if needed
3. Or kill the process using the port:
   ```bash
   # Find process
   lsof -i :3000
   # Kill it
   kill -9 <PID>
   ```

### CORS Errors

**Error:** `CORS policy blocked`

**Solution:**
1. Ensure CORS_ORIGIN in backend `.env` matches frontend URL
2. Restart backend server after changing `.env`

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Backend Development

```bash
cd backend
npm run dev  # Auto-reloads on file changes
```

### Frontend Development

```bash
cd frontend
npm run dev  # Hot module replacement enabled
```

### Database Migrations

To reset the database:

```bash
cd backend
psql -U postgres -d mvcs -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run init-db
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | Required |
| CORS_ORIGIN | Allowed frontend origin | http://localhost:5173 |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000/api |

## Next Steps

- Read [API Documentation](./API.md)
- Review [Architecture Guide](./ARCHITECTURE.md)
- Check [Deployment Guide](./DEPLOYMENT.md)
- Explore the codebase

## Support

For issues or questions:
- Create an issue on GitHub
- Contact: akashb101@gmail.com
