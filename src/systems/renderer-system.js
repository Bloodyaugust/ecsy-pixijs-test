import { Not, System } from 'ecsy';
import { PixiInitializable, Renderable } from '../components/tags.js';
import Position from '../components/position.js';
import Sprite from '../components/sprite.js';

class RendererSystem extends System {
  execute(delta, time) {
    this.queries.renderables.results.forEach(entity => {
      const position = entity.getComponent(Position)
      const sprite = entity.getComponent(Sprite)

      sprite.sprite.x = position.x
      sprite.sprite.y = position.y + Math.sin((time + entity.id) / 100) * 20
    })
  }
}

RendererSystem.queries = {
  renderables: {
    components: [Renderable, Sprite, Position, Not(PixiInitializable)]
  }
}

export default RendererSystem;
