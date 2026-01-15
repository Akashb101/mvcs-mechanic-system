/**
 * Conversation State Manager
 * Manages multi-turn conversations and context
 */

const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/init');

class ConversationManager {
  async createSession(userId, vehicleInfo = {}) {
    const sessionId = uuidv4();
    const conversationState = {
      stage: 'initial',
      collectedInfo: {},
      pendingQuestions: [],
      diagnosisHistory: []
    };

    await pool.query(
      `INSERT INTO user_sessions (id, user_id, vehicle_info, conversation_state) 
       VALUES ($1, $2, $3, $4)`,
      [sessionId, userId, JSON.stringify(vehicleInfo), JSON.stringify(conversationState)]
    );

    return sessionId;
  }

  async getSession(sessionId) {
    const result = await pool.query(
      'SELECT * FROM user_sessions WHERE id = $1',
      [sessionId]
    );
    return result.rows[0];
  }

  async updateSession(sessionId, updates) {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const updatedState = {
      ...session.conversation_state,
      ...updates
    };

    await pool.query(
      `UPDATE user_sessions 
       SET conversation_state = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [JSON.stringify(updatedState), sessionId]
    );

    return updatedState;
  }

  async addMessage(sessionId, role, message, metadata = {}) {
    await pool.query(
      `INSERT INTO conversation_history (session_id, role, message, metadata) 
       VALUES ($1, $2, $3, $4)`,
      [sessionId, role, message, JSON.stringify(metadata)]
    );
  }

  async getHistory(sessionId, limit = 10) {
    const result = await pool.query(
      `SELECT * FROM conversation_history 
       WHERE session_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [sessionId, limit]
    );
    return result.rows.reverse();
  }

  async saveVehicleSnapshot(sessionId, obdData) {
    await pool.query(
      `INSERT INTO vehicle_snapshots (session_id, obd_data) 
       VALUES ($1, $2)`,
      [sessionId, JSON.stringify(obdData)]
    );
  }

  async getVehicleSnapshots(sessionId, limit = 10) {
    const result = await pool.query(
      `SELECT * FROM vehicle_snapshots 
       WHERE session_id = $1 
       ORDER BY timestamp DESC 
       LIMIT $2`,
      [sessionId, limit]
    );
    return result.rows;
  }

  async deleteSession(sessionId) {
    await pool.query('DELETE FROM user_sessions WHERE id = $1', [sessionId]);
  }
}

module.exports = new ConversationManager();
