import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { cn } from '../lib/cn'
import { GameScene } from './GameScene'

interface GameStageProps {
  sceneKey: string
  className?: string
}

/**
 * Mounts the Phaser world once and swaps its procedural scene when the
 * student moves between the map and a level. React renders all interactive
 * UI on top, which keeps the game keyboard/touch friendly and accessible.
 */
export function GameStage({ sceneKey, className }: GameStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<GameScene | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new GameScene()
    sceneRef.current = scene

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      scene: [scene],
      audio: { noAudio: true },
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        powerPreference: 'high-performance',
      },
      fps: { target: 60 },
    })

    return () => {
      sceneRef.current = null
      game.destroy(true)
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.setTheme(sceneKey)
  }, [sceneKey])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none h-full w-full overflow-hidden', className)}
    />
  )
}
