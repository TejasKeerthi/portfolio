import { motion } from 'framer-motion'

const INTERESTS = [
    { label: 'LLM Systems' },
    { label: 'Data Stories' },
    { label: 'Computer Vision' },
    { label: 'Realtime UX' },
    { label: 'Rapid Prototyping' },
]

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)', rotateX: 10 },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 },
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
                        style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: 'rgba(218, 228, 243, 0.72)', fontFamily: 'var(--font-mono)' }}
                    >
                        About
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 32 }}
                    >
                        Building products that stay <span className="gradient-text" data-text="human">human</span> even when the tech gets complex.
                    </motion.h2>
                </motion.div>

                <div className="container-narrow" style={{ padding: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 32, textAlign: 'left' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            whileHover={{ borderColor: 'rgba(255,255,255,0.22)', y: -4 }}
                            className="glass-card"
                            data-hover
                            style={{ padding: 32 }}
                        >
                            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                I enjoy taking ambiguous ideas and turning them into working product flows. The best outcomes usually come from translating heavy technical capability into something clear, fast, and useful.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            whileHover={{ borderColor: 'rgba(255,255,255,0.22)', y: -4 }}
                            className="glass-card"
                            data-hover
                            style={{ padding: 32 }}
                        >
                            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                My work usually spans AI models, data pipelines, frontend architecture, and visual polish. I care about the full path from idea to interface, not just one layer of the stack.
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
                        {INTERESTS.map(({ label }) => (
                            <motion.div
                                key={label}
                                variants={fadeUp}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                whileHover={{ y: -5, scale: 1.05, borderColor: 'rgba(255,255,255,0.24)', boxShadow: '0 18px 40px rgba(5,8,14,0.24)' }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-card"
                                data-hover
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', cursor: 'default' }}
                            >
                                <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(203, 213, 227, 0.62)', fontFamily: 'var(--font-mono)' }}>
                                    Focus
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
