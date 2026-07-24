'use client'

import { Cursor } from 'motion-plus/react'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { usePointerFine } from './useMotionPreference'

const OCHRE = 'oklch(0.625 0.165 48)'
const OCHRE_SOFT = 'oklch(0.78 0.12 60)'

export function CursorTrails() {
  let [mounted, setMounted] = useState(false)
  let fine = usePointerFine()
  let reduce = useReducedMotion()

  useEffect(() => setMounted(true), [])

  if (!mounted || !fine || reduce) return null

  return (
    <Cursor
      style={{ backgroundColor: OCHRE }}
      variants={{
        text: { backgroundColor: OCHRE_SOFT, height: 24, width: 24 },
      }}
      matchTextSize
    />
  )
}
