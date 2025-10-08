import {
  AnimatedSprite,
  Container,
  Graphics,
  Rectangle,
  Texture,
} from 'pixi.js';

interface Entity<T> {
  textures: T;
}

enum PlayerStates {
  'IDLE' = 'IDLE',
  'WALK' = 'WALK',
  'RUN' = 'RUN',
  'HURT' = 'HURT',
  'DEAD' = 'DEAD',
  'JUMP' = 'JUMP',
  'ATTACK' = 'ATTACK',
  'CAST' = 'CAST',
  'PROJECTILE' = 'PROJECTILE', // for the weapon he cast
}

// each entity state and its corresponding texture
type EntityTexture = {
  [K in PlayerStates]: Texture;
};

type PlayerState = keyof typeof PlayerStates;

interface PlayerEntity extends Entity<EntityTexture> {
  showHitbox?: boolean;
}

export class Player extends Container {
  FRAME_HEIGHT = 96;
  FRAME_WIDTH = 96;
  grid: Graphics | null = null;
  speed: number = 1;
  textures: EntityTexture;
  direction = {
    x: 0,
    y: 0,
  };
  // the spritesheet animation texture for the animation rendered
  animationTexture: Texture | null = null;
  sprite: any;
  frames: any[] = [];
  hitbox = {
    x: this.FRAME_WIDTH / 3,
    y: this.FRAME_HEIGHT * 0.2,
    width: this.FRAME_WIDTH / 3,
    height: this.FRAME_HEIGHT - 20,
  };

  // controls the animationTexture state
  STATE: PlayerState = 'IDLE';

  constructor({ textures }: PlayerEntity) {
    super();
    this.textures = textures;

    this.render();
  }

  render() {
    // load the textures first
    this.drawHitBox();

    this.frames = this.getAnimationFrames();

    this.sprite = new AnimatedSprite(this.frames, true);

    this.sprite.animationSpeed = 0.1;

    this.sprite.play();

    this.addChild(this.sprite);
  }

  private getTexture() {
    return this.textures[this.STATE];
  }
  /**
   * Get animation frames from the animationTexture value
   * @param texture
   * @returns
   */
  getAnimationFrames(): Texture[] {
    const frames: Texture[] = [];

    const maxFrame = this.getMaxFrame();

    for (let i = 0; i < maxFrame; i++) {
      frames[i] = this.getFrameTextureByIndex(i);
    }

    return frames;
  }

  setState(state: PlayerState) {
    // prevent updating state when it is already updated to the same state
    if (this.STATE === state) return;
    this.STATE = state;

    const texture = this.getTexture();

    this.sprite.texture = texture;
    this.frames = this.getAnimationFrames();
    console.log(this.sprite.texture);
  }

  getFrameTextureByIndex(index: number): Texture {
    // Create a rectangle defining the frame area
    const texture = this.getTexture();

    // create frame by the given texture
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
   * Get the maximum frame of the texture
   * @param texture
   * @returns
   */
  getMaxFrame() {
    const texture = this.getTexture();

    return Math.floor(texture.frame.width / this.FRAME_WIDTH);
  }

  moveRight() {
    this.direction.x = this.speed;
    this.setState('WALK');
  }
  stopMovement() {
    this.direction.x = 0;
    this.setState('IDLE');
  }
  moveLeft() {
    this.direction.x = -this.speed;
  }
  moveUp() {
    this.direction.y = -this.speed;
  }
  moveDown() {
    this.direction.y = this.speed;
  }
  stopFreeFall() {
    this.direction.y = 0;
  }
  jump() {
    // todo jump functionality
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

  setPosition(position: { x: number; y: number }) {
    this.x = position.x;
    this.y = position.y;
  }

  /**
   * Apply updates to the player
   */
  update() {
    this.x += this.direction.x;
    this.y += this.direction.y;
  }
}
