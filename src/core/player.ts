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

  // movement direction
  direction = {
    x: 0,
    y: 0,
  };
  // player hitbox
  hitbox = {
    x: this.FRAME_WIDTH / 3,
    y: this.FRAME_HEIGHT * 0.2,
    width: this.FRAME_WIDTH / 3,
    height: this.FRAME_HEIGHT - 20,
  };

  // --- physics
  gravity = 0.2; // how strong gravity pulls down
  velocityY = 0; // current vertical speed
  velocityX = 0;
  friction = 0.2;
  jumpStrength = 10; // how strong the jump is
  onGround = true; // whether the player is grounded
  groundY = 300; // arbitrary ground level (change to your tilemap height)
  acceleration = 2; // for accelerating player speed
  deceleration = 2; // for deceleration

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

    const newFrames = this.getAnimationFrames();

    this.sprite.textures = newFrames; // apply new frames

    this.sprite.gotoAndPlay(0); // ✅ restart animation
  }

  setAnimationState(state: PlayerState) {
    // prevent updating state when it is already updated to the same state
    if (this.STATE === state) return;

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
  attack() {
    this.setState('ATTACK');
  }
  moveRight() {
    if (this.STATE === 'JUMP' && !this.isOnGround()) return;
    this.direction.x = this.speed * 2;
    this.setState('RUN');
  }
  throwProjectile() {
    this.setState('CAST');
  }
  moveSlowly() {
    this.direction.x = this.speed;
    this.setState('WALK');
  }
  idle() {
    this.setState('IDLE');
  }
  stopMovement() {
    if (this.STATE === 'JUMP' && !this.isOnGround()) return;
    if (this.isOnGround()) {
      this.direction.x = 0;
    }
    this.setState('IDLE');
  }
  moveLeft() {
    if (this.isJumping) return;
    this.direction.x = -this.speed;
    this.setState('RUN');
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
    } else {
      this.isJumping = false;
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
      this.setState('JUMP');
      this.sprite.loop = false;
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

  /**
   * Apply updates to the player
   */
  update(ticker: Ticker) {
    // Reset horizontal movement
    const delta = ticker.deltaTime;
    this.direction.x = 0;

    // update player movement
    if (this.controller.keys['right'].doubleTap) {
      this.setAnimationState('RUN');
      this.direction.x = this.speed;
    } else if (this.controller.keys['right'].pressed) {
      this.direction.x = this.speed;
      this.setAnimationState('WALK');
    } else if (this.controller.keys['left'].pressed) {
      this.direction.x = -this.speed;
      // todo reverse the sprite making appearing it to turn left
      this.setAnimationState('WALK');
    } else {
      this.setAnimationState('IDLE');
    }

    if (this.direction.x !== 0) {
      // Gradually accelerate
      this.velocityX += this.direction.x * this.acceleration * delta;

      // Smooth momentum buildup: if you keep holding the key, increase max speed slowly
      this.currentMaxSpeed += this.runAccelerationFactor * delta;

      // Clamp to overall maxRunSpeed
      this.currentMaxSpeed = Math.min(this.currentMaxSpeed, this.maxRunSpeed);

      // Clamp actual velocity
      if (Math.abs(this.velocityX) > this.currentMaxSpeed)
        this.velocityX = this.direction.x * this.currentMaxSpeed;
    } else {
      // No input — apply deceleration / friction
      if (Math.abs(this.velocityX) > 0.05) {
        const sign = Math.sign(this.velocityX);

        this.velocityX -= sign * this.deceleration * delta;
      } else {
        this.velocityX = 0;
        this.currentMaxSpeed = this.maxWalkSpeed; // reset momentum
      }
    }

    // apply physics
    // this.x += this.direction.x;
    // this.y += this.velocityY;

    // this.applyGravity();

    // Handle jump animation syncing
    if (this.isJumping && this.sprite && this.STATE === 'JUMP') {
      this.jumpElapsed++;

      const progress = Math.min(this.jumpElapsed / this.jumpDuration, 1);
      const totalFrames = this.sprite.totalFrames;

      // Interpolate frame progress based on jump physics
      this.sprite.gotoAndStop(Math.floor(progress * (totalFrames - 1)));

      if (progress >= 1 || this.onGround) {
        this.isJumping = false;
        this.setState('IDLE');
        // this.stopMovement();
      }
    }
    // handle moving
    if (this.STATE === 'IDLE') {
      this.direction.x = 0;
    }

    // Apply movement
    this.x += this.velocityX;
  }

  isOnGround() {
    return this.y >= this.groundY;
  }
  isMoving() {
    return this.direction.x !== 0;
  }
  getHitbox() {
    return this.hitbox;
  }
}
