"use client";
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addDocument, uploadFile } from '../../firebase/firebaseUtils';
import './DonationForm.css';

const DonationForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'general',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a donation');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = null;
      
      // Upload image if provided
      if (formData.image) {
        const imagePath = `donations/${user.uid}/${Date.now()}_${formData.image.name}`;
        imageUrl = await uploadFile(imagePath, formData.image);
      }
      
      // Create donation document
      const donationData = {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        imageUrl,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      await addDocument('donations', donationData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'general',
        image: null
      });
      
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error creating donation:', err);
      setError(err.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <h2>Create a Donation</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Donation created successfully!</div>}
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter donation title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your donation"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="general">General</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="environment">Environment</option>
            <option value="emergency">Emergency</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Donation'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm; 