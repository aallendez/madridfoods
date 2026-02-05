import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export function useVisited() {
  const [visited, setVisited] = useLocalStorage('madrid-foods-visited', [])

  const toggleVisited = (restaurantId) => {
    setVisited(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    )
  }

  const isVisited = (restaurantId) => visited.includes(restaurantId)

  return { visited, toggleVisited, isVisited, visitedCount: visited.length }
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('madrid-foods-favorites', [])

  const toggleFavorite = (restaurantId) => {
    setFavorites(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    )
  }

  const isFavorite = (restaurantId) => favorites.includes(restaurantId)

  return { favorites, toggleFavorite, isFavorite, favoritesCount: favorites.length }
}
