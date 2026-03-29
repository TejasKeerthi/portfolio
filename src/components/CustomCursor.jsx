import { useEffect, useRef } from 'react'

const TRAIL_COUNT_HIGH = 18
const TRAIL_COUNT_LOW = 12
const SPARK_LIMIT_HIGH = 64
const SPARK_LIMIT_LOW = 28

function roundedRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width * 0.5, height * 0.5)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + width, y, x + width, y + height, r)
    ctx.arcTo(x + width, y + height, x, y + height, r)
    ctx.arcTo(x, y + height, x, y, r)
    ctx.arcTo(x, y, x + width, y, r)
    ctx.closePath()
}

export default function CustomCursor({ performanceMode = 'high' }) {
    const canvasRef = useRef(null)
    const rafRef = useRef(null)
    const dprRef = useRef(1)
    const lastTimeRef = useRef(0)

    const pointerRef = useRef({ x: -200, y: -200, active: false })
    const cursorRef = useRef({ x: -200, y: -200, vx: 0, vy: 0, opacity: 0 })
    const hoverRef = useRef({
        active: false,
        x: -200,
        y: -200,
        width: 44,
        height: 44,
        radius: 22,
    })

    const lowPerf = performanceMode === 'low'
    const trailRef = useRef(Array.from({ length: lowPerf ? TRAIL_COUNT_LOW : TRAIL_COUNT_HIGH }, () => ({ x: -200, y: -200 })))
    const wavesRef = useRef([])
    const sparksRef = useRef([])
    const pageVisibleRef = useRef(true)

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)')
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

        if (!finePointer.matches || reducedMotion.matches) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            dprRef.current = Math.min(window.devicePixelRatio || 1, lowPerf ? 1.2 : 1.5)
            canvas.width = Math.floor(window.innerWidth * dprRef.current)
            canvas.height = Math.floor(window.innerHeight * dprRef.current)
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
        }

        const spawnClickBurst = (x, y) => {
            wavesRef.current.push({ x, y, radius: 9, life: 1, speed: 220 })

            const sparkCount = lowPerf ? 7 : 12
            for (let index = 0; index < sparkCount; index++) {
                const angle = (Math.PI * 2 * index) / sparkCount + Math.random() * 0.25
                const speed = 140 + Math.random() * 180
                sparksRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 0.85 + Math.random() * 0.35,
                    size: 1.3 + Math.random() * 2.2,
                })
            }

            const sparkLimit = lowPerf ? SPARK_LIMIT_LOW : SPARK_LIMIT_HIGH
            if (sparksRef.current.length > sparkLimit) {
                sparksRef.current.splice(0, sparksRef.current.length - sparkLimit)
            }
        }

        const syncHoverTarget = (target) => {
            const interactive = target?.closest?.('a, button, [data-hover], input, textarea, select, [role="button"]')
            if (!interactive) {
                hoverRef.current.active = false
                return
            }

            const rect = interactive.getBoundingClientRect()
            const clampedWidth = Math.min(Math.max(rect.width + 14, 38), 260)
            const clampedHeight = Math.min(Math.max(rect.height + 14, 38), 74)

            hoverRef.current.active = true
            hoverRef.current.x = rect.left + rect.width * 0.5
            hoverRef.current.y = rect.top + rect.height * 0.5
            hoverRef.current.width = clampedWidth
            hoverRef.current.height = clampedHeight
            hoverRef.current.radius = Math.min(22, clampedHeight * 0.45)
        }

        const handlePointerMove = (event) => {
            pointerRef.current.x = event.clientX
            pointerRef.current.y = event.clientY
            pointerRef.current.active = true
            syncHoverTarget(event.target)
        }

        const handlePointerDown = (event) => {
            spawnClickBurst(event.clientX, event.clientY)
        }

        const handlePointerLeave = () => {
            pointerRef.current.active = false
            hoverRef.current.active = false
        }

        const handleVisibility = () => {
            pageVisibleRef.current = !document.hidden
        }

        const draw = (time) => {
            const canvasWidth = canvas.width / dprRef.current
            const canvasHeight = canvas.height / dprRef.current

            if (!pageVisibleRef.current) {
                rafRef.current = requestAnimationFrame(draw)
                return
            }

            const lastTime = lastTimeRef.current || time
            const dt = Math.min(0.035, (time - lastTime) / 1000)
            lastTimeRef.current = time

            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            ctx.globalCompositeOperation = 'lighter'

            const pointer = pointerRef.current
            const cursor = cursorRef.current
            const hover = hoverRef.current

            const magnetTargetX = hover.active ? pointer.x * 0.7 + hover.x * 0.3 : pointer.x
            const magnetTargetY = hover.active ? pointer.y * 0.7 + hover.y * 0.3 : pointer.y

            const smoothing = hover.active ? 14 : 19
            const blend = 1 - Math.exp(-smoothing * dt)

            const prevX = cursor.x
            const prevY = cursor.y
            cursor.x += (magnetTargetX - cursor.x) * blend
            cursor.y += (magnetTargetY - cursor.y) * blend
            cursor.vx = (cursor.x - prevX) / Math.max(dt, 0.0001)
            cursor.vy = (cursor.y - prevY) / Math.max(dt, 0.0001)

            const targetOpacity = pointer.active ? 1 : 0
            cursor.opacity += (targetOpacity - cursor.opacity) * (1 - Math.exp(-10 * dt))

            const trail = trailRef.current
            trail[0].x += (cursor.x - trail[0].x) * (1 - Math.exp(-24 * dt))
            trail[0].y += (cursor.y - trail[0].y) * (1 - Math.exp(-24 * dt))

            for (let index = 1; index < trail.length; index++) {
                const speedFactor = hover.active ? (lowPerf ? 12 : 16) : (lowPerf ? 16 : 20)
                const linkBlend = 1 - Math.exp(-speedFactor * dt)
                trail[index].x += (trail[index - 1].x - trail[index].x) * linkBlend
                trail[index].y += (trail[index - 1].y - trail[index].y) * linkBlend
            }

            const velocity = Math.min(1, Math.hypot(cursor.vx, cursor.vy) / 820)

            for (let index = trail.length - 1; index >= 0; index--) {
                const point = trail[index]
                const t = 1 - index / trail.length
                const radius = (hover.active ? 15 : 11) * t + 2 + velocity * 4
                const alpha = (0.03 + t * 0.17) * cursor.opacity

                const blob = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 2.5)
                blob.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
                blob.addColorStop(0.4, `rgba(221, 232, 249, ${alpha * 0.9})`)
                blob.addColorStop(1, 'rgba(146, 171, 205, 0)')

                ctx.beginPath()
                ctx.arc(point.x, point.y, radius * 2.5, 0, Math.PI * 2)
                ctx.fillStyle = blob
                ctx.fill()
            }

            for (let index = wavesRef.current.length - 1; index >= 0; index--) {
                const wave = wavesRef.current[index]
                wave.life -= dt * (lowPerf ? 2 : 1.7)
                wave.radius += wave.speed * dt
                wave.speed *= 0.96

                if (wave.life <= 0) {
                    wavesRef.current.splice(index, 1)
                    continue
                }

                ctx.beginPath()
                ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(236, 244, 255, ${wave.life * 0.45 * cursor.opacity})`
                ctx.lineWidth = 1.3
                ctx.stroke()
            }

            for (let index = sparksRef.current.length - 1; index >= 0; index--) {
                const spark = sparksRef.current[index]
                spark.life -= dt * (lowPerf ? 2.6 : 2.2)
                spark.x += spark.vx * dt
                spark.y += spark.vy * dt
                spark.vx *= 0.93
                spark.vy *= 0.93

                if (spark.life <= 0) {
                    sparksRef.current.splice(index, 1)
                    continue
                }

                const glow = ctx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, spark.size * 3.2)
                glow.addColorStop(0, `rgba(255, 255, 255, ${spark.life * 0.85 * cursor.opacity})`)
                glow.addColorStop(1, 'rgba(214, 228, 248, 0)')

                ctx.beginPath()
                ctx.arc(spark.x, spark.y, spark.size * 3.2, 0, Math.PI * 2)
                ctx.fillStyle = glow
                ctx.fill()
            }

            const pulse = 0.5 + 0.5 * Math.sin(time * 0.0058)
            const headRadius = (hover.active ? 11.5 : 8.5) + velocity * 3.2

            const outerRing = ctx.createRadialGradient(cursor.x, cursor.y, headRadius, cursor.x, cursor.y, headRadius + 13)
            outerRing.addColorStop(0, `rgba(245, 250, 255, ${(0.22 + pulse * 0.12) * cursor.opacity})`)
            outerRing.addColorStop(1, 'rgba(245, 250, 255, 0)')

            ctx.beginPath()
            ctx.arc(cursor.x, cursor.y, headRadius + 13, 0, Math.PI * 2)
            ctx.fillStyle = outerRing
            ctx.fill()

            const core = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, headRadius * 1.9)
            core.addColorStop(0, `rgba(255, 255, 255, ${0.9 * cursor.opacity})`)
            core.addColorStop(0.48, `rgba(231, 239, 251, ${0.7 * cursor.opacity})`)
            core.addColorStop(1, 'rgba(156, 181, 212, 0)')

            ctx.beginPath()
            ctx.arc(cursor.x, cursor.y, headRadius, 0, Math.PI * 2)
            ctx.fillStyle = core
            ctx.fill()

            ctx.beginPath()
            ctx.arc(cursor.x, cursor.y, headRadius + 3.5, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.24 * cursor.opacity})`
            ctx.lineWidth = 1
            ctx.stroke()

            if (hover.active && !lowPerf) {
                const hoverX = hover.x - hover.width * 0.5
                const hoverY = hover.y - hover.height * 0.5

                roundedRectPath(ctx, hoverX, hoverY, hover.width, hover.height, hover.radius)
                ctx.strokeStyle = `rgba(236, 244, 255, ${0.22 * cursor.opacity})`
                ctx.lineWidth = 1.15
                ctx.stroke()

                const sweepX = hoverX + ((time * 0.08) % (hover.width + 60)) - 30
                const beam = ctx.createLinearGradient(sweepX - 40, hoverY, sweepX + 40, hoverY + hover.height)
                beam.addColorStop(0, 'rgba(255,255,255,0)')
                beam.addColorStop(0.5, `rgba(255,255,255,${0.18 * cursor.opacity})`)
                beam.addColorStop(1, 'rgba(255,255,255,0)')

                roundedRectPath(ctx, hoverX, hoverY, hover.width, hover.height, hover.radius)
                ctx.fillStyle = beam
                ctx.fill()
            }

            ctx.globalCompositeOperation = 'source-over'
            rafRef.current = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener('resize', resize)
        document.addEventListener('pointermove', handlePointerMove, { passive: true })
        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerleave', handlePointerLeave)
        document.addEventListener('visibilitychange', handleVisibility)
        rafRef.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            document.removeEventListener('pointermove', handlePointerMove)
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerleave', handlePointerLeave)
            document.removeEventListener('visibilitychange', handleVisibility)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [lowPerf])

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
