import clsx from 'clsx'

export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        className,
        // 暖色 prose 主题：依靠 tailwind.css 中的 @plugin typography 配合 @theme 默认
        'prose prose-zinc prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-code:text-accent prose-code:before:content-none prose-code:after:content-none max-w-none',
      )}
      {...props}
    />
  )
}