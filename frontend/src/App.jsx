import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Pages
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import Monitoring from './pages/Monitoring'
import Timeline from './pages/Timeline'
import Alerts from './pages/Alerts'
import Logs from './pages/Logs'
import Testing from './pages/Testing'
import FileSharing from './pages/FileSharing'

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Generator', path: '/generator', icon: '🍯' },
    { name: 'File Sharing', path: '/file-sharing', icon: '📁' },
    { name: 'Monitoring', path: '/monitoring', icon: '📡' },
    { name: 'Timeline', path: '/timeline', icon: '⏱️' },
    { name: 'Alerts', path: '/alerts', icon: '🚨' },
    { name: 'Logs', path: '/logs', icon: '📋' },
    { name: 'Testing', path: '/testing', icon: '🧪' },
  ]

  return (
    <Router>
      <div className="flex h-screen bg-dark-bg text-gray-100">
        {/* Sidebar */}
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: sidebarOpen ? 280 : 80, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-dark border-r border-dark-border overflow-hidden flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-dark-border">
            <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-lg gradient-header flex items-center justify-center text-white font-bold text-lg">
                🧬
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg cyber-text">DecoyDNA</h1>
                  <p className="text-xs text-gray-400">Enterprise v1.0</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="group relative"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:glass transition-all"
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </motion.div>

                {!sidebarOpen && (
                  <div className="absolute left-20 bg-dark-card px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-dark-border">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full py-2 px-4 rounded-lg hover:glass transition-all text-sm"
            >
              {sidebarOpen ? '◀ Collapse' : '▶'}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Top Bar */}
          <div className="glass-dark border-b border-dark-border sticky top-0 z-40 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-2xl hover:text-cyber-blue transition-colors"
              >
                ☰
              </button>
              <div>
                <p className="text-sm text-gray-400">Welcome to DecoyDNA</p>
                <p className="font-bold cyber-text">Enterprise Honeyfile System</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                <span className="animate-pulse-glow w-2 h-2 rounded-full bg-cyber-green"></span>
                <span className="text-sm">System Online</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-green flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform">
                👤
              </div>
            </div>
          </div>

          {/* Page Content */}
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-full"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/file-sharing" element={<FileSharing />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/testing" element={<Testing />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </Router>
  )
}

export default App
