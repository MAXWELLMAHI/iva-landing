"use client";
import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Facebook, Linkedin, Phone, Mail, MapPin, Send } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import './ContactUs.css';
import Image from 'next/image';

const validateField = (name, value) => {
  switch (name) {
    case 'name':
      return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    case 'email':
      return !/^\S+@\S+\.\S+$/.test(value) ? 'Please enter a valid email address' : '';
    case 'subject':
      return value.trim().length < 2 ? 'Subject must be at least 2 characters' : '';
    case 'message':
      return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
    default:
      return '';
  }
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validate on change if the field has been touched
    if (touched[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const isFormValid = () => {
    const errors = Object.values(formErrors);
    const emptyFields = Object.values(formData).some(value => value.trim() === '');
    return errors.every(error => error === '') && !emptyFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const validationErrors = Object.entries(formData).reduce((acc, [key, value]) => {
      acc[key] = validateField(key, value);
      return acc;
    }, {});
    setFormErrors(validationErrors);
    
    // Check if there are any validation errors
    if (!isFormValid()) {
      setError('Please fix the errors in the form before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Send data to the server API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred while submitting the form');
      }

      // Success handling
      console.log('Form submitted successfully:', data);
      
      // Show success feedback
      setSuccess(true);
      setShowConfetti(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Reset touched state
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false
      });
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
        setSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="contact-page">
        {/* Confetti effect */}
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
        
        <div className="container">
          <div className="header">
            <h1>Contact Us</h1>
            <p>
              Have any question in mind or want to enquire? Please feel free to contact us through the form or the following details.
            </p>
            {/* Show success/error messages */}
            {success && (
              <div className="success-message">
                Thank you for your message! We will get back to you soon! 🎉
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <div className="contact-card">
            <div className="floating-circles">
              <div className="circle float-1"></div>
              <div className="circle float-2"></div>
              <div className="circle float-3"></div>
              <div className="circle float-4"></div>
              <div className="circle float-5"></div>
            </div>
            
            <div className="contact-content">
              {/* Left side - Form */}
              <div className="form-section">
                <form onSubmit={handleSubmit} noValidate>
                  <div className={`form-group ${formErrors.name && touched.name ? 'error' : ''}`}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Your name"
                      aria-invalid={formErrors.name ? 'true' : 'false'}
                      aria-describedby={formErrors.name ? 'name-error' : undefined}
                    />
                    {formErrors.name && touched.name && (
                      <div className="error-text" id="name-error">{formErrors.name}</div>
                    )}
                  </div>

                  <div className={`form-group ${formErrors.email && touched.email ? 'error' : ''}`}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="your@email.com"
                      aria-invalid={formErrors.email ? 'true' : 'false'}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                    />
                    {formErrors.email && touched.email && (
                      <div className="error-text" id="email-error">{formErrors.email}</div>
                    )}
                  </div>

                  <div className={`form-group ${formErrors.subject && touched.subject ? 'error' : ''}`}>
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="How can we help?"
                      aria-invalid={formErrors.subject ? 'true' : 'false'}
                      aria-describedby={formErrors.subject ? 'subject-error' : undefined}
                    />
                    {formErrors.subject && touched.subject && (
                      <div className="error-text" id="subject-error">{formErrors.subject}</div>
                    )}
                  </div>

                  <div className={`form-group ${formErrors.message && touched.message ? 'error' : ''}`}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows="4"
                      required
                      placeholder="Your message here..."
                      aria-invalid={formErrors.message ? 'true' : 'false'}
                      aria-describedby={formErrors.message ? 'message-error' : undefined}
                    />
                    {formErrors.message && touched.message && (
                      <div className="error-text" id="message-error">{formErrors.message}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <button 
                      type="submit" 
                      className="submit-btn" 
                      disabled={isSubmitting}
                      aria-busy={isSubmitting ? 'true' : 'false'}
                    >
                      <Send className="send-icon" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right side - Contact information and quote */}
              <div className="info-section">
                <div className="splash-circles">
                  <div className="splash splash-1"></div>
                  <div className="splash splash-2"></div>
                  <div className="splash splash-3"></div>
                </div>

                <div className="info-content">
                  <h2>Get in Touch</h2>
                  
                  <div className="contact-info">
                    <div className="info-item">
                      <Phone className="info-icon" />
                      <div>
                        <p className="info-label">Phone</p>
                        <p className="info-value">+91 (9321) 608-490</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Mail className="info-icon" />
                      <div>
                        <p className="info-label">Email</p>
                        <p className="info-value">iva@example.com</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <MapPin className="info-icon" />
                      <div>
                        <p className="info-label">Address</p>
                        <p className="info-value">123 Charity Street, Impact City, 400001</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="social-links">
                    <a href="https://www.instagram.com/_theiva.in?igsh=cnRlamRuN21reDhq" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                      <Instagram />
                    </a>
                    <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                      <Twitter />
                    </a>
                    <a href="https://www.facebook.com/share/1C5rkNHR7E/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                      <Facebook />
                    </a>
                    <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <Linkedin />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ContactUs;