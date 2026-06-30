// src/entities/Player.ts
import Phaser from 'phaser';
import { HealthComponent } from '../components/HealthComponent';
import { AttackComponent } from '../components/AttackComponent';
import { DefenseComponent } from '../components/DefenseComponent';
import { MovementComponent } from '../components/MovementComponent';
import { StateComponent } from '../components/StateComponent';
import { CharacterData } from '../data/characters';
import { InputSystem, PlayerInput } from '../systems/InputSystem';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { AnimationSystem } from '../systems/AnimationSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { EventBus } from '../core/EventBus';

export class Player {
  health: HealthComponent;
  attack: AttackComponent;
  defense: DefenseComponent;
  movement: MovementComponent;
  state: StateComponent;
  characterId: string;
  playerIndex: number;
  spriteComp: { sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null; animKeyPrefix: string };

  private scene: Phaser.Scene;
  private inputSystem: InputSystem;
  private animSystem: AnimationSystem;
  private eventBus: EventBus;

  constructor(
    scene: Phaser.Scene,
    characterData: CharacterData,
    playerIndex: number,
    x: number,
    y: number,
    inputSystem: InputSystem,
    physicsSystem: PhysicsSystem,
    animSystem: AnimationSystem,
    _combatSystem: CombatSystem
  ) {
    this.scene = scene;
    this.playerIndex = playerIndex;
    this.characterId = characterData.id;
    this.inputSystem = inputSystem;
    this.animSystem = animSystem;
    this.eventBus = EventBus.getInstance();

    this.health = new HealthComponent(characterData.baseHP);
    this.attack = new AttackComponent({
      baseDamage: characterData.baseAttack,
      criticalRate: characterData.baseCriticalRate,
      criticalDamage: 0.5,
      attackRange: 60,
      skills: characterData.skills,
    });
    this.defense = new DefenseComponent({ defense: characterData.baseDefense });
    this.movement = new MovementComponent({ moveSpeed: characterData.baseSpeed * 30, jumpForce: -350 });
    this.state = new StateComponent();

    this.spriteComp = { sprite: null, animKeyPrefix: characterData.id };
    this.spriteComp.sprite = scene.physics.add.sprite(x, y, characterData.spriteSheet);
    this.spriteComp.sprite.setCollideWorldBounds(true);
    this.spriteComp.sprite.setDisplaySize(48, 48);

    physicsSystem.setupCollider(this.spriteComp.sprite, this.movement);
  }

  update(delta: number): void {
    if (this.health.isDead) {
      this.animSystem.transitionState(this.state, 'die');
      if (this.spriteComp.sprite) {
        this.animSystem.playAnimation(this.state, this.spriteComp.sprite, this.spriteComp.animKeyPrefix);
      }
      return;
    }

    const input = this.inputSystem.getInput(this.playerIndex);
    const sprite = this.spriteComp.sprite;
    if (!sprite) return;

    const unlocked = this.animSystem.updateStateTimer(this.state, delta);
    if (unlocked) {
      this.animSystem.transitionState(this.state, 'idle');
    }

    if (this.movement.dodgeCooldown > 0) {
      this.movement.dodgeCooldown -= delta;
    }

    if (!this.state.isTransitionLocked) {
      this.handleMovement(input, sprite);
      this.handleCombat(input);
    }
  }

