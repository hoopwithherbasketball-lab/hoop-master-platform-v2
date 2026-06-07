import { Link } from 'react-router-dom'
import { PageShell } from '@hoop-master/ui'
import { motion } from 'framer-motion'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <PageShell title="Page Not Found" description="">
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-navy-800 p-8 rounded-2xl shadow-2xl border border-white/10 text-center relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FB6C1D]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0134BD]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6"
            >
              <AlertCircle size={40} className="text-red-400" />
            </motion.div>

            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">404</h1>
            <h2 className="text-xl font-bold text-slate-200 mb-4">Out of Bounds!</h2>
            
            <p className="text-slate-400 mb-8 leading-relaxed">
              It looks like the page you're looking for was intercepted or doesn't exist anymore. Let's get you back on the court.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="flex items-center justify-center gap-2 bg-[#0134BD] hover:bg-[#002a80] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                <Home size={18} />
                Return Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  )
}
