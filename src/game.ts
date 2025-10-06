import { Application, Assets, Sprite } from 'pixi.js';

export class Game {
  private app: Application;
  constructor() {
    this.app = new Application();
  }

  async run() {
    await this.app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById('pixi-container')!.appendChild(this.app.canvas);

    // Load the bunny texture
    const texture = await Assets.load('/assets/bunny.png');
    // Create a bunny Sprite
    const bunny = new Sprite(texture);

    // Center the sprite's anchor point
    bunny.anchor.set(0.5);

    // Move the sprite to the center of the screen
    bunny.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

    // Add the bunny to the stage
    this.app.stage.addChild(bunny);

    // Listen for animate update
    this.app.ticker.add((time) => {
      // Just for fun, let's rotate mr rabbit a little.
      // * Delta is 1 if running at 100% performance *
      // * Creates frame-independent transformation *
      bunny.rotation += 0.1 * time.deltaTime;
    });
  }
}
