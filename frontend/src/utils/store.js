import { create } from 'zustand'

const useStore = create((set) => ({
  // Dashboard
  stats: {
    total_honeyfiles: 0,
    total_events: 0,
    alerts_today: 0,
    monitoring_status: false,
    events_last_hour: 0,
  },
  setStats: (stats) => set({ stats }),

  // Events
  events: [],
  addEvent: (event) => set((state) => ({
    events: [event, ...state.events].slice(0, 100),
  })),
  setEvents: (events) => set({ events }),

  // Honeyfiles
  honeyfiles: [],
  setHoneyfiles: (honeyfiles) => set({ honeyfiles }),

  // Alerts
  alertSettings: {},
  setAlertSettings: (alertSettings) => set({ alertSettings }),

  // Monitoring
  isMonitoring: false,
  setIsMonitoring: (isMonitoring) => set({ isMonitoring }),

  // UI
  selectedEventId: null,
  setSelectedEventId: (selectedEventId) => set({ selectedEventId }),

  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}))

export default useStore
