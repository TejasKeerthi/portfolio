import { motion } from 'framer-motion'

const TECH = [
    { name: 'React', mark: 'RE', desc: 'Component-driven UI' },
    { name: 'Java', mark: 'JV', desc: 'Object-oriented backend systems' },
    { name: 'Python', mark: 'PY', desc: 'Automation, ML, and scripting' },
    { name: 'Node.js', mark: 'ND', desc: 'Server-side runtime' },
    { name: 'MongoDB', mark: 'DB', desc: 'Flexible document storage' },
    { name: 'SQL', mark: 'SQ', desc: 'Relational modeling and queries' },
    { name: 'HTML', mark: 'UI', desc: 'Markup foundations' },
    { name: 'CSS', mark: 'CS', desc: 'Layout and visual systems' },
    { name: 'Tailwind', mark: 'TW', desc: 'Utility-first styling' },
    { name: 'C', mark: 'C', desc: 'Systems programming basics' },
    { name: 'Hibernate', mark: 'HB', desc: 'Java ORM workflow' },
    { name: 'JSON', mark: 'JS', desc: 'Structured data exchange' },
    { name: 'Git', mark: 'GT', desc: 'Versioned collaboration' },
    { name: 'PFSD', mark: 'FS', desc: 'Full-stack product delivery' },
]

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)', scale: 0.92 },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function TechGrid() {
    return (
        <section id="tech" style={{ position: 'relative', padding: '128px 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(8,10,14,0))' }}>
            {/* Top / Bottom fades */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 128, background: 'linear-gradient(to bottom, rgba(8,10,14,0.86), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 128, background: 'linear-gradient(to top, rgba(8,10,14,0.92), transparent)', pointerEvents: 'none' }} />

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
                        style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: 'rgba(218, 228, 243, 0.72)', fontFamily: 'var(--font-mono)' }}
                    >
                        Tech Stack
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700 }}
                    >
                        Stack I reach for when <span className="gradient-text" data-text="shipping">shipping</span>.
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
                        style={{ marginTop: 14, maxWidth: 640, marginInline: 'auto', color: 'rgba(214, 223, 237, 0.72)', fontSize: 15, lineHeight: 1.7 }}
                    >
                        A practical mix of product frontend, backend engineering, and data tooling depending on what the build actually needs.
                    </motion.p>
                </motion.div>

                <div className="container-narrow" style={{ padding: 0 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {TECH.map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                variants={fadeUp}
                                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                                whileHover={{
                                    y: -6,
                                    borderColor: 'rgba(255,255,255,0.22)',
                                    boxShadow: '0 18px 42px rgba(5,8,14,0.28), inset 0 0 20px rgba(255,255,255,0.06)',
                                    background: 'rgba(255,255,255,0.08)',
                                    scale: 1.04,
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="glass-card"
                                data-hover
                                style={{ padding: '24px 16px', cursor: 'default', textAlign: 'center' }}
                            >
                                <motion.div
                                    style={{
                                        width: 46,
                                        height: 46,
                                        margin: '0 auto 12px',
                                        display: 'grid',
                                        placeItems: 'center',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(13,18,27,0.48))',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        fontFamily: 'var(--font-mono)',
                                        color: 'rgba(239, 244, 252, 0.92)',
                                    }}
                                    whileHover={{ scale: 1.25, rotate: [0, -8, 8, 0] }}
                                    transition={{ duration: 0.45 }}
                                >
                                    {tech.mark}
                                </motion.div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                                    {tech.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                    {tech.desc}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
