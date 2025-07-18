"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Detects if the current viewport width is below the mobile breakpoint.
 * Returns a boolean indicating “is mobile”.
 */
export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Create a media-query list for changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const handleChange = () => setIsMobile(mql.matches)

    // Initial value
    handleChange()

    // Listen for viewport changes
    mql.addEventListener("change", handleChange)
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  return isMobile
}

/* Optional: keep the old name as an alias if other files still import it */
export const useIsMobile = useMobile
