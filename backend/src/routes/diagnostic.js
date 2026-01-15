const express = require('express');
const router = express.Router();
const diagnosticEngine = require('../services/diagnosticEngine');
const { pool } = require('../database/init');

// Get all diagnostic codes
router.get('/codes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnostic_codes ORDER BY code');
    res.json({ success: true, codes: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get code details
router.get('/codes/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const codeInfo = await diagnosticEngine.getDTCInfo(code);
    
    if (!codeInfo) {
      return res.status(404).json({ success: false, error: 'Code not found' });
    }
    
    res.json({ success: true, code: codeInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all solutions
router.get('/solutions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM solutions ORDER BY confidence_score DESC'
    );
    res.json({ success: true, solutions: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all components
router.get('/components', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM components ORDER BY category, name'
    );
    res.json({ success: true, components: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all symptoms
router.get('/symptoms', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM symptoms ORDER BY severity DESC, category'
    );
    res.json({ success: true, symptoms: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
