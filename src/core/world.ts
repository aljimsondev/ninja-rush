import { Assets, Container } from 'pixi.js';
import { aabbIntersect } from '../utils/aabbIntersect';
import { Block } from './block';
import { Config } from './config';
import { Controller } from './controller';
import { Player } from './player';

export class World extends Container {
  config: Config;
  player: Player = {} as any;
  GROUND = 400;
  tiles: Block[] = [];
  controller: Controller;

  constructor(controller: Controller) {
    super();
    this.config = new Config();
    this.controller = controller;
  }
  // load assets and others
  async load() {
    await this.loadPlayer();
    this.loadMap();
  }

  async loadPlayer() {
    // loads the player assets

    const sheetTexture = await Assets.load('src/assets/ninja/monk.png');

    Assets.add({
      alias: 'monk',
      src: 'src/assets/ninja/monk.json',
      data: { texture: sheetTexture }, // using of preloaded texture
    });

    const playerSpritesheet = await Assets.load('monk');

    const textures = playerSpritesheet.textures;

    // load the player instance
    this.player = new Player({
      textures: {
        ATTACK: textures['Attack_1.png'],
        CAST: textures['Cast.png'],
        DEAD: textures['Dead.png'],
        HURT: textures['Hurt.png'],
        IDLE: textures['Idle.png'],
        JUMP: textures['Jump.png'],
        PROJECTILE: textures['Kunai.png'],
        RUN: textures['Run.png'],
        WALK: textures['Walk.png'],
      },
      controller: this.controller,
    });

    // set the initial player position
    this.player.setPosition({
      y: this.GROUND,
      x: 0,
    });

    this.player.setGroundY(this.GROUND);

    this.addChild(this.player);
  }

  loadMap() {
    const map = [
      {
        x: 0,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 1,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 2,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 3,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 4,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 5,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 6,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 7,
        y: this.GROUND + this.config.blockSize * 2,
      },
      {
        x: 7,
        y: this.GROUND + this.config.blockSize,
      },
    ];

    const mapTiles: Block[] = [];
    // replace with the tilemap
    for (let i = 0; i < map.length; i++) {
      const block = new Block({
        state: 'SOLID',
      });

      const pos = map[i];

      block.x = pos.x * this.config.blockSize;
      block.y = pos.y;
      block.blockSize = this.config.blockSize;
      block.drawHitBox(this, 2); // add offset for visualization
      mapTiles[i] = block;
    }
    // assign world tiles
    this.tiles = mapTiles;
  }

  // draw the world tiles
  draw() {
    this.player.render();

    for (const tile of this.tiles) {
      tile.drawBox();
      this.addChild(tile);
    }
  }

  update(deltaTime: number) {
    this.player.update(deltaTime);

    for (const tile of this.tiles) {
      const playerBox = this.player.getHitBoxGlobal();
      const blockBox = tile.getHitboxGlobal();

      if (aabbIntersect(playerBox, blockBox)) {
        // this.resolveCollision(this.player, block);
        console.log('Collision occur');
      }
    }
  }
}
