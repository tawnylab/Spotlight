import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/formatDate'

import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { GitHubIcon, BilibiliIcon, MailIcon } from '@/components/SocialIcons'
import { PhotoCarousel } from '@/components/PhotoCarousel'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { ScrollScene } from '@/components/motion/ScrollScene'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextReveal } from '@/components/motion/TextReveal'
import logoBrotian from '@/images/logos/brotian.svg'
import logoUnknow from '@/images/logos/unknow.svg'
import logoYonyou from '@/images/logos/yonyou.png'
import logoDTMobile from '@/images/logos/dt-mobile.jpg'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-accent-soft stroke-muted"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-muted"
      />
    </svg>
  )
}

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="size-6 fill-muted transition group-hover:fill-ink-soft" />
    </Link>
  )
}

function Newsletter() {
  return (
    <div className="rounded-2xl border border-line p-6">
      <h2 className="flex text-sm font-semibold text-ink">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 flex-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
          />
        </svg>
        <span className="ml-3">公告</span>
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        北京旅游ing，肥来后肝毕业设计。
      </p>
    </div>
  )
}

interface Role {
  company: string
  title: string
  logo: ImageProps['src']
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
}

function Role({ role }: { role: Role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime

  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex size-10 flex-none items-center justify-center rounded-full shadow-[var(--shadow-card)] ring-1 ring-line">
        <Image src={role.logo} alt="" className="size-7" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-ink">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-muted">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-muted"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
      </dl>
    </li>
  )
}

function Resume() {
  let resume: Array<Role> = [
    {
      company: '天降',
      title: '独立开发者',
      logo: logoBrotian,
      start: '2023',
      end: {
        label: 'Present',
        dateTime: new Date().getFullYear().toString(),
      },
    },
    {
      company: '?',
      title: '?',
      logo: logoUnknow,
      start: '2021',
      end: {
        label: 'Present',
        dateTime: new Date().getFullYear().toString(),
      },
    },
    {
      company: '用友',
      title: '软件开发',
      logo: logoYonyou,
      start: '2020',
      end: '2021',
    },
    {
      company: '大唐移动',
      title: '实习',
      logo: logoDTMobile,
      start: '2019',
      end: '2020',
    },
  ]

  return (
    <div className="rounded-2xl border border-line p-6">
      <h2 className="flex text-sm font-semibold text-ink">
        <BriefcaseIcon className="size-6 flex-none" />
        <span className="ml-3">履历</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
    </div>
  )
}

function Photos() {
  return (
    <ScrollScene
      variant="parallax"
      factor={0.15}
      className="mt-16 overflow-x-hidden sm:mt-20"
    >
      <PhotoCarousel />
    </ScrollScene>
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <TextReveal
            as="h1"
            text="科技爱好者、码农。"
            className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          />
          <SectionReveal delay={0.6}>
            <p className="mt-6 text-base text-ink-soft">
              哈喽！吾乃天酱，居住在魔都的独立开发者。正在探索AIGC和三维打印领域。
            </p>
          </SectionReveal>
          <StaggerGroup className="mt-6 flex gap-6" delay={0.7}>
            <MagneticHover>
              <SocialLink
                href="https://space.bilibili.com/4793911"
                aria-label="关注我的Bilibili"
                icon={BilibiliIcon}
              />
            </MagneticHover>
            <MagneticHover>
              <SocialLink
                href="https://github.com/tawnylab"
                aria-label="关注我的GitHub"
                icon={GitHubIcon}
              />
            </MagneticHover>
            <MagneticHover>
              <SocialLink
                href="mailto:shawntynji@gmail.com"
                aria-label="关注我的GitHub"
                icon={MailIcon}
              />
            </MagneticHover>
          </StaggerGroup>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <StaggerGroup className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </StaggerGroup>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
