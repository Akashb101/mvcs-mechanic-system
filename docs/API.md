# MVCS API Documentation

Complete API reference for the MVCS backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required (Phase 1). Authentication will be added in Phase 2.

---

## Conversation Endpoints

### Create Session

Create a new diagnostic conversation session.

**Endpoint:** `POST /conversation/session`

**Request Body:**
```json
{
  "userId": "user_123",
  "vehicleInfo": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2018
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Hi! I'm your virtual mechanic assistant. What seems to be the problem with your vehicle?"
}
```

---

### Send Message

Send a message and receive diagnostic response.

**Endpoint:** `POST /conversation/message`

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "My car won't start and makes clicking noises",
  "obdData": {
    "voltage": 10.8,
    "rpm": 0,
    "coolantTemp": 20,
    "dtcCodes": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on your description, it sounds like you might have a **Dead or Weak Battery** (85% confidence)...",
  "questions": [
    "Do you hear a clicking sound when you turn the key?",
    "Are your headlights dim or not working?",
    "How old is your battery?"
  ],
  "diagnosis": {
    "issue": "Dead or Weak Battery",
    "confidence": 0.85,
    "component": {
      "id": 1,
      "name": "Battery",
      "category": "Electrical",
      "typical_cost_min": 100.00,
      "typical_cost_max": 300.00
    },
    "solution": {
      "id": 1,
      "title": "Replace Battery",
      "description": "Battery voltage is low. Replace with new battery matching vehicle specifications.",
      "difficulty": "Easy",
      "estimated_time": "30 minutes",
      "estimated_cost_min": 100.00,
      "estimated_cost_max": 300.00,
      "confidence_score": 0.85
    },
    "nextQuestions": [...]
  },
  "alternatives": [
    {
      "issue": "Faulty Starter Motor",
      "confidence": 0.45
    }
  ]
}
```

---

### Get Conversation History

Retrieve conversation history for a session.

**Endpoint:** `GET /conversation/history/:sessionId`

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "role": "assistant",
      "message": "Hi! I'm your virtual mechanic assistant...",
      "metadata": {},
      "created_at": "2026-01-15T10:00:00Z"
    },
    {
      "id": 2,
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "role": "user",
      "message": "My car won't start",
      "metadata": {},
      "created_at": "2026-01-15T10:01:00Z"
    }
  ]
}
```

---

### Get Session Details

Get session information.

