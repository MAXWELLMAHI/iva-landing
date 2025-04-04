'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export const ParallaxWrapper = ({ children, offset = 50 }) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [offset * 2, 0])
  const scale = useTransform(scrollY, [0, 500], [0.8, 1])
  const opacity = useTransform(scrollY, [0, 500], [0.5, 1])

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        transformOrigin: 'center top',
        position: 'relative',
        zIndex: 1
      }}
    >
      {children}
    </motion.div>
  )
}