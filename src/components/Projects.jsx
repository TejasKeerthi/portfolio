import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

const PROJECTS = [
    {
        title: 'Sentinel-Net',
        desc: 'Reliability intelligence platform for live failure forecasting, semantic incident tracing, and temporal confidence scoring across distributed systems.',
        tags: ['React', 'TypeScript', 'Python', 'Tailwind', 'Recharts'],
        color: '#edf5ff',
        link: 'https://github.com/TejasKeerthi/Sentinal-net',
        live: 'https://tejaskeerthi.github.io/Sentinal-net/',
        metric: '99.2% signal precision',
        badge: 'Flagship',
    },
    {
        title: 'Yatra',
        desc: 'AI travel orchestration app that generates custom itineraries with location intelligence, map layers, and cloud-synced planning sessions.',
        tags: ['React', 'TypeScript', 'Gemini AI', 'Firebase', 'Leaflet.js'],
        color: '#d6e4f8',
        link: 'https://github.com/TejasKeerthi/yatra',
        live: 'https://tejaskeerthi.github.io/yatra/',
        metric: '1-click route generation',
        badge: 'Product',
    },
    {
        title: 'ART-VAULT',
        desc: 'Interactive digital gallery with secure auth, wallet connection, and immersive model previews designed for modern creators.',
        tags: ['HTML', 'Tailwind', 'JavaScript', 'Firebase', 'Model Viewer'],
        color: '#b6c7df',
        link: 'https://github.com/TejasKeerthi/ART-VAULT',
        live: 'https://tejaskeerthi.github.io/ART-VAULT/',
        metric: 'Realtime gallery stream',
        badge: 'Creative',
    },
    {
        title: 'Portfolio',
        desc: 'A living index of work, experiments, and contact built to keep projects, background, and updates in one place.',
        tags: ['React', 'Three.js', 'Framer Motion', 'Vite', 'Lenis'],
        color: '#9db4d3',
        link: 'https://github.com/TejasKeerthi/portfolio',
        metric: 'Living archive of shipped work',
        badge: 'Hub',
    },
]

const headingStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
}

const revealUp = {
    hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
}

function ProjectCard({ project, index }) {
    const cardRef = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springX = useSpring(x, { stiffness: 220, damping: 22 })
    const springY = useSpring(y, { stiffness: 220, damping: 22 })

    const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8])
    const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10])
    const glowX = useTransform(springX, [-0.5, 0.5], [20, 80])
    const glowY = useTransform(springY, [-0.5, 0.5], [20, 80])

    const dynamicGlow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, ${project.color}40 0%, ${project.color}00 55%)`

    const handleMove = (event) => {
        const rect = cardRef.current.getBoundingClientRect()
        x.set((event.clientX - rect.left) / rect.width - 0.5)
        y.set((event.clientY - rect.top) / rect.height - 0.5)
    }

    const handleLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.article
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.72, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.24)', boxShadow: '0 28px 44px rgba(5,8,14,0.34)' }}
            style={{
                position: 'relative',
                padding: 28,
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.12)',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 24%, rgba(14,20,29,0.48) 68%, rgba(9,13,19,0.6))',
                backdropFilter: 'blur(22px) saturate(160%)',
                transformPerspective: 1000,
                rotateX,
                rotateY,
                minHeight: 320,
                display: 'flex',
                flexDirection: 'column',
            }}
            className="project-shell"
            data-hover
        >
            <motion.div aria-hidden style={{ position: 'absolute', inset: 0, background: dynamicGlow, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: `linear-gradient(145deg, ${project.color}24, transparent 42%)`, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(206, 217, 234, 0.7)', fontFamily: 'var(--font-mono)' }}>
                    {project.badge}
                </span>
                <span style={{ fontSize: 10, letterSpacing: '0.1em', color: project.color, fontFamily: 'var(--font-mono)' }}>
                    {project.metric}
                </span>
            </div>

            <h3 style={{ position: 'relative', zIndex: 1, fontSize: 23, fontWeight: 700, lineHeight: 1.15, marginBottom: 12 }}>
                {project.title}
            </h3>

            <p style={{ position: 'relative', zIndex: 1, fontSize: 14, lineHeight: 1.7, color: 'rgba(214, 223, 237, 0.74)', marginBottom: 18 }}>
                {project.desc}
            </p>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        style={{
                            borderRadius: 999,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(220, 228, 240, 0.88)',
                            padding: '5px 10px',
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, color: '#ffffff', borderColor: 'rgba(255,255,255,0.28)' }}
                    data-hover
                    style={{
                        borderRadius: 999,
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: 'rgba(229, 236, 247, 0.92)',
                        textDecoration: 'none',
                        fontSize: 12,
                        padding: '8px 14px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    Source
                </motion.a>
                {project.live && (
                    <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2, color: '#ffffff' }}
                        data-hover
                        style={{
                            borderRadius: 999,
                            border: '1px solid rgba(255,255,255,0.18)',
                            color: '#0b1015',
                            textDecoration: 'none',
                            fontSize: 12,
                            padding: '8px 14px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-mono)',
                            background: `linear-gradient(145deg, ${project.color}, rgba(255,255,255,0.82))`,
                        }}
                    >
                        Live
                    </motion.a>
                )}
            </div>
        </motion.article>
    )
}

export default function Projects() {
    return (
        <section id="projects" style={{ position: 'relative', padding: '120px 0 132px', overflow: 'hidden', background: 'transparent' }}>
            <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'absolute',
                    left: '-10%',
                    top: 40,
                    width: 540,
                    height: 540,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(221,233,250,0.18), rgba(221,233,250,0))',
                    pointerEvents: 'none',
                }}
            />

            <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-70px' }}
                    variants={headingStagger}
                    style={{ textAlign: 'center', marginBottom: 44 }}
                >
                    <motion.p
                        variants={revealUp}
                        style={{ fontSize: 12, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 12, color: 'rgba(218, 228, 243, 0.72)', fontFamily: 'var(--font-mono)' }}
                    >
                        Selected Work
                    </motion.p>
                    <motion.h2
                        variants={revealUp}
                        style={{ fontSize: 'clamp(2rem, 4.8vw, 3.6rem)', fontWeight: 700, lineHeight: 1.08 }}
                    >
                        Selected builds with <span className="gradient-text" data-text="intent">product intent</span>
                    </motion.h2>
                    <motion.p
                        variants={revealUp}
                        style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: 'rgba(214, 223, 237, 0.72)', maxWidth: 700, marginInline: 'auto' }}
                    >
                        From reliability tooling to AI travel planning and creative platforms, each project is built around clear use cases, fast feedback, and tangible outcomes.
                    </motion.p>
                </motion.div>

                <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                    {PROJECTS.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </div>

            <div className="section-divider" style={{ marginTop: 112 }} />
        </section>
    )
}
