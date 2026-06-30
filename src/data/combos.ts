// src/data/combos.ts
export interface ComboEntry {
  inputs: string[];
  comboId: string;
  name: string;
}

export const COMBO_TABLES: Record<string, ComboEntry[]> = {
  swordsman: [
    { inputs: ['light', 'light', 'heavy'], comboId: 'triple_slash', name: '三连斩' },
    { inputs: ['light', 'heavy', 'light'], comboId: 'rising_slash', name: '升龙斩' },
    { inputs: ['skill1', 'light', 'light'], comboId: 'wave_combo', name: '剑气连击' },
    { inputs: ['skill2', 'heavy'], comboId: 'whirlwind_finish', name: '旋风终结' },
  ],
};

export function matchCombo(characterId: string, inputBuffer: string[]): string | null {
  const table = COMBO_TABLES[characterId];
  if (!table) return null;
  const sorted = [...table].sort((a, b) => b.inputs.length - a.inputs.length);
  const recentInputs = inputBuffer.slice(-4);
  for (const combo of sorted) {
    if (combo.inputs.length <= recentInputs.length) {
      const tail = recentInputs.slice(-combo.inputs.length);
      if (tail.every((input, i) => input === combo.inputs[i])) {
        return combo.comboId;
      }
    }
  }
  return null;
}
