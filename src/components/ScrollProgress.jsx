import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

    return (
        <motion.div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #64748b, #94a3b8, #cbd5e1)',
                transformOrigin: '0%',
                scaleX,
                zIndex: 9998,
                boxShadow: '0 0 12px rgba(148,163,184,0.4)',
            }}
        />
    )
}
