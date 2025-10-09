import { Game } from '../game';

export class Controller {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  listen() {
    const player = this.game.world.player;

    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Escape':
          this.game.pausePlay();
          break;
        case 'KeyE':
          player.attack();
          break;
        case 'KeyQ':
          player.throwProjectile();
          break;
        case 'KeyA':
          player.moveLeft();
          break;
        case 'KeyD':
          player.moveRight();
          break;
        case 'KeyW':
          player.moveUp();
          break;
        case 'KeyS':
          player.moveDown();
          break;
        case 'Space':
          player.jump();
          break;
        default:
          break;
      }
    });

    // Key release event listener
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyA':
          player.stopMovement();
          break;
        case 'KeyD':
          player.stopMovement();
          break;
        default:
          // this.game.player.idle();
          break;
      }
    });
  }
}
