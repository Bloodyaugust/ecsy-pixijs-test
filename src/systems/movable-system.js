import { Not, System } from 'ecsy';
import { PixiInitializable } from '../components/tags.js';
import Position from '../components/position.js';
import Velocity from '../components/velocity.js';

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

export default MovableSystem;
