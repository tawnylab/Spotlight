import { Container } from '@/components/Container'
import { TextReveal } from '@/components/motion/TextReveal'
import { SectionReveal } from '@/components/motion/SectionReveal'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <TextReveal
          as="h1"
          text={title}
          className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        />
        <SectionReveal delay={0.4}>
          <p className="mt-6 text-base text-ink-soft">{intro}</p>
        </SectionReveal>
      </header>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </Container>
  )
}