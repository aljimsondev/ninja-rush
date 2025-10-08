import { Application, Assets, Container } from 'pixi.js';
import { Controller } from './core/controller';
import { Player } from './core/player';

export class Game {
  app: Application;
  world: Container;
  isPaused: boolean = false;
  controller: Controller;
  player: Player;

  constructor() {
    this.app = new Application();
    this.world = new Container();
    this.controller = new Controller(this);
  }
  /**
   * Loads the game states, assets, etc.
   */
  async load() {
    // run the app initialization
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById('pixi-container')!.appendChild(this.app.canvas);

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
  }

  async exec() {
    // run game load
    await this.load();

    // set the initial player position
    this.player.setPosition({
      y: this.app.screen.height / 2 - this.player.FRAME_HEIGHT,
      x: 0,
    });
    // add the player container to the app state
    this.app.stage.addChild(this.player);

    // Listen for animate update
    this.app.ticker.add((time) => {
      if (this.isPaused) return;
      // Just for fun, let's rotate mr rabbit a little.
      // * Delta is 1 if running at 100% performance *
      // * Creates frame-independent transformation *
      // bunny.rotation += 0.1 * time.deltaTime;
      this.player.update();
    });
  }

  pausePlay() {
    this.isPaused = !this.isPaused;
  }
}
