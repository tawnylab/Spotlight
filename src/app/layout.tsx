import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { CursorDemo } from '@/components/CursorDemo'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - 天降电脑服务部',
    default: '天降电脑服务部 - 吾乃天酱，科技爱好者、码农。',
  },
  description:
    '哈喽！吾乃天酱，居住在魔都的独立开发者。正在探索AIGC和三维打印领域。',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
          <CursorDemo />
        </Providers>
      </body>
    </html>
  )
}
