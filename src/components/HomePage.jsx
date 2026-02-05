import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddRestaurantModal from './AddRestaurantModal'
import SearchResults from './SearchResults'
import PasswordModal from './PasswordModal'
import NeighborhoodMap from './NeighborhoodMap'

const suggestions = [
  {
    text: 'Tengo una cita',
    emoji: '💕',
    description: 'Sitios románticos y con ambiente',
    filters: { types: ['Italiano', 'Española/Mediterránea', 'Para Cenar'], minPrice: 25 }
  },
  {
    text: 'Copeo con colegas',
    emoji: '🍻',
    description: 'Bares y tapas para grupos',
    filters: { types: ['Bares/Tapeo'] }
  },
  {
    text: 'Comida rápida',
    emoji: '⚡',
    description: 'Rico, rápido y barato',
    filters: { types: ['Hamburguesas/Americana', 'Mexicano'], maxPrice: 15 }
  },
  {
    text: 'Sushi night',
    emoji: '🍱',
    description: 'Los mejores japoneses',
    filters: { types: ['Asiático'], note: 'sushi' }
  },
  {
    text: 'Brunch dominical',
    emoji: '🥐',
    description: 'Desayunos tardíos perfectos',
    filters: { types: ['Desayuno/Merienda'], note: 'brunch' }
  },
  {
    text: 'Comer healthy',
    emoji: '🥗',
    description: 'Opciones sanas y ligeras',
    filters: { types: ['Healthy'] }
  },
  {
    text: 'Pizza con amigos',
    emoji: '🍕',
    description: 'Las mejores pizzerías',
    filters: { types: ['Italiano'], note: 'pizza' }
  },
  {
    text: 'Tacos y margaritas',
    emoji: '🌮',
    description: 'Sabor mexicano auténtico',
    filters: { types: ['Mexicano'] }
  },
  {
    text: 'Lo mejor valorado',
    emoji: '⭐',
    description: 'Solo lo top del top',
    filters: { minGrade: 9 }
  },
  {
    text: 'Terrazas y mercados',
    emoji: '☀️',
    description: 'Al aire libre',
    filters: { types: ['Mercados/Terrazas'] }
  },
]

export const TYPE_EMOJIS = {
  'Bares/Tapeo': '🍻',
  'Italiano': '🍝',
  'Mexicano': '🌮',
  'Hamburguesas/Americana': '🍔',
  'Española/Mediterránea': '🥘',
  'Indio': '🍛',
  'Asiático': '🍣',
  'Sudamericano': '🫔',
  'Desayuno/Merienda': '🥐',
  'Para Comer': '🍽️',
  'Para Cenar': '🍷',
  'Premium': '💎',
  'Healthy': '🥗',
  'Cheesecake': '🍰',
  'Mercados/Terrazas': '☀️',
  'Barato': '💰'
}

const SECRET_CODE = 'madridmola'

