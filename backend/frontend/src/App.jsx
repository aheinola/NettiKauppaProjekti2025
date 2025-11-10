import { useState, useEffect } from 'react'
import './App.css'
import ProductCard from './product_component/ProductCard'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onHero, setOnHero] = useState(true) // ✅ new state

  const handleClick = (event) => {
    event.preventDefault()
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.querySelector('.hero')?.offsetHeight || 600
      const scrollY = window.scrollY

      // When past hero
      if (scrollY > heroHeight - 80) {
        setOnHero(false)
      } else {
        setOnHero(true)
      }

      // Keep your scrolled logic
      setScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <nav
        id="home"
        className={`${scrolled ? 'scrolled' : ''} ${onHero ? 'on-hero' : 'on-main'}`}
      >
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
          <a href="#" onClick={handleClick}>Komponentit</a>
          <a href="#" onClick={handleClick}>Konsolit</a>
          <a href="#" onClick={handleClick}>Oheislaitteet</a>
          <a href="#" onClick={handleClick}>Pelit</a>
          <hr />
          <a href="#" onClick={handleClick}>Kirjaudu</a>
          <a href="#" onClick={handleClick}>Ostoskori</a>
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
          <div className='main-otsikko'>
            <h2>Suosituimmat tuotteet</h2>
            <h3>Discover our latest collection of tech products</h3>
          </div>

          <div className='wrapper'>
            <div className='tuotteet-wrapper'>
            <ProductCard 
                image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171"
                title="MacBook Pro"
                price="399"
                onAddToCart={() => console.log('Added to cart')}
            />

              <ProductCard
                image="https://images.unsplash.com/photo-1613141412501-9012977f1969?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                title="Pelihiiri"
                price="49"
                onAddToCart={() => console.log('Added Pelihiiri')}
              />

              <ProductCard
                image="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1331"
                title="Näyttö"
                price="299"
                onAddToCart={() => console.log('Added Näyttö')}
              />

              <ProductCard 
                image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171"
                title="MacBook Pro"
                price="399"
                onAddToCart={() => console.log('Added to cart')}
            />
            </div>

            <div className='tuotteet-wrapper'>
              <ProductCard
                image="https://images.unsplash.com/photo-1613141412501-9012977f1969?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                title="Pelihiiri"
                price="49"
                onAddToCart={() => console.log('Added Pelihiiri')}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
