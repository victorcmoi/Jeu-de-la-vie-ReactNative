import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Grid } from '@/components/game/Grid';
import { Controls } from '@/components/game/Controls';
import { createEmptyGrid, toggleCell, nextGeneration } from '@/utils/gameLogic';
import { Grid as GridType } from '@/types/game';

export default function GameScreen() {
    const [grid, setGrid] = useState<GridType>(createEmptyGrid());
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null | number>(null);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setGrid(currentGrid => nextGeneration(currentGrid));
            }, 500);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying]);

    const handleCellPress = (row: number, col: number) => {
        if (!isPlaying) {
            setGrid(currentGrid => toggleCell(currentGrid, row, col));
        }
    };

    const handleNext = () => {
        setGrid(currentGrid => nextGeneration(currentGrid));
    };

    const handleReset = () => {
        setIsPlaying(false);
        setGrid(createEmptyGrid());
    };

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Grid
                    grid={grid}
                    onCellPress={handleCellPress}
                    editable={!isPlaying}
                />
                <Controls
                    onNext={handleNext}
                    onReset={handleReset}
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingVertical: 20,
    },
});