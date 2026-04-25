import { useState } from 'react'
import Dashboard from './components/Dashboard'
import WorkoutTracker from './components/WorkoutTracker'
import MacroTracker from './components/MacroTracker'
import GymAlerts from './components/GymAlerts'
import Achievements from './components/Achievements'
import BottomNav from './components/BottomNav'
import { useLocalStorage } from './hooks/useLocalStorage'

const today = () => new Date().toDateString()

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [toast, setToast] = useState(null)

  // Global state
  const [profile, setProfile] = useLocalStorage('ryfit_profile', {
    name: 'Ry',
    xp: 0,
    level: 1,
    streak: 0,
    lastWorkoutDate: null,
  })
  const [workouts, setWorkouts] = useLocalStorage('ryfit_workouts', [])
  const [macroGoals, setMacroGoals] = useLocalStorage('ryfit_macro_goals', {
    calories: 2500, protein: 180, carbs: 280, fat: 80
  })
  const [macroLog, setMacroLog] = useLocalStorage('ryfit_macro_log', {})
  const [gyms, setGyms] = useLocalStorage('ryfit_gyms', [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function addXP(amount) {
    setProfile(prev => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / 500) + 1
      return { ...prev, xp: newXP, level: newLevel }
    })
    showToast(`+${amount} XP 🔥`)
  }

  function logWorkout(workout) {
    const todayStr = today()
    const updated = [{ ...workout, date: todayStr, id: Date.now() }, ...workouts]
    setWorkouts(updated)
    // Streak
    setProfile(prev => {
      const isNewDay = prev.lastWorkoutDate !== todayStr
      return {
        ...prev,
        lastWorkoutDate: todayStr,
        streak: isNewDay ? prev.streak + 1 : prev.streak
      }
    })
    addXP(workout.xpEarned || 100)
  }

  function todayMacros() {
    return macroLog[today()] || { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }

  function addMacros(entry) {
    const todayStr = today()
    const existing = macroLog[todayStr] || { calories: 0, protein: 0, carbs: 0, fat: 0 }
    const updated = {
      ...macroLog,
      [todayStr]: {
        calories: existing.calories + entry.calories,
        protein: existing.protein + entry.protein,
        carbs: existing.carbs + entry.carbs,
        fat: existing.fat + entry.fat,
      }
    }
    setMacroLog(updated)
    addXP(10)
  }

  const shared = { profile, workouts, macroGoals, setMacroGoals, gyms, setGyms, addXP, logWorkout, todayMacros, addMacros, showToast }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'dashboard'   && <Dashboard   {...shared} setTab={setTab} />}
        {tab === 'workout'     && <WorkoutTracker {...shared} />}
        {tab === 'macros'      && <MacroTracker {...shared} />}
        {tab === 'gym'         && <GymAlerts    {...shared} />}
        {tab === 'achievements'&& <Achievements {...shared} />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
