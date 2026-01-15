import { Link } from 'react-router-dom'
import { MessageSquare, Zap, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your AI-Powered <span className="text-primary-600">Mechanic Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Diagnose vehicle problems instantly through natural conversation. 
            Get expert repair guidance, cost estimates, and step-by-step solutions.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/chat" className="btn-primary text-lg px-8 py-3">
              Start Diagnosis
            </Link>
            <Link to="/dashboard" className="btn-secondary text-lg px-8 py-3">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How MVCS Helps You
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-primary-600" />}
            title="Conversational Diagnosis"
            description="Describe your car's symptoms in plain English. Our AI understands and asks the right questions."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary-600" />}
            title="Instant Results"
            description="Get diagnostic results in seconds with confidence scores and multiple solution options."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary-600" />}
            title="Accurate Estimates"
            description="Receive realistic cost estimates for parts and labor based on your specific issue."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-primary-600" />}
            title="OBD-II Integration"
            description="Connect your OBD-II dongle for real-time vehicle data and advanced diagnostics."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Describe the Problem"
              description="Tell us what's wrong with your vehicle in your own words."
            />
            <StepCard
              number="2"
              title="Answer Questions"
              description="Our AI asks targeted questions to narrow down the issue."
            />
            <StepCard
              number="3"
              title="Get Solutions"
              description="Receive detailed repair solutions with cost estimates and difficulty ratings."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to diagnose your vehicle?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Start a conversation with our AI mechanic assistant now.
        </p>
        <Link to="/chat" className="btn-primary text-lg px-8 py-3">
          Start Free Diagnosis
        </Link>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
