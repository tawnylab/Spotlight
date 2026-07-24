'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { usePointerFine } from '@/components/motion/useMotionPreference'

export default function NotFound() {
  let reduce = useReducedMotion()
  let fine = usePointerFine()
  let sx = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 })
  let sy = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 })

  useEffect(() => {
    if (reduce || !fine) return
    let onMove = (e: PointerEvent) => {
      sx.set((e.clientX / window.innerWidth - 0.5) * 24)
      sy.set((e.clientY / window.innerHeight - 0.5) * 24)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, fine, sx, sy])

  return (
    <Container className="flex h-full items-center pt-16 sm:pt-32">
      <div className="flex flex-col items-center">
        <motion.p
          aria-hidden="true"
          className="font-display select-none text-[12rem] font-bold leading-none text-accent/15 sm:text-[18rem]"
          style={reduce || !fine ? undefined : { x: sx, y: sy }}
        >
          404
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          initial={reduce ? false : { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={
            reduce
              ? undefined
              : { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
          }
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="mt-4 text-base text-ink-soft"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          迷路了
        </motion.p>
        <MagneticHover className="mt-6">
          <Button href="/" variant="secondary">
            Go back home
          </Button>
        </MagneticHover>
      </div>
    </Container>
  )
}
