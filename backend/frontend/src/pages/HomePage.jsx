import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import './HomePage.css'
import ProductCard from '../product_component/ProductCard'

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onHero, setOnHero] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleClick = (event) => {
    event.preventDefault()
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.querySelector('.hero')?.offsetHeight || 600
      const scrollY = window.scrollY

      setOnHero(scrollY <= heroHeight - 80)
      setScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/products`)
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Tuotteiden lataaminen epäonnistui.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      {/* Navigation */}
      <nav className={`${scrolled ? 'scrolled' : ''} ${onHero ? 'on-hero' : 'on-main'}`}>
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
          <h1><Link to="/">NettiKauppa</Link></h1>
          <div className={`kategoriat ${menuOpen ? 'open' : ''}`}>
            <a href="#komponentit">Komponentit</a>
            <a href="#konsolit">Konsolit</a>
            <a href="#oheislaitteet">Oheislaitteet</a>
            <a href="#pelit">Pelit</a>
            <input type="text" placeholder="Hae" />
            <div className="kayttaja-ja-kori">
              <h2><Link to="/login">Kirjaudu</Link></h2>
              <h2><Link to="/cart">Ostoskori</Link></h2>
            </div>
          </div>
        </div>
      </nav>

      {scrolled && menuOpen && (
        <div className='dropdown-menu'>
          <Link to="/">Koti</Link>
          <a href="#komponentit">Komponentit</a>
          <a href="#konsolit">Konsolit</a>
          <a href="#oheislaitteet">Oheislaitteet</a>
          <a href="#pelit">Pelit</a>
          <hr />
          <Link to="/login" onClick={handleClick}>Kirjaudu</Link>
          <Link to="/cart" onClick={handleClick}>Ostoskori</Link>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="hero" id="home">
        <div className="hero-content">
          <h1>Uusimmat tuotteet, Parhaat hinnat</h1>
          <h2>Discover our curated collection of premium electronics and accessories.</h2>
          <div className="hero-buttons">
            <button>Shop Now</button>
            <button className='button2'>Learn More</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main id='main'>
        <section>
          <div className='main-otsikko'>
            <h2>Suosituimmat tuotteet</h2>
            <h3>Discover our latest collection of tech products</h3>
          </div>

          <div className='wrapper'>
            <div className='tuotteet-wrapper'>
              {loading && <p>Ladataan tuotteita...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && products.length === 0 && (
                <p>Ei tuotteita saatavilla.</p>
              )}
              {!loading && !error && products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product_id={product.product_id}
                  image={product.product_img}  // ← Changed this
                  title={product.product_name}
                  price={product.product_price}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY SECTIONS */}
        {['komponentit', 'konsolit', 'oheislaitteet', 'pelit'].map((cat) => (
          <section className='kategoria' key={cat}>
            <div className='main-otsikko'>
              <h2 id={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
              <hr />
              <h3><a href={`#${cat}`}>Kaikki {cat}</a></h3>
            </div>

            <div className='wrapper'>
              <div className='tuotteet-wrapper'>
                {products
                  .filter((p) => p.product_category?.toLowerCase() === cat)
                  .map((product) => (
                    <ProductCard
                      key={product.product_id}
                      product_id={product.product_id}
                      image={product.product_img}  // ← Changed this
                      title={product.product_name}
                      price={product.product_price}
                    />
                  ))}

              </div>
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-section logo">
            <h2><Link to="/">NettiKauppa</Link></h2>
            <p>Uusimmat tuotteet, parhaat hinnat – suoraan sinulle.</p>
          </div>

          <div className="footer-section">
            <h3>Kauppa</h3>
            <ul>
              <li><a href="#komponentit">Komponentit</a></li>
              <li><a href="#konsolit">Konsolit</a></li>
              <li><a href="#oheislaitteet">Oheislaitteet</a></li>
              <li><a href="#pelit">Pelit</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Yhteystiedot</h3>
            <ul>
              <li>Sähköposti: <a href="mailto:support@nettikauppa.fi">support@nettikauppa.fi</a></li>
              <li>Puhelin: +358 40 123 4567</li>
              <li>Osoite: Helsinki, Suomi</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Seuraa meitä</h3>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NettiKauppa. Kaikki oikeudet pidätetään.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
