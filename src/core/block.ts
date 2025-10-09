import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { World } from './world';
export enum BlockStates {
  'SOLID' = 'SOLID', // a solid block where player can stand
  'COLLAPSIBLE' = 'COLLAPSIBLE', // a block that will collapse if user stand in it
  'HAZARD' = 'HAZARD', // a block that can damage the player
}

type BlockState = keyof typeof BlockStates;

interface BlockOptions {
  texture?: Texture;
  state?: BlockState;
}
export class Block extends Container {
  //   texture: Texture;
  sprite: Sprite;
  state: BlockState = 'SOLID';
  constructor({ texture, state = 'SOLID' }: BlockOptions) {
    super();
    // this.texture = texture;
    this.state = state;
    this.sprite = new Sprite({ texture: texture });
  }

  drawBox(height: number, width: number) {
    const shape = new Graphics();

    // Draw a simple rectangle border around the sprite
    shape.rect(0, 0, width, height);
    shape.stroke({ width: 2, color: 0x00ff00 });

    this.addChild(shape);
  }

  drawHitBox() {
    const shape = new Graphics();
    const bound = this.getHitbox();

    // Draw a simple rectangle border around the sprite
    shape.rect(bound.x, bound.y, this.width, this.height);
    shape.stroke({ width: 2, color: 'red' });

    this.addChild(shape);
  }

  getHitboxGlobal() {
    const global = this.toGlobal({ x: 0, y: 0 });

    return {
      x: global.x,
      y: global.y,
      width: 48,
      height: 48,
    };
  }

  drawBoundingBox(world: World) {
    const bound = this.getHitboxGlobal();
    const shape = new Graphics();

    // Draw a simple rectangle border around the sprite
    shape.rect(bound.x, bound.y, bound.width, bound.height);
    shape.stroke({ width: 2, color: 'orange' });

    world.addChild(shape);
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
