import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener for changes
    mql.addListener(onChange)
    
    // Set initial value
    setIsMobile(mql.matches)
    
    // Cleanup function to remove the event listener
    return () => {
      mql.removeListener(onChange)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/** true en pantallas de escritorio (Tailwind `lg`, 1024 px o más). */
export function useIsDesktop() {
  const query = "(min-width: 1024px)"
  const [isDesktop, setIsDesktop] = React.useState(() => typeof window !== "undefined" && window.matchMedia(query).matches)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setIsDesktop(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isDesktop
}
