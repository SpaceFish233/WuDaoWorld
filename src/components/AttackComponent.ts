// src/components/AttackComponent.ts
import type { SkillConfig } from '../data/skills';

export interface ComboState {
  inputBuffer: string[];
  lastInputTime: number;
  bufferTimeout: number;
  currentComboId: string | null;
}

export class AttackComponent {
  baseDamage: number;
  attackSpeed: number;
  criticalRate: number;
  criticalDamage: number;
  attackRange: number;
  skills: SkillConfig[];
  comboState: ComboState;

  constructor(opts: {
    baseDamage: number;
    attackSpeed?: number;
    criticalRate?: number;
    criticalDamage?: number;
    attackRange: number;
    skills?: SkillConfig[];
  }) {
    this.baseDamage = opts.baseDamage;
    this.attackSpeed = opts.attackSpeed ?? 1;
    this.criticalRate = opts.criticalRate ?? 0;
    this.criticalDamage = opts.criticalDamage ?? 0;
    this.attackRange = opts.attackRange;
    this.skills = opts.skills ?? [];
    this.comboState = {
      inputBuffer: [],
      lastInputTime: 0,
      bufferTimeout: 1000,
      currentComboId: null,
    };
  }
}
