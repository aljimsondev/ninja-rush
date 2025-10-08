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
          this.game.pausePlay();
          break;
        case 'KeyE':
          this.game.player.attack();
          break;
        case 'KeyQ':
          this.game.player.throwProjectile();
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
          this.game.player.jump();
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
          // this.game.player.idle();
          break;
      }
    });
  }
}
