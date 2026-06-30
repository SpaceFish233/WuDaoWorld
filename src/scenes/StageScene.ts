// src/scenes/StageScene.ts
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { InputSystem } from '../systems/InputSystem';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { AnimationSystem } from '../systems/AnimationSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { EventBus } from '../core/EventBus';
import { getCharacter } from '../data/characters';
import { getStage } from '../data/stages';
import { HealthBar } from '../ui/HealthBar';
import { ComboDisplay } from '../ui/ComboDisplay';

interface StageSceneData {
  mode: 'single' | 'coop';
  stageId: string;
}

export class StageScene extends Phaser.Scene {
  private players: Player[] = [];
  private enemies: Enemy[] = [];
  private inputSystem!: InputSystem;
  private physicsSystem!: PhysicsSystem;
  private animSystem!: AnimationSystem;
  private combatSystem!: CombatSystem;
  private eventBus!: EventBus;
  private healthBars: HealthBar[] = [];
  private comboDisplay!: ComboDisplay;
  private playerCount: number = 1;
  private currentStageId: string = 'stage_1';

  constructor() {
    super({ key: 'StageScene' });
  }

  init(data: StageSceneData): void {
    this.playerCount = data.mode === 'coop' ? 2 : 1;
    this.currentStageId = data.stageId;
  }

  create(): void {
    EventBus.reset();
    this.eventBus = EventBus.getInstance();

    this.inputSystem = new InputSystem(this);
    this.physicsSystem = new PhysicsSystem(this);
    this.animSystem = new AnimationSystem();
    this.combatSystem = new CombatSystem();

    this.physicsSystem.createGround(500);

    const swordsman = getCharacter('swordsman');

    for (let i = 0; i < this.playerCount; i++) {
      const x = 200 + i * 100;
      const player = new Player(
        this, swordsman, i, x, 350,
        this.inputSystem, this.physicsSystem, this.animSystem, this.combatSystem
      );
      this.players.push(player);

      const barX = i === 0 ? 20 : 520;
      const barColor = i === 0 ? 0x44cc44 : 0x4488ff;
      const hpBar = new HealthBar(this, barX, 20, 400, 20, player.health, `P${i + 1} 剑客`, barColor);
      this.healthBars.push(hpBar);
    }

    const stageConfig = getStage(this.currentStageId);
    stageConfig.waves[0].enemies.forEach(spawn => {
      this.spawnEnemy(spawn.x, 400, spawn.hp, spawn.attack, spawn.defense);
    });

    this.comboDisplay = new ComboDisplay(this, 480, 100);
    this.setupCombatEvents();

    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => {
      this.scene.start('MenuScene');
    });
  }

  private spawnEnemy(x: number, y: number, hp: number, attack: number, defense: number): void {
    const enemy = new Enemy(this, x, y, 'bandit', hp, attack, defense, this.animSystem);
    enemy.setupCollision(this.physicsSystem.getPlatforms());
    this.enemies.push(enemy);
  }

  private setupCombatEvents(): void {
    this.eventBus.on('playerAttack', (player: Player, _attackType: string) => {
      for (const enemy of this.enemies) {
        if (enemy.health.isDead || !player.spriteComp.sprite || !enemy.spriteComp.sprite) continue;

        const distance = Math.abs(player.spriteComp.sprite.x - enemy.spriteComp.sprite.x);
        if (distance <= player.attack.attackRange) {
          const isCrit = Math.random() < player.attack.criticalRate;
          const damage = CombatSystem.calculateDamage(player.attack, enemy.defense, isCrit, 1);
          enemy.takeDamage(damage);
          this.comboDisplay.addHit(damage);

          const knockbackDir = player.movement.isFacingRight ? 1 : -1;
          enemy.spriteComp.sprite?.setVelocityX(150 * knockbackDir);
        }
      }
    });

    this.eventBus.on('playerSkill', (player: Player, skill: any) => {
      // Phase 2: 实现技能特效和AOE伤害
      console.log(`[Phase1] ${player.characterId} 释放技能: ${skill.name}`);
    });

    this.eventBus.on('enemyAttack', (enemy: Enemy, enemyX: number) => {
      for (const player of this.players) {
        if (player.health.isDead || !player.spriteComp.sprite) continue;

        const distance = Math.abs(player.spriteComp.sprite.x - enemyX);
        if (distance <= enemy.attack.attackRange) {
          const isCrit = Math.random() < enemy.attack.criticalRate;

          // 检查玩家是否在格挡状态（由 DefenseComponent.isBlocking 驱动）
          const blockMult = player.defense.isBlocking ? 0.3 : 1;
          const damage = CombatSystem.calculateDamage(enemy.attack, player.defense, isCrit, blockMult);
          player.takeDamage(damage);
        }
      }
    });

    this.eventBus.on('enemyDeath', (enemy: Enemy) => {
      const index = this.enemies.indexOf(enemy);
      if (index > -1) this.enemies.splice(index, 1);
    });

    this.eventBus.on('playerDeath', () => {
      const allDead = this.players.every((p) => p.health.isDead);
      if (allDead) {
        this.time.delayedCall(2000, () => {
          this.scene.start('MenuScene');
        });
      }
    });
  }

  update(_time: number, delta: number): void {
    for (const player of this.players) {
      player.update(delta);
    }

    for (const enemy of this.enemies) {
      if (!enemy.health.isDead) {
        const nearestPlayer = this.findNearestPlayer(enemy);
        if (nearestPlayer && nearestPlayer.spriteComp.sprite) {
          enemy.update(delta, nearestPlayer.spriteComp.sprite.x);
        }
      }
    }

    for (const bar of this.healthBars) {
      bar.update();
    }
  }

  private findNearestPlayer(enemy: Enemy): Player | null {
    let nearest: Player | null = null;
    let minDist = Infinity;

    for (const player of this.players) {
      if (player.health.isDead || !player.spriteComp.sprite || !enemy.spriteComp.sprite) continue;
      const dist = Math.abs(player.spriteComp.sprite.x - enemy.spriteComp.sprite.x);
      if (dist < minDist) {
        minDist = dist;
        nearest = player;
      }
    }

    return nearest;
  }
}
