'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'

export function ReadingProgress() {
  let reduce = useReducedMotion()
  let { scrollYProgress } = useScroll()
  let scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30 })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-40 h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}