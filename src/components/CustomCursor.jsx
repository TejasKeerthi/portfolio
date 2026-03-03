import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)
    const trailX = useMotionValue(-100)
    const trailY = useMotionValue(-100)

    const springX = useSpring(trailX, { stiffness: 120, damping: 20, mass: 0.5 })
    const springY = useSpring(trailY, { stiffness: 120, damping: 20, mass: 0.5 })

    const hovering = useRef(false)
    const dotRef = useRef(null)
    const ringRef = useRef(null)

    useEffect(() => {
        // Only show on non-touch devices
        const mql = window.matchMedia('(pointer: fine)')
        if (!mql.matches) return

        const move = (e) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            trailX.set(e.clientX)
            trailY.set(e.clientY)
        }

        const addHover = () => {
            hovering.current = true
            if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1.8)'
            if (ringRef.current) {
                ringRef.current.style.width = '56px'
                ringRef.current.style.height = '56px'
                ringRef.current.style.borderColor = 'rgba(124,58,237,0.6)'
            }
        }
        const removeHover = () => {
            hovering.current = false
            if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
            if (ringRef.current) {
                ringRef.current.style.width = '40px'
                ringRef.current.style.height = '40px'
                ringRef.current.style.borderColor = 'rgba(124,58,237,0.25)'
            }
        }

        window.addEventListener('mousemove', move, { passive: true })

        const attach = () => {
            document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
                el.addEventListener('mouseenter', addHover)
                el.addEventListener('mouseleave', removeHover)
            })
        }
        attach()
        const observer = new MutationObserver(attach)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            window.removeEventListener('mousemove', move)
            observer.disconnect()
        }
    }, [cursorX, cursorY, trailX, trailY])

    return (
        <>
            {/* Dot */}
            <motion.div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: cursorX,
                    y: cursorY,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#a78bfa',
                    boxShadow: '0 0 16px rgba(167,139,250,0.5)',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    transform: 'translate(-50%,-50%)',
                    transition: 'transform 0.2s ease, background 0.2s ease',
                    mixBlendMode: 'screen',
                }}
            />
            {/* Ring */}
            <motion.div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: springX,
                    y: springY,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(124,58,237,0.25)',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    transform: 'translate(-50%,-50%)',
                    transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
                }}
            />
        </>
    )
}
