"use client"

import React, { useState, useRef, useEffect } from 'react';
import './Impact.css';

const impactCards = [
  {
    id: 1,
    image: '/Frame 126721.jpg'
  },
  {
    id: 2,
    image: '/trust.jpg'
  },
  {
    id: 3,
    image: '/waste.jpg'
  },
  {
    id: 4,
    image: '/spark.jpg'
  }
];

const visionCards = [
  {
    id: 1,
    image: '/hunger.jpg'
  },
  {
    id: 2,
    image: '/world.jpg'
  },
  {
    id: 3,
    image: '/inequality.jpg'
  },
  {
    id: 4,
    image: '/barriers.jpg'
  }
];

const approachCards = [
  {
    id: 1,
    image: '/smart.jpg'
  },
  {
    id: 2,
    image: '/secure.jpg'
  },
  {
    id: 3,
    image: '/reward.jpg'
  },
  {
    id: 4,
    image: '/saemless.jpg'
  }
];

const Impact = () => {
  const [impactIndex, setImpactIndex] = useState(0);
  const [visionIndex, setVisionIndex] = useState(0);
  const [approachIndex, setApproachIndex] = useState(0);
  
  const impactRef = useRef(null);
  const visionRef = useRef(null);
  const approachRef = useRef(null);

  const handleScroll = (container, setIndex) => {
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setIndex(newIndex);
  };

  // Throttle function to prevent excessive scroll events
  const throttle = (func, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  };

  useEffect(() => {
    const impactContainer = impactRef.current;
    const visionContainer = visionRef.current;
    const approachContainer = approachRef.current;
    
    // Create throttled handler functions
    const handleImpactScroll = throttle(() => handleScroll(impactContainer, setImpactIndex), 100);
    const handleVisionScroll = throttle(() => handleScroll(visionContainer, setVisionIndex), 100);
    const handleApproachScroll = throttle(() => handleScroll(approachContainer, setApproachIndex), 100);

    if (impactContainer) {
      impactContainer.addEventListener('scroll', handleImpactScroll);
    }
    if (visionContainer) {
      visionContainer.addEventListener('scroll', handleVisionScroll);
    }
    if (approachContainer) {
      approachContainer.addEventListener('scroll', handleApproachScroll);
    }

    return () => {
      if (impactContainer) {
        impactContainer.removeEventListener('scroll', handleImpactScroll);
      }
      if (visionContainer) {
        visionContainer.removeEventListener('scroll', handleVisionScroll);
      }
      if (approachContainer) {
        approachContainer.removeEventListener('scroll', handleApproachScroll);
      }
    };
  }, []);

  const scrollToCard = (containerRef, index) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const CardSection = ({ title, cards, containerRef, activeIndex, firstLetter, restLetters }) => (
    <div className="card-section">
      <h1 className="section-title">
        <span className="first-letter">{firstLetter}</span>
        <span className="rest-letters">{restLetters}</span>
      </h1>

      <div className="cardsContainer" ref={containerRef}>
        {cards.map((card) => (
          <div key={card.id} className="cardWrapper">
            <div className="cardRectangle">
              <div className="imageContainer">
                <img 
                  src={card.image} 
                  alt={`${title} card`} 
                  className="cardImage" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="scrollIndicator">
        {[0, 1].map((index) => (
          <div 
            key={index}
            className={`scrollDot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => scrollToCard(containerRef, index)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="impact">
      <CardSection 
        title="Impact"
        cards={impactCards}
        containerRef={impactRef}
        activeIndex={impactIndex}
        firstLetter="I"
        restLetters="mpact."
      />
      
      <CardSection 
        title="Vision"
        cards={visionCards}
        containerRef={visionRef}
        activeIndex={visionIndex}
        firstLetter="V"
        restLetters="ision."
      />
      
      <CardSection 
        title="Approach"
        cards={approachCards}
        containerRef={approachRef}
        activeIndex={approachIndex}
        firstLetter="A"
        restLetters="pproach."
      />
    </div>
  );
};
export default Impact;