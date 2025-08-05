import { useEffect } from 'react';
import '../styles/ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content fade-in">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-body">
          <div className="product-detail-image">
            <span className="product-detail-icon">{product.image}</span>
          </div>
          
          <div className="product-detail-info">
            <h2 className="product-detail-name">{product.name}</h2>
            <p className="product-detail-category">{product.category}</p>
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-detail-specs">
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
            
            <div className="product-detail-price">
              NPR {product.price}
            </div>
            
            <button 
              className="btn btn-primary add-to-cart-modal-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal; 