'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * 全站 MotionConfig 边界。
 * 强制所有 motion 动画组件在 prefers-reduced-motion: reduce 时
 * 由 motion/react 自动降级（位移归零、duration 缩为 0）。
 */
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  )
}