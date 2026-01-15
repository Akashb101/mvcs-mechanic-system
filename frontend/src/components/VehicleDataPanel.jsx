import { useState, useEffect } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import api from '../services/api'

export default function VehicleDataPanel({ vehicleData, onDataChange }) {
  const [profiles, setProfiles] = useState([])
  const [selectedProfile, setSelectedProfile] = useState('healthy')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const data = await api.getVehicleProfiles()
      setProfiles(data.profiles)
    } catch (error) {
      console.error('Failed to load profiles:', error)
    }
  }

  const loadVehicleData = async () => {
    setLoading(true)
    try {
      const data = await api.getVehicleData(selectedProfile)
      onDataChange(data.data)
    } catch (error) {
      console.error('Failed to load vehicle data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Vehicle Data</h2>
        <Activity className="h-6 w-6 text-primary-600" />
      </div>

      {/* Profile Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Simulation Profile
        </label>
        <select
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
          className="input"
        >
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={loadVehicleData}
        disabled={loading}
        className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Loading...' : 'Load Simulated Data'}
      </button>

      {/* Vehicle Data Display */}
      {vehicleData && (
        <div className="space-y-3">
          <DataRow label="Voltage" value={`${vehicleData.voltage?.toFixed(1)}V`} />
          <DataRow label="RPM" value={vehicleData.rpm} />
          <DataRow label="Coolant Temp" value={`${vehicleData.coolantTemp}°C`} />
          <DataRow label="Engine Load" value={`${vehicleData.engineLoad}%`} />
          <DataRow label="O2 Voltage" value={`${vehicleData.o2Voltage?.toFixed(2)}V`} />
          
          {vehicleData.dtcCodes && vehicleData.dtcCodes.length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">DTC Codes:</p>
              <div className="space-y-1">
                {vehicleData.dtcCodes.map((code, idx) => (
                  <div key={idx} className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!vehicleData && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>No vehicle data loaded</p>
          <p className="mt-1">Select a profile and click "Load Simulated Data"</p>
        </div>
      )}
    </div>
  )
}

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
