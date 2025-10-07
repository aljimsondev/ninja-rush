import { Application, Container } from 'pixi.js';
import { Player } from './core/player';

export class Game {
  app: Application;
  world: Container;

  constructor() {
    this.app = new Application();
    this.world = new Container();
  }

  async run() {
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById('pixi-container')!.appendChild(this.app.canvas);

    const player = new Player(this);

    this.app.stage.addChild(player);

    // Listen for animate update
    this.app.ticker.add((time) => {
      // Just for fun, let's rotate mr rabbit a little.
      // * Delta is 1 if running at 100% performance *
      // * Creates frame-independent transformation *
      // bunny.rotation += 0.1 * time.deltaTime;
      player.update();
    });
  }
}
