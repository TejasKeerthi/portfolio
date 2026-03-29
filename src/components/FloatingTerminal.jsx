import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const SNIPPETS = [
    'project.status = shipping',
    'latency.avg = 12.4ms',
    'model.confidence = 99.1%',
    'prototype.time_to_demo = 4d',
    'dataset.health = stable',
    'team.mode = iterate_fast',
    'feedback.loop = active',
    'systems.thinking = enabled',
    'availability = open',
    'next_up = multimodal_experiments',
]

export default function FloatingTerminal() {
    const [currentLine, setCurrentLine] = useState('')
    const [snippetIdx, setSnippetIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [showCursor, setShowCursor] = useState(true)
    const [history, setHistory] = useState([])
    const phase = useRef('typing') // typing | pausing | clearing

    // Blinking cursor
    useEffect(() => {
        const interval = setInterval(() => setShowCursor((v) => !v), 530)
        return () => clearInterval(interval)
    }, [])

    // Typing effect
    useEffect(() => {
        const snippet = SNIPPETS[snippetIdx]

        if (phase.current === 'typing') {
            if (charIdx < snippet.length) {
                const timeout = setTimeout(() => {
                    setCurrentLine(snippet.slice(0, charIdx + 1))
                    setCharIdx((c) => c + 1)
                }, 45 + Math.random() * 35)
                return () => clearTimeout(timeout)
            } else {
                phase.current = 'pausing'
                const timeout = setTimeout(() => {
                    setHistory((h) => {
                        const next = [...h, snippet]
                        return next.length > 3 ? next.slice(-3) : next
                    })
                    setCurrentLine('')
                    setCharIdx(0)
                    setSnippetIdx((i) => (i + 1) % SNIPPETS.length)
                    phase.current = 'typing'
                }, 1200)
                return () => clearTimeout(timeout)
            }
        }
    }, [charIdx, snippetIdx])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 40,
                width: 260,
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="breathe-glow"
                style={{
                    background: 'linear-gradient(155deg, rgba(255,255,255,0.14), rgba(16,22,30,0.74) 36%, rgba(10,14,20,0.78) 100%)',
                    backdropFilter: 'blur(22px) saturate(160%)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 28px 50px rgba(4,7,12,0.32), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
            >
                {/* Title bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.05)',
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{
                        marginLeft: 8,
                        fontSize: 10,
                        fontWeight: 500,
                        color: 'rgba(214, 224, 240, 0.62)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em',
                    }}>
                        tejas.console
                    </span>
                </div>

                {/* Terminal body */}
                <div style={{
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    lineHeight: 1.7,
                    minHeight: 80,
                }}>
                    {/* History lines */}
                    {history.map((line, i) => (
                        <div key={i} style={{ color: 'rgba(195, 209, 229, 0.38)' }}>
                            <span style={{ color: 'rgba(149, 171, 200, 0.42)', marginRight: 6 }}>›</span>
                            {line}
                        </div>
                    ))}
                    {/* Current typing line */}
                    <div style={{ color: 'rgba(235, 242, 252, 0.96)' }}>
                        <span style={{ color: 'rgba(183, 202, 228, 0.78)', marginRight: 6 }}>›</span>
                        {currentLine}
                        <span style={{
                            display: 'inline-block',
                            width: 6,
                            height: 13,
                            background: showCursor ? '#edf5ff' : 'transparent',
                            marginLeft: 1,
                            verticalAlign: 'middle',
                            transition: 'background 0.1s',
                        }} />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
