import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import axios from "axios"
import ProductCard from "../product_component/ProductCard"
import Hero from "../category_hero_component/CategoryHero"

function GamesPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onHero, setOnHero] = useState(true)
  const [categoryImg, setCategoryImg] = useState('')

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

  useEffect(() => {
    axios
      .get('http://localhost:3000/category')
      .then(response => {
        const data = response.data
        setCategoryImg(data[2].category_img)
      })
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
            <a href="components">Komponentit</a>
            <a href="consoles">Konsolit</a>
            <a href="periphirals">Oheislaitteet</a>
            <a href="games">Pelit</a>
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
          <a href="#components" >Komponentit</a>
          <a href="#console" >Konsolit</a>
          <a href="#periphirals" >Oheislaitteet</a>
          <a href="#games" >Pelit</a>
          <hr />
          <Link to="/login" >Kirjaudu</Link>
          <Link to="/cart" >Ostoskori</Link>
        </div>
      )}

      {/* HERO SECTION */}
      <Hero
        title='Games'
        subtitle='The best collection of PC and Console games'
        bg={categoryImg}
      />

      {/* MAIN CONTENT */}
      <main id='main'>
        <section>
          <div className='main-otsikko'>
            <h2>All games</h2>
            <h3>The best collection of PC and Console games</h3>
          </div>

          <div className='wrapper'>
            <div className='tuotteet-wrapper'>
              <ProductCard
                image={"https://bmrolbmemttyhlncszxy.supabase.co/storage/v1/object/public/product_images/gpu1.jpg"}
                title={'tuote'}
                price={'300'}
                
              />

              <ProductCard
                image={"https://bmrolbmemttyhlncszxy.supabase.co/storage/v1/object/public/product_images/gpu1.jpg"}
                title={'tuote'}
                price={'300'}
                
              />

              <ProductCard
                image={"https://bmrolbmemttyhlncszxy.supabase.co/storage/v1/object/public/product_images/gpu1.jpg"}
                title={'tuote'}
                price={'300'}
                
              />

              <ProductCard
                image={"https://bmrolbmemttyhlncszxy.supabase.co/storage/v1/object/public/product_images/gpu1.jpg"}
                title={'tuote'}
                price={'300'}
                
              />
            </div>
          </div>
        </section>
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
              <li><a href="components">Komponentit</a></li>
              <li><a href="console">Konsolit</a></li>
              <li><a href="periphirals">Oheislaitteet</a></li>
              <li><a href="games">Pelit</a></li>
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

export default GamesPage