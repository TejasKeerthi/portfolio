import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Tech', href: '#tech' },
    { label: 'Projects', href: '#projects' },
]

export default function Navbar({ onContactClick }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: scrolled ? '12px 0' : '20px 0',
                background: scrolled ? 'rgba(3, 0, 20, 0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px) saturate(150%)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <motion.a
                    href="#"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                        color: '#fff',
                        boxShadow: '0 0 25px rgba(124,58,237,0.4)',
                    }}>
                        T
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                        Tejas
                    </span>
                </motion.a>

                {/* Center nav links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    borderRadius: 999,
                    padding: '4px 4px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    {NAV_LINKS.map(({ label, href }, i) => (
                        <motion.a
                            key={label}
                            href={href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                            style={{
                                padding: '6px 18px',
                                borderRadius: 999,
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                transition: 'color 0.3s',
                            }}
                            onMouseEnter={(e) => (e.target.style.color = '#fff')}
                            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                        >
                            {label}
                        </motion.a>
                    ))}
                </div>

                {/* CTA */}
                <motion.button
                    onClick={onContactClick}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(124,58,237,0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        padding: '8px 22px',
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                    }}
                >
                    Get in Touch
                </motion.button>
            </div>
        </motion.nav>
    )
}
