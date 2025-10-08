import { Texture } from 'pixi.js';

export interface Entity<T> {
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
export type EntityTexture = {
  [K in PlayerStates]: Texture;
};

export type PlayerState = keyof typeof PlayerStates;

export interface PlayerEntity extends Entity<EntityTexture> {
  showHitbox?: boolean;
}
