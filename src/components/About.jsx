import { motion } from 'framer-motion'

const INTERESTS = [
    { emoji: '🧠', label: 'Deep Learning' },
    { emoji: '📊', label: 'Data Viz' },
    { emoji: '🤖', label: 'NLP' },
    { emoji: '👁️', label: 'Computer Vision' },
    { emoji: '∞', label: 'Curiosity', gradient: true },
]

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

export default function About() {
    return (
        <section id="about" style={{ position: 'relative', padding: '128px 0', background: 'var(--bg-primary)' }}>
            <div className="container-main" style={{ textAlign: 'center' }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={stagger}
                >
                    <motion.p
                        variants={fadeUp}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}
                    >
                        About
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 32 }}
                    >
                        Driven by{' '}
                        <span className="gradient-text">data</span> &{' '}
                        <span className="gradient-text">algorithms</span>.
                    </motion.h2>
                </motion.div>

                <div className="container-narrow" style={{ padding: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 32, textAlign: 'left' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            whileHover={{ borderColor: 'rgba(124,58,237,0.3)', y: -3 }}
                            className="glass-card animate-shimmer"
                            style={{ padding: 32 }}
                        >
                            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                I'm a data science enthusiast deeply passionate about AI/ML algorithms,
                                statistical modeling, and extracting meaningful patterns from complex datasets.
                                I love turning raw data into actionable intelligence.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            whileHover={{ borderColor: 'rgba(124,58,237,0.3)', y: -3 }}
                            className="glass-card animate-shimmer"
                            style={{ padding: 32 }}
                        >
                            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                From neural networks and NLP to computer vision and predictive analytics,
                                I thrive at the intersection of mathematics and engineering. Every feature
                                matters. Every epoch counts.
                            </p>
                        </motion.div>
                    </div>

                    {/* Interest badges */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={stagger}
                        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 56 }}
                    >
                        {INTERESTS.map(({ emoji, label, gradient }) => (
                            <motion.div
                                key={label}
                                variants={fadeUp}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                whileHover={{ y: -5, scale: 1.08, borderColor: 'rgba(124,58,237,0.4)', boxShadow: '0 0 25px rgba(124,58,237,0.15)' }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-card"
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', cursor: 'default' }}
                            >
                                <span style={{ fontSize: gradient ? 28 : 20 }} className={gradient ? 'gradient-text' : undefined}>
                                    {emoji}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="section-divider" style={{ marginTop: 128 }} />
        </section>
    )
}
