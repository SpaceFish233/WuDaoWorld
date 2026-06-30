// src/components/StateComponent.ts
export type EntityState =
  | 'idle' | 'walk' | 'run' | 'jump' | 'fall'
  | 'attack' | 'skill' | 'block' | 'dodge' | 'hit' | 'die';

export class StateComponent {
  currentState: EntityState = 'idle';
  previousState: EntityState = 'idle';
  stateTimer: number = 0;
  isTransitionLocked: boolean = false;

  set(state: EntityState): void {
    this.previousState = this.currentState;
    this.currentState = state;
  }
}
