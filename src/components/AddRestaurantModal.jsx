import { useState } from 'react'
import { TYPE_EMOJIS } from './HomePage'

const RESTAURANT_TYPES = [
  'Bares/Tapeo',
  'Italiano',
  'Mexicano',
  'Hamburguesas/Americana',
  'Española/Mediterránea',
  'Indio',
  'Asiático',
  'Sudamericano',
  'Desayuno/Merienda',
  'Para Comer',
  'Para Cenar',
  'Premium',
  'Healthy',
  'Cheesecake',
  'Mercados/Terrazas',
  'Barato'
]

const PRICE_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 50]

const SITUATION_OPTIONS = [
  { value: 'cita', label: '💕 Cita', emoji: '💕' },
  { value: 'amigos', label: '👯 Amigos', emoji: '👯' },
  { value: 'familia', label: '👨‍👩‍👧‍👦 Familia', emoji: '👨‍👩‍👧‍👦' },
  { value: 'trabajo', label: '💼 Trabajo', emoji: '💼' },
  { value: 'solo', label: '🧘 Solo', emoji: '🧘' }
]

function AddRestaurantModal({ onClose, onAdd, existingRestaurants }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    price: 20,
    grade: '',
    note: '',
    chain: false,
    situations: []
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    } else {
      const exists = existingRestaurants.some(
        r => r.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      )
      if (exists) {
        newErrors.name = '⚠️ Este restaurante ya existe en la lista'
      }
    }

    if (!formData.type) {
      newErrors.type = 'Selecciona un tipo'
    }

    if (formData.grade && (formData.grade < 1 || formData.grade > 10)) {
      newErrors.grade = 'La nota debe ser entre 1 y 10'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)

    if (validate()) {
      onAdd({
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim(),
        price: parseInt(formData.price),
        grade: formData.grade ? parseFloat(formData.grade) : null,
        note: formData.note.trim(),
        chain: formData.chain,
        situations: formData.situations
      })
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (submitted) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleSituation = (situation) => {
    setFormData(prev => ({
      ...prev,
      situations: prev.situations.includes(situation)
        ? prev.situations.filter(s => s !== situation)
        : [...prev.situations, situation]
    }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Añadir restaurante</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">🏪 Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Nombre del restaurante"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">🍽️ Tipo *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? 'error' : ''}
            >
              <option value="">Selecciona un tipo</option>
              {RESTAURANT_TYPES.map(type => (
                <option key={type} value={type}>{TYPE_EMOJIS[type] || ''} {type}</option>
              ))}
            </select>
            {errors.type && <span className="error-message">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">📍 Zona (opcional)</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Malasaña, Chueca, Sol..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">💰 Precio por persona</label>
              <select
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              >
                {PRICE_OPTIONS.map(price => (
                  <option key={price} value={price}>~{price}€</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="grade">⭐ Nota (1-10)</label>
              <input
                type="number"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                min="1"
                max="10"
                step="0.5"
                placeholder="Opcional"
                className={errors.grade ? 'error' : ''}
              />
              {errors.grade && <span className="error-message">{errors.grade}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">💬 Comentario (opcional)</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Especialidad, ambiente, recomendaciones..."
              rows="2"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="chain"
                checked={formData.chain}
                onChange={handleChange}
              />
              <span className="checkbox-text">🏢 Es una cadena (tiene muchos locales)</span>
            </label>
          </div>

          <div className="form-group">
            <label>🎯 Ideal para (opcional)</label>
            <div className="situation-options">
              {SITUATION_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`situation-btn ${formData.situations.includes(option.value) ? 'active' : ''}`}
                  onClick={() => toggleSituation(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              ✨ Añadir restaurante
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRestaurantModal
