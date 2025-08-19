import { useEffect, useRef } from 'react'

const skills = [
  { name: 'JavaScript', level: 90 },
  { name: 'React', level: 85 },
  { name: 'CSS', level: 95 },
  { name: 'Node.js', level: 70 },
  { name: 'HTML', level: 99 },
  { name: 'Java', level: 80 },
  { name: 'Python', level: 60 },
  { name: 'C', level: 80 },
  { name: 'SQL', level: 85 },
]

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const bars = section.querySelectorAll('.skill__barFill')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bars.forEach((bar) => {
              const value = bar.getAttribute('data-value')
              bar.style.width = value + '%'
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="container">
        <h2>Skills</h2>
        <div className="skills">
          {skills.map((s) => (
            <div className="skill" key={s.name}>
              <div className="skill__header">
                <span>{s.name}</span>
                <span>{s.level}%</span>
              </div>
              <div className="skill__bar">
                <div className="skill__barFill" data-value={s.level} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


