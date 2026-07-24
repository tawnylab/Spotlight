import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-accent"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-line pb-16 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-ink">
                <NavLink href="/about">我</NavLink>
                <NavLink href="/articles">博客</NavLink>
                <NavLink href="/projects">项目</NavLink>
                <NavLink href="/videos">视频</NavLink>
                <NavLink href="/uses">用品</NavLink>
                <NavLink href="/friends">友链</NavLink>
              </div>
              <p className="text-sm text-muted">
                &copy; {new Date().getFullYear()}{' '}
                上海市浦东新区合庆镇天降电脑服务部。{' '}
                <a href="https://beian.miit.gov.cn/">沪ICP备2023020526号-2</a>
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
