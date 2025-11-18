import AsyncStorage from '@react-native-async-storage/async-storage';
import { Grid, SavedGrid } from '@/types/game';

const LAST_GRID_KEY = 'game_of_life:last_grid';
const LAST_SIZE_KEY = 'game_of_life:last_size';
const SAVES_KEY = 'gol:saves';
const PENDING_LOAD_ID_KEY = 'gol:pending_load_id';

// ---------- Legacy single-save helpers (kept for backward compatibility) ----------
export const saveLastGrid = async (grid: Grid): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_GRID_KEY, JSON.stringify(grid));
    await AsyncStorage.setItem(LAST_SIZE_KEY, String(grid.length));
  } catch (e) {
    console.warn('Failed to save grid', e);
    throw e;
  }
};

export const loadLastGrid = async (): Promise<{ grid: Grid; size: number } | null> => {
  try {
    const [gridStr, sizeStr] = await Promise.all([
      AsyncStorage.getItem(LAST_GRID_KEY),
      AsyncStorage.getItem(LAST_SIZE_KEY),
    ]);
    if (!gridStr || !sizeStr) return null;
    const parsed: Grid = JSON.parse(gridStr);
    const size = parseInt(sizeStr, 10) || parsed.length;
    return { grid: parsed, size };
  } catch (e) {
    console.warn('Failed to load grid', e);
    return null;
  }
};

export const clearSaved = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([LAST_GRID_KEY, LAST_SIZE_KEY]);
  } catch (e) {
    console.warn('Failed to clear saved data', e);
  }
};

// ---------- Multi-save API ----------
const readSaves = async (): Promise<SavedGrid[]> => {
  const str = await AsyncStorage.getItem(SAVES_KEY);
  if (!str) return [];
  try {
    const arr = JSON.parse(str) as SavedGrid[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const writeSaves = async (saves: SavedGrid[]): Promise<void> => {
  await AsyncStorage.setItem(SAVES_KEY, JSON.stringify(saves));
};

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const listSaves = async (): Promise<SavedGrid[]> => {
  const saves = await readSaves();
  // Sort by newest first
  return saves.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

export const saveGridNamed = async (name: string, grid: Grid): Promise<SavedGrid> => {
  const save: SavedGrid = {
    id: genId(),
    name: name?.trim() || 'Sans nom',
    grid,
    size: grid.length,
    timestamp: Date.now(),
  };
  const saves = await readSaves();
  saves.push(save);
  await writeSaves(saves);
  return save;
};

export const loadSave = async (id: string): Promise<SavedGrid | null> => {
  const saves = await readSaves();
  return saves.find(s => s.id === id) || null;
};

export const deleteSave = async (id: string): Promise<void> => {
  const saves = await readSaves();
  const next = saves.filter(s => s.id !== id);
  await writeSaves(next);
};

export const renameSave = async (id: string, name: string): Promise<void> => {
  const saves = await readSaves();
  const idx = saves.findIndex(s => s.id === id);
  if (idx >= 0) {
    saves[idx] = { ...saves[idx], name: name?.trim() || saves[idx].name, timestamp: Date.now() };
    await writeSaves(saves);
  }
};

export const migrateLegacyLastGrid = async (): Promise<void> => {
  try {
    const legacy = await loadLastGrid();
    if (!legacy) return;
    const exists = await readSaves();
    if (exists.length === 0) {
      await saveGridNamed('Import auto (ancienne sauvegarde)', legacy.grid);
    }
    // Clear legacy after migration
    await clearSaved();
  } catch (e) {
    console.warn('Migration skipped', e);
  }
};

// Pending-load coordination between tabs
export const setPendingLoadId = async (id: string | null): Promise<void> => {
  if (!id) {
    await AsyncStorage.removeItem(PENDING_LOAD_ID_KEY);
  } else {
    await AsyncStorage.setItem(PENDING_LOAD_ID_KEY, id);
  }
};

export const consumePendingLoadId = async (): Promise<string | null> => {
  const id = await AsyncStorage.getItem(PENDING_LOAD_ID_KEY);
  if (id) await AsyncStorage.removeItem(PENDING_LOAD_ID_KEY);
  return id;
};
