import { describe, it, expect } from 'vitest';
import { expectBytes32 } from '@/lib/fhe';

describe('normalizeBytes32', () => {
  it('pads shorter arrays with zeros to 32 bytes', () => {
    const input = Uint8Array.from([0xab, 0xcd]);
    expect(() => expectBytes32(input)).toThrow();
  });

  it('keeps exact 32-byte arrays unchanged', () => {
    const input = Uint8Array.from({ length: 32 }, (_, i) => i);
    const normalized = expectBytes32(input);
    const expected = '0x' + Array.from(input, (b) => b.toString(16).padStart(2, '0')).join('');
    expect(normalized).toBe(expected);
  });

  it('truncates longer arrays to 32 bytes', () => {
    const input = Uint8Array.from({ length: 40 }, (_, i) => i + 1);
    expect(() => expectBytes32(input)).toThrow();
  });
});
