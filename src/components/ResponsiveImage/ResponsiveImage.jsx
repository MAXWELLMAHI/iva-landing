"use client";
import React from 'react';
import Image from 'next/image';
import './ResponsiveImage.css'; // Your CSS file

const ImageComponent = () => {
  return (
    <div className="image-wrapper">
      <Image 
        src="/Frame 126766.svg" 
        alt="Motivational bridge design" 
        width={800}
        height={600}
        priority={true}
        className="responsive-image"
      />
    </div>
  );
};

export default ImageComponent;