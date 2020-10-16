import { Component, Types } from 'ecsy';

class Sprite extends Component {}

Sprite.schema = {
  sprite: { type: Types.Ref },
  texture: { type: Types.Ref }
}

export default Sprite;
