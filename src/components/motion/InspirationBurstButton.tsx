'use client'

import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export function InspirationBurstButton() {
  let [burstKey, setBurstKey] = useState(0)
  let [isBursting, setIsBursting] = useState(false)
  let reduce = useReducedMotion()

  function fire() {
    if (isBursting) return
    setBurstKey((k) => k + 1)
    setIsBursting(true)
    setTimeout(() => setIsBursting(false), 900)
  }

  return (
    <button
      type="button"
      aria-label="点亮灵感"
      onClick={fire}
      className="group relative flex size-10 items-center justify-center overflow-visible rounded-full bg-paper-raised/90 shadow-[var(--shadow-float)] ring-1 ring-line backdrop-blur transition hover:ring-accent"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="size-5 text-accent"
        aria-hidden="true"
        animate={
          reduce
            ? { rotate: 0, scale: 1 }
            : isBursting
              ? { rotate: 180, scale: 0.9 }
              : { rotate: 0, scale: 1 }
        }
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.svg>
      <AnimatePresence>
        {isBursting && !reduce &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={`${burstKey}-${i}`}
              aria-hidden="true"
              className="absolute size-1.5 rounded-full bg-accent"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI) / 4) * 28,
                y: Math.sin((i * Math.PI) / 4) * 28,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
      </AnimatePresence>
    </button>
  )
}
