import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddRestaurantModal from './AddRestaurantModal'
import SearchResults from './SearchResults'
import PasswordModal from './PasswordModal'

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

function HomePage({ restaurants, addRestaurant }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [activeSuggestion, setActiveSuggestion] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

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

  const handleSuggestionClick = (suggestion) => {
    setActiveSuggestion(suggestion.text)
    const results = filterRestaurants(suggestion.filters)
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
    setSearchResults(results)
    setActiveSuggestion(`Búsqueda: "${searchTerm}"`)
  }

  const clearResults = () => {
    setSearchResults(null)
    setActiveSuggestion(null)
    setSearchTerm('')
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
            <button
              className="btn btn-glass btn-todos"
              onClick={() => navigate('/todos')}
            >
              Ver todos <span className="btn-arrow">➜</span>
            </button>
          </div>

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

          <div className="action-buttons">
            <button
              className="btn btn-glass"
              onClick={handleAddClick}
            >
              ➕ Añadir sitio
            </button>
          </div>
        </div>

        {searchResults && (
          <SearchResults
            results={searchResults}
            title={activeSuggestion}
            onClose={clearResults}
          />
        )}
      </main>

      <footer className="footer">
        <p>🇪🇸 Built by <a href="https://juan.aallende.com" target="_blank" rel="noopener noreferrer">Juan</a> in Madrid, Spain. Data by Nacho ;)</p>
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
