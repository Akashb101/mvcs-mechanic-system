import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, DollarSign, Wrench } from 'lucide-react'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDiagnoses: 0,
    commonIssues: [],
    avgCost: 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vehicle Health Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Activity className="h-8 w-8 text-blue-600" />}
          title="System Status"
          value="Healthy"
          color="blue"
        />
        <StatCard
          icon={<AlertTriangle className="h-8 w-8 text-yellow-600" />}
          title="Active Warnings"
          value="0"
          color="yellow"
        />
        <StatCard
          icon={<Wrench className="h-8 w-8 text-green-600" />}
          title="Completed Repairs"
          value="0"
          color="green"
        />
        <StatCard
          icon={<DollarSign className="h-8 w-8 text-purple-600" />}
          title="Est. Savings"
          value="$0"
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Diagnostics</h2>
          <div className="space-y-3">
            <EmptyState message="No diagnostics yet. Start a conversation to diagnose your vehicle." />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Common Issues</h2>
          <div className="space-y-3">
            <IssueItem issue="Dead Battery" count={0} />
            <IssueItem issue="Engine Misfire" count={0} />
            <IssueItem issue="O2 Sensor Fault" count={0} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200'
  }

  return (
    <div className={`card border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  )
}

function IssueItem({ issue, count }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-700">{issue}</span>
      <span className="text-sm font-medium text-gray-500">{count} occurrences</span>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>{message}</p>
    </div>
  )
}
