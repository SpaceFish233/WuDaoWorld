// src/systems/AnimationSystem.ts
import Phaser from 'phaser';
import { StateComponent, EntityState } from '../components/StateComponent';

const STATE_ANIM_MAP: Record<EntityState, string> = {
  idle: 'idle',
  walk: 'walk',
  run: 'walk',
  jump: 'jump',
  fall: 'fall',
  attack: 'attack',
  skill: 'skill1',
  block: 'block',
  dodge: 'dodge',
  hit: 'hit',
  die: 'die',
};

export class AnimationSystem {
  transitionState(state: StateComponent, newState: EntityState): boolean {
    if (state.isTransitionLocked) return false;
    if (state.currentState === newState) return false;
    state.set(newState);
    state.stateTimer = 0;
    return true;
  }

  lockState(state: StateComponent, durationMs: number): void {
    state.isTransitionLocked = true;
    state.stateTimer = durationMs;
  }

  updateStateTimer(state: StateComponent, deltaMs: number): boolean {
    if (state.isTransitionLocked) {
      state.stateTimer -= deltaMs;
      if (state.stateTimer <= 0) {
        state.isTransitionLocked = false;
        state.stateTimer = 0;
        return true;
      }
    }
    return false;
  }

  playAnimation(
    state: StateComponent,
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    animKeyPrefix: string
  ): void {
    if (!sprite || !sprite.anims) return;
    const animSuffix = STATE_ANIM_MAP[state.currentState];
    const animKey = `${animKeyPrefix}_${animSuffix}`;
    if (sprite.anims.exists(animKey)) {
      sprite.anims.play(animKey, true);
    }
  }

  updateFacing(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, isFacingRight: boolean): void {
    if (!sprite) return;
    sprite.setFlipX(!isFacingRight);
  }
}
