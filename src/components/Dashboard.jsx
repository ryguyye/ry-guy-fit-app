import { useState } from 'react'

const LEVEL_TITLES = ['Rookie','Grinder','Beast','Elite','Legend','GOD MODE']

export default function Dashboard({ profile, workouts, macroGoals, todayMacros, setTab }) {
  const xpForLevel = 500
  const xpProgress = profile.xp % xpForLevel
  const xpPercent = (xpProgress / xpForLevel) * 100
  const levelTitle = LEVEL_TITLES[Math.min(profile.level - 1, LEVEL_TITLES.length - 1)]
  const macros = todayMacros()
  const todayWorkouts = workouts.filter(w => w.date === new Date().toDateString())

  return (
    <div className="page">
      {/* Header */}
      <div className="row-between" style={{ marginBottom: 20 }}>
        <div>
          <div className="subtext">Good {getGreeting()},</div>
          <h1>{profile.name} 💪</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
            Lvl {profile.level} · {levelTitle}
          </div>
          <div className="subtext" style={{ marginTop: 6, fontSize: '0.75rem' }}>
            🔥 {profile.streak} day streak
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span className="label">XP Progress</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }} className="xp-glow">
            {profile.xp.toLocaleString()} XP
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${xpPercent}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent3))' }} />
        </div>
        <div className="row-between" style={{ marginTop: 6 }}>
          <span className="subtext">{xpProgress} / {xpForLevel} to Level {profile.level + 1}</span>
          <span className="subtext">{Math.round(xpPercent)}%</span>
        </div>
      </div>

      {/* Today Stats */}
      <div className="grid-3" style={{ marginBottom: 14 }}>
        <div className="stat-box">
          <div className="stat-num" style={{ color: 'var(--accent)' }}>{todayWorkouts.length}</div>
          <div className="stat-label">Workouts</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: 'var(--accent3)' }}>{macros.calories}</div>
          <div className="stat-label">Calories</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: 'var(--green)' }}>{macros.protein}g</div>
          <div className="stat-label">Protein</div>
        </div>
      </div>

      {/* Macro Summary */}
      <div className="card">
        <h2>Today's Macros</h2>
        {[
          { label: 'Calories', val: macros.calories, goal: macroGoals.calories, color: 'var(--yellow)' },
          { label: 'Protein',  val: macros.protein,  goal: macroGoals.protein,  color: 'var(--accent3)' },
          { label: 'Carbs',    val: macros.carbs,    goal: macroGoals.carbs,    color: 'var(--accent)' },
          { label: 'Fat',      val: macros.fat,       goal: macroGoals.fat,       color: 'var(--accent2)' },
        ].map(m => (
          <div key={m.label} style={{ marginBottom: 12 }}>
            <div className="row-between" style={{ marginBottom: 5 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.label}</span>
              <span className="subtext">{m.val} / {m.goal}{m.label === 'Calories' ? '' : 'g'}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${Math.min((m.val / m.goal) * 100, 100)}%`,
                background: m.color
              }} />
            </div>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 6 }} onClick={() => setTab('macros')}>
          Log Meal →
        </button>
      </div>

      {/* Quick Actions */}
      <h2>Quick Actions</h2>
      <div className="grid-2">
        <button className="btn btn-primary" style={{ padding: '16px' }} onClick={() => setTab('workout')}>
          🏋️ Start Workout
        </button>
        <button className="btn btn-secondary" style={{ padding: '16px' }} onClick={() => setTab('macros')}>
          🥗 Log Macros
        </button>
      </div>

      {/* Recent Workouts */}
      {workouts.length > 0 && (
        <>
          <h2 style={{ marginTop: 20 }}>Recent Workouts</h2>
          {workouts.slice(0, 3).map(w => (
            <div key={w.id} className="card-sm">
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{w.name}</div>
                  <div className="subtext">{w.date} · {w.exercises?.length || 0} exercises</div>
                </div>
                <div className="badge badge-purple">+{w.xpEarned} XP</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
