import { useEffect, useRef, useCallback } from 'react'

/**
 * Data Pipeline Visualization
 * Shows an animated data processing pipeline: Raw Data → Preprocessing → GPU Training → Model → Prediction
 * Particles flow through the pipeline stages with processing animations.
 */
export default function DataPipelineViz() {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const raf = useRef(null)
    const visible = useRef(false)
    const particles = useRef([])

    const STAGES = [
        { label: 'RAW DATA', icon: '📊', subLabel: 'CSV / JSON' },
        { label: 'PREPROCESS', icon: '⚙️', subLabel: 'Clean & Normalize' },
        { label: 'GPU TRAIN', icon: '🔥', subLabel: 'CUDA Compute' },
        { label: 'MODEL', icon: '🧠', subLabel: 'Neural Net' },
        { label: 'PREDICT', icon: '✨', subLabel: 'Inference' },
    ]

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

        ctx.clearRect(0, 0, W, H)

        const padX = 60
        const pipeY = H / 2
        const stageW = (W - padX * 2) / (STAGES.length - 1)

        // Draw pipeline backbone
        ctx.beginPath()
        ctx.moveTo(padX, pipeY)
        ctx.lineTo(W - padX, pipeY)
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.12)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Animated flow line on top of backbone
        const flowGrad = ctx.createLinearGradient(padX, 0, W - padX, 0)
        const flowOffset = (t * 0.3) % 1
        flowGrad.addColorStop(0, 'rgba(124, 58, 237, 0)')
        flowGrad.addColorStop(Math.max(0, flowOffset - 0.15), 'rgba(124, 58, 237, 0)')
        flowGrad.addColorStop(flowOffset, 'rgba(196, 132, 252, 0.5)')
        flowGrad.addColorStop(Math.min(1, flowOffset + 0.15), 'rgba(124, 58, 237, 0)')
        flowGrad.addColorStop(1, 'rgba(124, 58, 237, 0)')
        ctx.beginPath()
        ctx.moveTo(padX, pipeY)
        ctx.lineTo(W - padX, pipeY)
        ctx.strokeStyle = flowGrad
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw stages
        for (let i = 0; i < STAGES.length; i++) {
            const sx = padX + i * stageW
            const stage = STAGES[i]
            const pulse = Math.sin(t * 2 + i * 1.2) * 0.5 + 0.5

            // Stage node
            const nodeR = 18
            ctx.beginPath()
            ctx.arc(sx, pipeY, nodeR, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(3, 0, 20, 0.9)`
            ctx.fill()
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.2 + pulse * 0.15})`
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Glow ring
            ctx.beginPath()
            ctx.arc(sx, pipeY, nodeR + 4 + pulse * 3, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.06 + pulse * 0.06})`
            ctx.lineWidth = 1
            ctx.stroke()

            // Stage icon (as text)
            ctx.font = '16px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = 'white'
            ctx.fillText(stage.icon, sx, pipeY)

            // Label above
            ctx.font = 'bold 9px "JetBrains Mono", monospace'
            ctx.textBaseline = 'bottom'
            ctx.fillStyle = `rgba(167, 139, 250, ${0.5 + pulse * 0.3})`
            ctx.fillText(stage.label, sx, pipeY - nodeR - 12)

            // Sub-label below
            ctx.font = '8px "JetBrains Mono", monospace'
            ctx.textBaseline = 'top'
            ctx.fillStyle = 'rgba(160, 160, 192, 0.4)'
            ctx.fillText(stage.subLabel, sx, pipeY + nodeR + 10)

            // Arrow between stages
            if (i < STAGES.length - 1) {
                const ax = sx + nodeR + 10
                const bx = sx + stageW - nodeR - 10
                const midX = (ax + bx) / 2

                // Dashed connection
                ctx.setLineDash([3, 4])
                ctx.beginPath()
                ctx.moveTo(ax, pipeY)
                ctx.lineTo(bx, pipeY)
                ctx.strokeStyle = 'rgba(124, 58, 237, 0.08)'
                ctx.lineWidth = 1
                ctx.stroke()
                ctx.setLineDash([])

                // Arrow head
                const aSize = 4
                ctx.beginPath()
                ctx.moveTo(bx, pipeY)
                ctx.lineTo(bx - aSize, pipeY - aSize)
                ctx.lineTo(bx - aSize, pipeY + aSize)
                ctx.closePath()
                ctx.fillStyle = 'rgba(124, 58, 237, 0.15)'
                ctx.fill()
            }
        }

        // ── Data particles flowing through pipeline ──
        // Spawn new particle
        if (Math.random() < 0.06) {
            particles.current.push({
                x: padX,
                progress: 0,
                speed: 0.003 + Math.random() * 0.004,
                size: 2 + Math.random() * 2,
                yOff: (Math.random() - 0.5) * 16,
                color: Math.random() > 0.5 ? [196, 132, 252] : [129, 140, 248],
            })
        }

        // Update and draw particles
        const pipeLen = W - padX * 2
        for (let i = particles.current.length - 1; i >= 0; i--) {
            const p = particles.current[i]
            p.progress += p.speed

            if (p.progress >= 1) {
                particles.current.splice(i, 1)
                continue
            }

            const px = padX + p.progress * pipeLen
            const py = pipeY + p.yOff + Math.sin(t * 4 + p.progress * 10) * 3

            // Check if near a stage node — do a processing wiggle
            let nearStage = false
            for (let s = 0; s < STAGES.length; s++) {
                const sx = padX + s * stageW
                if (Math.abs(px - sx) < 20) {
                    nearStage = true
                    break
                }
            }

            const alpha = nearStage ? 0.9 : 0.6
            const r = nearStage ? p.size * 1.4 : p.size

            ctx.beginPath()
            ctx.arc(px, py, r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha})`
            ctx.fill()

            // Trail
            const trailLen = 12
            const tGrad = ctx.createLinearGradient(px - trailLen, py, px, py)
            tGrad.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0)`)
            tGrad.addColorStop(1, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.4})`)
            ctx.beginPath()
            ctx.moveTo(px - trailLen, py)
            ctx.lineTo(px, py)
            ctx.strokeStyle = tGrad
            ctx.lineWidth = r * 0.8
            ctx.lineCap = 'round'
            ctx.stroke()
        }

        // Limit
        if (particles.current.length > 40) particles.current.length = 40

        // ── Throughput metrics ──
        ctx.font = '8px "JetBrains Mono", monospace'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        const tflops = (45 + Math.sin(t * 0.7) * 15).toFixed(1)
        const samples = (1200 + Math.sin(t * 1.3) * 400).toFixed(0)
        ctx.fillStyle = 'rgba(167, 139, 250, 0.2)'
        ctx.fillText(`${tflops} TFLOPS  ·  ${samples} samples/s`, W - 16, H - 8)

        ctx.textAlign = 'left'
        const epoch = (((t * 0.5) % 100) | 0)
        const loss = (0.8 * Math.exp(-epoch * 0.03) + 0.01).toFixed(4)
        ctx.fillText(`epoch ${epoch}  ·  loss: ${loss}`, 16, H - 8)

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
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: 160,
                overflow: 'hidden',
                borderTop: '1px solid rgba(124, 58, 237, 0.06)',
                borderBottom: '1px solid rgba(124, 58, 237, 0.06)',
                background: 'rgba(124, 58, 237, 0.02)',
            }}
        >
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
    )
}
