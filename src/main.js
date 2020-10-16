import * as PIXI from 'pixi.js'
import Stats from 'stats.js'
import { World } from 'ecsy'
import { Renderable, PixiInitializable } from './components/tags.js'
import Position from './components/position.js'
import Sprite from './components/sprite.js'
import Velocity from './components/velocity.js'
import MovableSystem from './systems/movable-system.js'
import RendererSystem from './systems/renderer-system.js'
import PixiInitializationSystem from './systems/pixi-initialization-system.js'
import * as styles from './index.css'

export default function Initialize() {
  document.body.className = styles.body

  window.app = new PIXI.Application()
  const stats = new Stats()

  document.body.appendChild(app.view)

  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  const world = new World()
  world
    .registerComponent(PixiInitializable)
    .registerComponent(Velocity)
    .registerComponent(Position)
    .registerComponent(Sprite)
    .registerComponent(Renderable)
    .registerSystem(PixiInitializationSystem)
    .registerSystem(MovableSystem)
    .registerSystem(RendererSystem)

  app.loader
    .add('spaceship', 'images/spaceship.png')
    .load((loader, resources) => {
      let delta, lastTime, time

      time = performance.now()
      lastTime = time

      for (let i = 0; i < 10000; i++) {
        world
          .createEntity()
          .addComponent(Sprite, { texture: resources.spaceship.texture })
          .addComponent(PixiInitializable)
          .addComponent(Velocity, { x: 0, y: 0 })
          .addComponent(Position, {
            x: Math.random() * app.renderer.width,
            y: Math.random() * app.renderer.height
          })
          .addComponent(Renderable)
      }

      app.ticker.add(() => {
        stats.begin()
        time = performance.now()
        delta = time - lastTime

        world.execute(delta, time)

        lastTime = time
        stats.end()
      })
    })
}
