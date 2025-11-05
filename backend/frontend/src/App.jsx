import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <nav id="home">
        <div className="otsikko-ja-kategoriat">
          <h1><a href='#home'>NettiKauppa</a></h1>

          {/* Hamburger icon (visible only on mobile) */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
          </button>

          {/* Categories (hidden on mobile unless menu is open) */}
          <div className={`kategoriat ${menuOpen ? 'open' : ''}`}>
            <a>Komponentit</a>
            <a>Konsolit</a>
            <a>Oheislaitteet</a>
            <a>Pelit</a>
          </div>
        </div>

        <input type="text" placeholder="Hae" />

        <div className="kayttaja-ja-kori">
          <h2>Kirjaudu</h2>
          <h2>Ostoskori</h2>
        </div>
      </nav>

      <header className='hero'>
        <div className='hero-content'>
          <h1>Uusimmat tuotteet, Parhaat hinnat</h1>
          <h2>Discover our curated collection of premium electronics and accessories. Shop now and enjoy free shipping on orders over $50.</h2>

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
