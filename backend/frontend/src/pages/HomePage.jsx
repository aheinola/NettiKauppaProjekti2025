import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import './HomePage.css'
import ProductCard from '../product_component/ProductCard'
import CategoryCard from '../category_card_component/CategoryCard'

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onHero, setOnHero] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [categoryImg, setCategoryImg] = useState([])

  const handleClick = () => {
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

  useEffect(() => {
    axios
    .get('http://localhost:3000/category')
    .then(response => {
      const data = response.data
      setCategoryImg(data)
    })
  }, [])

  // Add to cart function
  const handleAddToCart = async (productId) => {
    const userId = 1 // TODO: Get from login system

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity: 1
        })
      })

      if (!res.ok) throw new Error('Failed to add to cart')
    } catch (err) {
      console.error('Error adding to cart:', err)
    }
  }

  const handleShowAll = (event) => {
    event.preventDefault()
    setShowAll(true)
  }

  const handleHide = (event) => {
    event.preventDefault()
    setShowAll(false)
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
          <h1><Link to="/">Webstore</Link></h1>
          <div className={`kategoriat ${menuOpen ? 'open' : ''}`}>
            <a href="components">Components</a>
            <a href="consoles">Consoles</a>
            <a href="periphirals">Periphirals</a>
            <a href="games">Games</a>
            <input type="text" placeholder="Hae" />
            <div className="kayttaja-ja-kori">
              <h2><Link to="/login">Login</Link></h2>
              <h2><Link to="/cart">Cart</Link></h2>
            </div>
          </div>
        </div>
      </nav>

      {scrolled && menuOpen && (
        <div className='dropdown-menu'>
          <Link to="/" onClick={handleClick}>Home</Link>
          <a href="components" onClick={handleClick}>Components</a>
          <a href="consoles" onClick={handleClick}>consoles</a>
          <a href="periphirals" onClick={handleClick}>Periphirals</a>
          <a href="games" onClick={handleClick}>Games</a>
          <hr />
          <Link to="/login" onClick={handleClick}>Login</Link>
          <Link to="/cart" onClick={handleClick}>Cart</Link>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="hero" id="home">
        <div className="hero-content">
          <h1>Newest products, Best prices</h1>
          <h2>Discover our curated collection of premium electronics and accessories.</h2>
          <div className="hero-buttons">
            <button onClick={() => window.location.href = `#main`}>Shop Now</button>
            <button className='button2'>Learn More</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main id='main'>
        <section>
          <div className='main-otsikko'>
            <h2>Most bought products</h2>
            <h3>Discover our latest collection of tech products</h3>
          </div>

          <div className='wrapper'>
            <div className='tuotteet-wrapper'>
              {loading && <p>Loading products...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && products.length === 0 && (
                <p>No products available.</p>
              )}
              {!loading && !error && products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product_id={product.product_id}
                  image={product.product_img}
                  title={product.product_name}
                  price={product.product_price}
                  onAddToCart={() => handleAddToCart(product.product_id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY SECTION (using CategoryCard) */}
        <section className="kategoria">
          <div className="main-otsikko">
            <h2>Categories</h2>
            <hr />
            {showAll === false ? (
              <h3><a onClick={handleShowAll}>All categories</a></h3>
            ) : <h3><a onClick={handleHide}>Hide</a></h3>}
            
          </div>

          {showAll === false ? (
          <div className="wrapper">
            {categoryImg.slice(0, 2).map((category, idx) => (
              <div className="tuotteet-wrapper" key={category.id || idx}>
                <CategoryCard
                  Category={category.category_name.toUpperCase()}
                  imageUrl={category.category_img}
                  onClick={() => window.location.href = `${category.category_name.toLowerCase() || ''}`}
                />
              </div>
            ))}
            <a onClick={handleShowAll}>Show all</a>
          </div>
          ) : 
            <div className="wrapper">
              {categoryImg.map((category, idx) => (
                <div className='tuotteet-wrapper' key={category.id || idx}>
                  <CategoryCard
                    Category={category.category_name.toUpperCase()}
                    imageUrl={category.category_img}
                    onClick={() => window.location.href = `${category.category_name.toLowerCase() || ''}`}
                  />

                </div>
              ))}
              <a onClick={handleHide}>Hide</a>
            </div>        
          }
          
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-section logo">
            <h2><Link to="/">Webstore</Link></h2>
            <p>Newest products, best prices – straight to you.</p>
          </div>

          <div className="footer-section">
            <h3>In-store links</h3>
            <ul>
              <li><a href="components">Components</a></li>
              <li><a href="console">Consoles</a></li>
              <li><a href="periphirals">Periphirals</a></li>
              <li><a href="games">Games</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact us</h3>
            <ul>
              <li>Email: <a href="mailto:support@nettikauppa.fi">support@nettikauppa.fi</a></li>
              <li>Phone: +358 40 123 4567</li>
              <li>Address: Helsinki, Suomi</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Follow us</h3>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Webstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage