import './ProductCard.css'
import { useState, useEffect } from 'react'

function ProductCard({ image, title, price, onAddToCart, product_info, product_id }) {
  const [rating, setRating] = useState({ average: 0, count: 0 })
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewsList, setShowReviewsList] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)

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

  const handleShowReviews = async () => {
    setShowReviewsList(true)
    setLoadingReviews(true)
    
    try {
      console.log('Fetching reviews for product_id:', product_id)
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews/${product_id}`)
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()
      console.log('Fetched reviews:', data)
      setReviews(data)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleStarClick = async (starRating) => {
    if (submitting) return
    
    setSubmitting(true)

    try {
      // Get user info from localStorage
      const userData = localStorage.getItem('user')
      let userId = null
      if (userData) {
        try {
          const user = JSON.parse(userData)
          userId = user.user_id
        } catch (err) {
          console.error('Error parsing user data:', err)
        }
      }

      console.log('Submitting review for product_id:', product_id, 'rating:', starRating, 'comment:', reviewComment, 'user_id:', userId)
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product_id,
          review_number: starRating,
          review_comment: reviewComment,
          user_id: userId
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.error || 'Failed to submit review')
      }

      alert(`Review submitted: ${starRating} stars!`)
      setShowReviewModal(false)
      setReviewComment('')

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
                {rating.average} / 5 (
                <span className="reviews-link" onClick={handleShowReviews}>
                  {rating.count} {rating.count === 1 ? 'review' : 'reviews'}
                </span>
                )
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
            
            <textarea
              className="review-comment-input"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your comment here (optional)..."
              rows="4"
            />
            
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

      {/* Reviews List Modal */}
      {showReviewsList && (
        <div className="modal-overlay" onClick={() => setShowReviewsList(false)}>
          <div className="modal-content reviews-list-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Reviews for {title}</h2>
            
            {loadingReviews ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <div className="reviews-container">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">
                        {review.shop_user?.user_name || 'Anonymous'}
                      </span>
                      <span className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ opacity: i < review.review_number ? 1 : 0.3 }}>⭐</span>
                        ))}
                      </span>
                      <span className="review-rating">{review.review_number} / 5</span>
                    </div>
                    {review.review_comment && (
                      <p className="review-comment">{review.review_comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              className="cancel-button"
              onClick={() => setShowReviewsList(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard