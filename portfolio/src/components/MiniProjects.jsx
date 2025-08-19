import { useEffect, useRef } from 'react'

const BASE = 'https://yashthakare65.github.io/Yash-ProjectShowcase/'
const PATH = (...segments) => BASE + segments.map((s) => encodeURIComponent(s)).join('/') + '/'

const miniProjects = [
  { title: 'Daily Task Manager', emoji: '🗓️', link: BASE + 'DailyTaskManager/' },
  { title: 'Light/Dark Theme Toggle', emoji: '🌙', link: BASE + 'LightDark_Theme_toggle/' },
  { title: 'Personal Profile', emoji: '👤', link: BASE + 'personalprofile/' },
  { title: 'Responsive Landing Page', emoji: '📣', link: BASE + 'responsive_landing_page/' },
  { title: 'Weather App', emoji: '⛅', link: BASE + 'WheatherApp/' },
]

export default function MiniProjects() {
  const scrollerRef = useRef(null)
  const isHoveringRef = useRef(false)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    // Duplicate content for seamless loop
    const track = el.querySelector('.miniTrack')
    if (!track) return
    track.innerHTML += track.innerHTML

    let last = performance.now()
    const pxPerSec = 60 // speed

    const step = (t) => {
      const dt = (t - last) / 1000
      last = t
      if (!isHoveringRef.current) {
        el.scrollLeft += pxPerSec * dt
        // loop
        const half = track.scrollWidth / 2
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)

    const onWheel = (e) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY + e.deltaX
    }

    const onEnter = () => { isHoveringRef.current = true }
    const onLeave = () => { isHoveringRef.current = false }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(rafRef.current)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="miniSection">
      <div className="miniHeader">
        <h3>Mini Projects</h3>
        <a className="miniAllLink" target="_blank" rel="noreferrer" href={BASE}>See all →</a>
      </div>
      <div className="miniScroller" ref={scrollerRef} aria-label="Mini projects carousel">
        <div className="miniTrack">
          {miniProjects.map((m) => (
            <a key={m.title} href={m.link} target="_blank" rel="noreferrer" className="miniCard">
              <span className="miniEmoji" aria-hidden>
                {m.emoji}
              </span>
              <span className="miniTitle">{m.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}


