// import React, { useState, useEffect, useRef } from 'react';
// import { Star, Globe, TrendingUp, Shield, Clock, CheckCircle, Zap, Award, Users, ArrowRight } from 'lucide-react';
// import { Search,   AlertCircle, Loader } from 'react-feather';
//  import { useNavigate } from 'react-router-dom';

// const DomainSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchResults, setSearchResults] = useState(null);
//   const [error, setError] = useState(null);
//   const [registering, setRegistering] = useState(new Set());

//   const handleSearch = async () => {
//     console.log('Search initiated for:', searchTerm);

//     if (!searchTerm.trim()) {
//       console.warn('Empty search term');
//       setError('Please enter a domain name');
//       return;
//     }

//     setIsSearching(true);
//     setError(null);
//     setSearchResults(null);

//     try {
//       const sld = searchTerm.toLowerCase().replace(/\.[^/.]+$/, ''); // Remove any extension if user typed one
//       const authToken = 'IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo'; // Using your default token

//       console.log('Making API request for SLD:', sld);
//       const startTime = performance.now();

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 15000);

//       const checkResponse = await fetch('https://www.vyaparkranti.com/laravel/api/domain/check', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({ sld: sld }),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);
//       const responseTime = performance.now() - startTime;
//       console.log(`API response received in ${responseTime.toFixed(2)}ms`, checkResponse);

//       if (!checkResponse.ok) {
//         const errorData = await checkResponse.json();
//         console.error('API error:', errorData);
//         throw new Error(errorData.message || 'Domain check failed');
//       }

//       const result = await checkResponse.json();
//       console.log('API success:', result);

//       setSearchResults(result);
//     } catch (err) {
//       console.error('Search error:', err);
//       setError(err.name === 'AbortError' ?
//         'Request timed out. Please try again.' :
//         err.message || 'Failed to connect to server');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleRegister = async (domain, price) => {
//     console.log('Registration initiated for:', domain);

//     setRegistering(prev => new Set([...prev, domain]));
//     setError(null);

//     try {
//       const authToken = 'IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo';

//       console.log('Registering customer...');
//       const customerResponse = await fetch('https://www.vyaparkranti.com/laravel/api/customer/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           name: 'Customer Name',
//           email: 'customer@example.com',
//         })
//       });

//       if (!customerResponse.ok) {
//         const errorData = await customerResponse.json();
//         console.error('Customer registration failed:', errorData);
//         throw new Error(errorData.message || 'Registration failed');
//       }

//       const customerData = await customerResponse.json();
//       console.log('Customer registered:', customerData);

//       console.log('Registering domain...');
//       const domainResponse = await fetch('https://www.vyaparkranti.com/laravel/api/domain/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           domain: domain,
//           customer_id: customerData.id,
//         })
//       });

//       if (!domainResponse.ok) {
//         const errorData = await domainResponse.json();
//         console.error('Domain registration failed:', errorData);
//         throw new Error(errorData.message || 'Domain registration failed');
//       }

//       const domainData = await domainResponse.json();
//       console.log('Domain registered:', domainData);

//       // Update the specific domain as registered
//       setSearchResults(prev => ({
//         ...prev,
//         results: prev.results.map(result =>
//           result.domain === domain
//             ? { ...result, registered: true }
//             : result
//         )
//       }));

//       alert(`Domain ${domain} registered successfully!`);
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError(`Registration failed for ${domain}: ${err.message}`);
//     } finally {
//       setRegistering(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(domain);
//         return newSet;
//       });
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(price);
//   };

//   return (
//     <div className="domain-search-container">
//       <div className="search-box">
//         <h2>Find Your Perfect Domain</h2>
//         <p className="subtitle">Search for available domains and secure your online presence</p>

//         <div className="search-input-group">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setError(null);
//             }}
//             placeholder="Enter your domain name (e.g., mywebsite)"
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             className="domain-input"
//           />
//           <button
//             onClick={handleSearch}
//             disabled={isSearching}
//             className="search-button"
//           >
//             {isSearching ? (
//               <>
//                 <Loader className="spin" size={18} />
//                 Searching...
//               </>
//             ) : (
//               <>
//                 <Search size={18} />
//                 Search
//               </>
//             )}
//           </button>
//         </div>

//         {error && (
//           <div className="error-message">
//             <AlertCircle size={16} />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>

