// Shared types — no database dependency

export interface Keyboard {
  id: number;
  name: string;
  color: string | null;
  keycaps: string | null;
  switchType: string | null;
  photoCount: number;
  photoFolder: string | null;
  status: string;
  lastUsedAt: string | null;
  useCount: number;
  format: string;
}

export interface UsageLog {
  id: number;
  keyboardId: number;
  usedAt: string;
}

export interface KeycapSet {
  id: number;
  name: string;
  status: string;
}

export interface Switch {
  id: number;
  name: string;
  brand: string | null;
  inUse: number;
}

export type InsertKeyboard = Omit<Keyboard, "id">;
export type InsertUsageLog = Omit<UsageLog, "id">;
export type InsertKeycapSet = Omit<KeycapSet, "id">;
export type InsertSwitch = Omit<Switch, "id">;
