// tests/core/EventBus.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventBus } from '../../src/core/EventBus';

describe('EventBus', () => {
  beforeEach(() => {
    EventBus.reset();
  });

  it('单例模式获取实例', () => {
    const bus1 = EventBus.getInstance();
    const bus2 = EventBus.getInstance();
    expect(bus1).toBe(bus2);
  });

  it('能向注册的监听器分发事件', () => {
    const bus = EventBus.getInstance();
    const cb = vi.fn();
    bus.on('hit', cb);
    bus.emit('hit', { damage: 10 });
    expect(cb).toHaveBeenCalledWith({ damage: 10 });
  });

  it('支持多个监听器', () => {
    const bus = EventBus.getInstance();
    const a = vi.fn();
    const b = vi.fn();
    bus.on('x', a);
    bus.on('x', b);
    bus.emit('x', 1);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('off 移除特定监听器', () => {
    const bus = EventBus.getInstance();
    const cb = vi.fn();
    bus.on('e', cb);
    bus.off('e', cb);
    bus.emit('e');
    expect(cb).not.toHaveBeenCalled();
  });

  it('无监听器时 emit 不报错', () => {
    const bus = EventBus.getInstance();
    expect(() => bus.emit('nothing')).not.toThrow();
  });

  it('clear 移除某事件的所有监听器', () => {
    const bus = EventBus.getInstance();
    const a = vi.fn();
    bus.on('e', a);
    bus.clear('e');
    bus.emit('e');
    expect(a).not.toHaveBeenCalled();
  });
});
