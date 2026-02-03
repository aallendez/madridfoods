import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import HomePage from './components/HomePage'
import RestaurantList from './components/RestaurantList'
import { Analytics } from "@vercel/analytics/react"

import './App.css'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/restaurants.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map((row, index) => ({
              id: index + 1,
              name: row.name,
              type: row.type,
              location: row.location || '',
              price: parseInt(row.price) || 0,
              grade: parseFloat(row.grade) || null,
              note: row.note || '',
              chain: row.chain === 'true'
            }))
            setRestaurants(data)
            setLoading(false)
          }
        })
      })
      .catch(err => {
        console.error('Error loading CSV:', err)
        setLoading(false)
      })
  }, [])

  const addRestaurant = (newRestaurant) => {
    const restaurant = {
      ...newRestaurant,
      id: restaurants.length + 1
    }
    setRestaurants([...restaurants, restaurant])
  }

  if (loading) {
    return <div className="loading">Cargando restaurantes...</div>
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<HomePage restaurants={restaurants} addRestaurant={addRestaurant} />}
        />
        <Route
          path="/todos"
          element={<RestaurantList restaurants={restaurants} addRestaurant={addRestaurant} />}
        />
      </Routes>
      <Analytics />
    </div>
  )
}

export default App
