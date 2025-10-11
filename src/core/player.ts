import {
  AnimatedSprite,
  Container,
  Graphics,
  Rectangle,
  Texture,
  Ticker,
} from 'pixi.js';
import { Controller } from './controller';
import { EntityTexture, PlayerEntity, PlayerState } from './types';
import { World } from './world';

// things to consider
// 1. animation should not depend on key press, but a separate state for better control of behaviour
// 2. state should listen the keys that was actively press while making other state, e.g. when player is running he can jump while in running state and continue to the running state on land if the run key still pressed
// 3. center the camera, the player position is fix, while he can navigate jump, walk, run and other stuff

export class Player extends Container {
  // controller
  controller: Controller;
  // assets configuration
  FRAME_HEIGHT = 96;
  FRAME_WIDTH = 96;
  grid: Graphics | null = null;
  textures: EntityTexture;
  sprite: any;

  // player attribute
  speed: number = 1;
  maxRunSpeed = 5;
  maxWalkSpeed = 2;
  runAccelerationFactor = 0.05; // extra acceleration multiplier
  currentMaxSpeed = this.speed;
  topSpeed: number = 0;

  // movement direction
  direction = {
    x: 0,
    y: 0,
  };
  // player hitbox
  hitbox = {
    x: -20,
    y: -28,
    width: this.FRAME_WIDTH / 3,
    height: this.FRAME_HEIGHT - 20,
  };

  // --- physics
  gravity = 0.2; // how strong gravity pulls down
  velocityY = 0; // current vertical speed
  velocityX = 0;
  jumpStrength = 10; // how strong the jump is
  onGround = true; // whether the player is grounded
  groundY = 300; // arbitrary ground level (change to your tilemap height)
  acceleration = 0.8; // for accelerating player speed
  deceleration = 0.25; // for deceleration

  jumpDuration = 0; // total jump time in frames or ms
  jumpElapsed = 0; // how long we’ve been jumping
  isJumping = false;

  // State
  STATE: PlayerState = 'IDLE';
  LAST_STATE: PlayerState = 'IDLE'; // reference what the last action user used

  constructor({ textures, controller }: PlayerEntity) {
    super();
    this.textures = textures;
    this.controller = controller;
  }

