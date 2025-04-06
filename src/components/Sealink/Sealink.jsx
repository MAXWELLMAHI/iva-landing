"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./Sealink.css";

// Ensure images are loaded with the proper path
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
          <div className="slideshow-image">
            <Image 
              src={images[index]}
              alt={`Slideshow image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 800px"
              style={{ objectFit: 'cover' }}
              unoptimized={false}
              quality={80}
            />
          </div>
        </div>
        <div className="blur-overlay">
          <Image 
            src="/Frame 126760.svg" 
            alt="Blur Layer" 
            className="blur-glass"
            width={800}
            height={600}
            priority
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  );
};

export default BlurGlassSlider;