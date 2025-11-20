import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Button, Badge, LoadingSpinner, Alert, ProgressBar, DataTable } from '../components/Common'
import axios from 'axios'

const FileSharing = () => {
  const [shares, setShares] = useState([])
  const [accessLogs, setAccessLogs] = useState([])
  const [selectedShare, setSelectedShare] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState('shares')
  const [formData, setFormData] = useState({
    share_name: '',
    share_path: '',
    description: '',
    is_sensitive: true,
    shared_with_users: '',
    shared_with_groups: ''
  })

  const API_BASE = 'http://127.0.0.1:8000/api'

  useEffect(() => {
    loadShares()
  }, [])

  const loadShares = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/file-shares/list`)
      setShares(res.data)
    } catch (err) {
      setError('Failed to load file shares')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadShareLogs = async (shareId) => {
    try {
      const res = await axios.get(`${API_BASE}/file-shares/${shareId}/access-logs`)
      setAccessLogs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateShare = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = {
        share_name: formData.share_name,
        share_path: formData.share_path,
        description: formData.description,
        is_sensitive: formData.is_sensitive,
        shared_with_users: formData.shared_with_users ? formData.shared_with_users.split(',').map(u => u.trim()) : [],
        shared_with_groups: formData.shared_with_groups ? formData.shared_with_groups.split(',').map(g => g.trim()) : []
      }

      await axios.post(`${API_BASE}/file-shares/create`, payload)
      setSuccess('File share created successfully!')
      setFormData({
        share_name: '',
        share_path: '',
        description: '',
        is_sensitive: true,
        shared_with_users: '',
        shared_with_groups: ''
      })
      loadShares()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create file share')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteShare = async (shareId) => {
    if (!window.confirm('Are you sure you want to delete this share?')) return

    try {
      await axios.delete(`${API_BASE}/file-shares/${shareId}`)
      setSuccess('File share deleted')
      loadShares()
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      setError('Failed to delete file share')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const columns = [
    { key: 'username', label: 'User' },
    { key: 'hostname', label: 'Host' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'access_type', label: 'Access Type', render: (val) => <Badge color={val === 'read' ? 'blue' : val === 'write' ? 'green' : 'red'}>{val}</Badge> },
    {
      key: 'accessed_at',
      label: 'Time',
      render: (val) => new Date(val).toLocaleString()
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-dark-bg min-h-screen"
    >
      <Header
        title="Network File Sharing"
        subtitle="Manage sensitive data shares with forensic monitoring"
      />

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 mb-8 border-b border-dark-border"
      >
        {[
          { id: 'shares', label: 'File Shares', icon: '📁' },
          { id: 'create', label: 'Create Share', icon: '➕' }
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === tab.id
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Create Share Form */}
      {activeTab === 'create' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-6 cyber-text">Create New File Share</h3>

            <form onSubmit={handleCreateShare} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Share Name</label>
                <input
                  type="text"
                  value={formData.share_name}
                  onChange={(e) => setFormData({ ...formData, share_name: e.target.value })}
                  placeholder="e.g., Financial Reports"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Network Path</label>
                <input
                  type="text"
                  value={formData.share_path}
                  onChange={(e) => setFormData({ ...formData, share_path: e.target.value })}
                  placeholder="e.g., \\\\server\\sensitive\\"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the shared content..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_sensitive}
                    onChange={(e) => setFormData({ ...formData, is_sensitive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-300">⚠️ Mark as Sensitive Data</span>
                </label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Shared With Users (comma-separated)</label>
                <input
                  type="text"
                  value={formData.shared_with_users}
                  onChange={(e) => setFormData({ ...formData, shared_with_users: e.target.value })}
                  placeholder="user1@domain.com, user2@domain.com"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Shared With Groups (comma-separated)</label>
                <input
                  type="text"
                  value={formData.shared_with_groups}
                  onChange={(e) => setFormData({ ...formData, shared_with_groups: e.target.value })}
                  placeholder="Finance Team, Executive Group"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" loading={loading} className="w-full" icon="🚀">
                  {loading ? 'Creating Share...' : 'Create File Share'}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* File Shares List */}
      {activeTab === 'shares' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <h3 className="text-2xl font-bold mb-6 cyber-text flex items-center gap-2">
              <span>📁</span> Network File Shares ({shares.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : shares.length > 0 ? (
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {shares.map((share, idx) => (
                  <motion.div
                    key={share.id}
                    variants={itemVariants}
                    className="p-5 bg-dark-bg/70 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="font-bold text-cyan-400 text-lg">{share.share_name}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">{share.share_path}</p>
                        {share.description && (
                          <p className="text-sm text-gray-400 mt-2">{share.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {share.is_sensitive && <Badge color="red">Sensitive</Badge>}
                        <Badge color="blue">
                          {share.access_count} accesses
                        </Badge>
                      </div>
                    </div>

                    <motion.div
                      className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-dark-border"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded border border-dark-border/50">
                        <p className="text-xs text-gray-400">Users</p>
                        <p className="text-cyan-400 font-semibold mt-1">{share.shared_with_users.length}</p>
                      </motion.div>
                      <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded border border-dark-border/50">
                        <p className="text-xs text-gray-400">Groups</p>
                        <p className="text-cyan-400 font-semibold mt-1">{share.shared_with_groups.length}</p>
                      </motion.div>
                      <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded border border-dark-border/50">
                        <p className="text-xs text-gray-400">Last Access</p>
                        <p className="text-cyan-400 font-semibold mt-1">
                          {share.last_accessed
                            ? new Date(share.last_accessed).toLocaleDateString()
                            : 'Never'}
                        </p>
                      </motion.div>
                    </motion.div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedShare(share)
                          loadShareLogs(share.id)
                        }}
                      >
                        📋 View Logs
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteShare(share.id)}
                      >
                        🗑️ Delete
                      </Button>
                    </div>

                    {selectedShare?.id === share.id && accessLogs.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-dark-border"
                      >
                        <p className="text-sm font-semibold text-gray-300 mb-3">Access Logs</p>
                        <div className="overflow-x-auto">
                          <DataTable columns={columns} data={accessLogs.slice(0, 10)} />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 text-gray-400"
              >
                <p className="text-5xl mb-4 animate-bounce-smooth">📁</p>
                <p className="text-lg font-semibold mb-2">No file shares yet</p>
                <p className="text-sm">Create your first file share using the form above</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FileSharing
