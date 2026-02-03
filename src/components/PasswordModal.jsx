import { useState } from 'react'

function PasswordModal({ onSubmit, onClose }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = onSubmit(password)
    if (!isValid) {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="password-modal-header">
          <span className="password-icon">🔐</span>
          <h2>Stop, Contraseña</h2>
        </div>
        <p className="password-description">
          Para asegurar la veracidad y calidad de restaurantes, necesitas una Contraseña para poder añadir restaurantes. Si quieres tenerla, contacta a <a href="https://juan.aallende.com" target="_blank" rel="noopener noreferrer">Juan</a>.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Introduce el código secreto..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            className={`password-input ${error ? 'error' : ''}`}
            autoFocus
          />
          {error && <span className="password-error">Código incorrecto</span>}
          <div className="password-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordModal
