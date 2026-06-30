// tests/core/ObjectPool.test.ts
import { describe, it, expect, vi } from 'vitest';
import { ObjectPool } from '../../src/core/ObjectPool';

describe('ObjectPool', () => {
  it('首次 acquire 时通过工厂创建对象', () => {
    const factory = vi.fn(() => ({ active: false }));
    const reset = vi.fn((obj) => { obj.active = false; });
    const pool = new ObjectPool(factory, reset, 0);
    const obj = pool.acquire();
    expect(factory).toHaveBeenCalledTimes(1);
    expect(obj.active).toBe(false);
  });

  it('复用已释放的对象', () => {
    const factory = vi.fn(() => ({ active: false }));
    const reset = vi.fn((obj) => { obj.active = false; });
    const pool = new ObjectPool(factory, reset, 0);
    const a = pool.acquire();
    pool.release(a);
    const b = pool.acquire();
    expect(factory).toHaveBeenCalledTimes(1);
    expect(b).toBe(a);
  });

  it('release 时调用 reset 回调', () => {
    const factory = vi.fn(() => ({ active: false }));
    const reset = vi.fn((obj) => { obj.active = false; });
    const pool = new ObjectPool(factory, reset, 0);
    const obj = pool.acquire();
    pool.release(obj);
    expect(reset).toHaveBeenCalledWith(obj);
  });

  it('按容量预分配对象', () => {
    const factory = vi.fn(() => ({ active: false }));
    const reset = vi.fn();
    new ObjectPool(factory, reset, 3);
    expect(factory).toHaveBeenCalledTimes(3);
  });

  it('预分配后 acquire 不触发新工厂调用', () => {
    const factory = vi.fn(() => ({ active: false }));
    const reset = vi.fn();
    const pool = new ObjectPool(factory, reset, 2);
    pool.acquire();
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