**Endpoint:** `GET /conversation/session/:sessionId`

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "user_123",
    "vehicle_info": {
      "make": "Toyota",
      "model": "Camry",
      "year": 2018
    },
    "conversation_state": {
      "stage": "diagnosis",
      "collectedInfo": {},
      "pendingQuestions": [],
      "diagnosisHistory": []
    },
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-01-15T10:05:00Z"
  }
}
```

---

### Delete Session

Delete a conversation session.

**Endpoint:** `DELETE /conversation/session/:sessionId`

**Response:**
```json
{
  "success": true,
  "message": "Session deleted"
}
```

---

## Diagnostic Endpoints

### Get All Diagnostic Codes

Retrieve all OBD-II diagnostic trouble codes.

**Endpoint:** `GET /diagnostic/codes`

**Response:**
```json
{
  "success": true,
  "codes": [
    {
      "id": 1,
      "code": "P0300",
      "description": "Random/Multiple Cylinder Misfire Detected",
      "system": "Engine",
      "severity": "high",
      "created_at": "2026-01-15T00:00:00Z"
    },
    {
      "id": 2,
      "code": "P0420",
      "description": "Catalyst System Efficiency Below Threshold",
      "system": "Emissions",
      "severity": "medium",
      "created_at": "2026-01-15T00:00:00Z"
    }
  ]
}
```

---

### Get Code Details

Get detailed information about a specific DTC code.

**Endpoint:** `GET /diagnostic/codes/:code`

**Example:** `GET /diagnostic/codes/P0300`

**Response:**
```json
{
  "success": true,
  "code": {
    "id": 1,
    "code": "P0300",
    "description": "Random/Multiple Cylinder Misfire Detected",
    "system": "Engine",
    "severity": "high",
    "created_at": "2026-01-15T00:00:00Z"
  }
}
```

---

### Get All Solutions

Retrieve all repair solutions.

**Endpoint:** `GET /diagnostic/solutions`

**Response:**
```json
{
  "success": true,
  "solutions": [
    {
      "id": 1,
      "title": "Replace Battery",
      "description": "Battery voltage is low. Replace with new battery matching vehicle specifications.",
      "difficulty": "Easy",
      "estimated_time": "30 minutes",
      "estimated_cost_min": 100.00,
      "estimated_cost_max": 300.00,
      "confidence_score": 0.85,
      "created_at": "2026-01-15T00:00:00Z"
    }
  ]
}
```

---

### Get All Components

Retrieve all vehicle components.

**Endpoint:** `GET /diagnostic/components`

**Response:**
```json
{
  "success": true,
  "components": [
    {
      "id": 1,
      "name": "Battery",
      "category": "Electrical",
      "typical_cost_min": 100.00,
      "typical_cost_max": 300.00,
      "created_at": "2026-01-15T00:00:00Z"
    }
  ]
}
```

---

### Get All Symptoms

Retrieve all known symptoms.

**Endpoint:** `GET /diagnostic/symptoms`

**Response:**
```json
{
  "success": true,
  "symptoms": [
    {
      "id": 1,
      "phrase": "car won't start",
      "category": "starting",
      "severity": "critical",
      "created_at": "2026-01-15T00:00:00Z"
    }
  ]
}
```

---

## Vehicle Endpoints

### Get Simulation Profiles

Get available OBD-II simulation profiles.

**Endpoint:** `GET /vehicle/profiles`

**Response:**
```json
{
  "success": true,
  "profiles": [
    {
      "id": "healthy",
      "name": "Healthy Vehicle",
      "description": "All systems operating normally"
    },
    {
      "id": "deadBattery",
      "name": "Dead Battery",
      "description": "Battery voltage critically low"
    },
    {
      "id": "misfire",
      "name": "Engine Misfire",
      "description": "Multiple cylinder misfire detected"
    },
    {
      "id": "o2Sensor",
      "name": "Faulty O2 Sensor",
      "description": "Oxygen sensor reading abnormal"
    },
    {
      "id": "overheating",
      "name": "Overheating Engine",
      "description": "Coolant temperature too high"
    },
    {
      "id": "driving",
      "name": "Normal Driving",
      "description": "Vehicle in motion, normal operation"
    }
  ]
}
```

---

### Get Profile Details

Get detailed information about a specific profile.

**Endpoint:** `GET /vehicle/profiles/:profileName`

**Example:** `GET /vehicle/profiles/deadBattery`

**Response:**
```json
{
  "success": true,
  "profile": {
    "name": "Dead Battery",
    "description": "Battery voltage critically low",
    "voltage": 10.8,
    "rpm": 0,
    "coolantTemp": 20,
    "engineLoad": 0,
    "fuelPressure": 0,
    "intakeTemp": 20,
    "maf": 0,
    "throttlePosition": 0,
    "o2Voltage": 0,
    "speed": 0,
    "dtcCodes": []
  }
}
```

---

### Get Simulated OBD Data

Get simulated OBD-II data for a profile.

**Endpoint:** `GET /vehicle/obd/:profile`

**Example:** `GET /vehicle/obd/misfire`

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Engine Misfire",
    "description": "Multiple cylinder misfire detected",
    "voltage": 12.38,
    "rpm": 645,
    "coolantTemp": 89,
    "engineLoad": 22,
    "fuelPressure": 51,
    "intakeTemp": 29,
    "maf": 2.75,
    "throttlePosition": 0,
    "o2Voltage": 0.53,
    "speed": 0,
    "dtcCodes": ["P0300", "P0301"]
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (missing parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## WebSocket API

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  // Subscribe to session updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    sessionId: 'your-session-id'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Message Types

**Subscribe:**
```json
{
  "type": "subscribe",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Diagnosis Update:**
```json
{
  "type": "diagnosis",
  "data": {
    "message": "...",
    "diagnosis": {...}
  }
}
```

---

## Rate Limiting

Currently no rate limiting (Phase 1). Will be added in Phase 2.

## Versioning

API version: `v1.0.0`

Future versions will use URL versioning: `/api/v2/...`
