import { motion } from 'framer-motion'

const WORDS = [
    'Machine Learning',
    'Deep Learning',
    'Neural Networks',
    'Data Science',
    'Computer Vision',
    'NLP',
    'Python',
    'TensorFlow',
    'PyTorch',
    'Predictive Analytics',
    'AI Pipelines',
    'Statistics',
]

const ribbon = WORDS.join('   •   ')

export default function MarqueeBand() {
    return (
        <section className="marquee-shell">
            <div className="marquee-fade-left" />
            <div className="marquee-fade-right" />

            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
                className="marquee-track marquee-track-top"
            >
                <span>{`${ribbon}   •   ${ribbon}`}</span>
            </motion.div>

            <motion.div
                animate={{ x: ['-50%', '0%'] }}
                transition={{ duration: 31, ease: 'linear', repeat: Infinity }}
                className="marquee-track marquee-track-bottom"
            >
                <span>{`${ribbon}   •   ${ribbon}`}</span>
            </motion.div>
        </section>
    )
}
