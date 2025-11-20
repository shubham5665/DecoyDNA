import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header, Card, Button, Badge, LoadingSpinner, Alert, ProgressBar } from '../components/Common'
import { honeyfileAPI } from '../utils/api'
import useStore from '../utils/store'

const Generator = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [expandedFile, setExpandedFile] = useState(null)
  const [showPreview, setShowPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    file_name: '',
    file_type: 'docx',
    template_type: 'passwords',
    seed_locations: [],
  })
  const honeyfiles = useStore((state) => state.honeyfiles)
  const setHoneyfiles = useStore((state) => state.setHoneyfiles)

  // Template content for preview
  const templateContent = {
    passwords: {
      docx: "Corporate Passwords\n\nAdmin Account: admin@company.com\nDatabase: db_admin_prod\nServer SSH: root@prod.internal.com\nAPI Keys: sk_live_51234567890abcdef...",
      xlsx: "A1: Username | B1: Password | C1: Server\nA2: admin | B2: P@ssw0rd123 | C2: mail.company.com\nA3: db_user | B3: db_P@ss456 | C3: db.company.com",
      pdf: "CONFIDENTIAL - CORPORATE CREDENTIALS\n\nEmail Accounts:\nadmin@company.com - P@ssw0rd123\n\nDatabase Access:\nHost: db.internal.com\nUser: admin\nPass: SecureDB123!"
    },
    salaries: {
      docx: "Q4 Salary Report 2024\n\nEmployee | Department | Salary\nJohn Doe | Engineering | $120,000\nJane Smith | Sales | $95,000\nBob Johnson | Management | $150,000",
      xlsx: "A1: Employee | B1: Department | C1: Salary | D1: Bonus\nA2: John Doe | B2: Engineering | C2: 120000 | D2: 15000",
      pdf: "CONFIDENTIAL SALARY INFORMATION\n\nQ4 2024 Compensation Report\n\nTop Earners:\n1. Executive Team - $200,000+\n2. Senior Managers - $150,000+"
    },
    project_secrets: {
      docx: "PROJECT CODENAME: PHOENIX\n\nTimeline: Q1 2025 Launch\nBudget: $2.5M\nKey Milestones:\n- Phase 1: Infrastructure Setup\n- Phase 2: Development\n- Phase 3: Testing & Deployment",
      xlsx: "A1: Project | B1: Status | C1: Budget | D1: Timeline\nA2: Phoenix | Active | 2500000 | Q1-2025",
      pdf: "CONFIDENTIAL PROJECT INFORMATION\n\nProject: Phoenix\nStatus: In Development\nBudget: $2.5 Million\nExpected Launch: Q1 2025"
    }
  }

  const getTemplatePreview = (templateType, fileType) => {
    return templateContent[templateType]?.[fileType] || "No preview available"
  }

  const getFileLocationPath = (templateType) => {
    const paths = {
      passwords: "C:\\Users\\Documents\\SensitiveData\\",
      salaries: "C:\\Users\\Documents\\Finance\\HR\\",
      project_secrets: "C:\\Users\\Documents\\Projects\\Internal\\"
    }
    return paths[templateType] || "C:\\Users\\Documents\\"
  }

  useEffect(() => {
    loadHoneyfiles()
  }, [])

  const loadHoneyfiles = async () => {
    try {
      const res = await honeyfileAPI.list()
      setHoneyfiles(res.data)
    } catch (err) {
      console.error('Failed to load honeyfiles:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    setProgress(0)

    try {
      // Check for duplicate file names
      const fileName = formData.file_name || `honeyfile_${Date.now()}.${formData.file_type}`
      const isDuplicate = honeyfiles.some(f => f.file_name === fileName)
      
      if (isDuplicate) {
        setError(`File "${fileName}" already exists! Please use a different name.`)
        setLoading(false)
        return
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 30
        })
      }, 300)

      // Default seed locations if none provided
      const seedLocations = formData.seed_locations.length > 0
        ? formData.seed_locations
        : ['~/Documents']

      const payload = {
        file_name: fileName,
        file_type: formData.file_type,
        template_type: formData.template_type,
        seed_locations: seedLocations,
      }

      await honeyfileAPI.create(payload)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setSuccess(true)
      setFormData({
        file_name: '',
        file_type: 'docx',
        template_type: 'passwords',
        seed_locations: [],
      })

      // Reload honeyfiles
      await loadHoneyfiles()

      // Hide success message after 4 seconds
      setTimeout(() => {
        setSuccess(false)
        setProgress(0)
      }, 4000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create honeyfile')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHoneyfile = async (honeyfileId) => {
    try {
      setLoading(true)
      await honeyfileAPI.delete(honeyfileId)
      setSuccess(true)
      await loadHoneyfiles()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to delete honeyfile')
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-dark-bg min-h-screen"
    >
      <Header
        title="Honeyfile Generator"
        subtitle="Create realistic decoy files with invisible watermarks and forensic tracking"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Generator Form */}
        <motion.div variants={itemVariants}>
          <Card>
            <h3 className="text-2xl font-bold mb-6 cyber-text flex items-center gap-2">
              <span className="text-xl">🎯</span> Create New Honeyfile
            </h3>

            {success && (
              <Alert
                type="success"
                message="✓ Honeyfile created successfully and deployed to target location!"
                onClose={() => setSuccess(false)}
              />
            )}
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* File Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  📝 File Name
                </label>
                <input
                  type="text"
                  name="file_name"
                  value={formData.file_name}
                  onChange={handleChange}
                  placeholder="e.g., QuarterlyReport.docx (leave empty for auto)"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </motion.div>

              {/* File Type */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  📄 File Type
                </label>
                <select
                  name="file_type"
                  value={formData.file_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="docx">Word Document (.docx)</option>
                  <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                  <option value="pdf">PDF Document (.pdf)</option>
                </select>
              </motion.div>

              {/* Template Type */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  🎭 Template Content
                </label>
                <select
                  name="template_type"
                  value={formData.template_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="passwords">Corporate Passwords</option>
                  <option value="salaries">Salary Report</option>
                  <option value="project_secrets">Project Secrets</option>
                </select>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-cyan-500/5 to-green-500/5 p-4 rounded-lg border border-cyan-400/20"
              >
                <p className="text-sm font-semibold mb-3 text-cyan-400 flex items-center gap-2">
                  ⚡ Advanced Watermarking Features:
                </p>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      ✓
                    </motion.span>
                    Hidden metadata & file properties
                  </li>
                  <li className="flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>
                      ✓
                    </motion.span>
                    Zero-width Unicode characters
                  </li>
                  <li className="flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>
                      ✓
                    </motion.span>
                    Invisible text layers & encoding
                  </li>
                  <li className="flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>
                      ✓
                    </motion.span>
                    SHA256 hashing & forensic tracking
                  </li>
                </ul>
              </motion.div>

              {/* Progress Bar */}
              {loading && progress > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Generating honeyfile...</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar percentage={progress} color="cyan" />
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? 'Creating Honeyfile...' : 'Generate & Deploy Honeyfile'}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>

        {/* Generated Files List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <h3 className="text-2xl font-bold mb-6 cyber-text flex items-center gap-2">
              <span className="text-xl">🍯</span> Generated Honeyfiles ({honeyfiles.length})
            </h3>

            {honeyfiles.length > 0 ? (
              <motion.div
                className="space-y-4 max-h-[900px] overflow-y-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {honeyfiles.map((file, idx) => (
                  <motion.div
                    key={file.id}
                    variants={itemVariants}
                    className="p-5 bg-dark-bg/70 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    {/* File Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-bold text-cyan-400 text-lg"
                        >
                          {file.file_name}
                        </motion.p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          ID: {file.decoy_id.substring(0, 16)}...
                        </p>
                      </div>
                      <Badge color="blue" animated>{file.file_type.toUpperCase()}</Badge>
                    </div>

                    {/* File Metadata Grid */}
                    <motion.div
                      className="grid grid-cols-2 gap-3 text-xs mb-4 pb-4 border-b border-dark-border"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded-lg border border-dark-border/50">
                        <span className="text-gray-400">Template Type</span>
                        <p className="text-cyan-400 font-semibold mt-1">{file.template_type}</p>
                      </motion.div>
                      <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded-lg border border-dark-border/50">
                        <span className="text-gray-400">Created</span>
                        <p className="text-cyan-400 font-semibold mt-1">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </motion.div>
                    </motion.div>

                    {/* File Location Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-2">
                        📍 Deployed File Location
                      </p>
                      <div className="bg-dark-bg p-3 rounded font-mono text-xs text-cyan-400 select-all border border-red-500/20">
                        {file.file_path || getFileLocationPath(file.template_type) + file.file_name}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        ⚠️ This decoy file is now deployed. Access attempts will be logged to Timeline & Alerts.
                      </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      className="flex flex-wrap gap-2 mb-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowPreview(showPreview === file.id ? null : file.id)}
                      >
                        {showPreview === file.id ? '📋 Hide Content' : '📋 Preview Content'}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          const text = file.file_path || getFileLocationPath(file.template_type) + file.file_name
                          navigator.clipboard.writeText(text)
                          alert('File path copied to clipboard!')
                        }}
                      >
                        📋 Copy Path
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setExpandedFile(expandedFile === file.id ? null : file.id)}
                      >
                        {expandedFile === file.id ? '▼ Hide Details' : '▶ Show Details'}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          const text = `
Decoy ID: ${file.decoy_id}
File: ${file.file_name}
Type: ${file.file_type}
Template: ${file.template_type}
Hash: ${file.expected_hash}
Location: ${file.file_path}
                          `.trim()
                          navigator.clipboard.writeText(text)
                          alert('Full details copied!')
                        }}
                      >
                        Export Info
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${file.file_name}"?`)) {
                            handleDeleteHoneyfile(file.id)
                          }
                        }}
                      >
                        Delete File
                      </Button>
                    </motion.div>

                    {/* Content Preview */}
                    {showPreview === file.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-dark-bg rounded border border-cyan-400/20"
                      >
                        <p className="text-xs font-semibold text-gray-300 mb-3 flex items-center gap-2">
                          <span>📄</span> Sample Content ({file.template_type})
                        </p>
                        <div className="bg-black/50 p-4 rounded text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-auto max-h-[250px] border border-dark-border">
                          {getTemplatePreview(file.template_type, file.file_type)}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          ✓ This exact content is embedded in the honeyfile. Opening triggers forensic alerts.
                        </p>
                      </motion.div>
                    )}

                    {/* Full Details */}
                    {expandedFile === file.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-dark-border space-y-3"
                      >
                        <motion.div
                          className="grid grid-cols-2 gap-3 text-xs"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded border border-dark-border/50">
                            <p className="text-gray-400">File Type</p>
                            <p className="font-mono text-cyan-400 mt-1">{file.file_type}</p>
                          </motion.div>
                          <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded border border-dark-border/50">
                            <p className="text-gray-400">Template</p>
                            <p className="font-mono text-cyan-400 mt-1">{file.template_type}</p>
                          </motion.div>
                          <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded col-span-2 border border-dark-border/50">
                            <p className="text-gray-400">Full Decoy ID</p>
                            <p className="font-mono text-cyan-400 break-all mt-1">{file.decoy_id}</p>
                          </motion.div>
                          <motion.div variants={itemVariants} className="bg-dark-bg p-3 rounded col-span-2 border border-dark-border/50">
                            <p className="text-gray-400">SHA256 Hash</p>
                            <p className="font-mono text-cyan-400 break-all mt-1">{file.expected_hash}</p>
                          </motion.div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg"
                        >
                          <p className="text-xs font-semibold text-amber-400 mb-3 flex items-center gap-2">
                            🔍 Admin Verification
                          </p>
                          <ul className="text-xs text-gray-300 space-y-2">
                            <li className="flex items-center gap-2">
                              <span className="text-amber-400">✓</span>
                              Check Timeline page for access events
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-400">✓</span>
                              View Logs for detailed forensic info
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-400">✓</span>
                              File marked as "accessed" when opened
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-400">✓</span>
                              5 invisible watermark techniques active
                            </li>
                          </ul>
                        </motion.div>
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
                <motion.p
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🍯
                </motion.p>
                <p className="text-lg font-semibold mb-2">No honeyfiles generated yet</p>
                <p className="text-sm">Create your first decoy file using the form on the left</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Generator
