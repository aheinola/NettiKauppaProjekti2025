import './CartPage.css'
import CartProduct from '../product_component_cart/CartProduct'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onHero, setOnHero] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const userId = 1 // TODO: Get this from your login system later

  const handleClick = () => {
    setMenuOpen(false)
  }

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

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cart/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch cart')
        const data = await res.json()
        setCartItems(data)
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Ostoskorin lataaminen epäonnistui.')
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [userId])

  // Increase quantity
  const handleIncrease = async (cartId, currentQuantity) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: currentQuantity + 1 })
      })
      if (!res.ok) throw new Error('Failed to update cart')

      // Update local state
      setCartItems(cartItems.map(item =>
        item.cart_id === cartId
          ? { ...item, quantity: currentQuantity + 1 }
          : item
      ))
    } catch (err) {
      console.error('Error updating cart:', err)
    }
  }

  // Decrease quantity
  const handleDecrease = async (cartId, currentQuantity) => {
    if (currentQuantity <= 1) {
      // Remove item if quantity would be 0
      handleRemove(cartId)
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: currentQuantity - 1 })
      })
      if (!res.ok) throw new Error('Failed to update cart')

      // Update local state
      setCartItems(cartItems.map(item =>
        item.cart_id === cartId
          ? { ...item, quantity: currentQuantity - 1 }
          : item
      ))
    } catch (err) {
      console.error('Error updating cart:', err)
    }
  }

  // Remove item
  const handleRemove = async (cartId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cart/${cartId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to remove item')

      // Update local state
      setCartItems(cartItems.filter(item => item.cart_id !== cartId))
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) =>
    sum + (item.products.product_price * item.quantity), 0
  )

  // Add this function in CartPage component
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Ostoskori on tyhjä!')
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (!res.ok) throw new Error('Failed to create order')

      const data = await res.json()
      alert(`Tilaus luotu! Tilausnumero: ${data.order.order_id}`)

      // Clear cart from state
      setCartItems([])
    } catch (err) {
      console.error('Error creating order:', err)
      alert('Virhe tilauksen luomisessa')
    }
  }

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
            <a href="/#komponentit">Komponentit</a>
            <a href="/#konsolit">Konsolit</a>
            <a href="/#oheislaitteet">Oheislaitteet</a>
            <a href="/#pelit">Pelit</a>
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
          <Link to="/" onClick={handleClick}>Koti</Link>
          <a href="/#komponentit" onClick={handleClick}>Komponentit</a>
          <a href="/#konsolit" onClick={handleClick}>Konsolit</a>
          <a href="/#oheislaitteet" onClick={handleClick}>Oheislaitteet</a>
          <a href="/#pelit" onClick={handleClick}>Pelit</a>
          <hr />
          <Link to="/login" onClick={handleClick}>Kirjaudu</Link>
          <Link to="/cart" onClick={handleClick}>Ostoskori</Link>
        </div>
      )}

      {/* CART SECTION */}
      <header className="cart-hero" id="home">
        <div className="cart-hero-content">
          <div className='cart'>
            <h1>Ostoskori</h1>

            {loading && <p>Ladataan ostoskoria...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && cartItems.length === 0 && (
              <p>Ostoskori on tyhjä.</p>
            )}

            {!loading && !error && cartItems.length > 0 && (
              <>
                <div className='cart-items'>
                  {cartItems.map((item) => (
                    <CartProduct
                      key={item.cart_id}
                      image={item.products.product_img}
                      title={item.products.product_name}
                      price={item.products.product_price}
                      quantity={item.quantity}
                      onIncrease={() => handleIncrease(item.cart_id, item.quantity)}
                      onDecrease={() => handleDecrease(item.cart_id, item.quantity)}
                      onRemove={() => handleRemove(item.cart_id)}
                    />
                  ))}
                </div>

                <div className='cart-total'>
                  <h2>Yhteensä: €{total.toFixed(2)}</h2>
                  <button className='checkout-btn' onClick={handleCheckout}>
                    Order
                  </button>
                </div>
              </>
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
              <li><a href="/#komponentit">Komponentit</a></li>
              <li><a href="/#konsolit">Konsolit</a></li>
              <li><a href="/#oheislaitteet">Oheislaitteet</a></li>
              <li><a href="/#pelit">Pelit</a></li>
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