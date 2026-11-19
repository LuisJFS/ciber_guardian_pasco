import { useGameStore } from '../stores/useGameStore'

/**
 * Pantalla de menú principal del juego.
 */
export function MenuScreen() {
  const phase = useGameStore((s) => s.phase)
  const startGame = useGameStore((s) => s.startGame)
  const mision = useGameStore((s) => s.mision)

  if (phase !== 'menu') return null

  return (
    <div className="screen-overlay menu-screen">
      <div className="menu-card">
        <div className="menu-badge">MISIÓN AVA</div>
        <h1 className="menu-title">{mision.titulo}</h1>
        <p className="menu-subtitle">{mision.tema}</p>

        <div className="menu-info">
          <div className="menu-info-item">
            <span className="info-label">Área</span>
            <span className="info-value">{mision.area}</span>
          </div>
          <div className="menu-info-item">
            <span className="info-label">Contexto</span>
            <span className="info-value">{mision.contexto}</span>
          </div>
          <div className="menu-info-item">
            <span className="info-label">Etapas</span>
            <span className="info-value">{mision.totalPreguntas} preguntas</span>
          </div>
          <div className="menu-info-item">
            <span className="info-label">Insignia</span>
            <span className="info-value">{mision.insignia.nombre}</span>
          </div>
        </div>

        <p className="menu-criteria">
          🏅 {mision.insignia.criterio}
        </p>

        <button
          type="button"
          className="menu-start-btn"
          onClick={startGame}
        >
          INICIAR
        </button>

        <p className="menu-controls-hint">
          WASD/Flechas + Espacio para saltar · Táctil compatible
        </p>
        <p className="creador">
          Creado por: Flores Sinche Luis Jeremy
        </p>
      </div>
    </div>
  )
}

export default MenuScreen
