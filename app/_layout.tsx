import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#3498db',
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Jeu de la Vie',
                    tabBarLabel: 'Game',
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Grilles sauvegardé',
                    tabBarLabel: 'Saved',
                }}
            />
        </Tabs>
    );
}