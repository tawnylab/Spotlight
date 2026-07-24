'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { getRouteLabel, PageWipe } from './PageWipe'

export function PageTransition({ children }: { children: ReactNode }) {
  let pathname = usePathname()
  let reduce = useReducedMotion()
  let label = getRouteLabel(pathname)

  return (
    <>
      <AnimatePresence>
        {!reduce && <PageWipe key={pathname} label={label} />}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: reduce ? 0.06 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