//       {searchResults && (
//         <div className="results-container">
//           <h3 className="results-title">
//             Domain availability for "{searchTerm}"
//           </h3>

//           <div className="results-grid">
//             {searchResults.results?.map((result) => (
//               <div
//                 key={result.domain}
//                 className={`domain-card ${result.available ? 'available' : 'unavailable'}`}
//               >
//                 <div className="domain-header">
//                   <Globe size={20} />
//                   <span className="domain-name">{result.domain}</span>
//                   <span className={`status-badge ${result.available ? 'success' : 'error'}`}>
//                     {result.available ? 'Available' : 'Taken'}
//                   </span>
//                 </div>

//                 {result.available ? (
//                   <div className="available-content">
//                     <div className="price-info">
//                       <span className="price">{formatPrice(result.price)}</span>
//                       <span className="price-period">/year</span>
//                     </div>

//                     <button
//                       onClick={() => handleRegister(result.domain, result.price)}
//                       disabled={registering.has(result.domain) || result.registered}
//                       className="register-button"
//                     >
//                       {result.registered ? (
//                         <>
//                           <CheckCircle size={16} />
//                           Registered
//                         </>
//                       ) : registering.has(result.domain) ? (
//                         <>
//                           <Loader className="spin" size={16} />
//                           Registering...
//                         </>
//                       ) : (
//                         <>
//                           {/* <ShoppingCart size={16} /> */}
//                           Register Now
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="unavailable-content">
//                     <p>This domain is already registered</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .domain-search-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 2rem;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }

//         .search-box {
//           background: white;
//           border-radius: 16px;
//           padding: 2.5rem;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.08);
//           margin-bottom: 2rem;
//           text-align: center;
//         }

//         h2 {
//           font-size: 2.2rem;
//           margin-bottom: 0.5rem;
//           color: #1a1a1a;
//           font-weight: 700;
//         }

//         .subtitle {
//           color: #666;
//           margin-bottom: 2rem;
//           font-size: 1.1rem;
//         }

//         .search-input-group {
//           display: flex;
//           max-width: 500px;
//           margin: 0 auto;
//           gap: 0.5rem;
//         }

//         .domain-input {
//           flex: 1;
//           padding: 1rem 1.2rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 12px;
//           font-size: 1rem;
//           outline: none;
//           transition: all 0.2s;
//         }

//         .domain-input:focus {
//           border-color: #6366f1;
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
//         }

//         .search-button {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 1rem 1.5rem;
//           background: linear-gradient(135deg, #6366f1, #8b5cf6);
//           color: white;
//           border: none;
//           border-radius: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//           white-space: nowrap;
//         }

//         .search-button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
//         }

//         .search-button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .error-message {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           color: #ef4444;
//           margin-top: 1rem;
//           font-size: 0.9rem;
//           background: #fef2f2;
//           padding: 0.75rem;
//           border-radius: 8px;
//         }

//         .results-container {
//           background: white;
//           border-radius: 16px;
//           padding: 2rem;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.08);
//         }

//         .results-title {
//           margin: 0 0 1.5rem 0;
//           font-size: 1.4rem;
//           color: #1a1a1a;
//           text-align: center;
//         }

//         .results-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 1rem;
//         }

//         .domain-card {
//           border: 2px solid #f3f4f6;
//           border-radius: 12px;
//           padding: 1.5rem;
//           transition: all 0.2s;
//         }

//         .domain-card.available {
//           border-color: #10b981;
//           background: linear-gradient(135deg, #f0fdf4, #ffffff);
//         }

//         .domain-card.unavailable {
//           border-color: #e5e7eb;
//           background: #f9fafb;
//         }

//         .domain-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 16px rgba(0,0,0,0.1);
//         }

//         .domain-header {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           margin-bottom: 1rem;
//         }

//         .domain-name {
//           font-weight: 600;
//           font-size: 1.1rem;
//           flex: 1;
//         }

//         .status-badge {
//           padding: 0.25rem 0.75rem;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//           text-transform: uppercase;
//         }

//         .status-badge.success {
//           background: #d1fae5;
//           color: #065f46;
//         }

//         .status-badge.error {
//           background: #fee2e2;
//           color: #b91c1c;
//         }

//         .available-content {
//           text-align: center;
//         }

//         .price-info {
//           margin-bottom: 1rem;
//         }

//         .price {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #1a1a1a;
//         }

