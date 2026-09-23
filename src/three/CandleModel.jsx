import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import Flame from './Flame.jsx'
import { createLabelTexture, drawLabel } from './LabelTexture.js'
import { getSize, getWaxHex } from '../config/options.js'

const BASE_Y = 0.12

// One shared wax material per candle so colour changes can be lerped smoothly.
function useWaxMaterial(hex) {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        roughness: 0.48,
        metalness: 0,
        clearcoat: 0.18,
        clearcoatRoughness: 0.6,
        sheen: 0.5,
        sheenRoughness: 0.7,
        sheenColor: new THREE.Color('#ffe9c8'),
        specularIntensity: 0.45,
      }),
    []
  )
  const target = useMemo(() => new THREE.Color(hex), [hex])
  useFrame((_, dt) => {
    material.color.lerp(target, 1 - Math.exp(-8 * dt))
  })
  useEffect(() => () => material.dispose(), [material])
  return material
}

function heartGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0.5, 0.5)
  s.bezierCurveTo(0.5, 0.5, 0.4, 0, 0, 0)
  s.bezierCurveTo(-0.6, 0, -0.6, 0.7, -0.6, 0.7)
  s.bezierCurveTo(-0.6, 1.1, -0.3, 1.54, 0.5, 1.9)
  s.bezierCurveTo(1.2, 1.54, 1.6, 1.1, 1.6, 0.7)
  s.bezierCurveTo(1.6, 0.7, 1.6, 0, 1, 0)
  s.bezierCurveTo(0.7, 0, 0.5, 0.5, 0.5, 0.5)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.72,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.06,
    bevelSegments: 4,
    curveSegments: 28,
  })
  geo.center()
  geo.scale(0.98, 0.98, 0.98)
  return geo
}

function flowerGeometry() {
  const petals = 8
  const pts = []
  const steps = 160
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const r = 0.98 * (0.84 + 0.16 * Math.cos(petals * a))
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r))
  }
  const s = new THREE.Shape(pts)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.78,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 12,
  })
  geo.center()
  return geo
}

function pillarGeometry() {
  const pts = []
  pts.push(new THREE.Vector2(0.001, 0))
  pts.push(new THREE.Vector2(0.68, 0))
  pts.push(new THREE.Vector2(0.78, 0.05))
  pts.push(new THREE.Vector2(0.8, 0.28))
  pts.push(new THREE.Vector2(0.8, 1.82))
  pts.push(new THREE.Vector2(0.77, 2.02))
  pts.push(new THREE.Vector2(0.6, 2.16))
  pts.push(new THREE.Vector2(0.3, 2.22))
  pts.push(new THREE.Vector2(0.1, 2.2))
  pts.push(new THREE.Vector2(0.001, 2.18))
  return new THREE.LatheGeometry(pts, 64)
}

function Wick({ y }) {
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={[0.032, 0.026, 0.22, 10]} />
      <meshStandardMaterial color="#241812" roughness={0.9} />
    </mesh>
  )
}

function MeltPool({ y, r = 0.15 }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[r, 28]} />
      <meshPhysicalMaterial color="#fff3d8" roughness={0.22} clearcoat={0.7} />
    </mesh>
  )
}

function Coaster() {
  return (
    <mesh position={[0, 0.06, 0]} receiveShadow>
      <cylinderGeometry args={[1.52, 1.58, 0.12, 64]} />
      <meshStandardMaterial color="#e6d8bf" roughness={0.85} metalness={0.02} />
    </mesh>
  )
}

// Live label: redrawn onto a canvas texture whenever the design changes.
function useLabelTexture(config) {
  const pack = useMemo(() => createLabelTexture(), [])
  useEffect(() => {
    let alive = true
    drawLabel(pack.canvas, config).then(() => {
      if (alive) pack.texture.needsUpdate = true
    })
    return () => {
      alive = false
    }
  }, [
    pack,
    config.label,
    config.text,
    config.textFont,
    config.textColor,
    config.textSize,
    config.textAlign,
    config.fragrance,
    config.customFragrance,
  ])
  return pack.texture
}

function CurvedLabel({ radius, height, y, theta, texture }) {
  return (
    <mesh position={[0, y, 0]} renderOrder={2}>
      <cylinderGeometry
        args={[radius, radius, height, 48, 1, true, Math.PI / 2 - theta / 2, theta]}
      />
      <meshStandardMaterial
        map={texture}
        roughness={0.62}
        metalness={0}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  )
}

function FlatLabel({ y, z, w, h, texture }) {
  return (
    <mesh position={[0, y, z]} renderOrder={2}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.62} metalness={0} />
    </mesh>
  )
}

const GLASS_MAT = {
  transmission: 0.96,
  thickness: 0.28,
  roughness: 0.06,
  ior: 1.5,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2,
  attenuationDistance: 2.5,
  attenuationColor: '#f2e3c8',
  specularIntensity: 1,
  transparent: true,
}

function JarCandle({ wax, label }) {
  return (
    <group>
      <mesh position={[0, BASE_Y + 0.85, 0]}>
        <cylinderGeometry args={[1.05, 0.97, 1.7, 64, 1, true]} />
        <meshPhysicalMaterial {...GLASS_MAT} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, BASE_Y + 0.035, 0]}>
        <cylinderGeometry args={[0.97, 0.97, 0.07, 64]} />
        <meshPhysicalMaterial {...GLASS_MAT} />
      </mesh>
      <mesh position={[0, BASE_Y + 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.03, 0.028, 12, 64]} />
        <meshPhysicalMaterial {...GLASS_MAT} />
      </mesh>
      <mesh position={[0, BASE_Y + 0.675, 0]} material={wax}>
        <cylinderGeometry args={[0.9, 0.88, 1.35, 64]} />
      </mesh>
      <MeltPool y={BASE_Y + 1.352} r={0.16} />
      <Wick y={BASE_Y + 1.44} />
      <Flame position={[0, BASE_Y + 1.9, 0]} />
      <CurvedLabel radius={1.062} height={1.02} y={BASE_Y + 0.92} theta={1.72} texture={label} />
    </group>
  )
}

