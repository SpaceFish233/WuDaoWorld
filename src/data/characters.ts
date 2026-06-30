// src/data/characters.ts
import { SkillConfig } from './skills';

export interface CharacterData {
  id: string;
  name: string;
  description: string;
  spriteSheet: string;
  baseHP: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  baseCriticalRate: number;
  hpGrowth: number;
  attackGrowth: number;
  defenseGrowth: number;
  skills: SkillConfig[];
}

export const CHARACTERS: Record<string, CharacterData> = {
  swordsman: {
    id: 'swordsman',
    name: '剑客',
    description: '攻守兼备的剑术大师，适合新手玩家',
    spriteSheet: 'swordsman',
    baseHP: 1000,
    baseAttack: 80,
    baseDefense: 60,
    baseSpeed: 5,
    baseCriticalRate: 0.1,
    hpGrowth: 100,
    attackGrowth: 8,
    defenseGrowth: 6,
    skills: [
      {
        id: 'slash_wave',
        name: '剑气斩',
        description: '发出一道剑气攻击前方敌人',
        type: 'projectile',
        damage: 150,
        cooldown: 5000,
        currentCooldown: 0,
        range: 300,
        animation: 'skill1',
      },
      {
        id: 'whirlwind',
        name: '旋风斩',
        description: '原地旋转攻击周围敌人',
        type: 'aoe',
        damage: 200,
        cooldown: 8000,
        currentCooldown: 0,
        range: 150,
        animation: 'skill2',
      },
    ],
  },
};

export function getCharacter(id: string): CharacterData {
  const char = CHARACTERS[id];
  if (!char) throw new Error(`Character not found: ${id}`);
  return char;
}
