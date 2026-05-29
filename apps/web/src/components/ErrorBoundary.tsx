import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-semibold text-white mb-1">Something went wrong</h3>
            <p className="text-sm text-slate-400 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }} className="flex items-center gap-1.5 mx-auto px-4 py-2 bg-[#0134BD] text-white rounded-lg text-sm font-medium hover:bg-[#002a80]">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
