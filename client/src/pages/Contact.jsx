import { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any questions or support</p>
      </div>

      <div className="contact-content">
        <div className="contact-info card">
          <h2>Get in Touch</h2>
          <p>We're here to help and answer any questions you might have. We look forward to hearing from you.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h3>Address</h3>
                <p>Thamel, Kathmandu<br />Nepal</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <h3>Email</h3>
                <p>info@drinkshub.com<br />support@drinkshub.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h3>Phone</h3>
                <p>+977-1-4444444<br />+977-9851234567</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">🕒</span>
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 8:00 PM<br />Saturday - Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container card">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter subject"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter your message"
                rows="6"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-content card">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-items">
            <div className="faq-item">
              <h3>What are your delivery areas?</h3>
              <p>We currently deliver to Kathmandu Valley and surrounding areas. Delivery charges may vary based on location.</p>
            </div>
            
            <div className="faq-item">
              <h3>What is your delivery time?</h3>
              <p>Standard delivery takes 2-4 hours within Kathmandu Valley. Express delivery (1-2 hours) is available for an additional fee.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you require age verification?</h3>
              <p>Yes, we strictly enforce age verification. You must be 18 or older to purchase alcoholic beverages.</p>
            </div>
            
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept cash on delivery, digital wallets (eSewa, Khalti), and bank transfers.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I return or exchange products?</h3>
              <p>Due to the nature of alcoholic beverages, we cannot accept returns or exchanges unless the product is damaged or defective.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you have a minimum order amount?</h3>
              <p>Yes, the minimum order amount is NPR 500 for delivery within Kathmandu Valley.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 