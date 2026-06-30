// src/ui/HealthBar.ts
import Phaser from 'phaser';
import { HealthComponent } from '../components/HealthComponent';

export class HealthBar {
  private graphics: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private hpText: Phaser.GameObjects.Text;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private health: HealthComponent;
  private barColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    health: HealthComponent,
    playerName: string,
    barColor: number = 0x44cc44
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.barColor = barColor;

    this.graphics = scene.add.graphics();
    this.nameText = scene.add.text(x, y - 20, playerName, {
      fontFamily: 'monospace', fontSize: '14px', color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    }).setScrollFactor(0);
    this.hpText = scene.add.text(x + width + 10, y + 2, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
    }).setScrollFactor(0).setDepth(100);
    this.graphics.setScrollFactor(0);
  }

  update(): void {
    this.graphics.clear();

    const hpRatio = Math.max(0, this.health.currentHP / this.health.maxHP);
    const currentWidth = this.width * hpRatio;

    this.graphics.fillStyle(0x333333, 0.8);
    this.graphics.fillRect(this.x, this.y, this.width, this.height);

    let color = this.barColor;
    if (hpRatio < 0.3) color = 0xcc2222;
    else if (hpRatio < 0.6) color = 0xccaa22;

    this.graphics.fillStyle(color, 1);
    this.graphics.fillRect(this.x, this.y, currentWidth, this.height);

    this.graphics.lineStyle(2, 0xcccccc, 1);
    this.graphics.strokeRect(this.x, this.y, this.width, this.height);

    this.hpText.setText(`${Math.round(this.health.currentHP)} / ${this.health.maxHP}`);
  }

  destroy(): void {
    this.graphics.destroy();
    this.nameText.destroy();
    this.hpText.destroy();
  }
}
