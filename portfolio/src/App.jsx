import './styles.css'
import Header from './components/Header'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Background from './components/Background'

export default function App() {
  return (
    <div id="home">
      <Background />
      <Header />

      <main>
        <section className="hero section">
          <div className="container">
            <h1>Hello, I'm Yash Ravi Thakare</h1>
            <p>Frontend Developer • React Enthusiast • Lifelong Learner</p>
            <div className="hero__actions">
              <a href="#projects" className="button">View Projects</a>
              <a href="#contact" className="button button--secondary">Contact Me</a>
            </div>
          </div>
        </section>

        <About />
        <Skills />
        <Experience />
        <Certifications />
        <Projects />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Yash Ravi Thakare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
