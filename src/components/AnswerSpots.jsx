import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { Text } from '@react-three/drei'
import { useGameStore } from '../stores/useGameStore'

const COLORS = {
  default: '#1e293b',
  hover: '#334155',
  correct: '#10b981',
  wrong: '#ef4444',
}

/**
 * Plataformas de opciones de respuesta distribuidas angularmente alrededor de la arena.
 * Cada plataforma tiene un sensor de colisión que detecta cuando el personaje camina sobre ella.
 */
export function AnswerSpots({ arenaRadius = 8 }) {
  const currentStage = useGameStore((s) => s.currentStage)
  const preguntas = useGameStore((s) => s.preguntas)
  const wrongOptions = useGameStore((s) => s.wrongOptions)
  const feedback = useGameStore((s) => s.feedback)
  const phase = useGameStore((s) => s.phase)

  const pregunta = preguntas[currentStage]
  if (!pregunta || phase !== 'game') return null

  const opciones = pregunta.opciones
  const numOpciones = opciones.length

  return (
    <group>
      {opciones.map((opcion, index) => (
        <AnswerPlatform
          key={`${currentStage}-${opcion.id}`}
          opcion={opcion}
          index={index}
          total={numOpciones}
          arenaRadius={arenaRadius}
          correctAnswer={pregunta.respuestaCorrecta}
          isWrong={wrongOptions.includes(opcion.id)}
          disabled={feedback !== null}
        />
      ))}
    </group>
  )
}

/**
 * Plataforma individual de respuesta con colisionador sensor.
 */
function AnswerPlatform({
  opcion,
  index,
  total,
  arenaRadius,
  correctAnswer,
  isWrong,
  disabled,
}) {
  const glowRef = useRef()
  const answerCorrect = useGameStore((s) => s.answerCorrect)
  const answerIncorrect = useGameStore((s) => s.answerIncorrect)

  // Distribución angular equidistante alrededor de la arena
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const distance = arenaRadius * 1.3
  const x = Math.cos(angle) * distance
  const z = Math.sin(angle) * distance

  // Color según estado
  const color = isWrong ? COLORS.wrong : COLORS.default
  const glowColor = isWrong ? '#ff4444' : '#00e5ff'

  // Animación de brillo pulsante
  useFrame((state) => {
    if (glowRef.current && !isWrong) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 2 + index) * 0.3 + 0.7
      glowRef.current.material.opacity = pulse * 0.6
    }
  })

  const handleCollision = ({ other }) => {
    if (disabled) return
    // Solo reaccionar a colisiones con el personaje (CapsuleCollider)
    const otherName = other?.rigidBodyObject?.name
    if (otherName !== 'character') return

    if (opcion.id === correctAnswer) {
      answerCorrect()
    } else {
      answerIncorrect(opcion.id)
    }
  }

  const platformRadius = 1.5
  const platformHeight = 0.3

  return (
    <group position={[x, 0, z]}>
      {/* Plataforma física fija con sensor de colisión */}
      <RigidBody type="fixed" colliders="hull" friction={1}>
        {/* Cuerpo visual de la plataforma */}
        <mesh receiveShadow castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[platformRadius, platformRadius * 1.05, platformHeight, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Anillo luminoso superior */}
        <mesh ref={glowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[platformRadius * 0.85, platformRadius * 0.95, 32]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>
      </RigidBody>

      {/* Sensor de colisión (zona de detección encima de la plataforma) */}
      <RigidBody type="fixed" colliders={false} sensor>
        <CuboidCollider
          args={[platformRadius * 0.7, 0.6, platformRadius * 0.7]}
          position={[0, 0.6, 0]}
          sensor
          onIntersectionEnter={handleCollision}
        />
      </RigidBody>

      {/* Letra de la opción (A, B, C) con Text de drei */}
      <Text
        position={[0, 0.65, 0]}
        fontSize={0.9}
        fontWeight="bold"
        color={isWrong ? '#ff6666' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {opcion.id}
      </Text>

      {/* Texto breve de la opción debajo de la letra */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.16}
        maxWidth={2.4}
        textAlign="center"
        color={isWrong ? '#ff9999' : '#94a3b8'}
        anchorX="center"
        anchorY="top"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {opcion.texto.length > 50
          ? opcion.texto.substring(0, 47) + '...'
          : opcion.texto}
      </Text>

      {/* Indicador de estado (X si está incorrecta) */}
      {isWrong && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.6}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          ✗
        </Text>
      )}
    </group>
  )
}

export default AnswerSpots
