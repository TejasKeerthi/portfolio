import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

const LAYERS = [5, 7, 9, 6, 4]
const LAYER_NAMES = ['Input', 'Encoder', 'Attention', 'Fusion', 'Output']
const OUTPUT_NAMES = ['Vision', 'Text', 'Audio', 'Anomaly']

const panelStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.16,
        },
    },
}

const tileReveal = {
    hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
}

export default function NeuralNetworkViz() {
    const canvasRef = useRef(null)
    const shellRef = useRef(null)
    const raf = useRef(null)
    const dprRef = useRef(1)
    const visible = useRef(false)
    const mouse = useRef({ x: -9999, y: -9999, active: false })
    const pulses = useRef([])

    const [metrics, setMetrics] = useState({
        accuracy: '98.4',
        fps: '142',
        tokenRate: '2240',
        drift: '0.018',
    })

    const getNeurons = useCallback((W, H, t) => {
        const padX = W * 0.11
        const padY = H * 0.14
        const spacingX = (W - padX * 2) / (LAYERS.length - 1)
        const layers = []

        for (let l = 0; l < LAYERS.length; l++) {
            const count = LAYERS[l]
            const x = padX + l * spacingX
            const layerHeight = H - padY * 2
            const spacingY = layerHeight / (count + 1)
            const layer = []

            for (let n = 0; n < count; n++) {
                const y = padY + spacingY * (n + 1) + Math.sin(t * 0.9 + l * 0.7 + n * 0.5) * 2.4
                layer.push({
                    x,
                    y,
                    l,
                    n,
                    activation: Math.sin(t * 1.9 + l * 0.8 + n * 0.6) * 0.5 + 0.5,
                })
            }
            layers.push(layer)
        }

        return { layers, padX, padY, spacingX }
    }, [])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !visible.current) {
            raf.current = requestAnimationFrame(draw)
            return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            raf.current = requestAnimationFrame(draw)
            return
        }

        const dpr = dprRef.current
        const W = canvas.width / dpr
        const H = canvas.height / dpr
        const t = Date.now() * 0.001

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)

        const bg = ctx.createLinearGradient(0, 0, W, H)
        bg.addColorStop(0, 'rgba(15, 9, 47, 0.42)')
        bg.addColorStop(0.55, 'rgba(7, 4, 28, 0.28)')
        bg.addColorStop(1, 'rgba(2, 1, 14, 0.52)')
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, W, H)

        const haze = ctx.createRadialGradient(W * 0.75, H * 0.25, 40, W * 0.75, H * 0.25, W * 0.6)
        haze.addColorStop(0, 'rgba(129, 140, 248, 0.16)')
        haze.addColorStop(1, 'rgba(129, 140, 248, 0)')
        ctx.fillStyle = haze
        ctx.fillRect(0, 0, W, H)

        ctx.strokeStyle = 'rgba(167, 139, 250, 0.06)'
        ctx.lineWidth = 1
        for (let x = 24; x < W; x += 44) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, H)
            ctx.stroke()
        }

        const net = getNeurons(W, H, t)
        const neurons = net.layers
        const mx = mouse.current.x
        const my = mouse.current.y

        for (let l = 0; l < neurons.length - 1; l++) {
            for (const a of neurons[l]) {
                for (const b of neurons[l + 1]) {
                    const distanceToPointer = Math.hypot((a.x + b.x) * 0.5 - mx, (a.y + b.y) * 0.5 - my)
                    const pointerBoost = mouse.current.active ? Math.max(0, 1 - distanceToPointer / 180) : 0
                    const base = (a.activation + b.activation) * 0.5
                    const alpha = 0.025 + base * 0.085 + pointerBoost * 0.16

                    ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`
                    ctx.lineWidth = 0.6 + base * 0.65
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.stroke()
                }
            }
        }

        if (Math.random() < 0.09 && pulses.current.length < 46) {
            const startIdx = Math.floor(Math.random() * neurons[0].length)
            const nextIdx = Math.floor(Math.random() * neurons[1].length)
            pulses.current.push({
                fromLayer: 0,
                fromIdx: startIdx,
                toLayer: 1,
                toIdx: nextIdx,
                progress: 0,
                speed: 0.015 + Math.random() * 0.013,
                hue: Math.random() > 0.5 ? 282 : 228,
                width: 1.8 + Math.random() * 1.8,
            })
        }

        for (let i = pulses.current.length - 1; i >= 0; i--) {
            const p = pulses.current[i]
            p.progress += p.speed

            const from = neurons[p.fromLayer][p.fromIdx]
            const to = neurons[p.toLayer][p.toIdx]
            const px = from.x + (to.x - from.x) * p.progress
            const py = from.y + (to.y - from.y) * p.progress

            const trailX = from.x + (to.x - from.x) * Math.max(0, p.progress - 0.2)
            const trailY = from.y + (to.y - from.y) * Math.max(0, p.progress - 0.2)

            const trail = ctx.createLinearGradient(trailX, trailY, px, py)
            trail.addColorStop(0, `hsla(${p.hue}, 90%, 72%, 0)`)
            trail.addColorStop(1, `hsla(${p.hue}, 90%, 72%, 0.7)`)
            ctx.strokeStyle = trail
            ctx.lineWidth = p.width
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(trailX, trailY)
            ctx.lineTo(px, py)
            ctx.stroke()

            const glow = ctx.createRadialGradient(px, py, 0, px, py, p.width * 6)
            glow.addColorStop(0, `hsla(${p.hue}, 95%, 75%, 0.8)`)
            glow.addColorStop(1, `hsla(${p.hue}, 95%, 75%, 0)`)
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(px, py, p.width * 6, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = `hsla(${p.hue}, 95%, 80%, 0.95)`
            ctx.beginPath()
            ctx.arc(px, py, p.width * 0.95, 0, Math.PI * 2)
            ctx.fill()

            if (p.progress >= 1) {
                if (p.toLayer >= neurons.length - 1) {
                    pulses.current.splice(i, 1)
                    continue
                }
                p.fromLayer = p.toLayer
                p.fromIdx = p.toIdx
                p.toLayer += 1
                p.toIdx = Math.floor(Math.random() * neurons[p.toLayer].length)
                p.progress = 0
            }
        }

        for (let l = 0; l < neurons.length; l++) {
            for (const n of neurons[l]) {
                const pointerDist = Math.hypot(n.x - mx, n.y - my)
                const pointerBoost = mouse.current.active ? Math.max(0, 1 - pointerDist / 140) : 0
                const r = 4.8 + n.activation * 2.4 + pointerBoost * 3.2
                const alpha = 0.35 + n.activation * 0.4 + pointerBoost * 0.28

                const aura = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.5)
                aura.addColorStop(0, `rgba(167, 139, 250, ${alpha * 0.35})`)
                aura.addColorStop(1, 'rgba(167, 139, 250, 0)')
                ctx.fillStyle = aura
                ctx.beginPath()
                ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2)
                ctx.fill()

                const body = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r)
                body.addColorStop(0, `rgba(230, 218, 255, ${alpha})`)
                body.addColorStop(0.55, `rgba(196, 132, 252, ${alpha * 0.72})`)
                body.addColorStop(1, `rgba(124, 58, 237, ${alpha * 0.35})`)
                ctx.fillStyle = body
                ctx.beginPath()
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
                ctx.fill()
            }

            const lx = net.padX + l * net.spacingX
            ctx.font = '10px "JetBrains Mono", monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillStyle = 'rgba(188, 173, 232, 0.42)'
            ctx.fillText(LAYER_NAMES[l], lx, H - 14)
        }

        const outputLayer = neurons[neurons.length - 1]
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        for (let i = 0; i < outputLayer.length; i++) {
            const out = outputLayer[i]
            const confidence = (out.activation * 100).toFixed(1)
            ctx.fillStyle = 'rgba(220, 204, 255, 0.76)'
            ctx.fillText(`${OUTPUT_NAMES[i]} ${confidence}%`, out.x + 18, out.y)
        }

        if (mouse.current.active) {
            const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, 220)
            spotlight.addColorStop(0, 'rgba(129, 140, 248, 0.22)')
            spotlight.addColorStop(1, 'rgba(129, 140, 248, 0)')
            ctx.fillStyle = spotlight
            ctx.fillRect(0, 0, W, H)
        }

        raf.current = requestAnimationFrame(draw)
    }, [getNeurons])

    useEffect(() => {
        const tick = setInterval(() => {
            const now = Date.now() * 0.001
            setMetrics({
                accuracy: (98 + Math.sin(now * 0.65) * 1.2).toFixed(1),
                fps: `${Math.round(132 + Math.sin(now * 1.1) * 20)}`,
                tokenRate: `${Math.round(2100 + Math.cos(now * 0.8) * 220)}`,
                drift: (0.015 + Math.abs(Math.sin(now * 1.3)) * 0.012).toFixed(3),
            })
        }, 900)

        return () => clearInterval(tick)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const shell = shellRef.current
        if (!canvas || !shell) return

        const resize = () => {
            const rect = shell.getBoundingClientRect()
            dprRef.current = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.floor(rect.width * dprRef.current)
            canvas.height = Math.floor(rect.height * dprRef.current)
        }

        const onMove = (e) => {
            const rect = shell.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const px = ((x / rect.width) * 100).toFixed(2)
            const py = ((y / rect.height) * 100).toFixed(2)

            mouse.current.x = x
            mouse.current.y = y
            mouse.current.active = true

            shell.style.setProperty('--neural-mx', `${px}%`)
            shell.style.setProperty('--neural-my', `${py}%`)
        }

        const onLeave = () => {
            mouse.current.x = -9999
            mouse.current.y = -9999
            mouse.current.active = false
            shell.style.setProperty('--neural-mx', '65%')
            shell.style.setProperty('--neural-my', '32%')
        }

        resize()
        window.addEventListener('resize', resize)
        shell.addEventListener('mousemove', onMove, { passive: true })
        shell.addEventListener('mouseleave', onLeave)

        const observer = new IntersectionObserver(([entry]) => {
            visible.current = entry.isIntersecting
        }, { threshold: 0.1 })
        observer.observe(shell)

        raf.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            shell.removeEventListener('mousemove', onMove)
            shell.removeEventListener('mouseleave', onLeave)
            if (raf.current) cancelAnimationFrame(raf.current)
            observer.disconnect()
        }
    }, [draw])

    return (
        <section style={{ position: 'relative', padding: '96px 0', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(5,5,32,0.95) 0%, rgba(3,0,20,0.95) 100%)' }}>
            <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'absolute',
                    top: -120,
                    right: -120,
                    width: 480,
                    height: 480,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.25), rgba(129,140,248,0))',
                    pointerEvents: 'none',
                }}
            />

            <div className="container-main" style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginBottom: 26 }}
                >
                    <p style={{ fontSize: 12, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 12, color: 'rgba(151, 165, 255, 0.9)', fontFamily: 'var(--font-mono)' }}>
                        Neural Choreography
                    </p>
                    <h2 style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)', fontWeight: 700, lineHeight: 1.1 }}>
                        Signal paths that feel <span className="gradient-text">alive</span>
                    </h2>
                    <p style={{ fontSize: 14, marginTop: 12, color: 'rgba(190, 180, 225, 0.78)', maxWidth: 600, marginInline: 'auto' }}>
                        Hover to amplify local activations and watch inference packets travel through each layer in real time.
                    </p>
                </motion.div>

                <motion.div
                    ref={shellRef}
                    className="neural-shell"
                    initial={{ opacity: 0, y: 28, scale: 0.97, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    viewport={{ once: true, margin: '-70px' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
                    <div className="neural-grid" />
                    <div className="neural-sweep" />
                    <div className="neural-spotlight" />

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={panelStagger}
                        viewport={{ once: true }}
                        style={{
                            position: 'absolute',
                            top: 14,
                            left: 14,
                            right: 14,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: 10,
                            zIndex: 3,
                        }}
                    >
                        {LAYER_NAMES.map((label, i) => (
                            <motion.div
                                key={label}
                                variants={tileReveal}
                                whileHover={{ y: -5, scale: 1.03, borderColor: 'rgba(151,165,255,0.4)' }}
                                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                                style={{
                                    borderRadius: 12,
                                    border: '1px solid rgba(151, 165, 255, 0.2)',
                                    background: i % 2 ? 'linear-gradient(145deg, rgba(13,10,43,0.63), rgba(5,4,22,0.44))' : 'linear-gradient(145deg, rgba(8,6,31,0.66), rgba(4,2,17,0.45))',
                                    padding: '10px 12px',
                                    textAlign: 'left',
                                }}
                            >
                                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(176, 185, 255, 0.82)', fontFamily: 'var(--font-mono)' }}>
                                    Layer {i + 1}
                                </div>
                                <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(228, 221, 255, 0.92)' }}>
                                    {label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'absolute',
                            left: 14,
                            right: 14,
                            bottom: 14,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: 10,
                            zIndex: 3,
                        }}
                    >
                        {[
                            { label: 'Top-1 Accuracy', value: `${metrics.accuracy}%` },
                            { label: 'Inference FPS', value: metrics.fps },
                            { label: 'Token Rate', value: `${metrics.tokenRate}/s` },
                            { label: 'Drift Index', value: metrics.drift },
                        ].map((metric) => (
                            <motion.div
                                key={metric.label}
                                whileHover={{ y: -4, borderColor: 'rgba(196,132,252,0.4)' }}
                                transition={{ type: 'spring', stiffness: 260, damping: 21 }}
                                style={{
                                    borderRadius: 12,
                                    border: '1px solid rgba(196, 132, 252, 0.23)',
                                    background: 'linear-gradient(160deg, rgba(8,6,30,0.65), rgba(2,1,14,0.42))',
                                    padding: '10px 12px',
                                }}
                            >
                                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(205, 179, 246, 0.8)', fontFamily: 'var(--font-mono)' }}>
                                    {metric.label}
                                </div>
                                <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: 'rgba(247, 241, 255, 0.95)' }}>
                                    {metric.value}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
