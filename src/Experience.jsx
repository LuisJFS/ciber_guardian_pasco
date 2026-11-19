import { Physics } from '@react-three/rapier'
import { OrbitControls, Grid } from '@react-three/drei'
import { Platform } from './components/Platform'
import { CharacterController } from './components/CharacterController'
import { AnswerSpots } from './components/AnswerSpots'
import { Kicker } from './components/Kicker'
import { useGameStore } from './stores/useGameStore'

/**
 * Componente principal de la escena 3D (Experience).
 * Envuelve el mundo en <Physics> e incluye la plataforma base fija,
 * el controlador de personaje, las plataformas de respuesta y el kicker opcional.
 */
export function Experience({
  physicsDebug = false,
  platformShape = 'circular',
  platformRadius = 8,
}) {
  const phase = useGameStore((s) => s.phase)
  const currentStage = useGameStore((s) => s.currentStage)

  return (
    <>
      {/* Controles de cámara de órbita para navegar en la escena */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={35}
        target={[0, 1, 0]}
      />

      {/* Iluminación de la escena */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[8, 12, 6]}
        intensity={1.8}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />
      {/* Luces sci-fi / ciberpunk */}
      <pointLight position={[-8, 6, -8]} intensity={1.2} color="#00e5ff" distance={25} />
      <pointLight position={[8, 4, 8]} intensity={0.8} color="#a855f7" distance={20} />

      {/* Motor de física de Rapier */}
      <Physics debug={physicsDebug} gravity={[0, -10.81, 0]}>
        {/* Plataforma base fija */}
        <Platform
          shape={platformShape}
          radius={platformRadius}
          height={0.6}
          segments={platformShape === 'polygonal' ? 6 : 64}
        />

        {/* Controlador de personaje */}
        <CharacterController position={[0, 2, 0]} />

        {/* Plataformas de opciones de respuesta (solo durante el juego) */}
        {phase === 'game' && (
          <AnswerSpots arenaRadius={platformRadius} />
        )}

        {/* Kicker giratorio: dificultad progresiva a partir de la etapa 3 */}
        {phase === 'game' && currentStage >= 2 && (
          <Kicker
            speed={currentStage >= 3 ? 3.8 : 1.5}
            armLength={14}
            armHeight={1}
          />
        )}
      </Physics>

      {/* Cuadrícula de referencia espacial */}
      <Grid
        position={[0, -0.65, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#334155"
        fadeDistance={30}
        fadeStrength={1.5}
      />
    </>
  )
}

export default Experience