//         .price-period {
//           color: #666;
//           font-size: 0.9rem;
//           margin-left: 0.25rem;
//         }

//         .register-button {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           width: 100%;
//           padding: 0.8rem;
//           background: linear-gradient(135deg, #10b981, #059669);
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .register-button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
//         }

//         .register-button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .unavailable-content {
//           text-align: center;
//           color: #666;
//         }

//         .unavailable-content p {
//           margin: 0;
//           font-size: 0.9rem;
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         @media (max-width: 768px) {
//           .domain-search-container {
//             padding: 1rem;
//           }

//           .search-box {
//             padding: 1.5rem;
//           }

//           h2 {
//             font-size: 1.8rem;
//           }

//           .search-input-group {
//             flex-direction: column;
//             max-width: none;
//           }

//           .results-grid {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DomainSearch;

// import React, { useState, useEffect, useRef } from 'react';
// import { Star, Globe, TrendingUp, Shield, Clock, CheckCircle, Zap, Award, Users, ArrowRight, X, User, Phone, Mail, MapPin } from 'lucide-react';
// import { Search, AlertCircle, Loader } from 'react-feather';

// const DomainSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchResults, setSearchResults] = useState(null);
//   const [error, setError] = useState(null);
//   const [registering, setRegistering] = useState(new Set());
//   const [showRegistrationModal, setShowRegistrationModal] = useState(false);
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: ''
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const handleSearch = async () => {
//     console.log('Search initiated for:', searchTerm);

//     if (!searchTerm.trim()) {
//       console.warn('Empty search term');
//       setError('Please enter a domain name');
//       return;
//     }

//     setIsSearching(true);
//     setError(null);
//     setSearchResults(null);

//     try {
//       const sld = searchTerm.toLowerCase().replace(/\.[^/.]+$/, ''); // Remove any extension if user typed one
//       const authToken = 'IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo'; // Using your default token

//       console.log('Making API request for SLD:', sld);
//       const startTime = performance.now();

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 15000);

//       const checkResponse = await fetch('https://www.vyaparkranti.com/laravel/api/domain/check', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({ sld: sld }),
//         signal: controller.signal
//       });

//       clearTimeout(timeoutId);
//       const responseTime = performance.now() - startTime;
//       console.log(`API response received in ${responseTime.toFixed(2)}ms`, checkResponse);

//       if (!checkResponse.ok) {
//         const errorData = await checkResponse.json();
//         console.error('API error:', errorData);
//         throw new Error(errorData.message || 'Domain check failed');
//       }

//       const result = await checkResponse.json();
//       console.log('API success:', result);

//       setSearchResults(result);
//     } catch (err) {
//       console.error('Search error:', err);
//       setError(err.name === 'AbortError' ?
//         'Request timed out. Please try again.' :
//         err.message || 'Failed to connect to server');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleRegisterClick = (domain, price) => {
//     setSelectedDomain({ domain, price });
//     setShowRegistrationModal(true);
//     setFormData({ name: '', phone: '', email: '', address: '' });
//     setFormErrors({});
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required';
//     } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
//       errors.phone = 'Please enter a valid 10-digit phone number';
//     }

//     if (!formData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }

//     if (!formData.address.trim()) {
//       errors.address = 'Address is required';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleFormSubmit = async () => {

//     if (!validateForm()) {
//       return;
//     }

//     console.log('Registration initiated for:', selectedDomain.domain);

//     setRegistering(prev => new Set([...prev, selectedDomain.domain]));
//     setError(null);

//     try {
//       const authToken = 'IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo';

//       console.log('Registering customer...');
//       const customerResponse = await fetch('https://www.vyaparkranti.com/laravel/api/customer/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address
//         })
//       });

//       if (!customerResponse.ok) {
//         const errorData = await customerResponse.json();
//         console.error('Customer registration failed:', errorData);
//         throw new Error(errorData.message || 'Registration failed');
//       }

//       const customerData = await customerResponse.json();
//       console.log('Customer registered:', customerData);

//       // Close the modal
//       setShowRegistrationModal(false);

//       // Navigate to payment page with domain and customer details
//       // Since we don't have useNavigate in this environment, we'll simulate navigation
//       const paymentData = {
//         domain: selectedDomain.domain,
//         price: selectedDomain.price,
//         customer: customerData,
//         customerDetails: formData
//       };

//       console.log('Navigating to payment page with data:', paymentData);

//       // In a real app, you would use:
//       // navigate('/payment', { state: paymentData });

//       // For demonstration, we'll show an alert
//       alert(`Proceeding to payment for ${selectedDomain.domain} - ₹${selectedDomain.price}`);

//     } catch (err) {
//       console.error('Registration error:', err);
//       setError(`Registration failed: ${err.message}`);
//     } finally {
//       setRegistering(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(selectedDomain.domain);
//         return newSet;
//       });
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (formErrors[field]) {
//       setFormErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(price);
//   };

//   return (
//     <div className="domain-search-container">
//       <div className="search-box">
//         <h2>Find Your Perfect Domain</h2>
//         <p className="subtitle">Search for available domains and secure your online presence</p>

//         <div className="search-input-group">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setError(null);
//             }}
//             placeholder="Enter your domain name (e.g., mywebsite)"
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             className="domain-input"
//           />
//           <button
//             onClick={handleSearch}
//             disabled={isSearching}
//             className="search-button"
//           >
//             {isSearching ? (
//               <>
//                 <Loader className="spin" size={18} />
//                 Searching...
//               </>
//             ) : (
//               <>
//                 <Search size={18} />
//                 Search
//               </>
//             )}
//           </button>
//         </div>

//         {error && (
//           <div className="error-message">
//             <AlertCircle size={16} />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>

//       {searchResults && (
//         <div className="results-container">
//           <h3 className="results-title">
//             Domain availability for "{searchTerm}"
//           </h3>

//           <div className="results-grid">
//             {searchResults.results?.map((result) => (
//               <div
//                 key={result.domain}
//                 className={`domain-card ${result.available ? 'available' : 'unavailable'}`}
//               >
//                 <div className="domain-header">
//                   <Globe size={20} />
//                   <span className="domain-name">{result.domain}</span>
//                   <span className={`status-badge ${result.available ? 'success' : 'error'}`}>
//                     {result.available ? 'Available' : 'Taken'}
//                   </span>
//                 </div>

//                 {result.available ? (
//                   <div className="available-content">
//                     <div className="price-info">
//                       <span className="price">{formatPrice(result.price)}</span>
//                       <span className="price-period">/year</span>
//                     </div>

//                     <button
//                       onClick={() => handleRegisterClick(result.domain, result.price)}
//                       disabled={registering.has(result.domain) || result.registered}
//                       className="register-button"
//                     >
//                       {result.registered ? (
//                         <>
//                           <CheckCircle size={16} />
//                           Registered
//                         </>
//                       ) : registering.has(result.domain) ? (
//                         <>
//                           <Loader className="spin" size={16} />
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           Register Now
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="unavailable-content">
//                     <p>This domain is already registered</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Registration Modal */}
//       {showRegistrationModal && (
//         <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Register Domain: {selectedDomain?.domain}</h3>
//               <button
//                 className="close-button"
//                 onClick={() => setShowRegistrationModal(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="registration-form">
//               <div className="form-group">
//                 <label htmlFor="name">
//                   <User size={16} />
//                   Full Name *
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   placeholder="Enter your full name"
//                   className={formErrors.name ? 'error' : ''}
//                 />
//                 {formErrors.name && <span className="field-error">{formErrors.name}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="phone">
//                   <Phone size={16} />
//                   Phone Number *
//                 </label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => handleInputChange('phone', e.target.value)}
//                   placeholder="Enter your phone number"
//                   className={formErrors.phone ? 'error' : ''}
//                 />
//                 {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">
//                   <Mail size={16} />
//                   Email Address *
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   placeholder="Enter your email address"
//                   className={formErrors.email ? 'error' : ''}
//                 />
//                 {formErrors.email && <span className="field-error">{formErrors.email}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="address">
//                   <MapPin size={16} />
//                   Address *
//                 </label>
//                 <textarea
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) => handleInputChange('address', e.target.value)}
//                   placeholder="Enter your complete address"
//                   rows="3"
//                   className={formErrors.address ? 'error' : ''}
//                 />
//                 {formErrors.address && <span className="field-error">{formErrors.address}</span>}
//               </div>

