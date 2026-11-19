import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

/**
 * Obstáculo giratorio tipo "Kicker" (Fall Guys).
 * Se activa a partir de la etapa 3 para aumentar la dificultad.
 * Es un brazo horizontal que rota continuamente empujando al personaje.
 */
export function Kicker({ speed = 1.5, armLength = 14, armHeight = 1 }) {
  const rigidBodyRef = useRef()
  const angleRef = useRef(0)

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return

    angleRef.current += speed * delta
    const rotation = new THREE.Quaternion()
    rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleRef.current)
    rigidBodyRef.current.setNextKinematicRotation(rotation)
  })

  return (
    <group>
      {/* Poste central fijo del kicker */}
      <RigidBody type="fixed" colliders="hull" position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 2, 16]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        {/* Luz de advertencia en la cima */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={2}
          />
        </mesh>
      </RigidBody>

      {/* Brazo giratorio kinematic */}
      <RigidBody
        ref={rigidBodyRef}
        type="kinematicPosition"
        colliders="cuboid"
        position={[0, armHeight, 0]}
        restitution={0.5}
        friction={0.3}
      >
        {/* Brazo principal */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[armLength, 0.3, 0.4]} />
          <meshStandardMaterial
            color="#dc2626"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Franjas de peligro en los extremos */}
        <mesh position={[armLength / 2 - 0.3, 0, 0]}>
          <boxGeometry args={[0.6, 0.42, 0.52]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-(armLength / 2 - 0.3), 0, 0]}>
          <boxGeometry args={[0.6, 0.42, 0.52]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
      </RigidBody>
    </group>
  )
}

export default Kicker
