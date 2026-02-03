import { TYPE_EMOJIS } from './HomePage'

function SearchResults({ results, title, onClose }) {
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
          <div className="results-grid">
            {results.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="result-card"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="result-card-header">
                  <span className="restaurant-emoji">{TYPE_EMOJIS[restaurant.type] || '🍽️'}</span>
                  <h4>{restaurant.name}</h4>
                </div>
                <div className="result-info">
                  <span className="type-badge">{restaurant.type}</span>
                  <span className="price">~{restaurant.price}€</span>
                </div>
                {restaurant.grade && (
                  <div className="grade">
                    ⭐ {restaurant.grade}/10
                  </div>
                )}
                {restaurant.location && (
                  <p className="location">📍 {restaurant.location}</p>
                )}
                {restaurant.note && (
                  <p className="note">💬 {restaurant.note}</p>
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
