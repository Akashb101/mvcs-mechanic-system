require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const WebSocket = require('ws');
const conversationRoutes = require('./routes/conversation');
const diagnosticRoutes = require('./routes/diagnostic');
const vehicleRoutes = require('./routes/vehicle');
const { initializeDatabase } = require('./database/init');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/conversation', conversationRoutes);
app.use('/api/diagnostic', diagnosticRoutes);
app.use('/api/vehicle', vehicleRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// WebSocket connection for real-time updates
wss.on('connection', (ws) => {
  console.log('🔌 Client connected via WebSocket');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received:', data);
      
      // Handle different message types
      if (data.type === 'subscribe') {
        ws.sessionId = data.sessionId;
        ws.send(JSON.stringify({ type: 'subscribed', sessionId: data.sessionId }));
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Broadcast function for real-time updates
global.broadcast = (sessionId, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.sessionId === sessionId) {
      client.send(JSON.stringify(data));
    }
  });
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log('🚗 ========================================');
      console.log('🚗 MVCS Backend Server Started');
      console.log('🚗 ========================================');
      console.log(`📡 HTTP Server: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log('🚗 ========================================');
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
