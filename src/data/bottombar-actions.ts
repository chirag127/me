import type { BottomBarAction } from '@chirag127/astro-chrome/BottomBar.astro'

export const bottomBarActions: BottomBarAction[] = [
  { icon: '⌂', label: 'Home',     href: '/' },
  { icon: 'ⓘ', label: 'About',    href: '/now' },
  { icon: '◧', label: 'Projects', href: '/projects' },
  { icon: '✎', label: 'Writing',  href: '/writing' },
  { icon: '☰', label: 'Menu',     href: '#sb-toggle' },
]
