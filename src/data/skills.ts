// src/data/skills.ts
export interface SkillConfig {
  id: string;
  name: string;
  description: string;
  type: 'projectile' | 'aoe' | 'buff' | 'melee';
  damage: number;
  cooldown: number;
  currentCooldown: number;
  range: number;
  animation: string;
}
