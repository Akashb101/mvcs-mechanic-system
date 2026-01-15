const express = require('express');
const router = express.Router();
const obdSimulator = require('../services/obdSimulator');

// Get available simulation profiles
router.get('/profiles', (req, res) => {
  const profiles = obdSimulator.getAllProfiles();
  res.json({ success: true, profiles });
});

// Get profile details
router.get('/profiles/:profileName', (req, res) => {
  try {
    const { profileName } = req.params;
    const profile = obdSimulator.getProfileDetails(profileName);
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get simulated OBD data
router.get('/obd/:profile?', (req, res) => {
  try {
    const { profile = 'healthy' } = req.params;
    const data = obdSimulator.getProfile(profile);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
