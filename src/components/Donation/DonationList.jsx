"use client";
import React, { useState, useEffect } from 'react';
import { getDocuments } from '../../firebase/firebaseUtils';
import Image from 'next/image';
import './DonationList.css';

const DonationList = ({ limit = 10, category = null }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare conditions for query
        const conditions = [];
        if (category) {
          conditions.push({
            field: 'category',
            operator: '==',
            value: category
          });
        }
        
        // Add condition for active donations only
        conditions.push({
          field: 'status',
          operator: '==',
          value: 'active'
        });
        
        // Fetch donations with conditions
        const fetchedDonations = await getDocuments(
          'donations',
          conditions,
          'createdAt',
          limit
        );
        
        // Sort by creation date (newest first)
        const sortedDonations = fetchedDonations.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setDonations(sortedDonations);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [limit, category]);

  if (loading) {
    return <div className="donation-list-loading">Loading donations...</div>;
  }

  if (error) {
    return <div className="donation-list-error">{error}</div>;
  }

  if (donations.length === 0) {
    return <div className="donation-list-empty">No donations found.</div>;
  }

  return (
    <div className="donation-list-container">
      <h2>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Donations` : 'Recent Donations'}</h2>
      
      <div className="donation-grid">
        {donations.map((donation) => (
          <div key={donation.id} className="donation-card">
            {donation.imageUrl && (
              <div className="donation-image-container">
                <Image
                  src={donation.imageUrl}
                  alt={donation.title}
                  width={300}
                  height={200}
                  className="donation-image"
                />
              </div>
            )}
            
            <div className="donation-content">
              <h3 className="donation-title">{donation.title}</h3>
              <p className="donation-description">{donation.description}</p>
              
              <div className="donation-details">
                <div className="donation-amount">
                  <span className="amount-label">Amount:</span>
                  <span className="amount-value">${donation.amount.toFixed(2)}</span>
                </div>
                
                <div className="donation-meta">
                  <span className="donation-category">{donation.category}</span>
                  <span className="donation-date">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button className="donate-button">Donate Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationList; 