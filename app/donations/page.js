"use client";
import React from 'react';
import DonationForm from '../../src/components/Donation/DonationForm';
import DonationList from '../../src/components/Donation/DonationList';
import { useAuth } from '../../src/context/AuthContext';

export default function DonationsPage() {
  const { user } = useAuth();

  return (
    <div className="donations-page">
      <div className="container">
        <h1>Donations</h1>
        
        {user ? (
          <DonationForm />
        ) : (
          <div className="auth-required">
            <p>Please log in to create a donation.</p>
          </div>
        )}
        
        <DonationList />
      </div>
    </div>
  );
} 