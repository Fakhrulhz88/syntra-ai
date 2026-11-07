import Phaser from 'phaser'

interface Palette {
  top: number
  bottom: number
  accent: number
  accent2: number
  glow: number
  sea: number
}

const PALETTES: Record<string, Palette> = {
  map: {
    top: 0x061027,
    bottom: 0x081b2b,
    accent: 0x22d3ee,
    accent2: 0xf5c451,
    glow: 0x7dd3fc,
    sea: 0x082033,
  },
  pelabuhan: {
    top: 0x0a1430,
    bottom: 0x16305a,
    accent: 0xf5c451,
    accent2: 0x22d3ee,
    glow: 0xffe8b0,
    sea: 0x0a2a44,
  },
  istana: {
    top: 0x120b2b,
    bottom: 0x231444,
    accent: 0xf5c451,
    accent2: 0xa78bfa,
    glow: 0xffd9a0,
    sea: 0x180f30,
  },
  medan_perang: {
    top: 0x150a18,
    bottom: 0x2b1220,
    accent: 0xfb7185,
    accent2: 0xf5c451,
    glow: 0xffb4a2,
    sea: 0x1a0b18,
  },
  firewall: {
    top: 0x040b1d,
    bottom: 0x071a2c,
    accent: 0x22d3ee,
    accent2: 0x7dd3fc,
    glow: 0x67e8f9,
    sea: 0x04121f,
  },
  vault: {
    top: 0x0c0620,
    bottom: 0x1a0f38,
    accent: 0xa78bfa,
    accent2: 0x22d3ee,
    glow: 0xc4b5fd,
    sea: 0x0c0722,
  },
  citadel: {
    top: 0x050b20,
    bottom: 0x0b1233,
    accent: 0x34d399,
    accent2: 0x22d3ee,
    glow: 0x6ee7b7,
    sea: 0x06101f,
  },
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Procedural Phaser backdrop for every level. React owns interaction and
 * accessibility; Phaser owns the animated world, particles and atmosphere.
 */
export class GameScene extends Phaser.Scene {
  private themeKey = 'map'
  private ready = false
  private resizeEvent: Phaser.Time.TimerEvent | null = null

  constructor() {
    super({ key: 'syntra-world' })
  }

  setTheme(key: string): void {
    if (key === this.themeKey) return
    this.themeKey = key
    if (this.ready) this.build()
  }

  create(): void {
    this.ready = true
    this.build()
    this.scale.on('resize', this.onResize, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this)
    })
  }

  private onResize = (): void => {
    this.resizeEvent?.remove()
    this.resizeEvent = this.time.delayedCall(160, () => this.build())
  }

  private build(): void {
    this.tweens.killAll()
    this.time.removeAllEvents()
    this.children.removeAll(true)

    const width = this.scale.width
    const height = this.scale.height
    if (width < 2 || height < 2) return

    const palette = PALETTES[this.themeKey] ?? PALETTES.map
    this.cameras.main.setBackgroundColor(palette.bottom)

    this.drawSky(width, height, palette)
    switch (this.themeKey) {
      case 'pelabuhan':
        this.drawHarbour(width, height, palette)
        break
      case 'istana':
        this.drawPalace(width, height, palette)
        break
      case 'medan_perang':
        this.drawBattle(width, height, palette)
        break
      case 'firewall':
        this.drawFirewall(width, height, palette)
        break
      case 'vault':
        this.drawVault(width, height, palette)
        break
      case 'citadel':
        this.drawCitadel(width, height, palette)
        break
      default:
        this.drawMap(width, height, palette)
        break
    }
    this.drawAmbient(width, height, palette)
  }

  private drawSky(width: number, height: number, palette: Palette): void {
    const graphics = this.add.graphics()
    graphics.fillGradientStyle(palette.top, palette.top, palette.bottom, palette.bottom, 1)
    graphics.fillRect(0, 0, width, height)

    const starCount = Math.round(Math.min(80, Math.max(24, width / 18)))
    for (let index = 0; index < starCount; index += 1) {
      const x = Math.random() * width
      const y = Math.random() * height * 0.62
      const radius = randomBetween(0.5, 1.8)
      const alpha = randomBetween(0.18, 0.75)
      const star = this.add.circle(x, y, radius, 0xffffff, alpha)
      this.tweens.add({
        targets: star,
        alpha: randomBetween(0.08, 0.28),
        duration: randomBetween(1600, 4200),
        delay: randomBetween(0, 1600),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      })
    }
  }

  private drawHarbour(width: number, height: number, palette: Palette): void {
    const horizon = height * 0.6

    const sunGlow = this.add.circle(
      width * 0.76,
      height * 0.24,
      Math.min(width, height) * 0.22,
      palette.glow,
      0.12,
    )
    this.add.circle(width * 0.76, height * 0.24, 34, palette.accent, 0.55)
    this.add.circle(width * 0.76, height * 0.24, 20, 0xfff2cc, 0.95)
    this.tweens.add({
      targets: sunGlow,
      alpha: { from: 0.08, to: 0.2 },
      scale: { from: 1, to: 1.08 },
      duration: 5200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    const sea = this.add.graphics()
    sea.fillGradientStyle(palette.sea, palette.sea, 0x04101d, 0x04101d, 1)
    sea.fillRect(0, horizon, width, height - horizon)

    const hills = this.add.graphics()
    hills.fillStyle(0x081427, 1)
    hills.beginPath()
    hills.moveTo(0, horizon)
    hills.lineTo(width * 0.08, horizon - 44)
    hills.lineTo(width * 0.18, horizon - 20)
    hills.lineTo(width * 0.3, horizon - 58)
    hills.lineTo(width * 0.42, horizon - 18)
    hills.lineTo(width * 0.52, horizon)
    hills.closePath()
    hills.fillPath()
    hills.fillStyle(0x050e1c, 1)
    hills.beginPath()
    hills.moveTo(width * 0.55, horizon)
    hills.lineTo(width * 0.68, horizon - 32)
    hills.lineTo(width * 0.8, horizon - 12)
    hills.lineTo(width * 0.92, horizon - 40)
    hills.lineTo(width, horizon)
    hills.closePath()
    hills.fillPath()

    this.drawWaves(width, height, horizon, palette)
    this.drawCity(width, horizon, palette)
    this.drawPalm(width * 0.1, horizon + 8, 0.9)
    this.drawPalm(width * 0.88, horizon + 18, 1.1)
    this.drawShip(width * 0.3, horizon + 26, 0.9)
    this.drawShip(width * 0.62, horizon + 52, 1.25)
    this.drawShip(width * 0.82, horizon + 22, 0.65)

    this.drawCloud(width * 0.2, height * 0.14, 90, palette)
    this.drawCloud(width * 0.58, height * 0.09, 120, palette)
  }

  private drawWaves(
    width: number,
    height: number,
    horizon: number,
    palette: Palette,
  ): void {
    const waves = this.add.container(0, 0)
    const graphics = this.add.graphics()
    for (let row = 0; row < 5; row += 1) {
      const y = horizon + 18 + row * ((height - horizon) / 6)
      graphics.lineStyle(1, palette.accent, 0.1 + row * 0.025)
      const points: Phaser.Geom.Point[] = []
      for (let x = -40; x < width + 40; x += 6) {
        const offset = Math.sin((x / 56) * Math.PI) * 4
        points.push(new Phaser.Geom.Point(x, y + offset))
      }
      graphics.strokePoints(points)
    }
    waves.add(graphics)
    this.tweens.add({
      targets: waves,
      x: -56,
      duration: 5200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  private drawCity(width: number, horizon: number, palette: Palette): void {
    const city = this.add.graphics()
    city.fillStyle(0x050d1b, 1)
    city.fillRect(width * 0.02, horizon - 34, width * 0.2, 36)
    city.fillRect(width * 0.05, horizon - 58, width * 0.05, 24)
    city.fillRect(width * 0.14, horizon - 48, width * 0.04, 16)
    city.fillTriangle(
      width * 0.05,
      horizon - 58,
      width * 0.075,
      horizon - 72,
      width * 0.1,
      horizon - 58,
    )
    city.fillTriangle(
      width * 0.14,
      horizon - 48,
      width * 0.16,
      horizon - 58,
      width * 0.18,
      horizon - 48,
    )
    for (let index = 0; index < 9; index += 1) {
      city.fillStyle(index % 3 === 0 ? palette.accent : 0xf5c451, 0.55)
      city.fillRect(
        width * 0.03 + index * 12,
        horizon - 26 + (index % 2) * 9,
        3,
        4,
      )
    }

    const gate = this.add.graphics()
    gate.fillStyle(0x0a1a2c, 1)
    gate.fillRect(width * 0.7, horizon - 54, width * 0.13, 56)
    gate.fillStyle(0x071322, 1)
    gate.fillRect(width * 0.725, horizon - 30, width * 0.03, 32)
    gate.fillStyle(palette.accent, 0.16)
    gate.fillRect(width * 0.725, horizon - 30, width * 0.03, 32)
    gate.lineStyle(1, palette.accent, 0.3)
    gate.strokeRect(width * 0.7, horizon - 54, width * 0.13, 56)
  }

  private drawPalm(x: number, y: number, scale: number): void {
    const palm = this.add.container(x, y).setScale(scale)
    const graphics = this.add.graphics()
    graphics.lineStyle(3, 0x1a1206, 1)
    const trunk: Phaser.Geom.Point[] = []
    for (let step = 0; step <= 10; step += 1) {
      const t = step / 10
      const inverse = 1 - t
      trunk.push(
        new Phaser.Geom.Point(
          2 * inverse * t * 6 + t * t * 2,
          2 * inverse * t * -32 + t * t * -58,
        ),
      )
    }
    graphics.strokePoints(trunk)
    graphics.lineStyle(2, 0x1f3a24, 0.95)
    for (let index = 0; index < 6; index += 1) {
      const angle = -Math.PI / 2 + (index - 2.5) * 0.5
      const length = 30 + (index % 2) * 8
      const endX = 2 + Math.cos(angle) * length * 0.55
      const endY = -58 + Math.sin(angle) * length * 0.55
      const controlX = 2 + Math.cos(angle) * length
      const controlY = -58 + Math.sin(angle) * length + 10
      const frond: Phaser.Geom.Point[] = []
      for (let step = 0; step <= 8; step += 1) {
        const t = step / 8
        const inverse = 1 - t
        frond.push(
          new Phaser.Geom.Point(
            inverse * inverse * 2 + 2 * inverse * t * controlX + t * t * endX,
            inverse * inverse * -58 + 2 * inverse * t * controlY + t * t * endY,
          ),
        )
      }
      graphics.strokePoints(frond)
    }
    palm.add(graphics)
    this.tweens.add({
      targets: palm,
      angle: { from: -1.2, to: 1.2 },
      duration: randomBetween(3200, 4600),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  private drawShip(x: number, y: number, scale: number): void {
    const ship = this.add.container(x, y).setScale(scale)
    const graphics = this.add.graphics()
    graphics.fillStyle(0x1b1208, 1)
    graphics.fillPoints(
      [
        new Phaser.Math.Vector2(-34, 0),
        new Phaser.Math.Vector2(34, 0),
        new Phaser.Math.Vector2(24, 12),
        new Phaser.Math.Vector2(-24, 12),
      ],
      true,
    )
    graphics.lineStyle(2, 0x3b2a12, 1)
    graphics.lineBetween(0, 0, 0, -50)
    graphics.fillStyle(0xf5e6c8, 0.82)
    graphics.fillTriangle(3, -48, 3, -10, 30, -15)
    graphics.fillTriangle(-3, -42, -3, -12, -22, -16)
    graphics.fillStyle(0xf5c451, 0.9)
    graphics.fillTriangle(0, -50, 12, -44, 0, -40)
    ship.add(graphics)
    this.tweens.add({
      targets: ship,
      y: y + 7,
      angle: { from: -1.4, to: 1.4 },
      duration: randomBetween(2400, 3600),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  private drawCloud(x: number, y: number, size: number, palette: Palette): void {
    const cloud = this.add.container(x, y)
    const graphics = this.add.graphics()
    graphics.fillStyle(palette.accent2, 0.055)
    graphics.fillEllipse(0, 0, size, size * 0.26)
    graphics.fillEllipse(size * 0.28, -size * 0.06, size * 0.55, size * 0.2)
    graphics.fillEllipse(-size * 0.3, -size * 0.02, size * 0.48, size * 0.18)
    cloud.add(graphics)
    this.tweens.add({
      targets: cloud,
      x: x + size * 0.5,
      duration: randomBetween(9000, 15000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  private drawPalace(width: number, height: number, palette: Palette): void {
    const floorY = height * 0.72
    const floor = this.add.graphics()
    floor.fillGradientStyle(0x160d2d, 0x160d2d, 0x090615, 0x090615, 1)
    floor.fillRect(0, floorY, width, height - floorY)
    floor.lineStyle(1, palette.accent, 0.08)
    for (let index = -4; index <= 4; index += 1) {
      floor.lineBetween(
        width / 2 + index * 34,
        floorY,
        width / 2 + index * width * 0.18,
        height,
      )
    }
    for (let index = 1; index <= 4; index += 1) {
      const y = floorY + (height - floorY) * (index / 5) ** 1.6
      floor.lineBetween(0, y, width, y)
    }

    const hall = this.add.graphics()
    hall.fillStyle(0x0d0720, 0.85)
    hall.fillRect(width * 0.08, height * 0.1, width * 0.84, floorY - height * 0.1)
    hall.lineStyle(2, palette.accent, 0.22)
    hall.strokeRect(width * 0.08, height * 0.1, width * 0.84, floorY - height * 0.1)

    for (let index = 0; index < 4; index += 1) {
      const x = width * (0.16 + index * 0.23)
      const column = this.add.graphics()
      column.fillStyle(0x1d1238, 1)
      column.fillRect(x - 8, height * 0.22, 16, floorY - height * 0.22)
      column.fillStyle(palette.accent, 0.18)
      column.fillRect(x - 2, height * 0.22, 2, floorY - height * 0.22)
      column.lineStyle(1, palette.accent, 0.3)
      column.strokeRect(x - 8, height * 0.22, 16, floorY - height * 0.22)
    }

    const arch = this.add.graphics()
    arch.fillStyle(0x090517, 1)
    arch.fillRect(width * 0.4, height * 0.16, width * 0.2, height * 0.3)
    arch.fillCircle(width * 0.5, height * 0.16, width * 0.1)
    arch.lineStyle(2, palette.accent, 0.3)
    arch.strokeRect(width * 0.4, height * 0.16, width * 0.2, height * 0.3)
    arch.strokeCircle(width * 0.5, height * 0.16, width * 0.1)

    const throne = this.add.graphics()
    throne.fillStyle(0x2a1b0c, 1)
    throne.fillRect(width * 0.47, height * 0.48, width * 0.06, height * 0.15)
    throne.fillStyle(palette.accent, 0.5)
    throne.fillRect(width * 0.475, height * 0.49, width * 0.05, 5)
    throne.fillStyle(0x2a1b0c, 1)
    throne.fillRect(width * 0.455, height * 0.44, width * 0.09, 6)

    for (let index = 0; index < 5; index += 1) {
      const x = width * (0.18 + index * 0.16)
      const lantern = this.add.container(x, height * 0.14)
      const glow = this.add.circle(0, 0, 18, palette.glow, 0.16)
      const core = this.add.circle(0, 0, 5, palette.accent, 0.9)
      lantern.add([glow, core])
      this.tweens.add({
        targets: lantern,
        y: height * 0.14 + 8,
        alpha: { from: 1, to: 0.72 },
        duration: randomBetween(1800, 2800),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
        delay: index * 180,
      })
    }

    const motif = this.add.graphics()
    motif.lineStyle(1, palette.accent2, 0.16)
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 9; column += 1) {
        const x = width * 0.12 + column * (width * 0.095)
        const y = floorY + 26 + row * 26
        motif.strokePoints(
          [
            new Phaser.Math.Vector2(x, y - 6),
            new Phaser.Math.Vector2(x + 6, y),
            new Phaser.Math.Vector2(x, y + 6),
            new Phaser.Math.Vector2(x - 6, y),
          ],
          true,
        )
      }
    }
  }

  private drawBattle(width: number, height: number, palette: Palette): void {
    const horizon = height * 0.64
    const sea = this.add.graphics()
    sea.fillGradientStyle(palette.sea, palette.sea, 0x0a050c, 0x0a050c, 1)
    sea.fillRect(0, horizon, width, height - horizon)
    this.drawWaves(width, height, horizon, palette)

    const flash = this.add.rectangle(width / 2, height / 2, width, height, 0xdbeafe, 0)
    this.time.addEvent({
      delay: 4200,
      loop: true,
      callback: () => {
        this.tweens.add({
          targets: flash,
          alpha: { from: 0, to: 0.22 },
          duration: 90,
          yoyo: true,
          repeat: 1,
          onComplete: () => flash.setAlpha(0),
        })
      },
    })

    const fort = this.add.graphics()
    fort.fillStyle(0x08050c, 1)
    fort.fillRect(width * 0.04, horizon - 78, width * 0.3, 80)
    fort.fillRect(width * 0.07, horizon - 100, width * 0.06, 24)
    fort.fillRect(width * 0.22, horizon - 94, width * 0.05, 18)
    fort.fillStyle(0x120a12, 1)
    fort.fillRect(width * 0.12, horizon - 52, width * 0.05, 52)
    fort.fillStyle(palette.accent, 0.22)
    fort.fillRect(width * 0.12, horizon - 52, width * 0.05, 52)
    fort.lineStyle(1, palette.accent, 0.25)
    fort.strokeRect(width * 0.04, horizon - 78, width * 0.3, 80)

    const fire = this.add.container(width * 0.17, horizon - 88)
    const glow = this.add.circle(0, 0, 34, palette.accent, 0.2)
    const core = this.add.circle(0, 0, 12, 0xffd9a0, 0.7)
    fire.add([glow, core])
    this.tweens.add({
      targets: fire,
      scale: { from: 0.85, to: 1.18 },
      alpha: { from: 0.8, to: 1 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    this.drawShip(width * 0.7, horizon + 20, 1.1)
    this.drawShip(width * 0.88, horizon + 58, 0.8)

    for (let index = 0; index < 34; index += 1) {
      const rain = this.add.rectangle(
        Math.random() * width,
        randomBetween(-height, 0),
        1.2,
        randomBetween(10, 22),
        0xa5f3fc,
        randomBetween(0.08, 0.24),
      )
      rain.setAngle(12)
      this.tweens.add({
        targets: rain,
        y: height + 30,
        duration: randomBetween(900, 1800),
        delay: randomBetween(0, 1400),
        repeat: -1,
      })
    }
  }

  private drawFirewall(width: number, height: number, palette: Palette): void {
    const horizon = height * 0.66
    const grid = this.add.graphics()
    grid.lineStyle(1, palette.accent, 0.1)
    for (let index = -10; index <= 10; index += 1) {
      grid.lineBetween(
        width / 2 + index * 34,
        horizon,
        width / 2 + index * width * 0.14,
        height,
      )
    }
    for (let index = 1; index <= 7; index += 1) {
      const y = horizon + (height - horizon) * (index / 8) ** 1.8
      grid.lineBetween(0, y, width, y)
    }

    const gateWidth = Math.min(width * 0.34, 360)
    const gateX = width / 2
    const gate = this.add.graphics()
    gate.fillStyle(0x06182a, 0.9)
    gate.fillRect(gateX - gateWidth / 2, height * 0.18, gateWidth, height * 0.46)
    gate.lineStyle(2, palette.accent, 0.6)
    gate.strokeRect(gateX - gateWidth / 2, height * 0.18, gateWidth, height * 0.46)
    gate.fillStyle(palette.accent, 0.08)
    gate.fillRect(gateX - gateWidth / 2 + 6, height * 0.18 + 6, gateWidth - 12, height * 0.46 - 12)
    gate.lineStyle(1, palette.accent2, 0.35)
    gate.strokeRect(gateX - gateWidth * 0.28, height * 0.28, gateWidth * 0.56, height * 0.28)
    gate.lineBetween(gateX, height * 0.28, gateX, height * 0.56)
    gate.lineBetween(gateX - gateWidth * 0.28, height * 0.42, gateX + gateWidth * 0.28, height * 0.42)

    for (let index = 0; index < 6; index += 1) {
      const y = height * (0.2 + index * 0.07)
      const packet = this.add.rectangle(
        -40,
        y,
        randomBetween(8, 22),
        2,
        index % 2 === 0 ? palette.accent : palette.accent2,
        randomBetween(0.3, 0.8),
      )
      this.tweens.add({
        targets: packet,
        x: width + 40,
        duration: randomBetween(2400, 5200),
        delay: randomBetween(0, 2200),
        repeat: -1,
      })
    }

    const scan = this.add.rectangle(width / 2, 0, width, 2, palette.accent, 0.4)
    this.tweens.add({
      targets: scan,
      y: height,
      duration: 3600,
      repeat: -1,
      ease: 'Linear',
    })
  }

  private drawVault(width: number, height: number, palette: Palette): void {
    const cx = width / 2
    const cy = height * 0.46
    const radius = Math.min(width, height) * 0.26

    const aura = this.add.circle(cx, cy, radius * 1.7, palette.accent, 0.08)
    this.tweens.add({
      targets: aura,
      alpha: { from: 0.05, to: 0.14 },
      scale: { from: 0.94, to: 1.08 },
      duration: 3800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    const door = this.add.circle(cx, cy, radius, 0x0a0618, 0.9)
    door.setStrokeStyle(3, palette.accent, 0.55)
    const inner = this.add.circle(cx, cy, radius * 0.82, 0x000000, 0)
    inner.setStrokeStyle(1, palette.accent2, 0.35)
    const core = this.add.circle(cx, cy, radius * 0.32, 0x0b0720, 0.9)
    core.setStrokeStyle(2, palette.accent2, 0.5)
    this.add.circle(cx, cy, radius * 0.1, palette.accent, 0.7)

    const spokes = this.add.graphics()
    spokes.lineStyle(1, palette.accent, 0.25)
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2
      spokes.lineBetween(
        cx + Math.cos(angle) * radius * 0.38,
        cy + Math.sin(angle) * radius * 0.38,
        cx + Math.cos(angle) * radius * 0.76,
        cy + Math.sin(angle) * radius * 0.76,
      )
    }
    spokes.strokeCircle(cx, cy, radius * 0.58)

    const glyphs = this.add.container(0, 0)
    for (let index = 0; index < 14; index += 1) {
      const angle = (index / 14) * Math.PI * 2
      const distance = radius * randomBetween(1.25, 1.65)
      const glyph = this.add.rectangle(
        cx + Math.cos(angle) * distance,
        cy + Math.sin(angle) * distance,
        randomBetween(4, 10),
        randomBetween(4, 10),
        index % 2 === 0 ? palette.accent : palette.accent2,
        randomBetween(0.2, 0.6),
      )
      glyph.setAngle(randomBetween(0, 90))
      glyphs.add(glyph)
      this.tweens.add({
        targets: glyph,
        y: glyph.y + randomBetween(-18, 18),
        angle: glyph.angle + randomBetween(-30, 30),
        alpha: { from: 0.2, to: 0.7 },
        duration: randomBetween(2600, 5200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
        delay: index * 120,
      })
    }

    const ring = this.add.circle(cx, cy, radius * 1.05, 0x000000, 0)
    ring.setStrokeStyle(1, palette.accent2, 0.18)
    this.tweens.add({
      targets: ring,
      scale: { from: 0.96, to: 1.06 },
      alpha: { from: 0.3, to: 0.05 },
      duration: 2600,
      repeat: -1,
      ease: 'Sine.out',
    })
  }

  private drawCitadel(width: number, height: number, palette: Palette): void {
    const baseY = height * 0.82
    const skyline = this.add.graphics()
    skyline.fillStyle(0x050b1c, 1)
    for (let index = 0; index < 9; index += 1) {
      const buildingWidth = width / 9 + 6
      const x = index * (width / 9) - 3
      const buildingHeight = 60 + ((index * 37) % 130)
      skyline.fillRect(x, baseY - buildingHeight, buildingWidth, buildingHeight)
      skyline.fillStyle(index % 2 === 0 ? palette.accent : palette.accent2, 0.24)
      for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          skyline.fillRect(
            x + 8 + column * 12,
            baseY - buildingHeight + 12 + row * 18,
            3,
            3,
          )
        }
      }
      skyline.fillStyle(0x050b1c, 1)
    }

    const towerX = width / 2
    const towerTop = height * 0.16
    const tower = this.add.graphics()
    tower.fillStyle(0x071226, 1)
    tower.fillRect(towerX - 46, towerTop, 92, baseY - towerTop)
    tower.lineStyle(1, palette.accent, 0.45)
    tower.strokeRect(towerX - 46, towerTop, 92, baseY - towerTop)
    tower.fillStyle(palette.accent, 0.18)
    tower.fillRect(towerX - 30, towerTop + 20, 60, 3)
    tower.fillRect(towerX - 30, towerTop + 32, 60, 3)
    tower.fillRect(towerX - 30, towerTop + 44, 60, 3)

    const coreGlow = this.add.circle(towerX, towerTop + 10, 28, palette.accent, 0.22)
    this.add.circle(towerX, towerTop + 10, 10, palette.glow, 0.85)
    this.tweens.add({
      targets: coreGlow,
      alpha: { from: 0.12, to: 0.34 },
      scale: { from: 0.9, to: 1.2 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    const nodes = [
      { x: width * 0.16, y: height * 0.3 },
      { x: width * 0.84, y: height * 0.28 },
      { x: width * 0.28, y: height * 0.52 },
      { x: width * 0.72, y: height * 0.5 },
      { x: towerX, y: height * 0.36 },
    ]
    const network = this.add.graphics()
    network.lineStyle(1, palette.accent, 0.18)
    for (let index = 0; index < nodes.length; index += 1) {
      const a = nodes[index]
      if (!a) continue
      for (let other = index + 1; other < nodes.length; other += 1) {
        const b = nodes[other]
        if (!b) continue
        network.lineBetween(a.x, a.y, b.x, b.y)
      }
    }
    nodes.forEach((node, index) => {
      const dot = this.add.circle(
        node.x,
        node.y,
        3.5,
        index % 2 === 0 ? palette.accent : palette.accent2,
        0.8,
      )
      this.tweens.add({
        targets: dot,
        scale: { from: 0.8, to: 1.8 },
        alpha: { from: 0.9, to: 0.3 },
        duration: 1800,
        yoyo: true,
        repeat: -1,
        delay: index * 220,
        ease: 'Sine.inOut',
      })
    })

    const grid = this.add.graphics()
    grid.lineStyle(1, palette.accent, 0.08)
    for (let index = -8; index <= 8; index += 1) {
      grid.lineBetween(
        width / 2 + index * 30,
        baseY,
        width / 2 + index * width * 0.12,
        height,
      )
    }
    for (let index = 1; index <= 5; index += 1) {
      const y = baseY + (height - baseY) * (index / 6)
      grid.lineBetween(0, y, width, y)
    }
  }

  private drawMap(width: number, height: number, palette: Palette): void {
    const sea = this.add.graphics()
    sea.fillGradientStyle(0x07182a, 0x07182a, 0x04101f, 0x04101f, 1)
    sea.fillRect(0, height * 0.18, width, height * 0.82)

    const islands = [
      { x: width * 0.2, y: height * 0.56, w: width * 0.22, h: height * 0.16 },
      { x: width * 0.56, y: height * 0.44, w: width * 0.18, h: height * 0.12 },
      { x: width * 0.78, y: height * 0.68, w: width * 0.2, h: height * 0.14 },
    ]
    const land = this.add.graphics()
    islands.forEach((island, index) => {
      land.fillStyle(index === 1 ? 0x12352f : 0x0f2a35, 1)
      land.fillEllipse(island.x, island.y, island.w, island.h)
      land.fillStyle(palette.accent, 0.08)
      land.fillEllipse(island.x, island.y - 4, island.w * 0.7, island.h * 0.5)
      land.lineStyle(1, palette.accent, 0.16)
      land.strokeEllipse(island.x, island.y, island.w, island.h)
    })

    const route = this.add.graphics()
    route.lineStyle(1.5, palette.accent, 0.38)
    const points = islands.map((island) => ({
      x: island.x,
      y: island.y,
    }))
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index]
      const b = points[index + 1]
      if (!a || !b) continue
      const steps = 14
      for (let step = 0; step < steps; step += 2) {
        const t1 = step / steps
        const t2 = Math.min(1, (step + 1) / steps)
        route.lineBetween(
          Phaser.Math.Linear(a.x, b.x, t1),
          Phaser.Math.Linear(a.y, b.y, t1) - Math.sin(t1 * Math.PI) * 26,
          Phaser.Math.Linear(a.x, b.x, t2),
          Phaser.Math.Linear(a.y, b.y, t2) - Math.sin(t2 * Math.PI) * 26,
        )
      }
    }

    points.forEach((point, index) => {
      const halo = this.add.circle(point.x, point.y, 16, palette.accent, 0.12)
      this.add.circle(point.x, point.y, 5, palette.accent, 0.9)
      this.add.circle(point.x, point.y, 2, 0xffffff, 0.9)
      this.tweens.add({
        targets: halo,
        scale: { from: 0.8, to: 1.8 },
        alpha: { from: 0.25, to: 0 },
        duration: 2200,
        repeat: -1,
        delay: index * 360,
        ease: 'Sine.out',
      })
    })

    const compassX = width * 0.12
    const compassY = height * 0.3
    const compass = this.add.graphics()
    compass.lineStyle(1, palette.accent2, 0.3)
    compass.strokeCircle(compassX, compassY, 26)
    compass.lineBetween(compassX, compassY - 34, compassX, compassY + 34)
    compass.lineBetween(compassX - 34, compassY, compassX + 34, compassY)
    compass.fillStyle(palette.accent2, 0.5)
    compass.fillTriangle(
      compassX,
      compassY - 26,
      compassX - 5,
      compassY,
      compassX + 5,
      compassY,
    )

    this.drawShip(width * 0.42, height * 0.66, 0.7)
    this.drawShip(width * 0.67, height * 0.32, 0.55)
  }

  private drawAmbient(width: number, height: number, palette: Palette): void {
    const count = Math.round(Math.min(28, Math.max(12, width / 60)))
    for (let index = 0; index < count; index += 1) {
      const x = Math.random() * width
      const y = randomBetween(height * 0.2, height * 0.95)
      const radius = randomBetween(0.8, 2.4)
      const particle = this.add.circle(
        x,
        y,
        radius,
        index % 3 === 0 ? palette.accent2 : palette.accent,
        randomBetween(0.15, 0.55),
      )
      this.tweens.add({
        targets: particle,
        y: y - randomBetween(40, 150),
        alpha: { from: particle.alpha, to: 0 },
        duration: randomBetween(4200, 9000),
        delay: randomBetween(0, 3600),
        repeat: -1,
        ease: 'Sine.in',
      })
    }
  }
}
