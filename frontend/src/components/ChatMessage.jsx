import { User, Bot, CheckCircle, AlertCircle } from 'lucide-react'

export default function ChatMessage({ message, onQuestionClick }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-4 rounded-lg ${
            isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="whitespace-pre-wrap">{message.message}</p>

            {/* Diagnosis Info */}
            {message.diagnosis && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Diagnosis</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Issue:</strong> {message.diagnosis.issue}</p>
                  <p><strong>Confidence:</strong> {Math.round(message.diagnosis.confidence * 100)}%</p>
                  {message.diagnosis.component && (
                    <p><strong>Component:</strong> {message.diagnosis.component.name}</p>
                  )}
                </div>
              </div>
            )}

            {/* Alternative Diagnoses */}
            {message.alternatives && message.alternatives.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-sm font-semibold mb-2">Other Possibilities:</p>
                <ul className="text-sm space-y-1">
                  {message.alternatives.map((alt, idx) => (
                    <li key={idx}>
                      • {alt.issue} ({Math.round(alt.confidence * 100)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions */}
            {message.questions && message.questions.length > 0 && (
              <div className="mt-4 space-y-2">
                {message.questions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQuestionClick(question)}
                    className="block w-full text-left p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-500 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}
