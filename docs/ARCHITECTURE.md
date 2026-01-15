# MVCS Architecture Documentation

Comprehensive technical architecture guide for the Mechanic Virtual Conversational System.

## System Overview

MVCS is a modular, event-driven diagnostic system built with a clear separation of concerns across three main layers:

1. **User Layer** - Frontend interfaces (Web, Mobile future)
2. **Service Layer** - Backend API and business logic
3. **Data Layer** - PostgreSQL database and knowledge vault

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │   Web App        │              │   Mobile App     │        │
│  │   (React)        │              │   (Future)       │        │
│  │   Port: 5173     │              │                  │        │
│  └──────────────────┘              └──────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Gateway & Event Bus                     │  │
│  │              Express.js + WebSocket                      │  │
│  │              Port: 3000                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Conversation │  │  Diagnostic  │  │   Vehicle    │        │
│  │   Service    │  │    Engine    │  │   Service    │        │
│  │              │  │              │  │              │        │
│  │ - Session    │  │ - Rule-Based │  │ - OBD Sim    │        │
│  │ - History    │  │ - Pattern    │  │ - Real OBD   │        │
│  │ - Context    │  │   Matching   │  │   (Future)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼ SQL Queries
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                         │  │
│  │              Port: 5432                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Knowledge   │  │  User Data   │  │  Analytics   │        │
│  │    Vault     │  │              │  │              │        │
│  │              │  │              │  │              │        │
│  │ - Symptoms   │  │ - Sessions   │  │ - Patterns   │        │
│  │ - DTC Codes  │  │ - History    │  │ - Stats      │        │
│  │ - Components │  │ - Snapshots  │  │ - Metrics    │        │
│  │ - Solutions  │  │              │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **WebSocket:** ws library
- **Database Client:** node-postgres (pg)
- **Validation:** Joi
- **Security:** Helmet, CORS

### Database
- **DBMS:** PostgreSQL 14+
- **Schema:** Relational with JSONB for flexibility

### DevOps (Future)
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Hosting:** TBD (AWS/Azure/GCP)

## Core Components

### 1. Diagnostic Engine

**Location:** `backend/src/services/diagnosticEngine.js`

**Purpose:** Rule-based pattern matching for vehicle diagnostics

**Key Features:**
- Symptom keyword matching
- DTC code correlation
- OBD parameter analysis
- Confidence scoring
- Multi-diagnosis support

**Algorithm:**
```javascript
1. Normalize user input (lowercase, tokenize)
2. For each diagnostic rule:
   a. Match symptoms against keywords
   b. Match DTC codes if available
   c. Check OBD parameters against thresholds
   d. Calculate match score
3. Sort matches by confidence
4. Fetch detailed info from database
5. Return top diagnosis + alternatives
```

**Phase 2 Evolution:**
- Replace rule engine with ML models
- Add neural network for pattern recognition
- Implement reinforcement learning from feedback

### 2. OBD Simulator

**Location:** `backend/src/services/obdSimulator.js`

**Purpose:** Generate realistic vehicle data for testing

**Profiles:**
- `healthy` - Normal operation
- `deadBattery` - Low voltage
- `misfire` - Engine misfire with DTCs
- `o2Sensor` - Faulty oxygen sensor
- `overheating` - High coolant temp
- `driving` - Vehicle in motion

**Data Points:**
- Voltage (V)
- RPM
- Coolant Temperature (°C)
- Engine Load (%)
- Fuel Pressure (PSI)
- Intake Air Temperature (°C)
- MAF (Mass Air Flow)
- Throttle Position (%)
- O2 Sensor Voltage (V)
- Speed (MPH)
- DTC Codes

**Variation Algorithm:**
```javascript
// Add realistic noise to base values
voltage += random(-0.1, +0.1)
rpm += random(-25, +25)
coolantTemp += random(-1.5, +1.5)
```

### 3. Conversation Manager

**Location:** `backend/src/services/conversationManager.js`

**Purpose:** Manage multi-turn diagnostic conversations

**State Machine:**
```
initial → collecting_info → diagnosing → solution_provided → follow_up
```

**Session Data:**
```javascript
{
  stage: 'diagnosing',
  collectedInfo: {
    symptoms: [],
    answers: {},
    obdData: {}
  },
  pendingQuestions: [],
  diagnosisHistory: []
}
```

**Key Methods:**
- `createSession()` - Initialize new conversation
- `updateSession()` - Update conversation state
- `addMessage()` - Log message to history
- `getHistory()` - Retrieve conversation log
- `saveVehicleSnapshot()` - Store OBD data

## Database Schema

### Core Tables

#### symptoms
```sql
id              SERIAL PRIMARY KEY
phrase          TEXT NOT NULL
category        VARCHAR(100)
severity        VARCHAR(20)
created_at      TIMESTAMP
```

#### diagnostic_codes
```sql
id              SERIAL PRIMARY KEY
code            VARCHAR(10) UNIQUE
description     TEXT
system          VARCHAR(100)
severity        VARCHAR(20)
created_at      TIMESTAMP
```

