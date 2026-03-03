import { useEffect, useState, useCallback } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import TechGrid from './components/TechGrid'
import Projects from './components/Projects'
import BongoCat from './components/BongoCat'
import ContactOverlay from './components/ContactOverlay'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import MarqueeBand from './components/MarqueeBand'
import Footer from './components/Footer'

export default function App() {
    const [contactOpen, setContactOpen] = useState(false)

    const openContact = useCallback(() => setContactOpen(true), [])
    const closeContact = useCallback(() => setContactOpen(false), [])

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => lenis.destroy()
    }, [])

    return (
        <div className="noise-overlay" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0d11 0%, #060809 30%, #000000 100%)' }}>
            <CustomCursor />
            <ScrollProgress />
            <Navbar onContactClick={openContact} />
            <Hero />
            <MarqueeBand />
            <About />
            <TechGrid />
            <Projects />
            <Footer />
            <BongoCat />
            <ContactOverlay isOpen={contactOpen} onClose={closeContact} />
        </div>
    )
}
