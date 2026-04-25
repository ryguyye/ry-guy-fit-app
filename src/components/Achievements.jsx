const LEVELS = [
  { level: 1, title: 'Rookie',   xp: 0,    icon: '🌱' },
  { level: 2, title: 'Grinder',  xp: 500,  icon: '💪' },
  { level: 3, title: 'Beast',    xp: 1000, icon: '🔥' },
  { level: 4, title: 'Elite',    xp: 2000, icon: '⚡' },
  { level: 5, title: 'Legend',   xp: 5000, icon: '💎' },
  { level: 6, title: 'GOD MODE', xp: 10000, icon: '👑' },
]

const ACHIEVEMENTS = [
  { id: 'first_workout', icon: '🎯', title: 'First Blood', desc: 'Complete your first workout', check: (s) => s.workouts >= 1 },
  { id: 'streak3',       icon: '🔥', title: 'On Fire',     desc: '3-day workout streak',        check: (s) => s.streak >= 3 },
  { id: 'streak7',       icon: '🌟', title: 'Week Warrior',desc: '7-day workout streak',        check: (s) => s.streak >= 7 },
  { id: 'streak30',      icon: '💎', title: 'Iron Will',   desc: '30-day workout streak',       check: (s) => s.streak >= 30 },
  { id: 'w10',           icon: '🏋️', title: 'Regular',    desc: '10 total workouts',           check: (s) => s.workouts >= 10 },
  { id: 'w50',           icon: '⚡', title: 'Dedicated',   desc: '50 total workouts',           check: (s) => s.workouts >= 50 },
  { id: 'w100',          icon: '👑', title: 'Century Club',desc: '100 total workouts',          check: (s) => s.workouts >= 100 },
  { id: 'xp500',         icon: '🔮', title: 'XP Farmer',   desc: 'Earn 500 XP',                check: (s) => s.xp >= 500 },
  { id: 'xp2000',        icon: '💫', title: 'XP Grinder',  desc: 'Earn 2,000 XP',              check: (s) => s.xp >= 2000 },
  { id: 'xp5000',        icon: '🌠', title: 'XP Legend',   desc: 'Earn 5,000 XP',              check: (s) => s.xp >= 5000 },
  { id: 'macro5',        icon: '🥗', title: 'Meal Prepper',desc: 'Log macros 5 days',           check: (s) => s.macroDays >= 5 },
  { id: 'gym_saved',     icon: '📍', title: 'Gym Rat',     desc: 'Save a gym location',        check: (s) => s.gyms >= 1 },
]

export default function Achievements({ profile, workouts, gyms }) {
  const macroLog = JSON.parse(localStorage.getItem('ryfit_macro_log') || '{}')
  const macroDays = Object.keys(macroLog).length

  const stats = {
    workouts: workouts.length,
    streak: profile.streak,
    xp: profile.xp,
    macroDays,
    gyms: gyms.length,
  }

  const unlocked = ACHIEVEMENTS.filter(a => a.check(stats))
  const locked   = ACHIEVEMENTS.filter(a => !a.check(stats))

  const xpForLevel = 500
  const xpProgress = profile.xp % xpForLevel
  const xpPercent  = (xpProgress / xpForLevel) * 100

  return (
    <div className="page">
      <h1 style={{ marginBottom: 20 }}>Achievements 🏆</h1>

      {/* Level Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(67,216,201,0.1))', borderColor: 'var(--accent)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: 6 }}>
            {LEVELS[Math.min(profile.level - 1, LEVELS.length - 1)]?.icon}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>
            Level {profile.level}
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text2)' }}>
            {LEVELS[Math.min(profile.level - 1, LEVELS.length - 1)]?.title}
          </div>
        </div>

        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{
            width: `${xpPercent}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent3))'
          }} />
        </div>
        <div className="row-between" style={{ marginTop: 6 }}>
          <span className="subtext">{xpProgress} XP</span>
          <span className="subtext">{xpForLevel} XP → Level {profile.level + 1}</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }} className="xp-glow">
            {profile.xp.toLocaleString()} Total XP
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="stat-box">
          <div className="stat-num" style={{ color: 'var(--accent)' }}>{stats.workouts}</div>
          <div className="stat-label">Workouts</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: 'var(--orange)' }}>{stats.streak}</div>
          <div className="stat-label">🔥 Streak</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: 'var(--green)' }}>{unlocked.length}</div>
          <div className="stat-label">Badges</div>
        </div>
      </div>

      {/* Levels Roadmap */}
      <h2>Level Roadmap</h2>
      <div className="card" style={{ padding: '12px' }}>
        {LEVELS.map((l, i) => {
          const isUnlocked = profile.level >= l.level
          const isCurrent  = profile.level === l.level
          return (
            <div key={l.level} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 6px',
              borderBottom: i < LEVELS.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: isUnlocked ? 1 : 0.4
            }}>
              <div style={{ fontSize: '1.6rem', width: 36, textAlign: 'center' }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Level {l.level} · {l.title}
                  {isCurrent && <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>YOU</span>}
                </div>
                <div className="subtext">{l.xp.toLocaleString()} XP required</div>
              </div>
              {isUnlocked && <div style={{ color: 'var(--green)', fontWeight: 800 }}>✓</div>}
            </div>
          )
        })}
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <>
          <h2 style={{ marginTop: 8 }}>Unlocked ({unlocked.length})</h2>
          <div className="grid-2">
            {unlocked.map(a => (
              <div key={a.id} className="card" style={{ textAlign: 'center', borderColor: 'var(--accent)', padding: '16px 12px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{a.title}</div>
                <div className="subtext" style={{ fontSize: '0.72rem', marginTop: 3 }}>{a.desc}</div>
                <div className="badge badge-green" style={{ marginTop: 8 }}>Unlocked ✓</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <>
          <h2 style={{ marginTop: 8 }}>Locked ({locked.length})</h2>
          <div className="grid-2">
            {locked.map(a => (
              <div key={a.id} className="card locked" style={{ textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{a.title}</div>
                <div className="subtext" style={{ fontSize: '0.72rem', marginTop: 3 }}>{a.desc}</div>
                <div className="badge" style={{ marginTop: 8, background: 'var(--bg3)', color: 'var(--text2)' }}>Locked 🔒</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
