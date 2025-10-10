import { Application } from 'pixi.js';
import { Config } from './core/config';
import { Controller } from './core/controller';
import { World } from './core/world';

export class Game {
  app: Application;
  world: World;
  isPaused: boolean = false;
  controller: Controller;
  config: Config;

  constructor() {
    this.controller = new Controller();
    this.app = new Application();
    this.world = new World(this.controller);

    this.config = new Config();
  }
  /**
   * Loads the game states, assets, etc.
   */
  async load() {
    // run the app initialization
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById('pixi-container')!.appendChild(this.app.canvas);

    // load world
    await this.world.load();
  }

  async exec() {
    // run game load
    await this.load();

    // draw world
    this.world.draw();

    // add world to the stage
    this.app.stage.addChild(this.world);

    // Listen for animate update
    this.app.ticker.add((time) => {
      if (this.isPaused) return;
      this.world.update(time.deltaTime);
      // Just for fun, let's rotate mr rabbit a little.
      // * Delta is 1 if running at 100% performance *
      // * Creates frame-independent transformation *
      // bunny.rotation += 0.1 * time.deltaTime;
      // this.player.update();

      // if (
      //   this.player.y >=
      //   this.app.screen.height / 2 - this.player.FRAME_HEIGHT
      // ) {
      //   this.player.y = this.app.screen.height / 2 - this.player.FRAME_HEIGHT;
      // }
    });
  }

  pausePlay() {
    this.isPaused = !this.isPaused;
  }
}
