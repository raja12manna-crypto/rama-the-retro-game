import Phaser from 'phaser'
import { Enemy } from './Enemy'

export class ForestScene extends Phaser.Scene {
  private rama?: Phaser.Physics.Arcade.Sprite
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private isJumping = false
  private isAttacking = false
  private enemies: Enemy[] = []
  private attackCooldown = 0
  private enemiesDefeated = 0
  private onGameEnd: (score: number) => void
  private gameTime = 0
  private maxGameTime = 300 // 5 minutes in seconds
  private scoreText?: Phaser.GameObjects.Text
  private timerText?: Phaser.GameObjects.Text

  constructor(onGameEnd: (score: number) => void) {
    super({ key: 'ForestScene' })
    this.onGameEnd = onGameEnd
  }

  create() {
    // Set background
    this.cameras.main.setBackgroundColor('#1a1a2e')

    // Create platforms (ground)
    this.platforms = this.physics.add.staticGroup()
    const ground = this.add.rectangle(400, 560, 800, 40, 0x8b7355)
    this.physics.add.existing(ground, true)
    this.platforms.add(ground)

    // Create Rama character
    this.rama = this.physics.add.sprite(100, 400)
    this.rama.setBounce(0.1)
    this.rama.setCollideWorldBounds(true)

    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0xd4a574, 1)
    graphics.fillRect(0, 0, 32, 48)
    graphics.generateTexture('rama-sprite', 32, 48)
    graphics.destroy()

    this.rama.setTexture('rama-sprite')
    this.rama.setDisplaySize(32, 48)

    // Setup input
    this.cursors = this.input.keyboard?.createCursorKeys()
    this.input.keyboard?.on('keydown-Z', () => this.attack())
    this.input.keyboard?.on('keydown-E', () => this.endGame())

    // Add collision
    this.physics.add.collider(this.rama, this.platforms, () => {
      this.isJumping = false
    })

    // Create enemies
    this.spawnEnemies()

    // UI
    this.add.text(16, 16, '🏹 RAMA: The Retro Game', {
      fontSize: '24px',
      color: '#d4a574',
      fontFamily: 'Arial',
    })

    this.add.text(16, 50, '← → Move  |  SPACE Jump  |  Z Attack  |  E End Game', {
      fontSize: '14px',
      color: '#f5f5f5',
      fontFamily: 'Arial',
    })

    this.scoreText = this.add.text(16, 85, `Enemies Defeated: 0`, {
      fontSize: '14px',
      color: '#00ff00',
      fontFamily: 'Arial',
    })

    this.timerText = this.add.text(16, 110, `Time: 5:00`, {
      fontSize: '14px',
      color: '#ffff00',
      fontFamily: 'Arial',
    })
  }

  spawnEnemies() {
    const enemy1 = new Enemy(this, 300, 450)
    const enemy2 = new Enemy(this, 550, 450)
    this.enemies = [enemy1, enemy2]

    this.enemies.forEach(enemy => {
      this.physics.add.collider(enemy, this.platforms)
      
      this.physics.add.overlap(this.rama, enemy, () => {
        if (this.isAttacking) {
          enemy.destroy()
          this.enemies = this.enemies.filter(e => e !== enemy)
          this.enemiesDefeated++
          this.updateScore()

          // Spawn new enemy when one is defeated
          if (this.enemies.length === 0) {
            setTimeout(() => this.spawnNewEnemy(), 1000)
          }
        }
      })
    })
  }

  spawnNewEnemy() {
    const randomX = Math.random() > 0.5 ? 250 : 550
    const newEnemy = new Enemy(this, randomX, 450)
    this.enemies.push(newEnemy)

    this.physics.add.collider(newEnemy, this.platforms)

    this.physics.add.overlap(this.rama, newEnemy, () => {
      if (this.isAttacking) {
        newEnemy.destroy()
        this.enemies = this.enemies.filter(e => e !== newEnemy)
        this.enemiesDefeated++
        this.updateScore()

        if (this.enemies.length === 0) {
          setTimeout(() => this.spawnNewEnemy(), 1000)
        }
      }
    })
  }

  updateScore() {
    if (this.scoreText) {
      this.scoreText.setText(`Enemies Defeated: ${this.enemiesDefeated}`)
    }
  }

  updateTimer() {
    if (this.timerText) {
      const minutes = Math.floor(this.gameTime / 60)
      const seconds = this.gameTime % 60
      this.timerText.setText(
        `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`
      )
    }
  }

  endGame() {
    const finalScore = this.enemiesDefeated * 100
    this.onGameEnd(finalScore)
  }

  attack() {
    if (this.attackCooldown > 0 || !this.rama) return

    this.isAttacking = true
    this.attackCooldown = 30

    this.rama.setTint(0xff0000)
    setTimeout(() => {
      this.rama?.clearTint()
      this.isAttacking = false
    }, 200)
  }

  update() {
    if (!this.rama || !this.cursors) return

    // Update timer
    this.gameTime += 1 / 60
    this.updateTimer()

    // End game if time runs out
    if (this.gameTime >= this.maxGameTime) {
      this.endGame()
      return
    }

    // Decrease cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown--
    }

    // Movement
    if (this.cursors.left?.isDown) {
      this.rama.setVelocityX(-200)
    } else if (this.cursors.right?.isDown) {
      this.rama.setVelocityX(200)
    } else {
      this.rama.setVelocityX(0)
    }

    // Jump
    if (this.cursors.space?.isDown && !this.isJumping) {
      this.rama.setVelocityY(-400)
      this.isJumping = true
    }

    // Update enemies
    this.enemies.forEach(enemy => enemy.update())
  }
}