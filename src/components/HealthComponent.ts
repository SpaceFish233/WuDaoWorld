// src/components/HealthComponent.ts
export class HealthComponent {
  currentHP: number;
  maxHP: number;
  hpRegen: number = 0;
  isDead: boolean = false;

  constructor(maxHP: number) {
    this.maxHP = maxHP;
    this.currentHP = maxHP;
  }

  takeDamage(amount: number): void {
    if (this.isDead) return;
    this.currentHP = Math.max(0, this.currentHP - amount);
    if (this.currentHP <= 0) this.isDead = true;
  }

  heal(amount: number): void {
    if (this.isDead) return;
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
  }

  reset(): void {
    this.currentHP = this.maxHP;
    this.isDead = false;
  }
}
