import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { getFabricMaps, getWordmarkAlpha } from './fabricTextures'
import { createGarmentGeometries, darken, lighten } from './garment'

/**
 * The garment.
 *
 * Real geometry with real studio lighting and normal-mapped fabric. No GLB or
 * glTF hoodie asset exists in this repository and none is fetched from the
 * network, so the piece is constructed here from sculpted primitives — a
 * soft-edged body with displaced cloth folds, capsule sleeves, a spherical hood
 * shell, extruded rounded-rect trims — and presented as a studio object rather
 * than as a simulated worn garment.
 *
 * Changing `color` swaps the material colour of the same model: a material
 * change, not a physically simulated fabric dye.
 */
export default function HoodieModel({
  color = '#292A2D',
  detail = 'full',
  showWordmark = true,
  castShadow = true,
}) {
  const geometries = useMemo(() => createGarmentGeometries(detail), [detail])
  // The weave is a real generated surface: it has to repeat many times across a
  // garment-sized UV before it reads as cloth rather than as a visible mesh.
  const maps = useMemo(() => {
    const set = getFabricMaps()
    set.twill.normalTex.repeat.set(6, 6)
    set.twill.roughTex.repeat.set(6, 6)
    set.rib.normalTex.repeat.set(10, 10)
    set.rib.roughTex.repeat.set(10, 10)
    return set
  }, [])

  useEffect(() => {
    const set = geometries
    return () => Object.values(set).forEach((g) => g.dispose?.())
  }, [geometries])

  const fabric = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.94,
        metalness: 0,
        sheen: 0.55,
        sheenRoughness: 0.9,
        sheenColor: new THREE.Color('#ffffff'),
        normalMap: maps.twill.normalTex,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughnessMap: maps.twill.roughTex,
        envMapIntensity: 0.42,
      }),
    [color, maps],
  )

  const rib = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.96,
        metalness: 0,
        sheen: 0.35,
        sheenRoughness: 0.95,
        normalMap: maps.rib.normalTex,
        normalScale: new THREE.Vector2(0.9, 0.9),
        roughnessMap: maps.rib.roughTex,
        envMapIntensity: 0.35,
      }),
    [color, maps],
  )

  const lining = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(darken(color, 0.08)),
        roughness: 1,
        metalness: 0,
        side: THREE.BackSide,
        envMapIntensity: 0.15,
      }),
    [color],
  )

  const wordmarkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(lighten(color, 0.16)),
        roughness: 0.92,
        metalness: 0,
        transparent: true,
        opacity: 0.85,
        alphaMap: getWordmarkAlpha('ESSENTIALS'),
        depthWrite: false,
        envMapIntensity: 0.2,
      }),
    [color],
  )

  useEffect(
    () => () => {
      fabric.dispose()
      rib.dispose()
      lining.dispose()
      wordmarkMaterial.dispose()
    },
    [fabric, rib, lining, wordmarkMaterial],
  )

  return (
    <group dispose={null}>
      {/* Body */}
      <mesh geometry={geometries.body} material={fabric} position={[0, 0.16, 0]} castShadow={castShadow} />

      {/* Ribbed hem band */}
      <mesh geometry={geometries.hem} material={rib} position={[0, -0.505, 0]} castShadow={castShadow} />

      {/* Sleeves with ribbed cuffs */}
      {[1, -1].map((side) => (
        <group key={side} position={[side * 0.52, 0.6, 0]} rotation={[-0.05, 0, side * 0.72]}>
          <mesh geometry={geometries.sleeve} material={fabric} position={[0, 0.34, 0]} castShadow={castShadow} />
          <mesh geometry={geometries.cuff} material={rib} position={[0, 0.72, 0]} castShadow={castShadow} />
        </group>
      ))}

      {/* Hood shell with a darker lining */}
      <group position={[0, 0.78, -0.08]} rotation={[-0.34, 0, 0]}>
        <mesh geometry={geometries.hood} material={fabric} scale={[1.12, 1, 1.06]} castShadow={castShadow} />
        <mesh geometry={geometries.hoodInner} material={lining} scale={[1.06, 0.96, 1]} />
      </group>

      {/* Ribbed collar */}
      <mesh
        geometry={geometries.collar}
        material={rib}
        position={[0, 0.735, -0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow={castShadow}
      />

      {/* Kangaroo pocket piping */}
      <mesh geometry={geometries.pocket} material={fabric} position={[0, -0.13, 0.295]} />

      {/* Drawstrings and toggles */}
      {[1, -1].map((side) => (
        <group key={`cord-${side}`} position={[side * 0.135, 0.585, 0.29]} rotation={[0.16, 0, side * 0.1]}>
          <mesh geometry={geometries.cord} material={rib} position={[0, -0.12, 0]} castShadow={castShadow} />
          <mesh geometry={geometries.toggle} material={rib} position={[0, -0.29, 0]} />
        </group>
      ))}

      {/* Tone-on-tone chest wordmark */}
      {showWordmark && (
        <mesh geometry={geometries.wordmark} material={wordmarkMaterial} position={[0, 0.36, 0.362]} rotation={[-0.05, 0, 0]} />
      )}
    </group>
  )
}
