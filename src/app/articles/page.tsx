import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata: Metadata = {
  title: '博客',
  description:
    '这里是我的一些编程、三维打印、毕业设计、游戏等内容的随笔，按时间顺序整理收集。',
}

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="随便写点"
      intro="这里是我的一些编程、三维打印、毕业设计、游戏等内容的随笔，按时间顺序整理收集。"
    >
      <div className="md:border-l md:border-line md:pl-6">
        <StaggerGroup className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <MagneticHover key={article.slug} strength={0.1}>
              <Article article={article} />
            </MagneticHover>
          ))}
        </StaggerGroup>
      </div>
    </SimpleLayout>
  )
}