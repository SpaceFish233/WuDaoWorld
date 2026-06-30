// tests/systems/CombatSystem.test.ts
import { describe, it, expect } from 'vitest';
import { CombatSystem } from '../../src/systems/CombatSystem';
import { AttackComponent } from '../../src/components/AttackComponent';
import { DefenseComponent } from '../../src/components/DefenseComponent';

describe('CombatSystem.calculateDamage', () => {
  it('无暴击无防御时返回基础伤害', () => {
    const attack = new AttackComponent({ baseDamage: 100, attackRange: 50 });
    const defense = new DefenseComponent({ defense: 0 });
    const result = CombatSystem.calculateDamage(attack, defense, false, 1);
    expect(result).toBe(100);
  });

  it('根据防御公式减伤: defense / (defense + 100)', () => {
    const attack = new AttackComponent({ baseDamage: 100, attackRange: 50 });
    const defense = new DefenseComponent({ defense: 60 });
    // 60 defense → 60/160 = 0.375 减伤 → 100 * 0.625 = 62.5
    const result = CombatSystem.calculateDamage(attack, defense, false, 1);
    expect(result).toBeCloseTo(62.5, 1);
  });

  it('应用暴击倍率 1.5 + criticalDamage', () => {
    const attack = new AttackComponent({ baseDamage: 100, criticalDamage: 0.5, attackRange: 50 });
    const defense = new DefenseComponent({ defense: 0 });
    const result = CombatSystem.calculateDamage(attack, defense, true, 1);
    expect(result).toBe(200);
  });

  it('应用格挡减伤倍率', () => {
    const attack = new AttackComponent({ baseDamage: 100, attackRange: 50 });
    const defense = new DefenseComponent({ defense: 0 });
    const result = CombatSystem.calculateDamage(attack, defense, false, 0.3);
    expect(result).toBe(30);
  });

  it('综合应用所有修正', () => {
    const attack = new AttackComponent({ baseDamage: 200, criticalDamage: 0.5, attackRange: 50 });
    const defense = new DefenseComponent({ defense: 100 });
    const result = CombatSystem.calculateDamage(attack, defense, true, 0.3);
    expect(result).toBeCloseTo(60, 1);
  });
});

describe('CombatSystem.detectCombo', () => {
  it('检测出剑客的三连斩', () => {
    const comboId = CombatSystem.detectCombo('swordsman', ['light', 'light', 'heavy']);
    expect(comboId).toBe('triple_slash');
  });

  it('未匹配的序列返回 null', () => {
    const comboId = CombatSystem.detectCombo('swordsman', ['heavy', 'heavy', 'heavy']);
    expect(comboId).toBeNull();
  });
});
