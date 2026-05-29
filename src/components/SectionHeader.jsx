export default function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`mb-8 ${alignCls} max-w-3xl`}>
      {eyebrow && (
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-2 uppercase tracking-wider">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      {subtitle && (
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">{subtitle}</p>
      )}
    </div>
  )
}
