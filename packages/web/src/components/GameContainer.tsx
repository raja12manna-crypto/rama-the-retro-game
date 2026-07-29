import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { ForestScene } from '../scenes/ForestScene'

interface GameContainerProps {
  onGameEnd: (score: number) => void
}

export const GameContainer = ({ onGameEnd }: GameContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 800 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [new ForestScene(onGameEnd)],
      backgroundColor: '#000000',
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
      }
    }
  }, [onGameEnd])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: '#000',
      }}
    />
  )
}