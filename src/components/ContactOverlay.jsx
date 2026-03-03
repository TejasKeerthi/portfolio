import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 90, damping: 18, mass: 1 },
    },
    exit: {
        x: '100%',
        opacity: 0,
        transition: { type: 'spring', stiffness: 120, damping: 22 },
    },
}

const fieldVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
}
const fieldStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }

export default function ContactOverlay({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: '', email: '', message: '' })
            onClose()
        }, 2000)
    }

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        fontSize: 14,
        outline: 'none',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        transition: 'border-color 0.3s',
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    id="contact-overlay"
                    style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 480,
                            height: '100%',
                            overflowY: 'auto',
                            background: 'rgba(2,10,20,0.95)',
                            borderLeft: '1px solid rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div style={{ padding: '40px 40px' }}>
                            {/* Close button */}
                            <motion.button
                                id="contact-close"
                                onClick={onClose}
                                whileHover={{ scale: 1.1, borderColor: 'rgba(6,182,212,0.4)' }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    position: 'absolute', top: 24, right: 24,
                                    width: 40, height: 40, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 16, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: 'var(--text-secondary)',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                ✕
                            </motion.button>

                            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}>
                                Contact
                            </p>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: 10 }}>
                                Let's <span className="gradient-text">connect</span>.
                            </h2>
                            <p style={{ fontSize: 14, marginBottom: 40, color: 'var(--text-secondary)' }}>
                                Have a project in mind, or just want to say hello? I'd love to hear from you.
                            </p>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}
                                >
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                                    <p className="gradient-text" style={{ fontSize: 20, fontWeight: 600 }}>Message Sent!</p>
                                    <p style={{ fontSize: 14, marginTop: 8, color: 'var(--text-secondary)' }}>
                                        I'll get back to you soon.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    onSubmit={handleSubmit}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fieldStagger}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                                >
                                    {[
                                        { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                                        { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                                    ].map((field) => (
                                        <motion.div key={field.name} variants={fieldVariants} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
                                            <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, fontWeight: 500, color: 'var(--text-secondary)' }}>
                                                {field.label}
                                            </label>
                                            <input
                                                id={`contact-${field.name}`}
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                required
                                                style={inputStyle}
                                                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                                                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                            />
                                        </motion.div>
                                    ))}

                                    <motion.div variants={fieldVariants} transition={{ type: 'spring', stiffness: 150, damping: 18 }}>
                                        <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, fontWeight: 500, color: 'var(--text-secondary)' }}>
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell me about your project..."
                                            required
                                            rows={5}
                                            style={{ ...inputStyle, resize: 'none' }}
                                            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                        />
                                    </motion.div>

                                    <motion.button
                                        id="contact-submit"
                                        type="submit"
                                        variants={fieldVariants}
                                        transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                                        whileHover={{ y: -2, boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            padding: '14px 0',
                                            borderRadius: 12,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                            color: '#fff',
                                            border: 'none',
                                            boxShadow: '0 0 25px rgba(6,182,212,0.3)',
                                        }}
                                    >
                                        Send Message →
                                    </motion.button>
                                </motion.form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
