const express = require('express');
const router = express.Router();
const conversationManager = require('../services/conversationManager');
const diagnosticEngine = require('../services/diagnosticEngine');

// Create new conversation session
router.post('/session', async (req, res) => {
  try {
    const { userId, vehicleInfo } = req.body;
    const sessionId = await conversationManager.createSession(userId, vehicleInfo);
    
    res.json({
      success: true,
      sessionId,
      message: 'Hi! I\'m your virtual mechanic assistant. What seems to be the problem with your vehicle?'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message and get response
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, obdData } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'sessionId and message are required' 
      });
    }
    
    // Save user message
    await conversationManager.addMessage(sessionId, 'user', message);
    
    // Get conversation history for context
    const history = await conversationManager.getHistory(sessionId);
    
    // Run diagnostic engine
    const diagnosis = await diagnosticEngine.diagnose(message, obdData, history);
    
    // Generate response
    let response;
    if (diagnosis.success) {
      const { issue, confidence, solution, component, nextQuestions } = diagnosis.diagnosis;
      
      response = {
        message: `Based on your description, it sounds like you might have a **${issue}** (${Math.round(confidence * 100)}% confidence).\n\n` +
                 `**Recommended Solution:** ${solution.title}\n` +
                 `**Estimated Cost:** $${solution.estimated_cost_min} - $${solution.estimated_cost_max}\n` +
                 `**Difficulty:** ${solution.difficulty}\n` +
                 `**Time:** ${solution.estimated_time}\n\n` +
                 `${solution.description}\n\n` +
                 `To confirm this diagnosis, can you answer these questions?`,
        questions: nextQuestions,
        diagnosis: diagnosis.diagnosis,
        alternatives: diagnosis.alternativeDiagnoses
      };
    } else {
      response = {
        message: diagnosis.message,
        questions: diagnosis.questions
      };
    }
    
    // Save assistant response
    await conversationManager.addMessage(sessionId, 'assistant', response.message, {
      diagnosis: diagnosis.success ? diagnosis.diagnosis : null
    });
    
    // Save OBD snapshot if provided
    if (obdData) {
      await conversationManager.saveVehicleSnapshot(sessionId, obdData);
    }
    
    // Broadcast to WebSocket clients
    if (global.broadcast) {
      global.broadcast(sessionId, {
        type: 'diagnosis',
        data: response
      });
    }
    
    res.json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await conversationManager.getHistory(sessionId, 50);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get session details
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await conversationManager.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete session
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await conversationManager.deleteSession(sessionId);
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
