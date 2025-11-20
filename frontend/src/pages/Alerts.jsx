import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Button, Badge, LoadingSpinner, Alert } from '../components/Common'
import { alertAPI } from '../utils/api'

const Alerts = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({
    slack_webhook_url: '',
    slack_enabled: false,
    email_recipients: '',
    email_enabled: false,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await alertAPI.getSettings()
      setSettings(res.data)
      
      // Initialize form data
      const slackConfig = res.data.slack?.config_json || {}
      const emailConfig = res.data.email?.config_json || {}
      
      setFormData({
        slack_webhook_url: slackConfig.webhook_url || '',
        slack_enabled: res.data.slack?.enabled || false,
        email_recipients: emailConfig.recipients?.join(', ') || '',
        email_enabled: res.data.email?.enabled || false,
      })
      
      setLoading(false)
    } catch (err) {
      setError('Failed to load alert settings')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Save Slack settings
      if (formData.slack_webhook_url) {
        await alertAPI.updateSettings({
          alert_type: 'slack',
          enabled: formData.slack_enabled,
          config: { webhook_url: formData.slack_webhook_url },
        })
      }

      // Save Email settings
      if (formData.email_recipients) {
        const recipients = formData.email_recipients
          .split(',')
          .map((r) => r.trim())
          .filter((r) => r)

        await alertAPI.updateSettings({
          alert_type: 'email',
          enabled: formData.email_enabled,
          config: { recipients },
        })
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await loadSettings()
    } catch (err) {
      setError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleTestAlert = async (alertType) => {
    try {
      await alertAPI.test(alertType)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(`Failed to send test ${alertType} alert`)
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
        title="Alert Configuration"
        subtitle="Configure Slack and Email notifications for honeyfile events"
      />

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message="Settings updated successfully! ✓" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Slack Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💬</span>
            <h3 className="text-xl font-bold cyber-text">Slack Notifications</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="slack_enabled"
                  checked={formData.slack_enabled}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span>Enable Slack Alerts</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Webhook URL</label>
              <input
                type="text"
                name="slack_webhook_url"
                value={formData.slack_webhook_url}
                onChange={handleChange}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-2 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                Get your webhook URL from Slack App Integrations
              </p>
            </div>

            <div className="bg-dark-bg/50 p-4 rounded-lg border border-dark-border">
              <p className="text-sm font-semibold mb-2 text-cyber-green">Sample Webhook:</p>
              <code className="text-xs text-gray-400 break-all">
                https://hooks.slack.com/services/YOUR/WEBHOOK/URL
              </code>
            </div>

            <Button
              onClick={() => handleTestAlert('slack')}
              variant="secondary"
              className="w-full"
              disabled={!formData.slack_webhook_url}
            >
              Test Slack Connection
            </Button>
          </div>
        </Card>

        {/* Email Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📧</span>
            <h3 className="text-xl font-bold cyber-text">Email Notifications</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="email_enabled"
                  checked={formData.email_enabled}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span>Enable Email Alerts</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Recipient Email Addresses
              </label>
              <textarea
                name="email_recipients"
                value={formData.email_recipients}
                onChange={handleChange}
                placeholder="admin@company.com, security@company.com"
                rows="4"
                className="w-full px-4 py-2 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                Separate multiple addresses with commas
              </p>
            </div>

            <div className="bg-dark-bg/50 p-4 rounded-lg border border-dark-border">
              <p className="text-sm font-semibold mb-2 text-cyber-green">SMTP Configuration:</p>
              <p className="text-xs text-gray-400 space-y-1">
                <div>Server: smtp.gmail.com</div>
                <div>Port: 587</div>
                <div>Configure via environment variables</div>
              </p>
            </div>

            <Button
              onClick={() => handleTestAlert('email')}
              variant="secondary"
              className="w-full"
              disabled={!formData.email_recipients}
            >
              Test Email Connection
            </Button>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end gap-4">
        <Button
          onClick={handleSaveSettings}
          loading={loading}
          className="px-8"
        >
          Save All Settings
        </Button>
      </div>

      {/* Integration Info */}
      <Card className="mt-8">
        <h3 className="text-lg font-bold mb-4 cyber-text">Integration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-cyber-blue">Slack Integration</h4>
            <p className="text-sm text-gray-400 mb-3">
              Send real-time alerts to your Slack channel when honeyfiles are accessed.
            </p>
            <ul className="text-xs text-gray-400 space-y-1 ml-4">
              <li>✓ Instant notifications</li>
              <li>✓ Rich formatting with forensics</li>
              <li>✓ Severity indicators</li>
              <li>✓ Clickable forensic details</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-cyber-green">Email Integration</h4>
            <p className="text-sm text-gray-400 mb-3">
              Send detailed email reports of honeyfile access events to your security team.
            </p>
            <ul className="text-xs text-gray-400 space-y-1 ml-4">
              <li>✓ Comprehensive event details</li>
              <li>✓ HTML formatted emails</li>
              <li>✓ Full forensic context</li>
              <li>✓ Multi-recipient support</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Alerts
