// tests/components/HealthComponent.test.ts
import { describe, it, expect } from 'vitest';
import { HealthComponent } from '../../src/components/HealthComponent';

describe('HealthComponent', () => {
  it('初始化为满血存活状态', () => {
    const h = new HealthComponent(1000);
    expect(h.currentHP).toBe(1000);
    expect(h.maxHP).toBe(1000);
    expect(h.isDead).toBe(false);
  });

  it('takeDamage 扣血并在归零时标记死亡', () => {
    const h = new HealthComponent(100);
    h.takeDamage(30);
    expect(h.currentHP).toBe(70);
    expect(h.isDead).toBe(false);
    h.takeDamage(80);
    expect(h.currentHP).toBe(0);
    expect(h.isDead).toBe(true);
  });

  it('heal 治疗量不超过 maxHP', () => {
    const h = new HealthComponent(100);
    h.takeDamage(20);
    h.heal(50);
    expect(h.currentHP).toBe(100);
  });

  it('对死亡实体调用 takeDamage 无效', () => {
    const h = new HealthComponent(10);
    h.takeDamage(10);
    h.takeDamage(50);
    expect(h.currentHP).toBe(0);
  });

  it('reset 恢复满血状态', () => {
    const h = new HealthComponent(100);
    h.takeDamage(60);
    h.reset();
    expect(h.currentHP).toBe(100);
    expect(h.isDead).toBe(false);
  });
});