//               <div className="price-summary">
//                 <div className="price-row">
//                   <span>Domain: {selectedDomain?.domain}</span>
//                   <span className="price-amount">{formatPrice(selectedDomain?.price)}/year</span>
//                 </div>
//               </div>

//               <div className="form-actions">
//                 <button
//                   type="button"
//                   onClick={() => setShowRegistrationModal(false)}
//                   className="cancel-button"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleFormSubmit}
//                   className="submit-button"
//                   disabled={registering.has(selectedDomain?.domain)}
//                 >
//                   {registering.has(selectedDomain?.domain) ? (
//                     <>
//                       <Loader className="spin" size={16} />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       Proceed to Payment
//                       <ArrowRight size={16} />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .domain-search-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 2rem;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }

//         .search-box {
//           background: white;
//           border-radius: 16px;
//           padding: 2.5rem;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.08);
//           margin-bottom: 2rem;
//           text-align: center;
//         }

//         h2 {
//           font-size: 2.2rem;
//           margin-bottom: 0.5rem;
//           color: #1a1a1a;
//           font-weight: 700;
//         }

//         .subtitle {
//           color: #666;
//           margin-bottom: 2rem;
//           font-size: 1.1rem;
//         }

//         .search-input-group {
//           display: flex;
//           max-width: 500px;
//           margin: 0 auto;
//           gap: 0.5rem;
//         }

