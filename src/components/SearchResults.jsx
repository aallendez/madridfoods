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
          <div className="restaurant-rows">
            {results.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="restaurant-row"
                style={{ animationDelay: `${index * 0.015}s` }}
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SearchResults
