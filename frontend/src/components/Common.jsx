import React from 'react'
import { motion } from 'framer-motion'

// SVG Icon Components
const LoadingIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
  </motion.svg>
)

const CheckIcon = () => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 200 }}
  >
    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
)

export const Header = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-8"
    >
      <motion.h1
        className="text-5xl font-bold cyber-text mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="text-gray-400 text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

export const Card = ({ children, className = '', onClick = null, glow = false, animated = true }) => {
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`glass-dark p-6 rounded-2xl ${glow ? 'neon-glow' : ''} ${
        onClick ? 'cursor-pointer hover:border-cyber-green' : ''
      } transition-all duration-300 border border-dark-border hover:border-cyan-400/50 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export const Button = ({ children, variant = 'primary', size = 'md', loading = false, icon = null, ...props }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }

  const variantClasses = {
    primary: 'btn-primary shadow-lg shadow-cyan-500/20',
    secondary: 'btn-secondary',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/20',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/20',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      className={`rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${sizeClasses[size]} ${variantClasses[variant]} disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100`}
      {...props}
    >
      {loading ? (
        <>
          <LoadingIcon />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-lg">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}

export const Badge = ({ children, color = 'blue', size = 'md', animated = true }) => {
  const colors = {
    blue: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    green: 'bg-green-500/20 text-green-400 border border-green-500/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <motion.span
      initial={animated ? { scale: 0.8, opacity: 0 } : {}}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={`rounded-full font-semibold ${colors[color]} ${sizes[size]}`}
    >
      {children}
    </motion.span>
  )
}

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} border-3 border-cyan-500/30 border-t-cyan-400 rounded-full`}
    />
  )
}

export const StatCard = ({ label, value, trend = null, icon = null, color = 'blue' }) => {
  const colorMap = {
    blue: 'from-cyan-500/10 to-transparent',
    green: 'from-green-500/10 to-transparent',
    red: 'from-red-500/10 to-transparent',
    purple: 'from-purple-500/10 to-transparent',
  }

  return (
    <Card>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} rounded-lg`} />
        <div className="relative flex justify-between items-start mb-4">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-sm mb-2 font-medium"
            >
              {label}
            </motion.p>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-4xl font-bold cyber-text"
            >
              {value}
            </motion.p>
          </div>
          {icon && (
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              {icon}
            </motion.span>
          )}
        </div>
        {trend && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-sm font-semibold flex items-center gap-1 ${
              trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            <span>{trend > 0 ? '▲' : '▼'}</span>
            {Math.abs(trend)}%
          </motion.p>
        )}
      </motion.div>
    </Card>
  )
}

export const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`glass-dark p-8 rounded-2xl max-h-[90vh] overflow-y-auto ${sizeClasses[size]} border border-cyan-400/20`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold cyber-text">{title}</h2>
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={onClose}
            className="text-2xl hover:text-cyan-400 transition-colors"
          >
            ✕
          </motion.button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

export const Alert = ({ type = 'info', message, onClose = null }) => {
  const colors = {
    info: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
    success: 'bg-green-500/20 border-green-500 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    error: 'bg-red-500/20 border-red-500 text-red-400',
  }

  const icons = {
    info: '📋',
    success: '✓',
    warning: '⚠',
    error: '✕',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: -20 }}
      className={`border-l-4 p-4 rounded-lg ${colors[type]} mb-4 flex items-start gap-3 shadow-lg`}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg flex-shrink-0"
      >
        {icons[type]}
      </motion.span>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={onClose}
          className="font-bold ml-2 flex-shrink-0"
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  )
}

export const ProgressBar = ({ percentage = 0, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'from-cyan-500 to-cyan-400',
    green: 'from-green-500 to-green-400',
    red: 'from-red-500 to-red-400',
    yellow: 'from-yellow-500 to-yellow-400',
  }

  return (
    <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden border border-dark-border">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full bg-gradient-to-r ${colorMap[color]} shadow-lg shadow-cyan-500/50`}
      />
    </div>
  )
}

export const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-card text-xs text-gray-200 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {text}
      </motion.div>
    </div>
  )
}

export const DataTable = ({ columns, data, loading = false }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-dark-border">
      <table className="w-full">
        <thead className="bg-dark-bg/50 border-b border-dark-border">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-sm font-semibold text-gray-400 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                <LoadingSpinner />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx * 0.05 }}
                className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm text-gray-300">
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
