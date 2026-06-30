// src/data/stages.ts
export interface EnemySpawn {
  type: string;
  count: number;
  spawnDelay: number;
  x: number;
  hp: number;
  attack: number;
  defense: number;
}

export interface Wave {
  enemies: EnemySpawn[];
  delayAfter: number;
}

export interface StageConfig {
  id: string;
  name: string;
  description: string;
  waves: Wave[];
  rewards: { gold: number; exp: number };
}

export const STAGES: StageConfig[] = [
  {
    id: 'stage_1',
    name: '竹林试炼',
    description: '教学关卡，熟悉基本操作',
    waves: [
      {
        enemies: [
          { type: 'bandit', count: 2, spawnDelay: 1000, x: 700, hp: 800, attack: 35, defense: 20 },
          { type: 'bandit', count: 1, spawnDelay: 1500, x: 800, hp: 600, attack: 30, defense: 20 },
        ],
        delayAfter: 3000,
      },
    ],
    rewards: { gold: 100, exp: 50 },
  },
];

export function getStage(id: string): StageConfig {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`Stage not found: ${id}`);
  return stage;
}
