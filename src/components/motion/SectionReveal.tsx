'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function SectionReveal({
  children,
  className,
  delay = 0,
  y = 32,
  amount = 0.3,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
  once?: boolean
}) {
  let reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}