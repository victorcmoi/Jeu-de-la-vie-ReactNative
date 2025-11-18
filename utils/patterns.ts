import { Grid, PatternName } from '@/types/game';

// Utility to clone grid
const cloneGrid = (grid: Grid): Grid => grid.map(row => [...row]);

// Pattern definitions as relative offsets around center (0,0)
// Glider (relative positions)
const GLIDER: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];

// Pulsar: 13x13 period-3 oscillator. Coordinates relative to center.
const PULSAR_BASE: Array<[number, number]> = [];
(() => {
  const coords = [
    // Horizontal arms
    [-6, -4], [-6, -3], [-6, -2], [-6, 2], [-6, 3], [-6, 4],
    [-1, -4], [-1, -3], [-1, -2], [-1, 2], [-1, 3], [-1, 4],
    [1, -4], [1, -3], [1, -2], [1, 2], [1, 3], [1, 4],
    [6, -4], [6, -3], [6, -2], [6, 2], [6, 3], [6, 4],

    // Vertical arms
    [-4, -6], [-3, -6], [-2, -6], [2, -6], [3, -6], [4, -6],
    [-4, -1], [-3, -1], [-2, -1], [2, -1], [3, -1], [4, -1],
    [-4, 1], [-3, 1], [-2, 1], [2, 1], [3, 1], [4, 1],
    [-4, 6], [-3, 6], [-2, 6], [2, 6], [3, 6], [4, 6],
  ];
  PULSAR_BASE.push(...coords);
})();

// Common small patterns
const BLINKER: Array<[number, number]> = [[0, -1], [0, 0], [0, 1]];
const TOAD: Array<[number, number]> = [[0, -1], [0, 0], [0, 1], [1, 0], [1, 1], [1, 2]];
const BEACON: Array<[number, number]> = [[0, 0], [0, 1], [1, 0], [2, 3], [3, 2], [3, 3]];
const BLOCK: Array<[number, number]> = [[0, 0], [0, 1], [1, 0], [1, 1]];
const BEEHIVE: Array<[number, number]> = [[0, -1], [0, 1], [1, -2], [1, 2], [2, -1], [2, 1]];
const LOAF: Array<[number, number]> = [[0, -1], [0, 1], [1, -2], [1, 2], [2, -1], [2, 1], [1, 3]];
const BOAT: Array<[number, number]> = [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1]];

// Lightweight spaceship (LWSS)
const LWSS: Array<[number, number]> = [
  [0, -1], [0, 2],
  [1, -2], [2, -2], [3, -2], [3, 2],
  [4, -2], [4, -1], [4, 0], [4, 1],
];

// Gosper Glider Gun (simplified, relative offsets; requires large grid)
// Source mapping compacted to offsets around an origin
const GOSPER_GUN: Array<[number, number]> = [
  [0, 24],
  [1, 22], [1, 24],
  [2, 12], [2, 13], [2, 20], [2, 21], [2, 34], [2, 35],
  [3, 11], [3, 15], [3, 20], [3, 21], [3, 34], [3, 35],
  [4, 0], [4, 1], [4, 10], [4, 16], [4, 20], [4, 21],
  [5, 0], [5, 1], [5, 10], [5, 14], [5, 16], [5, 17], [5, 22], [5, 24],
  [6, 10], [6, 16], [6, 24],
  [7, 11], [7, 15],
  [8, 12], [8, 13],
];

const PATTERN_MAP: Record<PatternName, Array<[number, number]>> = {
  glider: GLIDER,
  pulsar: PULSAR_BASE,
  blinker: BLINKER,
  toad: TOAD,
  beacon: BEACON,
  block: BLOCK,
  beehive: BEEHIVE,
  loaf: LOAF,
  boat: BOAT,
  lwss: LWSS,
  gosperGun: GOSPER_GUN,
};

/**
 * Apply a predefined pattern centered in the grid.
 */
export const applyPattern = (grid: Grid, pattern: PatternName): Grid => {
  const size = grid.length;
  if (size === 0) return grid;
  const result = cloneGrid(grid);
  const offsets = PATTERN_MAP[pattern];
  const center = Math.floor(size / 2);

  for (const [dr, dc] of offsets) {
    const r = (center + dr + size) % size;
    const c = (center + dc + size) % size;
    result[r][c] = 1;
  }
  return result;
};

/** Place a pattern centered at a specific cell (row, col). */
export const applyPatternAt = (grid: Grid, pattern: PatternName, row: number, col: number): Grid => {
  const size = grid.length;
  if (size === 0) return grid;
  const result = cloneGrid(grid);
  const offsets = PATTERN_MAP[pattern];
  for (const [dr, dc] of offsets) {
    const r = (row + dr + size) % size;
    const c = (col + dc + size) % size;
    result[r][c] = 1;
  }
  return result;
};

/**
 * Clear the grid to all zeros but maintain size
 */
export const clearGrid = (grid: Grid): Grid => grid.map(row => row.map(() => 0));
