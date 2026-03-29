import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Tech', href: '#tech', id: 'tech' },
    { label: 'Projects', href: '#projects', id: 'projects' },
]

export default function Navbar({ onContactClick }) {
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState('about')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 36)
        window.addEventListener('scroll', onScroll, { passive: true })

        const sections = NAV_LINKS
            .map((item) => document.getElementById(item.id))
            .filter(Boolean)

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (visibleEntries[0]?.target?.id) {
                    setActive(visibleEntries[0].target.id)
                }
            },
            { threshold: [0.2, 0.45, 0.7] },
        )

        sections.forEach((section) => observer.observe(section))

        return () => {
            window.removeEventListener('scroll', onScroll)
            observer.disconnect()
        }
    }, [])

    return (
        <motion.nav
            initial={{ y: -28, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 80,
                padding: scrolled ? '12px 0' : '20px 0',
                transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div className="container-main">
                <div
                    className="nav-shell"
                    style={{
                        margin: '0 auto',
                        maxWidth: 1040,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 14,
                        borderRadius: 999,
                        padding: scrolled ? '8px 10px' : '10px 12px',
                        background: scrolled
                            ? 'linear-gradient(155deg, rgba(255,255,255,0.16), rgba(18,24,33,0.68) 34%, rgba(11,15,21,0.76) 100%)'
                            : 'linear-gradient(155deg, rgba(255,255,255,0.14), rgba(18,24,33,0.52) 34%, rgba(11,15,21,0.62) 100%)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        backdropFilter: 'blur(26px) saturate(170%)',
                        boxShadow: scrolled
                            ? '0 18px 42px rgba(4,7,12,0.34), inset 0 1px 0 rgba(255,255,255,0.2)'
                            : '0 12px 30px rgba(4,7,12,0.24), inset 0 1px 0 rgba(255,255,255,0.16)',
                        transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <motion.a
                        href="#hero"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 100 }}
                        data-hover
                    >
                        <motion.div
                            animate={{
                                boxShadow: [
                                    '0 0 0 rgba(218,229,245,0.18)',
                                    '0 0 22px rgba(218,229,245,0.34)',
                                    '0 0 0 rgba(218,229,245,0.18)',
                                ],
                            }}
                            transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity }}
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 13,
                                fontWeight: 800,
                                color: '#0b1015',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(216,227,243,0.9) 55%, rgba(156,176,204,0.86))',
                            }}
                        >
                            T
                        </motion.div>
                        <span style={{ color: 'rgba(245,247,251,0.94)', fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                            Tejas
                        </span>
                    </motion.a>

                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 4, borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(140deg, rgba(255,255,255,0.08), rgba(15,20,28,0.42))' }}>
                        {NAV_LINKS.map((item) => {
                            const isActive = active === item.id
                            return (
                                <motion.a
                                    key={item.id}
                                    href={item.href}
                                    whileHover={{ y: -1 }}
                                    data-hover
                                    style={{
                                        position: 'relative',
                                        padding: '7px 15px',
                                        borderRadius: 999,
                                        color: isActive ? '#ffffff' : 'rgba(210, 220, 235, 0.72)',
                                        fontSize: 12,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        fontFamily: 'var(--font-mono)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active-pill"
                                            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 999,
                                                background: 'linear-gradient(125deg, rgba(255,255,255,0.18), rgba(178,197,222,0.18) 54%, rgba(90,106,129,0.16))',
                                                border: '1px solid rgba(255,255,255,0.18)',
                                                zIndex: 0,
                                            }}
                                        />
                                    )}
                                    <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                                </motion.a>
                            )
                        })}
                    </div>

                    <motion.button
                        onClick={onContactClick}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className="nav-cta"
                        data-hover
                        style={{
                            border: '1px solid rgba(255,255,255,0.16)',
                            borderRadius: 999,
                            padding: '9px 17px',
                            fontSize: 12,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: '#091018',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(214,225,242,0.88) 55%, rgba(150,170,196,0.88))',
                            boxShadow: '0 12px 26px rgba(179,199,228,0.18), inset 0 1px 0 rgba(255,255,255,0.96)',
                        }}
                    >
                        Contact
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    )
}
