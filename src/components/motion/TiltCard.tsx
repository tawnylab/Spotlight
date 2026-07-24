'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  depth = 1200,
  disabled,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  depth?: number
  disabled?: boolean
}) {
  let reduce = useReducedMotion()
  let ref = useRef<HTMLDivElement>(null)
  let px = useMotionValue(0.5)
  let py = useMotionValue(0.5)
  let rx = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  })
  let ry = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  })
  let glareX = useTransform(px, [0, 1], ['0%', '100%'])
  let glareY = useTransform(py, [0, 1], ['0%', '100%'])
  let glare = useTransform(
    [glareX, glareY] as any,
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, oklch(0.95 0.06 60 / 0.45), transparent 60%)`,
  )

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || disabled) return
    let el = ref.current
    if (!el) return
    let rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: depth,
        transformStyle: 'preserve-3d',
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      >
        {children}
        {!reduce && !disabled && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
            style={{ background: glare }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}