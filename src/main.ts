import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  pixelArt: true,
  backgroundColor: '#1a1a2e',
  physics: { default: 'arcade', arcade: { gravity: { y: 800 }, debug: false } },
  scene: [],
};

new Phaser.Game(config);
