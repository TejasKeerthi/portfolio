import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three-stdlib'
import * as THREE from 'three'
import { motion } from 'framer-motion'

extend({ RoundedBoxGeometry })

const HERO_LINES = ['Tejas', 'Keerthi', 'AI Products']

const topLineAnim = {
    hidden: { opacity: 0, y: 26, filter: 'blur(7px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
}

function LiquidSurface({ color, lowPerf, roughness = 0.07, thickness = 1, ior = 1.16, chromaticAberration = 0.04 }) {
    if (lowPerf) {
        return (
            <meshPhysicalMaterial
                color={color}
                transparent
                opacity={0.76}
                transmission={0.86}
                roughness={Math.max(roughness, 0.18)}
                thickness={Math.min(thickness, 0.8)}
                ior={ior}
                metalness={0.08}
                clearcoat={1}
                clearcoatRoughness={0.2}
            />
        )
    }

    return (
        <MeshTransmissionMaterial
            color={color}
            transmission={1}
            roughness={roughness}
            thickness={thickness}
            ior={ior}
            chromaticAberration={chromaticAberration}
            anisotropy={0.2}
            distortion={0.12}
            distortionScale={0.2}
            temporalDistortion={0.12}
            backside
            backsideThickness={Math.max(0.8, thickness * 0.75)}
            samples={4}
            resolution={384}
        />
    )
}

function GlassShard({ position, scale, rotation, color, lowPerf }) {
    return (
        <Float speed={lowPerf ? 1.2 : 1.8} rotationIntensity={lowPerf ? 0.18 : 0.28} floatIntensity={lowPerf ? 0.22 : 0.38}>
            <mesh position={position} rotation={rotation} scale={scale}>
                <roundedBoxGeometry args={[0.42, 0.08, 0.62, 0.08, lowPerf ? 3 : 6]} />
                <LiquidSurface color={color} lowPerf={lowPerf} roughness={0.08} thickness={0.65} ior={1.15} chromaticAberration={0.03} />
            </mesh>
        </Float>
    )
}

function GlassSculpture({ lowPerf }) {
    const shellRef = useRef()
    const innerRef = useRef()
    const lensRef = useRef()
    const ringRef = useRef()

    const shards = useMemo(() => {
        const base = [
            { position: [-1.62, 0.2, -0.1], scale: 1, rotation: [0.2, 0.8, -0.2], color: '#dce7f8' },
            { position: [1.68, 0.46, 0.24], scale: 0.92, rotation: [-0.18, -0.92, 0.22], color: '#c9d7eb' },
            { position: [-1.1, 1.18, -0.72], scale: 0.72, rotation: [0.42, 0.24, 0.28], color: '#edf4ff' },
            { position: [1.14, 1.26, -0.62], scale: 0.68, rotation: [-0.4, -0.22, -0.3], color: '#b6c7e0' },
            { position: [0.2, -0.9, -0.94], scale: 0.76, rotation: [0.12, 0.16, 0.16], color: '#d8e3f4' },
        ]

        return lowPerf ? base.slice(0, 3) : base
    }, [lowPerf])

    useFrame((state, delta) => {
        if (!shellRef.current || !innerRef.current || !lensRef.current || !ringRef.current) return

        const t = state.clock.getElapsedTime()
        const easedX = THREE.MathUtils.lerp(shellRef.current.rotation.x, state.pointer.y * (lowPerf ? 0.18 : 0.28), 0.05)
        const easedY = THREE.MathUtils.lerp(shellRef.current.rotation.y, state.pointer.x * (lowPerf ? 0.28 : 0.4) + t * (lowPerf ? 0.05 : 0.08), 0.05)

        shellRef.current.rotation.x = easedX
        shellRef.current.rotation.y = easedY
        shellRef.current.position.y = Math.sin(t * 0.82) * (lowPerf ? 0.08 : 0.12)

        innerRef.current.rotation.z = Math.sin(t * 0.6) * (lowPerf ? 0.05 : 0.08)
        innerRef.current.position.y = 0.12 + Math.sin(t * 1.2) * (lowPerf ? 0.05 : 0.08)

        lensRef.current.scale.setScalar(1 + Math.sin(t * 1.7) * (lowPerf ? 0.016 : 0.03))
        ringRef.current.rotation.z += delta * (lowPerf ? 0.12 : 0.22)
        ringRef.current.rotation.x = Math.sin(t * 0.7) * (lowPerf ? 0.1 : 0.16)
    })

    const sphereSegments = lowPerf ? 24 : 48
    const ringSegments = lowPerf ? 72 : 120

    return (
        <group ref={shellRef} position={[0, 0.15, 0]}>
            <mesh position={[0, -0.82, 0]} receiveShadow>
                <cylinderGeometry args={[1.58, 1.85, 0.2, lowPerf ? 24 : 48]} />
                <meshPhysicalMaterial color="#151a22" metalness={0.88} roughness={0.2} clearcoat={1} clearcoatRoughness={0.18} />
            </mesh>

            <mesh position={[0, -0.02, 0]} castShadow={!lowPerf}>
                <roundedBoxGeometry args={[2.86, 0.34, 1.86, 0.16, lowPerf ? 6 : 10]} />
                <LiquidSurface color="#ecf3fe" lowPerf={lowPerf} roughness={0.08} thickness={1.35} ior={1.16} chromaticAberration={0.04} />
            </mesh>

            <mesh position={[0, 0.38, 0.06]} castShadow={!lowPerf}>
                <roundedBoxGeometry args={[1.95, 0.24, 1.18, 0.16, lowPerf ? 6 : 10]} />
                <LiquidSurface color="#f7fbff" lowPerf={lowPerf} roughness={0.05} thickness={1.1} ior={1.18} chromaticAberration={0.03} />
            </mesh>

            <group ref={innerRef}>
                <mesh position={[0, 0.14, 0.12]} castShadow={!lowPerf}>
                    <sphereGeometry args={[0.52, sphereSegments, sphereSegments]} />
                    <LiquidSurface color="#dce7f8" lowPerf={lowPerf} roughness={0.03} thickness={1.8} ior={1.2} chromaticAberration={0.05} />
                </mesh>

                <mesh ref={lensRef} position={[0, 0.14, 0.14]}>
                    <sphereGeometry args={[0.18, lowPerf ? 18 : 32, lowPerf ? 18 : 32]} />
                    <meshPhysicalMaterial color="#ffffff" emissive="#dfe9f8" emissiveIntensity={lowPerf ? 0.2 : 0.32} roughness={0.02} metalness={0.1} clearcoat={1} />
                </mesh>
            </group>

            <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.08, 0.036, lowPerf ? 12 : 24, ringSegments]} />
                <meshStandardMaterial color="#d6e3f5" emissive="#a7bddb" emissiveIntensity={lowPerf ? 0.28 : 0.5} roughness={0.14} metalness={0.82} />
            </mesh>

            {shards.map((shard, index) => (
                <GlassShard key={index} {...shard} lowPerf={lowPerf} />
            ))}
        </group>
    )
}

