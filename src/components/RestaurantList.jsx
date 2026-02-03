import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddRestaurantModal from './AddRestaurantModal'
import PasswordModal from './PasswordModal'
import { TYPE_EMOJIS } from './HomePage'

// Define type order for grouping
const TYPE_ORDER = [
  'Española/Mediterránea',
  'Italiano',
  'Mexicano',
  'Hamburguesas/Americana',
  'Asiático',
  'Indio',
  'Sudamericano',
  'Bares/Tapeo',
  'Desayuno/Merienda',
  'Para Comer',
  'Para Cenar',
  'Healthy',
  'Cheesecake',
  'Premium',
  'Mercados/Terrazas',
  'Barato'
]

const SECRET_CODE = 'madridmola'

function RestaurantList({ restaurants, addRestaurant }) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')
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

  const types = [...new Set(restaurants.map(r => r.type))].sort((a, b) => {
    const aIndex = TYPE_ORDER.indexOf(a)
    const bIndex = TYPE_ORDER.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  const filtered = restaurants.filter(r => {
    if (filterType && r.type !== filterType) return false
    if (filterPrice) {
      const [min, max] = filterPrice.split('-').map(Number)
      if (r.price < min || r.price > max) return false
    }
    return true
  })

  // Group restaurants by type
  const groupedByType = types.reduce((acc, type) => {
    const restaurantsOfType = filtered
      .filter(r => r.type === type)
      .sort((a, b) => a.name.localeCompare(b.name))
    if (restaurantsOfType.length > 0) {
      acc[type] = restaurantsOfType
    }
    return acc
  }, {})

  const totalFiltered = filtered.length

  return (
    <div className="restaurant-list-page">
      <div className="background-gradient"></div>

      <div className="list-header-compact">
        <button className="btn btn-glass btn-sm" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>📍 Todos los sitios</h1>
        <button
          className="btn btn-glass btn-sm"
          onClick={handleAddClick}
        >
          ➕ Añadir
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>🍽️ Tipo</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {types.map(type => (
              <option key={type} value={type}>{TYPE_EMOJIS[type] || ''} {type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>💰 Precio</label>
          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="0-10">Hasta 10€</option>
            <option value="10-20">10€ - 20€</option>
            <option value="20-30">20€ - 30€</option>
            <option value="30-50">30€ - 50€</option>
            <option value="50-100">+50€</option>
          </select>
        </div>

        <span className="results-info">
          📊 {totalFiltered} de {restaurants.length} sitios
        </span>
      </div>

      <div className="cards-container">
        {Object.entries(groupedByType).map(([type, restaurantsOfType]) => (
          <div key={type} className="type-group">
            <h2 className="type-header">
              <span className="type-header-emoji">{TYPE_EMOJIS[type] || '🍽️'}</span>
              {type}
              <span className="type-count">{restaurantsOfType.length}</span>
            </h2>
            <div className="restaurant-rows">
              {restaurantsOfType.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="restaurant-row"
                  style={{ animationDelay: `${index * 0.015}s` }}
                >
                  <div className="row-main">
                    <span className="row-name">{restaurant.name}</span>
                    {restaurant.grade && (
                      <span className={`row-grade ${restaurant.grade >= 9 ? 'high' : restaurant.grade >= 7 ? 'medium' : 'low'}`}>
                        ⭐ {restaurant.grade}
                      </span>
                    )}
                  </div>
                  <div className="row-details">
                    <span className="row-price">~{restaurant.price}€</span>
                    {restaurant.chain ? (
                      <span className="row-location chain">📍 Muchos locales</span>
                    ) : restaurant.location ? (
                      <span className="row-location">📍 {restaurant.location}</span>
                    ) : null}
                    {restaurant.note && <span className="row-note">{restaurant.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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

export default RestaurantList
