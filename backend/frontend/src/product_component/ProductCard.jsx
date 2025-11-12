import './ProductCard.css'

function ProductCard({ product_id, image, title, price }) {
  const handleAddToCart = () => {
    const storedCart = localStorage.getItem('cart')
    let cart = storedCart ? JSON.parse(storedCart) : []

    // Check if item already exists
    const existingItem = cart.find((item) => item.product_id === product_id)
    if (existingItem) {
      // Increase quantity if already in cart
      cart = cart.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      // Add new item
      cart.push({
        product_id,
        product_name: title,
        product_price: Number(price),
        image_url: image,
        quantity: 1
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`${title} lisätty ostoskoriin!`)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <div className="product-info">
        <h3>{title}</h3>
        <p className="price">{price} €</p>
        <button onClick={handleAddToCart}>Lisää ostoskoriin</button>
      </div>
    </div>
  )
}

export default ProductCard
