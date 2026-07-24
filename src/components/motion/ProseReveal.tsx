'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Children, isValidElement, type ReactNode } from 'react'

/**
 * 给 MDX 文章正文用：把 motion 入场动画附加到每个顶层 MDX 元素上，
 * 不新增 <div>，避免破坏 @tailwindcss/typography 的直接子选择器
 * （.prose > p + p、.prose > h2 + p 等）。
 *
 * 实现：用 motion.create 把每个子元素的 tag 包成一个 typed motion
 * 组件后再渲染 —— DOM 结构和 prose typography 规则全部保留。
 */
export function ProseReveal({
  children,
  interval = 0.06,
  className,
}: {
  children: ReactNode
  interval?: number
  className?: string
}) {
  let reduce = useReducedMotion()
  let items = Children.toArray(children)

  if (reduce) {
    return (
      <div className={className}>
        {items.map((child, i) => {
          let key = isValidElement(child) ? child.key ?? i : i
          return <div key={key}>{child}</div>
        })}
      </div>
    )
  }

  return (
    <div className={className}>
      {items.map((child, i) => {
        if (!isValidElement(child)) {
          return <span key={i}>{child}</span>
        }
        let type = child.type
        if (typeof type !== 'string') {
          // 非原生 tag（如自定义 React 组件）保留原状包装不动画，
          // 不强行挂 motion 避免破坏子组件 props 契约。
          return <div key={child.key ?? i}>{child}</div>
        }
        let MotionEl = motion.create(type)
        let key = child.key ?? i
        // Strip React reserved props (key/ref) that shouldn't pass through as DOM attributes.
        let { key: _k, ref: _r, ...rest } = child.props as {
          key?: React.Key
          ref?: React.Ref<unknown>
          [k: string]: unknown
        }
        return (
          <MotionEl
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: i * interval,
            }}
            {...rest}
          />
        )
      })}
    </div>
  )
}
