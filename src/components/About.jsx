import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
    { value: 5, suffix: '+', label: 'Years Experience' },
    { value: 40, suffix: '+', label: 'Projects Shipped' },
    { value: 99, suffix: '%', label: 'Lighthouse Scores' },
    { value: null, symbol: '∞', label: 'Curiosity' },
]

/* Animated counter */
function Counter({ value, suffix = '', symbol }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isInView || symbol) return
        let start = 0
        const end = value
        const duration = 1500
        const startTime = Date.now()
        const tick = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [isInView, value, symbol])

    return (
        <span ref={ref} className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900 }}>
            {symbol || `${count}${suffix}`}
        </span>
    )
}

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

                    {/* Stats with animated counters */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={stagger}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 64, textAlign: 'center' }}
                    >
                        {stats.map(({ value, suffix, symbol, label }, i) => (
                            <motion.div
                                key={label}
                                variants={fadeUp}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.3)' }}
                                className="glass-card"
                                style={{ padding: '24px 16px' }}
                            >
                                <Counter value={value} suffix={suffix} symbol={symbol} />
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 8, color: 'var(--text-secondary)' }}>
                                    {label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="section-divider" style={{ marginTop: 128 }} />
        </section>
    )
}
