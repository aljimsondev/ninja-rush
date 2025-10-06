import { Container, Graphics } from 'pixi.js';
import { Game } from '../game';

export class Player extends Container {
  private game: Game;

  constructor(game: Game) {
    super();
    this.game = game;
    this.position = {
      x: 0,
      y: Math.floor(this.game.app.screen.height / this.height),
    };
  }

  /**
   * Render the player in the world container
   */
  render() {
    console.log(this.position.y);
    const model = new Graphics()
      .rect(
        this.position.x * this.width,
        this.position.y * this.height,
        this.width,
        this.height,
      )
      .fill({
        color: '#000000',
      });

    this.addChild(model);
  }

  /**
   * Apply updates to the player
   */
  update() {}
}
