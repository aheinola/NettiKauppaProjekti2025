import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <nav>
        <div className="otsikko-ja-kategoriat">
          <h1>NettiKauppa</h1>

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

      
    </div>
  )
}

export default App
