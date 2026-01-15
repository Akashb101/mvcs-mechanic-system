import { Link } from 'react-router-dom'
import { Car, MessageSquare, LayoutDashboard } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MVCS</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/chat" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              <MessageSquare className="h-5 w-5 mr-1" />
              Diagnose
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
