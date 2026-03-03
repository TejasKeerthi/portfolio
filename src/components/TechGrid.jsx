import { motion } from 'framer-motion'

const TECH = [
    { name: 'React', icon: '⚛️', desc: 'Component-driven UI' },
    { name: 'Java', icon: '☕', desc: 'Object-oriented language' },
    { name: 'Python', icon: '🐍', desc: 'Scripting & automation' },
    { name: 'Node.js', icon: '🟢', desc: 'Server-side runtime' },
    { name: 'MongoDB', icon: '🍃', desc: 'NoSQL database' },
    { name: 'SQL', icon: '🗄️', desc: 'Relational queries' },
    { name: 'HTML', icon: '🌐', desc: 'Markup language' },
    { name: 'CSS', icon: '🎨', desc: 'Styling & layouts' },
    { name: 'Tailwind', icon: '🌊', desc: 'Utility-first CSS' },
    { name: 'C', icon: '⚙️', desc: 'Systems programming' },
    { name: 'Hibernate', icon: '🗃️', desc: 'ORM framework' },
    { name: 'JSON', icon: '📋', desc: 'Data interchange' },
    { name: 'Git', icon: '📦', desc: 'Version control' },
    { name: 'PFSD', icon: '🏗️', desc: 'Full-stack development' },
]

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function TechGrid() {
    return (
        <section id="tech" style={{ position: 'relative', padding: '128px 0', background: 'var(--bg-secondary)' }}>
            {/* Top / Bottom fades */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 128, background: 'linear-gradient(to bottom, var(--bg-primary), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 128, background: 'linear-gradient(to top, var(--bg-primary), transparent)', pointerEvents: 'none' }} />

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
                        Tech Stack
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700 }}
                    >
                        Tools I <span className="gradient-text">master</span>.
                    </motion.h2>
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
                                    borderColor: 'rgba(124,58,237,0.4)',
                                    boxShadow: '0 0 30px rgba(124,58,237,0.15), inset 0 0 20px rgba(124,58,237,0.04)',
                                    background: 'rgba(255,255,255,0.08)',
                                    scale: 1.04,
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="glass-card"
                                style={{ padding: '24px 16px', cursor: 'default', textAlign: 'center' }}
                            >
                                <motion.div
                                    style={{ fontSize: 28, marginBottom: 10, display: 'inline-block' }}
                                    whileHover={{ scale: 1.25, rotate: [0, -8, 8, 0] }}
                                    transition={{ duration: 0.45 }}
                                >
                                    {tech.icon}
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
