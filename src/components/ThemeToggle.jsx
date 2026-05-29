import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getTheme, toggleTheme, applyTheme } from '../lib/theme.js'

export default function ThemeToggle() {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    const t = getTheme()
    setThemeState(t)
    applyTheme(t)
  }, [])

  function onClick() {
    const next = toggleTheme()
    setThemeState(next)
  }

  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
