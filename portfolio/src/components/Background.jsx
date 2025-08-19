import { useEffect, useRef } from 'react'

export default function Background() {
  const gradientRef = useRef(null)
  const glow1Ref = useRef(null)
  const glow2Ref = useRef(null)
  const canvasRef = useRef(null)
  const mousePosRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let raf = 0

    const onMove = (e) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      const x = (e.clientX / w) * 2 - 1
      const y = (e.clientY / h) * 2 - 1
      targetX = x
      targetY = y
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const tick = () => {
      // smooth follow
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08

      const g = gradientRef.current
      const g1 = glow1Ref.current
      const g2 = glow2Ref.current

      // Depth parallax: layers move with different intensities and directions
      if (g) g.style.transform = `translate3d(${currentX * 20}px, ${currentY * 20}px, 0)`
      if (g1) g1.style.transform = `translate3d(${currentX * -40}px, ${currentY * -40}px, 0)`
      if (g2) g2.style.transform = `translate3d(${currentX * 60}px, ${currentY * 60}px, 0)`

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Particle constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let particles = []
    let raf = 0

    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      initParticles()
    }

    function initParticles() {
      const area = width * height
      const baseDensity = width < 640 ? 0.00005 : 0.00008
      const count = Math.min(220, Math.max(50, Math.floor(area * baseDensity)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 0.8 + Math.random() * 1.4,
      }))
    }

    function step() {
      ctx.clearRect(0, 0, width, height)
      const style = getComputedStyle(document.documentElement)
      const textColor = style.getPropertyValue('--text').trim() || '#e5e7eb'

      // Convert --text (rgb or hex) to rgba helpers
      function rgba(base, alpha) {
        if (base.startsWith('#')) {
          const hex = base.replace('#', '')
          const bigint = parseInt(hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex, 16)
          const r = (bigint >> 16) & 255
          const g = (bigint >> 8) & 255
          const b = bigint & 255
          return `rgba(${r}, ${g}, ${b}, ${alpha})`
        }
        if (base.startsWith('rgb')) {
          return base.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
        }
        return `rgba(229, 231, 235, ${alpha})`
      }

      const rect = canvas.getBoundingClientRect()
      const mouse = mousePosRef.current
      const mx = mouse.x - rect.left
      const my = mouse.y - rect.top

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // bounce
        if (p.x <= 0 || p.x >= width) p.vx *= -1
        if (p.y <= 0 || p.y >= height) p.vy *= -1

        // slight mouse repulsion
        if (mouse.active) {
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          const minDist = 140
          if (d2 < minDist * minDist) {
            const dist = Math.sqrt(d2) || 1
            const force = (minDist - dist) / minDist
            p.vx += (dx / dist) * force * 0.02
            p.vy += (dy / dist) * force * 0.02
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = rgba(textColor, 0.12)
        ctx.fill()
      }

      // draw links
      const linkDist = 130
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const d = Math.hypot(dx, dy)
          if (d < linkDist) {
            const a = 1 - d / linkDist
            ctx.strokeStyle = rgba(textColor, 0.10 * a)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // mouse connections
      if (mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const dx = p.x - mx
          const dy = p.y - my
          const d = Math.hypot(dx, dy)
          const md = 160
          if (d < md) {
            const a = 1 - d / md
            ctx.strokeStyle = rgba(textColor, 0.12 * a)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(mx, my)
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(step)
    }

    function onResize() { resize() }
    window.addEventListener('resize', onResize)
    resize()
    raf = requestAnimationFrame(step)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bgAnimated" aria-hidden="true">
      <canvas ref={canvasRef} className="bgAnimated__canvas" />
      <div ref={gradientRef} className="bgAnimated__gradient" />
      <div ref={glow1Ref} className="bgAnimated__glow bgAnimated__glow--1" />
      <div ref={glow2Ref} className="bgAnimated__glow bgAnimated__glow--2" />
      <div className="bgAnimated__grid" />
    </div>
  )
}


