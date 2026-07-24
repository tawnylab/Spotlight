'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Children, type ReactNode } from 'react'

export function StaggerGroup({
  children,
  className,
  interval = 0.08,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  interval?: number
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}) {
  let reduce = useReducedMotion()
  let items = Children.toArray(children)

  // Under prefers-reduced-motion, render children directly with no motion
  // wrapper, otherwise the `initial="hidden"` variant parks them at
  // `opacity: 0` permanently.
  if (reduce) {
    let StaticTag = Tag as keyof React.JSX.IntrinsicElements
    return (
      <StaticTag className={className}>
        {items.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </StaticTag>
    )
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: interval, delayChildren: delay } },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}