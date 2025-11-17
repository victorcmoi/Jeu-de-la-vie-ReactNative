import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { CellState } from '@/types/game';

interface CellProps {
    state: CellState;
    onPress: () => void;
    size: number;
}

export const Cell: React.FC<CellProps> = ({ state, onPress, size }) => {
    return (
        <TouchableOpacity
            style={[
                styles.cell,
                { width: size, height: size },
                state === 1 ? styles.alive : styles.dead,
            ]}
            onPress={onPress}
        />
    );
};

const styles = StyleSheet.create({
    cell: {
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    alive: {
        backgroundColor: '#2ecc71',
    },
    dead: {
        backgroundColor: '#ecf0f1',
    },
});