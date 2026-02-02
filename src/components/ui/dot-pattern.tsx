"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface DotPatternProps {
  className?: string
  children?: React.ReactNode
  /** Dot diameter in pixels */
  dotSize?: number
  /** Gap between dots in pixels */
  gap?: number
  /** Base dot color (hex) */
  baseColor?: string
  /** Glow color on hover (hex) */
  glowColor?: string
  /** Mouse proximity radius for highlighting */
  proximity?: number
  /** Glow intensity multiplier */
  glowIntensity?: number
  /** Wave animation speed (0 to disable) */
  waveSpeed?: number
  /** Parallax scroll multiplier (0.5 = dots move at half scroll speed) */
  parallaxSpeed?: number
  /** Enable ambient ripple waves */
  enableRipples?: boolean
  /** Average seconds between ripple spawns */
  rippleInterval?: number
  /** Max concurrent ripples */
  maxRipples?: number
  /** Ripple visual intensity 0-1 */
  rippleIntensity?: number
}

/** Ripple wave data structure */
interface RippleWave {
  x: number
  y: number
  radius: number
  maxRadius: number
  birthTime: number
  lifetime: number
  intensity: number
  ringWidth: number
  colorVariant: number // 0 = standard, 1 = warm, 2 = deep
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

interface Dot {
  x: number
  y: number
  baseOpacity: number
}

// Color variants for ripples (gold palette)
const RIPPLE_COLORS = {
  standard: { r: 232, g: 181, b: 77 },  // #E8B54D - bright gold
  warm: { r: 245, g: 217, b: 138 },     // #F5D98A - pale gold
  deep: { r: 184, g: 160, b: 74 },      // #B8A04A - dark gold
}

export function DotPattern({
  className,
  children,
  dotSize = 2,
  gap = 24,
  baseColor = "#404040",
  glowColor = "#22d3ee",
  proximity = 120,
  glowIntensity = 1,
  waveSpeed = 0.5,
  parallaxSpeed = 0.5,
  enableRipples = true,
  rippleInterval = 2.5,
  maxRipples = 4,
  rippleIntensity = 0.85,
}: DotPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef(Date.now())
  const scrollYRef = useRef(0)
  const gridOffsetRef = useRef(0)
  const [isClient, setIsClient] = useState(false)

  // Ripple wave state
  const wavesRef = useRef<RippleWave[]>([])
  const lastWaveSpawnRef = useRef<number>(0)
  const prefersReducedMotion = useRef(false)

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor])
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor])

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  // Get the full document height
  const getDocumentHeight = useCallback(() => {
    if (typeof document === 'undefined') return 0
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
  }, [])

  // Build a grid that covers the entire document
  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    const dpr = window.devicePixelRatio || 1
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const documentHeight = getDocumentHeight()

    // Calculate canvas height needed:
    // When scrolled to bottom, parallax offset = documentHeight * parallaxSpeed
    // Canvas needs to cover viewport + parallax movement range
    const maxParallaxOffset = documentHeight * parallaxSpeed
    const canvasHeight = documentHeight + viewportHeight

    canvas.width = viewportWidth * dpr
    canvas.height = canvasHeight * dpr
    canvas.style.width = `${viewportWidth}px`
    canvas.style.height = `${canvasHeight}px`

    const ctx = canvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)

    const cellSize = dotSize + gap
    const cols = Math.ceil(viewportWidth / cellSize) + 1
    const rows = Math.ceil(canvasHeight / cellSize) + 1

    const offsetX = (viewportWidth - (cols - 1) * cellSize) / 2
    const offsetY = cellSize / 2

    const dots: Dot[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * cellSize,
          y: offsetY + row * cellSize,
          baseOpacity: 0.15 + Math.random() * 0.15,
        })
      }
    }
    dotsRef.current = dots
  }, [dotSize, gap, getDocumentHeight, parallaxSpeed])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const { x: mx, y: my } = mouseRef.current
    const proxSq = proximity * proximity
    const currentTime = Date.now()
    const time = (currentTime - startTimeRef.current) * 0.001 * waveSpeed

    // Calculate visible area based on scroll
    const scrollOffset = gridOffsetRef.current

    // OPTIMIZATION: Only process dots in visible viewport + buffer
    const viewportHeight = window.innerHeight
    const bufferSize = 200 // Extra pixels above/below viewport
    const visibleTop = scrollOffset - bufferSize
    const visibleBottom = scrollOffset + viewportHeight + bufferSize

    // === RIPPLE WAVE MANAGEMENT ===
    if (enableRipples && !prefersReducedMotion.current) {
      // Spawn new waves periodically
      const timeSinceLastSpawn = currentTime - lastWaveSpawnRef.current
      const spawnThreshold = (rippleInterval * 1000) + (Math.random() - 0.5) * 2000

      if (timeSinceLastSpawn > spawnThreshold && wavesRef.current.length < maxRipples) {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const scrollY = scrollYRef.current

        // Spawn position with padding from edges
        const padding = 150
        const x = padding + Math.random() * (viewportWidth - padding * 2)
        // Account for scroll position and parallax offset
        const y = scrollOffset + padding + Math.random() * (viewportHeight - padding * 2)

        // Determine color variant (60% standard, 25% warm, 15% deep)
        const colorRoll = Math.random()
        const colorVariant = colorRoll < 0.6 ? 0 : colorRoll < 0.85 ? 1 : 2

        wavesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: 300 + Math.random() * 450,  // 300-750px (larger waves)
          birthTime: currentTime,
          lifetime: 3000 + Math.random() * 3000,  // 3-6 seconds (longer life)
          intensity: 0.6 + Math.random() * 0.4,   // 0.6-1.0 (much stronger)
          ringWidth: 70 + Math.random() * 60,     // 70-130px (thicker rings)
          colorVariant,
        })
        lastWaveSpawnRef.current = currentTime
      }

      // Update and cull waves
      wavesRef.current = wavesRef.current.filter(wave => {
        const age = currentTime - wave.birthTime
        if (age > wave.lifetime) return false // Remove dead waves

        // Expand wave radius with easing (fast start, slow end)
        const progress = age / wave.lifetime
        const easedProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        wave.radius = wave.maxRadius * easedProgress

        return true
      })
    }

    // === RENDER DOTS (only visible ones) ===
    for (const dot of dotsRef.current) {
      // OPTIMIZATION: Skip dots outside visible area
      if (dot.y < visibleTop || dot.y > visibleBottom) continue

      // Adjust mouse position relative to the dot grid
      const adjustedMy = my + scrollOffset

      const dx = dot.x - mx
      const dy = dot.y - adjustedMy
      const distSq = dx * dx + dy * dy

      // Wave animation - subtle flowing effect
      const wave = Math.sin(dot.x * 0.015 + dot.y * 0.015 + time) * 0.5 + 0.5
      const waveOpacity = dot.baseOpacity + wave * 0.1
      const waveScale = 1 + wave * 0.15

      let opacity = waveOpacity
      let scale = waveScale
      let r = baseRgb.r
      let g = baseRgb.g
      let b = baseRgb.b
      let glow = 0

      // === RIPPLE WAVE EFFECTS ===
      if (enableRipples && !prefersReducedMotion.current) {
        for (const ripple of wavesRef.current) {
          // Calculate distance from dot to ripple center
          const rdx = dot.x - ripple.x
          const rdy = dot.y - ripple.y
          const distFromCenter = Math.sqrt(rdx * rdx + rdy * rdy)

          // Ring effect: peak intensity at the ring edge, fading inside and outside
          const distFromRing = Math.abs(distFromCenter - ripple.radius)

          // Early exit: skip if dot is too far from the ring
          if (distFromRing > ripple.ringWidth * 1.5) continue

          // Calculate ring intensity with smooth falloff
          const ringFalloff = 1 - (distFromRing / ripple.ringWidth)
          const clampedFalloff = Math.max(0, ringFalloff)

          // Age-based fade: waves fade out as they expand
          const age = currentTime - ripple.birthTime
          const lifeProgress = age / ripple.lifetime
          const ageFade = 1 - lifeProgress * lifeProgress // Quadratic fade out

          // Combined intensity
          const effectIntensity = clampedFalloff * ripple.intensity * ageFade * rippleIntensity

          if (effectIntensity > 0.01) {
            // Get ripple color based on variant
            const rippleColor = ripple.colorVariant === 0
              ? RIPPLE_COLORS.standard
              : ripple.colorVariant === 1
                ? RIPPLE_COLORS.warm
                : RIPPLE_COLORS.deep

            // Blend color toward ripple color (stronger color shift)
            const colorBlend = effectIntensity * 0.85
            r = Math.round(r + (rippleColor.r - r) * colorBlend)
            g = Math.round(g + (rippleColor.g - g) * colorBlend)
            b = Math.round(b + (rippleColor.b - b) * colorBlend)

            // Boost opacity and scale (much more visible)
            opacity = Math.min(1, opacity + effectIntensity * 0.7)
            scale += effectIntensity * 0.65

            // Add stronger glow for ripples
            glow = Math.max(glow, effectIntensity * 0.85)
          }
        }
      }

      // Mouse proximity effect (strongest - takes priority)
      if (distSq < proxSq) {
        const dist = Math.sqrt(distSq)
        const t = 1 - dist / proximity
        const easedT = t * t * (3 - 2 * t) // smoothstep

        // Interpolate color toward glow color
        r = Math.round(r + (glowRgb.r - r) * easedT)
        g = Math.round(g + (glowRgb.g - g) * easedT)
        b = Math.round(b + (glowRgb.b - b) * easedT)

        opacity = Math.min(1, opacity + easedT * 0.6)
        scale += easedT * 0.6
        glow = Math.max(glow, easedT * glowIntensity)
      }

      const radius = (dotSize / 2) * scale

      // Draw glow (only for significant glow values to save performance)
      if (glow > 0.15) {
        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 4)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glow * 0.4})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${glow * 0.1})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Draw dot
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [proximity, baseRgb, glowRgb, dotSize, glowIntensity, waveSpeed, enableRipples, rippleInterval, maxRipples, rippleIntensity])

  // Set client flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle scroll - move the canvas with parallax
  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      scrollYRef.current = scrollY

      // Calculate parallax offset - dots move slower than scroll
      const parallaxOffset = scrollY * parallaxSpeed
      gridOffsetRef.current = parallaxOffset

      // Move the canvas container
      if (containerRef.current) {
        // Offset the container so dots appear to move with scroll but slower
        const translateY = -parallaxOffset
        containerRef.current.style.transform = `translateY(${translateY}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [parallaxSpeed, isClient])

  // Rebuild grid on resize or content change
  useEffect(() => {
    if (!isClient) return

    // Delay initial build to ensure DOM is ready
    const initialBuildTimeout = setTimeout(() => {
      buildGrid()
    }, 100)

    const handleResize = () => {
      buildGrid()
    }

    // Watch for DOM changes that might affect document height
    // Debounce to avoid excessive rebuilds
    let rebuildTimeout: NodeJS.Timeout | null = null
    const observer = new MutationObserver(() => {
      if (rebuildTimeout) clearTimeout(rebuildTimeout)
      rebuildTimeout = setTimeout(() => buildGrid(), 150)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    })

    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(initialBuildTimeout)
      if (rebuildTimeout) clearTimeout(rebuildTimeout)
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [buildGrid, isClient])

  // Start animation loop
  useEffect(() => {
    if (!isClient) return

    animationRef.current = requestAnimationFrame(draw)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [draw, isClient])

  // Handle mouse movement
  useEffect(() => {
    if (!isClient) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isClient])

  // Don't render on server
  if (!isClient) {
    return (
      <div
        className={cn("fixed inset-0", className)}
        style={{
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-visible", className)}
      style={{
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{
          willChange: "contents",
        }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

export default function DotPatternDemo() {
  return <DotPattern />
}
