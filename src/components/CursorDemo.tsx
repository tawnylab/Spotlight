'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Cursor } from 'motion-plus/react'

const TEAL_LIGHT = '#14b8a6'
const TEAL_DARK = '#2dd4bf'

export function CursorDemo() {
  let { resolvedTheme } = useTheme()
  let [mounted, setMounted] = useState(false)
  let [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    setMounted(true)
    let mq = window.matchMedia('(pointer: fine)')
    let update = () => setIsFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!mounted || !isFinePointer) return null

  let isDark = resolvedTheme === 'dark'

  return (
    <Cursor
      style={{ backgroundColor: isDark ? TEAL_DARK : TEAL_LIGHT }}
      variants={{
        text: { backgroundColor: isDark ? TEAL_DARK : TEAL_LIGHT },
      }}
      matchTextSize
    />
  )
}