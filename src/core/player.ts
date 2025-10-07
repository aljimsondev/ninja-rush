import {
  AnimatedSprite,
  Assets,
  Container,
  Graphics,
  Rectangle,
  Texture,
} from 'pixi.js';
import { Game } from '../game';

export class Player extends Container {
  private game: Game;
  FRAME_HEIGHT = 96;
  FRAME_WIDTH = 96;
  FRAME_INDEX = 0;
  spritesheet: any = null;
  grid: Graphics | null = null;
  hitbox = {
    x: this.FRAME_WIDTH / 3,
    y: this.FRAME_HEIGHT * 0.2,
    width: this.FRAME_WIDTH / 3,
    height: this.FRAME_HEIGHT - 20,
  };
  private STATES = {
    ATTACK: 'Attack_1.png',
    ATTACK_2: 'Attack_2.png',
    BLADE: 'Blade.png',
    CAST: 'Cast.png',
    DEAD: 'Dead.png',
    IDLE: 'Idle.png',
    HURT: 'Hurt.png',
    JUMP: 'Jump.png',
    KUNAI: 'Kunai.png',
    RUN: 'Run.png',
    WALK: 'Walk.png',
  };

  constructor(game: Game) {
    super();
    this.game = game;
    this.render();

    this.y = this.game.app.screen.height / 2 - this.FRAME_HEIGHT;
  }

  async render() {
    // load the textures first
    await this.load();
    this.drawHitBox();

    const texture = this.spritesheet.textures[this.STATES.RUN];

    const frames = this.getAnimationFrames(texture);

    const sprite = new AnimatedSprite(frames, true);

    sprite.animationSpeed = 0.1;
    sprite.play();

    this.addChild(sprite);
  }

  /**
   * Get animation frames from the given texture
   * @param texture
   * @returns
   */
  getAnimationFrames(texture: Texture): Texture[] {
    const frames: Texture[] = [];

    const maxFrame = this.getMaxFrame(texture);

    for (let i = 0; i < maxFrame; i++) {
      frames[i] = this.getFrameTextureByIndex(texture, i);
    }

    return frames;
  }

  getFrameTextureByIndex(texture: Texture, index: number) {
    // Create a rectangle defining the frame area
    const frame = new Rectangle(
      texture.frame.x + index * this.FRAME_WIDTH,
      texture.frame.y,
      this.FRAME_WIDTH,
      this.FRAME_HEIGHT,
    );

    // Create a new texture from the base texture using the frame rectangle
    return new Texture({
      source: texture as any,
      frame: frame,
    });
  }
  /**
   * Load assets
   */

  async load() {
    const sheetTexture = await Assets.load('src/assets/ninja/monk.png');

    Assets.add({
      alias: 'monk',
      src: 'src/assets/ninja/monk.json',
      data: { texture: sheetTexture }, // using of preloaded texture
    });

    this.spritesheet = await Assets.load('monk');
  }

  /**
   * Get the maximum frame of the texture
   * @param texture
   * @returns
   */
  getMaxFrame(texture: Texture) {
    return Math.floor(texture.frame.width / this.FRAME_WIDTH);
  }

  /**
   * Apply updates to the player
   */
  update() {
    // this.x += 0.5;
  }

  /**
   * Draw a simple box outline around the player sprite
   */
  drawHitBox() {
    this.grid = new Graphics();

    // Draw a simple rectangle border around the sprite
    this.grid.rect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height,
    );
    this.grid.stroke({ width: 2, color: 0x00ff00 });

    this.addChild(this.grid);
  }
}

export interface Entity {
  renderModel: () => void;
  update: () => void;
}
