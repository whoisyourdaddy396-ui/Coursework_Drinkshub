import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beer',
    price: '',
    description: '',
    alcoholContent: '',
    volume: '',
    origin: ''
  });

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Nepal Ice Beer",
      category: "Beer",
      price: 180,
      description: "Premium Nepali beer with smooth taste",
      alcoholContent: "5%",
      volume: "650ml",
      origin: "Nepal"
    },
    {
      id: 2,
      name: "Khukuri Rum",
      category: "Rum",
      price: 850,
      description: "Traditional Nepali rum with rich flavor",
      alcoholContent: "40%",
      volume: "750ml",
      origin: "Nepal"
    }
  ];

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login');
      return;
    }
    setProducts(mockProducts);
  }, [user, isAdmin, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseInt(formData.price),
      image: getCategoryIcon(formData.category)
    };
    setProducts([...products, newProduct]);
    setFormData({
      name: '',
      category: 'Beer',
      price: '',
      description: '',
      alcoholContent: '',
      volume: '',
      origin: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Beer': '🍺',
      'Whiskey': '🥃',
      'Vodka': '🍸',
      'Wine': '🍷',
      'Rum': '🥃'
    };
    return icons[category] || '🍷';
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Welcome back, {user.name}</p>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card card">
            <h3>Total Products</h3>
            <span className="stat-number">{products.length}</span>
          </div>
          <div className="stat-card card">
            <h3>Categories</h3>
            <span className="stat-number">{new Set(products.map(p => p.category)).size}</span>
          </div>
          <div className="stat-card card">
            <h3>Total Value</h3>
            <span className="stat-number">NPR {products.reduce((sum, p) => sum + p.price, 0)}</span>
          </div>
        </div>

        <div className="admin-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Product
          </button>
        </div>

        {showAddForm && (
          <div className="add-product-form card">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="Beer">Beer</option>
                    <option value="Whiskey">Whiskey</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Wine">Wine</option>
                    <option value="Rum">Rum</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">Price (NPR)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="origin" className="form-label">Origin</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="volume" className="form-label">Volume</label>
                  <input
                    type="text"
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 750ml"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="alcoholContent" className="form-label">Alcohol Content</label>
                  <input
                    type="text"
                    id="alcoholContent"
                    name="alcoholContent"
                    value={formData.alcoholContent}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 40%"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-table card">
          <h2>Manage Products</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Origin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <span className="product-icon">{getCategoryIcon(product.category)}</span>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>NPR {product.price}</td>
                    <td>{product.origin}</td>
                    <td>
                      <button 
                        className="btn btn-danger delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 