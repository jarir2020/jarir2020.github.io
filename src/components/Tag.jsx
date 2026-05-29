export default function Tag({ children, color = 'neutral' }) {
  const colors = {
    neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${colors[color] || colors.neutral}`}>
      {children}
    </span>
  )
}
