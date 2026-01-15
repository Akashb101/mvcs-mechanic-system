import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import api from '../services/api'
import ChatMessage from '../components/ChatMessage'
import VehicleDataPanel from '../components/VehicleDataPanel'

export default function Chat() {
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [vehicleData, setVehicleData] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    initializeSession()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeSession = async () => {
    try {
      const response = await api.createSession({
        userId: 'user_' + Date.now(),
        vehicleInfo: {
          make: 'Unknown',
          model: 'Unknown',
          year: new Date().getFullYear()
        }
      })
      setSessionId(response.sessionId)
      setMessages([{
        role: 'assistant',
        message: response.message,
        timestamp: new Date()
      }])
    } catch (err) {
      setError('Failed to initialize session. Please refresh the page.')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !sessionId || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, {
      role: 'user',
      message: userMessage,
      timestamp: new Date()
    }])

    setLoading(true)
    setError(null)

    try {
      const response = await api.sendMessage(sessionId, userMessage, vehicleData)
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: response.message,
        questions: response.questions,
        diagnosis: response.diagnosis,
        alternatives: response.alternatives,
        timestamp: new Date()
      }])
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuestionClick = (question) => {
    setInput(question)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <div className="lg:col-span-2">
          <div className="card h-[calc(100vh-200px)] flex flex-col">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Diagnostic Chat</h2>
              <p className="text-gray-600">Describe your vehicle's symptoms</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg, idx) => (
                <ChatMessage 
                  key={idx} 
                  message={msg} 
                  onQuestionClick={handleQuestionClick}
                />
              ))}
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  <span className="ml-2 text-gray-600">Analyzing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the problem... (e.g., 'My car won't start and makes clicking noises')"
                className="input resize-none"
                rows="2"
                disabled={loading || !sessionId}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim() || !sessionId}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Data Panel */}
        <div className="lg:col-span-1">
          <VehicleDataPanel 
            vehicleData={vehicleData}
            onDataChange={setVehicleData}
          />
        </div>
      </div>
    </div>
  )
}
