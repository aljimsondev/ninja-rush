import { Game } from '../game';

export class Controller {
  game: Game;
  constructor(game: Game) {
    this.game = game;
    this.listen();
  }

  listen() {
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Escape':
          console.log('toggle pause/play');
          this.game.pausePlay();
          break;
        case 'KeyA':
          this.game.player.moveLeft();
          break;
        case 'KeyD':
          this.game.player.moveRight();
          break;
        case 'KeyW':
          this.game.player.moveUp();
          break;
        case 'KeyS':
          this.game.player.moveDown();
          break;
        case 'Space':
          console.log('Enable jump method');
          break;
        default:
          break;
      }
    });

    // Key release event listener
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyA':
          this.game.player.stopMovement();
          break;
        case 'KeyD':
          this.game.player.stopMovement();
          break;
        default:
          break;
      }
    });
  }
}
