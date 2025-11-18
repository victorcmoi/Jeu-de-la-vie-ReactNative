import Constants from 'expo-constants';

// Prefer EXPO_PUBLIC_ env at build time; fallback to extra in app config if provided
const raw = (process.env.EXPO_PUBLIC_DEBUG_UNDO ?? (Constants?.expoConfig as any)?.extra?.debugUndo) as
  | string
  | boolean
  | undefined;

const parseBool = (v: any): boolean => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
  return false;
};

export const IS_DEBUG_UNDO = parseBool(raw);
