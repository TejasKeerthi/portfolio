import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

const STAGES = [
    { label: 'INGEST', subLabel: 'CSV · Logs · Streams' },
    { label: 'CLEAN', subLabel: 'Normalize + Enrich' },
    { label: 'TRAIN', subLabel: 'GPU Batch Compute' },
    { label: 'SERVE', subLabel: 'Model Registry' },
    { label: 'INFER', subLabel: 'Realtime Response' },
]

const stageStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.15,
        },
    },
}

const cardReveal = {
    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
}

export default function DataPipelineViz({ performanceMode = 'high' }) {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const raf = useRef(null)
    const dprRef = useRef(1)
    const lastFrame = useRef(0)
    const visible = useRef(false)
    const particles = useRef([])
    const mouse = useRef({ x: 0, y: 0, active: false })

    const [telemetry, setTelemetry] = useState({
        throughput: '86.2',
        latency: '12.4',
        queueDepth: '154',
        confidence: '99.1',
    })

    const getTrackPoint = useCallback((progress, points, t) => {
        const clamped = Math.max(0, Math.min(0.9999, progress))
        const maxSegment = points.length - 1
        const scaled = clamped * maxSegment
        const idx = Math.floor(scaled)
        const local = scaled - idx
        const a = points[idx]
        const b = points[Math.min(idx + 1, points.length - 1)]

        const x = a.x + (b.x - a.x) * local
        const y = a.y + (b.y - a.y) * local + Math.sin(local * Math.PI) * (-18 + Math.sin(t * 1.4 + idx) * 5)
        return { x, y }
    }, [])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !visible.current) {
            raf.current = requestAnimationFrame(draw)
            return
        }

        const now = performance.now()
        if (now - lastFrame.current < 33) {
            raf.current = requestAnimationFrame(draw)
            return
        }
        lastFrame.current = now

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            raf.current = requestAnimationFrame(draw)
            return
        }

        const dpr = dprRef.current
        const W = canvas.width / dpr
        const H = canvas.height / dpr
        const t = Date.now() * 0.001
        const mx = mouse.current.x
        const my = mouse.current.y

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)

        // Atmospheric background layers for a premium panel feel.
        const bg = ctx.createLinearGradient(0, 0, W, H)
        bg.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
        bg.addColorStop(0.55, 'rgba(18, 24, 33, 0.26)')
        bg.addColorStop(1, 'rgba(8, 12, 18, 0.54)')
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, W, H)

        const fog = ctx.createRadialGradient(W * 0.22, H * 0.18, 30, W * 0.22, H * 0.18, W * 0.7)
        fog.addColorStop(0, 'rgba(225, 235, 248, 0.18)')
        fog.addColorStop(1, 'rgba(225, 235, 248, 0)')
        ctx.fillStyle = fog
        ctx.fillRect(0, 0, W, H)

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
        ctx.lineWidth = 1
        for (let x = 20; x < W; x += 40) {
            ctx.beginPath()
            ctx.moveTo(x + Math.sin(t * 0.18 + x * 0.02) * 2, 0)
            ctx.lineTo(x + Math.sin(t * 0.18 + x * 0.02) * 2, H)
            ctx.stroke()
        }
        for (let y = 20; y < H; y += 30) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(W, y)
            ctx.stroke()
        }

        const padX = Math.max(80, W * 0.1)
        const baseY = H * 0.63
        const stageGap = (W - padX * 2) / (STAGES.length - 1)
        const stagePoints = STAGES.map((_, i) => ({
            x: padX + i * stageGap,
            y: baseY + Math.sin(t * 0.9 + i * 0.8) * 7,
        }))

        const samples = performanceMode === 'low' ? 96 : 160
        ctx.beginPath()
        for (let i = 0; i <= samples; i++) {
            const p = getTrackPoint(i / samples, stagePoints, t)
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = 'rgba(201, 215, 236, 0.2)'
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.stroke()

        const flow = ctx.createLinearGradient(padX, 0, W - padX, 0)
        const phase = (t * 0.3) % 1
        flow.addColorStop(0, 'rgba(214, 226, 244, 0)')
        flow.addColorStop(Math.max(0, phase - 0.15), 'rgba(214, 226, 244, 0)')
        flow.addColorStop(phase, 'rgba(241, 247, 255, 0.9)')
        flow.addColorStop(Math.min(1, phase + 0.15), 'rgba(214, 226, 244, 0)')
        flow.addColorStop(1, 'rgba(214, 226, 244, 0)')

        ctx.beginPath()
        for (let i = 0; i <= samples; i++) {
            const p = getTrackPoint(i / samples, stagePoints, t)
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = flow
        ctx.lineWidth = 3
        ctx.setLineDash([8, 14])
        ctx.lineDashOffset = -(t * 100)
        ctx.stroke()
        ctx.setLineDash([])

        const activeStage = Math.floor((t * 1.4) % STAGES.length)
        for (let i = 0; i < stagePoints.length; i++) {
            const s = stagePoints[i]
            const pulse = Math.sin(t * 2.2 + i * 1.1) * 0.5 + 0.5
            const isActive = i === activeStage

            const aura = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 36 + pulse * 14)
            aura.addColorStop(0, `rgba(228, 237, 250, ${0.22 + pulse * 0.16})`)
            aura.addColorStop(1, 'rgba(228, 237, 250, 0)')
            ctx.fillStyle = aura
            ctx.beginPath()
            ctx.arc(s.x, s.y, 36 + pulse * 14, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = 'rgba(10, 14, 20, 0.92)'
            ctx.beginPath()
            ctx.arc(s.x, s.y, 12, 0, Math.PI * 2)
            ctx.fill()

            ctx.strokeStyle = isActive ? 'rgba(246, 249, 255, 0.85)' : `rgba(176, 196, 224, ${0.35 + pulse * 0.22})`
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.arc(s.x, s.y, 12, 0, Math.PI * 2)
            ctx.stroke()

            ctx.strokeStyle = isActive ? 'rgba(232, 240, 251, 0.52)' : 'rgba(203, 217, 237, 0.18)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(s.x, s.y, 18 + pulse * 5, 0, Math.PI * 2)
            ctx.stroke()

            ctx.font = '700 10px "JetBrains Mono", monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillStyle = isActive ? 'rgba(244, 247, 252, 0.92)' : 'rgba(203, 217, 237, 0.56)'
            ctx.fillText(STAGES[i].label, s.x, s.y - 24)

            ctx.font = '9px "JetBrains Mono", monospace'
            ctx.textBaseline = 'top'
            ctx.fillStyle = 'rgba(188, 201, 219, 0.42)'
            ctx.fillText(STAGES[i].subLabel, s.x, s.y + 22)
        }

        const particleSpawnRate = performanceMode === 'low' ? 0.06 : 0.11
        const maxParticles = performanceMode === 'low' ? 34 : 70
        if (Math.random() < particleSpawnRate && particles.current.length < maxParticles) {
            particles.current.push({
                progress: 0,
                speed: 0.0028 + Math.random() * (performanceMode === 'low' ? 0.0022 : 0.0036),
                size: 1.8 + Math.random() * 2.4,
                hue: Math.random() > 0.5 ? 206 : 214,
                wobble: Math.random() * Math.PI * 2,
            })
        }

        for (let i = particles.current.length - 1; i >= 0; i--) {
            const p = particles.current[i]
            p.progress += p.speed

            if (p.progress >= 1) {
                particles.current.splice(i, 1)
                continue
            }

            const head = getTrackPoint(p.progress, stagePoints, t)
            const tail = getTrackPoint(Math.max(0, p.progress - 0.024), stagePoints, t)
            const py = head.y + Math.sin(t * 6 + p.wobble + p.progress * 12) * 2

            const trail = ctx.createLinearGradient(tail.x, tail.y, head.x, py)
            trail.addColorStop(0, `hsla(${p.hue}, 90%, 72%, 0)`)
            trail.addColorStop(1, `hsla(${p.hue}, 90%, 72%, 0.65)`)
            ctx.strokeStyle = trail
            ctx.lineWidth = Math.max(1, p.size * 0.9)
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(tail.x, tail.y)
            ctx.lineTo(head.x, py)
            ctx.stroke()

            const glow = ctx.createRadialGradient(head.x, py, 0, head.x, py, p.size * 5)
            glow.addColorStop(0, `hsla(${p.hue}, 90%, 70%, 0.7)`)
            glow.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`)
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(head.x, py, p.size * 5, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = `hsla(${p.hue}, 95%, 76%, 0.95)`
            ctx.beginPath()
            ctx.arc(head.x, py, p.size, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textBaseline = 'bottom'
        ctx.textAlign = 'left'
        ctx.fillStyle = 'rgba(196, 208, 225, 0.32)'
        const epoch = (((t * 0.6) % 400) | 0).toString().padStart(3, '0')
        const loss = (0.72 * Math.exp(-epoch * 0.006) + 0.01).toFixed(4)
        ctx.fillText(`epoch ${epoch}   loss ${loss}`, 20, H - 14)

        ctx.textAlign = 'right'
        const bandwidth = (68 + Math.sin(t * 0.7) * 17).toFixed(1)
        ctx.fillText(`${bandwidth} GB/s stream velocity`, W - 20, H - 14)

        if (mouse.current.active) {
            const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, 220)
            spotlight.addColorStop(0, 'rgba(223, 234, 249, 0.18)')
            spotlight.addColorStop(1, 'rgba(223, 234, 249, 0)')
            ctx.fillStyle = spotlight
            ctx.fillRect(0, 0, W, H)
        }

        raf.current = requestAnimationFrame(draw)
    }, [getTrackPoint, performanceMode])

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now() * 0.001
            setTelemetry({
                throughput: (80 + Math.sin(now * 0.9) * 9).toFixed(1),
                latency: (11 + Math.cos(now * 1.4) * 2.4).toFixed(1),
                queueDepth: `${Math.max(80, Math.round(140 + Math.sin(now * 1.7) * 56))}`,
                confidence: (98.6 + Math.sin(now * 0.8) * 0.7).toFixed(1),
            })
        }, performanceMode === 'low' ? 1300 : 900)

        return () => clearInterval(interval)
    }, [performanceMode])

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resize = () => {
            const rect = container.getBoundingClientRect()
            dprRef.current = Math.min(window.devicePixelRatio || 1, performanceMode === 'low' ? 1.1 : 1.6)
            canvas.width = Math.floor(rect.width * dprRef.current)
            canvas.height = Math.floor(rect.height * dprRef.current)
        }
        resize()
        window.addEventListener('resize', resize)

        const onMove = (e) => {
            const rect = container.getBoundingClientRect()
            const localX = e.clientX - rect.left
            const localY = e.clientY - rect.top
            const px = ((localX / rect.width) * 100).toFixed(2)
            const py = ((localY / rect.height) * 100).toFixed(2)

            mouse.current.x = localX
            mouse.current.y = localY
            mouse.current.active = true

            container.style.setProperty('--pipeline-mx', `${px}%`)
            container.style.setProperty('--pipeline-my', `${py}%`)
        }

        const onLeave = () => {
            mouse.current.active = false
            container.style.setProperty('--pipeline-mx', '50%')
            container.style.setProperty('--pipeline-my', '38%')
        }

        container.addEventListener('mousemove', onMove, { passive: true })
        container.addEventListener('mouseleave', onLeave)

        const obs = new IntersectionObserver(([entry]) => {
            visible.current = entry.isIntersecting
        }, { threshold: 0.1 })
        obs.observe(container)

        raf.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            container.removeEventListener('mousemove', onMove)
            container.removeEventListener('mouseleave', onLeave)
            if (raf.current) cancelAnimationFrame(raf.current)
            obs.disconnect()
        }
    }, [draw, performanceMode])

    return (
        <section style={{ position: 'relative', padding: '72px 0 92px', overflow: 'hidden' }}>
            <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.86 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'absolute',
                    top: -140,
                    left: '50%',
                    width: 720,
                    height: 420,
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                    background: 'radial-gradient(circle, rgba(223,234,249,0.18) 0%, rgba(223,234,249,0) 72%)',
                    pointerEvents: 'none',
                }}
            />

            <div className="container-main" style={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                    initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', marginBottom: 24 }}
                >
                    <p style={{ fontSize: 12, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(218, 228, 243, 0.72)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                        Pipeline Choreography
                    </p>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)', fontWeight: 700, lineHeight: 1.1 }}>
                        Data moves like a <span className="gradient-text" data-text="system">cinematic system</span>
                    </h2>
                </motion.div>

                <motion.div
                    ref={containerRef}
                    className="pipeline-shell"
                    initial={{ opacity: 0, y: 28, scale: 0.96, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    viewport={{ once: true, margin: '-70px' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
                    <div className="pipeline-grid" />
                    <div className="pipeline-beam" />
                    <div className="pipeline-spotlight" />

                    <motion.div
                        variants={stageStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            right: 16,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: 10,
                            zIndex: 3,
                        }}
                    >
                        {STAGES.map((stage, i) => (
                            <motion.div
                                key={stage.label}
                                variants={cardReveal}
                                whileHover={{ y: -6, scale: 1.03, borderColor: 'rgba(255,255,255,0.22)', boxShadow: '0 20px 35px rgba(4,7,12,0.3)' }}
                                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: 12,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: i % 2 ? 'linear-gradient(140deg, rgba(255,255,255,0.1), rgba(16,22,31,0.38))' : 'linear-gradient(140deg, rgba(255,255,255,0.08), rgba(11,15,22,0.44))',
                                    backdropFilter: 'blur(8px)',
                                }}
                                data-hover
                            >
                                <div style={{ fontSize: 10, letterSpacing: '0.16em', color: 'rgba(206, 217, 234, 0.82)', fontFamily: 'var(--font-mono)' }}>
                                    {stage.label}
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(214, 223, 237, 0.68)' }}>
                                    {stage.subLabel}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.28, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'absolute',
                            left: 16,
                            right: 16,
                            bottom: 16,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: 10,
                            zIndex: 3,
                        }}
                    >
                        {[
                            { label: 'Throughput', value: `${telemetry.throughput} MB/s` },
                            { label: 'Latency', value: `${telemetry.latency} ms` },
                            { label: 'Queue Depth', value: telemetry.queueDepth },
                            { label: 'Model Confidence', value: `${telemetry.confidence}%` },
                        ].map((item) => (
                            <motion.div
                                key={item.label}
                                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.22)' }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                style={{
                                    borderRadius: 12,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    padding: '10px 12px',
                                    background: 'linear-gradient(160deg, rgba(255,255,255,0.1), rgba(11,15,22,0.42))',
                                }}
                                data-hover
                            >
                                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(206, 217, 234, 0.78)', fontFamily: 'var(--font-mono)' }}>
                                    {item.label}
                                </div>
                                <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: 'rgba(247, 249, 252, 0.95)' }}>
                                    {item.value}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
