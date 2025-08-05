import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import '../styles/Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useCart();

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Nepal Ice Beer",
      category: "Beer",
      price: 180,
      image: "🍺",
      description: "Premium Nepali beer with smooth taste and refreshing finish. Perfect for any occasion.",
      alcoholContent: "5%",
      volume: "650ml",
      origin: "Nepal"
    },
    {
      id: 2,
      name: "Khukuri Rum",
      category: "Rum",
      price: 850,
      image: "🥃",
      description: "Traditional Nepali rum with rich flavor and smooth finish. Aged to perfection.",
      alcoholContent: "40%",
      volume: "750ml",
      origin: "Nepal"
    },
    {
      id: 3,
      name: "Everest Vodka",
      category: "Vodka",
      price: 1200,
      image: "🍸",
      description: "Premium vodka from the Himalayas. Clean, crisp, and smooth with every sip.",
      alcoholContent: "40%",
      volume: "750ml",
      origin: "Nepal"
    },
    {
      id: 4,
      name: "Gorkha Whiskey",
      category: "Whiskey",
      price: 1500,
      image: "🥃",
      description: "Smooth Nepali whiskey with character and depth. Aged in oak barrels.",
      alcoholContent: "43%",
      volume: "750ml",
      origin: "Nepal"
    },
    {
      id: 5,
      name: "Carlsberg Beer",
      category: "Beer",
      price: 220,
      image: "🍺",
      description: "International premium lager with crisp taste and golden color.",
      alcoholContent: "5%",
      volume: "500ml",
      origin: "Denmark"
    },
    {
      id: 6,
      name: "Tuborg Beer",
      category: "Beer",
      price: 200,
      image: "🍺",
      description: "Refreshing Danish beer with balanced hop character.",
      alcoholContent: "4.6%",
      volume: "500ml",
      origin: "Denmark"
    },
    {
      id: 7,
      name: "Absolut Vodka",
      category: "Vodka",
      price: 1800,
      image: "🍸",
      description: "Premium Swedish vodka with smooth, clean taste and subtle sweetness.",
      alcoholContent: "40%",
      volume: "750ml",
      origin: "Sweden"
    },
    {
      id: 8,
      name: "Jack Daniel's Whiskey",
      category: "Whiskey",
      price: 2500,
      image: "🥃",
      description: "Tennessee whiskey with rich, smoky flavor and smooth finish.",
      alcoholContent: "40%",
      volume: "750ml",
      origin: "USA"
    },
    {
      id: 9,
      name: "Red Wine Merlot",
      category: "Wine",
      price: 1200,
      image: "🍷",
      description: "Smooth red wine with notes of black cherry and plum.",
      alcoholContent: "13.5%",
      volume: "750ml",
      origin: "France"
    },
    {
      id: 10,
      name: "White Wine Chardonnay",
      category: "Wine",
      price: 1100,
      image: "🍷",
      description: "Crisp white wine with citrus and apple notes.",
      alcoholContent: "12.5%",
      volume: "750ml",
      origin: "France"
    },
    {
      id: 11,
      name: "Bacardi Rum",
      category: "Rum",
      price: 1400,
      image: "🥃",
      description: "Premium white rum with smooth, light taste and subtle vanilla notes.",
      alcoholContent: "37.5%",
      volume: "750ml",
      origin: "Puerto Rico"
    },
    {
      id: 12,
      name: "Heineken Beer",
      category: "Beer",
      price: 240,
      image: "🍺",
      description: "Premium Dutch lager with balanced hop bitterness and clean finish.",
      alcoholContent: "5%",
      volume: "500ml",
      origin: "Netherlands"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'beer', label: 'Beer' },
    { value: 'whiskey', label: 'Whiskey' },
    { value: 'vodka', label: 'Vodka' },
    { value: 'wine', label: 'Wine' },
    { value: 'rum', label: 'Rum' }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    
    // Get category from URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover our premium selection of alcoholic beverages</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`category-filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredProducts.length} of {products.length} products
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card card">
              <div className="product-image" onClick={() => handleProductClick(product)}>
                <span className="product-icon">{product.image}</span>
                <div className="product-overlay">
                  <span className="view-details">View Details</span>
                </div>
              </div>
              
              <div className="product-info">
                <h3 className="product-name" onClick={() => handleProductClick(product)}>
                  {product.name}
                </h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="product-origin">{product.origin}</span>
                  <span className="product-volume">{product.volume}</span>
                </div>
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
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🍷</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSearchParams({});
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Products; 