import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import HoodieModel from './HoodieModel'
import { StudioEnvironment, StudioFloor, StudioLights } from './StudioLights'
import { rig, sampleCamera, CAMERA_KEYS, layoutFor } from './sceneState'
import { useInView } from '../lib/useInView'
import { useIsMobile, usePrefersReducedMotion } from '../lib/motion'

/**
 * The pinned studio stage that carries chapters 01–05.
 *
 * Scrolling drives one master progress value (written by the scroll controller)
 * which is sampled into camera + model keyframes every frame. The camera follows
 * the scroll position itself, so scrolling back up reverses the sequence
 * naturally and scrolling is never hijacked or locked.
 */
export default function StageCanvas({ color }) {
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { rootMargin: '140px' })
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const sampleRef = useRef(sampleCamera(0, CAMERA_KEYS))

  return (
    <div className="stage__canvas" ref={wrapRef} aria-hidden="true">
      <Canvas
        // Paused while off screen: no idle render loop is left running.
        frameloop={inView ? 'always' : 'never'}
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.3] : [1, 1.75]}
        camera={{ position: [0, 0.16, 3.45], fov: 32, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.16
        }}
        style={{ pointerEvents: 'none' }}
      >
        <RigCamera sampleRef={sampleRef} reduced={reduced} />
        <StudioEnvironment />
        <StudioLights sampleRef={sampleRef} castShadow={!isMobile} />
        <SceneModel
          color={color}
          detail={isMobile ? 'reduced' : 'full'}
          sampleRef={sampleRef}
          reduced={reduced}
        />
        <StudioFloor shadows={!isMobile} resolution={isMobile ? 256 : 512} />
      </Canvas>
    </div>
  )
}

function RigCamera({ sampleRef, reduced }) {
  const camera = useThree((s) => s.camera)
  const width = useThree((s) => s.size.width)
  const layout = layoutFor(width)
  const position = useRef(new THREE.Vector3(0, 0.16, 3.45))
  const target = useRef(new THREE.Vector3(0, 0.18, 0))
  const tmpPos = useRef(new THREE.Vector3())
  const tmpTarget = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const s = layout.adjust(sampleCamera(rig.progress, CAMERA_KEYS))
    sampleRef.current = s
    const parallaxX = reduced ? 0 : rig.pointerX * 0.16
    const parallaxY = reduced ? 0 : rig.pointerY * 0.11
    tmpPos.current.set(s.position[0] + parallaxX, s.position[1] + parallaxY, s.position[2])
    tmpTarget.current.set(s.target[0], s.target[1], s.target[2])
    // Critically damped follow keeps the motion weighted rather than snappy.
    const k = reduced ? 1 : 1 - Math.exp(-delta * 7.5)
    position.current.lerp(tmpPos.current, k)
    target.current.lerp(tmpTarget.current, k)
    camera.position.copy(position.current)
    camera.lookAt(target.current)
    if (Math.abs(camera.fov - s.fov) > 0.02) {
      camera.fov = s.fov
      camera.updateProjectionMatrix()
    }
  }, -2)

  return null
}

function SceneModel({ color, detail, sampleRef, reduced }) {
  const group = useRef()
  const width = useThree((s) => s.size.width)
  const layout = layoutFor(width)

  useFrame((state, delta) => {
    const s = sampleRef.current
    const g = group.current
    if (!s || !g) return
    // Idle drift only while the hero is the active chapter, and never when the
    // visitor asked for reduced motion.
    const heroWeight = Math.max(0, 1 - rig.progress / 0.1)
    const amp = reduced ? 0 : heroWeight
    const t = state.clock.elapsedTime
    const k = 1 - Math.exp(-delta * 8)
    const targetX = s.posX * layout.model.xScale
    const targetY = layout.model.y + s.posY
    const targetScale = layout.model.scale * s.scale
    g.rotation.y += (s.rotY + Math.sin(t * 0.33) * 0.075 * amp - g.rotation.y) * k
    g.rotation.x += (s.rotX + Math.sin(t * 0.45 + 0.7) * 0.02 * amp - g.rotation.x) * k
    g.position.x += (targetX - g.position.x) * k
    g.position.y += (targetY + Math.sin(t * 0.5) * 0.012 * amp - g.position.y) * k
    g.scale.x += (targetScale - g.scale.x) * k
    g.scale.y = g.scale.x
    g.scale.z = g.scale.x
  })

  return (
    <group ref={group}>
      <HoodieModel color={color} detail={detail} showWordmark />
    </group>
  )
}
