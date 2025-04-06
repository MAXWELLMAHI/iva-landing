"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; 
import "./Sealink.css";

// Use regular paths without cache busting
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
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  useEffect(() => {
    // Check if the images array is not empty
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Slightly longer interval for better viewing
    
    return () => clearInterval(interval);
  }, []);

  // If no images, return null or a placeholder
  if (images.length === 0) {
    return <div className="slider-wrapper">No images available</div>;
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        <div className="image-container">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div 
              key={index}
              className="slideshow-image"
              style={{
                backgroundImage: `url(${images[index]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute'
              }}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 }
              }}
            />
          </AnimatePresence>
        </div>
        <div className="blur-overlay">
          <Image 
            src="/Frame 126760.svg" 
            alt="Blur Layer" 
            className="blur-glass"
            width={800}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default BlurGlassSlider;