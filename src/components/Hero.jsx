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

const HERO_LINES = ['Designing', 'Intelligence', 'In Motion']

function Keycap({ position, emissiveColor = '#7c3aed', emissiveIntensity = 0.6 }) {
    return (
        <mesh position={position} castShadow>
            <roundedBoxGeometry args={[0.38, 0.18, 0.38, 0.06, 4]} />
            <meshStandardMaterial color="#15102a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} roughness={0.3} metalness={0.8} />
        </mesh>
    )
}

function Macropad() {
    const groupRef = useRef()
    const baseRef = useRef()
    const mouseTarget = useRef({ x: 0, y: 0 })
    const currentRot = useRef({ x: 0, y: 0 })

    const keys = useMemo(() => {
        const rows = 3
        const cols = 3
        const spacing = 0.48
        const ox = -((cols - 1) * spacing) / 2
        const oz = -((rows - 1) * spacing) / 2
        const colors = ['#7c3aed', '#818cf8', '#a78bfa', '#6d28d9', '#7c3aed', '#c084fc', '#818cf8', '#a78bfa', '#6d28d9']
        const result = []

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const idx = row * cols + col
                result.push({
                    pos: [ox + col * spacing, 0.18, oz + row * spacing],
                    color: colors[idx],
                    intensity: 0.5 + Math.random() * 0.4,
                })
            }
        }

        return result
    }, [])

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime()
        const dt = Math.min(delta, 0.05)

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * FLOAT_SPEED) * FLOAT_Y
            groupRef.current.rotation.y += FLOAT_ROT_SPEED * dt * 60
        }

        const pointer = state.pointer
        mouseTarget.current.x = pointer.y * PARALLAX_STRENGTH
        mouseTarget.current.y = pointer.x * PARALLAX_STRENGTH

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
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[2, 0.15, 1.8]} />
                    <meshStandardMaterial color="#0a0818" roughness={0.3} metalness={0.95} />
                </mesh>

                <mesh position={[0, 0.08, 0]} castShadow>
                    <boxGeometry args={[1.85, 0.06, 1.65]} />
                    <meshStandardMaterial color="#110d24" roughness={0.4} metalness={0.9} />
                </mesh>

                {keys.map((key, i) => (
                    <Keycap key={i} position={key.pos} emissiveColor={key.color} emissiveIntensity={key.intensity} />
                ))}

                <mesh position={[0, 0.26, -0.72]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.14, 24]} />
                    <meshStandardMaterial color="#120a30" emissive="#7c3aed" emissiveIntensity={0.3} roughness={0.2} metalness={0.95} />
                </mesh>

                <mesh position={[0, 0.01, 0.92]}>
                    <boxGeometry args={[1.4, 0.02, 0.04]} />
                    <meshStandardMaterial color="#7c3aed" emissive="#a78bfa" emissiveIntensity={1.5} toneMapped={false} />
                </mesh>
            </group>
        </group>
    )
}

function MouseLight() {
    const ref = useRef()
    useFrame((state) => {
        if (!ref.current) return
        ref.current.position.x = state.pointer.x * 3
        ref.current.position.y = 3 + state.pointer.y * 1.5
        ref.current.position.z = 3
    })
    return <pointLight ref={ref} intensity={25} color="#c084fc" distance={10} decay={2} />
}

function Particles({ count = 60 }) {
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20
            p[i * 3 + 1] = (Math.random() - 0.5) * 20
            p[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        return p
    }, [count])

    const ref = useRef()
    useFrame((_, delta) => {
        if (!ref.current) return
        ref.current.rotation.y += 0.004 * Math.min(delta, 0.05) * 60
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#a78bfa" transparent opacity={0.3} sizeAttenuation />
        </points>
    )
}

const topLineAnim = {
    hidden: { opacity: 0, y: 26, filter: 'blur(7px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
    return (
        <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: 92 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(3,0,20,0.28) 0%, rgba(3,0,20,0.86) 72%)', pointerEvents: 'none', zIndex: 1 }} />

            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
                <div className="hero-orb hero-orb-a" />
                <div className="hero-orb hero-orb-b" />
                <div className="hero-orb hero-orb-c" />
            </div>

            <div className="hero-canvas">
                <Canvas shadows camera={{ position: [0, 2.5, 5.5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
                    <color attach="background" args={['transparent']} />
                    <fog attach="fog" args={['#030014', 8, 18]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={512} />
                    <pointLight position={[-4, 3, -3]} intensity={10} color="#818cf8" distance={10} decay={2} />
                    <MouseLight />
                    <Macropad />
                    <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={8} blur={2} far={4} color="#7c3aed" />
                    <Particles />
                    <Environment preset="city" />
                </Canvas>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 24px', perspective: '1000px' }}
            >
                <motion.p
                    variants={topLineAnim}
                    style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.34em', textTransform: 'uppercase', marginBottom: 22, color: 'rgba(199, 179, 244, 0.95)', fontFamily: 'var(--font-mono)' }}
                >
                    Data Science • AI Systems • Creative Engineering
                </motion.p>

                <div style={{ display: 'grid', gap: 6, marginBottom: 24 }}>
                    {HERO_LINES.map((line, index) => (
                        <div key={line} className="hero-line-wrap">
                            <motion.h1
                                initial={{ y: 110, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.12 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className={index === 1 ? 'hero-title hero-title-gradient' : 'hero-title'}
                            >
                                {line}
                            </motion.h1>
                        </div>
                    ))}
                </div>

                <motion.p
                    variants={topLineAnim}
                    transition={{ delay: 0.28 }}
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: 670, margin: '0 auto 34px', lineHeight: 1.75, color: 'rgba(188, 179, 223, 0.9)' }}
                >
                    A cinematic portfolio where machine learning, design systems, and interaction design converge into one immersive narrative.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 26 }}
                >
                    <motion.a
                        href="#projects"
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className="hero-cta hero-cta-primary"
                    >
                        Explore Work
                    </motion.a>
                    <motion.a
                        href="#about"
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className="hero-cta hero-cta-secondary"
                    >
                        Story & Process
                    </motion.a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-meta-grid"
                >
                    {[
                        { label: 'Realtime Systems', value: 'LLM + CV + Pipelines' },
                        { label: 'Design Signature', value: 'Cinematic Minimalism' },
                        { label: 'Interaction Target', value: 'Smooth 60fps motion' },
                    ].map((item) => (
                        <motion.div
                            key={item.label}
                            whileHover={{ y: -4, borderColor: 'rgba(196,132,252,0.4)' }}
                            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                            className="hero-meta-card"
                        >
                            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(197, 182, 242, 0.72)', fontFamily: 'var(--font-mono)' }}>
                                {item.label}
                            </div>
                            <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(246, 240, 255, 0.95)' }}>
                                {item.value}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
                <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(178, 166, 214, 0.85)', fontFamily: 'var(--font-mono)' }}>
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 9, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 1, height: 26, background: 'linear-gradient(to bottom, rgba(196,132,252,0.95), transparent)' }}
                />
            </motion.div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(to top, var(--bg-primary), transparent)', pointerEvents: 'none' }} />
        </section>
    )
}
