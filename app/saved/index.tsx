import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal, TextInput, Platform, Alert } from 'react-native';
import { SavedGrid } from '@/types/game';
import { listSaves, deleteSave, renameSave, setPendingLoadId } from '@/utils/storage';
import { useRouter, useFocusEffect } from 'expo-router';

export default function SavedScreen() {
  const router = useRouter();
  const [saves, setSaves] = useState<SavedGrid[]>([]);
  const [loading, setLoading] = useState(false);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listSaves();
      setSaves(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
      return () => {};
    }, [])
  );

  const handleLoad = async (id: string) => {
    await setPendingLoadId(id);
    router.switchTab?.(0);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cette sauvegarde ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteSave(id); await load(); } },
    ]);
  };

  const handleRename = (id: string, currentName: string) => {
    if (Platform.OS === 'ios' && (Alert as any).prompt) {
      (Alert as any).prompt('Renommer', 'Entrez un nouveau nom', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'OK', onPress: async (text: string) => { await renameSave(id, text); await load(); } },
      ], 'plain-text', currentName);
    } else {
      setRenaming({ id, name: currentName });
    }
  };

  const renderItem = ({ item }: { item: SavedGrid }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.size || item.grid.length}x{item.size || item.grid.length} • {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.load]} onPress={() => handleLoad(item.id)}>
          <Text style={styles.actionText}>Charger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.rename]} onPress={() => handleRename(item.id, item.name)}>
          <Text style={styles.actionText}>Renommer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.delete]} onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionText}>Suppr.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={saves}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={!loading ? (
          <View style={styles.empty}> 
            <Text style={styles.emptyText}>Aucune sauvegarde pour l'instant.</Text>
          </View>
        ) : null}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />

      {/* Rename modal for Android/web */}
      <Modal visible={!!renaming} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Renommer</Text>
            <TextInput
              style={styles.input}
              value={renaming?.name || ''}
              onChangeText={(t) => renaming && setRenaming({ ...renaming, name: t })}
              placeholder="Nom de la sauvegarde"
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancel]} onPress={() => setRenaming(null)}>
                <Text style={styles.modalBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirm]}
                onPress={async () => {
                  if (renaming) {
                    await renameSave(renaming.id, renaming.name);
                    setRenaming(null);
                    await load();
                  }
                }}
              >
                <Text style={styles.modalBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionText: { color: 'white', fontWeight: '700' },
  load: { backgroundColor: '#3498db' },
  rename: { backgroundColor: '#16a085' },
  delete: { backgroundColor: '#e74c3c' },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#6b7280' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  cancel: { backgroundColor: '#95a5a6' },
  confirm: { backgroundColor: '#3498db' },
  modalBtnText: { color: 'white', fontWeight: '700' },
});
