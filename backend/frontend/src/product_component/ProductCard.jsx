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
              <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
                {rating.average} / 5 ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>No reviews yet</p>
          )}
          <p className="price">{price} €</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onAddToCart} style={{ flex: 1 }}>Add to Cart</button>
            <button 
              onClick={() => setShowReviewModal(true)}
              style={{ 
                backgroundColor: '#6c757d',
                flex: 1
              }}
            >
              Rate Product
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Rate {title}</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>Click a star to rate this product</p>
            
            <div style={{ fontSize: '48px', marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  disabled={submitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '48px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    padding: 0,
                    transition: 'transform 0.2s',
                    opacity: submitting ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = 'scale(1.2)')}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ⭐
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowReviewModal(false)}
              disabled={submitting}
              style={{
                padding: '10px 30px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
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