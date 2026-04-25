import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const QUICK_FOODS = [
  { name: 'Chicken Breast (6oz)', calories: 280, protein: 53, carbs: 0, fat: 6 },
  { name: 'White Rice (1 cup)', calories: 206, protein: 4, carbs: 45, fat: 0 },
  { name: 'Eggs (3 whole)', calories: 216, protein: 18, carbs: 2, fat: 15 },
  { name: 'Protein Shake', calories: 150, protein: 30, carbs: 8, fat: 3 },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Oatmeal (1 cup)', calories: 307, protein: 11, carbs: 55, fat: 5 },
  { name: 'Sweet Potato', calories: 130, protein: 3, carbs: 30, fat: 0 },
  { name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Ground Beef (4oz)', calories: 290, protein: 20, carbs: 0, fat: 23 },
  { name: 'Salmon (6oz)', calories: 354, protein: 34, carbs: 0, fat: 23 },
  { name: 'Cottage Cheese', calories: 110, protein: 14, carbs: 6, fat: 2 },
]

const today = () => new Date().toDateString()

export default function MacroTracker({ macroGoals, setMacroGoals, todayMacros, addMacros, showToast }) {
  const [mode, setMode] = useState('track') // track | goals | custom
  const [meals, setMeals] = useLocalStorage('ryfit_meals_log', {})
  const [customEntry, setCustomEntry] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })

  const macros = todayMacros()
  const todayMeals = meals[today()] || []

  function logFood(food) {
    const todayStr = today()
    const updated = { ...meals, [todayStr]: [...(meals[todayStr] || []), { ...food, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }
    setMeals(updated)
    addMacros(food)
    showToast(`Logged: ${food.name} 🥗`)
  }

  function logCustom() {
    const e = customEntry
    if (!e.name || !e.calories) return
    logFood({ name: e.name, calories: +e.calories, protein: +e.protein || 0, carbs: +e.carbs || 0, fat: +e.fat || 0 })
    setCustomEntry({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    setMode('track')
  }

  function pct(val, goal) { return Math.min(Math.round((val / goal) * 100), 100) }

  const macroData = [
    { label: 'Calories', key: 'calories', val: macros.calories, goal: macroGoals.calories, color: 'var(--yellow)', unit: '' },
    { label: 'Protein',  key: 'protein',  val: macros.protein,  goal: macroGoals.protein,  color: 'var(--accent3)', unit: 'g' },
    { label: 'Carbs',    key: 'carbs',    val: macros.carbs,    goal: macroGoals.carbs,    color: 'var(--accent)',  unit: 'g' },
    { label: 'Fat',      key: 'fat',      val: macros.fat,      goal: macroGoals.fat,      color: 'var(--accent2)', unit: 'g' },
  ]

  if (mode === 'goals') return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 20 }}>
        <h1>Set Goals 🎯</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => setMode('track')}>← Back</button>
      </div>
      <div className="card">
        {macroData.map(m => (
          <div key={m.key} style={{ marginBottom: 16 }}>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Daily {m.label} Goal</label>
            <input type="number" inputMode="numeric" value={macroGoals[m.key]}
              onChange={e => setMacroGoals(prev => ({ ...prev, [m.key]: +e.target.value }))} />
          </div>
        ))}
        <button className="btn btn-primary btn-full" onClick={() => { showToast('Goals saved! 🎯'); setMode('track') }}>Save Goals</button>
      </div>
    </div>
  )

  if (mode === 'custom') return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 20 }}>
        <h1>Custom Entry ✏️</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => setMode('track')}>← Back</button>
      </div>
      <div className="card">
        {[
          { key: 'name', label: 'Food Name', placeholder: 'e.g. Peanut Butter' },
          { key: 'calories', label: 'Calories', placeholder: '200' },
          { key: 'protein', label: 'Protein (g)', placeholder: '8' },
          { key: 'carbs', label: 'Carbs (g)', placeholder: '6' },
          { key: 'fat', label: 'Fat (g)', placeholder: '16' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input type={f.key === 'name' ? 'text' : 'number'} inputMode={f.key === 'name' ? 'text' : 'numeric'}
              placeholder={f.placeholder} value={customEntry[f.key]}
              onChange={e => setCustomEntry(prev => ({ ...prev, [f.key]: e.target.value }))} />
          </div>
        ))}
        <button className="btn btn-primary btn-full" onClick={logCustom}>Log Food</button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="row-between" style={{ marginBottom: 16 }}>
        <h1>Macros 🥗</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => setMode('goals')}>Set Goals</button>
      </div>

      {/* Macro Rings */}
      <div className="card">
        <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
          {macroData.map(m => (
            <div key={m.key} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 8px' }}>
                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bg3)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={m.color} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct(m.val, m.goal) / 100)}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text2)' }}>/{m.goal}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text2)' }}>{pct(m.val, m.goal)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Meals */}
      {todayMeals.length > 0 && (
        <>
          <h2>Today's Meals</h2>
          {todayMeals.map((meal, i) => (
            <div className="card-sm" key={i}>
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{meal.name}</div>
                  <div className="subtext">{meal.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--yellow)' }}>{meal.calories} cal</div>
                  <div className="subtext">{meal.protein}P · {meal.carbs}C · {meal.fat}F</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Quick Add */}
      <div className="row-between" style={{ marginTop: 8 }}>
        <h2>Quick Add</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setMode('custom')}>+ Custom</button>
      </div>
      {QUICK_FOODS.map(food => (
        <div className="card-sm" key={food.name} style={{ cursor: 'pointer' }} onClick={() => logFood(food)}>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{food.name}</div>
              <div className="subtext">{food.protein}g protein · {food.carbs}g carbs · {food.fat}g fat</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
              <div style={{ fontWeight: 700, color: 'var(--yellow)', fontSize: '0.9rem' }}>{food.calories}</div>
              <div className="subtext" style={{ fontSize: '0.7rem' }}>cal</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