  private handleMovement(input: PlayerInput, sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): void {
    // 水平移动
    if (input.left) {
      sprite.setVelocityX(-this.movement.moveSpeed);
      this.movement.isFacingRight = false;
      this.animSystem.transitionState(this.state, 'walk');
    } else if (input.right) {
      sprite.setVelocityX(this.movement.moveSpeed);
      this.movement.isFacingRight = true;
      this.animSystem.transitionState(this.state, 'walk');
    } else {
      sprite.setVelocityX(0);
      this.animSystem.transitionState(this.state, 'idle');
    }

    // 跳跃
    if (input.jump && this.movement.isGrounded) {
      sprite.setVelocityY(this.movement.jumpForce);
      this.movement.isGrounded = false;
      this.animSystem.transitionState(this.state, 'jump');
    }

    // 空中状态
    if (!this.movement.isGrounded) {
      if (sprite.body.velocity.y > 0) {
        this.animSystem.transitionState(this.state, 'fall');
      }
    }

    // 闪避
    if (input.dodge && this.movement.dodgeCooldown <= 0 && this.movement.isGrounded) {
      this.movement.dodgeCooldown = this.movement.dodgeCooldownMax;
      this.movement.isDodging = true;
      this.defense.isInvincible = true;
      const dodgeDir = this.movement.isFacingRight ? 200 : -200;
      sprite.setVelocityX(dodgeDir);
      this.animSystem.transitionState(this.state, 'dodge');
      this.animSystem.lockState(this.state, 300);
      this.scene.time.delayedCall(300, () => {
        this.movement.isDodging = false;
        this.defense.isInvincible = false;
      });
    }

    // 格挡
    this.handleBlock(input, sprite);

    // 更新朝向
    this.animSystem.updateFacing(sprite, this.movement.isFacingRight);
  }

  private handleBlock(input: PlayerInput, sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): void {
    if (input.defend && this.movement.isGrounded) {
      this.defense.isBlocking = true;
      this.animSystem.transitionState(this.state, 'block');
      sprite.setVelocityX(0);
    } else {
      this.defense.isBlocking = false;
      // 如果当前是 block 状态且没有被锁定，切回 idle
      if (this.state.currentState === 'block' && !this.state.isTransitionLocked) {
        this.animSystem.transitionState(this.state, 'idle');
      }
    }
  }

  private handleCombat(input: PlayerInput): void {
    const now = Date.now();
    const comboState = this.attack.comboState;

    if (now - comboState.lastInputTime > comboState.bufferTimeout) {
      comboState.inputBuffer = [];
    }

    // 轻攻击
    if (input.light) {
      comboState.inputBuffer.push('light');
      comboState.lastInputTime = now;
      this.animSystem.transitionState(this.state, 'attack');
      this.animSystem.lockState(this.state, 300 / this.attack.attackSpeed);
      this.eventBus.emit('playerAttack', this, 'light');
    }

    // 重攻击
    if (input.heavy) {
      comboState.inputBuffer.push('heavy');
      comboState.lastInputTime = now;
      this.animSystem.transitionState(this.state, 'attack');
      this.animSystem.lockState(this.state, 500 / this.attack.attackSpeed);
      this.eventBus.emit('playerAttack', this, 'heavy');
    }

    // 技能1 (剑气斩)
    if (input.skill1) {
      const skill = this.attack.skills[0];
      if (skill && skill.currentCooldown <= 0) {
        comboState.inputBuffer.push('skill1');
        comboState.lastInputTime = now;
        skill.currentCooldown = skill.cooldown;
        this.animSystem.transitionState(this.state, 'skill');
        this.animSystem.lockState(this.state, 600);
        this.eventBus.emit('playerSkill', this, skill);
      }
    }

    // 技能2 (旋风斩)
    if (input.skill2) {
      const skill = this.attack.skills[1];
      if (skill && skill.currentCooldown <= 0) {
        comboState.inputBuffer.push('skill2');
        comboState.lastInputTime = now;
        skill.currentCooldown = skill.cooldown;
        this.animSystem.transitionState(this.state, 'skill');
        this.animSystem.lockState(this.state, 800);
        this.eventBus.emit('playerSkill', this, skill);
      }
    }

    // 检测连招
    const comboId = CombatSystem.detectCombo(this.characterId, comboState.inputBuffer);
    if (comboId) {
      comboState.currentComboId = comboId;
      this.eventBus.emit('comboTriggered', this, comboId);
    }
  }

  takeDamage(amount: number): void {
    if (this.defense.isInvincible) return;
    this.health.takeDamage(amount);
    if (this.health.isDead) {
      this.eventBus.emit('playerDeath', this);
    } else {
      this.animSystem.transitionState(this.state, 'hit');
      this.animSystem.lockState(this.state, 200);
    }
  }
}
