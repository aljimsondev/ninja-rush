import { Assets, Container } from 'pixi.js';
import { Block } from './block';
import { Config } from './config';
import { Player } from './player';

const blocks = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 2,
    y: 0,
  },
  {
    x: 3,
    y: 0,
  },
];

export class World extends Container {
  config: Config;
  player: Player = {} as any;
  constructor() {
    super();
    this.config = new Config({ blockSize: 48 });
  }
  // load assets and others
  async load() {
    await this.loadPlayer();
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
    });
    // set the initial player position
    // this.player.setPosition({
    //   y: this.app.screen.height / 2 - this.player.FRAME_HEIGHT,
    //   x: 0,
    // });

    // this.player.setGroundY(
    //   this.app.screen.height / 2 - this.player.FRAME_HEIGHT,
    // );

    this.addChild(this.player);
  }

  draw() {
    for (let i = 0; i < blocks.length; i++) {
      const block = new Block({
        state: 'SOLID',
      });

      const pos = blocks[i];

      block.x = pos.x * this.config.blockSize;
      block.y = pos.y * this.config.blockSize;

      block.drawBox(this.config.blockSize, this.config.blockSize);

      this.addChild(block);
    }
  }
  update() {
    this.player.update();

    // if (
    //   this.player.y >=
    //   this.app.screen.height / 2 - this.player.FRAME_HEIGHT
    // ) {
    //   this.player.y = this.app.screen.height / 2 - this.player.FRAME_HEIGHT;
    // }
  }
}
