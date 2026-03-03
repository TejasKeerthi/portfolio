import { useEffect, useRef, useCallback } from 'react'

/**
 * Paint-brush cursor — leaves colourful paint strokes that fade out.
 * Splatters spawn on click. Trail uses soft round brush + varying width.
 */
export default function CustomCursor() {
    const canvasRef = useRef(null)
    const mouse = useRef({ x: -100, y: -100 })
    const prev = useRef({ x: -100, y: -100 })
    const points = useRef([])
    const splats = useRef([])
    const raf = useRef(null)
    const hovered = useRef(false)

    const TRAIL = 50
    const COLORS = [
        [124, 58, 237],   // purple
        [167, 139, 250],  // lavender
        [196, 132, 252],  // pink-purple
        [129, 140, 248],  // indigo
        [99, 102, 241],   // violet-blue
    ]

    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)]

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const W = canvas.width
        const H = canvas.height
        ctx.clearRect(0, 0, W, H)

        const mx = mouse.current.x
        const my = mouse.current.y

        // Calculate velocity for brush width
        const dx = mx - prev.current.x
        const dy = my - prev.current.y
        const vel = Math.sqrt(dx * dx + dy * dy)
        prev.current = { x: mx, y: my }

        // Push new trail point
        const pts = points.current
        if (mx > 0 && my > 0) {
            const c = pick()
            const width = hovered.current ? 12 : Math.max(2, 8 - vel * 0.15)
            pts.unshift({ x: mx, y: my, life: 1, c, w: width })
        }
        if (pts.length > TRAIL) pts.length = TRAIL

        // Decay & draw paint strokes (soft round brush segments)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i]
            const b = pts[i + 1]
            a.life -= 0.018

            if (a.life <= 0) continue

            const alpha = a.life * 0.6
            const w = a.w * a.life

            // Gradient stroke from point to point
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${a.c[0]}, ${a.c[1]}, ${a.c[2]}, ${alpha})`
            ctx.lineWidth = w
            ctx.stroke()

            // Soft glow around stroke
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${a.c[0]}, ${a.c[1]}, ${a.c[2]}, ${alpha * 0.15})`
            ctx.lineWidth = w * 3.5
            ctx.stroke()
        }

        // Remove dead points
        while (pts.length > 0 && pts[pts.length - 1].life <= 0) pts.pop()

        // --- Paint splatters (on click) ---
        for (let i = splats.current.length - 1; i >= 0; i--) {
            const s = splats.current[i]
            s.life -= 0.012
            if (s.life <= 0) { splats.current.splice(i, 1); continue }

            for (const drop of s.drops) {
                drop.x += drop.vx * 0.6
                drop.y += drop.vy * 0.6
                drop.vx *= 0.96
                drop.vy *= 0.96

                const a = s.life * 0.7
                const r = drop.r * (0.5 + s.life * 0.5)

                ctx.beginPath()
                ctx.arc(drop.x, drop.y, r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${drop.c[0]}, ${drop.c[1]}, ${drop.c[2]}, ${a})`
                ctx.fill()

                const g = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, r * 3)
                g.addColorStop(0, `rgba(${drop.c[0]}, ${drop.c[1]}, ${drop.c[2]}, ${a * 0.3})`)
                g.addColorStop(1, `rgba(${drop.c[0]}, ${drop.c[1]}, ${drop.c[2]}, 0)`)
                ctx.beginPath()
                ctx.arc(drop.x, drop.y, r * 3, 0, Math.PI * 2)
                ctx.fillStyle = g
                ctx.fill()
            }
        }

        // --- Brush tip (always visible at cursor) ---
        if (mx > 0 && my > 0) {
            const tipR = hovered.current ? 10 : 5
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.006)

            // Outer ring
            ctx.beginPath()
            ctx.arc(mx, my, tipR + 6 + pulse * 3, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 + pulse * 0.1})`
            ctx.lineWidth = 1.2
            ctx.stroke()

            // Paint blob center
            const cg = ctx.createRadialGradient(mx, my, 0, mx, my, tipR)
            cg.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
            cg.addColorStop(0.3, 'rgba(196, 132, 252, 0.7)')
            cg.addColorStop(1, 'rgba(124, 58, 237, 0.3)')
            ctx.beginPath()
            ctx.arc(mx, my, tipR, 0, Math.PI * 2)
            ctx.fillStyle = cg
            ctx.shadowColor = '#a78bfa'
            ctx.shadowBlur = 18
            ctx.fill()
            ctx.shadowBlur = 0

            // Tiny crosshair for precision feel
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
            ctx.lineWidth = 0.8
            const ch = tipR + 12
            ctx.beginPath()
            ctx.moveTo(mx - ch, my); ctx.lineTo(mx - tipR - 3, my)
            ctx.moveTo(mx + tipR + 3, my); ctx.lineTo(mx + ch, my)
            ctx.moveTo(mx, my - ch); ctx.lineTo(mx, my - tipR - 3)
            ctx.moveTo(mx, my + tipR + 3); ctx.lineTo(mx, my + ch)
            ctx.stroke()
        }

        raf.current = requestAnimationFrame(draw)
    }, [])

    // Spawn splatter
    const spawnSplat = useCallback((x, y) => {
        const drops = []
        const count = 8 + Math.floor(Math.random() * 10)
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 1 + Math.random() * 4
            drops.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 1.5 + Math.random() * 4,
                c: pick(),
            })
        }
        splats.current.push({ life: 1, drops })
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
        // Also track pointermove for broader compat (R3F canvas, iframes, etc.)
        window.addEventListener('pointermove', move, { passive: true })

        const down = (e) => {
            spawnSplat(e.clientX, e.clientY)
        }
        window.addEventListener('mousedown', down)
        window.addEventListener('pointerdown', down)

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
            window.removeEventListener('pointermove', move)
            window.removeEventListener('mousedown', down)
            window.removeEventListener('pointerdown', down)
            if (raf.current) cancelAnimationFrame(raf.current)
            observer.disconnect()
        }
    }, [draw, spawnSplat])

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
