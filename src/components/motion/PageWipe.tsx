'use client'

import { motion, useReducedMotion } from 'motion/react'

const LABELS: Record<string, string> = {
  '/': '天降电脑服务部',
  '/about': '我',
  '/articles': '博客',
  '/projects': '项目',
  '/videos': '视频',
  '/uses': '用品',
  '/friends': '友链',
  '/not-found': '迷路了',
}

export function PageWipe({ label }: { label: string }) {
  let reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-accent text-paper"
      initial={{ y: '100%' }}
      animate={{ y: '-100%' }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <span className="font-display text-3xl font-bold tracking-wider sm:text-5xl">
        {label}
      </span>
    </motion.div>
  )
}

export function getRouteLabel(pathname: string) {
  return LABELS[pathname] ?? '页面切换'
}
