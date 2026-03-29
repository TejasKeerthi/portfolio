import { Suspense, lazy, useEffect, useState, useCallback } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'

const About = lazy(() => import('./components/About'))
const SpatialShowcase = lazy(() => import('./components/SpatialShowcase'))
const TechGrid = lazy(() => import('./components/TechGrid'))
const Projects = lazy(() => import('./components/Projects'))
const FloatingTerminal = lazy(() => import('./components/FloatingTerminal'))
const ContactOverlay = lazy(() => import('./components/ContactOverlay'))
const MarqueeBand = lazy(() => import('./components/MarqueeBand'))
const Footer = lazy(() => import('./components/Footer'))
const GPUChipViz = lazy(() => import('./components/GPUParticles'))
const NeuralNetworkViz = lazy(() => import('./components/NeuralNetworkViz'))
const DataPipelineViz = lazy(() => import('./components/DataPipelineViz'))

export default function App() {
    const [contactOpen, setContactOpen] = useState(false)
    const [isPerfLite, setIsPerfLite] = useState(false)
    const [hasFinePointer, setHasFinePointer] = useState(false)
    const [allowHeavyFx, setAllowHeavyFx] = useState(false)

    const openContact = useCallback(() => setContactOpen(true), [])
    const closeContact = useCallback(() => setContactOpen(false), [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const forced = params.get('perf')
        if (forced === 'lite') {
            setIsPerfLite(true)
            return
        }
        if (forced === 'full') {
            setIsPerfLite(false)
            return
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches
        const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 6
        const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 6
        const saveData = Boolean(navigator.connection?.saveData)

        setIsPerfLite(reducedMotion || coarsePointer || lowCpu || lowMemory || saveData)
    }, [])

    useEffect(() => {
        const finePointer = window.matchMedia('(pointer: fine)')
        const wideScreen = window.matchMedia('(min-width: 1024px)')

        const sync = () => {
            setHasFinePointer(finePointer.matches)
            setAllowHeavyFx(finePointer.matches && wideScreen.matches)
        }
        sync()

        finePointer.addEventListener('change', sync)
        wideScreen.addEventListener('change', sync)

        return () => {
            finePointer.removeEventListener('change', sync)
            wideScreen.removeEventListener('change', sync)
        }
    }, [])

    useEffect(() => {
        const lenis = new Lenis({
            duration: isPerfLite ? 1.05 : 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: isPerfLite ? 1.2 : 1.4,
        })

        let rafId = 0
        function raf(time) {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [isPerfLite])

    const showDecorFx = !isPerfLite && allowHeavyFx
    const showCursor = hasFinePointer

    return (
        <>
            {showDecorFx && (
                <Suspense fallback={null}>
                    <GPUChipViz />
                </Suspense>
            )}
            {showCursor && <CustomCursor performanceMode={isPerfLite ? 'low' : 'high'} />}
            <ScrollProgress />
            <Navbar onContactClick={openContact} />
            <Suspense fallback={null}>
                {showDecorFx && <FloatingTerminal />}
                <ContactOverlay isOpen={contactOpen} onClose={closeContact} />
            </Suspense>

            <div className={`noise-overlay page-enter stage-shell${isPerfLite ? ' perf-lite' : ''}`}>
                <div className="stage-backdrop" />
                <div className="stage-grid-sheen" />
                <div className="stage-orbit stage-orbit-a" />
                <div className="stage-orbit stage-orbit-b" />
                <div className="stage-glass-bloom stage-glass-bloom-a" />
                <div className="stage-glass-bloom stage-glass-bloom-b" />
                <div className="global-aurora global-aurora-a" />
                <div className="global-aurora global-aurora-b" />
                <div className="global-aurora global-aurora-c" />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Hero performanceMode={isPerfLite ? 'low' : 'high'} />
                    <Suspense fallback={null}>
                        <SpatialShowcase performanceMode={isPerfLite ? 'low' : 'high'} />
                        <DataPipelineViz performanceMode={isPerfLite ? 'low' : 'high'} />
                        <About />
                        <NeuralNetworkViz performanceMode={isPerfLite ? 'low' : 'high'} />
                        <TechGrid />
                        <Projects />
                        <MarqueeBand />
                        <Footer />
                    </Suspense>
                </div>
            </div>
        </>
    )
}
