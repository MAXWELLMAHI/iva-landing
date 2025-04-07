"use client";
import React, { useState, useEffect } from 'react';
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
        
        // Build query parameters
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        if (limit) {
          params.append('limit', limit);
        }
        
        // Fetch donations from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        
        const data = await response.json();
        setDonations(data.donations || []);
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
      <h2>Recent Donations</h2>
      <div className="donation-grid">
        {donations.map((donation) => (
          <div key={donation.id} className="donation-card">
            {donation.imageUrl && (
              <div className="donation-image-container">
                <Image
                  src={donation.imageUrl}
                  alt={donation.title}
                  className="donation-image"
                  width={300}
                  height={200}
                  objectFit="cover"
                />
              </div>
            )}
            <div className="donation-content">
              <h3 className="donation-title">{donation.title}</h3>
              <p className="donation-description">{donation.description}</p>
              <div className="donation-details">
                <div className="donation-amount">
                  <span className="amount-label">Amount:</span>
                  <span className="amount-value">${donation.amount}</span>
                </div>
                <div className="donation-meta">
                  <span className="donation-category">{donation.category}</span>
                  <span className="donation-date">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationList; 