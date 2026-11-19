import { RigidBody } from '@react-three/rapier'

/**
 * Plataforma base fija para que el personaje u objetos caminen sobre ella.
 * @param {'circular' | 'polygonal'} shape - Forma de la plataforma ('circular' o 'polygonal')
 * @param {number} radius - Radio de la base
 * @param {number} height - Grosor/altura del suelo
 * @param {number} segments - Segmentos radiales (6 para hexágono, 8 para octágono, 32/64 para circular)
 */
export function Platform({
  shape = 'circular',
  radius = 8,
  height = 0.5,
  segments = shape === 'polygonal' ? 6 : 64,
  position = [0, -height / 2, 0],
  ...props
}) {
  // Número de segmentos según la forma seleccionada
  const radialSegments = shape === 'polygonal' ? (segments || 6) : 64

  return (
    <group position={position} {...props}>
      {/* 
        RigidBody con type="fixed":
        Garantiza que la plataforma no se mueva, no caiga por gravedad ni reaccione
        a las fuerzas de los personajes u objetos que caminan sobre ella.
        
        colliders="hull":
        Genera un colisionador de envolvente convexa (Convex Hull) que coincide exactamente 
        con la forma cilíndrica o poligonal de la geometría, evitando que el personaje 
        camine sobre esquinas invisibles que dejaría un colisionador cúbico por defecto.
      */}
      <RigidBody type="fixed" colliders="hull" friction={1} restitution={0.2}>
        {/* Cuerpo principal de la plataforma */}
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[radius, radius * 1.05, height, radialSegments]} />
          <meshStandardMaterial
            color="#18203bff"
            roughness={0.4}
            metalness={0.6}
            wireframe={false}
          />
        </mesh>

        {/* Anillo exterior decorativo / borde de seguridad */}
        <mesh position={[0, height * 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[radius * 0.98, radius * 0.98, height * 1.02, radialSegments]} />
          <meshStandardMaterial
            color="#2d3748"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Superficie superior transitable */}
        <mesh position={[0, height * 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[radius * 0.92, radius * 0.92, height * 1.04, radialSegments]} />
          <meshStandardMaterial
            color="#b9bec9ff"
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Anillo de luz / energía perimetral estilo Ciber Guardián */}
        <mesh position={[0, height * 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.88, radius * 0.91, radialSegments]} />
          <meshBasicMaterial color="#00e5ff" toneMapped={false} />
        </mesh>

        {/* Marcador central AVA */}
        <mesh position={[0, height * 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.18, radius * 0.22, radialSegments]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
      </RigidBody>
    </group>
  )
}

export default Platform
