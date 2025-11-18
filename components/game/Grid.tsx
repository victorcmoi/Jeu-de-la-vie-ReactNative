import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Cell } from './Cell';
import { Grid as GridType } from '@/types/game';

interface GridProps {
    grid: GridType;
    onCellPress: (row: number, col: number) => void;
    editable?: boolean;
}

export const Grid: React.FC<GridProps> = ({ grid, onCellPress, editable = true }) => {
    const cellSize = useMemo(() => {
        const screenWidth = Dimensions.get('window').width;
        const padding = 40;
        const size = Math.max(1, grid.length || 16);
        return (screenWidth - padding) / size;
    }, [grid.length]);

    return (
        <View style={styles.container}>
            {grid.map((row, i) => (
                <View key={i} style={styles.row}>
                    {row.map((cell, j) => (
                        <Cell
                            key={`${i}-${j}`}
                            state={cell}
                            onPress={() => editable && onCellPress(i, j)}
                            size={cellSize}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});