import { useGameStore } from '../stores/useGameStore'

/**
 * Pantalla de Game Over con resultados finales e insignia.
 */
export function GameOverScreen() {
  const phase = useGameStore((s) => s.phase)
  const score = useGameStore((s) => s.score)
  const preguntas = useGameStore((s) => s.preguntas)
  const mision = useGameStore((s) => s.mision)
  const errors = useGameStore((s) => s.errors)
  const goToMenu = useGameStore((s) => s.goToMenu)
  const startGame = useGameStore((s) => s.startGame)

  if (phase !== 'gameOver') return null

  const total = preguntas.length
  const earnedInsignia = score >= mision.minimoAciertosInsignia
  const percentage = Math.round((score / total) * 100)

  return (
    <div className="screen-overlay gameover-screen">
      <div className="gameover-card">
        <div className="gameover-icon">
          {earnedInsignia ? '🛡️' : '📋'}
        </div>
        <h1 className="gameover-title">
          {earnedInsignia ? '¡Misión Completada!' : 'Misión Finalizada'}
        </h1>

        <div className="gameover-score">
          <span className="score-number">{score}</span>
          <span className="score-separator">/</span>
          <span className="score-total">{total}</span>
          <span className="score-label">respuestas correctas al primer intento</span>
        </div>

        <div className="gameover-bar">
          <div
            className="gameover-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {earnedInsignia ? (
          <div className="insignia-box">
            <div className="insignia-emoji">🏅</div>
            <h2 className="insignia-name">{mision.insignia.nombre}</h2>
            <p className="insignia-desc">{mision.insignia.descripcion}</p>
          </div>
        ) : (
          <div className="no-insignia-box">
            <p>
              Necesitas al menos <strong>{mision.minimoAciertosInsignia}</strong> aciertos
              al primer intento para obtener la insignia.
            </p>
            <p>¡Inténtalo de nuevo!</p>
          </div>
        )}

        {/* Resumen de errores por etapa */}
        {Object.keys(errors).length > 0 && (
          <div className="errors-summary">
            <h3>Etapas con errores:</h3>
            {Object.entries(errors).map(([stage, opts]) => (
              <div key={stage} className="error-entry">
                <span>Etapa {Number(stage) + 1}:</span>
                <span className="error-opts">
                  {opts.map((o) => `Opción ${o}`).join(', ')}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="gameover-buttons">
          <button type="button" className="menu-start-btn" onClick={startGame}>
            🔄 Reintentar Misión
          </button>
          <button type="button" className="gameover-menu-btn" onClick={goToMenu}>
            ← Volver al Menú
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
