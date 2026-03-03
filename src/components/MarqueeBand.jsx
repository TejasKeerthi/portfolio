import { motion } from 'framer-motion'

const WORDS = [
    'Machine Learning', '•', 'Deep Learning', '•', 'Neural Networks', '•',
    'Data Science', '•', 'Computer Vision', '•', 'NLP', '•',
    'Python', '•', 'TensorFlow', '•', 'PyTorch', '•',
    'Predictive Analytics', '•', 'AI Pipelines', '•', 'Statistics', '•',
]

export default function MarqueeBand() {
    const content = WORDS.join('  ')
    const doubled = `${content}  ${content}`

    return (
        <div style={{
            overflow: 'hidden',
            padding: '20px 0',
            background: 'rgba(148,163,184,0.03)',
            borderTop: '1px solid rgba(148,163,184,0.08)',
            borderBottom: '1px solid rgba(148,163,184,0.08)',
            position: 'relative',
        }}>
            {/* Left / Right fade masks */}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, var(--bg-primary), transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, var(--bg-primary), transparent)', zIndex: 2, pointerEvents: 'none' }} />

            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
                style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(148,163,184,0.30)',
                    fontFamily: 'var(--font-mono)',
                    gap: 0,
                    willChange: 'transform',
                }}
            >
                <span>{doubled}</span>
            </motion.div>
        </div>
    )
}
