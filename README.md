# 🚗 MVCS - Mechanic Virtual Conversational System

A complete AI-powered automotive diagnostic system that helps users diagnose vehicle problems through natural conversation.

## 🎯 Project Overview

MVCS is a modular, event-driven system that combines:
- **Conversational AI** for natural language interaction
- **Rule-based diagnostic engine** (Phase 1) → AI/ML models (Phase 2)
- **OBD-II simulation** for testing without hardware
- **Real-time vehicle data processing**
- **Comprehensive repair knowledge base**

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Layer                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  Web App     │              │  Mobile App  │            │
│  │  (React)     │              │  (Future)    │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           API Gateway & Event Bus                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Conversation │  │  Diagnostic  │  │   Vehicle    │    │
│  │   Service    │  │    Engine    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  PostgreSQL  │              │  Knowledge   │            │
│  │   Database   │              │    Vault     │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
mvcs-mechanic-system/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── services/       # Business logic
│   │   │   ├── diagnosticEngine.js
│   │   │   ├── obdSimulator.js
│   │   │   └── conversationManager.js
│   │   ├── routes/         # API endpoints
│   │   ├── database/       # Schema & migrations
│   │   └── server.js
│   └── package.json
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed-data.sql
└── docs/
    ├── API.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run init-db
npm start
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔧 Core Features

### Phase 1 (Current - Rule-Based)

✅ **Conversational Interface**
- Natural language symptom input
- Multi-turn diagnostic conversations
- Context-aware follow-up questions

✅ **Rule-Based Diagnostic Engine**
- Pattern matching for common issues
- Confidence scoring
- Multiple diagnosis suggestions

✅ **OBD-II Simulation**
- 5 vehicle profiles (healthy, dead battery, misfire, O2 sensor, overheating)
- Realistic parameter variations
- DTC code generation

✅ **Knowledge Vault**
- Common symptoms database
- OBD-II diagnostic codes (P0300, P0420, etc.)
- Component catalog with pricing
- Repair solutions with cost estimates

### Phase 2 (Future - AI-Powered)

🔄 **AI/ML Integration**
- Replace rule engine with trained models
- Pattern recognition from real repair data
- Predictive maintenance

🔄 **Real OBD-II Integration**
- Live vehicle data streaming
- Real-time diagnostics
- Historical data analysis

🔄 **Advanced Features**
- Voice interface
- Image recognition (damage assessment)
- Human expert escalation
- Repair shop integration

## 📊 Database Schema

### Core Tables

- **symptoms** - User-reported issues
- **diagnostic_codes** - OBD-II DTCs
- **components** - Vehicle parts catalog
- **solutions** - Repair procedures
- **fault_patterns** - Correlation data for AI training
- **user_sessions** - Conversation state
- **conversation_history** - Message logs
- **vehicle_snapshots** - OBD data captures

## 🧪 Testing

### Test Diagnostic Flow

```bash
# Create session
curl -X POST http://localhost:3000/api/conversation/session \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123", "vehicleInfo": {"make": "Toyota", "model": "Camry", "year": 2018}}'

# Send symptom
curl -X POST http://localhost:3000/api/conversation/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID",
    "message": "My car won'\''t start and makes clicking noises",
    "obdData": {"voltage": 10.8, "dtcCodes": []}
  }'
```

### Simulation Profiles

```bash
# Get dead battery simulation
curl http://localhost:3000/api/vehicle/obd/deadBattery

# Get misfire simulation
curl http://localhost:3000/api/vehicle/obd/misfire
```

## 📖 API Documentation

### Conversation Endpoints

- `POST /api/conversation/session` - Create new session
- `POST /api/conversation/message` - Send message & get diagnosis
- `GET /api/conversation/history/:sessionId` - Get conversation history

### Diagnostic Endpoints

- `GET /api/diagnostic/codes` - List all DTC codes
- `GET /api/diagnostic/codes/:code` - Get code details
- `GET /api/diagnostic/solutions` - List all solutions

### Vehicle Endpoints

- `GET /api/vehicle/profiles` - List simulation profiles
- `GET /api/vehicle/obd/:profile` - Get simulated OBD data

## 🛠️ Technology Stack

**Backend**
- Node.js + Express
- PostgreSQL
- WebSocket (ws)
- Joi (validation)

**Frontend**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios

**DevOps**
- Docker (coming soon)
- GitHub Actions (CI/CD)

## 📈 Roadmap

### Q1 2026
- ✅ Core backend API
- ✅ Rule-based diagnostic engine
- ✅ OBD simulation
- 🔄 React frontend
- 🔄 WebSocket real-time updates

### Q2 2026
- 🔄 Secure licensed repair data
- 🔄 Train initial ML models
- 🔄 Real OBD-II dongle integration
- 🔄 Mobile app (React Native)

### Q3 2026
- 🔄 AI model deployment
- 🔄 Voice interface
- 🔄 Image recognition
- 🔄 Beta testing

### Q4 2026
- 🔄 Public launch
- 🔄 Repair shop partnerships
- 🔄 Premium features

## 🤝 Contributing

This is a proprietary project. For collaboration inquiries, contact the project owner.

## 📄 License

Proprietary - All rights reserved

## 👤 Author

**Akash Brar**
- Email: akashb101@gmail.com
- GitHub: [@Akashb101](https://github.com/Akashb101)

## 🙏 Acknowledgments

- OBD-II specification from SAE International
- Automotive repair data standards
- Open-source community

---

**Built with ❤️ for automotive enthusiasts and DIY mechanics**