function PillarCandle({ wax, label }) {
  const geo = useMemo(() => pillarGeometry(), [])
  return (
    <group>
      <mesh position={[0, BASE_Y, 0]} material={wax} geometry={geo} />
      <MeltPool y={BASE_Y + 2.185} r={0.17} />
      <Wick y={BASE_Y + 2.28} />
      <Flame position={[0, BASE_Y + 2.74, 0]} />
      <CurvedLabel radius={0.815} height={1.12} y={BASE_Y + 1.18} theta={1.85} texture={label} />
    </group>
  )
}

function HeartCandle({ wax, label }) {
  const geo = useMemo(() => heartGeometry(), [])
  return (
    <group>
      <mesh position={[0, BASE_Y + 0.98, 0]} material={wax} geometry={geo} />
      <MeltPool y={BASE_Y + 1.63} r={0.13} />
      <Wick y={BASE_Y + 1.7} />
      <Flame position={[0, BASE_Y + 2.14, 0]} />
      <FlatLabel y={BASE_Y + 0.9} z={0.47} w={1.34} h={0.84} texture={label} />
    </group>
  )
}

function FlowerCandle({ wax, label }) {
  const geo = useMemo(() => flowerGeometry(), [])
  return (
    <group>
      <mesh position={[0, BASE_Y + 1.0, 0]} material={wax} geometry={geo} />
      <MeltPool y={BASE_Y + 1.99} r={0.13} />
      <Wick y={BASE_Y + 2.06} />
      <Flame position={[0, BASE_Y + 2.5, 0]} />
      <FlatLabel y={BASE_Y + 0.98} z={0.47} w={1.28} h={0.8} texture={label} />
    </group>
  )
}

const BOX_THEMES = {
  gift: { box: '#f1e6d0', lid: '#e9dac0', ribbon: '#b9855a' },
  premium: { box: '#41301f', lid: '#4c3a26', ribbon: '#c9a25e' },
}

function GiftBox({ kind }) {
  const theme = BOX_THEMES[kind] || BOX_THEMES.gift
  const pop = useRef()
  useFrame((_, dt) => {
    if (!pop.current) return
    const s = THREE.MathUtils.damp(pop.current.scale.x, 1, 6, dt)
    pop.current.scale.setScalar(s)
  })
  useEffect(() => {
    if (pop.current) pop.current.scale.setScalar(0.001)
  }, [kind])
  return (
    <group ref={pop} position={[1.95, 0, -0.62]} rotation={[0, -0.38, 0]}>
      <RoundedBox args={[1.5, 1.05, 1.5]} radius={0.055} smoothness={4} position={[0, 0.53, 0]}>
        <meshStandardMaterial color={theme.box} roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[1.62, 0.26, 1.62]} radius={0.06} smoothness={4} position={[0, 1.16, 0]}>
        <meshStandardMaterial color={theme.lid} roughness={0.66} />
      </RoundedBox>
      <mesh position={[0, 0.665, 0]}>
        <boxGeometry args={[0.17, 1.35, 1.64]} />
        <meshStandardMaterial color={theme.ribbon} roughness={0.38} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.665, 0]}>
        <boxGeometry args={[1.64, 1.35, 0.17]} />
        <meshStandardMaterial color={theme.ribbon} roughness={0.38} metalness={0.15} />
      </mesh>
      <mesh position={[-0.13, 1.36, 0]} rotation={[0.5, 0, 0.9]}>
        <torusGeometry args={[0.12, 0.034, 10, 24]} />
        <meshStandardMaterial color={theme.ribbon} roughness={0.38} metalness={0.15} />
      </mesh>
      <mesh position={[0.13, 1.36, 0]} rotation={[0.5, 0, -0.9]}>
        <torusGeometry args={[0.12, 0.034, 10, 24]} />
        <meshStandardMaterial color={theme.ribbon} roughness={0.38} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.33, 0]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial color={theme.ribbon} roughness={0.38} metalness={0.15} />
      </mesh>
    </group>
  )
}

const SHAPES = { jar: JarCandle, pillar: PillarCandle, heart: HeartCandle, flower: FlowerCandle }

export default function CandleModel({ config }) {
  const size = getSize(config.size)
  const wax = useWaxMaterial(getWaxHex(config))
  const label = useLabelTexture(config)
  const sizeRef = useRef()
  const popRef = useRef()

  useFrame((_, dt) => {
    if (sizeRef.current) {
      const s = THREE.MathUtils.damp(sizeRef.current.scale.x, size.scale, 6, dt)
      sizeRef.current.scale.setScalar(s)
    }
    if (popRef.current) {
      const s = THREE.MathUtils.damp(popRef.current.scale.x, 1, 7, dt)
      popRef.current.scale.setScalar(s)
    }
  })

  useEffect(() => {
    if (popRef.current) popRef.current.scale.setScalar(0.82)
  }, [config.shape])

  const Shape = SHAPES[config.shape] || JarCandle

  return (
    <group>
      <Coaster />
      <group ref={sizeRef}>
        <group ref={popRef}>
          <Shape wax={wax} label={label} />
        </group>
      </group>
      {config.packaging !== 'standard' && <GiftBox key={config.packaging} kind={config.packaging} />}
    </group>
  )
}
