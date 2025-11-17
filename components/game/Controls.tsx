import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ControlsProps {
    onNext: () => void;
    onReset: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
                                                      onNext,
                                                      onReset,
                                                      isPlaying,
                                                      onTogglePlay,
                                                  }) => {
    return (
        <View style={styles.container}>
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
            </View>

            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={onReset}>
                    <Text style={styles.buttonText}>Recommencer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
    },
    saveButton: {
        backgroundColor: '#e74c3c',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});