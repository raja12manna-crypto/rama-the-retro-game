import Phaser from 'phaser'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private speed = 100
  private direction = 1
  private minX = 50
  private maxX = 750

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setBounce(0)
    this.setCollideWorldBounds(false)

    // Draw enemy as red rectangle
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0xff4444, 1) // Red color
    graphics.fillRect(0, 0, 32, 48)
    graphics.generateTexture('enemy-sprite', 32, 48)
    graphics.destroy()

    this.setTexture('enemy-sprite')
    this.setDisplaySize(32, 48)
  }

  update() {
    // Patrol back and forth
    if (this.x > this.maxX) {
      this.direction = -1
    } else if (this.x < this.minX) {
      this.direction = 1
    }

    this.setVelocityX(this.speed * this.direction)
  }
}