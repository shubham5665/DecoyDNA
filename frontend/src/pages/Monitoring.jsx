import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Button, Badge, LoadingSpinner, Alert } from '../components/Common'
import { monitoringAPI, honeyfileAPI } from '../utils/api'

const Monitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadMonitoringStatus()
    const interval = setInterval(loadMonitoringStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadMonitoringStatus = async () => {
    try {
      const res = await monitoringAPI.getStatus()
      setIsMonitoring(res.data.is_running)
      setStats(res.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load monitoring status')
      setLoading(false)
    }
  }

  const handleStartMonitoring = async () => {
    setLoading(true)
    try {
      const honeyfilesRes = await honeyfileAPI.list()
      const directories = honeyfilesRes.data.length > 0
        ? Array.from(new Set(honeyfilesRes.data.flatMap((h) => h.seed_locations || [])))
        : null

      await monitoringAPI.start(directories)
      setIsMonitoring(true)
      setError(null)
    } catch (err) {
      setError('Failed to start monitoring')
    } finally {
      setLoading(false)
    }
  }

  const handleStopMonitoring = async () => {
    setLoading(true)
    try {
      await monitoringAPI.stop()
      setIsMonitoring(false)
      setError(null)
    } catch (err) {
      setError('Failed to stop monitoring')
    } finally {
      setLoading(false)
    }
  }

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
        title="File Monitoring"
        subtitle="Real-time detection of honeyfile access and manipulation"
      />

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monitoring Control */}
        <Card glow={isMonitoring}>
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: isMonitoring ? 360 : 0 }}
              transition={{ duration: 3, repeat: isMonitoring ? Infinity : 0 }}
              className="text-6xl mb-6"
            >
              📡
            </motion.div>

            <h3 className="text-2xl font-bold mb-2 cyber-text">Monitoring Engine</h3>
            <p className="text-gray-400 mb-8">
              {isMonitoring ? (
                <span className="text-cyber-green flex items-center justify-center gap-2">
                  <span className="animate-pulse-glow w-3 h-3 rounded-full bg-cyber-green"></span>
                  ACTIVELY MONITORING
                </span>
              ) : (
                <span className="text-yellow-400">IDLE</span>
              )}
            </p>

            {stats && (
              <div className="mb-8 space-y-3 text-left bg-dark-bg/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-400">Honeyfiles Tracked:</span>
                  <span className="font-bold text-cyber-blue">{stats.total_events || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Watched Directories:</span>
                  <span className="font-bold text-cyber-green">
                    {stats.engine_status?.watched_directories?.length || 0}
                  </span>
                </div>
                {stats.started_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Started At:</span>
                    <span className="font-bold text-cyber-purple text-xs">
                      {new Date(stats.started_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {!isMonitoring ? (
                <Button
                  onClick={handleStartMonitoring}
                  loading={loading}
                  className="w-full"
                >
                  Start Monitoring
                </Button>
              ) : (
                <Button
                  onClick={handleStopMonitoring}
                  variant="danger"
                  loading={loading}
                  className="w-full"
                >
                  Stop Monitoring
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Monitoring Info */}
        <Card>
          <h3 className="text-xl font-bold mb-6 cyber-text">System Information</h3>

          <div className="space-y-6">
            {/* Watchdog */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Watchdog Engine</p>
                <Badge color="green">Active</Badge>
              </div>
              <p className="text-sm text-gray-400">
                Monitoring file system events in real-time using Python watchdog library
              </p>
            </div>

            {/* Forensics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Forensic Collection</p>
                <Badge color="blue">Enabled</Badge>
              </div>
              <ul className="text-sm text-gray-400 space-y-1 ml-4">
                <li>✓ Timestamp & event type</li>
                <li>✓ Username & hostname</li>
                <li>✓ Process information</li>
                <li>✓ IP addresses & MAC</li>
                <li>✓ File hash verification</li>
              </ul>
            </div>

            {/* Alerts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Alert System</p>
                <Badge color="purple">Enabled</Badge>
              </div>
              <p className="text-sm text-gray-400">
                Sends instant notifications to Slack and Email when honeyfiles are accessed
              </p>
            </div>

            {/* Database */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Event Database</p>
                <Badge color="green">SQLite</Badge>
              </div>
              <p className="text-sm text-gray-400">
                All access events and forensic data are stored in local SQLite database
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Monitoring
