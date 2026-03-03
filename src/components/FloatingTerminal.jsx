import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const SNIPPETS = [
    'model.fit(X_train, y_train)',
    '>>> accuracy: 98.7%',
    'import torch.nn as nn',
    'loss.backward()',
    'pred = model.predict(X)',
    'optimizer.step()',
    'epochs: 100 ✓',
    'np.mean(features)',
    'pipeline.transform(df)',
    'f1_score: 0.96',
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
                style={{
                    background: 'rgba(2, 10, 20, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.08), 0 8px 32px rgba(0,0,0,0.4)',
                }}
            >
                {/* Title bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{
                        marginLeft: 8,
                        fontSize: 10,
                        fontWeight: 500,
                        color: 'rgba(6, 182, 212, 0.6)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em',
                    }}>
                        ai_pipeline.py
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
                        <div key={i} style={{ color: 'rgba(125, 211, 252, 0.35)' }}>
                            <span style={{ color: 'rgba(6, 182, 212, 0.4)', marginRight: 6 }}>›</span>
                            {line}
                        </div>
                    ))}
                    {/* Current typing line */}
                    <div style={{ color: '#67e8f9' }}>
                        <span style={{ color: '#06b6d4', marginRight: 6 }}>›</span>
                        {currentLine}
                        <span style={{
                            display: 'inline-block',
                            width: 6,
                            height: 13,
                            background: showCursor ? '#22d3ee' : 'transparent',
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
