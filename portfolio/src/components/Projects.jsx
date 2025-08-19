import MiniProjects from './MiniProjects'

const projects = [
  {
    title: "Yash's Project Portfolio",
    description: 'Explore my creations — a curated portfolio with dark mode and project links.',
    tags: ['React', 'Portfolio', 'Dark Mode'],
    link: 'https://yashthakare65.github.io/Yash-ProjectShowcase/',
    image: '/images/portfolio-cover.jpg',
    imageAlt: "Yash's Project Portfolio screenshot",
  },
  {
    title: 'Cookie Delights Website',
    description: 'A delicious, responsive cookie recipes site featuring categories and hero sections.',
    tags: ['HTML', 'CSS', 'Responsive'],
    link: 'https://yashthakare65.github.io/Cookie-Website/',
    image: '/images/cookie-delights-cover.jpg',
    imageAlt: 'Cookie Delights website screenshot',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2>Projects</h2>
        {/* Mini projects carousel */}
        <MiniProjects />
        <div className="projectsGrid">
          {projects.map((p) => (
            <a className="projectCard" key={p.title} href={p.link} target="_blank" rel="noreferrer">
              {p.image && (
                <div className="projectImageWrap">
                  <img
                    className="projectImage"
                    src={p.image}
                    alt={p.imageAlt || p.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <div className="projectImageOverlay" />
                </div>
              )}
              <div className="projectBody">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="projectTags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}


