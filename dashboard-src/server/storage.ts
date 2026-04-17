import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Keyboard, UsageLog, KeycapSet, Switch } from "../shared/schema";

const DATA_FILE = join(process.cwd(), "data.json");

interface DataStore {
  keyboards: Keyboard[];
  usageLog: UsageLog[];
  keycapSets: KeycapSet[];
  switches: Switch[];
}

function loadData(): DataStore {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  }
  return { keyboards: [], usageLog: [], keycapSets: [], switches: [] };
}

function saveData(data: DataStore) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export class JsonStorage {
  private data: DataStore;

  constructor() {
    this.data = loadData();
  }

  private save() {
    saveData(this.data);
  }

  // --- Keyboards ---
  getKeyboards(): Keyboard[] {
    return this.data.keyboards;
  }

  getKeyboard(id: number): Keyboard | undefined {
    return this.data.keyboards.find((k) => k.id === id);
  }

  markUsed(id: number): Keyboard | undefined {
    const kb = this.data.keyboards.find((k) => k.id === id);
    if (!kb) return undefined;

    const now = new Date().toISOString().split("T")[0];
    kb.lastUsedAt = now;
    kb.useCount = (kb.useCount || 0) + 1;

    // Add to usage log
    const logId =
      this.data.usageLog.length > 0
        ? Math.max(...this.data.usageLog.map((l) => l.id)) + 1
        : 1;
    this.data.usageLog.push({ id: logId, keyboardId: id, usedAt: now });

    this.save();
    return kb;
  }

  getRandomKeyboard(): Keyboard | undefined {
    const built = this.data.keyboards.filter((k) => k.status === "built");
    if (built.length === 0) return undefined;
    return built[Math.floor(Math.random() * built.length)];
  }

  getKeyboardOfDay(): Keyboard | undefined {
    const built = this.data.keyboards.filter((k) => k.status === "built");
    if (built.length === 0) return undefined;

    const today = new Date().toISOString().split("T")[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
    }
    return built[Math.abs(hash) % built.length];
  }

  // --- Usage Log ---
  getUsageLog(keyboardId?: number): UsageLog[] {
    const logs = keyboardId
      ? this.data.usageLog.filter((l) => l.keyboardId === keyboardId)
      : this.data.usageLog;
    return logs.sort((a, b) => (a.usedAt > b.usedAt ? -1 : 1));
  }

  // --- Keycap Sets ---
  getKeycapSets(): KeycapSet[] {
    return this.data.keycapSets;
  }

  // --- Switches ---
  getSwitches(): Switch[] {
    return this.data.switches;
  }

  // --- Stats ---
  getStats() {
    const allKbs = this.data.keyboards;
    const builtKbs = allKbs.filter((k) => k.status === "built");
    const gbKbs = allKbs.filter((k) => k.status === "gb");
    const allKeycaps = this.data.keycapSets;
    const allSwitches = this.data.switches;

    const keycapUsage: Record<string, number> = {};
    builtKbs.forEach((k) => {
      if (k.keycaps) keycapUsage[k.keycaps] = (keycapUsage[k.keycaps] || 0) + 1;
    });

    const switchUsage: Record<string, number> = {};
    builtKbs.forEach((k) => {
      if (k.switchType)
        switchUsage[k.switchType] = (switchUsage[k.switchType] || 0) + 1;
    });

    const formatDist: Record<string, number> = {};
    builtKbs.forEach((k) => {
      const fmt = k.format || "Unknown";
      formatDist[fmt] = (formatDist[fmt] || 0) + 1;
    });

    const colorDist: Record<string, number> = {};
    builtKbs.forEach((k) => {
      if (k.color) colorDist[k.color] = (colorDist[k.color] || 0) + 1;
    });

    const neverUsed = builtKbs.filter((k) => !k.lastUsedAt);
    const usedKbs = builtKbs
      .filter((k) => k.lastUsedAt)
      .sort((a, b) => (a.lastUsedAt! > b.lastUsedAt! ? 1 : -1));

    const switchBrands: Record<string, number> = {};
    allSwitches.forEach((s) => {
      const brand = s.brand || "Other";
      switchBrands[brand] = (switchBrands[brand] || 0) + 1;
    });

    return {
      totalKeyboards: allKbs.length,
      builtKeyboards: builtKbs.length,
      groupBuys: gbKbs.length,
      totalKeycapSets: allKeycaps.length,
      keycapsOnKeyboard: allKeycaps.filter((k) => k.status === "on_keyboard").length,
      keycapsInBox: allKeycaps.filter((k) => k.status === "in_box").length,
      keycapsInGb: allKeycaps.filter((k) => k.status === "gb").length,
      totalSwitches: allSwitches.length,
      keycapUsage,
      switchUsage,
      formatDistribution: formatDist,
      colorDistribution: colorDist,
      neverUsed: neverUsed.map((k) => ({ id: k.id, name: k.name, color: k.color })),
      longestUnused: usedKbs
        .slice(0, 5)
        .map((k) => ({ id: k.id, name: k.name, lastUsedAt: k.lastUsedAt })),
      switchBrands,
      keyboardOfDay: this.getKeyboardOfDay(),
    };
  }

  // --- Seed ---
  needsSeed(): boolean {
    return this.data.keyboards.length === 0;
  }

  seedData(keyboards: Keyboard[], keycapSets: KeycapSet[], switches: Switch[]) {
    this.data.keyboards = keyboards;
    this.data.keycapSets = keycapSets;
    this.data.switches = switches;
    this.data.usageLog = [];
    this.save();
  }
}

export const storage = new JsonStorage();