//         .domain-input {
//           flex: 1;
//           padding: 1rem 1.2rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 12px;
//           font-size: 1rem;
//           outline: none;
//           transition: all 0.2s;
//         }

//         .domain-input:focus {
//           border-color: #6366f1;
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
//         }

//         .search-button {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 1rem 1.5rem;
//           background: linear-gradient(135deg, #6366f1, #8b5cf6);
//           color: white;
//           border: none;
//           border-radius: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//           white-space: nowrap;
//         }

//         .search-button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
//         }

//         .search-button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .error-message {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           color: #ef4444;
//           margin-top: 1rem;
//           font-size: 0.9rem;
//           background: #fef2f2;
//           padding: 0.75rem;
//           border-radius: 8px;
//         }

//         .results-container {
//           background: white;
//           border-radius: 16px;
//           padding: 2rem;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.08);
//         }

//         .results-title {
//           margin: 0 0 1.5rem 0;
//           font-size: 1.4rem;
//           color: #1a1a1a;
//           text-align: center;
//         }

//         .results-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 1rem;
//         }

//         .domain-card {
//           border: 2px solid #f3f4f6;
//           border-radius: 12px;
//           padding: 1.5rem;
//           transition: all 0.2s;
//         }

//         .domain-card.available {
//           border-color: #10b981;
//           background: linear-gradient(135deg, #f0fdf4, #ffffff);
//         }

//         .domain-card.unavailable {
//           border-color: #e5e7eb;
//           background: #f9fafb;
//         }

//         .domain-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 16px rgba(0,0,0,0.1);
//         }

//         .domain-header {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           margin-bottom: 1rem;
//         }

//         .domain-name {
//           font-weight: 600;
//           font-size: 1.1rem;
//           flex: 1;
//         }

//         .status-badge {
//           padding: 0.25rem 0.75rem;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//           text-transform: uppercase;
//         }

//         .status-badge.success {
//           background: #d1fae5;
//           color: #065f46;
//         }

//         .status-badge.error {
//           background: #fee2e2;
//           color: #b91c1c;
//         }

//         .available-content {
//           text-align: center;
//         }

//         .price-info {
//           margin-bottom: 1rem;
//         }

//         .price {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #1a1a1a;
//         }

//         .price-period {
//           color: #666;
//           font-size: 0.9rem;
//           margin-left: 0.25rem;
//         }

//         .register-button {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           width: 100%;
//           padding: 0.8rem;
//           background: linear-gradient(135deg, #10b981, #059669);
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .register-button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
//         }

//         .register-button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .unavailable-content {
//           text-align: center;
//           color: #666;
//         }

//         .unavailable-content p {
//           margin: 0;
//           font-size: 0.9rem;
//         }

//         /* Modal Styles */
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           padding: 1rem;
//         }

//         .modal-content {
//           background: white;
//           border-radius: 16px;
//           width: 100%;
//           max-width: 500px;
//           max-height: 90vh;
//           overflow-y: auto;
//           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//         }

//         .modal-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 1.5rem 1.5rem 1rem 1.5rem;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .modal-header h3 {
//           margin: 0;
//           font-size: 1.2rem;
//           color: #1a1a1a;
//           font-weight: 600;
//         }

