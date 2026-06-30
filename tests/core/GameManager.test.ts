// tests/core/GameManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GameManager } from '../../src/core/GameManager';

describe('GameManager', () => {
  beforeEach(() => {
    GameManager.reset();
  });

  it('单例模式获取实例', () => {
    const gm1 = GameManager.getInstance();
    const gm2 = GameManager.getInstance();
    expect(gm1).toBe(gm2);
  });

  it('初始状态正确', () => {
    const gm = GameManager.getInstance();
    expect(gm.selectedCharacter).toBe('swordsman');
    expect(gm.difficulty).toBe('normal');
    expect(gm.gold).toBe(0);
    expect(gm.totalExp).toBe(0);
  });

  it('addGold 正确累加金币', () => {
    const gm = GameManager.getInstance();
    gm.addGold(100);
    expect(gm.gold).toBe(100);
    gm.addGold(50);
    expect(gm.gold).toBe(150);
  });

  it('addExp 正确累加经验', () => {
    const gm = GameManager.getInstance();
    gm.addExp(50);
    expect(gm.totalExp).toBe(50);
  });

  it('setDifficulty 正确设置难度并返回对应倍率', () => {
    const gm = GameManager.getInstance();
    gm.setDifficulty('easy');
    expect(gm.getDifficultyMultiplier()).toEqual({ hpMul: 0.7, atkMul: 0.7 });
    gm.setDifficulty('hard');
    expect(gm.getDifficultyMultiplier()).toEqual({ hpMul: 1.5, atkMul: 1.3 });
  });
});
