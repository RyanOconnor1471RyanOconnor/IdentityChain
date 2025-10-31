import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const README_PATH = resolve(__dirname, '../docs/README.md');

describe('Documentation quality checks', () => {
  const content = readFileSync(README_PATH, 'utf-8');

  it('includes an overview section', () => {
    expect(content).toMatch(/overview/i);
  });

  it('lists deployed contract addresses', () => {
    expect(content).toMatch(/0x[a-fA-F0-9]{40}/);
  });

  it('mentions privacy or FHE guarantees', () => {
    expect(content).toMatch(/privacy|FHE/i);
  });
});
