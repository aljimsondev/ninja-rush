const keymap = {
  Escape: 'paused',
  KeyE: 'attack',
  KeyQ: 'cast',
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down',
  Space: 'jump',
} as const;

type KeyMapKeys = keyof typeof keymap;
type KeyMapValues = (typeof keymap)[KeyMapKeys];

export class Controller {
  keys: Record<
    KeyMapValues,
    {
      pressed: boolean;
      doubleTap: boolean;
      timestamp: number;
    }
  >;
  constructor() {
    this.keys = {
      paused: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      attack: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      cast: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      left: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      right: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      up: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      down: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
      jump: {
        pressed: false,
        doubleTap: false,
        timestamp: 0,
      },
    };
    window.addEventListener('keydown', (e) => this.handleKeydownHandler(e));
    window.addEventListener('keyup', (e) => this.handleKeyUpHandler(e));
  }

  handleKeydownHandler(e: KeyboardEvent) {
    const key = (keymap as any)[e.code] as keyof typeof this.keys;

    if (!key) return;

    const now = Date.now();

    // If not already in the double-tap state, toggle the double tap state if the key was pressed twice within 300ms.
    this.keys[key].doubleTap =
      this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;

    // toogle the key press
    this.keys[key].pressed = true;
  }

  handleKeyUpHandler(e: KeyboardEvent) {
    const key = (keymap as any)[e.code] as keyof typeof this.keys;

    if (!key) return;

    const now = Date.now();

    // Reset the key pressed state.
    this.keys[key].pressed = false;

    // Reset double tap only if the key is in the double-tap state.
    if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
    // Otherwise, update the timestamp to track the time difference till the next potential key down.
    else this.keys[key].timestamp = now;
  }
}
