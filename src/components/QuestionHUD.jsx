import { useState } from 'react'
import { useGameStore } from '../stores/useGameStore'

/**
 * HUD de la pregunta actual: muestra el contexto, enunciado de la pregunta
 * y las alternativas como tarjeta informativa superpuesta.
 * Incluye opción de minimizar para despejar la vista 3D.
 */
export function QuestionHUD() {
  const phase = useGameStore((s) => s.phase)
  const currentStage = useGameStore((s) => s.currentStage)
  const preguntas = useGameStore((s) => s.preguntas)
  const score = useGameStore((s) => s.score)
  const wrongOptions = useGameStore((s) => s.wrongOptions)

  // Guardamos qué etapa está minimizada (al cambiar de etapa se expande automáticamente)
  const [minimizedStage, setMinimizedStage] = useState(null)
  const isMinimized = minimizedStage === currentStage

  const toggleMinimized = () => {
    setMinimizedStage(isMinimized ? null : currentStage)
  }

  if (phase !== 'game') return null

  const pregunta = preguntas[currentStage]
  if (!pregunta) return null

  return (
    <div className={`question-hud ${isMinimized ? 'hud-minimized' : ''}`}>
      {/* Barra de progreso y puntaje */}
      <div className="question-progress-bar">
        <div className="stage-indicators">
          {preguntas.map((_, i) => (
            <div
              key={i}
              className={`stage-dot ${
                i < currentStage ? 'completed' : i === currentStage ? 'active' : ''
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="score-display">
          ⭐ {score}/{preguntas.length}
        </div>
      </div>

      {/* Tarjeta de pregunta con botón para minimizar */}
      <div className={`question-card ${isMinimized ? 'card-minimized' : ''}`}>
        <div className="question-header">
          <div className="question-context">
            <span className="context-icon">📍</span>
            <span className="context-text">{pregunta.contexto}</span>
            <span className="question-type">
              {pregunta.tipo === 'verdadero_falso' ? 'V/F' : 'Opción Múltiple'}
            </span>
          </div>

          <button
            type="button"
            className="btn-toggle-hud"
            onClick={toggleMinimized}
            aria-label={isMinimized ? 'Expandir pregunta' : 'Minimizar pregunta'}
            title={isMinimized ? 'Expandir pregunta completa' : 'Minimizar pregunta para despejar la pantalla'}
          >
            {isMinimized ? '🔽 Ver pregunta' : '🔼 Minimizar'}
          </button>
        </div>

        {/* Contenido expandido */}
        {!isMinimized ? (
          <div className="question-body">
            <p className="question-text">{pregunta.pregunta}</p>

            <div className="question-options">
              {pregunta.opciones.map((op) => {
                const isWrong = wrongOptions.includes(op.id)
                return (
                  <div
                    key={op.id}
                    className={`option-row ${isWrong ? 'option-wrong' : ''}`}
                  >
                    <span className={`option-letter ${isWrong ? 'letter-wrong' : ''}`}>
                      {op.id}
                    </span>
                    <span className="option-text">{op.texto}</span>
                  </div>
                )
              })}
            </div>

            <p className="question-hint">
              🏃 Camina hacia la plataforma con la respuesta correcta
            </p>
          </div>
        ) : (
          /* Vista resumida al estar minimizado */
          <div
            className="question-summary-pill"
            onClick={toggleMinimized}
            title="Haz clic para ver las opciones completas"
          >
            <span className="summary-text">
              {pregunta.pregunta.length > 60
                ? pregunta.pregunta.substring(0, 58) + '...'
                : pregunta.pregunta}
            </span>
            <span className="summary-hint">Toca para abrir 🔍</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionHUD
