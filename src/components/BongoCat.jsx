import { useEffect, useState, useRef, useCallback } from 'react'

/**
 * Interactive Bongo Cat mascot.
 * - Paw slap animation on any keydown.
 * - Eyes follow scroll position.
 * - Fixed to the bottom-right corner.
 */
export default function BongoCat() {
    const [leftPaw, setLeftPaw] = useState(false)
    const [rightPaw, setRightPaw] = useState(false)
    const [eyeY, setEyeY] = useState(0)
    const nextPaw = useRef('left')
    const timeoutRef = useRef(null)

    const handleKeyDown = useCallback(() => {
        if (nextPaw.current === 'left') {
            setLeftPaw(true)
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setLeftPaw(false), 120)
            nextPaw.current = 'right'
        } else {
            setRightPaw(true)
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setRightPaw(false), 120)
            nextPaw.current = 'left'
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    useEffect(() => {
        const onScroll = () => {
            const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight)
            setEyeY(scrollFraction * 3)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div
            id="bongo-cat"
            className="fixed bottom-6 right-6 z-40 pointer-events-none select-none"
            style={{ width: 100, height: 90, opacity: 0.85 }}
        >
            <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Body */}
                <ellipse cx="100" cy="130" rx="70" ry="40" fill="#141820" stroke="#94a3b8" strokeWidth="2" />

                {/* Head */}
                <ellipse cx="100" cy="75" rx="55" ry="45" fill="#141820" stroke="#94a3b8" strokeWidth="2" />

                {/* Left ear */}
                <path d="M55 45 L40 10 L70 35 Z" fill="#141820" stroke="#94a3b8" strokeWidth="2" />
                <path d="M55 40 L45 18 L65 35 Z" fill="#94a3b8" opacity="0.3" />

                {/* Right ear */}
                <path d="M145 45 L160 10 L130 35 Z" fill="#141820" stroke="#94a3b8" strokeWidth="2" />
                <path d="M145 40 L155 18 L135 35 Z" fill="#94a3b8" opacity="0.3" />

                {/* Eyes */}
                <g transform={`translate(0, ${eyeY})`}>
                    <circle cx="80" cy="70" r="5" fill="#cbd5e1" />
                    <circle cx="80" cy="69" r="2" fill="#f0f0f5" />
                    <circle cx="120" cy="70" r="5" fill="#cbd5e1" />
                    <circle cx="120" cy="69" r="2" fill="#f0f0f5" />
                </g>

                {/* Nose */}
                <ellipse cx="100" cy="82" rx="4" ry="3" fill="#cbd5e1" />

                {/* Mouth */}
                <path d="M93 86 Q100 92 107 86" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

                {/* Whiskers */}
                <line x1="55" y1="78" x2="78" y2="80" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                <line x1="55" y1="85" x2="78" y2="84" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                <line x1="122" y1="80" x2="145" y2="78" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                <line x1="122" y1="84" x2="145" y2="85" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />

                {/* Left paw */}
                <g
                    style={{
                        transition: 'transform 0.08s ease-out',
                        transform: leftPaw ? 'translateY(-12px)' : 'translateY(0)',
                        transformOrigin: '60px 150px',
                    }}
                >
                    <ellipse cx="55" cy="155" rx="18" ry="12" fill="#141820" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="47" cy="152" r="3" fill="#94a3b8" opacity="0.4" />
                    <circle cx="55" cy="149" r="3" fill="#94a3b8" opacity="0.4" />
                    <circle cx="63" cy="152" r="3" fill="#94a3b8" opacity="0.4" />
                </g>

                {/* Right paw */}
                <g
                    style={{
                        transition: 'transform 0.08s ease-out',
                        transform: rightPaw ? 'translateY(-12px)' : 'translateY(0)',
                        transformOrigin: '140px 150px',
                    }}
                >
                    <ellipse cx="145" cy="155" rx="18" ry="12" fill="#141820" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="137" cy="152" r="3" fill="#94a3b8" opacity="0.4" />
                    <circle cx="145" cy="149" r="3" fill="#94a3b8" opacity="0.4" />
                    <circle cx="153" cy="152" r="3" fill="#94a3b8" opacity="0.4" />
                </g>
            </svg>
        </div>
    )
}
