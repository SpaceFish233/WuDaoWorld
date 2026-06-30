// src/entities/Enemy.ts
import Phaser from 'phaser';
import { HealthComponent } from '../components/HealthComponent';
import { AttackComponent } from '../components/AttackComponent';
import { DefenseComponent } from '../components/DefenseComponent';
import { MovementComponent } from '../components/MovementComponent';
import { StateComponent } from '../components/StateComponent';
import { AnimationSystem } from '../systems/AnimationSystem';
import { EventBus } from '../core/EventBus';

export class Enemy {
  health: HealthComponent;
  attack: AttackComponent;
  defense: DefenseComponent;
  movement: MovementComponent;
  state: StateComponent;
  enemyType: string;
  spriteComp: { sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null; animKeyPrefix: string };

  private scene: Phaser.Scene;
  private animSystem: AnimationSystem;
  private eventBus: EventBus;
  private attackCooldown: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyType: string,
    hp: number,
    attackDamage: number,
    defense: number,
    animSystem: AnimationSystem
  ) {
    this.scene = scene;
    this.enemyType = enemyType;
    this.animSystem = animSystem;
    this.eventBus = EventBus.getInstance();

    this.health = new HealthComponent(hp);
    this.attack = new AttackComponent({
      baseDamage: attackDamage,
      criticalRate: 0.05,
      criticalDamage: 0.3,
      attackRange: 50,
    });
    this.defense = new DefenseComponent({ defense });
    this.movement = new MovementComponent({ moveSpeed: 60, jumpForce: -300 });
    this.state = new StateComponent();

    this.spriteComp = { sprite: null, animKeyPrefix: enemyType };
    this.spriteComp.sprite = scene.physics.add.sprite(x, y, 'swordsman');
    this.spriteComp.sprite.setCollideWorldBounds(true);
    this.spriteComp.sprite.setDisplaySize(40, 40);
    this.spriteComp.sprite.setTint(0xff4444);
  }

  setupCollision(platforms: Phaser.Physics.Arcade.StaticGroup): void {
    if (this.spriteComp.sprite) {
      this.scene.physics.add.collider(this.spriteComp.sprite, platforms, () => {
        this.movement.isGrounded = this.spriteComp.sprite!.body.blocked.down;
      });
    }
  }

  update(delta: number, playerX: number): void {
    if (this.health.isDead) return;

    this.attackCooldown -= delta;
    const sprite = this.spriteComp.sprite;
    if (!sprite) return;

    const distance = playerX - sprite.x;
    const absDistance = Math.abs(distance);

    if (absDistance > 60) {
      const direction = distance > 0 ? 1 : -1;
      sprite.setVelocityX(this.movement.moveSpeed * direction);
      this.movement.isFacingRight = direction > 0;
      this.animSystem.transitionState(this.state, 'walk');
    } else if (absDistance <= 60 && this.attackCooldown <= 0) {
      sprite.setVelocityX(0);
      this.animSystem.transitionState(this.state, 'attack');
      this.animSystem.lockState(this.state, 500);
      this.attackCooldown = 1500;
      this.eventBus.emit('enemyAttack', this, sprite.x);
    } else {
      sprite.setVelocityX(0);
      this.animSystem.transitionState(this.state, 'idle');
    }

    this.animSystem.updateFacing(sprite, this.movement.isFacingRight);
  }

  takeDamage(amount: number): void {
    this.health.takeDamage(amount);
    if (this.health.isDead) {
      this.animSystem.transitionState(this.state, 'die');
      this.eventBus.emit('enemyDeath', this);
      this.scene.time.delayedCall(500, () => {
        this.spriteComp.sprite?.destroy();
      });
    } else {
      this.animSystem.transitionState(this.state, 'hit');
      this.animSystem.lockState(this.state, 200);
    }
  }
}
