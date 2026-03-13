import { motion } from 'framer-motion'

const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/TejasKeerthi' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: 'mailto:hello@tejas.dev' },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{ position: 'relative', padding: '96px 0 44px', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.86 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'absolute',
                    top: -200,
                    left: '50%',
                    width: 620,
                    height: 620,
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.2), rgba(124,58,237,0))',
                }}
            />

            <div className="container-main" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div className="section-divider" style={{ marginBottom: 60 }} />

                <motion.p
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontSize: 'clamp(2.1rem, 5.4vw, 4.8rem)',
                        lineHeight: 1.05,
                        fontWeight: 700,
                        marginBottom: 22,
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    Building digital experiences
                    <br />
                    that feel <span className="gradient-text">inevitable</span>.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{ maxWidth: 620, margin: '0 auto 30px', color: 'rgba(188, 180, 222, 0.82)', fontSize: 15, lineHeight: 1.75 }}
                >
                    Open for ambitious AI products, interactive web systems, and design-forward engineering collaborations.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: 0.18 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}
                >
                    {SOCIALS.map(({ label, href }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3, borderColor: 'rgba(196,132,252,0.55)', color: '#ffffff' }}
                            style={{
                                borderRadius: 999,
                                border: '1px solid rgba(255,255,255,0.16)',
                                background: 'linear-gradient(140deg, rgba(14,10,38,0.7), rgba(6,4,20,0.55))',
                                textDecoration: 'none',
                                color: 'rgba(219, 212, 247, 0.9)',
                                padding: '10px 18px',
                                fontSize: 12,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-mono)',
                            }}
                        >
                            {label}
                        </motion.a>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{ display: 'grid', justifyItems: 'center', gap: 10 }}
                >
                    <p style={{ fontSize: 12, color: 'rgba(166, 155, 200, 0.85)', fontFamily: 'var(--font-mono)' }}>
                        Designed and engineered by <span style={{ color: 'rgba(206, 176, 252, 0.95)' }}>Tejas</span> — {year}
                    </p>
                    <motion.div
                        animate={{ opacity: [0.25, 0.85, 0.25], scale: [1, 1.35, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(196,132,252,0.95)' }}
                    />
                </motion.div>
            </div>
        </footer>
    )
}
