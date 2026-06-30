// src/core/EventBus.ts
type Listener = (...args: any[]) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners = new Map<string, Listener[]>();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  static reset(): void {
    EventBus.instance = undefined as any;
  }

  on(event: string, callback: Listener): void {
    const list = this.listeners.get(event);
    if (list) {
      list.push(callback);
    } else {
      this.listeners.set(event, [callback]);
    }
  }

  off(event: string, callback: Listener): void {
    const list = this.listeners.get(event);
    if (!list) return;
    const idx = list.indexOf(callback);
    if (idx > -1) list.splice(idx, 1);
    if (list.length === 0) this.listeners.delete(event);
  }

  emit(event: string, ...args: any[]): void {
    const list = this.listeners.get(event);
    if (!list) return;
    for (const cb of [...list]) cb(...args);
  }

  clear(event: string): void {
    this.listeners.delete(event);
  }
}
