import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState({ type: '', message: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    setStatus({ type: 'loading', message: 'Sending...' })
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (serviceId && templateId && publicKey) {
        await emailjs.sendForm(serviceId, templateId, form, {
          publicKey,
        })
        form.reset()
        setStatus({ type: 'success', message: 'Message sent successfully!' })
      } else {
        const data = new FormData(form)
        const ownerEmail = import.meta.env.VITE_CONTACT_EMAIL || 'your@email.com'
        const subject = `Portfolio Contact: ${data.get('name')} <${data.get('email')}>`
        const body = `${data.get('message')}`
        const mailto = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.location.href = mailto
        setStatus({ type: 'success', message: 'Opening email client...' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send. Please try again.' })
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>Contact</h2>
        <form ref={formRef} className="contactForm" onSubmit={onSubmit}>
          <div className="formRow">
            <label>
              Name
              <input name="name" type="text" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required placeholder="your@email.com" />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" rows="5" required placeholder="How can I help?" />
          </label>
          <button className="button" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {status.message && (
            <p className={`formStatus formStatus--${status.type}`}>{status.message}</p>
          )}
        </form>
      </div>
    </section>
  )
}


