import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-ink font-semibold text-paper hover:bg-ink-soft active:bg-ink active:text-paper/70',
  secondary:
    'bg-paper-raised font-medium text-ink hover:bg-paper active:bg-paper active:text-ink/60',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
