'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Children, isValidElement, type ReactNode } from 'react'

/**
 * 给 MDX 文章正文用：抓取子元素中匹配 selector 的节点，
 * 注入 motion 包裹做批次 reveal。
 */
export function ProseReveal({
  children,
  selector = 'p, h2, h3, blockquote, pre, figure, ul, ol, hr',
  interval = 0.06,
  className,
}: {
  children: ReactNode
  selector?: string
  interval?: number
  className?: string
}) {
  let reduce = useReducedMotion()
  let items: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      items.push(child)
    } else if (typeof child === 'string') {
      items.push(<p key={`t-${items.length}`}>{child}</p>)
    }
  })

  return (
    <div className={className}>
      {items.map((node, i) => {
        let key = isValidElement(node) ? node.key ?? i : i
        if (reduce) return <div key={key}>{node}</div>
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: i * interval,
            }}
          >
            {node}
          </motion.div>
        )
      })}
    </div>
  )
}