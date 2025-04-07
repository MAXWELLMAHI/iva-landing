"use client";
import React, { useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../context/ThemeToggle/ThemeToggle';
import Image from 'next/image';
import './Hero.css';

// Add cache busting parameter
const timestamp = new Date().getTime();

const Hero = () => {
  const { theme } = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Add new scroll animations
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -200]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2, 
        delayChildren: 0.4,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  };

  const actionVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      className="hero" 
      ref={ref}
      style={{
        y,
        scale,
        opacity,
        transformOrigin: 'center top',
        zIndex: 999
      }}
    >
      <div className="container">
        <motion.div
          className="hero__header"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <div className="hero__logo-container">
            <motion.div className="hero__logo" variants={itemVariants}>
              <Image 
                src="/LOGO 1.svg"
                alt="Logo"
                width={100}
                height={100}
                priority
              />
              <span className="hero__logo-text">IVA</span>
            </motion.div>

            <motion.nav className="hero__nav" variants={containerVariants}>
              {['I', 'V', 'A'].map((letter, index) => (
                <motion.div key={index} className="hero__nav-item" variants={itemVariants}>
                  <span className="hero__nav-highlight">{letter}</span>
                  {['mpact.', 'ision.', 'pproach.'][index]}
                </motion.div>
              ))}
              <motion.div className="hero__nav-item" variants={itemVariants}>
                <a href="/donations" className="hero__nav-link">Donate</a>
              </motion.div>
            </motion.nav>
          </div>
        </motion.div>

        <motion.div 
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <h1 className="hero__title">Your Contribution</h1>
          <h1 className="hero__title-highlight">
            Their <span className="hero__title-highlight-word">Transformation</span>
          </h1>
        </motion.div>

        <motion.div 
          className="mainimg-container"
          style={{ scale }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="mainimg">
            <Image 
              src="/mainimg.png"
              alt="Main Image"
              width={598}
              height={581}
              priority
              quality={100}
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 360px) 280px, (max-width: 428px) 320px, (max-width: 767px) 400px, (max-width: 959px) 500px, 598px"
            />
            <div className="earth-gif-container">
              <Image 
                src="/Rotating_earth_animated_transparent.gif"
                alt="Rotating Earth"
                width={140}
                height={140}
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="hero__actions"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[
            { icon: "/select-range-svgrepo-com (1) 1.svg", text: "Select" },
            { icon: "/upload-svgrepo-com (1) 1.svg", text: "Upload" },
            { icon: "/calendar-svgrepo-com 1.svg", text: "Schedule" },
            { icon: "/medal-reward-svgrepo-com 1.svg", text: "Reward" }
          ].map((action, index) => (
            <motion.div 
              key={index} 
              className="hero__action-item"
              variants={index % 2 === 0 ? actionVariants : { 
                ...actionVariants, 
                hidden: { opacity: 0, x: 80 } 
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className="hero__action-icon">
                <Image 
                  src={action.icon}
                  alt={`${action.text} Icon`}
                  width={24}
                  height={24}
                  priority
                />
              </div>
              <span className="hero__action-text">{action.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;