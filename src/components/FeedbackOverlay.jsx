import { useGameStore } from '../stores/useGameStore'

/**
 * Ventana emergente de retroalimentación (acierto o error)
 * que se muestra tras responder una pregunta.
 */
export function FeedbackOverlay() {
  const feedback = useGameStore((s) => s.feedback)
  const dismissFeedback = useGameStore((s) => s.dismissFeedback)

  if (!feedback) return null

  const isCorrect = feedback.type === 'correct'

  return (
    <div className="feedback-overlay" onClick={dismissFeedback}>
      <div
        className={`feedback-card ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-icon">
          {isCorrect ? '✅' : '❌'}
        </div>
        <h2 className="feedback-title">
          {isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
        </h2>
        <p className="feedback-text">{feedback.text}</p>
        {!isCorrect && (
          <button
            type="button"
            className="feedback-btn"
            onClick={dismissFeedback}
          >
            Intentar de nuevo
          </button>
        )}
        {isCorrect && (
          <div className="feedback-auto-dismiss">
            Avanzando a la siguiente etapa...
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackOverlay
