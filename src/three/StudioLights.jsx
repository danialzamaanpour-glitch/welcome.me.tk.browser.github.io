import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { makeStudioEquirect } from './studioEnv'

/**
 * Procedural studio environment for the physical material. Generated locally and
 * prefiltered with PMREM — no HDRI is downloaded.
 */
export function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const source = new THREE.CanvasTexture(makeStudioEquirect())
    source.mapping = THREE.EquirectangularReflectionMapping
    source.colorSpace = THREE.SRGBColorSpace
    const env = pmrem.fromEquirectangular(source).texture
    scene.environment = env
    source.dispose()
    pmrem.dispose()
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [gl, scene])

  return null
}

/**
 * Soft studio lighting: overhead key with real shadowing, broad fill from the
 * opposite side, hemisphere ambience and a rim light that lifts the silhouette.
 * Intensities are modulated along the scroll by the rig sample.
 */
export function StudioLights({ sampleRef, castShadow = true }) {
  const key = useRef()
  const rim = useRef()
  const fill = useRef()

  useFrame(() => {
    const s = sampleRef.current
    if (!s) return
    if (key.current) key.current.intensity = s.keyLight
    if (rim.current) rim.current.intensity = s.rimLight
    if (fill.current) fill.current.intensity = s.fillLight
  })

  return (
    <>
      <hemisphereLight args={['#ffffff', '#d4d4d3', 0.62]} />
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight
        ref={key}
        position={[2.4, 4.1, 2.6]}
        intensity={1.85}
        color="#ffffff"
        castShadow={castShadow}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0008}
        shadow-normalBias={0.02}
        shadow-radius={5}
      />
      <directionalLight ref={fill} position={[-3.2, 1.7, 2.4]} intensity={0.55} color="#ffffff" />
      <spotLight
        ref={rim}
        position={[-1.4, 3.1, -3.4]}
        angle={0.7}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        distance={12}
      />
    </>
  )
}

/**
 * The ground contact.
 *
 * A real floor plane was removed deliberately: at this camera range a lit disc
 * read as a display pedestal rather than a studio floor. What stays is the soft
 * projected shadow, so the garment reads as standing on an invisible floor while
 * the CSS backdrop supplies the studio wall.
 */
export function StudioFloor({ shadows = true, resolution = 512 }) {
  if (!shadows) return null
  return (
    <group position={[0, -0.585, 0]}>
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.3}
        scale={4.8}
        blur={3.2}
        far={1.6}
        resolution={resolution}
        color="#0a0a0a"
      />
    </group>
  )
}
