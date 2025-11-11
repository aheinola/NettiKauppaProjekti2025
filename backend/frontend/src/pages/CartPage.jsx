import './CartPage.css'
import ProductCard from '../product_component/ProductCard'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

function CartPage() {

    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [onHero, setOnHero] = useState(true)

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
                            <div className="cart-item">
                                <div className="cart-image">
                                    <img src="https://via.placeholder.com/150" alt="Tuote 1" />
                                </div>

                                <div className="cart-info">
                                    <h3>Tuote 1</h3>
                                    <p className="price">€49.99</p>
                                </div>

                                <div className="cart-actions">
                                    <div className="quantity-controls">
                                        <button>-</button>
                                        <span>1</span>
                                        <button>+</button>
                                    </div>
                                    <button className="remove-btn">Poista</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

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