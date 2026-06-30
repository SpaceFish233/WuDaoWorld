// src/ui/MenuUI.ts
import Phaser from 'phaser';

export interface MenuItem {
  text: Phaser.GameObjects.Text;
  action: () => void;
}

export class MenuUI {
  private scene: Phaser.Scene;
  private items: MenuItem[] = [];
  private selectedIndex: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createTitle(text: string, y: number = 80): void {
    const titleText = this.scene.add.text(480, y, text, {
      fontFamily: 'monospace', fontSize: '48px', color: '#cc9933', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4,
    });
    titleText.setOrigin(0.5);
  }

  addMenuItem(label: string, y: number, action: () => void): void {
    const text = this.scene.add.text(480, y, label, {
      fontFamily: 'monospace', fontSize: '28px', color: '#aaaaaa', stroke: '#000000', strokeThickness: 2,
    });
    text.setOrigin(0.5);
    text.setInteractive({ useHandCursor: true });

    text.on('pointerover', () => {
      this.selectedIndex = this.items.length;
      this.updateHighlight();
    });

    text.on('pointerdown', action);

    this.items.push({ text, action });
    this.updateHighlight();
  }

  setupKeyboard(): void {
    const upKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const enterKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    upKey.on('down', () => {
      this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
      this.updateHighlight();
    });

    downKey.on('down', () => {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
      this.updateHighlight();
    });

    enterKey.on('down', () => {
      if (this.items[this.selectedIndex]) {
        this.items[this.selectedIndex].action();
      }
    });
  }

  private updateHighlight(): void {
    this.items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.text.setColor('#cc9933');
        item.text.setScale(1.1);
      } else {
        item.text.setColor('#aaaaaa');
        item.text.setScale(1.0);
      }
    });
  }
}
