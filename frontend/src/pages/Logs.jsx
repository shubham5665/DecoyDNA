import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Badge, LoadingSpinner, Alert } from '../components/Common'
import { eventAPI } from '../utils/api'
import { formatDate } from '../utils/helpers'

const Logs = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [filters, setFilters] = useState({
    decoy_id: '',
    event_type: 'all',
    hours: 24,
  })
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    loadLogs()
  }, [filters])

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

  const loadLogs = async () => {
    try {
      setLoading(true)
      const res = await fetchWithRetry(() =>
        eventAPI.getLogs(
          0,
          200,
          filters.decoy_id || null,
          filters.hours
        )
      )
      
      let filtered = res.data
      if (filters.event_type !== 'all') {
        filtered = filtered.filter((e) => e.event_type === filters.event_type)
      }
      
      setEvents(filtered)
      setLoading(false)
      setError(null)
    } catch (err) {
      setError('Failed to load logs')
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
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
        title="Event Logs"
        subtitle="Detailed view of all honeyfile access and manipulation events"
      />

      {error && <Alert type="error" message={error} />}

      {/* Filters */}
      <Card className="mb-8">
        <h3 className="text-lg font-bold mb-4 cyber-text">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Decoy ID</label>
            <input
              type="text"
              name="decoy_id"
              value={filters.decoy_id}
              onChange={handleFilterChange}
              placeholder="Search by decoy ID"
              className="w-full px-4 py-2 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Event Type</label>
            <select
              name="event_type"
              value={filters.event_type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg text-sm"
            >
              <option value="all">All Events</option>
              <option value="modified">Modified</option>
              <option value="accessed">Accessed</option>
              <option value="moved">Moved</option>
              <option value="created">Created</option>
              <option value="open">Opened</option>
              <option value="execute">Executed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Time Range</label>
            <select
              name="hours"
              value={filters.hours}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg text-sm"
            >
              <option value="1">Last Hour</option>
              <option value="6">Last 6 Hours</option>
              <option value="24">Last 24 Hours</option>
              <option value="168">Last Week</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <h3 className="text-lg font-bold mb-4 cyber-text">
          Event Logs ({events.length})
        </h3>

        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 font-semibold text-cyber-blue">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold text-cyber-blue">Event Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-cyber-blue">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-cyber-blue">Hostname</th>
                  <th className="text-left py-3 px-4 font-semibold text-cyber-blue">Process</th>
                  <th className="text-center py-3 px-4 font-semibold text-cyber-blue">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <React.Fragment key={event.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === event.id ? null : event.id)
                      }
                    >
                      <td className="py-3 px-4">
                        <span className="text-cyber-green text-xs">
                          {formatDate(event.timestamp)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          color={
                            event.event_type === 'accessed'
                              ? 'blue'
                              : event.event_type === 'modified'
                                ? 'red'
                                : 'purple'
                          }
                          size="sm"
                        >
                          {event.event_type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{event.username}</td>
                      <td className="py-3 px-4 font-mono text-xs">{event.hostname}</td>
                      <td className="py-3 px-4 text-xs truncate">
                        {event.process_name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-cyber-blue hover:text-cyber-green transition-colors text-lg">
                          {expandedId === event.id ? '▼' : '▶'}
                        </button>
                      </td>
                    </motion.tr>

                    {/* Expanded Row */}
                    {expandedId === event.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-dark-bg/50"
                      >
                        <td colSpan="6" className="py-4 px-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Decoy ID</p>
                              <p className="font-mono text-xs text-cyber-blue truncate">
                                {event.decoy_id}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Internal IP</p>
                              <p className="font-mono text-xs text-cyber-green">
                                {event.internal_ip || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">MAC Address</p>
                              <p className="font-mono text-xs text-cyber-green">
                                {event.mac_address || 'N/A'}
                              </p>
                            </div>
                            <div className="md:col-span-3">
                              <p className="text-gray-400 text-xs">Accessed Path</p>
                              <p className="font-mono text-xs text-gray-300 break-all">
                                {event.accessed_path}
                              </p>
                            </div>
                            <div className="md:col-span-3">
                              <p className="text-gray-400 text-xs">Command Line</p>
                              <p className="font-mono text-xs text-gray-300 break-all">
                                {event.process_command || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">📭</p>
            <p>No matching events found</p>
            <p className="text-xs mt-2">Try adjusting your filters</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Logs
