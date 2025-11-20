import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Button, Badge, Alert } from '../components/Common'
import { honeyfileAPI, eventAPI } from '../utils/api'

const Testing = () => {
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const addResult = (name, status, message, details = null) => {
    setTestResults((prev) => [
      {
        id: Date.now(),
        name,
        status, // 'pass', 'fail', 'warning'
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ])
  }

  // Test 1: Create Honeyfile
  const testCreateHoneyfile = async () => {
    setLoading(true)
    try {
      const response = await honeyfileAPI.create({
        file_name: `test_honeypot_${Date.now()}.docx`,
        file_type: 'docx',
        template_type: 'passwords',
        seed_locations: ['~/Documents'],
      })

      setSelectedFile(response.data)
      addResult(
        'Create Honeyfile',
        'pass',
        `✓ Honeyfile created successfully`,
        {
          decoy_id: response.data.decoy_id,
          file_name: response.data.file_name,
          file_path: response.data.file_path,
        }
      )
    } catch (err) {
      addResult(
        'Create Honeyfile',
        'fail',
        `✗ Failed: ${err.response?.data?.detail || err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 2: List Honeyfiles
  const testListHoneyfiles = async () => {
    setLoading(true)
    try {
      const response = await honeyfileAPI.list(0, 100)
      addResult(
        'List Honeyfiles',
        'pass',
        `✓ Retrieved ${response.data.length} honeyfiles`,
        {
          count: response.data.length,
          files: response.data.slice(0, 3).map((f) => ({
            name: f.file_name,
            id: f.decoy_id.substring(0, 16) + '...',
          })),
        }
      )
    } catch (err) {
      addResult(
        'List Honeyfiles',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 3: Get Honeyfile by ID
  const testGetHoneyfile = async () => {
    if (!selectedFile) {
      addResult(
        'Get Honeyfile by ID',
        'warning',
        '⚠ No file selected. Create a file first.',
        null
      )
      return
    }

    setLoading(true)
    try {
      const response = await honeyfileAPI.get(selectedFile.decoy_id)
      addResult(
        'Get Honeyfile by ID',
        'pass',
        `✓ Retrieved honeyfile by Decoy ID`,
        {
          decoy_id: response.data.decoy_id.substring(0, 20) + '...',
          file_name: response.data.file_name,
          created_at: new Date(response.data.created_at).toLocaleString(),
        }
      )
    } catch (err) {
      addResult(
        'Get Honeyfile by ID',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 4: Search Honeyfiles
  const testSearchHoneyfiles = async () => {
    if (!selectedFile) {
      addResult(
        'Search Honeyfiles',
        'warning',
        '⚠ No file selected. Create a file first.',
        null
      )
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/honeyfiles/search/${selectedFile.decoy_id.substring(0, 10)}?search_type=decoy_id`
      )
      const data = await response.json()

      addResult(
        'Search Honeyfiles',
        data.length > 0 ? 'pass' : 'warning',
        `✓ Search found ${data.length} results`,
        {
          query: selectedFile.decoy_id.substring(0, 10),
          results: data.length,
        }
      )
    } catch (err) {
      addResult(
        'Search Honeyfiles',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 5: Get Dashboard Stats
  const testDashboardStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/dashboard/stats')
      const data = await response.json()

      addResult(
        'Dashboard Stats',
        'pass',
        `✓ Retrieved dashboard statistics`,
        {
          total_honeyfiles: data.total_honeyfiles,
          total_events: data.total_events,
          alerts_today: data.alerts_today,
          monitoring_status: data.monitoring_status ? '✓ Active' : '✗ Inactive',
        }
      )
    } catch (err) {
      addResult(
        'Dashboard Stats',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 6: Get Event Logs
  const testEventLogs = async () => {
    setLoading(true)
    try {
      const response = await eventAPI.getLogs(0, 100, null, 24)
      addResult(
        'Event Logs',
        'pass',
        `✓ Retrieved ${response.data.length} access events`,
        {
          count: response.data.length,
          timeRange: 'Last 24 hours',
        }
      )
    } catch (err) {
      addResult(
        'Event Logs',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 7: Get Event Count
  const testEventCount = async () => {
    setLoading(true)
    try {
      const response = await eventAPI.getCount()
      addResult(
        'Event Count',
        'pass',
        `✓ Total events: ${response.data.count}`,
        {
          count: response.data.count,
        }
      )
    } catch (err) {
      addResult(
        'Event Count',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 8: Get Monitoring Status
  const testMonitoringStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/monitor/status')
      const data = await response.json()

      addResult(
        'Monitoring Status',
        'pass',
        `✓ Monitoring ${data.is_running ? 'ACTIVE' : 'INACTIVE'}`,
        {
          is_running: data.is_running ? '✓ Yes' : '✗ No',
          started_at: data.started_at || 'Not started',
          total_events: data.total_events,
          error_count: data.error_count,
        }
      )
    } catch (err) {
      addResult(
        'Monitoring Status',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 9: Start Monitoring
  const testStartMonitoring = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/monitor/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await response.json()

      addResult(
        'Start Monitoring',
        'pass',
        `✓ Monitoring started successfully`,
        {
          status: data.is_running ? '✓ Running' : '✗ Not running',
        }
      )
    } catch (err) {
      addResult(
        'Start Monitoring',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 10: Stop Monitoring
  const testStopMonitoring = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/monitor/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await response.json()

      addResult(
        'Stop Monitoring',
        'pass',
        `✓ Monitoring stopped successfully`,
        {
          status: data.is_running ? '✓ Still running' : '✗ Stopped',
        }
      )
    } catch (err) {
      addResult(
        'Stop Monitoring',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 11: Alert Settings
  const testAlertSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/alerts/settings', {
        method: 'GET',
      })
      const data = await response.json()

      addResult(
        'Alert Settings',
        'pass',
        `✓ Retrieved alert settings`,
        {
          slack_enabled: data.slack_enabled ? '✓ Yes' : '✗ No',
          email_enabled: data.email_enabled ? '✓ Yes' : '✗ No',
        }
      )
    } catch (err) {
      addResult(
        'Alert Settings',
        'fail',
        `✗ Failed: ${err.message}`,
        { error: err.message }
      )
    } finally {
      setLoading(false)
    }
  }

  // Test 12: Run All Tests
  const runAllTests = async () => {
    setTestResults([])
    setLoading(true)

    const tests = [
      { name: 'Create Honeyfile', fn: testCreateHoneyfile },
      { name: 'List Honeyfiles', fn: testListHoneyfiles },
      { name: 'Dashboard Stats', fn: testDashboardStats },
      { name: 'Event Logs', fn: testEventLogs },
      { name: 'Event Count', fn: testEventCount },
      { name: 'Monitoring Status', fn: testMonitoringStatus },
      { name: 'Alert Settings', fn: testAlertSettings },
    ]

    for (const test of tests) {
      await test.fn()
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setLoading(false)
  }

  const passCount = testResults.filter((r) => r.status === 'pass').length
  const failCount = testResults.filter((r) => r.status === 'fail').length
  const warningCount = testResults.filter((r) => r.status === 'warning').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <Header
        title="API Testing Console"
        subtitle="Test all backend functions and generate events for verification"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <Card className="bg-green-500/10 border-green-500/30">
          <p className="text-3xl font-bold text-green-400">{passCount}</p>
          <p className="text-sm text-gray-400">Tests Passed</p>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <p className="text-3xl font-bold text-red-400">{failCount}</p>
          <p className="text-sm text-gray-400">Tests Failed</p>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <p className="text-3xl font-bold text-yellow-400">{warningCount}</p>
          <p className="text-sm text-gray-400">Warnings</p>
        </Card>
        <Card className="bg-cyber-blue/10 border-cyber-blue/30">
          <p className="text-3xl font-bold text-cyber-blue">{testResults.length}</p>
          <p className="text-sm text-gray-400">Total Tests</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Buttons */}
        <Card className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-6 cyber-text">Available Tests</h3>

          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testCreateHoneyfile}
              disabled={loading}
              className="w-full px-4 py-3 bg-cyber-green/20 hover:bg-cyber-green/40 border border-cyber-green rounded text-sm font-semibold text-cyber-green disabled:opacity-50"
            >
              ✓ Create Honeyfile
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testListHoneyfiles}
              disabled={loading}
              className="w-full px-4 py-3 bg-cyber-blue/20 hover:bg-cyber-blue/40 border border-cyber-blue rounded text-sm font-semibold text-cyber-blue disabled:opacity-50"
            >
              ✓ List Honeyfiles
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testGetHoneyfile}
              disabled={loading}
              className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500 rounded text-sm font-semibold text-purple-300 disabled:opacity-50"
            >
              ✓ Get Honeyfile by ID
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testSearchHoneyfiles}
              disabled={loading}
              className="w-full px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500 rounded text-sm font-semibold text-cyan-300 disabled:opacity-50"
            >
              ✓ Search Honeyfiles
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testDashboardStats}
              disabled={loading}
              className="w-full px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500 rounded text-sm font-semibold text-yellow-300 disabled:opacity-50"
            >
              ✓ Dashboard Stats
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testEventLogs}
              disabled={loading}
              className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500 rounded text-sm font-semibold text-orange-300 disabled:opacity-50"
            >
              ✓ Event Logs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testEventCount}
              disabled={loading}
              className="w-full px-4 py-3 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500 rounded text-sm font-semibold text-pink-300 disabled:opacity-50"
            >
              ✓ Event Count
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testMonitoringStatus}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/40 border border-red-500 rounded text-sm font-semibold text-red-300 disabled:opacity-50"
            >
              ✓ Monitoring Status
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testStartMonitoring}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600/20 hover:bg-green-600/40 border border-green-600 rounded text-sm font-semibold text-green-300 disabled:opacity-50"
            >
              ▶ Start Monitoring
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testStopMonitoring}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-700/20 hover:bg-red-700/40 border border-red-700 rounded text-sm font-semibold text-red-400 disabled:opacity-50"
            >
              ⏹ Stop Monitoring
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={testAlertSettings}
              disabled={loading}
              className="w-full px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500 rounded text-sm font-semibold text-indigo-300 disabled:opacity-50"
            >
              ✓ Alert Settings
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAllTests}
            disabled={loading}
            className="w-full px-4 py-4 bg-gradient-to-r from-cyber-green to-cyber-blue rounded font-bold text-white disabled:opacity-50"
          >
            {loading ? '⏳ Running Tests...' : '▶ RUN ALL TESTS'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTestResults([])}
            className="w-full mt-2 px-4 py-2 bg-dark-bg border border-dark-border rounded text-xs font-semibold text-gray-300 hover:bg-dark-border transition-all"
          >
            🗑 Clear Results
          </motion.button>
        </Card>

        {/* Test Results */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 cyber-text">Test Results ({testResults.length})</h3>

          {testResults.length > 0 ? (
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {testResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border transition-all ${
                    result.status === 'pass'
                      ? 'bg-green-500/10 border-green-500/30'
                      : result.status === 'fail'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.timestamp}</p>
                    </div>
                    <Badge
                      color={
                        result.status === 'pass'
                          ? 'green'
                          : result.status === 'fail'
                          ? 'red'
                          : 'yellow'
                      }
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-200 mb-2">{result.message}</p>

                  {result.details && (
                    <div className="bg-black/30 p-3 rounded text-xs font-mono text-gray-300 space-y-1">
                      {Object.entries(result.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-cyber-green">{key}:</span>
                          {typeof value === 'object' ? (
                            <pre className="text-gray-400 overflow-auto">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-gray-400"> {String(value)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">🧪</p>
              <p>No tests run yet</p>
              <p className="text-xs">Click a test button to start testing the API</p>
            </div>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-8 bg-cyber-blue/10 border-cyber-blue/30">
        <h3 className="text-lg font-bold mb-4 text-cyber-blue">📖 Testing Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <p className="font-semibold text-cyber-green mb-2">✓ Honeyfile Tests:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>1. Create Honeyfile - Generate new decoy file</li>
              <li>2. List Honeyfiles - Get all created files</li>
              <li>3. Get by ID - Retrieve specific file</li>
              <li>4. Search - Find files by partial ID</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-cyber-green mb-2">✓ Event Tests:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>1. Event Logs - View access events</li>
              <li>2. Event Count - Get total count</li>
              <li>3. Dashboard - View statistics</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-cyber-green mb-2">✓ Monitoring Tests:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>1. Monitoring Status - Check if active</li>
              <li>2. Start Monitoring - Activate monitoring</li>
              <li>3. Stop Monitoring - Deactivate monitoring</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-cyber-green mb-2">✓ Alert Tests:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>1. Alert Settings - Get configuration</li>
              <li>2. Configure - Set Slack/Email</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-cyber-blue/30">
          <p className="font-semibold text-yellow-400 mb-2">⚡ Quick Start:</p>
          <ol className="text-xs text-gray-400 space-y-1">
            <li>1. Click "Create Honeyfile" to generate a test file</li>
            <li>2. Click "Run All Tests" to test all functions</li>
            <li>3. Check "Dashboard Stats" to verify files were created</li>
            <li>4. Click "Start Monitoring" to activate file monitoring</li>
            <li>5. Open the created honeyfile to trigger an access event</li>
            <li>6. Click "Event Logs" to see the triggered event</li>
          </ol>
        </div>
      </Card>
    </motion.div>
  )
}

export default Testing
