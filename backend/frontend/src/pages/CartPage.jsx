import './CartPage.css'
import CartProduct from '../product_component_cart/CartProduct'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onHero, setOnHero] = useState(true)
  const [cart, setCart] = useState([])

  const handleClick = (event) => {
    event.preventDefault()
    setMenuOpen(false)
  }

  // Handle scrolling styles
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.querySelector('.cart-hero')?.offsetHeight || 600
      const scrollY = window.scrollY

      setOnHero(scrollY <= heroHeight - 80)
      setScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const updateQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== id))
  }

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  )

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
      <header className="cart-hero" id="home">
        <div className="cart-hero-content">
          <div className='cart'>
            <h1>Ostoskori</h1>

            <div className='cart-items'>
              {cart.length === 0 ? (
                <p>Ostoskorisi on tyhjä.</p>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.product_id}>
                    <div className="cart-image">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/150'}
                        alt={item.product_name}
                      />
                    </div>

                    <div className="cart-info">
                      <h3>{item.product_name}</h3>
                      <p className="price">€{item.product_price}</p>
                    </div>

                    <div className="cart-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.product_id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.product_id)}
                      >
                        Poista
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-summary">
                <h3>Yhteensä: €{totalPrice.toFixed(2)}</h3>
                <button className="checkout-btn">Siirry kassalle</button>
              </div>
            )}
          </div>
        </div>
      </header>

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

export default CartPage
