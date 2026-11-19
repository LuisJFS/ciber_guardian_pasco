import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { CharacterModel } from './CharacterModel'
import { useControlsStore } from '../stores/useControlsStore'
import { useGameStore } from '../stores/useGameStore'

/**
 * Controlador de personaje (CharacterController).
 * Encierra el modelo en un <RigidBody> con un <CapsuleCollider>.
 * Usa `lockRotations` para bloquear todas las rotaciones físicas (X, Y, Z).
 * Esto evita que el personaje gire como un trompo por la fricción física con el suelo,
 * mientras que la orientación visual hacia donde camina se controla limpiamente por código.
 */
export function CharacterController({ position = [0, 2, 0] }) {
  const rigidBodyRef = useRef()
  const characterVisualRef = useRef()
  const [, getKeyboard] = useKeyboardControls()
  const [isMoving, setIsMoving] = useState(false)

  // Vectores auxiliares para evitar crear objetos en cada frame
  const moveDirection = useRef(new THREE.Vector3()).current
  const targetRotation = useRef(0)

  // Escuchar cambios en resetPlayerPosition desde el store
  const resetPlayerPosition = useGameStore((s) => s.resetPlayerPosition)
  const consumeResetPosition = useGameStore((s) => s.consumeResetPosition)
  const phase = useGameStore((s) => s.phase)

  useEffect(() => {
    if (resetPlayerPosition && rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation({ x: 0, y: 2, z: 0 }, true)
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      consumeResetPosition()
    }
  }, [resetPlayerPosition, consumeResetPosition])

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return
    // No mover si no estamos en fase de juego
    if (phase !== 'game') return

    // Obtener entradas del teclado y de los botones táctiles virtuales
    const keyboard = getKeyboard()
    const touch = useControlsStore.getState()

    const forward = keyboard.forward || touch.forward
    const backward = keyboard.backward || touch.backward
    const leftward = keyboard.leftward || touch.leftward
    const rightward = keyboard.rightward || touch.rightward
    const jump = keyboard.jump || touch.jump

    // Calcular vector de dirección
    moveDirection.set(0, 0, 0)
    if (forward) moveDirection.z -= 1
    if (backward) moveDirection.z += 1
    if (leftward) moveDirection.x -= 1
    if (rightward) moveDirection.x += 1

    const moving = moveDirection.lengthSq() > 0
    if (moving !== isMoving) {
      setIsMoving(moving)
    }

    const currentVelocity = rigidBodyRef.current.linvel()
    const moveSpeed = 5.5

    let vx = 0
    let vz = 0

    if (moving) {
      moveDirection.normalize()
      vx = moveDirection.x * moveSpeed
      vz = moveDirection.z * moveSpeed

      // Suavizado de rotación visual hacia la dirección del movimiento (camino más corto)
      targetRotation.current = Math.atan2(moveDirection.x, moveDirection.z)
      if (characterVisualRef.current) {
        let diff = (targetRotation.current - characterVisualRef.current.rotation.y) % (Math.PI * 2)
        if (diff < -Math.PI) diff += Math.PI * 2
        if (diff > Math.PI) diff -= Math.PI * 2
        characterVisualRef.current.rotation.y += diff * Math.min(1, 15 * delta)
      }
    }

    // Lógica de salto: comprobar si está sobre una superficie (velocidad vertical cercana a 0)
    let vy = currentVelocity.y
    const isGrounded = Math.abs(currentVelocity.y) < 0.2

    if (jump && isGrounded) {
      vy = 6 // Impulso vertical de salto
    }

    // Aplicar velocidad lineal al cuerpo rígido
    rigidBodyRef.current.setLinvel({ x: vx, y: vy, z: vz }, true)

    // Respawn de seguridad si cae fuera de la plataforma
    const currentPos = rigidBodyRef.current.translation()
    if (currentPos.y < -8) {
      rigidBodyRef.current.setTranslation({ x: 0, y: 3, z: 0 }, true)
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      name="character"
      colliders={false}
      position={position}
      friction={0.2}
      restitution={0}
      canSleep={false}
      // Bloquea completamente las rotaciones físicas (X, Y y Z)
      // para que el motor de físicas no haga girar al personaje por fricción
      lockRotations
    >
      {/* 
        Colisionador de cápsula adaptado a las dimensiones del personaje:
        args={[halfHeight, radius]} -> altura media 0.4, radio 0.35 (altura total ~1.5m)
      */}
      <CapsuleCollider args={[0.38, 0.35]} position={[0, 0.73, 0]} />

      {/* Contenedor visual del personaje (su rotación se maneja limpiamente en el useFrame) */}
      <group ref={characterVisualRef}>
        <CharacterModel isMoving={isMoving} />
      </group>
    </RigidBody>
  )
}

export default CharacterController
