/**
 * Zero-overhead mouse tracking for Linear-style spotlight glow
 * Sets CSS custom properties --mouse-x and --mouse-y on the hovered element.
 */
export const useSpotlight = () => {
  const onMouseMove = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return {
    onMouseMove
  }
}