  render() {
    // load the textures first
    this.drawHitBox();

    const frames = this.getAnimationFrames();

    this.sprite = new AnimatedSprite(frames, true);

    this.sprite.animationSpeed = 0.1;

    this.sprite.anchor.set(0.5, 0.5); // centers the origin

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

  setAnimationState(state: PlayerState) {
    // prevent updating state when it is already updated to the same state
    if (this.STATE === state) return;

    if (state !== 'JUMP') {
      this.sprite.loop = true;
    } else {
      this.sprite.loop = false;
    }

    this.STATE = state;

    const newFrames = this.getAnimationFrames();

    this.sprite.textures = newFrames; // apply new frames

    this.sprite.gotoAndPlay(0); // ✅ restart animation
  }

  setGroundY(value: number) {
    this.groundY = value;
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
  walk(initialSpeed: number) {
    // only play walk animation when player is on ground
    if (!this.isJumping) {
      this.setAnimationState('WALK');
    }

    // positive value: sprite is right facing
    if (initialSpeed > 0) {
      this.inverseSprite(1);
    } else {
      this.inverseSprite(-1);
    }

    this.direction.x = initialSpeed;

    this.topSpeed = this.maxWalkSpeed;
  }

  run(direction: number) {
    if (!this.isJumping) {
      this.setAnimationState('RUN');
    }

    // positive value: sprite is right facing
    if (direction > 0) {
      this.inverseSprite(1);
    } else {
      this.inverseSprite(-1);
    }

    this.direction.x = direction;
    this.topSpeed = this.maxRunSpeed;
  }

  attack() {
    this.setAnimationState('ATTACK');
  }

  throwProjectile() {
    this.setAnimationState('CAST');
  }
  moveSlowly() {
    this.direction.x = this.speed;
    this.setAnimationState('WALK');
  }

  idle() {
    this.setAnimationState('IDLE');
    this.direction.x = 0;
  }

  moveUp() {
    this.velocityY = -this.speed;
  }
  moveDown() {
    this.velocityY = this.speed;
  }
  stopFreeFall() {
    this.velocityY = 0;
  }
  applyGravity() {
    if (!this.isOnGround()) {
      this.velocityY += this.gravity; // pull down
    }
  }

  jump() {
    if (this.isOnGround()) {
      this.velocityY = -this.jumpStrength;
      this.onGround = false;
      this.isJumping = true;
      this.jumpElapsed = 0;

      // Estimate total jump duration based on strength & gravity
      // Rough physics formula: t = (2 * v) / g
      this.jumpDuration = (2 * this.jumpStrength) / this.gravity;

      // Play jump animation once
      this.setAnimationState('JUMP');
    }
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
  getHitBoxGlobal() {
    const global = this.toGlobal({ x: this.hitbox.x, y: this.hitbox.y });

    return {
      x: global.x,
      y: global.y,
      width: this.hitbox.width,
      height: this.hitbox.height,
    };
  }

  drawBoundingBox(world: World) {
    const bound = this.getHitBoxGlobal();

    const box = new Graphics();

    box.rect(bound.x, bound.y, bound.width, bound.height);
    box.stroke({ width: 2, color: 'red' });
    world.addChild(box);
  }

  setPosition(position: { x: number; y: number }) {
    this.x = position.x;
    this.y = position.y;
  }

  inverseSprite(direction: -1 | 1) {
    if (direction > 0) {
      this.sprite.scale.x = Math.abs(this.sprite.scale.x);
    } else {
      this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    }
  }

  /**
   * Apply updates to the player
   */
  update(ticker: Ticker) {
    const delta = ticker.deltaTime;

    // update player movement and animation
    if (this.controller.keys['right'].doubleTap) {
      this.run(this.speed);
    } else if (this.controller.keys['left'].doubleTap) {
      this.run(-this.speed);
    } else if (this.controller.keys['right'].pressed) {
      this.walk(this.speed);
    } else if (this.controller.keys['left'].pressed) {
      this.walk(-this.speed);
    } else {
      if (!this.isJumping) {
        this.idle();
      }
    }
    if (this.controller.keys['jump'].pressed) {
      this.jump();
    }

    // --- ACCELERATION ---
    if (this.direction.x !== 0) {
      // Gradually accelerate
      this.velocityX += this.direction.x * (this.acceleration * delta);

      // Smooth momentum buildup: if you keep holding the key, increase max speed slowly
      this.currentMaxSpeed += this.runAccelerationFactor * delta;

      // Clamp to overall maxRunSpeed
      this.currentMaxSpeed = Math.min(this.currentMaxSpeed, this.topSpeed);

      // Clamp actual velocity
      if (Math.abs(this.velocityX) > this.currentMaxSpeed)
        this.velocityX = this.direction.x * this.currentMaxSpeed;
    } else {
      if (Math.abs(this.velocityX) > 0.05) {
        const sign = Math.sign(this.velocityX);
        this.velocityX -= sign * (this.deceleration * delta);

        // Prevent overshoot
        if (Math.sign(this.velocityX) !== sign) this.velocityX = 0;
      } else {
        this.velocityX = 0;
      }
    }

    // Handle jump animation syncing
    if (this.isJumping && this.sprite && this.STATE === 'JUMP') {
      this.jumpElapsed++;

      const progress = Math.min(this.jumpElapsed / this.jumpDuration, 1);
      const totalFrames = this.sprite.totalFrames;

      // Interpolate frame progress based on jump physics
      this.sprite.gotoAndStop(Math.floor(progress * (totalFrames - 1)));

      if (progress >= 1 || this.onGround) {
        this.isJumping = false;
      }
    }

    this.applyGravity();

    // Apply position updates
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  isOnGround() {
    return this.onGround;
  }
}
