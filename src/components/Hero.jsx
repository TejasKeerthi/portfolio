import { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three-stdlib'
import * as THREE from 'three'
import { motion } from 'framer-motion'

extend({ RoundedBoxGeometry })

const FLOAT_SPEED = 0.15
const FLOAT_Y = 0.08
const FLOAT_ROT_SPEED = 0.005
const PARALLAX_STRENGTH = 0.2
const LERP_FACTOR = 0.025

function Keycap({ position, emissiveColor = '#94a3b8', emissiveIntensity = 0.6 }) {
    return (
        <mesh position={position} castShadow>
            <roundedBoxGeometry args={[0.38, 0.18, 0.38, 0.06, 4]} />
            <meshStandardMaterial color="#141820" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} roughness={0.3} metalness={0.8} />
        </mesh>
    )
}

function Macropad() {
    const groupRef = useRef()
    const baseRef = useRef()
    const mouseTarget = useRef({ x: 0, y: 0 })
    const currentRot = useRef({ x: 0, y: 0 })

    const keys = useMemo(() => {
        const rows = 3, cols = 3, spacing = 0.48
        const ox = -((cols - 1) * spacing) / 2
        const oz = -((rows - 1) * spacing) / 2
        const colors = ['#94a3b8','#b0bec5','#cbd5e1','#78909c','#94a3b8','#e2e8f0','#b0bec5','#cbd5e1','#78909c']
        const r = []
        for (let row = 0; row < rows; row++)
            for (let col = 0; col < cols; col++) {
                const idx = row * cols + col
                r.push({ pos: [ox + col * spacing, 0.18, oz + row * spacing], color: colors[idx], intensity: 0.5 + Math.random() * 0.4 })
            }
        return r
    }, [])

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime()
        const dt = Math.min(delta, 0.05)
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * FLOAT_SPEED) * FLOAT_Y
            groupRef.current.rotation.y += FLOAT_ROT_SPEED * dt * 60
        }
        const p = state.pointer
        mouseTarget.current.x = p.y * PARALLAX_STRENGTH
        mouseTarget.current.y = p.x * PARALLAX_STRENGTH
        if (baseRef.current) {
            currentRot.current.x += (mouseTarget.current.x - currentRot.current.x) * LERP_FACTOR
            currentRot.current.y += (mouseTarget.current.y - currentRot.current.y) * LERP_FACTOR
            baseRef.current.rotation.x = currentRot.current.x
            baseRef.current.rotation.y = currentRot.current.y
        }
    })

    return (
        <group ref={baseRef}>
            <group ref={groupRef}>
                <mesh castShadow receiveShadow><boxGeometry args={[2, 0.15, 1.8]} /><meshStandardMaterial color="#0c0f14" roughness={0.3} metalness={0.95} /></mesh>
                <mesh position={[0, 0.08, 0]} castShadow><boxGeometry args={[1.85, 0.06, 1.65]} /><meshStandardMaterial color="#12161e" roughness={0.4} metalness={0.9} /></mesh>
                {keys.map((k, i) => <Keycap key={i} position={k.pos} emissiveColor={k.color} emissiveIntensity={k.intensity} />)}
                <mesh position={[0, 0.26, -0.72]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.14, 24]} /><meshStandardMaterial color="#1a1e26" emissive="#94a3b8" emissiveIntensity={0.3} roughness={0.2} metalness={0.95} /></mesh>
                <mesh position={[0, 0.01, 0.92]}><boxGeometry args={[1.4, 0.02, 0.04]} /><meshStandardMaterial color="#94a3b8" emissive="#cbd5e1" emissiveIntensity={1.5} toneMapped={false} /></mesh>
            </group>
        </group>
    )
}

function MouseLight() {
    const ref = useRef()
    useFrame((s) => { if (ref.current) { ref.current.position.x = s.pointer.x * 3; ref.current.position.y = 3 + s.pointer.y * 1.5; ref.current.position.z = 3 } })
    return <pointLight ref={ref} intensity={25} color="#e2e8f0" distance={10} decay={2} />
}

function Particles({ count = 60 }) {
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) { p[i*3]=(Math.random()-0.5)*20; p[i*3+1]=(Math.random()-0.5)*20; p[i*3+2]=(Math.random()-0.5)*20 }
        return p
    }, [count])
    const ref = useRef()
    useFrame((_, d) => { if (ref.current) ref.current.rotation.y += 0.004 * Math.min(d, 0.05) * 60 })
    return (
        <points ref={ref}>
            <bufferGeometry><bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} /></bufferGeometry>
            <pointsMaterial size={0.03} color="#cbd5e1" transparent opacity={0.3} sizeAttenuation />
        </points>
    )
}

/* ── Stagger container ── */
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
    return (
        <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Dark overlay to prevent white wash */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(6,8,9,0.4) 0%, rgba(6,8,9,0.85) 70%)', pointerEvents: 'none', zIndex: 1 }} />

            {/* Glow orbs */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
                <div className="animate-pulse-glow" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(148,163,184,0.10) 0%, transparent 65%)' }} />
                <div className="animate-pulse-glow" style={{ position: 'absolute', bottom: '20%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,116,139,0.08) 0%, transparent 65%)', animationDelay: '2.5s' }} />
            </div>

            {/* 3D Canvas */}
            <div className="hero-canvas">
                <Canvas shadows camera={{ position: [0, 2.5, 5.5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
                    <color attach="background" args={['transparent']} />
                    <fog attach="fog" args={['#060809', 8, 18]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={512} />
                    <pointLight position={[-4, 3, -3]} intensity={10} color="#b0bec5" distance={10} decay={2} />
                    <MouseLight />
                    <Macropad />
                    <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={8} blur={2} far={4} color="#94a3b8" />
                    <Particles />
                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Text overlay */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}
            >
                <motion.p
                    variants={fadeUp}
                    style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 24, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}
                >
                    Data Science & AI/ML
                </motion.p>

                <motion.h1
                    variants={fadeUp}
                    style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 24, color: '#ffffff', textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
                >
                    Turning{' '}
                    <span className="gradient-text">Data</span>
                    <br />
                    Into Intelligence
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7, color: 'var(--text-secondary)' }}
                >
                    I build intelligent systems powered by machine learning, deep learning, and data-driven insights — from predictive models to end-to-end AI pipelines.
                </motion.p>

                <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <motion.a
                        href="#projects"
                        whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(148,163,184,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.96 }}
                        style={{ padding: '14px 32px', borderRadius: 999, fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', color: '#e2e8f0', textDecoration: 'none', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(148,163,184,0.15)' }}
                    >
                        View Work
                    </motion.a>
                    <motion.a
                        href="#about"
                        whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.96 }}
                        className="glass-card"
                        style={{ padding: '14px 32px', borderRadius: 999, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                    >
                        About Me
                    </motion.a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
                <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, var(--accent-light), transparent)' }}
                />
            </motion.div>

            {/* Bottom fade */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to top, var(--bg-primary), transparent)', pointerEvents: 'none' }} />
        </section>
    )
}
