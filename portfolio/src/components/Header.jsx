import { useEffect, useState } from 'react'

function ThemeToggle({ onToggle, currentTheme }) {
  return (
    <button aria-label="Toggle theme" className="theme-toggle" onClick={onToggle}>
      {currentTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container header__content">
        <a href="#home" className="logo" aria-label="Home">Yash</a>
        <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
          <a href="#about" onClick={handleLinkClick}>About</a>
          <a href="#skills" onClick={handleLinkClick}>Skills</a>
          <a href="#experience" onClick={handleLinkClick}>Experience</a>
          <a href="#certifications" onClick={handleLinkClick}>Certifications</a>
          <a href="#projects" onClick={handleLinkClick}>Projects</a>
          <a href="#contact" onClick={handleLinkClick}>Contact</a>
        </nav>
        <div className="header__actions">
          <ThemeToggle
            currentTheme={theme}
            onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />
          <a
            className="ghLink"
            href="https://github.com/Yashthakare65"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.486 2 12.021c0 4.422 2.865 8.166 6.839 9.49.5.093.682-.218.682-.485 0-.238-.009-.868-.013-1.704-2.782.606-3.369-1.343-3.369-1.343-.455-1.159-1.11-1.468-1.11-1.468-.908-.62.069-.607.069-.607 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.087 2.91.832.091-.648.35-1.087.636-1.337-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.5.336c1.91-1.296 2.749-1.026 2.749-1.026.545 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.565 4.944.359.31.678.922.678 1.859 0 1.34-.012 2.421-.012 2.75 0 .269.18.582.688.483C19.138 20.184 22 16.441 22 12.02 22 6.486 17.522 2 12 2Z" />
            </svg>
          </a>
          <button
            className="hamburger"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}


