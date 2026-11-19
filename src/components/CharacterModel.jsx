import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Modelo 3D de personaje básico para el Ciber Guardián (Misión AVA).
 * Compuesto por geometrías estilizadas con estética cibernética/robótica.
 */
export function CharacterModel({ isMoving = false }) {
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  // Animación básica procedural de caminata al moverse
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 10
    if (isMoving) {
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time) * 0.6
        rightLegRef.current.rotation.x = -Math.sin(time) * 0.6
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(time) * 0.5
        rightArmRef.current.rotation.x = Math.sin(time) * 0.5
      }
    } else {
      // Reposo (idle)
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.2)
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.2)
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.2)
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.2)
      }
    }
  })

  return (
    <group position={[0, 0, 0]} dispose={null}>
      {/* --- CABEZA & VISOR --- */}
      <group position={[0, 1.25, 0]}>
        {/* Casco */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.36, 0.38]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Visor holográfico ciberpunk */}
        <mesh position={[0, 0.02, 0.2]}>
          <boxGeometry args={[0.32, 0.12, 0.04]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>
        {/* Antena / Sensor */}
        <mesh position={[0.16, 0.22, -0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.18]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* --- TORSO & ARMADURA --- */}
      <group position={[0, 0.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.55, 0.32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Núcleo de energía en el pecho (Reactor AVA) */}
        <mesh position={[0, 0.08, 0.17]}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#00e5ff"
            emissiveIntensity={2}
            roughness={0.1}
          />
        </mesh>

        {/* Mochila propulsora (Jetpack) */}
        <mesh position={[0, 0.05, -0.2]} castShadow>
          <boxGeometry args={[0.32, 0.38, 0.12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Toberas de propulsión */}
        <mesh position={[-0.09, -0.16, -0.2]}>
          <cylinderGeometry args={[0.04, 0.05, 0.08]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.09, -0.16, -0.2]}>
          <cylinderGeometry args={[0.04, 0.05, 0.08]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* --- BRAZOS --- */}
      {/* Brazo Izquierdo */}
      <group ref={leftArmRef} position={[-0.34, 0.95, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Brazo Derecho */}
      <group ref={rightArmRef} position={[0.34, 0.95, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* --- PIERNAS --- */}
      {/* Pierna Izquierda */}
      <group ref={leftLegRef} position={[-0.15, 0.5, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.16, 0.48, 0.18]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Pierna Derecha */}
      <group ref={rightLegRef} position={[0.15, 0.5, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.16, 0.48, 0.18]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export default CharacterModel