//         .close-button {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #666;
//           padding: 0.5rem;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s;
//         }

//         .close-button:hover {
//           background: #f3f4f6;
//           color: #1a1a1a;
//         }

//         .registration-form {
//           padding: 1.5rem;
//         }

//         .form-group {
//           margin-bottom: 1.5rem;
//         }

//         .form-group label {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-bottom: 0.5rem;
//           font-weight: 500;
//           color: #374151;
//           font-size: 0.9rem;
//         }

//         .form-group input,
//         .form-group textarea {
//           width: 100%;
//           padding: 0.75rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           font-size: 0.9rem;
//           outline: none;
//           transition: all 0.2s;
//           font-family: inherit;
//         }

//         .form-group input:focus,
//         .form-group textarea:focus {
//           border-color: #6366f1;
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
//         }

//         .form-group input.error,
//         .form-group textarea.error {
//           border-color: #ef4444;
//           box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
//         }

//         .field-error {
//           display: block;
//           color: #ef4444;
//           font-size: 0.8rem;
//           margin-top: 0.25rem;
//         }

//         .price-summary {
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 8px;
//           padding: 1rem;
//           margin-bottom: 1.5rem;
//         }

//         .price-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .price-amount {
//           font-weight: 600;
//           color: #059669;
//           font-size: 1.1rem;
//         }

//         .form-actions {
//           display: flex;
//           gap: 1rem;
//           justify-content: flex-end;
//         }

//         .cancel-button {
//           padding: 0.75rem 1.5rem;
//           background: #f3f4f6;
//           color: #374151;
//           border: none;
//           border-radius: 8px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .cancel-button:hover {
//           background: #e5e7eb;
//         }

//         .submit-button {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.75rem 1.5rem;
//           background: linear-gradient(135deg, #10b981, #059669);
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .submit-button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
//         }

