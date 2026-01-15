import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Conversation endpoints
export const createSession = async (data) => {
  const response = await api.post('/conversation/session', data)
  return response.data
}

export const sendMessage = async (sessionId, message, obdData = null) => {
  const response = await api.post('/conversation/message', {
    sessionId,
    message,
    obdData
  })
  return response.data
}

export const getHistory = async (sessionId) => {
  const response = await api.get(`/conversation/history/${sessionId}`)
  return response.data
}

// Diagnostic endpoints
export const getDiagnosticCodes = async () => {
  const response = await api.get('/diagnostic/codes')
  return response.data
}

export const getCodeDetails = async (code) => {
  const response = await api.get(`/diagnostic/codes/${code}`)
  return response.data
}

export const getSolutions = async () => {
  const response = await api.get('/diagnostic/solutions')
  return response.data
}

// Vehicle endpoints
export const getVehicleProfiles = async () => {
  const response = await api.get('/vehicle/profiles')
  return response.data
}

export const getVehicleData = async (profile = 'healthy') => {
  const response = await api.get(`/vehicle/obd/${profile}`)
  return response.data
}

export default {
  createSession,
  sendMessage,
  getHistory,
  getDiagnosticCodes,
  getCodeDetails,
  getSolutions,
  getVehicleProfiles,
  getVehicleData
}
