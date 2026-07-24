import { type Metadata } from 'next'
import Image from 'next/image'
import { IconCode, type Icon } from '@tabler/icons-react'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TiltCard } from '@/components/motion/TiltCard'
import logoAIGCBrotian from '@/images/logos/brotian.svg'

type Project = {
  name: string
  description: string
  link: { href: string; label: string }
  logo: string | null
  Logo: Icon | null
}

const projects: Project[] = [
  {
    name: '毕业设计（2024）',
    description: '我的2024届复旦专升本毕业设计，定格版本的开源项目。',
    link: { href: 'https://github.com/tawnylab', label: 'github.com' },
    logo: logoAIGCBrotian,
    Logo: null,
  },
  {
    name: 'llama.cpp',
    description: 'C/C++ 编写的高性能大模型推理引擎。',
    link: {
      href: 'https://github.com/ggml-org/llama.cpp',
      label: 'github.com',
    },
    logo: null,
    Logo: IconCode,
  },
  {
    name: 'vllm',
    description: '高吞吐、低显存占用的大模型推理与服务引擎，人人易用。',
    link: {
      href: 'https://github.com/vllm-project/vllm',
      label: 'github.com',
    },
    logo: null,
    Logo: IconCode,
  },
  {
    name: 'litellm',
    description:
      '轻量级 LLM 网关，Rust 内核 + Python SDK，统一调用 100+ LLM 接口。',
    link: {
      href: 'https://github.com/BerriAI/litellm',
      label: 'github.com',
    },
    logo: null,
    Logo: IconCode,
  },
  {
    name: 'pi-agent',
    description:
      'AI Agent 工具包：统一 LLM 接口、Agent 循环、TUI 与编码 Agent CLI。',
    link: {
      href: 'https://github.com/earendil-works/pi',
      label: 'github.com',
    },
    logo: null,
    Logo: IconCode,
  },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: '项目',
  description: '在互联网时代，留下轻描淡写的一笔“天酱到此一游”。',
}

export default function Projects() {
  return (
    <SimpleLayout
      title={'在互联网时代，留下轻描淡写的一笔“天酱到此一游”。'}
      intro="短短几年，我见识了不少项目。这些是我参与过的或是我墙裂推荐的项目，其中有些是开源项目、有些是我独立开发的。"
    >
      <StaggerGroup
        as="ul"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <TiltCard key={project.name} maxTilt={4} className="h-full">
            <Card as="li" className="h-full">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-paper-raised shadow-[var(--shadow-card)] ring-1 ring-line">
                {project.logo ? (
                  <Image
                    src={project.logo}
                    alt=""
                    className="size-8"
                    unoptimized
                  />
                ) : project.Logo ? (
                  <project.Logo
                    className="size-6 text-ink-soft"
                    stroke={1.5}
                  />
                ) : null}
              </div>
              <h2 className="mt-6 text-base font-semibold text-ink">
                <Card.Link href={project.link.href}>{project.name}</Card.Link>
              </h2>
              <Card.Description>{project.description}</Card.Description>
              <p className="relative z-10 mt-6 flex text-sm font-medium text-muted transition group-hover:text-accent">
                <LinkIcon className="size-6 flex-none" />
                <span className="ml-2">{project.link.label}</span>
              </p>
            </Card>
          </TiltCard>
        ))}
      </StaggerGroup>
    </SimpleLayout>
  )
}