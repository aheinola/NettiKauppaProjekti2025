import './ProductCard.css'
import { useState, useEffect } from 'react'

function ProductCard({ image, title, price, onAddToCart, product_info, product_id }) {
  const [rating, setRating] = useState({ average: 0, count: 0 })
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews/${product_id}/average`)
        if (!res.ok) throw new Error('Failed to fetch rating')
        const data = await res.json()
        setRating(data)
      } catch (err) {
        console.error('Error fetching rating:', err)
      }
    }
    
    if (product_id) {
      fetchRating()
    }
  }, [product_id])

  const handleStarClick = async (starRating) => {
    if (submitting) return
    
    setSubmitting(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product_id,
          review_number: starRating,
          review_comment: ''
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.error || 'Failed to submit review')
      }

      alert(`Review submitted: ${starRating} stars!`)
      setShowReviewModal(false)

      // Refresh rating
      const ratingRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews/${product_id}/average`)
      const ratingData = await ratingRes.json()
      setRating(ratingData)
    } catch (err) {
      console.error('Error submitting review:', err)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    const stars = []
    const avgRating = parseFloat(rating.average)
    
    for (let i = 1; i <= 5; i++) {
      if (i <= avgRating) {
        stars.push(<span key={i}>⭐</span>)
      } else {
        stars.push(<span key={i} style={{ opacity: 0.3 }}>⭐</span>)
      }
    }
    return stars
  }

  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <img src={image} alt={title} />
        </div>
        <div className="product-info">
          <h3>{title}</h3>
          <p>{product_info}</p>
          {rating.count > 0 ? (
            <div className="rating">
              <span>{renderStars()}</span>
              <span className="rating-text">
                {rating.average} / 5 ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          ) : (
            <p className="no-reviews">No reviews yet</p>
          )}
          <p className="price">{price} €</p>
          <div className="button-group">
            <button onClick={onAddToCart}>Add to Cart</button>
            <button 
              className="rate-button"
              onClick={() => setShowReviewModal(true)}
            >
              Rate Product
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rate {title}</h2>
            <p>Click a star to rate this product</p>
            
            <div className="star-buttons">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className="star-button"
                  onClick={() => handleStarClick(star)}
                  disabled={submitting}
                >
                  ⭐
                </button>
              ))}
            </div>

            <button
              className="cancel-button"
              onClick={() => setShowReviewModal(false)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard