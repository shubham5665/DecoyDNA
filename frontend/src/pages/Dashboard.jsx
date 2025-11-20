import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Header, Card, StatCard, LoadingSpinner, Alert } from '../components/Common'
import { dashboardAPI, eventAPI, monitoringAPI } from '../utils/api'
import { useWebSocket } from '../utils/helpers'
import useStore from '../utils/store'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [eventData, setEventData] = useState([])
  const stats = useStore((state) => state.stats)
  const events = useStore((state) => state.events)
  const setStats = useStore((state) => state.setStats)
  const addEvent = useStore((state) => state.addEvent)

  useEffect(() => {
    const loadData = async () => {
      // Fetch stats and events separately with retries so one failure doesn't block the whole page
      const fetchWithRetry = async (fn, attempts = 3, delay = 300) => {
        let lastErr = null
        for (let i = 0; i < attempts; i++) {
          try {
            return await fn()
          } catch (e) {
            lastErr = e
            await new Promise((r) => setTimeout(r, delay * (i + 1)))
          }
        }
        throw lastErr
      }

      try {
        const statsRes = await fetchWithRetry(() => dashboardAPI.getStats())
        setStats(statsRes.data)
      } catch (e) {
        setError((prev) => (prev ? prev + '; failed to load stats' : 'Failed to load stats'))
      }

      try {
        const eventsRes = await fetchWithRetry(() => eventAPI.getLogs(0, 20))
        setEventData(eventsRes.data)
      } catch (e) {
        setError((prev) => (prev ? prev + '; failed to load events' : 'Failed to load events'))
      }

      setLoading(false)
    }

    loadData()

    // WebSocket connection
    const { connect } = useWebSocket((data) => {
      addEvent(data.data)
    })
    const ws = connect()

    return () => {
      ws?.close()
    }
  }, [setStats, addEvent])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <Header
        title="Dashboard"
        subtitle="Real-time security monitoring and forensic analysis"
      />

      {error && <Alert type="error" message={error} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Honeyfiles"
          value={stats.total_honeyfiles || 0}
          icon="🍯"
        />
        <StatCard
          label="Total Events"
          value={stats.total_events || 0}
          icon="📊"
        />
        <StatCard
          label="Alerts Today"
          value={stats.alerts_today || 0}
          icon="🚨"
          trend={5}
        />
        <StatCard
          label="Last Hour Events"
          value={stats.events_last_hour || 0}
          icon="⏱️"
        />
      </div>

      {/* Monitoring Status */}
      <Card className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 cyber-text">Monitoring Status</h3>
            <p className="text-gray-400">
              {stats.monitoring_status ? (
                <span className="text-cyber-green flex items-center gap-2">
                  <span className="animate-pulse-glow w-3 h-3 rounded-full bg-cyber-green"></span>
                  Live Monitoring Active
                </span>
              ) : (
                <span className="text-yellow-400 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  Monitoring Inactive
                </span>
              )}
            </p>
          </div>
          <motion.div
            animate={{ rotate: stats.monitoring_status ? 360 : 0 }}
            transition={{ duration: 3, repeat: stats.monitoring_status ? Infinity : 0 }}
            className="text-4xl"
          >
            📡
          </motion.div>
        </div>
      </Card>

      {/* Events and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 cyber-text">Recent Access Events</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {eventData.length > 0 ? (
              eventData.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded bg-dark-bg/50 border border-dark-border hover:border-cyber-blue transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-cyber-blue/20 flex items-center justify-center text-cyber-blue font-bold">
                    {event.event_type?.[0].toUpperCase() || 'E'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{event.username}</p>
                    <p className="text-xs text-gray-400 truncate">{event.hostname} - {event.process_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-cyber-green font-mono">
                      {event.event_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No events detected</p>
            )}
          </div>
        </Card>

        {/* Event Type Distribution */}
        <Card>
          <h3 className="text-xl font-bold mb-4 cyber-text">Event Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Modified</span>
                <span className="text-sm font-bold text-cyber-blue">45%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div className="bg-cyber-blue h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Accessed</span>
                <span className="text-sm font-bold text-cyber-green">35%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div className="bg-cyber-green h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Executed</span>
                <span className="text-sm font-bold text-red-400">20%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard
