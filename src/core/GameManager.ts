// src/core/GameManager.ts
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export class GameManager {
  private static instance: GameManager;

  public selectedCharacter: string = 'swordsman';
  public difficulty: DifficultyLevel = 'normal';
  public gold: number = 0;
  public totalExp: number = 0;
  public currentStage: string = 'stage_1';
  public playerCount: number = 1;

  private constructor() {}

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  static reset(): void {
    GameManager.instance = undefined as any;
  }

  addGold(amount: number): void {
    this.gold += amount;
  }

  addExp(amount: number): void {
    this.totalExp += amount;
  }

  setDifficulty(diff: DifficultyLevel): void {
    this.difficulty = diff;
  }

  getDifficultyMultiplier(): { hpMul: number; atkMul: number } {
    switch (this.difficulty) {
      case 'easy': return { hpMul: 0.7, atkMul: 0.7 };
      case 'hard': return { hpMul: 1.5, atkMul: 1.3 };
      default: return { hpMul: 1.0, atkMul: 1.0 };
    }
  }
}
