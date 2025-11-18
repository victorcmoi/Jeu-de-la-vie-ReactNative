export type CellState = 0 | 1;
export type Grid = CellState[][];

export type PatternName =
  | 'glider'
  | 'pulsar'
  | 'blinker'
  | 'toad'
  | 'beacon'
  | 'block'
  | 'beehive'
  | 'loaf'
  | 'boat'
  | 'lwss'
  | 'gosperGun';

export interface SavedGrid {
    id: string;
    name: string;
    grid: Grid;
    size?: number;
    timestamp: number;
}