function PointerLight({ lowPerf }) {
    const lightRef = useRef()

    useFrame((state) => {
        if (!lightRef.current) return

        lightRef.current.position.x = state.pointer.x * 2.8
        lightRef.current.position.y = 2.8 + state.pointer.y * 1.5
        lightRef.current.position.z = 2.8
    })

    return <pointLight ref={lightRef} color="#edf5ff" intensity={lowPerf ? 10 : 18} distance={10} decay={2} />
}

export default function Hero({ performanceMode = 'high' }) {
    const lowPerf = performanceMode === 'low'
    const sectionRef = useRef(null)
    const contentRef = useRef(null)
    const [heroVisible, setHeroVisible] = useState(true)

    const handleHeroMove = useCallback((event) => {
        if (lowPerf || !contentRef.current || !sectionRef.current) return

        const rect = sectionRef.current.getBoundingClientRect()
        const normalizedX = (event.clientX - rect.left) / rect.width - 0.5
        const normalizedY = (event.clientY - rect.top) / rect.height - 0.5
        const rotateX = normalizedY * -4
        const rotateY = normalizedX * 5

        contentRef.current.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    }, [lowPerf])

    const handleHeroLeave = useCallback(() => {
        if (!contentRef.current) return
        contentRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
    }, [])

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setHeroVisible(entry.isIntersecting)
            },
            { threshold: 0.04, rootMargin: '220px 0px 220px 0px' },
        )

        observer.observe(section)
        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="hero"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: 92,
                paddingBottom: 56,
            }}
            onPointerMove={handleHeroMove}
            onPointerLeave={handleHeroLeave}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(211,225,246,0.06) 0%, rgba(8,12,18,0.5) 42%, rgba(5,8,12,0.92) 78%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            <div className="hero-caustic hero-caustic-a" />
            <div className="hero-caustic hero-caustic-b" />

            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
                <div className="hero-orb hero-orb-a" />
                <div className="hero-orb hero-orb-b" />
                <div className="hero-orb hero-orb-c" />
            </div>

            {heroVisible && (
                <div className="hero-canvas">
                    <Canvas
                        shadows={!lowPerf}
                        camera={{ position: [0, 1.4, lowPerf ? 6.7 : 6.2], fov: 34 }}
                        dpr={lowPerf ? [0.7, 1.1] : [1, 1.35]}
                        gl={{
                            antialias: !lowPerf,
                            alpha: true,
                            powerPreference: 'high-performance',
                            toneMapping: THREE.ACESFilmicToneMapping,
                            toneMappingExposure: lowPerf ? 1.08 : 1.2,
                        }}
                        performance={{ min: lowPerf ? 0.55 : 0.75 }}
                    >
                        <color attach="background" args={['transparent']} />
                        <fog attach="fog" args={['#090d12', 8, lowPerf ? 14 : 16]} />
                        <ambientLight intensity={lowPerf ? 0.8 : 0.9} />
                        <directionalLight
                            position={[5, 7, 6]}
                            intensity={lowPerf ? 1.0 : 1.35}
                            castShadow={!lowPerf}
                            shadow-mapSize={lowPerf ? 256 : 768}
                            color="#f2f7ff"
                        />
                        <directionalLight position={[-3, 4, -5]} intensity={lowPerf ? 0.52 : 0.8} color="#9cb4d5" />
                        <PointerLight lowPerf={lowPerf} />
                        <GlassSculpture lowPerf={lowPerf} />
                        {!lowPerf && <ContactShadows position={[0, -1.16, 0]} opacity={0.32} scale={8} blur={2.4} far={4} color="#8299bc" />}
                        <Sparkles count={lowPerf ? 10 : 22} scale={[7, 4, 6]} size={lowPerf ? 1.4 : 2} speed={lowPerf ? 0.1 : 0.18} color="#dce7f8" opacity={0.5} />
                        {!lowPerf && <Environment preset="city" />}
                    </Canvas>
                </div>
            )}

            <motion.div
                initial="hidden"
                animate="visible"
                ref={contentRef}
                className="hero-content-shell"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: 1240,
                    margin: '0 auto',
                    padding: '28px 28px 26px',
                    textAlign: 'center',
                    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
                    transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <motion.p
                    variants={topLineAnim}
                    style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.34em',
                        textTransform: 'uppercase',
                        marginBottom: 22,
                        color: 'rgba(219, 229, 243, 0.82)',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    AI Engineer • Product Builder • Realtime Interfaces
                </motion.p>

                <div style={{ display: 'grid', gap: 6, marginBottom: 24 }}>
                    {HERO_LINES.map((line, index) => (
                        <div key={line} className="hero-line-wrap">
                            <motion.h1
                                initial={{ y: 110, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className={index === 1 ? 'hero-title hero-title-gradient' : 'hero-title'}
                                data-text={line}
                            >
                                {line}
                            </motion.h1>
                        </div>
                    ))}
                </div>

                <motion.p
                    variants={topLineAnim}
                    transition={{ delay: 0.3 }}
                    style={{
                        fontSize: 'clamp(1rem, 2vw, 1.16rem)',
                        maxWidth: 760,
                        margin: '0 auto 34px',
                        lineHeight: 1.8,
                        color: 'rgba(214, 223, 237, 0.78)',
                    }}
                >
                    I design and engineer AI products, data tools, and immersive interfaces that turn complex systems into fast, readable experiences people can actually use.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.82, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}
                >
                    <motion.a
                        href="#projects"
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="hero-cta hero-cta-primary"
                        data-hover
                    >
                        Explore Work
                    </motion.a>
                    <motion.a
                        href="#about"
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="hero-cta hero-cta-secondary"
                        data-hover
                    >
                        About Me
                    </motion.a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.82, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-meta-grid"
                >
                    {[
                        { label: 'Focus', value: 'AI products, dashboards, and developer tools' },
                        { label: 'Strength', value: 'Rapid prototyping with production discipline' },
                        { label: 'Currently Exploring', value: 'Multimodal systems and realtime UX' },
                        { label: 'Open For', value: 'Internships, freelance, and ambitious teams' },
                    ].map((item) => (
                        <motion.div
                            key={item.label}
                            whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.24)' }}
                            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                            className="hero-meta-card"
                        >
                            <div
                                style={{
                                    fontSize: 10,
                                    letterSpacing: '0.16em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(202, 214, 231, 0.62)',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                {item.label}
                            </div>
                            <div style={{ marginTop: 7, fontSize: 13, color: 'rgba(247, 250, 255, 0.94)' }}>{item.value}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.35, duration: 1 }}
                style={{
                    position: 'absolute',
                    bottom: 34,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                }}
            >
                <span
                    style={{
                        fontSize: 10,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'rgba(191, 203, 221, 0.7)',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 9, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(241,247,255,0.95), transparent)' }}
                />
            </motion.div>

            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    background: 'linear-gradient(to top, rgba(8,10,14,0.96), transparent)',
                    pointerEvents: 'none',
                }}
            />
        </section>
    )
}
