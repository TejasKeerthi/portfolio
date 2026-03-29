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
                background: 'linear-gradient(90deg, rgba(255,255,255,0.88), rgba(214,226,244,0.88), rgba(141,164,193,0.88))',
                transformOrigin: '0%',
                scaleX,
                zIndex: 9998,
                boxShadow: '0 0 16px rgba(207,223,244,0.34)',
            }}
        />
    )
}
