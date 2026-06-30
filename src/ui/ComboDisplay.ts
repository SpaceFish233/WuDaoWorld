// src/ui/ComboDisplay.ts
import Phaser from 'phaser';

export class ComboDisplay {
  private scene: Phaser.Scene;
  private comboText: Phaser.GameObjects.Text;
  private damageText: Phaser.GameObjects.Text;
  private comboCount: number = 0;
  private totalDamage: number = 0;
  private fadeTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.comboText = scene.add.text(x, y, '', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffcc00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.damageText = scene.add.text(x, y + 30, '', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ff6666', stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
  }

  addHit(damage: number): void {
    this.comboCount++;
    this.totalDamage += damage;

    this.comboText.setText(`${this.comboCount} COMBO!`);
    this.damageText.setText(`伤害: ${Math.round(this.totalDamage)}`);

    this.comboText.setScale(1.3);
    this.scene.tweens.add({
      targets: this.comboText,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut',
    });

    if (this.fadeTimer) this.fadeTimer.remove();
    this.fadeTimer = this.scene.time.delayedCall(2000, () => this.reset());
  }

  reset(): void {
    this.comboCount = 0;
    this.totalDamage = 0;
    this.comboText.setText('');
    this.damageText.setText('');
  }
}
