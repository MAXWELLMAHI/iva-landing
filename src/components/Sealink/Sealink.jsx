"use client";
import React, { useEffect, useState } from "react";
import "./Sealink.css";

const images = [
  "/imgg1.jpg",
  "/imgg2.jpg",
  "/imgg3.jpg",
  "/imgg4.jpg",
  "/imgg5.jpg",
  "/imgg6.jpg" 
];

const BlurGlassSlider = () => {
  const [index, setIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(images[0]);
  
  useEffect(() => {
    // Preload images for smoother transitions
    const preloadImages = () => {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadImages();
    
    const interval = setInterval(() => {
      const newIndex = (index + 1) % images.length;
      setIndex(newIndex);
      setCurrentImage(images[newIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        <div className="image-container">
          <div 
            className="slideshow-image"
            style={{ backgroundImage: `url(${currentImage})` }}
          ></div>
        </div>
        <div className="blur-overlay">
          <img src="/Frame 126760.svg" alt="Blur Layer" className="blur-glass" />
        </div>
      </div>
    </div>
  );
};

export default BlurGlassSlider;