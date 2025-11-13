import './CategoryCard.css';

function CategoryCard({ Category, onClick, imageUrl }) {
  return (
    <div
      className="category-card"
      onClick={onClick}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="category-overlay">
        <h3>{Category}</h3>
      </div>
    </div>
  );
}

export default CategoryCard;
