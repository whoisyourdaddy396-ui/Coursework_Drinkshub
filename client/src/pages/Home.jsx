import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';

const Home = () => {
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const { addToCart } = useCart();

  // Mock featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Nepal Ice Beer",
      category: "Beer",
      price: 180,
      image: "🍺",
      description: "Premium Nepali beer with smooth taste"
    },
    {
      id: 2,
      name: "Khukuri Rum",
      category: "Rum",
      price: 850,
      image: "🥃",
      description: "Traditional Nepali rum with rich flavor"
    },
    {
      id: 3,
      name: "Everest Vodka",
      category: "Vodka",
      price: 1200,
      image: "🍸",
      description: "Premium vodka from the Himalayas"
    },
    {
      id: 4,
      name: "Gorkha Whiskey",
      category: "Whiskey",
      price: 1500,
      image: "🥃",
      description: "Smooth Nepali whiskey with character"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterMessage('Thank you for subscribing! You\'ll receive updates about new products and special offers.');
      setEmail('');
      setTimeout(() => setNewsletterMessage(''), 5000);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Drinkshub</span>
          </h1>
          <p className="hero-subtitle">
            Discover the finest selection of premium liquors from Nepal and around the world. 
            Quality, authenticity, and exceptional taste in every bottle.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary hero-btn">
              Explore Products
            </Link>
            <Link to="/contact" className="btn btn-secondary hero-btn">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-bottles">
            <span className="bottle bottle-1">🍷</span>
            <span className="bottle bottle-2">🥃</span>
            <span className="bottle bottle-3">🍺</span>
            <span className="bottle bottle-4">🍸</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked premium selections for the discerning connoisseur</p>
        </div>
        
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card card">
              <div className="product-image">
                <span className="product-icon">{product.image}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-price">NPR {product.price}</div>
                <button 
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-container">
          <Link to="/products" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find your perfect drink in our carefully curated categories</p>
        </div>
        
        <div className="categories-grid">
          <div className="category-card card">
            <span className="category-icon">🍺</span>
            <h3>Beer</h3>
            <p>Local and international beers</p>
            <Link to="/products?category=beer" className="btn btn-secondary">
              Explore Beer
            </Link>
          </div>
          
          <div className="category-card card">
            <span className="category-icon">🥃</span>
            <h3>Whiskey</h3>
            <p>Premium whiskeys from around the world</p>
            <Link to="/products?category=whiskey" className="btn btn-secondary">
              Explore Whiskey
            </Link>
          </div>
          
          <div className="category-card card">
            <span className="category-icon">🍸</span>
            <h3>Vodka</h3>
            <p>Smooth and clean vodkas</p>
            <Link to="/products?category=vodka" className="btn btn-secondary">
              Explore Vodka
            </Link>
          </div>
          
          <div className="category-card card">
            <span className="category-icon">🍷</span>
            <h3>Wine</h3>
            <p>Fine wines for every occasion</p>
            <Link to="/products?category=wine" className="btn btn-secondary">
              Explore Wine
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content card">
          <div className="newsletter-info">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive offers, new product announcements, and insider tips.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
          {newsletterMessage && (
            <div className="newsletter-message success">
              {newsletterMessage}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>About Drinkshub</h2>
            <p>
              Drinkshub is Nepal's premier online liquor store, offering a carefully curated selection 
              of the finest spirits, beers, and wines. We pride ourselves on quality, authenticity, 
              and exceptional customer service.
            </p>
            <p>
              Our mission is to provide our customers with access to premium alcoholic beverages 
              while ensuring responsible consumption and adherence to all legal requirements.
            </p>
            <div className="about-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🛡️</span>
                <span>Secure Payment</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 