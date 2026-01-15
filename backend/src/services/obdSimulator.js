/**
 * OBD-II Data Simulator
 * Generates realistic vehicle data for testing
 */

class OBDSimulator {
  constructor() {
    this.profiles = this.initializeProfiles();
  }

  initializeProfiles() {
    return {
      healthy: {
        name: 'Healthy Vehicle',
        description: 'All systems operating normally',
        voltage: 12.6,
        rpm: 800,
        coolantTemp: 90,
        engineLoad: 15,
        fuelPressure: 55,
        intakeTemp: 25,
        maf: 3.5,
        throttlePosition: 0,
        o2Voltage: 0.45,
        speed: 0,
        dtcCodes: []
      },
      deadBattery: {
        name: 'Dead Battery',
        description: 'Battery voltage critically low',
        voltage: 10.8,
        rpm: 0,
        coolantTemp: 20,
        engineLoad: 0,
        fuelPressure: 0,
        intakeTemp: 20,
        maf: 0,
        throttlePosition: 0,
        o2Voltage: 0,
        speed: 0,
        dtcCodes: []
      },
      misfire: {
        name: 'Engine Misfire',
        description: 'Multiple cylinder misfire detected',
        voltage: 12.4,
        rpm: 650,
        coolantTemp: 88,
        engineLoad: 20,
        fuelPressure: 52,
        intakeTemp: 28,
        maf: 2.8,
        throttlePosition: 0,
        o2Voltage: 0.52,
        speed: 0,
        dtcCodes: ['P0300', 'P0301']
      },
      o2Sensor: {
        name: 'Faulty O2 Sensor',
        description: 'Oxygen sensor reading abnormal',
        voltage: 12.5,
        rpm: 820,
        coolantTemp: 92,
        engineLoad: 18,
        fuelPressure: 54,
        intakeTemp: 26,
        maf: 3.2,
        throttlePosition: 0,
        o2Voltage: 0.95, // Abnormally high
        speed: 0,
        dtcCodes: ['P0420']
      },
      overheating: {
        name: 'Overheating Engine',
        description: 'Coolant temperature too high',
        voltage: 12.3,
        rpm: 900,
        coolantTemp: 115, // Too high
        engineLoad: 25,
        fuelPressure: 53,
        intakeTemp: 35,
        maf: 4.1,
        throttlePosition: 5,
        o2Voltage: 0.48,
        speed: 0,
        dtcCodes: ['P0128']
      },
      driving: {
        name: 'Normal Driving',
        description: 'Vehicle in motion, normal operation',
        voltage: 13.8, // Alternator charging
        rpm: 2500,
        coolantTemp: 92,
        engineLoad: 45,
        fuelPressure: 58,
        intakeTemp: 30,
        maf: 12.5,
        throttlePosition: 35,
        o2Voltage: 0.42,
        speed: 60,
        dtcCodes: []
      }
    };
  }

  getProfile(profileName = 'healthy') {
    const profile = this.profiles[profileName] || this.profiles.healthy;
    return this.addVariation(profile);
  }

  addVariation(profile) {
    // Add small random variations to make data more realistic
    const varied = { ...profile };
    
    varied.voltage += (Math.random() - 0.5) * 0.2;
    varied.rpm += Math.floor((Math.random() - 0.5) * 50);
    varied.coolantTemp += Math.floor((Math.random() - 0.5) * 3);
    varied.engineLoad += Math.floor((Math.random() - 0.5) * 5);
    varied.o2Voltage += (Math.random() - 0.5) * 0.05;
    varied.maf += (Math.random() - 0.5) * 0.3;

    // Ensure values stay within realistic bounds
    varied.voltage = Math.max(0, Math.min(15, varied.voltage));
    varied.rpm = Math.max(0, varied.rpm);
    varied.coolantTemp = Math.max(-20, Math.min(130, varied.coolantTemp));
    varied.o2Voltage = Math.max(0, Math.min(1, varied.o2Voltage));

    return varied;
  }

  streamData(profileName, callback, interval = 1000) {
    const stream = setInterval(() => {
      const data = this.getProfile(profileName);
      callback(data);
    }, interval);

    return stream; // Return interval ID for cleanup
  }

  stopStream(streamId) {
    clearInterval(streamId);
  }

  getAllProfiles() {
    return Object.keys(this.profiles).map(key => ({
      id: key,
      name: this.profiles[key].name,
      description: this.profiles[key].description
    }));
  }

  getProfileDetails(profileName) {
    return this.profiles[profileName] || null;
  }
}

module.exports = new OBDSimulator();
