import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { GitHubIcon, BilibiliIcon, MailIcon } from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-ink transition hover:text-accent"
        {...props}
      >
        <Icon className="size-6 flex-none fill-muted transition group-hover:fill-accent" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

export const metadata: Metadata = {
  title: '关于我',
  description: '我叫季顺天，在魔都设计怪东西。',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-paper-raised object-cover"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            我叫季顺天，在魔都设计怪东西。
          </h1>
          <div className="mt-6 space-y-7 text-base text-ink-soft">
            <p>
              我从小喜欢玩电脑，我在初一的时候用收到的红包买了第一张显卡，那是我第一次拆开电脑机箱，一口气学了很多电脑硬件的知识，换上新显卡后我的游戏体验飙升。这为我之后对科技越来越感兴趣埋下了种子。现在的我小到树莓派、大到PowerEdge都折腾过了。
            </p>
            <p>
              我很幸运，遇到了同样对科技感兴趣且获奖无数的牛X同学，还遇到了理解我们、为我们创造特殊环境的良师。在这样的环境下，我们不仅能学到课外的知识和技术，还能享受到特殊的资源和待遇。
            </p>
            <p>
              大学毕业前我几乎只知道用电脑打游戏，我至今都认为年轻时有机会玩就多玩玩绝对没错（哪怕不是游戏，只要是你喜欢的事情就可以），毕业后的我甚至没意识到要工作了，学了点编程就开始工作了。好在编程是我感兴趣的，它与我过往我折腾的机器是相辅相成的，软件的开发、硬件的组装结合起来让我对科技更着迷了。
            </p>
            <p>
              我应该是有点神经质的那种喵，我的发挥经常和状态挂钩。有时候我神智不清、像灵魂出窍般走路都是飘的。猛的时候反差感极其墙裂。
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://space.bilibili.com/4793911"
              icon={BilibiliIcon}
            >
              关注我的Bilibili
            </SocialLink>
            <SocialLink
              href="https://github.com/tawnylab"
              icon={GitHubIcon}
              className="mt-4"
            >
              关注我的GitHub
            </SocialLink>
            <SocialLink
              href="mailto:shawntynji@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-line pt-8"
            >
              shawntynji@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
