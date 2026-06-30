// src/components/DefenseComponent.ts
export class DefenseComponent {
  defense: number;
  blockRate: number;
  dodgeCooldown: number;
  isBlocking: boolean = false;
  isInvincible: boolean = false;

  constructor(opts: { defense: number; blockRate?: number; dodgeCooldown?: number }) {
    this.defense = opts.defense;
    this.blockRate = opts.blockRate ?? 0;
    this.dodgeCooldown = opts.dodgeCooldown ?? 0;
  }
}