//         .submit-button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .spin {
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         @media (max-width: 768px) {
//           .domain-search-container {
//             padding: 1rem;
//           }

//           .search-box {
//             padding: 1.5rem;
//           }

//           h2 {
//             font-size: 1.8rem;
//           }

//           .search-input-group {
//             flex-direction: column;
//             max-width: none;
//           }

//           .results-grid {
//             grid-template-columns: 1fr;
//           }

//           .modal-overlay {
//             padding: 0.5rem;
//           }

//           .form-actions {
//             flex-direction: column;
//           }

//           .cancel-button,
//           .submit-button {
//             width: 100%;
//             justify-content: center;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DomainSearch;

import React, { useEffect, useState } from "react";
import { Globe, X, User, Phone, Mail, MapPin, Shield } from "lucide-react";
import {
  Search,
  AlertCircle,
  Loader,
  CheckCircle,
  ArrowRight,
} from "react-feather";
import SignInModal from "../SignInSection/SignInModal";

const DomainSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(new Set());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    passwd: "",
    name: "",
    email: "",
    "address-line-1": "",
    city: "",
    state: "",
    country: "IN",
    zipcode: "",
    "phone-cc": "91",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [user, setUser] = useState(null); // set on login/signup
  const [signIn, setSignIn] = useState(false);
  const [triggerRegisterAfterAuth, setTriggerRegisterAfterAuth] = useState(null); // holds {domain, price}
 
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a domain name");
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);

    try {
      const sld = searchTerm.toLowerCase().replace(/\.[^/.]+$/, "");
      const authToken = "IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const checkResponse = await fetch(
        "https://www.vyaparkranti.com/laravel/api/domain/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ sld: sld }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        throw new Error(errorData.message || "Domain check failed");
      }

      const result = await checkResponse.json();
      setSearchResults(result);
    } catch (err) {
      setError(
        err.name === "AbortError"
          ? "Request timed out. Please try again."
          : err.message || "Failed to connect to server"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSignedUSer = () => {
    setSignIn(true);
  };

  const handleRegisterClick = (domain, price, name, email) => {
    console.log(name, email, "emailll");
    setSelectedDomain({ domain, price });
    setShowRegistrationModal(true);
    setFormData({
      username: "",
      name: name,
      email: email,
      "address-line-1": "",
      city: "",
      state: "",
      country: "IN",
      zipcode: "",
      "phone-cc": "91",
      phone: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    // if (!formData.name.trim()) {
    //   errors.name = 'Full name is required';
    // }

    // if (!formData.email.trim()) {
    //   errors.email = 'Email is required';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   errors.email = 'Please enter a valid email address';
    // }

    if (!formData["address-line-1"].trim()) {
      errors["address-line-1"] = "Address line is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.zipcode.trim()) {
      errors.zipcode = "Zipcode is required";
    } else if (!/^\d{6}$/.test(formData.zipcode)) {
      errors.zipcode = "Please enter a valid 6-digit zipcode";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setRegistering((prev) => new Set([...prev, selectedDomain.domain]));
    setError(null);

    try {
      const authToken = "IKe6WPxUtPR0U08HVHxitOdtk1aA0Heo";

      const customerResponse = await fetch(
        "https://www.vyaparkranti.com/laravel/api/customer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            username: formData.username,
            passwd: formData.passwd,
            name: formData.name,
            email: formData.email,
            "address-line-1": formData["address-line-1"],
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipcode: formData.zipcode,
            "phone-cc": formData["phone-cc"],
            phone: formData.phone,
          }),
        }
      );

      if (!customerResponse.ok) {
        const errorData = await customerResponse.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const customerData = await customerResponse.json();
      setShowRegistrationModal(false);

      const paymentData = {
        domain: selectedDomain.domain,
        price: selectedDomain.price,
        customer: customerData,
        customerDetails: formData,
      };

      alert(
        `Proceeding to payment for ${selectedDomain.domain} - ₹${selectedDomain.price}`
      );
    } catch (err) {
      setError(`Registration failed: ${err.message}`);
    } finally {
      setRegistering((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedDomain.domain);
        return newSet;
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };
  console.log(signIn, "sign");

  return (
    <div className="domain-search-container">
      <div className="search-box">

        <h2>Find Your Perfect Domain</h2>
        <p className="subtitle">
          Search for available domains and secure your online presence
        </p>

        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setError(null);
            }}
            placeholder="Enter your domain name (e.g., mywebsite)"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                className={`domain-card ${
                  result.available ? "available" : "unavailable"
                }`}
              >
                <div className="domain-header">
                  <Globe size={20} />
                  <span className="domain-name">{result.domain}</span>
                  <span
                    className={`status-badge ${
                      result.available ? "success" : "error"
                    }`}
                  >
                    {result.available ? "Available" : "Taken"}
                  </span>
                </div>

                {result.available ? (
                  <div className="available-content">
                    <div className="price-info">
                      <span className="price">{formatPrice(result.price)}</span>
                      <span className="price-period">/year</span>
                    </div>

                    {/* <button 
                      onClick={() => handleSignedUSer(result.domain, result.price)}
                      className="register-button"
                    > */}
                    {/* <button 
                      onClick={() => handleRegisterClick(result.domain, result.price)}
                      disabled={registering.has(result.domain) || result.registered}
                      className="register-button"
                    > */}
                    {/* {
                        signIn && <SignInModal signIn={signIn}/>
                      } */}
                    {/* {result.registered ? (
                        <>
                          <CheckCircle size={16} />
                          Registered
                        </>
                      ) : registering.has(result.domain) ? (
                        <>
                          <Loader className="spin" size={16} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Register Now
                        </>
                      )}
                    </button> */}

                    <button
                      onClick={() => {
                        if (!user) {
                          setTriggerRegisterAfterAuth({
                            domain: result.domain,
                            price: result.price,
                          });
                          setSignIn(true);
                        } else {
                          handleSignedUSer(result.domain, result.price);
                        }
                      }}
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
                          Processing...
                        </>
                      ) : (
                        <>Register Now</>
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

      {signIn && (
        <SignInModal
          signIn={signIn}
          onClose={() => setSignIn(false)}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setSignIn(false);
            // handleRegisterClick("jahsjd",678,loggedInUser.name,loggedInUser.email);
            if (triggerRegisterAfterAuth) {
              handleRegisterClick(
                triggerRegisterAfterAuth.domain,
                triggerRegisterAfterAuth.price,
                loggedInUser.name,
                loggedInUser.email
              );
              setTriggerRegisterAfterAuth(null);
            }
          }}
        />
      )}

      {showRegistrationModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRegistrationModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register Domain: {selectedDomain?.domain}</h3>
              <button
                className="close-button"
                onClick={() => setShowRegistrationModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="registration-form">
              <div className="form-group">
                <label htmlFor="username">
                  <User size={16} />
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Choose a username"
                  className={formErrors.username ? "error" : ""}
                />
                {formErrors.username && (
                  <span className="field-error">{formErrors.username}</span>
                )}
              </div>

              {/* <div className="form-group">
                <label htmlFor="passwd">
                  <Shield size={16} />
                  Password *
                </label>
                <input
                  id="passwd"
                  type="password"
                  value={formData.passwd}
                  onChange={(e) => handleInputChange('passwd', e.target.value)}
                  placeholder="Create a password (min 6 chars)"
                  className={formErrors.passwd ? 'error' : ''}
                />
                {formErrors.passwd && <span className="field-error">{formErrors.passwd}</span>}
              </div> */}

              <div className="form-group">
                <label htmlFor="name">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  // onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  readOnly
                  className={formErrors.name ? "error" : ""}
                />
                {formErrors.name && (
                  <span className="field-error">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  // onChange={(e) => handleInputChange('email', e.target.value)}
                  readOnly
                  placeholder="Enter your email address"
                  className={formErrors.email ? "error" : ""}
                />
                {formErrors.email && (
                  <span className="field-error">{formErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address-line-1">
                  <MapPin size={16} />
                  Address Line 1 *
                </label>
                <input
                  id="address-line-1"
                  type="text"
                  value={formData["address-line-1"]}
                  onChange={(e) =>
                    handleInputChange("address-line-1", e.target.value)
                  }
                  placeholder="Street address, P.O. box, company name"
                  className={formErrors["address-line-1"] ? "error" : ""}
                />
                {formErrors["address-line-1"] && (
                  <span className="field-error">
                    {formErrors["address-line-1"]}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="city">
                  <MapPin size={16} />
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                  className={formErrors.city ? "error" : ""}
                />
                {formErrors.city && (
                  <span className="field-error">{formErrors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">
                  <MapPin size={16} />
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter your state"
                  className={formErrors.state ? "error" : ""}
                />
                {formErrors.state && (
                  <span className="field-error">{formErrors.state}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipcode">
                  <MapPin size={16} />
                  Zipcode *
                </label>
                <input
                  id="zipcode"
                  type="text"
                  value={formData.zipcode}
                  onChange={(e) => handleInputChange("zipcode", e.target.value)}
                  placeholder="Enter 6-digit zipcode"
                  className={formErrors.zipcode ? "error" : ""}
                />
                {formErrors.zipcode && (
                  <span className="field-error">{formErrors.zipcode}</span>
                )}
              </div>

              <div className="phone-input-group">
                {/* <div className="form-group phone-cc">
                  <label htmlFor="phone-cc">
                    <Phone size={16} />
                    Country Code *
                  </label>
                  <input
                    id="phone-cc"
                    type="text"
                    value={formData['phone-cc']}
                    onChange={(e) => handleInputChange('phone-cc', e.target.value)}
                    placeholder="Country code"
                    className={formErrors['phone-cc'] ? 'error' : ''}
                  />
                  {formErrors['phone-cc'] && <span className="field-error">{formErrors['phone-cc']}</span>}
                </div> */}

                <div className="form-group phone-number">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    className={formErrors.phone ? "error" : ""}
                  />
                  {formErrors.phone && (
                    <span className="field-error">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="price-summary">
                <div className="price-row">
                  <span>Domain: {selectedDomain?.domain}</span>
                  <span className="price-amount">
                    {formatPrice(selectedDomain?.price)}/year
                  </span>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="submit-button"
                  disabled={registering.has(selectedDomain?.domain)}
                >
                  {registering.has(selectedDomain?.domain) ? (
                    <>
                      <Loader className="spin" size={16} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .domain-search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .search-box {
          // background: white;
          background: linear-gradient(to right, #6917b4 0%, #d54be1 100%);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
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
          color: white;
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
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 95vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #1a1a1a;
        }

        .registration-form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .field-error {
          display: block;
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .price-summary {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-amount {
          font-weight: 600;
          color: #059669;
          font-size: 1.1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .cancel-button {
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-button:hover {
          background: #e5e7eb;
        }

        .submit-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .phone-input-group {
          display: flex;
          gap: 1rem;
        }

        .phone-input-group .form-group {
          flex: 1;
        }

        .phone-input-group .phone-cc {
          flex: 0 0 100px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
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

          .modal-overlay {
            padding: 0.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-button,
          .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default DomainSearch;
