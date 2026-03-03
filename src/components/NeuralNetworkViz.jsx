import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * Interactive Neural Network Visualization
 * Shows a real feedforward network with input → hidden → output layers.
 * Data pulses flow forward. Mouse proximity activates neurons.
 */
export default function NeuralNetworkViz() {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const raf = useRef(null)
    const mouse = useRef({ x: -9999, y: -9999 })
    const visible = useRef(false)
    const pulses = useRef([])

    const LAYERS = [4, 6, 8, 6, 3] // input → hidden → output
    const LABELS = ['Input', 'Conv', 'Dense', 'ReLU', 'Output']
    const OUTPUT_LABELS = ['Cat', 'Dog', 'Bird']

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !visible.current) {
            raf.current = requestAnimationFrame(draw)
            return
        }
        const ctx = canvas.getContext('2d')
        const W = canvas.width
        const H = canvas.height
        const t = Date.now() * 0.001
        const mx = mouse.current.x
        const my = mouse.current.y

        ctx.clearRect(0, 0, W, H)

        // Build neuron positions
        const padX = W * 0.1
        const padY = H * 0.12
        const layerSpacing = (W - padX * 2) / (LAYERS.length - 1)
        const neurons = []

        for (let l = 0; l < LAYERS.length; l++) {
            const count = LAYERS[l]
            const lx = padX + l * layerSpacing
            const layerH = H - padY * 2
            const spacing = layerH / (count + 1)
            const layer = []

            for (let n = 0; n < count; n++) {
                const ny = padY + spacing * (n + 1)
                const dist = Math.sqrt((lx - mx) ** 2 + (ny - my) ** 2)
                const hover = Math.max(0, 1 - dist / 120)
                const activation = Math.sin(t * 2 + l * 0.7 + n * 0.5) * 0.5 + 0.5

                layer.push({ x: lx, y: ny, hover, activation, layer: l, idx: n })
            }
            neurons.push(layer)
        }

        // Draw connections (weights)
        for (let l = 0; l < neurons.length - 1; l++) {
            for (const a of neurons[l]) {
                for (const b of neurons[l + 1]) {
                    const weight = Math.sin(t * 0.5 + a.idx * 0.3 + b.idx * 0.7) * 0.5 + 0.5
                    const alpha = 0.03 + weight * 0.06 + (a.hover + b.hover) * 0.12

                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`
                    ctx.lineWidth = 0.5 + weight * 0.5
                    ctx.stroke()
                }
            }
        }

        // Spawn pulses periodically
        if (Math.random() < 0.04) {
            const startNeuron = neurons[0][Math.floor(Math.random() * neurons[0].length)]
            pulses.current.push({
                x: startNeuron.x,
                y: startNeuron.y,
                targetLayer: 1,
                targetIdx: Math.floor(Math.random() * LAYERS[1]),
                progress: 0,
                speed: 0.01 + Math.random() * 0.015,
                color: Math.random() > 0.5 ? [196, 132, 252] : [167, 139, 250],
            })
        }

        // Update + draw pulses
        for (let i = pulses.current.length - 1; i >= 0; i--) {
            const p = pulses.current[i]
            p.progress += p.speed

            if (p.progress >= 1) {
                // Move to next layer
                const currentTarget = neurons[p.targetLayer][p.targetIdx]
                p.x = currentTarget.x
                p.y = currentTarget.y
                p.progress = 0

                if (p.targetLayer < LAYERS.length - 1) {
                    p.targetLayer++
                    p.targetIdx = Math.floor(Math.random() * LAYERS[p.targetLayer])
                } else {
                    pulses.current.splice(i, 1)
                    continue
                }
            }

            // Interpolate position
            const target = neurons[p.targetLayer][p.targetIdx]
            const px = p.x + (target.x - p.x) * p.progress
            const py = p.y + (target.y - p.y) * p.progress

            // Draw pulse
            const r = 3
            ctx.beginPath()
            ctx.arc(px, py, r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.8)`
            ctx.fill()

            // Glow
            const g = ctx.createRadialGradient(px, py, 0, px, py, r * 5)
            g.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.3)`)
            g.addColorStop(1, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0)`)
            ctx.beginPath()
            ctx.arc(px, py, r * 5, 0, Math.PI * 2)
            ctx.fillStyle = g
            ctx.fill()
        }

        // Limit pulse count
        if (pulses.current.length > 30) pulses.current.length = 30

        // Draw neurons
        for (let l = 0; l < neurons.length; l++) {
            for (const n of neurons[l]) {
                const r = 6 + n.hover * 4 + n.activation * 2
                const alpha = 0.3 + n.activation * 0.4 + n.hover * 0.3

                // Outer glow
                const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3)
                g.addColorStop(0, `rgba(124, 58, 237, ${alpha * 0.3})`)
                g.addColorStop(1, 'rgba(124, 58, 237, 0)')
                ctx.beginPath()
                ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
                ctx.fillStyle = g
                ctx.fill()

                // Neuron body
                const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r)
                ng.addColorStop(0, `rgba(200, 180, 255, ${alpha})`)
                ng.addColorStop(0.6, `rgba(167, 139, 250, ${alpha * 0.7})`)
                ng.addColorStop(1, `rgba(124, 58, 237, ${alpha * 0.3})`)
                ctx.beginPath()
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
                ctx.fillStyle = ng
                ctx.fill()

                // Ring when hovered
                if (n.hover > 0.1) {
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(196, 132, 252, ${n.hover * 0.4})`
                    ctx.lineWidth = 1
                    ctx.stroke()
                }
            }

            // Layer label
            const lx = padX + l * layerSpacing
            ctx.font = '10px "JetBrains Mono", monospace'
            ctx.textAlign = 'center'
            ctx.fillStyle = 'rgba(167, 139, 250, 0.35)'
            ctx.fillText(LABELS[l], lx, H - padY * 0.4)
        }

        // Output labels
        if (neurons.length > 0) {
            const outLayer = neurons[neurons.length - 1]
            ctx.font = '9px "JetBrains Mono", monospace'
            ctx.textAlign = 'left'
            for (let i = 0; i < outLayer.length && i < OUTPUT_LABELS.length; i++) {
                const n = outLayer[i]
                const conf = (n.activation * 100).toFixed(0)
                ctx.fillStyle = `rgba(196, 132, 252, ${0.3 + n.activation * 0.4})`
                ctx.fillText(`${OUTPUT_LABELS[i]} ${conf}%`, n.x + 16, n.y + 4)
            }
        }

        raf.current = requestAnimationFrame(draw)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resize = () => {
            const rect = container.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height
        }
        resize()
        window.addEventListener('resize', resize)

        const move = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouse.current.x = e.clientX - rect.left
            mouse.current.y = e.clientY - rect.top
        }
        container.addEventListener('mousemove', move, { passive: true })
        container.addEventListener('mouseleave', () => {
            mouse.current.x = -9999
            mouse.current.y = -9999
        })

        // Intersection observer for performance
        const obs = new IntersectionObserver(([entry]) => {
            visible.current = entry.isIntersecting
        }, { threshold: 0.1 })
        obs.observe(container)

        raf.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            if (raf.current) cancelAnimationFrame(raf.current)
            obs.disconnect()
        }
    }, [draw])

    return (
        <section style={{ position: 'relative', padding: '80px 0', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            {/* Top / Bottom fades */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, var(--bg-primary), transparent)', pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, var(--bg-primary), transparent)', pointerEvents: 'none', zIndex: 2 }} />

            <div className="container-main" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginBottom: 16 }}
                >
                    <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}>
                        Neural Architecture
                    </p>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 700 }}>
                        How a <span className="gradient-text">neural network</span> sees data
                    </h2>
                    <p style={{ fontSize: 14, marginTop: 12, color: 'var(--text-secondary)', maxWidth: 500, margin: '12px auto 0' }}>
                        Hover over neurons to see activations. Watch data pulses flow from input to prediction.
                    </p>
                </motion.div>
            </div>

            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 900,
                    height: 380,
                    margin: '24px auto 0',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(124, 58, 237, 0.08)',
                    background: 'rgba(3, 0, 20, 0.5)',
                }}
            >
                <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
            </motion.div>
        </section>
    )
}
