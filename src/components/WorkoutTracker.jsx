import { useState } from 'react'

const EXERCISES = {
  Chest: ['Bench Press','Incline Bench','Dumbbell Fly','Push-Ups','Cable Fly','Dips'],
  Back:  ['Pull-Ups','Barbell Row','Lat Pulldown','Seated Row','Deadlift','Face Pull'],
  Legs:  ['Squat','Leg Press','Romanian Deadlift','Leg Curl','Leg Extension','Calf Raise'],
  Shoulders: ['Overhead Press','Lateral Raise','Front Raise','Arnold Press','Shrugs','Rear Delt Fly'],
  Arms: ['Barbell Curl','Hammer Curl','Tricep Pushdown','Skull Crusher','Preacher Curl','Dips'],
  Cardio: ['Running','Cycling','Rowing','Jump Rope','Stair Climber','HIIT'],
}

export default function WorkoutTracker({ logWorkout, workouts, showToast }) {
  const [mode, setMode] = useState('home') // home | active | history
  const [activeWorkout, setActiveWorkout] = useState({ name: '', exercises: [] })
  const [selectedMuscle, setSelectedMuscle] = useState('Chest')
  const [sets, setSets] = useState({}) // exerciseIdx -> [{reps, weight}]

  function startWorkout(name) {
    setActiveWorkout({ name: name || 'My Workout', exercises: [] })
    setSets({})
    setMode('active')
  }

  function addExercise(ex) {
    setActiveWorkout(prev => ({ ...prev, exercises: [...prev.exercises, ex] }))
    setSets(prev => ({ ...prev, [activeWorkout.exercises.length]: [{ reps: '', weight: '' }] }))
  }

  function updateSet(exIdx, setIdx, field, val) {
    setSets(prev => {
      const exSets = [...(prev[exIdx] || [])]
      exSets[setIdx] = { ...exSets[setIdx], [field]: val }
      return { ...prev, [exIdx]: exSets }
    })
  }

  function addSet(exIdx) {
    setSets(prev => ({
      ...prev,
      [exIdx]: [...(prev[exIdx] || []), { reps: '', weight: '' }]
    }))
  }

  function finishWorkout() {
    const totalSets = Object.values(sets).reduce((a, s) => a + s.length, 0)
    const xpEarned = 100 + totalSets * 10
    logWorkout({ ...activeWorkout, sets, xpEarned, totalSets })
    setMode('home')
    showToast(`Workout done! +${xpEarned} XP 🔥`)
  }

  const todayW = workouts.filter(w => w.date === new Date().toDateString())

  if (mode === 'history') return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 20 }}>
        <h1>History 📋</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => setMode('home')}>← Back</button>
      </div>
      {workouts.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text2)' }}>No workouts yet. Let's get started! 💪</div>}
      {workouts.map(w => (
        <div className="card" key={w.id}>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 700 }}>{w.name}</div>
              <div className="subtext">{w.date}</div>
            </div>
            <div className="badge badge-purple">+{w.xpEarned} XP</div>
          </div>
          <hr className="divider" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {w.exercises?.map((ex, i) => (
              <span key={i} className="badge badge-teal">{ex}</span>
            ))}
          </div>
          <div className="subtext" style={{ marginTop: 8 }}>{w.totalSets || 0} sets completed</div>
        </div>
      ))}
    </div>
  )

  if (mode === 'active') return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <h1>💪 Active</h1>
          <div className="subtext">{activeWorkout.name}</div>
        </div>
        <button className="btn btn-success" onClick={finishWorkout}>Finish ✓</button>
      </div>

      {/* Add Exercise */}
      <div className="card">
        <h2>Add Exercise</h2>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
          {Object.keys(EXERCISES).map(m => (
            <button key={m} onClick={() => setSelectedMuscle(m)}
              className={`btn btn-sm ${selectedMuscle === m ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              {m}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EXERCISES[selectedMuscle].map(ex => (
            <button key={ex} className="badge badge-purple"
              style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => addExercise(ex)}>
              + {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Log */}
      {activeWorkout.exercises.map((ex, exIdx) => (
        <div className="card" key={exIdx}>
          <div className="row-between" style={{ marginBottom: 12 }}>
            <h3>{ex}</h3>
            <button className="badge badge-teal" style={{ cursor: 'pointer' }} onClick={() => addSet(exIdx)}>+ Set</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            <div className="label" style={{ textAlign: 'center' }}>REPS</div>
            <div className="label" style={{ textAlign: 'center' }}>WEIGHT (lbs)</div>
          </div>
          {(sets[exIdx] || [{ reps: '', weight: '' }]).map((s, sIdx) => (
            <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <div className="subtext" style={{ textAlign: 'center' }}>{sIdx + 1}</div>
              <input type="number" placeholder="10" value={s.reps} inputMode="numeric"
                onChange={e => updateSet(exIdx, sIdx, 'reps', e.target.value)} />
              <input type="number" placeholder="135" value={s.weight} inputMode="numeric"
                onChange={e => updateSet(exIdx, sIdx, 'weight', e.target.value)} />
            </div>
          ))}
        </div>
      ))}

      {activeWorkout.exercises.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text2)', marginTop: 30 }}>
          Add exercises above to get started ☝️
        </div>
      )}
    </div>
  )

  return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 20 }}>
        <h1>Workout 🏋️</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => setMode('history')}>History</button>
      </div>

      {todayW.length > 0 && (
        <div className="card" style={{ borderColor: 'var(--accent)', marginBottom: 16 }}>
          <div className="row-between">
            <div>
              <div className="label">Today's workout</div>
              <div style={{ fontWeight: 700, marginTop: 2 }}>{todayW[0].name}</div>
            </div>
            <div className="badge badge-green">✓ Done</div>
          </div>
        </div>
      )}

      <h2>Start a Workout</h2>

      {[
        { name: 'Push Day 💪', desc: 'Chest · Shoulders · Triceps' },
        { name: 'Pull Day 🔥', desc: 'Back · Biceps' },
        { name: 'Leg Day 🦵', desc: 'Quads · Hamstrings · Glutes' },
        { name: 'Full Body ⚡', desc: 'Hit everything' },
        { name: 'Cardio 🏃', desc: 'Burn · Run · Grind' },
        { name: 'Custom 🎯', desc: 'Build your own' },
      ].map(t => (
        <div key={t.name} className="card-sm" style={{ cursor: 'pointer' }} onClick={() => startWorkout(t.name)}>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 600 }}>{t.name}</div>
              <div className="subtext">{t.desc}</div>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>›</span>
          </div>
        </div>
      ))}
    </div>
  )
}
