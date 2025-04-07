"use client";
import React from 'react';
import DonationForm from '../../src/components/Donation/DonationForm';
import DonationList from '../../src/components/Donation/DonationList';

export default function DonationsPage() {
  return (
    <div className="donations-page">
      <div className="container">
        <h1>Donations</h1>
        <DonationForm />
        <DonationList />
      </div>
    </div>
  );
} 