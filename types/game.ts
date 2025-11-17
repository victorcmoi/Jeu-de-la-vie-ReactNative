export type CellState = 0 | 1;
export type Grid = CellState[][];

export interface SavedGrid {
    id: string;
    name: string;
    grid: Grid;
    timestamp: number;
}