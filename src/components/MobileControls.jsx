import { useControlsStore } from '../stores/useControlsStore'

/**
 * Controles virtuales táctiles en pantalla para dispositivos móviles.
 * Proporciona un D-Pad (arriba, abajo, izquierda, derecha) y un botón de salto.
 */
export function MobileControls() {
  const setControl = useControlsStore((state) => state.setControl)

  // Manejadores para touch y mouse para pruebas tanto en móviles como en escritorio
  const createHandlers = (actionName) => ({
    onTouchStart: (e) => {
      e.preventDefault()
      setControl(actionName, true)
    },
    onTouchEnd: (e) => {
      e.preventDefault()
      setControl(actionName, false)
    },
    onTouchCancel: (e) => {
      e.preventDefault()
      setControl(actionName, false)
    },
    onMouseDown: () => setControl(actionName, true),
    onMouseUp: () => setControl(actionName, false),
    onMouseLeave: () => setControl(actionName, false),
  })

  return (
    <div className="mobile-controls-overlay">
      {/* D-Pad Virtual (Izquierda) */}
      <div className="dpad-container" aria-label="Control Direccional">
        <button
          type="button"
          className="dpad-btn dpad-up"
          {...createHandlers('forward')}
          aria-label="Avanzar"
        >
          ▲
        </button>
        <div className="dpad-middle-row">
          <button
            type="button"
            className="dpad-btn dpad-left"
            {...createHandlers('leftward')}
            aria-label="Izquierda"
          >
            ◀
          </button>
          <div className="dpad-center" />
          <button
            type="button"
            className="dpad-btn dpad-right"
            {...createHandlers('rightward')}
            aria-label="Derecha"
          >
            ▶
          </button>
        </div>
        <button
          type="button"
          className="dpad-btn dpad-down"
          {...createHandlers('backward')}
          aria-label="Retroceder"
        >
          ▼
        </button>
      </div>

      {/* Botón de Salto Virtual (Derecha) */}
      <div className="action-buttons-container">
        <button
          type="button"
          className="jump-btn"
          {...createHandlers('jump')}
          aria-label="Saltar"
        >
          <span>SALTAR</span>
          <span className="jump-sub">SPACE</span>
        </button>
      </div>
    </div>
  )
}

export default MobileControls
