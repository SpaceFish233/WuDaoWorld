// src/components/MovementComponent.ts
export class MovementComponent {
  moveSpeed: number;
  jumpForce: number;
  isGrounded: boolean = false;
  isJumping: boolean = false;
  isFacingRight: boolean = true;
  dodgeCooldown: number = 0;
  dodgeCooldownMax: number;
  isDodging: boolean = false;

  constructor(opts: { moveSpeed: number; jumpForce: number; dodgeCooldownMax?: number }) {
    this.moveSpeed = opts.moveSpeed;
    this.jumpForce = opts.jumpForce;
    this.dodgeCooldownMax = opts.dodgeCooldownMax ?? 1500;
  }
}