function HomePage({ restaurants, addRestaurant, userActions, lastUpdated }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [activeSuggestion, setActiveSuggestion] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showNeighborhoods, setShowNeighborhoods] = useState(false)

  const { visitedCount, favoritesCount, toggleVisited, toggleFavorite, isVisited, isFavorite, favorites } = userActions

  const handleAddClick = () => {
    if (isUnlocked) {
      setShowModal(true)
    } else {
      setShowPasswordModal(true)
    }
  }

  const handlePasswordSubmit = (code) => {
    if (code === SECRET_CODE) {
      setIsUnlocked(true)
      setShowPasswordModal(false)
      setShowModal(true)
      return true
    }
    return false
  }

  const filterRestaurants = (filters) => {
    return restaurants.filter(restaurant => {
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(restaurant.type)) return false
      }
      if (filters.minPrice && restaurant.price < filters.minPrice) return false
      if (filters.maxPrice && restaurant.price > filters.maxPrice) return false
      if (filters.minGrade && (!restaurant.grade || restaurant.grade < filters.minGrade)) return false
      if (filters.note) {
        const noteMatch = restaurant.note.toLowerCase().includes(filters.note.toLowerCase()) ||
                         restaurant.name.toLowerCase().includes(filters.note.toLowerCase())
        if (!noteMatch) return false
      }
      return true
    })
  }

  const sortByNote = (restaurants) => {
    return [...restaurants].sort((a, b) => {
      const aHasNote = a.note && a.note.trim() !== ''
      const bHasNote = b.note && b.note.trim() !== ''
      if (aHasNote && !bHasNote) return -1
      if (!aHasNote && bHasNote) return 1
      return a.name.localeCompare(b.name)
    })
  }

  const handleSuggestionClick = (suggestion) => {
    setActiveSuggestion(suggestion.text)
    const results = sortByNote(filterRestaurants(suggestion.filters))
    setSearchResults(results)
    setSearchTerm('')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    const term = searchTerm.toLowerCase()
    const results = restaurants.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.type.toLowerCase().includes(term) ||
      r.note.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term)
    )
    setSearchResults(sortByNote(results))
    setActiveSuggestion(`Búsqueda: "${searchTerm}"`)
  }

  const clearResults = () => {
    setSearchResults(null)
    setActiveSuggestion(null)
    setSearchTerm('')
  }

  const handleShowFavorites = () => {
    if (favoritesCount === 0) return
    const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id))
    setSearchResults(sortByNote(favoriteRestaurants))
    setActiveSuggestion('Mis favoritos')
  }

  const handleZoneClick = (zone) => {
    const results = restaurants.filter(r => r.location === zone)
    setSearchResults(sortByNote(results))
    setActiveSuggestion(`Zona: ${zone}`)
    setShowNeighborhoods(false)
  }

  const formatLastUpdated = (date) => {
    if (!date) return null
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'hoy'
    if (diffDays === 1) return 'ayer'
    if (diffDays < 7) return `hace ${diffDays} días`
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="home-page">
      <div className="background-gradient"></div>

      <main className="main-content">
        <div className="search-section">
          <div className="hero-title">
            <span className="hero-brand">🍴 Madrid Foods</span>
            <h1>¿Qué plan tienes hoy? 🤔</h1>
          </div>

          {/* Progress Stats */}
          <div className="user-stats">
            <button
              className={`stat-chip ${favoritesCount > 0 ? 'clickable' : ''}`}
              onClick={handleShowFavorites}
              disabled={favoritesCount === 0}
            >
              <span className="stat-icon">❤️</span>
              <span className="stat-text">{favoritesCount} favoritos</span>
            </button>
            <div className="stat-chip">
              <span className="stat-icon">✅</span>
              <span className="stat-text">{visitedCount}/{restaurants.length} visitados</span>
            </div>
            <button
              className="stat-chip clickable"
              onClick={() => setShowNeighborhoods(!showNeighborhoods)}
            >
              <span className="stat-icon">📍</span>
              <span className="stat-text">Barrios</span>
            </button>
          </div>

          <div className="search-row">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar restaurante, tipo de comida..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-button">Buscar</button>
            </form>
            <div className="header-actions">
              <button
                className="btn-add-icon"
                onClick={handleAddClick}
              >
                +
              </button>
              <button
                className="btn btn-glass btn-todos"
                onClick={() => navigate('/todos')}
              >
                Ver todos <span className="btn-arrow">➜</span>
              </button>
            </div>
          </div>

          {showNeighborhoods && (
            <NeighborhoodMap
              restaurants={restaurants}
              onZoneClick={handleZoneClick}
            />
          )}

          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`suggestion-card ${activeSuggestion === suggestion.text ? 'active' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="suggestion-emoji">{suggestion.emoji}</span>
                <span className="suggestion-text">{suggestion.text}</span>
                <span className="suggestion-description">{suggestion.description}</span>
              </button>
            ))}
          </div>
        </div>

        {searchResults && (
          <SearchResults
            results={searchResults}
            title={activeSuggestion}
            onClose={clearResults}
            userActions={userActions}
          />
        )}
      </main>

      <footer className="footer">
        <p>🇪🇸 Built by <a href="https://juan.aallende.com" target="_blank" rel="noopener noreferrer">Juan</a> in Madrid, Spain. Data by Nacho ;)</p>
        {lastUpdated && (
          <p className="last-updated">
            📅 Actualizado {formatLastUpdated(lastUpdated)} · {restaurants.length} restaurantes
          </p>
        )}
      </footer>

      {showPasswordModal && (
        <PasswordModal
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {showModal && (
        <AddRestaurantModal
          onClose={() => setShowModal(false)}
          onAdd={addRestaurant}
          existingRestaurants={restaurants}
        />
      )}
    </div>
  )
}

export default HomePage
