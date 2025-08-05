import { useState } from 'react';
import '../styles/AgeVerification.css';

const AgeVerification = ({ onVerify }) => {
  const [showForm, setShowForm] = useState(false);
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (verified) => {
    if (verified) {
      onVerify(true);
    } else {
      // Redirect to a safe site or show message
      window.location.href = 'https://www.google.com';
    }
  };

  const handleAgeSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    
    if (isNaN(ageNum) || ageNum < 0) {
      setError('Please enter a valid age');
      return;
    }
    
    if (ageNum >= 18) {
      onVerify(true);
    } else {
      setError('You must be 18 or older to access this site');
      setTimeout(() => {
        window.location.href = 'https://www.google.com';
      }, 3000);
    }
  };

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-modal fade-in">
        <div className="age-verification-content">
          <div className="age-verification-header">
            <h1 className="age-verification-title">🍷 Drinkshub</h1>
            <div className="age-verification-subtitle">
              Premium Liquor Store
            </div>
          </div>

          <div className="age-verification-body">
            <div className="age-icon">🍺</div>
            <h2>Age Verification Required</h2>
            <p>
              You must be 18 years or older to access this website. 
              By entering this site, you confirm that you are of legal drinking age.
            </p>

            {!showForm ? (
              <div className="age-verification-buttons">
                <button 
                  className="btn btn-primary age-btn"
                  onClick={() => setShowForm(true)}
                >
                  I am 18 or older
                </button>
                <button 
                  className="btn btn-secondary age-btn"
                  onClick={() => handleVerify(false)}
                >
                  I am under 18
                </button>
              </div>
            ) : (
              <form onSubmit={handleAgeSubmit} className="age-form">
                <div className="form-group">
                  <label htmlFor="age" className="form-label">
                    Please enter your age:
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="form-input"
                    placeholder="Enter your age"
                    min="0"
                    max="120"
                    required
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>
                <div className="age-form-buttons">
                  <button type="submit" className="btn btn-primary">
                    Verify Age
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="age-verification-footer">
            <p className="legal-notice">
              By accessing this site, you agree to our Terms of Service and Privacy Policy. 
              Please drink responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification; 