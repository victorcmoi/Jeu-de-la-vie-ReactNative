import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Grid } from '@/components/game/Grid';
import { Controls } from '@/components/game/Controls';
import { createEmptyGrid, toggleCell, nextGeneration } from '@/utils/gameLogic';
import { applyPatternAt } from '@/utils/patterns';
import { migrateLegacyLastGrid, saveGridNamed, loadSave, consumePendingLoadId } from '@/utils/storage';
import { Grid as GridType, PatternName } from '@/types/game';
import { useFocusEffect, useRouter } from 'expo-router';
import { IS_DEBUG_UNDO } from '@/utils/config';

const MIN_SIZE = 8;
const MAX_SIZE = 52;
const DEFAULT_SIZE = 16;

export default function GameScreen() {
    const router = useRouter();
    const [gridSize, setGridSize] = useState<number>(DEFAULT_SIZE);
    const [grid, setGrid] = useState<GridType>(createEmptyGrid(DEFAULT_SIZE));
    const [history, setHistory] = useState<GridType[]>([]); // debug undo history (max 10)
    const [isPlaying, setIsPlaying] = useState(false);
    const [placementPattern, setPlacementPattern] = useState<PatternName | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null | number>(null);

    // Migrate old single save on first mount
    useEffect(() => {
        migrateLegacyLastGrid();
    }, []);

    // Check if a SavedGrid was selected in the Saved tab
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const id = await consumePendingLoadId();
                if (id) {
                    const saved = await loadSave(id);
                    if (saved) {
                        setIsPlaying(false);
                        setGridSize(saved.size || saved.grid.length);
                        setGrid(saved.grid);
                        if (IS_DEBUG_UNDO) setHistory([]);
                        Alert.alert('Chargement', `Chargé: ${saved.name}`);
                    }
                }
            })();
            return () => {};
        }, [])
    );

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setGrid(currentGrid => {
                    if (IS_DEBUG_UNDO) {
                        // push snapshot before advancing
                        setHistory(h => [currentGrid.map(r => [...r]), ...h].slice(0, 10));
                    }
                    return nextGeneration(currentGrid);
                });
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
        if (isPlaying) return;
        if (placementPattern) {
            setGrid(current => {
                if (IS_DEBUG_UNDO) setHistory(h => [current.map(r => [...r]), ...h].slice(0, 10));
                return applyPatternAt(current, placementPattern, row, col);
            });
        } else {
            setGrid(current => {
                if (IS_DEBUG_UNDO) setHistory(h => [current.map(r => [...r]), ...h].slice(0, 10));
                return toggleCell(current, row, col);
            });
        }
    };

    const handleNext = () => {
        setGrid(current => {
            if (IS_DEBUG_UNDO) setHistory(h => [current.map(r => [...r]), ...h].slice(0, 10));
            return nextGeneration(current);
        });
    };

    const handleReset = () => {
        setIsPlaying(false);
        setGrid(createEmptyGrid(gridSize));
        if (IS_DEBUG_UNDO) setHistory([]);
    };

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleUndo = () => {
        if (!IS_DEBUG_UNDO) return;
        setIsPlaying(false);
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const [last, ...rest] = prev;
            setGrid(last);
            return rest;
        });
    };

    const changeSize = (newSize: number) => {
        const size = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newSize));
        setIsPlaying(false);
        setGridSize(size);
        setGrid(createEmptyGrid(size));
        if (IS_DEBUG_UNDO) setHistory([]);
    };

    const handleIncreaseSize = () => changeSize(gridSize + 1);
    const handleDecreaseSize = () => changeSize(gridSize - 1);

    const handleSave = async () => {
        try {
            const date = new Date();
            const name = `Grille ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            await saveGridNamed(name, grid);
            Alert.alert('Sauvegarde', 'Grille enregistrée.');
        } catch (e) {
            Alert.alert('Erreur', "Impossible d'enregistrer la grille.");
        }
    };

    const handleOpenSaves = () => {
        router.push('/saved');
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
                    // Debug Undo props
                    isDebugUndo={IS_DEBUG_UNDO}
                    canUndo={history.length > 0}
                    onUndo={handleUndo}
                    // Size & save
                    gridSize={gridSize}
                    onIncreaseSize={handleIncreaseSize}
                    onDecreaseSize={handleDecreaseSize}
                    minSize={MIN_SIZE}
                    maxSize={MAX_SIZE}
                    onSave={handleSave}
                    onLoad={() => Alert.alert('Info', 'Utilisez l’onglet "Saved" pour charger une grille.')} 
                    onOpenSaves={handleOpenSaves}
                    // Patterns
                    onSelectPattern={(p) => setPlacementPattern(p)}
                    placementPattern={placementPattern}
                    onEndPlacement={() => setPlacementPattern(null)}
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