import { useState, useEffect } from 'react'

export default function GymAlerts({ gyms, setGyms, showToast }) {
  const [locating, setLocating] = useState(false)
  const [userPos, setUserPos] = useState(null)
  const [alertEnabled, setAlertEnabled] = useState(false)
  const [nearbyGym, setNearbyGym] = useState(null)
  const [addMode, setAddMode] = useState(false)
  const [newGymName, setNewGymName] = useState('')
  const [alertRadius, setAlertRadius] = useState(500) // meters

  function getLocation() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
        showToast('Location found! 📍')
      },
      err => {
        setLocating(false)
        showToast('Location access denied')
      },
      { enableHighAccuracy: true }
    )
  }

  function saveGym() {
    if (!userPos || !newGymName.trim()) return
    const gym = { id: Date.now(), name: newGymName.trim(), lat: userPos.lat, lng: userPos.lng }
    setGyms(prev => [...prev, gym])
    setNewGymName('')
    setAddMode(false)
    showToast(`Gym saved: ${gym.name} 🏋️`)
  }

  function removeGym(id) {
    setGyms(prev => prev.filter(g => g.id !== id))
    showToast('Gym removed')
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  useEffect(() => {
    if (!alertEnabled || !userPos || gyms.length === 0) return
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(pos => {
        const nearby = gyms.find(g => haversineDistance(pos.coords.latitude, pos.coords.longitude, g.lat, g.lng) < alertRadius)
        if (nearby && !nearbyGym) {
          setNearbyGym(nearby)
          showToast(`You're near ${nearby.name}! Time to train! 💪`)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('RyFit Alert 💪', { body: `You're near ${nearby.name}! Time to train!` })
          }
        } else if (!nearby) {
          setNearbyGym(null)
        }
      }, () => {}, { enableHighAccuracy: true })
    }, 30000)
    return () => clearInterval(interval)
  }, [alertEnabled, userPos, gyms, alertRadius, nearbyGym])

  function requestNotifPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(p => {
        if (p === 'granted') showToast('Notifications enabled! 🔔')
      })
    }
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: 4 }}>Gym Alerts 📍</h1>
      <div className="subtext" style={{ marginBottom: 20 }}>Get notified when you're near your gym</div>

      {/* Nearby Alert Banner */}
      {nearbyGym && (
        <div className="card" style={{ background: 'rgba(74,222,128,0.1)', borderColor: 'var(--green)', marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="icon-xl">🏋️</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--green)', marginTop: 8 }}>
              You're near {nearbyGym.name}!
            </div>
            <div className="subtext">Time to crush it 💪</div>
          </div>
        </div>
      )}

      {/* Alert Toggle */}
      <div className="card">
        <div className="row-between" style={{ marginBottom: 14 }}>
          <div>
            <h3>GPS Alerts</h3>
            <div className="subtext">Auto-detect when you're near a gym</div>
          </div>
          <button
            className={`btn btn-sm ${alertEnabled ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => { setAlertEnabled(!alertEnabled); if (!alertEnabled) getLocation() }}>
            {alertEnabled ? '🟢 ON' : '⚪ OFF'}
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="label" style={{ display: 'block', marginBottom: 6 }}>
            Alert Radius: {alertRadius}m
          </label>
          <input type="range" min={100} max={2000} step={100} value={alertRadius}
            onChange={e => setAlertRadius(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--accent)', padding: 0 }} />
          <div className="row-between" style={{ marginTop: 2 }}>
            <span className="subtext">100m</span>
            <span className="subtext">2km</span>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm btn-full" onClick={requestNotifPermission}>
          🔔 Enable Push Notifications
        </button>
      </div>

      {/* Location */}
      <div className="card">
        <div className="row-between">
          <div>
            <h3>Your Location</h3>
            {userPos
              ? <div className="subtext">{userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)}</div>
              : <div className="subtext">Not yet detected</div>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={getLocation} disabled={locating}>
            {locating ? '...' : '📍 Get Location'}
          </button>
        </div>
      </div>

      {/* Saved Gyms */}
      <div className="row-between" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>My Gyms</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setAddMode(!addMode); if (!userPos) getLocation() }}>
          {addMode ? '✕ Cancel' : '+ Add Gym'}
        </button>
      </div>

      {addMode && (
        <div className="card" style={{ borderColor: 'var(--accent)' }}>
          <div className="label" style={{ marginBottom: 8 }}>
            {userPos ? `📍 ${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}` : 'Getting location...'}
          </div>
          <input placeholder="Gym name (e.g. Planet Fitness)" value={newGymName}
            onChange={e => setNewGymName(e.target.value)} style={{ marginBottom: 10 }} />
          <button className="btn btn-primary btn-full" onClick={saveGym}
            disabled={!userPos || !newGymName.trim()}>
            Save Gym Here 📍
          </button>
        </div>
      )}

      {gyms.length === 0 && !addMode && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text2)' }}>
          <div className="icon-xl" style={{ marginBottom: 8 }}>🗺️</div>
          <div>No gyms saved yet.</div>
          <div className="subtext">Go to your gym and tap "+ Add Gym"</div>
        </div>
      )}

      {gyms.map(gym => (
        <div className="card-sm" key={gym.id}>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 600 }}>🏋️ {gym.name}</div>
              <div className="subtext">{gym.lat.toFixed(4)}, {gym.lng.toFixed(4)}</div>
              {userPos && (
                <div className="subtext" style={{ color: 'var(--accent3)' }}>
                  {Math.round(haversineDistance(userPos.lat, userPos.lng, gym.lat, gym.lng))}m away
                </div>
              )}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => removeGym(gym.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }
}
