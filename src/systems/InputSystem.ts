// src/systems/InputSystem.ts
import Phaser from 'phaser';

export type ActionKey = 'left' | 'right' | 'jump' | 'defend' | 'light' | 'heavy' | 'dodge' | 'skill1' | 'skill2';

export interface PlayerInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  defend: boolean;
  light: boolean;
  heavy: boolean;
  dodge: boolean;
  skill1: boolean;
  skill2: boolean;
}

interface KeyMapping {
  [key: string]: { player: number; action: ActionKey };
}

const KEY_MAPPING: KeyMapping = {
  W: { player: 0, action: 'jump' },
  A: { player: 0, action: 'left' },
  D: { player: 0, action: 'right' },
  S: { player: 0, action: 'defend' },
  J: { player: 0, action: 'light' },
  K: { player: 0, action: 'heavy' },
  L: { player: 0, action: 'dodge' },
  U: { player: 0, action: 'skill1' },
  I: { player: 0, action: 'skill2' },
  UP: { player: 1, action: 'jump' },
  LEFT: { player: 1, action: 'left' },
  RIGHT: { player: 1, action: 'right' },
  DOWN: { player: 1, action: 'defend' },
  NUMPAD_ONE: { player: 1, action: 'light' },
  NUMPAD_TWO: { player: 1, action: 'heavy' },
  NUMPAD_THREE: { player: 1, action: 'dodge' },
  NUMPAD_FOUR: { player: 1, action: 'skill1' },
  NUMPAD_FIVE: { player: 1, action: 'skill2' },
};

export class InputSystem {
  private keys: Map<string, Phaser.Input.Keyboard.Key> = new Map();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeys();
  }

  private setupKeys(): void {
    for (const keyName of Object.keys(KEY_MAPPING)) {
      const keyCode = Phaser.Input.Keyboard.KeyCodes[keyName as keyof typeof Phaser.Input.Keyboard.KeyCodes];
      if (keyCode !== undefined) {
        this.keys.set(keyName, this.scene.input.keyboard!.addKey(keyCode));
      }
    }
  }

  getInput(playerIndex: number): PlayerInput {
    const input: PlayerInput = {
      left: false, right: false, jump: false, defend: false,
      light: false, heavy: false, dodge: false, skill1: false, skill2: false,
    };

    for (const [keyName, mapping] of Object.entries(KEY_MAPPING)) {
      if (mapping.player === playerIndex) {
        const key = this.keys.get(keyName);
        if (key && Phaser.Input.Keyboard.JustDown(key)) {
          input[mapping.action] = true;
        }
      }
    }

    return input;
  }

  isHeld(playerIndex: number, action: ActionKey): boolean {
    for (const [keyName, mapping] of Object.entries(KEY_MAPPING)) {
      if (mapping.player === playerIndex && mapping.action === action) {
        const key = this.keys.get(keyName);
        if (key && key.isDown) return true;
      }
    }
    return false;
  }
}
