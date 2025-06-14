  import React, { useState, useEffect, useRef } from 'react';
import { Star, Globe, TrendingUp, Shield, Clock, CheckCircle, Zap, Award, Users, ArrowRight } from 'lucide-react';
import { Search,   AlertCircle, Loader } from 'react-feather';
 import { useNavigate } from 'react-router-dom';

const DomainSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(new Set());

  // console.log('Component State:', {
  //   searchTerm,
  //   isSearching,
  //   searchResults,
  //   error,
  //   registering: Array.from(registering)
  // });

  const handleSearch = async () => {
    console.log('Search initiated for:', searchTerm);
    
    if (!searchTerm.trim()) {
      console.warn('Empty search term');
      setError('Please enter a domain name');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);
    
    try {
      const sld = searchTerm.toLowerCase().replace(/\.[^/.]+$/, ''); // Remove any extension if user typed one
      const authToken = 'IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo'; // Using your default token
      
      console.log('Making API request for SLD:', sld);
      const startTime = performance.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const checkResponse = await fetch('https://www.vyaparkranti.com/laravel/api/domain/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ sld: sld }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = performance.now() - startTime;
      console.log(`API response received in ${responseTime.toFixed(2)}ms`, checkResponse);

      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        console.error('API error:', errorData);
        throw new Error(errorData.message || 'Domain check failed');
      }

      const result = await checkResponse.json();
      console.log('API success:', result);
      
      setSearchResults(result);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.name === 'AbortError' ? 
        'Request timed out. Please try again.' : 
        err.message || 'Failed to connect to server');
    } finally {
      setIsSearching(false);
    }
  };

  // new use effect
  useEffect(() => {
  const delay = setTimeout(() => {
    if (searchTerm.trim()) handleSearch();
  }, 1000); // Delay search 1s after user stops typing

  return () => clearTimeout(delay);
}, [searchTerm]);

  // new use 

  const handleRegister = async (domain, price) => {
    console.log('Registration initiated for:', domain);
    
    setRegistering(prev => new Set([...prev, domain]));
    setError(null);
    
    try {
      const authToken = 'IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo';

      console.log('Registering customer...');
      const customerResponse = await fetch('https://www.vyaparkranti.com/laravel/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: 'Customer Name',
          email: 'customer@example.com',
        })
      });

      if (!customerResponse.ok) {
        const errorData = await customerResponse.json();
        console.error('Customer registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }

      const customerData = await customerResponse.json();
      console.log('Customer registered:', customerData);

      console.log('Registering domain...');
      const domainResponse = await fetch('https://www.vyaparkranti.com/laravel/api/domain/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          domain: domain,
          customer_id: customerData.id,
        })
      });

      if (!domainResponse.ok) {
        const errorData = await domainResponse.json();
        console.error('Domain registration failed:', errorData);
        throw new Error(errorData.message || 'Domain registration failed');
      }

      const domainData = await domainResponse.json();
      console.log('Domain registered:', domainData);
      
      // Update the specific domain as registered
      setSearchResults(prev => ({
        ...prev,
        results: prev.results.map(result => 
          result.domain === domain 
            ? { ...result, registered: true }
            : result
        )
      }));
      
      alert(`Domain ${domain} registered successfully!`);
    } catch (err) {
      console.error('Registration error:', err);
      setError(`Registration failed for ${domain}: ${err.message}`);
    } finally {
      setRegistering(prev => {
        const newSet = new Set(prev);
        newSet.delete(domain);
        return newSet;
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="domain-search-container">
      <div className="search-box">
        <h2>Find Your Perfect Domain</h2>
        <p className="subtitle">Search for available domains and secure your online presence</p>
        
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setError(null);
            }}
            placeholder="Enter your domain name (e.g., mywebsite)"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="domain-input"
          />
          <button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="search-button"
          >
            {isSearching ? (
              <>
                <Loader className="spin" size={18} />
                Searching...
              </>
            ) : (
              <>
                <Search size={18} />
                Search
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {searchResults && (
        <div className="results-container">
          <h3 className="results-title">
            Domain availability for "{searchTerm}"
          </h3>
          
          <div className="results-grid">
            {searchResults.results?.map((result) => (
              <div 
                key={result.domain} 
                className={`domain-card ${result.available ? 'available' : 'unavailable'}`}
              >
                <div className="domain-header">
                  <Globe size={20} />
                  <span className="domain-name">{result.domain}</span>
                  <span className={`status-badge ${result.available ? 'success' : 'error'}`}>
                    {result.available ? 'Available' : 'Taken'}
                  </span>
                </div>

                {result.available ? (
                  <div className="available-content">
                    <div className="price-info">
                      <span className="price">{formatPrice(result.price)}</span>
                      <span className="price-period">/year</span>
                    </div>
                    
                    <button 
                      onClick={() => handleRegister(result.domain, result.price)}
                      disabled={registering.has(result.domain) || result.registered}
                      className="register-button"
                    >
                      {result.registered ? (
                        <>
                          <CheckCircle size={16} />
                          Registered
                        </>
                      ) : registering.has(result.domain) ? (
                        <>
                          <Loader className="spin" size={16} />
                          Registering...
                        </>
                      ) : (
                        <>
                          {/* <ShoppingCart size={16} /> */}
                          Register Now
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="unavailable-content">
                    <p>This domain is already registered</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .domain-search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .search-box {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          margin-bottom: 2rem;
          text-align: center;
        }
        
        h2 {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
          font-weight: 700;
        }
        
        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .search-input-group {
          display: flex;
          max-width: 500px;
          margin: 0 auto;
          gap: 0.5rem;
        }
        
        .domain-input {
          flex: 1;
          padding: 1rem 1.2rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }
        
        .domain-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .search-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .search-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        
        .search-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #ef4444;
          margin-top: 1rem;
          font-size: 0.9rem;
          background: #fef2f2;
          padding: 0.75rem;
          border-radius: 8px;
        }
        
        .results-container {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        
        .results-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.4rem;
          color: #1a1a1a;
          text-align: center;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .domain-card {
          border: 2px solid #f3f4f6;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s;
        }
        
        .domain-card.available {
          border-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4, #ffffff);
        }
        
        .domain-card.unavailable {
          border-color: #e5e7eb;
          background: #f9fafb;
        }
        
        .domain-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        
        .domain-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .domain-name {
          font-weight: 600;
          font-size: 1.1rem;
          flex: 1;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-badge.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        
        .available-content {
          text-align: center;
        }
        
        .price-info {
          margin-bottom: 1rem;
        }
        
        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .price-period {
          color: #666;
          font-size: 0.9rem;
          margin-left: 0.25rem;
        }
        
        .register-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .register-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .unavailable-content {
          text-align: center;
          color: #666;
        }
        
        .unavailable-content p {
          margin: 0;
          font-size: 0.9rem;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .domain-search-container {
            padding: 1rem;
          }
          
          .search-box {
            padding: 1.5rem;
          }
          
          h2 {
            font-size: 1.8rem;
          }
          
          .search-input-group {
            flex-direction: column;
            max-width: none;
          }
          
          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

 


const CountdownTimer = ({ timeLeft }) => (
  <div className="countdown-container">
    <div className="small text-uppercase text-muted mb-2 fw-semibold">⏰ Offer Expires In:</div>
    <div className="d-flex justify-content-center gap-2 flex-wrap">
      {Object.entries(timeLeft).map(([unit, value], i) => (
        <div key={i} className="countdown-box">
          <div className="countdown-number">{value}</div>
          <div className="countdown-label">{unit}</div>
        </div>
      ))}
    </div>
  </div>
);

const FeatureCard = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      ref={cardRef}
      className={`col-6 col-md-6 col-lg-3 mb-3 mb-lg-0 feature-card ${isVisible ? 'visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card h-100 border-0 shadow-sm feature-card-inner">
        <div className="card-body text-center p-3 p-md-4">
          <div className="feature-icon mb-3">{feature.icon}</div>
          <h6 className="card-title fw-bold mb-2">{feature.title}</h6>
          <p className="card-text text-muted small">{feature.desc}</p>
        </div>
      </div>
    </div>
  );
};

const Domain = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);

    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    { icon: <Globe size={24} className="text-primary" />, title: "Premium .com", desc: "Most trusted domain extension" },
    { icon: <TrendingUp size={24} className="text-success" />, title: "High SEO Value", desc: "Boost search rankings" },
    { icon: <Shield size={24} className="text-info" />, title: "Secure Transfer", desc: "Protected transfer process" },
    { icon: <Clock size={24} className="text-warning" />, title: "Instant Setup", desc: "Ready to use immediately" }
  ];

  const benefits = [
    { icon: <Zap size={32} className="text-warning" />, title: "Instant Recognition", desc: "Memorable and brandable domain name" },
    { icon: <Award size={32} className="text-success" />, title: "Premium Quality", desc: "Carefully selected domain portfolio" },
    { icon: <Users size={32} className="text-info" />, title: "Trust & Credibility", desc: "Build customer confidence" }
  ];

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/package-page');  
  };

  return (
    <>
      <style jsx>{`
        // @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        // * {
        //   font-family: 'Inter', sans-serif;
        // }
        
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.1;
        }
        
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(10px);
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-orb:nth-child(1) {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-orb:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }
        
        .floating-orb:nth-child(3) {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 70%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .domain-heading {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
          animation: glow 2s ease-in-out infinite alternate;
          font-size: 2rem;
           
        }
        
        @keyframes glow {
          from { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
          to { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); }
        }
        
        .price-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(0);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .price-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .countdown-container {
          text-align: center;
        }
        
        .countdown-box {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          color: white;
          border-radius: 12px;
          padding: 8px 12px;
          min-width: 60px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .countdown-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .countdown-number {
          font-weight: 700;
          font-size: 1.2rem;
          line-height: 1;
        }
        
        .countdown-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          opacity: 0.8;
          margin-top: 2px;
        }
        
        .btn-primary-custom {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: none;
          color: #1a1a1a;
          font-weight: 600;
          padding: 12px 30px;
          border-radius: 50px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .btn-primary-custom:hover::before {
          left: 100%;
        }
        
        .btn-primary-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
        }
        
        .btn-outline-custom {
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 12px 30px;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        
        .btn-outline-custom:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.8);
          color: white;
          transform: translateY(-3px);
        }
        
        .feature-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .feature-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .feature-card-inner {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }
        
        .feature-card-inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .feature-card-inner:hover::before {
          transform: scaleX(1);
        }
        
        .feature-card-inner:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          transition: all 0.3s ease;
        }
        
        .feature-card-inner:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .benefit-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .benefit-card:hover::before {
          opacity: 1;
        }
        
        .benefit-card:hover {
          transform: translateY(-10px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .search-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
        }
        
        .search-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .sec-title {
          position: relative;
        }
        
        .sec-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 2px;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 40px;
        }
        
        @media (max-width: 768px) {
          .domain-heading {
            font-size: 1.5rem !important;
          }
          
          .countdown-box {
            min-width: 50px;
            padding: 6px 10px;
          }
          
          .countdown-number {
            font-size: 1rem;
          }
          
          .countdown-label {
            font-size: 0.6rem;
          }
          
          .btn-primary-custom, .btn-outline-custom {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
          
          .glass-card {
            padding: 20px;
          }
          
          .floating-orb {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .countdown-container {
            margin-top: 1rem;
          }
          
          .feature-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>

       

      <section>
        {/* Header Section */}
        {/* <div className="sec-title text-center py-5"> */}
          {/* <div className="title text-muted mb-2">Domain</div>
          <h2 className="fw-bold mb-3">Our Premium Domain Collection</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            We take a consultative approach to every client engagement and find actionable
            solutions that help your organization achieve the best outcomes.
          </p> */}

           <div className="sec-title centered">
                    <div className="title">Domain</div>
                    <h2>Our Premium Domain Collection</h2>
                    <div className="text"> We take a consultative approach to every client engagement and find actionable
            solutions that help your organization achieve the best outcomes.</div>
                    </div>
        {/* </div> */}


      {/* Domain Search Section */}
        <div className="bg-light py-5">
          <DomainSearch />
        </div>
        {/* Hero Section */}
        <div className="hero-section">
          <div className="floating-orb"></div>
          <div className="floating-orb"></div>
          <div className="floating-orb"></div>
          
          <div className="container position-relative py-5">
            <div className={`row align-items-center min-vh-100 fade-in-up ${isVisible ? 'visible' : ''}`}>
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="text-white">
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-4 fw-semibold">
                    🔥 Premium Domain Available - Limited Time
                  </span>
                  
                  <h1 className="domain-heading display-4 fw-bold mb-4">
                    YourDream<span className="text-warning">Domain</span>.com
                  </h1>

                  <p className="lead mb-4 text-light">
                    Secure this premium, brandable domain name that will elevate your business to new heights.
                    Perfect for startups, enterprises, and innovative companies looking to make their mark.
                  </p>

                  <div className="price-card rounded-4 p-4 mb-4">
                    <div className="row align-items-center">
                      <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        {/* <div className="text-decoration-line-through text-muted fs-5 mb-1">₹25,000</div> */}
                        <div className="display-5 fw-bold text-warning mb-1" style={{fontSize: '2rem'}}>Starting at ₹349</div>
                        <div className="small text-success fw-semibold">💰 Limited Time Offer!</div>

                      </div>
                      <div className="col-md-6">
                        <CountdownTimer timeLeft={timeLeft} />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 flex-column flex-sm-row">
                    <button
                    className="btn btn-primary-custom btn-lg fw-semibold position-relative"
                    onClick={handleClick}
                  >
                    🚀 Buy Now 
                    <ArrowRight className="ms-2" size={20} />
                  </button>
                    {/* <button className="btn btn-outline-custom btn-lg">
                      💬 Make an Offer
                    </button> */}
                  </div>

                  <div className="mt-4 d-flex align-items-center gap-3 flex-wrap">
                    <div className="d-flex align-items-center text-light">
                      <CheckCircle className="text-success me-2" size={16} />
                      <small>Instant Transfer</small>
                    </div>
                    <div className="d-flex align-items-center text-light">
                      <Shield className="text-info me-2" size={16} />
                      <small>Secure Payment</small>
                    </div>
                    <div className="d-flex align-items-center text-light">
                      <Award className="text-warning me-2" size={16} />
                      <small>Premium Quality</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="glass-card text-center">
                  <Globe size={80} className="mb-4 text-primary" style={{ 
                    filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.5))',
                    animation: 'float 3s ease-in-out infinite'
                  }} />
                  <h3 className="fw-bold mb-4">Why This Domain?</h3>
                  
                  <div className="row g-3">
                    {[
                      { icon: <CheckCircle size={20} className="text-success" />, label: "Brandable", color: "success" },
                      { icon: <Star size={20} className="text-warning" />, label: "Memorable", color: "warning" },
                      { icon: <TrendingUp size={20} className="text-primary" />, label: "SEO Ready", color: "primary" },
                      { icon: <Shield size={20} className="text-info" />, label: "Secure", color: "info" }
                    ].map((item, i) => (
                      <div key={i} className="col-6">
                        <div className={`bg-${item.color} bg-opacity-10 rounded-3 p-3 h-100 d-flex flex-column align-items-center justify-content-center`}
                             style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                             onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                             onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                          <div className="mb-2">{item.icon}</div>
                          <div className="small fw-semibold">{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-top">
                    <div className="row text-center">
                      {benefits.map((benefit, i) => (
                        <div key={i} className="col-4">
                          <div className="mb-2">{benefit.icon}</div>
                          <div className="small fw-semibold">{benefit.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Search Section */}
        {/* <div className="bg-light py-5">
          <DomainSearch />
        </div> */}

        {/* Features Section */}
        <div className="bg-white py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-3">Why Choose This Domain?</h2>
              <p className="text-muted fs-5">Premium domains are digital real estate that appreciate over time and provide lasting value.</p>
            </div>

            <div className="row g-4">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>

            <div className="text-center mt-5">
              <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill">
                🚀 Secure This Domain Now
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* <DomainSearch /> */}
    </>
  );
};

export default Domain;