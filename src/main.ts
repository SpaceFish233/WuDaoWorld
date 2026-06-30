import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  pixelArt: true,
  backgroundColor: '#1a1a2e',
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 800 }, debug: false } },
  scene: [BootScene, MenuScene],
};

new Phaser.Game(config);
