import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl font-bold text-brand-500 mb-3">404</p>
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        The page you're looking for doesn't exist or got moved.
      </p>
      <Link to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium transition-colors">
        <Home size={16} /> Back home
      </Link>
    </div>
  )
}
