import * as PIXI from 'pixi.js';
import { System } from 'ecsy';
import { PixiInitializable } from '../components/tags.js';
import Position from '../components/position.js';
import Sprite from '../components/sprite.js';

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

export default PixiInitializationSystem;
