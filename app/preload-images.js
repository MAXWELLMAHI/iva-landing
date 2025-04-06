"use client";
import { useEffect } from 'react';

export default function PreloadImages() {
  useEffect(() => {
    const imagesToPreload = [
      '/mainimg.png',
      '/LOGO 1.svg',
      '/Rotating_earth_animated_transparent.gif',
      '/imgg1.jpg',
      '/imgg2.jpg',
      '/imgg3.jpg',
      '/imgg4.jpg',
      '/imgg5.jpg',
      '/imgg6.jpg',
      '/Frame 126760.svg'
    ];

    // Preload images manually
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null; // This component doesn't render anything
} 