/**
 * Rule-Based Diagnostic Engine
 * This will be replaced with AI/ML models in Phase 2
 */

const { pool } = require('../database/init');

class DiagnosticEngine {
  constructor() {
    this.rules = this.initializeRules();
  }

  initializeRules() {
    return [
      {
        id: 'dead_battery',
        conditions: {
          symptoms: ['won\'t start', 'clicking', 'no crank', 'dead'],
          obdData: { voltage: { max: 11.5 } }
        },
        diagnosis: {
          issue: 'Dead or Weak Battery',
          confidence: 0.85,
          componentId: 1, // Battery
          solutionId: 1,  // Replace Battery
          questions: [
            'Do you hear a clicking sound when you turn the key?',
            'Are your headlights dim or not working?',
            'How old is your battery?'
          ]
        }
      },
      {
        id: 'bad_starter',
        conditions: {
          symptoms: ['won\'t start', 'clicking', 'grinding'],
          obdData: { voltage: { min: 12.0 } }
        },
        diagnosis: {
          issue: 'Faulty Starter Motor',
          confidence: 0.75,
          componentId: 2, // Starter Motor
          solutionId: 2,  // Test and Replace Starter
          questions: [
            'Does the engine make a grinding noise?',
            'Do the lights stay bright when you try to start?'
          ]
        }
      },
      {
        id: 'misfire_p0300',
        conditions: {
          symptoms: ['misfire', 'rough', 'shaking', 'jerking'],
          dtcCodes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304']
        },
        diagnosis: {
          issue: 'Engine Misfire',
          confidence: 0.80,
          componentId: 4, // Spark Plugs
          solutionId: 3,  // Replace Spark Plugs
          questions: [
            'Is the check engine light flashing?',
            'When was the last time you replaced spark plugs?',
            'Does the engine shake at idle?'
          ]
        }
      },
      {
        id: 'o2_sensor',
        conditions: {
          dtcCodes: ['P0420', 'P0430'],
          symptoms: ['poor fuel economy', 'check engine']
        },
        diagnosis: {
          issue: 'Oxygen Sensor or Catalytic Converter Issue',
          confidence: 0.70,
          componentId: 7, // Oxygen Sensor
          solutionId: 5,  // Replace Oxygen Sensor
          questions: [
            'Have you noticed decreased fuel economy?',
            'Does the car have reduced power?'
          ]
        }
      },
      {
        id: 'overheating',
        conditions: {
          symptoms: ['overheating', 'hot', 'temperature', 'steam'],
          obdData: { coolantTemp: { min: 110 } }
        },
        diagnosis: {
          issue: 'Engine Overheating',
          confidence: 0.75,
          componentId: 9, // Thermostat
          solutionId: 8,  // Inspect Cooling System
          questions: [
            'Is the temperature gauge in the red zone?',
            'Do you see steam coming from under the hood?',
            'When did you last check coolant level?'
          ]
        }
      }
    ];
  }

  async diagnose(userInput, obdData = null, conversationHistory = []) {
    const normalizedInput = userInput.toLowerCase();
    const matchedRules = [];

    // Match rules based on symptoms and OBD data
    for (const rule of this.rules) {
      let score = 0;
      let maxScore = 0;

      // Check symptom keywords
      if (rule.conditions.symptoms) {
        maxScore += rule.conditions.symptoms.length;
        for (const symptom of rule.conditions.symptoms) {
          if (normalizedInput.includes(symptom)) {
            score++;
          }
        }
      }

      // Check DTC codes
      if (rule.conditions.dtcCodes && obdData?.dtcCodes) {
        maxScore += rule.conditions.dtcCodes.length;
        for (const code of rule.conditions.dtcCodes) {
          if (obdData.dtcCodes.includes(code)) {
            score += 2; // DTC matches are weighted higher
          }
        }
      }

      // Check OBD parameters
      if (rule.conditions.obdData && obdData) {
        for (const [param, range] of Object.entries(rule.conditions.obdData)) {
          if (obdData[param] !== undefined) {
            maxScore++;
            if (range.min && obdData[param] >= range.min) score++;
            if (range.max && obdData[param] <= range.max) score++;
          }
        }
      }

      if (maxScore > 0) {
        const matchConfidence = score / maxScore;
        if (matchConfidence > 0.3) { // Threshold for consideration
          matchedRules.push({
            ...rule.diagnosis,
            matchConfidence,
            adjustedConfidence: rule.diagnosis.confidence * matchConfidence
          });
        }
      }
    }

    // Sort by adjusted confidence
    matchedRules.sort((a, b) => b.adjustedConfidence - a.adjustedConfidence);

    // Get detailed information from database
    const topMatch = matchedRules[0];
    if (topMatch) {
      const details = await this.getDetailedDiagnosis(topMatch);
      return {
        success: true,
        diagnosis: details,
        alternativeDiagnoses: matchedRules.slice(1, 3).map(r => ({
          issue: r.issue,
          confidence: r.adjustedConfidence
        }))
      };
    }

    // No match found - ask clarifying questions
    return {
      success: false,
      message: 'I need more information to diagnose the issue.',
      questions: [
        'Can you describe the symptoms in more detail?',
        'When does the problem occur?',
        'Are there any warning lights on the dashboard?'
      ]
    };
  }

  async getDetailedDiagnosis(match) {
    try {
      const componentQuery = await pool.query(
        'SELECT * FROM components WHERE id = $1',
        [match.componentId]
      );

      const solutionQuery = await pool.query(
        'SELECT * FROM solutions WHERE id = $1',
        [match.solutionId]
      );

      return {
        issue: match.issue,
        confidence: match.adjustedConfidence,
        component: componentQuery.rows[0],
        solution: solutionQuery.rows[0],
        nextQuestions: match.questions
      };
    } catch (error) {
      console.error('Error fetching detailed diagnosis:', error);
      return match;
    }
  }

  async getDTCInfo(code) {
    try {
      const result = await pool.query(
        'SELECT * FROM diagnostic_codes WHERE code = $1',
        [code]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching DTC info:', error);
      return null;
    }
  }
}

module.exports = new DiagnosticEngine();
