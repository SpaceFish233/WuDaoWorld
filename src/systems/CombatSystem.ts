// src/systems/CombatSystem.ts
import type { AttackComponent } from '../components/AttackComponent';
import type { DefenseComponent } from '../components/DefenseComponent';
import { matchCombo } from '../data/combos';

export class CombatSystem {
  /**
   * 计算最终伤害
   * 公式: finalDamage = baseDamage * critMultiplier * (1 - defenseReduction) * blockMultiplier
   * 防御减伤: defense / (defense + 100)
   * 暴击倍率: 1.5 + criticalDamage (如果暴击)
   * 返回精确浮点数，由调用方决定取整
   */
  static calculateDamage(
    attack: AttackComponent,
    defense: DefenseComponent,
    isCritical: boolean,
    blockMultiplier: number
  ): number {
    if (defense.isInvincible) return 0;

    let damage = attack.baseDamage;

    if (isCritical) {
      damage *= 1.5 + attack.criticalDamage;
    }

    const defenseReduction = defense.defense / (defense.defense + 100);
    damage *= 1 - defenseReduction;
    damage *= blockMultiplier;

    return Math.max(0, damage);
  }

  static detectCombo(characterId: string, inputBuffer: string[]): string | null {
    return matchCombo(characterId, inputBuffer);
  }
}
