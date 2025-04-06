"use client";
import React, { useEffect, useState } from "react";
import "./Sealink.css";

// Ensure images are loaded with the proper path (with cache busting)
const timestamp = new Date().getTime();
const images = [
  `/imgg1.jpg?v=${timestamp}`,
  `/imgg2.jpg?v=${timestamp}`, 
  `/imgg3.jpg?v=${timestamp}`,
  `/imgg4.jpg?v=${timestamp}`,
  `/imgg5.jpg?v=${timestamp}`,
  `/imgg6.jpg?v=${timestamp}`
];

const BlurGlassSlider = () => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    // Check if the images array is not empty
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // If no images, return null or a placeholder
  if (images.length === 0) {
    return <div className="slider-wrapper">No images available</div>;
  }

  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        <div className="image-container">
          <div 
            className="slideshow-image"
            style={{
              backgroundImage: `url(${images[index]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
          />
        </div>
        <div className="blur-overlay">
          <img 
            src={`/Frame 126760.svg?v=${timestamp}`}
            alt="Blur Layer" 
            className="blur-glass"
            style={{
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlurGlassSlider;