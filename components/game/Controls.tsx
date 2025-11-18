import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { PatternName } from '@/types/game';

interface ControlsProps {
    onNext: () => void;
    onReset: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    // Debug Undo additions
    onUndo?: () => void;
    canUndo?: boolean;
    isDebugUndo?: boolean;
    // V2 additions
    gridSize: number;
    onIncreaseSize: () => void;
    onDecreaseSize: () => void;
    minSize?: number;
    maxSize?: number;
    onSave: () => void;
    onLoad: () => void;
    // V3 additions
    onOpenSaves: () => void;
    onSelectPattern: (pattern: PatternName) => void;
    placementPattern: PatternName | null;
    onEndPlacement: () => void;
}

const ALL_PATTERNS: PatternName[] = [
    'glider','pulsar','blinker','toad','beacon','block','beehive','loaf','boat','lwss','gosperGun'
];

export const Controls: React.FC<ControlsProps> = ({
                                                      onNext,
                                                      onReset,
                                                      isPlaying,
                                                      onTogglePlay,
                                                      // Debug Undo props (optional)
                                                      onUndo,
                                                      canUndo = false,
                                                      isDebugUndo = false,
                                                      // Size & other controls
                                                      gridSize,
                                                      onIncreaseSize,
                                                      onDecreaseSize,
                                                      minSize = 8,
                                                      maxSize = 52,
                                                      onSave,
                                                      onLoad,
                                                      onOpenSaves,
                                                      onSelectPattern,
                                                      placementPattern,
                                                      onEndPlacement,
                                                  }) => {
    const canDec = gridSize > minSize;
    const canInc = gridSize < maxSize;

    return (
        <View style={styles.container}>
            {/* Lecture */}
            <Text style={styles.sectionTitle}>Lecture</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={onTogglePlay}>
                    <Text style={styles.buttonText}>
                        {isPlaying ? 'Pause' : 'Lancer'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, isPlaying && styles.buttonDisabled]}
                    onPress={onNext}
                    disabled={isPlaying}
                >
                    <Text style={styles.buttonText}>Prochain</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.warning]} onPress={onReset}>
                    <Text style={styles.buttonText}>Réinitialiser</Text>
                </TouchableOpacity>

                {isDebugUndo ? (
                    <TouchableOpacity
                        style={[styles.button, !canUndo && styles.buttonDisabled]}
                        onPress={onUndo}
                        disabled={!canUndo}
                    >
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Taille */}
            <Text style={styles.sectionTitle}>Taille</Text>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.button, !canDec && styles.buttonDisabled]} onPress={onDecreaseSize} disabled={!canDec}>
                    <Text style={styles.buttonText}>- Taille</Text>
                </TouchableOpacity>
                <View style={[styles.button, styles.info]}>
                    <Text style={styles.infoText}>Taille: {gridSize}x{gridSize}</Text>
                </View>
                <TouchableOpacity style={[styles.button, !canInc && styles.buttonDisabled]} onPress={onIncreaseSize} disabled={!canInc}>
                    <Text style={styles.buttonText}>+ Taille</Text>
                </TouchableOpacity>
            </View>

            {/* Sauvegardes */}
            <Text style={styles.sectionTitle}>Sauvegardes</Text>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
                    <Text style={styles.buttonText}>Sauver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.loadButton]} onPress={onLoad}>
                    <Text style={styles.buttonText}>Charger dernier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onOpenSaves}>
                    <Text style={styles.buttonText}>Liste</Text>
                </TouchableOpacity>
            </View>

            {/* Motifs */}
            <Text style={styles.sectionTitle}>Motifs</Text>
            {placementPattern && (
                <View style={[styles.row, styles.placementBar]}>
                    <Text style={styles.infoText}>Placement: {placementPattern}</Text>
                    <TouchableOpacity style={[styles.button, styles.warning]} onPress={onEndPlacement}>
                        <Text style={styles.buttonText}>Terminer</Text>
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {ALL_PATTERNS.map(p => (
                    <TouchableOpacity key={p} style={styles.chip} onPress={() => onSelectPattern(p)}>
                        <Text style={styles.chipText}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#34495e',
        marginTop: 6,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondary: {
        backgroundColor: '#16a085',
    },
    warning: {
        backgroundColor: '#e67e22',
    },
    info: {
        backgroundColor: '#f1f2f6',
        borderWidth: 1,
        borderColor: '#dcdde1',
    },
    infoText: {
        color: '#2c3e50',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
    },
    saveButton: {
        backgroundColor: '#27ae60',
    },
    loadButton: {
        backgroundColor: '#8e44ad',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    chips: {
        gap: 8,
        paddingVertical: 4,
    },
    chip: {
        backgroundColor: '#bdc3c7',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    chipText: {
        color: '#2c3e50',
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    placementBar: {
        alignItems: 'center',
    }
});