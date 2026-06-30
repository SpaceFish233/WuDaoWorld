// src/scenes/MenuScene.ts
import Phaser from 'phaser';
import { MenuUI } from '../ui/MenuUI';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const bg = this.add.image(480, 270, 'menu_bg');
    bg.setDisplaySize(960, 540);
    bg.setAlpha(0.3);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x0a0a1a, 0.7);
    overlay.fillRect(0, 0, 960, 540);

    const menu = new MenuUI(this);
    menu.createTitle('武道天下', 120);

    this.add.text(480, 180, '— 横板格斗 —', {
      fontFamily: 'monospace', fontSize: '18px', color: '#888888',
    }).setOrigin(0.5);

    menu.addMenuItem('单人闯关', 280, () => {
      this.scene.start('StageScene', { mode: 'single', stageId: 'stage_1' });
    });

    menu.addMenuItem('双人闯关', 330, () => {
      this.scene.start('StageScene', { mode: 'coop', stageId: 'stage_1' });
    });

    menu.addMenuItem('双人对战', 380, () => {
      console.log('Arena mode - coming soon');
    });

    menu.addMenuItem('装备管理', 430, () => {
      console.log('Equipment - coming soon');
    });

    menu.addMenuItem('游戏设置', 480, () => {
      console.log('Settings - coming soon');
    });

    menu.setupKeyboard();

    this.add.text(480, 520, 'P1: WASD+JKLUI  P2: 方向键+小键盘1-5', {
      fontFamily: 'monospace', fontSize: '12px', color: '#555555',
    }).setOrigin(0.5);
  }
}
