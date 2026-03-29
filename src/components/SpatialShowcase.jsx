import { motion } from 'framer-motion'
import { useCallback, useRef } from 'react'

const CAPSULES = [
    {
        label: 'Reliability AI',
        title: 'Sentinel-Net',
        metric: '99.2% signal precision',
        desc: 'Forecasts failures, traces incidents, and turns noisy infrastructure into readable decisions.',
        tags: ['Forecasting', 'Tracing'],
        accent: 'rgba(141, 226, 255, 0.22)',
        stripe: 'rgba(141, 226, 255, 0.78)',
    },
    {
        label: 'Travel Product',
        title: 'Yatra',
        metric: '1-click route generation',
        desc: 'Builds personalized itineraries with AI guidance, maps, and planning that stays easy to edit.',
        tags: ['Planning', 'Maps'],
        accent: 'rgba(196, 168, 255, 0.22)',
        stripe: 'rgba(196, 168, 255, 0.75)',
    },
    {
        label: 'Creative Platform',
        title: 'ART-VAULT',
        metric: 'Realtime gallery stream',
        desc: 'Combines creator tooling, secure access, and immersive viewing into a modern digital gallery.',
        tags: ['Auth', '3D previews'],
        accent: 'rgba(255, 176, 133, 0.22)',
        stripe: 'rgba(255, 176, 133, 0.75)',
    },
    {
        label: 'Current Focus',
        title: 'Next Experiments',
        metric: 'Fast concept to demo',
        desc: 'Exploring multimodal AI, tactile product flows, and interfaces that make complex tools feel natural.',
        tags: ['LLMs', 'Realtime UX'],
        accent: 'rgba(135, 245, 198, 0.22)',
        stripe: 'rgba(135, 245, 198, 0.72)',
    },
]

const TRACKS = ['AI products', 'Realtime UX', 'Data systems', 'Rapid shipping']

function CapsuleCard({ capsule, delay }) {
    return (
        <motion.article
            className="spatial-orbit-card"
            style={{ '--card-accent': capsule.accent }}
            initial={{ opacity: 0, y: 26, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(255,255,255,0.28)' }}
            data-hover
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                borderRadius: '22px 22px 0 0',
                background: capsule.stripe,
                opacity: 0.72,
            }} />
            <div className="spatial-card-label-row">
                <span className="spatial-card-label">{capsule.label}</span>
                <span className="spatial-card-metric">{capsule.metric}</span>
            </div>
            <h3 className="spatial-card-title">{capsule.title}</h3>
            <p className="spatial-card-copy">{capsule.desc}</p>
            <div className="spatial-card-tags">
                {capsule.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                ))}
            </div>
        </motion.article>
    )
}

export default function SpatialShowcase({ performanceMode = 'high' }) {
    const shellRef = useRef(null)

    const handleMove = useCallback((event) => {
        if (!shellRef.current) return
        const rect = shellRef.current.getBoundingClientRect()
        const offsetX = (event.clientX - rect.left) / rect.width - 0.5
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5
        shellRef.current.style.setProperty('--glow-x', `${((offsetX + 0.5) * 100).toFixed(2)}%`)
        shellRef.current.style.setProperty('--glow-y', `${((offsetY + 0.5) * 100).toFixed(2)}%`)
    }, [])

    const handleLeave = useCallback(() => {
        if (!shellRef.current) return
        shellRef.current.style.setProperty('--glow-x', '50%')
        shellRef.current.style.setProperty('--glow-y', '50%')
    }, [])

    return (
        <section id="signature" style={{ position: 'relative', padding: '108px 0 96px', overflow: 'hidden', scrollMarginTop: 120 }}>
            <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', marginBottom: 28 }}
                >
                    <p style={{ fontSize: 12, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(218, 228, 243, 0.72)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                        Signature Space
                    </p>
                    <h2 style={{ fontSize: 'clamp(2rem, 4.8vw, 3.8rem)', fontWeight: 700, lineHeight: 1.08 }}>
                        Work that ships with <span className="gradient-text" data-text="depth">depth</span>, color, and intent
                    </h2>
                    <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.75, color: 'rgba(219, 229, 244, 0.8)', maxWidth: 680, marginInline: 'auto' }}>
                        The strongest builds usually live where AI, product thinking, and interface craft overlap. This interactive capsule maps the areas I keep returning to.
                    </p>
                </motion.div>

                <motion.div
                    ref={shellRef}
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="spatial-shell"
                >
                    <div className="spatial-grid" />
                    <div className="spatial-beam" />
                    <div className="spatial-ring spatial-ring-a" />
                    <div className="spatial-ring spatial-ring-b" />
                    <div className="spatial-ring spatial-ring-c" />

                    <div className="spatial-layout">
                        <div className="spatial-col">
                            <CapsuleCard capsule={CAPSULES[0]} delay={0.1} />
                            <CapsuleCard capsule={CAPSULES[2]} delay={0.22} />
                        </div>

                        <motion.div
                            className="spatial-center-col"
                            initial={{ opacity: 0, y: 20, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="spatial-core">
                                <span className="spatial-core-kicker">Tejas Keerthi</span>
                                <h3 className="spatial-core-title">AI engineer shipping products people enjoy using</h3>
                                <p className="spatial-core-copy">
                                    I turn complex systems into clear, fast interfaces with a focus on practical outcomes and polished delivery.
                                </p>
                                <div className="spatial-core-grid">
                                    {[
                                        { label: 'Approach', value: 'Prototype quickly' },
                                        { label: 'Strength', value: 'End-to-end builds' },
                                        { label: 'Output', value: 'Shippable quality' },
                                    ].map((item) => (
                                        <div key={item.label} className="spatial-core-stat">
                                            <span>{item.label}</span>
                                            <strong>{item.value}</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <div className="spatial-col">
                            <CapsuleCard capsule={CAPSULES[1]} delay={0.15} />
                            <CapsuleCard capsule={CAPSULES[3]} delay={0.28} />
                        </div>
                    </div>

                    <div className="spatial-footer-bar">
                        {TRACKS.map((item) => (
                            <div key={item} className="spatial-footer-chip">{item}</div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="section-divider" style={{ marginTop: 104 }} />
        </section>
    )
}