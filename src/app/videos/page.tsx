import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { formatDate } from '@/lib/formatDate'

function VideoSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Appearance({
  title,
  description,
  date,
  cta,
  href,
}: {
  title: string
  description: string
  date: string
  cta: string
  href: string
}) {
  return (
    <MagneticHover strength={0.08}>
      <Card as="article">
        <Card.Title as="h3" href={href}>
          {title}
        </Card.Title>
        <Card.Eyebrow decorate>{formatDate(date)}</Card.Eyebrow>
        <Card.Description>{description}</Card.Description>
        <Card.Cta>{cta}</Card.Cta>
      </Card>
    </MagneticHover>
  )
}

export const metadata: Metadata = {
  title: '视频',
  description: '通过视频发布的内容更丰富。',
}

export default function Videos() {
  return (
    <SimpleLayout
      title="通过视频发布的内容更丰富。"
      intro="这里是我去各地游玩、演唱会、编程解说、游戏录屏、摄影等视频的分享。"
    >
      <StaggerGroup className="space-y-20">
        <VideoSection title="演唱会">
          <Appearance
            href="https://www.bilibili.com/video/BV1ro4heJEkJ/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="周杰伦"
            description='"嘉年华"世界巡回演唱会（2024杭州站）'
            date="2024-04-19"
            cta="观看 Live 录像"
          />
          <Appearance
            href="https://www.bilibili.com/video/BV1nC411h7c7/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="林俊杰"
            description='"JJ20"世界巡回演唱会（2024杭州站）'
            date="2024-03-17"
            cta="观看 Live 录像"
          />
        </VideoSection>
        <VideoSection title="计算机科学">
          <Appearance
            href="https://www.bilibili.com/video/BV1Lw4m1d7mt/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="仿ChatGPT"
            description="独立开发的ChatGPT仿项目介绍。"
            date="2024-03-13"
            cta="观看介绍"
          />
          <Appearance
            href="https://www.bilibili.com/video/BV1Uj411g7qt/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="私有云、家用NAS、企业级服务器"
            description="家用NAS系统介绍、开源自部署项目推荐。"
            date="2023-03-04"
            cta="观看介绍"
          />
        </VideoSection>
      </StaggerGroup>
    </SimpleLayout>
  )
}
