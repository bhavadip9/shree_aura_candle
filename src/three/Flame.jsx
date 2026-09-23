import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'

const vertexShader = [
  'uniform float uTime;',
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  vec3 p = position;',
  '  float sway = sin(uTime * 6.5 + p.y * 9.0) * 0.045 * (p.y + 0.6);',
  '  p.x += sway;',
  '  p.x *= 1.0 - smoothstep(0.2, 1.0, uv.y) * 0.22;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);',
  '}',
].join('\n')

const fragmentShader = [
  'uniform float uTime;',
  'varying vec2 vUv;',
  'void main() {',
  '  float y = vUv.y;',
  '  float d = abs(vUv.x - 0.5) * 2.0;',
  '  float w = 0.62 * pow(max(1.0 - y, 0.0), 0.72) * smoothstep(-0.05, 0.28, y);',
  '  float body = smoothstep(w, w * 0.22, d);',
  '  body *= smoothstep(0.0, 0.05, y) * smoothstep(1.0, 0.88, y);',
  '  if (body < 0.003) discard;',
  '  vec3 edge = vec3(0.93, 0.42, 0.09);',
  '  vec3 mid = vec3(1.0, 0.66, 0.22);',
  '  vec3 core = vec3(1.0, 0.94, 0.78);',
  '  vec3 col = mix(edge, mid, smoothstep(0.04, 0.5, body));',
  '  col = mix(col, core, smoothstep(0.45, 0.95, body) * (1.0 - y * 0.55));',
  '  float flicker = 0.86 + 0.14 * sin(uTime * 12.7) * sin(uTime * 7.3 + 1.7);',
  '  gl_FragColor = vec4(col * (0.92 + 0.2 * flicker), body * (0.72 + 0.28 * flicker));',
  '}',
].join('\n')

export default function Flame({ position = [0, 0, 0], scale = 1 }) {
  const lightRef = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    if (lightRef.current) {
      lightRef.current.intensity =
        1.5 + Math.sin(t * 11.3) * 0.24 + Math.sin(t * 23.7) * 0.12
    }
  })

  return (
    <group position={position} scale={scale}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.36, 0.82, 12, 24]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.NormalBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
      <pointLight
        ref={lightRef}
        position={[0, 0.2, 0]}
        color="#ffab4a"
        intensity={1.5}
        distance={6}
        decay={2}
      />
    </group>
  )
}
