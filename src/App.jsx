import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Experience } from './Experience'
import { MobileControls } from './components/MobileControls'
import { MenuScreen } from './components/MenuScreen'
import { GameOverScreen } from './components/GameOverScreen'
import { QuestionHUD } from './components/QuestionHUD'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { useGameStore } from './stores/useGameStore'
import './App.css'

function App() {
  const phase = useGameStore((s) => s.phase)

  // Mapeo de teclas para KeyboardControls de @react-three/drei
  const keyboardMap = useMemo(
    () => [
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
      { name: 'jump', keys: ['Space'] },
    ],
    []
  )

  return (
    <KeyboardControls map={keyboardMap}>
      <div className="canvas-container">
        {/* Canvas 3D de React Three Fiber (siempre renderizado) */}
        <Canvas
          shadows
          camera={{ position: [0, 8, 15], fov: 45 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0a0e17']} />
          <Experience
            physicsDebug={false}
            platformShape="circular"
            platformRadius={8}
          />
        </Canvas>

        {/* --- Capas de UI HTML superpuestas --- */}

        {/* Pantalla de menú principal */}
        <MenuScreen />

        {/* HUD de la pregunta actual (durante el juego) */}
        <QuestionHUD />

        {/* Ventana de retroalimentación (acierto/error) */}
        <FeedbackOverlay />

        {/* Pantalla de Game Over con resultados */}
        <GameOverScreen />

        {/* Controles táctiles en pantalla para móviles (solo durante el juego) */}
        {phase === 'game' && <MobileControls />}

        {/* Indicaciones de controles (solo durante el juego) */}
        {phase === 'game' && (
          <footer className="hud-footer">
            <p>
              🎮 <strong>WASD / Flechas</strong> o <strong>D-Pad táctil</strong> para moverte |{' '}
              <strong>Espacio</strong> o <strong>SALTAR</strong> para brincar
            </p>
          </footer>
        )}
      </div>
    </KeyboardControls>
  )
}

export default App
