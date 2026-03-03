import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

const PROJECTS = [
    {
        title: 'Sentinel-Net',
        desc: 'Software reliability monitoring dashboard with real-time failure risk metrics, AI-powered insights, semantic signal feeds, and interactive temporal trend analysis.',
        tags: ['React', 'TypeScript', 'Python', 'Tailwind', 'Recharts'],
        color: '#06b6d4',
        link: 'https://github.com/TejasKeerthi/Sentinal-net',
        live: 'https://tejaskeerthi.github.io/Sentinal-net/',
    },
    {
        title: 'Yatra',
        desc: 'AI-powered India travel planner using Google Gemini — generates personalized itineraries with interactive maps, PDF export, Firebase auth, and cloud saving.',
        tags: ['React', 'TypeScript', 'Gemini AI', 'Firebase', 'Leaflet.js'],
        color: '#0ea5e9',
        link: 'https://github.com/TejasKeerthi/yatra',
        live: 'https://tejaskeerthi.github.io/yatra/',
    },
    {
        title: 'ART-VAULT',
        desc: 'Digital art gallery platform with Firebase authentication, real-time artwork display, wallet integration, and 3D model viewer support.',
        tags: ['HTML', 'Tailwind CSS', 'JavaScript', 'Firebase', 'Google Model Viewer'],
        color: '#22d3ee',
        link: 'https://github.com/TejasKeerthi/ART-VAULT',
        live: 'https://tejaskeerthi.github.io/ART-VAULT/',
    },
    {
        title: 'Portfolio',
        desc: 'This very site — a vibrant 3D portfolio built with React Three Fiber, Framer Motion, glassmorphism, and buttery-smooth Lenis scrolling.',
        tags: ['React', 'Three.js', 'Framer Motion', 'Vite', 'Tailwind'],
        color: '#67e8f9',
        link: 'https://github.com/TejasKeerthi/portfolio',
    },
]

/* 3-D tilt card */
function TiltCard({ children, color, style }) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

    function handleMove(e) {
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    function handleLeave() { x.set(0); y.set(0) }

    return (
        <motion.article
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ ...style, rotateX, rotateY, transformPerspective: 600 }}
            whileHover={{ borderColor: color + '55', boxShadow: `0 0 40px ${color}20` }}
        >
            {children}
        </motion.article>
    )
}

const fadeUp = {
    hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

export default function Projects() {
    return (
        <section id="projects" style={{ position: 'relative', padding: '128px 0', background: 'var(--bg-primary)' }}>
            <div className="container-main" style={{ textAlign: 'center' }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={stagger}
                    style={{ marginBottom: 56 }}
                >
                    <motion.p
                        variants={fadeUp}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}
                    >
                        Selected Work
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700 }}
                    >
                        Projects that <span className="gradient-text">matter</span>.
                    </motion.h2>
                </motion.div>

                <div className="container-narrow" style={{ padding: 0 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={stagger}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, textAlign: 'left' }}
                    >
                        {PROJECTS.map((project) => (
                            <motion.div
                                key={project.title}
                                variants={fadeUp}
                                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                            >
                                <TiltCard
                                    color={project.color}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        backdropFilter: 'blur(16px)',
                                        borderRadius: 16,
                                        padding: 32,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Gradient corner accent */}
                                    <div style={{
                                        position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                                        background: `radial-gradient(circle at top right, ${project.color}22, transparent 70%)`,
                                        pointerEvents: 'none',
                                    }} />

                                    {/* Accent dot */}
                                    <motion.div
                                        whileHover={{ scale: 1.6 }}
                                        style={{
                                            width: 10, height: 10, borderRadius: '50%',
                                            background: project.color,
                                            boxShadow: `0 0 14px ${project.color}55`,
                                            marginBottom: 20,
                                        }}
                                    />

                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                                        {project.title}
                                    </h3>
                                    <p style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 20, color: 'var(--text-secondary)' }}>
                                        {project.desc}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                        {project.tags.map((tag) => (
                                            <span key={tag} style={{
                                                padding: '4px 12px', borderRadius: 999,
                                                fontSize: 11, fontWeight: 500,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                color: 'var(--text-secondary)',
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                                        <motion.a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ color: project.color }}
                                            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}
                                        >
                                            GitHub ↗
                                        </motion.a>
                                        {project.live && (
                                            <motion.a
                                                href={project.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ color: project.color }}
                                                style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}
                                            >
                                                Live Demo ↗
                                            </motion.a>
                                        )}
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="section-divider" style={{ marginTop: 128 }} />
        </section>
    )
}
