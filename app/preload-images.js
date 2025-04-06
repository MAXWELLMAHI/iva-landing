"use client";
import { useEffect } from 'react';

export default function PreloadImages() {
  useEffect(() => {
    // Add a timestamp query parameter to bust cache
    const timestamp = new Date().getTime();
    
    const imagesToPreload = [
      `/mainimg.png?v=${timestamp}`,
      `/LOGO 1.svg?v=${timestamp}`,
      `/Rotating_earth_animated_transparent.gif?v=${timestamp}`,
      `/imgg1.jpg?v=${timestamp}`,
      `/imgg2.jpg?v=${timestamp}`,
      `/imgg3.jpg?v=${timestamp}`,
      `/imgg4.jpg?v=${timestamp}`,
      `/imgg5.jpg?v=${timestamp}`,
      `/imgg6.jpg?v=${timestamp}`,
      `/Frame 126760.svg?v=${timestamp}`
    ];

    // Preload images manually
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null; // This component doesn't render anything
} 