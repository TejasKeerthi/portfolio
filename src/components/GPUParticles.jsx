import { useEffect, useRef, useCallback } from 'react'

/**
 * GPU-accelerated floating particle grid drawn on a full-screen <canvas>.
 * Uses requestAnimationFrame + translate3d-style math for silky 60 fps.
 * Particles connect with proximity lines — like a neural mesh overlay.
 */
export default function GPUParticles({ count = 45, color = [124, 58, 237] }) {
    const canvasRef = useRef(null)
    const raf = useRef(null)
    const particles = useRef([])
    const mouse = useRef({ x: -9999, y: -9999 })

    const init = useCallback((W, H) => {
        const pts = []
        for (let i = 0; i < count; i++) {
            pts.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: 1.2 + Math.random() * 1.5,
                baseAlpha: 0.15 + Math.random() * 0.25,
            })
        }
        particles.current = pts
    }, [count])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const W = canvas.width
        const H = canvas.height
        const pts = particles.current
        const mx = mouse.current.x
        const my = mouse.current.y

        ctx.clearRect(0, 0, W, H)

        // Update positions
        for (const p of pts) {
            p.x += p.vx
            p.y += p.vy

            // Bounce off edges
            if (p.x < 0 || p.x > W) p.vx *= -1
            if (p.y < 0 || p.y > H) p.vy *= -1

            // Mouse repulsion
            const dx = p.x - mx
            const dy = p.y - my
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 150) {
                const force = (150 - dist) / 150 * 0.02
                p.vx += dx * force
                p.vy += dy * force
            }

            // Clamp velocity
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
            if (speed > 1) {
                p.vx = (p.vx / speed) * 1
                p.vy = (p.vy / speed) * 1
            }
        }

        // Draw connections
        const CONNECT = 160
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x
                const dy = pts[i].y - pts[j].y
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < CONNECT) {
                    const alpha = (1 - d / CONNECT) * 0.12
                    ctx.beginPath()
                    ctx.moveTo(pts[i].x, pts[i].y)
                    ctx.lineTo(pts[j].x, pts[j].y)
                    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
                    ctx.lineWidth = 0.6
                    ctx.stroke()
                }
            }
        }

        // Draw particles
        for (const p of pts) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${p.baseAlpha})`
            ctx.fill()

            // Subtle glow
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
            g.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${p.baseAlpha * 0.3})`)
            g.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`)
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
            ctx.fillStyle = g
            ctx.fill()
        }

        raf.current = requestAnimationFrame(draw)
    }, [color])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            if (particles.current.length === 0) init(canvas.width, canvas.height)
        }
        resize()
        window.addEventListener('resize', resize)

        const move = (e) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
        }
        window.addEventListener('mousemove', move, { passive: true })

        raf.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', move)
            if (raf.current) cancelAnimationFrame(raf.current)
        }
    }, [draw, init])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.6,
            }}
        />
    )
}
