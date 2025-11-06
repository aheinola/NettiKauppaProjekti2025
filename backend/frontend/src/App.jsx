import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setScrolled(true)
      else setScrolled(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <nav id="home" className={scrolled ? "scrolled" : ""}>
        {/* ✅ Move hamburger OUTSIDE so it stays visible */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          >
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </button>

        <div className="otsikko-ja-kategoriat">
          <h1><a href="#home">NettiKauppa</a></h1>

          <div className={`kategoriat ${menuOpen ? 'open' : ''}`}>
            <a>Komponentit</a>
            <a>Konsolit</a>
            <a>Oheislaitteet</a>
            <a>Pelit</a>

            <input type="text" placeholder="Hae" />

            <div className="kayttaja-ja-kori">
              <h2>Kirjaudu</h2>
              <h2>Ostoskori</h2>
            </div>
          </div>
        </div>

        
      </nav>

      {scrolled && menuOpen && (
        <div className='dropdown-menu'>
          <a href="#">Komponentit</a>
          <a href="#">Konsolit</a>
          <a href="#">Oheislaitteet</a>
          <a href="#">Pelit</a>
          <hr />
          <a href="#">Kirjaudu</a>
          <a href="#">Ostoskori</a>
        </div>
      )}

      <header className="hero">
        <div className="hero-content">
          <h1>Uusimmat tuotteet, Parhaat hinnat</h1>
          <h2>Discover our curated collection of premium electronics and accessories.</h2>
          <div className="hero-buttons">
            <button>Shop Now</button>
            <button>Learn More</button>
          </div>
        </div>
      </header>

      <main>
        <section>
          <h2>Suosituimmat tuotteet</h2>
        </section>
      </main>
    </div>
  )
}

export default App