#### components
```sql
id                  SERIAL PRIMARY KEY
name                VARCHAR(200)
category            VARCHAR(100)
typical_cost_min    DECIMAL(10,2)
typical_cost_max    DECIMAL(10,2)
created_at          TIMESTAMP
```

#### solutions
```sql
id                  SERIAL PRIMARY KEY
title               VARCHAR(300)
description         TEXT
difficulty          VARCHAR(50)
estimated_time      VARCHAR(100)
estimated_cost_min  DECIMAL(10,2)
estimated_cost_max  DECIMAL(10,2)
confidence_score    DECIMAL(3,2)
created_at          TIMESTAMP
```

#### fault_patterns
```sql
id                      SERIAL PRIMARY KEY
symptom_id              INTEGER REFERENCES symptoms(id)
diagnostic_code_id      INTEGER REFERENCES diagnostic_codes(id)
component_id            INTEGER REFERENCES components(id)
solution_id             INTEGER REFERENCES solutions(id)
correlation_strength    DECIMAL(3,2)
occurrence_count        INTEGER
created_at              TIMESTAMP
```

#### user_sessions
```sql
id                  UUID PRIMARY KEY
user_id             VARCHAR(100)
vehicle_info        JSONB
conversation_state  JSONB
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### conversation_history
```sql
id              SERIAL PRIMARY KEY
session_id      UUID REFERENCES user_sessions(id)
role            VARCHAR(20)
message         TEXT
metadata        JSONB
created_at      TIMESTAMP
```

#### vehicle_snapshots
```sql
id              SERIAL PRIMARY KEY
session_id      UUID REFERENCES user_sessions(id)
obd_data        JSONB
timestamp       TIMESTAMP
```

### Indexes

```sql
CREATE INDEX idx_conversation_session ON conversation_history(session_id);
CREATE INDEX idx_vehicle_snapshots_session ON vehicle_snapshots(session_id);
CREATE INDEX idx_diagnostic_codes_code ON diagnostic_codes(code);
```

## API Design

### RESTful Principles

- **Resource-based URLs:** `/api/conversation/session`
- **HTTP Methods:** GET, POST, DELETE
- **JSON Responses:** Consistent format
- **Error Handling:** Standard HTTP codes

### WebSocket Events

**Client → Server:**
```json
{
  "type": "subscribe",
  "sessionId": "uuid"
}
```

**Server → Client:**
```json
{
  "type": "diagnosis",
  "data": { ... }
}
```

## Data Flow

### Diagnostic Request Flow

```
1. User sends message
   ↓
2. Frontend → POST /api/conversation/message
   ↓
3. Backend receives request
   ↓
4. Save user message to database
   ↓
5. Diagnostic Engine analyzes:
   - User input text
   - OBD data (if provided)
   - Conversation history
   ↓
6. Query database for:
   - Matching symptoms
   - Related DTC codes
   - Component info
   - Solution details
   ↓
7. Generate response with:
   - Diagnosis
   - Confidence score
   - Follow-up questions
   - Cost estimates
   ↓
8. Save assistant response
   ↓
9. Broadcast via WebSocket (if connected)
   ↓
10. Return JSON response to frontend
   ↓
11. Frontend displays diagnosis
```

## Security Considerations

### Current (Phase 1)
- CORS protection
- Helmet.js security headers
- Input validation with Joi
- SQL injection prevention (parameterized queries)

### Future (Phase 2)
- JWT authentication
- Rate limiting
- API key management
- Data encryption at rest
- HTTPS enforcement
- User role-based access control

## Scalability

### Current Architecture
- Single server deployment
- Direct database connections
- In-memory session state

### Future Improvements
- Load balancer
- Redis for session storage
- Database read replicas
- Microservices architecture
- Message queue (RabbitMQ/Kafka)
- CDN for static assets

## Performance Optimization

### Database
- Indexed foreign keys
- Query optimization
- Connection pooling

### API
- Response caching (future)
- Pagination for large datasets
- Lazy loading

### Frontend
- Code splitting
- Asset optimization
- Virtual scrolling for long lists

## Monitoring & Logging

### Current
- Console logging
- Morgan HTTP logger

### Future
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Analytics dashboard
- Health check endpoints
- Metrics collection

## Testing Strategy

### Unit Tests
- Service layer logic
- Diagnostic engine rules
- OBD simulator

### Integration Tests
- API endpoints
- Database operations
- WebSocket connections

### End-to-End Tests
- Complete diagnostic flows
- User journeys

## Deployment Architecture

### Development
```
localhost:5173 (Frontend)
localhost:3000 (Backend)
localhost:5432 (PostgreSQL)
```

### Production (Future)
```
CDN → Frontend (Static)
Load Balancer → Backend Servers
Database Cluster (Primary + Replicas)
Redis Cache
```

## Future Enhancements

### Phase 2
- AI/ML model integration
- Real OBD-II dongle support
- Voice interface
- Mobile apps (iOS/Android)
- Human expert escalation

### Phase 3
- Image recognition (damage assessment)
- AR visualization
- Repair shop integration
- Parts marketplace
- Community features

## Contributing

See architecture decisions in:
- `/docs/decisions/` (future)
- GitHub Issues for proposals
