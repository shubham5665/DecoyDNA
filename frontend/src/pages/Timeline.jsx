import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Button, Badge, LoadingSpinner, Alert } from '../components/Common'
import { eventAPI } from '../utils/api'
import { useWebSocket, formatDate } from '../utils/helpers'
import useStore from '../utils/store'

const Timeline = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const addEvent = useStore((state) => state.addEvent)

  useEffect(() => {
    loadEvents()

    // WebSocket
    const { connect } = useWebSocket((data) => {
      setEvents((prev) => [data.data, ...prev].slice(0, 100))
      addEvent(data.data)
    })
    const ws = connect()

    // Reload events every 30 seconds
    const interval = setInterval(loadEvents, 30000)

    return () => {
      ws?.close()
      clearInterval(interval)
    }
  }, [addEvent])

  const loadEvents = async () => {
    try {
      const res = await eventAPI.getLogs(0, 100)
      setEvents(res.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load events')
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
        title="Forensic Timeline"
        subtitle="Chronological view of all detected honeyfile access events"
      />

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Timeline */}
        <Card className="lg:col-span-3">
          <h3 className="text-xl font-bold mb-6 cyber-text">Access Timeline</h3>

          {events.length > 0 ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-blue via-cyber-green to-cyber-purple"></div>

              {/* Events */}
              <div className="space-y-6 pl-20">
                {events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedEvent(event)}
                    className="cursor-pointer"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 w-12 h-12 bg-dark-bg rounded-full border-4 border-cyber-blue flex items-center justify-center text-xl hover:scale-110 transition-transform">
                      {getEventEmoji(event.event_type)}
                    </div>

                    {/* Event card */}
                    <div className="glass-dark p-4 rounded-lg hover:border-cyber-green transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-cyber-blue">{event.event_type.toUpperCase()}</p>
                          <p className="text-sm text-gray-400">{event.username} @ {event.hostname}</p>
                        </div>
                        <Badge color="blue">{event.process_name?.split('/')?.pop() || 'unknown'}</Badge>
                      </div>

                      <p className="text-xs text-gray-400 mb-2">
                        {formatDate(event.timestamp)}
                      </p>

                      <p className="text-xs text-gray-500 font-mono truncate">
                        {event.accessed_path}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">📭</p>
              <p>No events in timeline yet</p>
            </div>
          )}
        </Card>

        {/* Event Details */}
        <Card>
          <h3 className="text-xl font-bold mb-6 cyber-text">Event Details</h3>

          {selectedEvent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs text-gray-400 uppercase">Event Type</p>
                <p className="text-lg font-bold text-cyber-green">{selectedEvent.event_type}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Decoy ID</p>
                <p className="text-xs font-mono text-cyber-blue break-all">
                  {selectedEvent.decoy_id}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Username</p>
                <p className="font-semibold">{selectedEvent.username}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Hostname</p>
                <p className="font-semibold">{selectedEvent.hostname}</p>
              </div>

              {selectedEvent.internal_ip && (
                <div>
                  <p className="text-xs text-gray-400 uppercase">Internal IP</p>
                  <p className="font-mono text-cyber-blue">{selectedEvent.internal_ip}</p>
                </div>
              )}

              {selectedEvent.mac_address && (
                <div>
                  <p className="text-xs text-gray-400 uppercase">MAC Address</p>
                  <p className="font-mono text-cyber-blue">{selectedEvent.mac_address}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 uppercase">Process</p>
                <p className="font-mono text-sm break-all">{selectedEvent.process_name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Timestamp</p>
                <p className="text-xs">{formatDate(selectedEvent.timestamp)}</p>
              </div>

              <Button className="w-full mt-4">Export Forensics</Button>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">👁️</p>
              <p className="text-sm">Select an event to view details</p>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  )
}

const getEventEmoji = (eventType) => {
  const emojis = {
    modified: '✎',
    accessed: '👁️',
    moved: '→',
    created: '✚',
    open: '📂',
    execute: '▶️',
  }
  return emojis[eventType] || '●'
}

export default Timeline
