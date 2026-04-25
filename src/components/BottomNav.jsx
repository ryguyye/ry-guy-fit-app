const tabs = [
  { id: 'dashboard',    icon: '⚡', label: 'Home' },
  { id: 'workout',      icon: '🏋️', label: 'Workout' },
  { id: 'macros',       icon: '🥗', label: 'Macros' },
  { id: 'gym',          icon: '📍', label: 'Gym' },
  { id: 'achievements', icon: '🏆', label: 'Awards' },
]

export default function BottomNav({ tab, setTab }) {
  return (
    <nav style={{
      display: 'flex', height: 70, background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)'
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, border: 'none', background: 'none',
            cursor: 'pointer', transition: 'all 0.15s',
            color: tab === t.id ? 'var(--accent)' : 'var(--text2)',
          }}>
          <span style={{ fontSize: '1.3rem', lineHeight: 1, filter: tab === t.id ? 'none' : 'grayscale(0.5)' }}>
            {t.icon}
          </span>
          <span style={{
            fontSize: '0.65rem', fontWeight: 600, fontFamily: 'inherit',
            letterSpacing: '0.3px'
          }}>
            {t.label}
          </span>
          {tab === t.id && (
            <div style={{
              position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)',
              width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)'
            }} />
          )}
        </button>
      ))}
    </nav>
  )
}
