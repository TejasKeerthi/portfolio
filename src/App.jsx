import { useEffect, useState, useCallback } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import TechGrid from './components/TechGrid'
import Projects from './components/Projects'
import BongoCat from './components/FloatingTerminal'
import ContactOverlay from './components/ContactOverlay'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import MarqueeBand from './components/MarqueeBand'
import Footer from './components/Footer'
import GPUChipViz from './components/GPUParticles'
import NeuralNetworkViz from './components/NeuralNetworkViz'
import DataPipelineViz from './components/DataPipelineViz'

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
        <>
            {/* Fixed-position layers — must live OUTSIDE page-enter to avoid
                will-change:transform creating a containing block that breaks
                position:fixed */}
            <GPUChipViz />
            <CustomCursor />
            <ScrollProgress />
            <Navbar onContactClick={openContact} />
            <BongoCat />
            <ContactOverlay isOpen={contactOpen} onClose={closeContact} />

            {/* Scrollable content */}
            <div className="noise-overlay page-enter" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0118 0%, #030014 30%, #000000 100%)' }}>
                <Hero />
                <DataPipelineViz />
                <About />
                <NeuralNetworkViz />
                <TechGrid />
                <Projects />
                <MarqueeBand />
                <Footer />
            </div>
        </>
    )
}
