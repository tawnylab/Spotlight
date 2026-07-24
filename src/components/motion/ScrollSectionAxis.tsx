'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

export function ScrollSectionAxis() {
  let ref = useRef<HTMLDivElement>(null)
  let reduce = useReducedMotion()
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })
  let scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute left-0 top-0 hidden h-full w-px bg-line md:block"
    >
      {!reduce && (
        <motion.div
          className="h-full w-full origin-top bg-accent"
          style={{ scaleY }}
        />
      )}
    </div>
  )
}