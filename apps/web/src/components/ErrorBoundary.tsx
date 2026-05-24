import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) { return { error } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-navy-800 rounded-xl border border-white/10 p-8">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong</h2>
            <pre className="text-sm text-red-400 bg-white/5 p-4 rounded-lg overflow-auto max-h-60 mb-4">
              {this.state.error.message || String(this.state.error)}
            </pre>
            <p className="text-slate-400 text-sm mb-4">Component stack:</p>
            <pre className="text-xs text-slate-400 bg-white/5 p-4 rounded-lg overflow-auto max-h-40">
              {this.state.error.stack}
            </pre>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}