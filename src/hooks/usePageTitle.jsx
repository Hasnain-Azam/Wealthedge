import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Sets the tab title based on the current path.
 * Centralized so you don't have to touch each page.
 */
export default function usePageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    let title = 'WealthEdge'
    if (pathname === '/' || pathname === '/dashboard') {
      title = 'WealthEdge – Dashboard'
    } else if (pathname.startsWith('/login')) {
      title = 'WealthEdge – Sign In'
    } else if (pathname.startsWith('/register')) {
      title = 'WealthEdge – Create Account'
    }
    document.title = title
  }, [pathname])
}
