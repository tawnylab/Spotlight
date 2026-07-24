'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { AppContext } from '@/app/providers'
import { Container } from '@/components/Container'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { Prose } from '@/components/Prose'
import { ProseReveal } from '@/components/motion/ProseReveal'
import { ReadingProgress } from '@/components/motion/ReadingProgress'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug
  children: React.ReactNode
}) {
  let router = useRouter()
  let { previousPathname } = useContext(AppContext)

  return (
    <>
      <ReadingProgress />
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            {previousPathname && (
              <MagneticHover>
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label="Go back to articles"
                  className="group mb-8 flex size-10 items-center justify-center rounded-full bg-paper-raised shadow-[var(--shadow-card)] ring-1 ring-line transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
                >
                  <ArrowLeftIcon className="size-4 stroke-muted transition group-hover:stroke-accent" />
                </button>
              </MagneticHover>
            )}
            <article>
              <header className="flex flex-col">
                <TextReveal
                  as="h1"
                  text={article.title}
                  className="font-display mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
                />
                <SectionReveal delay={0.6}>
                  <time
                    dateTime={article.date}
                    className="order-first flex items-center text-base text-muted"
                  >
                    <span className="h-4 w-0.5 rounded-full bg-accent" />
                    <span className="ml-3">{formatDate(article.date)}</span>
                  </time>
                </SectionReveal>
              </header>
              <Prose className="mt-8" data-mdx-content>
                <ProseReveal>{children}</ProseReveal>
              </Prose>
            </article>
          </div>
        </div>
      </Container>
    </>
  )
}