import { useEffect, useRef, useCallback } from 'react'

/**
 * GPU Chip Schematic — Animated silicon die visualization.
 * Shows a stylized GPU with processing cores, memory buses,
 * and data flowing through pathways. Pure canvas, 60fps.
 */
export default function GPUChipViz() {
    const canvasRef = useRef(null)
    const raf = useRef(null)
    const lastFrame = useRef(0)
    const pageVisible = useRef(true)
    const mouse = useRef({ x: -9999, y: -9999 })

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        if (!pageVisible.current) {
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
        const W = canvas.width
        const H = canvas.height
        const t = Date.now() * 0.001
        const mx = mouse.current.x
        const my = mouse.current.y

        ctx.clearRect(0, 0, W, H)

        // ── GPU Die Grid ── centered on screen
        const chipW = Math.min(W * 0.55, 500)
        const chipH = chipW * 0.75
        const cx = W / 2
        const cy = H / 2
        const left = cx - chipW / 2
        const top = cy - chipH / 2

        // Die outline
        ctx.strokeStyle = 'rgba(215, 227, 246, 0.08)'
        ctx.lineWidth = 1
        ctx.strokeRect(left, top, chipW, chipH)

        // Inner die area
        const pad = 20
        const il = left + pad, it = top + pad
        const iw = chipW - pad * 2, ih = chipH - pad * 2

        ctx.strokeStyle = 'rgba(202, 215, 236, 0.05)'
        ctx.strokeRect(il, it, iw, ih)

        // ── Processing cores grid ──
        const cols = 8, rows = 6
        const cellW = iw / cols
        const cellH = ih / rows

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = il + c * cellW
                const y = it + r * cellH

                // Distance from mouse for interactivity
                const cmx = x + cellW / 2
                const cmy = y + cellH / 2
                const dist = Math.sqrt((cmx - mx) ** 2 + (cmy - my) ** 2)
                const hover = Math.max(0, 1 - dist / 200)

                // Staggered activation wave
                const wave = Math.sin(t * 1.5 + c * 0.4 + r * 0.3) * 0.5 + 0.5
                const active = wave * 0.3 + hover * 0.5

                // Core cell
                const inset = 2
                ctx.fillStyle = `rgba(206, 220, 241, ${0.02 + active * 0.08})`
                ctx.fillRect(x + inset, y + inset, cellW - inset * 2, cellH - inset * 2)

                ctx.strokeStyle = `rgba(199, 214, 237, ${0.04 + active * 0.12})`
                ctx.lineWidth = 0.5
                ctx.strokeRect(x + inset, y + inset, cellW - inset * 2, cellH - inset * 2)

                // Active core glow
                if (active > 0.15) {
                    const g = ctx.createRadialGradient(cmx, cmy, 0, cmx, cmy, cellW * 0.7)
                    g.addColorStop(0, `rgba(223, 233, 248, ${active * 0.12})`)
                    g.addColorStop(1, 'rgba(223, 233, 248, 0)')
                    ctx.fillStyle = g
                    ctx.fillRect(x, y, cellW, cellH)
                }

                // Tiny "transistor" dots in active cores
                if (active > 0.3) {
                    const dotCount = 4
                    for (let d = 0; d < dotCount; d++) {
                        const dx = x + inset + 4 + ((cellW - inset * 2 - 8) / (dotCount - 1)) * d
                        const dy = cmy
                        ctx.beginPath()
                        ctx.arc(dx, dy, 1.2, 0, Math.PI * 2)
                        ctx.fillStyle = `rgba(236, 244, 255, ${active * 0.6})`
                        ctx.fill()
                    }
                }
            }
        }

        // ── Data bus lines ── (horizontal + vertical pathways)
        const busAlpha = 0.06
        // Horizontal buses
        for (let r = 1; r < rows; r++) {
            const y = it + r * cellH
            ctx.beginPath()
            ctx.moveTo(il, y)
            ctx.lineTo(il + iw, y)
            ctx.strokeStyle = `rgba(197, 211, 233, ${busAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
        }
        // Vertical buses
        for (let c = 1; c < cols; c++) {
            const x = il + c * cellW
            ctx.beginPath()
            ctx.moveTo(x, it)
            ctx.lineTo(x, it + ih)
            ctx.strokeStyle = `rgba(197, 211, 233, ${busAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
        }

        // ── Data packets flowing through buses ──
        const packetCount = 18
        for (let i = 0; i < packetCount; i++) {
            const isHoriz = i % 2 === 0
            const speed = 0.3 + (i * 0.17) % 0.6
            const offset = ((t * speed + i * 137.5) % 1)

            if (isHoriz) {
                const row = (i * 7) % rows
                const y = it + (row + 0.5) * cellH
                const x = il + offset * iw
                const len = 15 + Math.sin(t + i) * 8

                const grad = ctx.createLinearGradient(x - len, y, x + len, y)
                grad.addColorStop(0, 'rgba(226, 236, 250, 0)')
                grad.addColorStop(0.5, `rgba(226, 236, 250, ${0.3 + Math.sin(t * 2 + i) * 0.15})`)
                grad.addColorStop(1, 'rgba(226, 236, 250, 0)')
                ctx.beginPath()
                ctx.moveTo(x - len, y)
                ctx.lineTo(x + len, y)
                ctx.strokeStyle = grad
                ctx.lineWidth = 1.5
                ctx.stroke()
            } else {
                const col = (i * 5) % cols
                const x = il + (col + 0.5) * cellW
                const y = it + offset * ih
                const len = 15 + Math.cos(t + i) * 8

                const grad = ctx.createLinearGradient(x, y - len, x, y + len)
                grad.addColorStop(0, 'rgba(159, 182, 215, 0)')
                grad.addColorStop(0.5, `rgba(159, 182, 215, ${0.3 + Math.cos(t * 2 + i) * 0.15})`)
                grad.addColorStop(1, 'rgba(159, 182, 215, 0)')
                ctx.beginPath()
                ctx.moveTo(x, y - len)
                ctx.lineTo(x, y + len)
                ctx.strokeStyle = grad
                ctx.lineWidth = 1.5
                ctx.stroke()
            }
        }

        // ── Memory banks ── (top and bottom edges)
        const memSlots = 16
        const memH = 8
        for (let i = 0; i < memSlots; i++) {
            const x = il + (iw / memSlots) * i
            const w = iw / memSlots - 2
            const active = Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5

            // Top memory
            ctx.fillStyle = `rgba(159, 182, 215, ${0.03 + active * 0.06})`
            ctx.fillRect(x + 1, top + 3, w, memH)
            ctx.strokeStyle = `rgba(159, 182, 215, ${0.06 + active * 0.08})`
            ctx.lineWidth = 0.5
            ctx.strokeRect(x + 1, top + 3, w, memH)

            // Bottom memory
            ctx.fillStyle = `rgba(159, 182, 215, ${0.03 + active * 0.06})`
            ctx.fillRect(x + 1, top + chipH - memH - 3, w, memH)
            ctx.strokeStyle = `rgba(159, 182, 215, ${0.06 + active * 0.08})`
            ctx.strokeRect(x + 1, top + chipH - memH - 3, w, memH)
        }

        // ── Corner labels ──
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.fillStyle = 'rgba(198, 212, 232, 0.16)'
        ctx.textAlign = 'left'
        ctx.fillText('CUDA CORES', il + 4, it + 12)
        ctx.textAlign = 'right'
        ctx.fillText(`${cols * rows} UNITS`, il + iw - 4, it + 12)
        ctx.textAlign = 'left'
        ctx.fillText('VRAM', il + 4, top + chipH - pad + 14)
        ctx.textAlign = 'right'
        const throughput = (50 + Math.sin(t) * 20).toFixed(0)
        ctx.fillText(`${throughput} TFLOPS`, il + iw - 4, top + chipH - pad + 14)

        // ── Outer pin connectors ── (left/right edges)
        const pinCount = 20
        for (let i = 0; i < pinCount; i++) {
            const y = top + (chipH / (pinCount + 1)) * (i + 1)
            const pinLen = 6
            const pinAlpha = 0.04 + Math.sin(t * 3 + i * 0.6) * 0.03

            // Left pins
            ctx.beginPath()
            ctx.moveTo(left - pinLen, y)
            ctx.lineTo(left, y)
            ctx.strokeStyle = `rgba(196, 210, 231, ${pinAlpha})`
            ctx.lineWidth = 1
            ctx.stroke()

            // Right pins
            ctx.beginPath()
            ctx.moveTo(left + chipW, y)
            ctx.lineTo(left + chipW + pinLen, y)
            ctx.strokeStyle = `rgba(196, 210, 231, ${pinAlpha})`
            ctx.stroke()
        }

        raf.current = requestAnimationFrame(draw)
    }, [])

    useEffect(() => {
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
        const onVisibility = () => {
            pageVisible.current = !document.hidden
        }
        window.addEventListener('mousemove', move, { passive: true })
        document.addEventListener('visibilitychange', onVisibility)

        raf.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', move)
            document.removeEventListener('visibilitychange', onVisibility)
            if (raf.current) cancelAnimationFrame(raf.current)
        }
    }, [draw])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.7,
            }}
        />
    )
}
