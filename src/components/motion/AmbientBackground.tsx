'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { useEffect } from 'react'
import { usePointerFine } from './useMotionPreference'

export function AmbientBackground() {
  let fine = usePointerFine()
  let reduce = useReducedMotion()
  let x = useMotionValue(-1000)
  let y = useMotionValue(-1000)
  let sx = useSpring(x, { stiffness: 80, damping: 20 })
  let sy = useSpring(y, { stiffness: 80, damping: 20 })
  let bg = useTransform(
    [sx, sy] as any,
    ([vx, vy]: number[]) =>
      `radial-gradient(600px circle at ${vx}px ${vy}px, oklch(0.92 0.05 65 / 0.18), transparent 60%)`,
  )

  useEffect(() => {
    if (!fine || reduce) return
    let onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, reduce, x, y])

  if (!fine || reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: bg, mixBlendMode: 'multiply' }}
    />
  )
}
