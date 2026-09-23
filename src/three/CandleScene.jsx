import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import CandleModel from './CandleModel.jsx'

// Gentle intro: camera glides in on first mount.
function CameraRig() {
  const ref = useRef({ t: 0 })
  useFrame((state, dt) => {
    const r = ref.current
    if (r.t >= 1) return
    r.t = Math.min(1, r.t + dt * 0.55)
    const e = 1 - Math.pow(1 - r.t, 3)
    const start = 7.4
    const end = 4.9
    const d = start + (end - start) * e
    const az = 0.62
    state.camera.position.set(Math.sin(az) * d, 2.15 - 0.35 * e, Math.cos(az) * d)
    state.camera.lookAt(0, 1.02, 0)
  })
  return null
}

export default function CandleScene({ config }) {
  return (
    <Canvas
      className="candle-canvas"
      dpr={[1, 2]}
      camera={{ position: [3.2, 2.0, 4.6], fov: 34, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} color="#fff2df" />
        <directionalLight position={[4.5, 6.5, 4]} intensity={1.35} color="#fff4e0" />
        <directionalLight position={[-5, 3.5, -4]} intensity={0.45} color="#e8d9ff" />
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={5} position={[0, 5, -9]} scale={2.2} color="#fff1d6" />
            <Lightformer form="rect" intensity={2.4} position={[-5, 1, -1]} scale={[3.5, 1.4]} color="#ffe3b8" />
            <Lightformer form="rect" intensity={2.0} position={[5, 1.5, 0]} scale={[3, 1.6]} color="#f6e7ff" />
            <Lightformer form="rect" intensity={1.1} position={[0, 3, 6]} scale={[4, 2]} color="#ffffff" />
          </group>
        </Environment>

        <group position={[0, -0.02, 0]}>
          <CandleModel config={config} />
        </group>

        <pointLight position={[0, 0.1, 0]} intensity={0.65} color="#ff881a" distance={4} />

        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.72}
          scale={11}
          blur={2.4}
          far={4.2}
          resolution={512}
          color="#000000"
          frames={Infinity}
        />

        <OrbitControls
          makeDefault
          target={[0, 1.05, 0]}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.85}
          minDistance={2.6}
          maxDistance={9.5}
          minPolarAngle={0.18}
          maxPolarAngle={1.48}
          autoRotate
          autoRotateSpeed={0.55}
          zoomSpeed={0.8}
        />
        <CameraRig />
      </Suspense>
    </Canvas>
  )
}
