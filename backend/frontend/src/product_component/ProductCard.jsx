import './ProductCard.css'

function ProductCard({ image, title, price, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <div className="product-info">
        <h3>{title}</h3>
        <p className="price">{price} €</p>
        <button onClick={onAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard