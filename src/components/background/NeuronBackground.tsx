import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  violet: boolean
}

export function NeuronBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let nodes: Node[] = []
    let frame = 0
    const mouse = { x: -1000, y: -1000 }

    const init = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = width < 640 ? 20 : width < 1100 ? 30 : 44
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: 0.8 + Math.random() * 1.6,
        violet: Math.random() > 0.62,
      }))
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i]
        if (!a) continue
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j]
          if (!b) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.hypot(dx, dy)
          if (distance > 150) continue
          const alpha = (1 - distance / 150) * 0.18
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.strokeStyle = a.violet
            ? `rgba(167, 139, 250, ${alpha})`
            : `rgba(34, 211, 238, ${alpha})`
          context.lineWidth = 0.7
          context.stroke()
        }

        const mouseDistance = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (mouseDistance < 180) {
          const alpha = (1 - mouseDistance / 180) * 0.3
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(mouse.x, mouse.y)
          context.strokeStyle = `rgba(34, 211, 238, ${alpha})`
          context.lineWidth = 0.6
          context.stroke()
        }

        const glow = context.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.radius * 5)
        glow.addColorStop(
          0,
          a.violet ? 'rgba(167,139,250,0.75)' : 'rgba(34,211,238,0.8)',
        )
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(a.x, a.y, a.radius * 5, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = a.violet
          ? 'rgba(196,181,253,0.9)'
          : 'rgba(125,211,252,0.9)'
        context.beginPath()
        context.arc(a.x, a.y, a.radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const update = () => {
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < -20) node.x = width + 20
        if (node.x > width + 20) node.x = -20
        if (node.y < -20) node.y = height + 20
        if (node.y > height + 20) node.y = -20
      }
    }

    const loop = () => {
      if (!reduceMotion) update()
      draw()
      if (!reduceMotion) frame = requestAnimationFrame(loop)
    }

    const onResize = () => {
      init()
      draw()
    }
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }
    const onMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    init()
    loop()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseout', onMouseLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 z-0 h-full w-full', className)}
    />
  )
}
