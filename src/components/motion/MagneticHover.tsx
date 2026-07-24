'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { usePointerFine } from './useMotionPreference'

export function MagneticHover({
  children,
  className,
  strength = 0.25,
  disabled,
}: {
  children: ReactNode
  className?: string
  strength?: number
  disabled?: boolean
}) {
  let reduce = useReducedMotion()
  let finePointer = usePointerFine()
  let disabledByPointer = !finePointer
  let ref = useRef<HTMLDivElement>(null)
  let x = useMotionValue(0)
  let y = useMotionValue(0)
  let sx = useSpring(x, { stiffness: 350, damping: 30 })
  let sy = useSpring(y, { stiffness: 350, damping: 30 })

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || disabled || disabledByPointer) return
    let el = ref.current
    if (!el) return
    let rect = el.getBoundingClientRect()
    let dx = (e.clientX - (rect.left + rect.width / 2)) * strength
    let dy = (e.clientY - (rect.top + rect.height / 2)) * strength
    x.set(dx)
    y.set(dy)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}