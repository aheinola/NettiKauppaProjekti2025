import './CartProduct.css'

function CartProduct({ image, title, price, quantity, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="cart-item">
            <div className="cart-image">
                <img src={image} alt={title} />
            </div>

            <div className="cart-info">
                <h3>{title}</h3>
                <p className="price">{price}</p>
            </div>

            <div className="cart-actions">
                <div className="quantity-controls">
                    <button onClick={onDecrease}>-</button>
                    <span>{quantity}</span>
                    <button onClick={onIncrease}>+</button>
                </div>
                <button className="remove-btn" onClick={onRemove}>Poista</button>
            </div>
        </div>
    )
}


export default CartProduct