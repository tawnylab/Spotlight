'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    let seg = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' })
    return Array.from(seg.segment(text), (s) => s.segment)
  }
  return Array.from(text)
}

export function TextReveal({
  text,
  as: Tag = 'span',
  className,
  id,
  perCharDelay = 0.025,
  startDelay = 0,
  ariaLabel,
}: {
  text: string
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  id?: string
  perCharDelay?: number
  startDelay?: number
  ariaLabel?: string
}) {
  let reduce = useReducedMotion()
  let chars = useMemo(() => splitGraphemes(text), [text])
  let MotionTag = (motion as any)[Tag] ?? motion.span

  return (
    <MotionTag
      className={className}
      id={id}
      aria-label={ariaLabel ?? text}
      initial="hidden"
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: perCharDelay, delayChildren: startDelay } },
      }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: '0.5em' },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </MotionTag>
  )
}