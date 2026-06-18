import { describe, expect, it, vi } from 'vitest';
import { log } from './log';

describe('log', () => {
  it('exposes debug, info, warn, error', () => {
    expect(typeof log.debug).toBe('function');
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
  });

  it('error always forwards to console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    log.error('boom', { x: 1 });
    expect(spy).toHaveBeenCalledWith('boom', { x: 1 });
    spy.mockRestore();
  });
});
