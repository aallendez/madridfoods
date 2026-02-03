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

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon">⇅</span>
    return <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="restaurant-list-page">
      <div className="background-gradient"></div>

      <div className="list-header-compact">
        <button className="btn btn-glass btn-sm" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>📍 Todos los sitios</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
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
          📊 {filteredAndSorted.length} de {restaurants.length} sitios
        </span>
      </div>

      <div className="table-container">
        <table className="restaurant-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Nombre <SortIcon field="name" />
              </th>
              <th onClick={() => handleSort('type')}>
                Tipo <SortIcon field="type" />
              </th>
              <th onClick={() => handleSort('price')}>
                Precio <SortIcon field="price" />
              </th>
              <th onClick={() => handleSort('grade')}>
                Nota <SortIcon field="grade" />
              </th>
              <th>Zona</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((restaurant, index) => (
              <tr key={restaurant.id} style={{ animationDelay: `${index * 0.02}s` }}>
                <td className="name-cell">
                  <span className="cell-emoji">{TYPE_EMOJIS[restaurant.type] || '🍽️'}</span>
                  {restaurant.name}
                </td>
                <td>
                  <span className="type-badge small">{restaurant.type}</span>
                </td>
                <td className="price-cell">~{restaurant.price}€</td>
                <td className="grade-cell">
                  {restaurant.grade ? (
                    <span className={`grade ${restaurant.grade >= 9 ? 'high' : restaurant.grade >= 7 ? 'medium' : 'low'}`}>
                      ⭐ {restaurant.grade}
                    </span>
                  ) : (
                    <span className="no-grade">-</span>
                  )}
                </td>
                <td className="location-cell">{restaurant.location ? `📍 ${restaurant.location}` : '-'}</td>
                <td className="note-cell">{restaurant.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
