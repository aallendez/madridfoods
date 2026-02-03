import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddRestaurantModal from './AddRestaurantModal'
import { TYPE_EMOJIS } from './HomePage'

function RestaurantList({ restaurants, addRestaurant }) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filterType, setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')

  const types = [...new Set(restaurants.map(r => r.type))].sort()

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSorted = [...restaurants]
    .filter(r => {
      if (filterType && r.type !== filterType) return false
      if (filterPrice) {
        const [min, max] = filterPrice.split('-').map(Number)
        if (r.price < min || r.price > max) return false
      }
      return true
    })
    .sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'grade') {
        aVal = aVal || 0
        bVal = bVal || 0
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="restaurant-list-page">
      <div className="background-gradient"></div>

      <div className="list-header-compact">
        <button className="btn btn-glass btn-sm" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>📍 Todos los sitios</h1>
        <button
          className="btn btn-disabled btn-sm"
          disabled
        >
          ➕ Añadir <span className="coming-soon">Soon</span>
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
          📊 {filteredAndSorted.length} de {restaurants.length} sitios
        </span>
      </div>

      <div className="cards-container">
        <div className="sort-controls">
          <span>Ordenar por:</span>
          <button
            className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Nombre {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortField === 'price' ? 'active' : ''}`}
            onClick={() => handleSort('price')}
          >
            Precio {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortField === 'grade' ? 'active' : ''}`}
            onClick={() => handleSort('grade')}
          >
            Nota {sortField === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        <div className="restaurant-cards">
          {filteredAndSorted.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <div className="card-header">
                <span className="card-emoji">{TYPE_EMOJIS[restaurant.type] || '🍽️'}</span>
                <div className="card-title">
                  <h3>{restaurant.name}</h3>
                  <span className="card-type">{restaurant.type}</span>
                </div>
                {restaurant.grade && (
                  <span className={`card-grade ${restaurant.grade >= 9 ? 'high' : restaurant.grade >= 7 ? 'medium' : 'low'}`}>
                    ⭐ {restaurant.grade}
                  </span>
                )}
              </div>
              <div className="card-details">
                <span className="card-price">~{restaurant.price}€/persona</span>
                {restaurant.location && <span className="card-location">📍 {restaurant.location}</span>}
              </div>
              {restaurant.note && <p className="card-note">{restaurant.note}</p>}
            </div>
          ))}
        </div>
      </div>

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
