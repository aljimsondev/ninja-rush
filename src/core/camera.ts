import { Container } from 'pixi.js';

interface CameraOptions {
  dampingY: number;
  dampingX: number;
  lookAhead: number;
  ignoreJump: boolean;
  zoom: number;
}

export class Camera extends Container {
  dampingY: number;
  dampingX: number;
  lookAhead: number;
  ignoreJump: boolean;
  zoom: number;
  constructor({
    dampingX,
    dampingY,
    lookAhead,
    ignoreJump,
    zoom,
  }: CameraOptions) {
    super();
    this.dampingX = dampingX;
    this.dampingY = dampingY;
    this.lookAhead = lookAhead;
    this.ignoreJump = ignoreJump;
    this.zoom = zoom;
  }
}
