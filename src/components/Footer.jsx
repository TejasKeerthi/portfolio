import { motion } from 'framer-motion'

const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/TejasKeerthi' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: 'mailto:hello@tejas.dev' },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{ position: 'relative', padding: '80px 0 40px', background: 'var(--bg-primary)' }}>
            {/* Top gradient line */}
            <div className="section-divider" style={{ marginBottom: 64 }} />

            <div className="container-main" style={{ textAlign: 'center' }}>
                {/* Big signature text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: 24,
                    }}>
                        Let's build something{' '}
                        <span className="gradient-text">extraordinary</span>.
                    </p>
                </motion.div>

                {/* Social links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 48 }}
                >
                    {SOCIALS.map(({ label, href }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3, color: '#22d3ee' }}
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: 999,
                                border: '1px solid rgba(255,255,255,0.06)',
                                background: 'rgba(255,255,255,0.02)',
                            }}
                        >
                            {label}
                        </motion.a>
                    ))}
                </motion.div>

                {/* Bottom line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                >
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        Designed & built by <span style={{ color: 'var(--accent-light)' }}>Tejas</span> — {year}
                    </p>
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }}
                    />
                </motion.div>
            </div>
        </footer>
    )
}
