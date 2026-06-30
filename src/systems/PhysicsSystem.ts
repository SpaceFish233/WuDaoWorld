// src/systems/PhysicsSystem.ts
import Phaser from 'phaser';
import { MovementComponent } from '../components/MovementComponent';

export class PhysicsSystem {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.platforms = scene.physics.add.staticGroup();
  }

  createGround(y: number = 480): void {
    const groundGraphics = this.scene.add.graphics();
    groundGraphics.fillStyle(0x3a5a3a, 1);
    groundGraphics.fillRect(0, 0, 960, 60);
    groundGraphics.generateTexture('ground_tex', 960, 60);
    groundGraphics.destroy();

    const ground = this.platforms.create(480, y, 'ground_tex') as Phaser.Physics.Arcade.Sprite;
    ground.setDisplaySize(960, 60);
    ground.refreshBody();
  }

  setupCollider(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, movement: MovementComponent): void {
    this.scene.physics.add.collider(sprite, this.platforms, () => {
      movement.isGrounded = sprite.body.blocked.down;
    });
  }

  getPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    return this.platforms;
  }
}
