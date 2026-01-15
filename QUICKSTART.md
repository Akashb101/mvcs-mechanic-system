# 🚀 MVCS Quick Start Tutorial

Get MVCS running in 10 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v18+)
node --version

# Check PostgreSQL (need v14+)
psql --version

# Check npm
npm --version
```

Don't have them? Install:
- **Node.js:** https://nodejs.org/
- **PostgreSQL:** https://www.postgresql.org/download/

---

## Step 1: Clone & Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/Akashb101/mvcs-mechanic-system.git
cd mvcs-mechanic-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: Database Setup (3 minutes)

```bash
# Create database
createdb mvcs

# Or using psql:
psql -U postgres
CREATE DATABASE mvcs;
\q

# Initialize database with schema and seed data
cd backend
cp .env.example .env
# Edit .env if needed (default works for local PostgreSQL)
npm run init-db
```

You should see:
```
🔧 Initializing database...
✅ Schema created successfully
✅ Seed data inserted successfully
```

---

## Step 3: Start Backend (1 minute)

```bash
cd backend
npm start
```

You should see:
```
🚗 ========================================
🚗 MVCS Backend Server Started
🚗 ========================================
📡 HTTP Server: http://localhost:3000
🔌 WebSocket Server: ws://localhost:3000
🌍 Environment: development
🚗 ========================================
```

**Keep this terminal open!**

---

## Step 4: Start Frontend (1 minute)

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 5: Test the System (3 minutes)

### Test 1: Open the App

1. Open browser: http://localhost:5173
2. You should see the MVCS homepage
3. Click **"Start Diagnosis"**

### Test 2: Run a Diagnostic

Try these test scenarios:

**Scenario 1: Dead Battery**
```
1. Type: "My car won't start and makes clicking noises"
2. Click Send
3. You should get a diagnosis suggesting "Dead or Weak Battery"
```

**Scenario 2: Engine Misfire**
```
1. Type: "Engine is shaking and running rough"
2. Click Send
3. You should get a diagnosis suggesting "Engine Misfire"
```

**Scenario 3: With OBD Data**
```
1. In the right panel, select "Dead Battery" profile
2. Click "Load Simulated Data"
3. Type: "Car won't start"
4. The diagnosis should be more confident with the OBD data
```

### Test 3: Check API Directly

```bash
# Test health endpoint
curl http://localhost:3000/health

# Get vehicle profiles
curl http://localhost:3000/api/vehicle/profiles

# Get diagnostic codes
curl http://localhost:3000/api/diagnostic/codes
```

---

## 🎉 Success!

You now have a fully functional MVCS system running locally!

---

## What's Next?

### Explore Features

1. **Dashboard** - Click "Dashboard" in the header
2. **Different Profiles** - Try all 6 OBD simulation profiles
3. **API** - Read `docs/API.md` for all endpoints

### Customize

1. **Add Your Own Symptoms**
   ```sql
   psql mvcs
   INSERT INTO symptoms (phrase, category, severity) 
   VALUES ('strange noise from engine', 'engine', 'medium');
   ```

2. **Add Diagnostic Rules**
   Edit `backend/src/services/diagnosticEngine.js`

3. **Modify UI**
   Edit files in `frontend/src/`

### Learn More

- **Architecture:** `docs/ARCHITECTURE.md`
- **API Reference:** `docs/API.md`
- **Deployment:** `docs/DEPLOYMENT.md`
- **Full Setup:** `docs/SETUP.md`

---

## Common Issues

### "Database connection failed"

```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it:
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows:
# Start from Services panel
```

### "Port 3000 already in use"

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in backend/.env
PORT=3001
```

### "Module not found"

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Test Scenarios

### Complete Diagnostic Flow

```
User: "My car won't start"
Bot: "I need more information..."

User: "It makes clicking noises"
Bot: "Do you hear a clicking sound when you turn the key?"

User: "Yes"
Bot: "Based on your description, it sounds like you might have a 
     Dead or Weak Battery (85% confidence).
     
     Recommended Solution: Replace Battery
     Estimated Cost: $100 - $300
     Difficulty: Easy
     Time: 30 minutes"
```

### With OBD Data

```
1. Load "Dead Battery" profile
2. OBD shows: Voltage: 10.8V, RPM: 0
3. User: "Car won't start"
4. Bot: Diagnoses with 95% confidence (higher due to OBD data)
```

---

## Development Tips

### Auto-Reload

Both servers support auto-reload:
- **Backend:** Uses `nodemon` (if you run `npm run dev`)
- **Frontend:** Vite HMR (Hot Module Replacement)

### Database Reset

```bash
cd backend
psql mvcs -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run init-db
```

### View Logs

```bash
# Backend logs (if using pm2)
pm2 logs mvcs-backend

# Or just check the terminal where you ran npm start
```

---

## Project Structure

```
mvcs-mechanic-system/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── database/    # DB setup
│   └── package.json
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── services/    # API client
│   └── package.json
└── docs/                # Documentation
```

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run init-db      # Initialize database
npm start            # Start server
npm run dev          # Start with auto-reload

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production

# Database
createdb mvcs        # Create database
psql mvcs            # Connect to database
dropdb mvcs          # Delete database
```

---

## Next Steps

1. ✅ System is running
2. 📖 Read the documentation
3. 🔧 Customize for your needs
4. 🚀 Deploy to production (see `docs/DEPLOYMENT.md`)
5. 🤖 Add AI/ML models (Phase 2)

---

## Get Help

- **Documentation:** `/docs` folder
- **Issues:** https://github.com/Akashb101/mvcs-mechanic-system/issues
- **Email:** akashb101@gmail.com

---

**Happy Diagnosing! 🚗💨**
