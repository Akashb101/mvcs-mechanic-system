const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = `
-- Symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id SERIAL PRIMARY KEY,
  phrase TEXT NOT NULL,
  category VARCHAR(100),
  severity VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diagnostic codes (OBD-II DTCs)
CREATE TABLE IF NOT EXISTS diagnostic_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  system VARCHAR(100),
  severity VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Components (car parts)
CREATE TABLE IF NOT EXISTS components (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  typical_cost_min DECIMAL(10,2),
  typical_cost_max DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Solutions (repair procedures)
CREATE TABLE IF NOT EXISTS solutions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  estimated_time VARCHAR(100),
  estimated_cost_min DECIMAL(10,2),
  estimated_cost_max DECIMAL(10,2),
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fault patterns (AI learning data)
CREATE TABLE IF NOT EXISTS fault_patterns (
  id SERIAL PRIMARY KEY,
  symptom_id INTEGER REFERENCES symptoms(id),
  diagnostic_code_id INTEGER REFERENCES diagnostic_codes(id),
  component_id INTEGER REFERENCES components(id),
  solution_id INTEGER REFERENCES solutions(id),
  correlation_strength DECIMAL(3,2),
  occurrence_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY,
  user_id VARCHAR(100),
  vehicle_info JSONB,
  conversation_state JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation history
CREATE TABLE IF NOT EXISTS conversation_history (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES user_sessions(id),
  role VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle data snapshots
CREATE TABLE IF NOT EXISTS vehicle_snapshots (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES user_sessions(id),
  obd_data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversation_session ON conversation_history(session_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_snapshots_session ON vehicle_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_codes_code ON diagnostic_codes(code);
`;

const seedData = `
-- Seed common symptoms
INSERT INTO symptoms (phrase, category, severity) VALUES
('car won''t start', 'starting', 'critical'),
('clicking noise when starting', 'starting', 'high'),
('engine misfiring', 'engine', 'high'),
('check engine light on', 'warning', 'medium'),
('rough idle', 'engine', 'medium'),
('battery light on', 'electrical', 'high'),
('overheating', 'cooling', 'critical'),
('poor acceleration', 'performance', 'medium'),
('grinding noise', 'mechanical', 'high'),
('smoke from exhaust', 'engine', 'critical')
ON CONFLICT DO NOTHING;

-- Seed common diagnostic codes
INSERT INTO diagnostic_codes (code, description, system, severity) VALUES
('P0300', 'Random/Multiple Cylinder Misfire Detected', 'Engine', 'high'),
('P0420', 'Catalyst System Efficiency Below Threshold', 'Emissions', 'medium'),
('P0171', 'System Too Lean (Bank 1)', 'Fuel', 'medium'),
('P0128', 'Coolant Thermostat Temperature Below Regulating Temperature', 'Cooling', 'low'),
('P0455', 'Evaporative Emission System Leak Detected (Large Leak)', 'Emissions', 'low'),
('P0301', 'Cylinder 1 Misfire Detected', 'Engine', 'high'),
('P0302', 'Cylinder 2 Misfire Detected', 'Engine', 'high'),
('P0303', 'Cylinder 3 Misfire Detected', 'Engine', 'high'),
('P0304', 'Cylinder 4 Misfire Detected', 'Engine', 'high'),
('P0401', 'Exhaust Gas Recirculation Flow Insufficient', 'Emissions', 'medium')
ON CONFLICT DO NOTHING;

-- Seed common components
INSERT INTO components (name, category, typical_cost_min, typical_cost_max) VALUES
('Battery', 'Electrical', 100.00, 300.00),
('Starter Motor', 'Electrical', 200.00, 600.00),
('Alternator', 'Electrical', 300.00, 800.00),
('Spark Plugs', 'Ignition', 50.00, 200.00),
('Ignition Coil', 'Ignition', 150.00, 400.00),
('Fuel Pump', 'Fuel System', 400.00, 1000.00),
('Oxygen Sensor', 'Emissions', 100.00, 300.00),
('Catalytic Converter', 'Emissions', 800.00, 2500.00),
('Thermostat', 'Cooling', 50.00, 150.00),
('Water Pump', 'Cooling', 200.00, 500.00)
ON CONFLICT DO NOTHING;

-- Seed common solutions
INSERT INTO solutions (title, description, difficulty, estimated_time, estimated_cost_min, estimated_cost_max, confidence_score) VALUES
('Replace Battery', 'Battery voltage is low. Replace with new battery matching vehicle specifications.', 'Easy', '30 minutes', 100.00, 300.00, 0.85),
('Test and Replace Starter', 'Starter motor may be failing. Test current draw and replace if necessary.', 'Moderate', '1-2 hours', 200.00, 600.00, 0.75),
('Replace Spark Plugs', 'Worn spark plugs causing misfire. Replace all plugs and inspect ignition coils.', 'Easy', '1 hour', 50.00, 200.00, 0.80),
('Diagnose Ignition System', 'Check ignition coils, spark plugs, and wiring for faults.', 'Moderate', '1-2 hours', 150.00, 500.00, 0.70),
('Replace Oxygen Sensor', 'Faulty O2 sensor affecting fuel mixture. Replace sensor and clear codes.', 'Moderate', '1 hour', 100.00, 300.00, 0.75),
('Replace Catalytic Converter', 'Catalytic converter efficiency below threshold. Replacement required.', 'Difficult', '2-3 hours', 800.00, 2500.00, 0.65),
('Replace Thermostat', 'Engine not reaching operating temperature. Replace thermostat.', 'Moderate', '1-2 hours', 50.00, 150.00, 0.80),
('Inspect Cooling System', 'Check for leaks, test radiator cap, inspect hoses and water pump.', 'Moderate', '1 hour', 100.00, 500.00, 0.70)
ON CONFLICT DO NOTHING;
`;

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database...');
    await pool.query(schema);
    console.log('✅ Schema created successfully');
    
    await pool.query(seedData);
    console.log('✅ Seed data inserted successfully');
    
    return pool;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

module.exports = { pool, initializeDatabase };
