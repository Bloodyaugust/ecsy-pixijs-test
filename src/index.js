import * as PIXI from 'pixi.js'
import Stats from 'stats.js'
import { World, System, Component, TagComponent, Types, Not } from 'ecsy'
import * as styles from './index.css'

document.body.className = styles.body

const app = new PIXI.Application()
const stats = new Stats()

document.body.appendChild(app.view)

stats.showPanel(0)
document.body.appendChild(stats.dom)

class Velocity extends Component {}

Velocity.schema = {
  x: { type: Types.Number },
  y: { type: Types.Number }
}

// Position component
class Position extends Component {}

Position.schema = {
  x: { type: Types.Number },
  y: { type: Types.Number }
}

// Shape component
class Sprite extends Component {}

Sprite.schema = {
  sprite: { type: Types.Ref },
  texture: { type: Types.Ref }
}

// Renderable component
class Renderable extends TagComponent {}

class PixiInitializable extends TagComponent {}

class MovableSystem extends System {
  // This method will get called on every frame by default
  execute(delta, time) {
    // Iterate through all the entities on the query
    this.queries.moving.results.forEach(entity => {
      const velocity = entity.getComponent(Velocity)
      const position = entity.getMutableComponent(Position)
      position.x += velocity.x * delta
      position.y += velocity.y * delta

      // if (position.x > app.renderer.width + SHAPE_HALF_SIZE) position.x = - SHAPE_HALF_SIZE;
      // if (position.x < - SHAPE_HALF_SIZE) position.x = app.renderer.width + SHAPE_HALF_SIZE;
      // if (position.y > app.renderer.height + SHAPE_HALF_SIZE) position.y = - SHAPE_HALF_SIZE;
      // if (position.y < - SHAPE_HALF_SIZE) position.y = app.renderer.height + SHAPE_HALF_SIZE;
    })
  }
}

MovableSystem.queries = {
  moving: {
    components: [Velocity, Position, Not(PixiInitializable)]
  }
}

class RendererSystem extends System {
  execute(delta, time) {
    this.queries.renderables.results.forEach(entity => {
      const position = entity.getComponent(Position)
      const sprite = entity.getComponent(Sprite)

      sprite.sprite.x = position.x
      sprite.sprite.y = position.y + Math.sin(time / 100) * 20
    })
  }
}

RendererSystem.queries = {
  renderables: {
    components: [Renderable, Sprite, Position, Not(PixiInitializable)]
  }
}

class PixiInitializationSystem extends System {
  execute(delta, time) {
    this.queries.renderables.results.forEach(entity => {
      const sprite = entity.getMutableComponent(Sprite)
      const position = entity.getComponent(Position)

      sprite.sprite = new PIXI.Sprite(sprite.texture)

      sprite.sprite.anchor.x = 0.5
      sprite.sprite.anchor.y = 0.5

      sprite.sprite.x = position.x
      sprite.sprite.y = position.y

      app.stage.addChild(sprite.sprite)

      entity.removeComponent(PixiInitializable)
    })
  }
}

PixiInitializationSystem.queries = {
  renderables: { components: [PixiInitializable, Sprite] }
}

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
