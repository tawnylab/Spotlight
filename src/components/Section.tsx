import { useId } from 'react'
import { TextReveal } from '@/components/motion/TextReveal'
import { ScrollSectionAxis } from '@/components/motion/ScrollSectionAxis'

export function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  let id = useId()

  return (
    <section
      aria-labelledby={id}
      className="relative md:pl-6"
    >
      <ScrollSectionAxis />
      <div className="grid max-w-3xl grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
        <TextReveal
          as="h2"
          text={title}
          id={id}
          className="font-display text-sm font-semibold tracking-wide text-ink"
        />
        <div className="md:col-span-3">{children}</div>
      </div>
    </section>
  )
}