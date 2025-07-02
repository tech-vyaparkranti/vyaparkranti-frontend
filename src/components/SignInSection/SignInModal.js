import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config/apiConfig';

export default function SignInModal({ signIn, onClose, onSuccess}) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Set initial modal state based on prop
  useEffect(() => {
    setShowSignIn(signIn);
  }, [signIn]);

  const handleSignInSubmit = async (e) => {
  e.preventDefault();
  if (!signInData.email || !signInData.password) {
    alert('Please fill in all fields');
    return;
  }

  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, signInData);
    localStorage.setItem('auth_token', response.data.token);
    if (onSuccess) {
      onSuccess(response.data.user);
    }
    handleClose();
  } catch (err) {
    alert('Login failed');
  } finally {
    setIsLoading(false);
  }
};


  const handleSignUpSubmit = async (e) => {
  e.preventDefault();
  if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
    alert('Please fill in all fields');
    return;
  }

  if (signUpData.password !== signUpData.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  setIsLoading(true);
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const response = await axios.post(`${API_BASE_URL}/api/signUp`, signUpData);
        localStorage.setItem('auth_token', response.data.token);
    alert('Register Successfully');

    if (onSuccess) {
      onSuccess(response.data.user);
    }
    handleClose();
  } catch (err) {
    alert('Sign up failed');
  } finally {
    setIsLoading(false);
  }
};


  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (onClose) {
      onClose();
    }
  };

  // Don't render anything if both modals are closed
  if (!showSignIn && !showSignUp) {
    return null;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.4s ease forwards;
          position: relative;
        }

        .modal-content {
          background: white;
          margin: 2px;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
        }

        .modal-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 2rem 1rem;
          text-align: center;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.05);
          color: #475569;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
        }

        .modal-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .modal-body {
          padding: 1.5rem 2rem 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          transition: color 0.2s ease;
          margin-right:2px;
        }

        .form-control {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          line-height: 1.5;
          box-sizing: border-box;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .form-control:focus {
          border-color: #667eea;
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .form-control:focus + .input-icon {
          color: #667eea;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.2s ease;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .form-check {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          gap: 0.75rem;
        }

        .form-check-input {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 2px;
        }

        .form-check-input:checked {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
        }

        .form-check-input:checked::after {
          content: "✓";
          color: white;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .form-check-label {
          cursor: pointer;
          color: #4b5563;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .btn {
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 2px solid #e5e7eb;
        }

        .btn-outline:hover {
          background: #f8fafc;
          border-color: #667eea;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 0.5rem 0;
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          padding: 0 1rem;
          background: white;
        }

        .switch-auth {
          text-align: center;
        }

        .switch-auth-text {
          color: #6b7280;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .switch-btn {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: 1.05rem;
          transition: color 0.2s ease;
          margin-bottom : 1rem;
        }

        .switch-btn:hover {
          color: #764ba2;
        }

        .forgot-password {
          text-align: center;
          margin-top: 1rem;
        }

        .forgot-password-btn {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 0.9rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .forgot-password-btn:hover {
          color: #667eea;
        }

        @media (max-width: 640px) {
          .modal-container {
            width: 95%;
            margin: 1rem;
          }
          
          .modal-header {
            padding: 1.5rem 1.5rem 1rem;
          }
          
          .modal-body {
            padding: 1rem 1.5rem 1.5rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <button className="close-button" onClick={handleClose}>
                  <X size={20} />
                </button>
                <h2 className="modal-title">Welcome Back</h2>
                <p className="modal-subtitle">Sign in to your account to continue</p>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className="form-control"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                    {/* <Mail className="input-icon" size={18} /> */}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    {/* <Lock className="input-icon" size={18} /> */}
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button 
                  onClick={handleSignInSubmit} 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* <div className="forgot-password">
                  <button className="forgot-password-btn">
                    Forgot your password?
                  </button>
                </div> */}

                <div className="divider">
                  <span>New to our platform?</span>
                </div>

                <div className="switch-auth">
                  <p className="switch-auth-text">Create an account to get started</p>
                  <button className="switch-btn" onClick={switchToSignUp}>
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <button className="close-button" onClick={handleClose}>
                  <X size={20} />
                </button>
                <h2 className="modal-title">Join Us Today</h2>
                <p className="modal-subtitle">Create your account in just a few steps</p>
              </div>
              
              <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Enter Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        placeholder="Enter name"
                        disabled={isLoading}
                      />
                      {/* <User className="input-icon" size={18} /> */}
                    </div>
                  </div>

                  {/* <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        placeholder="Last name"
                        disabled={isLoading}
                      />
                      <User className="input-icon" size={18} />
                    </div>
                  </div> */}

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className="form-control"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                    {/* <Mail className="input-icon" size={18} /> */}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="Create a strong password"
                      disabled={isLoading}
                    />
                    {/* <Lock className="input-icon" size={18} /> */}
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    {/* <Lock className="input-icon" size={18} /> */}
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="agreeTerms" required />
                  <label className="form-check-label" htmlFor="agreeTerms">
                    I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                  </label>
                </div>

                <button 
                  onClick={handleSignUpSubmit} 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>Already have an account?</span>
                </div>

                <div className="switch-auth">
                  <p className="switch-auth-text">Welcome back! Sign in to continue</p>
                  <button className="switch-btn" onClick={switchToSignIn}>
                    Sign In Instead
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}