function NeighborhoodMap({ restaurants, onZoneClick }) {
  // Count restaurants by zone
  const zoneCounts = restaurants.reduce((acc, r) => {
    if (r.location && !r.chain) {
      const zone = r.location.trim()
      acc[zone] = (acc[zone] || 0) + 1
    }
    return acc
  }, {})

  // Sort by count descending
  const sortedZones = Object.entries(zoneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) // Top 15 neighborhoods

  const maxCount = sortedZones[0]?.[1] || 1

  const getBarColor = (count) => {
    const ratio = count / maxCount
    if (ratio > 0.7) return 'var(--secondary)'
    if (ratio > 0.4) return 'var(--accent)'
    return 'var(--purple)'
  }

  const chainsCount = restaurants.filter(r => r.chain).length

  return (
    <div className="neighborhood-map">
      <div className="neighborhood-header">
        <h3>📍 Barrios de Madrid</h3>
        <span className="neighborhood-subtitle">Densidad de restaurantes por zona</span>
      </div>

      <div className="zones-list">
        {sortedZones.map(([zone, count], index) => (
          <div
            key={zone}
            className="zone-row"
            onClick={() => onZoneClick?.(zone)}
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <span className="zone-name">{zone}</span>
            <div className="zone-bar-container">
              <div
                className="zone-bar"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  background: getBarColor(count)
                }}
              />
            </div>
            <span className="zone-count">{count}</span>
          </div>
        ))}
      </div>

      <div className="neighborhood-footer">
        <span className="chains-note">🔗 + {chainsCount} cadenas con múltiples locales</span>
      </div>
    </div>
  )
}

export default NeighborhoodMap
