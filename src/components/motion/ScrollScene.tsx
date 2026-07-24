'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

export function ScrollScene({
  children,
  className,
  variant = 'parallax',
  range = [0, 1],
  factor = 0.3,
}: {
  children: ReactNode
  className?: string
  variant?: 'parallax' | 'fade' | 'reveal'
  range?: [number, number]
  factor?: number
}) {
  let reduce = useReducedMotion()
  let ref = useRef<HTMLDivElement>(null)
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  let y = useTransform(scrollYProgress, range, [factor * 100, -factor * 100])
  let opacity = useTransform(scrollYProgress, range, [0, 1, 0])

  if (reduce) return <div ref={ref} className={className}>{children}</div>

  let style =
    variant === 'parallax'
      ? { y }
      : variant === 'fade'
        ? { opacity }
        : { y, opacity }

  return (
    <motion.div ref={ref} className={className} style={style}>
      {children}
    </motion.div>
  )
}
