import { useEffect, useState, useCallback } from 'react'
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider'
import { ToastProvider, useToast } from '@leafygreen-ui/toast'
import { palette } from '@leafygreen-ui/palette'
import { spacing } from '@leafygreen-ui/tokens'

import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import { API } from './api/client'
import { PAGES } from './pages'

function Shell() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('lg-theme') === 'dark')
  const [section, setSection] = useState('dashboard')
  const [meta, setMeta] = useState({ org: 'MongoDB Brazil', project: 'Production' })
  const [counts, setCounts] = useState({})
  const { pushToast } = useToast()

  const toast = useCallback((title, description = '', variant = 'note') => {
    pushToast({ title, description, variant, timeout: 4000 })
  }, [pushToast])

  const refreshCounts = useCallback(async () => {
    try {
      const [d, a, p] = await Promise.all([API.dashboard(), API.alerts(), API.perfAdvisor()])
      setCounts({
        alerts: d.open_alerts || 0,
        'perf-advisor': p.index_suggestions?.length || 0,
        backup: a ? undefined : undefined,
      })
    } catch (e) { /* backend offline — segue */ }
  }, [])

  useEffect(() => {
    API.meta().then(setMeta).catch(() => {})
    refreshCounts()
  }, [refreshCounts])

  const toggleDark = () => {
    setDarkMode((d) => {
      const next = !d
      localStorage.setItem('lg-theme', next ? 'dark' : 'light')
      return next
    })
  }

  const Page = PAGES[section] || PAGES.dashboard
  const pageBg = darkMode ? palette.black : palette.gray.light3

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <TopBar
          org={meta.org}
          project={meta.project}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          onNewDeployment={() => setSection('deployments')}
          onBell={() => setSection('alerts')}
        />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar active={section} onNavigate={setSection} counts={counts} />
          <main style={{ flex: 1, overflowY: 'auto', background: pageBg, padding: spacing[600] }}>
            <Page toast={toast} navigate={setSection} refreshCounts={refreshCounts} meta={meta} setMeta={setMeta} />
          </main>
        </div>
      </div>
    </LeafyGreenProvider>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
