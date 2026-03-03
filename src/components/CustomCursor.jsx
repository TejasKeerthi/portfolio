import { useEffect, useRef, useCallback } from 'react'

/**
 * Neural-constellation cursor
 * A glowing core with trailing particles that form connecting lines —
 * like a tiny neural network following the mouse.
 */
export default function CustomCursor() {
    const canvasRef = useRef(null)
    const mouse = useRef({ x: -100, y: -100 })
    const points = useRef([])
    const raf = useRef(null)
    const hovered = useRef(false)

    const TRAIL_LENGTH = 18
    const CONNECT_DIST = 90
    const BASE_RADIUS = 3
    const HOVER_RADIUS = 5

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const W = canvas.width
        const H = canvas.height
        ctx.clearRect(0, 0, W, H)

        // Push new point
        const pts = points.current
        pts.unshift({ x: mouse.current.x, y: mouse.current.y, life: 1 })
        if (pts.length > TRAIL_LENGTH) pts.pop()

        // Decay life
        for (let i = 0; i < pts.length; i++) {
            pts[i].life = 1 - i / pts.length
        }

        // Draw connecting lines (neural-net edges)
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x
                const dy = pts[i].y - pts[j].y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * pts[i].life * pts[j].life * 0.35
                    ctx.beginPath()
                    ctx.moveTo(pts[i].x, pts[i].y)
                    ctx.lineTo(pts[j].x, pts[j].y)
                    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }
        }

        // Draw trail nodes
        for (let i = 0; i < pts.length; i++) {
            const p = pts[i]
            const r = (hovered.current ? HOVER_RADIUS : BASE_RADIUS) * p.life
            const alpha = p.life

            // Outer glow
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
            grad.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.3})`)
            grad.addColorStop(1, 'rgba(6, 182, 212, 0)')
            ctx.beginPath()
            ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()

            // Core node
            ctx.beginPath()
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(165, 243, 252, ${alpha})`
            ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
            ctx.shadowBlur = 12 * alpha
            ctx.fill()
            ctx.shadowBlur = 0
        }

        // Draw primary cursor — brighter core
        if (pts.length > 0) {
            const { x, y } = pts[0]
            const coreR = hovered.current ? 7 : 4

            // Pulse ring
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.005)
            ctx.beginPath()
            ctx.arc(x, y, coreR + 8 + pulse * 6, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 + pulse * 0.08})`
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Bright center
            const cg = ctx.createRadialGradient(x, y, 0, x, y, coreR)
            cg.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
            cg.addColorStop(0.4, 'rgba(103, 232, 249, 0.8)')
            cg.addColorStop(1, 'rgba(6, 182, 212, 0.4)')
            ctx.beginPath()
            ctx.arc(x, y, coreR, 0, Math.PI * 2)
            ctx.fillStyle = cg
            ctx.shadowColor = '#22d3ee'
            ctx.shadowBlur = 20
            ctx.fill()
            ctx.shadowBlur = 0
        }

        raf.current = requestAnimationFrame(draw)
    }, [])

    useEffect(() => {
        const mql = window.matchMedia('(pointer: fine)')
        if (!mql.matches) return

        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const move = (e) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
        }
        window.addEventListener('mousemove', move, { passive: true })

        const addHover = () => { hovered.current = true }
        const removeHover = () => { hovered.current = false }

        const attach = () => {
            document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
                el.addEventListener('mouseenter', addHover)
                el.addEventListener('mouseleave', removeHover)
            })
        }
        attach()
        const observer = new MutationObserver(attach)
        observer.observe(document.body, { childList: true, subtree: true })

        raf.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', move)
            if (raf.current) cancelAnimationFrame(raf.current)
            observer.disconnect()
        }
    }, [draw])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 99999,
            }}
        />
    )
}
