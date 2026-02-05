import { TYPE_EMOJIS } from './HomePage'

function SearchResults({ results, title, onClose, userActions }) {
  const { toggleVisited, toggleFavorite, isVisited, isFavorite } = userActions || {}

  const handleAction = (e, action, id) => {
    e.stopPropagation()
    action?.(id)
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <span className="no-results-emoji">😅</span>
          <p>No se encontraron resultados</p>
        </div>
      ) : (
        <>
          <p className="results-count">
            {results.length} sitio{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''} 🎉
          </p>
          <div className="restaurant-rows">
            {results.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className={`restaurant-row ${isVisited?.(restaurant.id) ? 'visited' : ''}`}
                style={{ animationDelay: `${index * 0.015}s` }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' Madrid')}`, '_blank')}
              >
                <div className="row-main">
                  <span className="row-emoji">{TYPE_EMOJIS[restaurant.type] || '🍽️'}</span>
                  <span className="row-name">{restaurant.name}</span>
                  {restaurant.grade && (
                    <span className={`row-grade ${restaurant.grade >= 9 ? 'high' : restaurant.grade >= 7 ? 'medium' : 'low'}`}>
                      ⭐ {restaurant.grade}
                    </span>
                  )}
                </div>
                <div className="row-details">
                  <span className="row-type">{restaurant.type}</span>
                  <span className="row-price">~{restaurant.price}€</span>
                  {restaurant.chain ? (
                    <span className="row-location chain">📍 Muchos locales</span>
                  ) : restaurant.location ? (
                    <span className="row-location">📍 {restaurant.location}</span>
                  ) : null}
                  {restaurant.note && <span className="row-note">{restaurant.note}</span>}
                </div>
                {userActions && (
                  <div className="row-actions">
                    <button
                      className={`action-btn favorite-btn ${isFavorite?.(restaurant.id) ? 'active' : ''}`}
                      onClick={(e) => handleAction(e, toggleFavorite, restaurant.id)}
                      title={isFavorite?.(restaurant.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                      {isFavorite?.(restaurant.id) ? '❤️' : '🤍'}
                    </button>
                    <button
                      className={`action-btn visited-btn ${isVisited?.(restaurant.id) ? 'active' : ''}`}
                      onClick={(e) => handleAction(e, toggleVisited, restaurant.id)}
                      title={isVisited?.(restaurant.id) ? 'Marcar como no visitado' : 'Marcar como visitado'}
                    >
                      {isVisited?.(restaurant.id) ? '✅' : '⬜'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SearchResults
