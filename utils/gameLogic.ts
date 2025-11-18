import { Grid } from '@/types/game';

export const createEmptyGrid = (size: number = 16): Grid => {
    return Array(size)
        .fill(null)
        .map(() => Array(size).fill(0));
};

export const toggleCell = (grid: Grid, row: number, col: number): Grid => {
    const newGrid = grid.map(r => [...r]);
    if (newGrid[row] && typeof newGrid[row][col] !== 'undefined') {
        newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
    }
    return newGrid;
};

const countNeighbors = (grid: Grid, row: number, col: number): number => {
    const numRows = grid.length;
    const numCols = grid[0]?.length ?? 0;
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = (row + i + numRows) % numRows;
            const newCol = (col + j + numCols) % numCols;
            count += grid[newRow][newCol];
        }
    }
    return count;
};

export const nextGeneration = (grid: Grid): Grid => {
    return grid.map((row, i) =>
        row.map((cell, j) => {
            const neighbors = countNeighbors(grid, i, j);
            if (cell === 1) {
                return neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                return neighbors === 3 ? 1 : 0;
            }
        })
    );
};