import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: '我用的',
  description: '我青睐的设备、软件、开发框架，以及其他我的推荐。',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="我青睐的设备、软件、开发框架，以及其他我的推荐。"
      intro={'很多人问过我“用的什么服务器？有没有推荐的机器？项目用什么开发的？”。我认为多尝试找到自己顺手的才对。这是我觉得好用的东西的清单（仅供参考）。'}
    >
      <StaggerGroup className="space-y-20">
        <ToolsSection title="工作站">
          <Tool title="戴尔 PowerEdge R7515 / 银欣 CS351">
            企业级的不间断运行的服务器机箱，适用于动手能力强、对电脑硬件熟悉、有隔音放置空间的DIY爱好者。能够自行选择硬件配置和操作系统，组NAS阵列，部署实用的开源项目。
          </Tool>
          <Tool title="Mac mini">
            小巧的盒子，强大的性能和能耗比。无需主动散热，不占空间随意摆放，绝佳的台式机选择。
          </Tool>
          <Tool title="Apple 妙控触摸板">
            谁用谁知道，丝般顺滑，赋予Mac OS绝佳体验的外设。
          </Tool>
        </ToolsSection>
        <ToolsSection title="开发工具">
          <Tool title="VS Code">
            我几乎只用这一款编辑器开发编写所有常用的编程语言（JS/TS、Python、Java等）。
          </Tool>
          <Tool title="iTerm2">
            Mac OS的终端的替代品，功能不谈，总是就是非常好看！
          </Tool>
          <Tool title="Draw.io">流程图绘制工具。</Tool>
          <Tool title="Next JS">
            React的全栈框架。已经成熟的生产级框架，还将有新的功能（服务端组件、优化编译器等）和迭代的v15大版本更新到来。
          </Tool>
          <Tool title="Tailwind CSS">
            任何前端框架中，我都会使用的原子级CSS框架。优秀的响应式页面设计语法。Nextjs集成的默认选项。将迎来v4大版本更新。
          </Tool>
          <Tool title="Tauri">
            静态网站的多端应用封装框架，适合响应式页面，使用系统自带的浏览器内核的轻量级框架，将迎来v2大版本更新支持移动端。
          </Tool>
        </ToolsSection>
        <ToolsSection title="设计">
          <Tool title="Tailwind UI">
            精美的UI组件和网站模版，这个网站就是基于Spotlight模版二开的。
          </Tool>
        </ToolsSection>
        <ToolsSection title="家庭服务">
          <Tool title="Unraid / TrueNAS">
            想DIY一台NAS的话，从两个系统中选一个即可。Unraid为收费闭源，无需整列卡，任何多余的闲置硬盘都可以随时添加以扩容，最多支持两块校验盘（相当于Z2阵列，至多损坏两块硬盘的极端情况下维持数据可用性）。TrueNAS开源免费，需要阵列卡，需要对整列的特性有了解后选择适合自己的，选定阵列后根据阵列特性的不同会影响后续扩容。想进一步保护数据可以加个UPS。有NAS后全家都有巨大的网络硬盘空间，还不怕丢数据，还能装各种开源服务，包爽的！
          </Tool>
          <Tool title="Home Assistant">
            智能家居的中枢，可以将多方智能设备接入，统一使用你青睐的应用或语言助手控制所有设备。
          </Tool>
          <Tool title="BitWarden">
            开源密码管理器，统一管理所有应用的密码、2FA、信用卡等，本地私有化保存，自动生成复杂密码（自己都不知道的那种），多端同步。
          </Tool>
          <Tool title="Nextcloud">
            开源网盘，在线编辑文档，查阅照片，移动端照片视频上传。
          </Tool>
          <Tool title="Jellyfin">
            开源影音系统，小电影自动刮削，硬件解码，用户管理，公网给好友分享。
          </Tool>
          <Tool title="Gitea">
            开源代码仓库，信不过公网服务就本地私有化部署一个git仓库。
          </Tool>
        </ToolsSection>
      </StaggerGroup>
    </SimpleLayout>
  )
}
