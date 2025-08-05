import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Mock product data - in real app this would come from API
  const product = {
    id: parseInt(id),
    name: "Nepal Ice Beer",
    category: "Beer",
    price: 180,
    image: "🍺",
    description: "Premium Nepali beer with smooth taste and refreshing finish. Perfect for any occasion.",
    alcoholContent: "5%",
    volume: "650ml",
    origin: "Nepal",
    features: [
      "Smooth and refreshing taste",
      "Premium quality ingredients",
      "Perfect for social gatherings",
      "Made in Nepal"
    ]
  };

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image card">
          <span className="product-detail-icon">{product.image}</span>
        </div>
        
        <div className="product-detail-info card">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Origin:</span>
              <span className="spec-value">{product.origin}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Volume:</span>
              <span className="spec-value">{product.volume}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Alcohol Content:</span>
              <span className="spec-value">{product.alcoholContent}</span>
            </div>
          </div>
          
          <div className="product-features">
            <h3>Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="product-price">NPR {product.price}</div>
          
          <button 
            className="btn btn-primary add-to-cart-detail-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 