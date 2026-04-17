import { keyboards, usageLog, keycapSets, switches, type Keyboard, type InsertKeyboard, type UsageLog, type InsertUsageLog, type KeycapSet, type InsertKeycapSet, type Switch as SwitchType, type InsertSwitch } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, asc, sql } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite);

export interface IStorage {
  // Keyboards
  getKeyboards(): Keyboard[];
  getKeyboard(id: number): Keyboard | undefined;
  createKeyboard(data: InsertKeyboard): Keyboard;
  updateKeyboard(id: number, data: Partial<InsertKeyboard>): Keyboard | undefined;
  markUsed(id: number): Keyboard | undefined;
  getRandomKeyboard(): Keyboard | undefined;
  getKeyboardOfDay(): Keyboard | undefined;
  
  // Usage log
  getUsageLog(keyboardId?: number): UsageLog[];
  logUsage(data: InsertUsageLog): UsageLog;
  
  // Keycap sets
  getKeycapSets(): KeycapSet[];
  createKeycapSet(data: InsertKeycapSet): KeycapSet;
  
  // Switches
  getSwitches(): SwitchType[];
  createSwitch(data: InsertSwitch): SwitchType;
  
  // Stats
  getStats(): any;
}

export class DatabaseStorage implements IStorage {
  getKeyboards(): Keyboard[] {
    return db.select().from(keyboards).all();
  }

  getKeyboard(id: number): Keyboard | undefined {
    return db.select().from(keyboards).where(eq(keyboards.id, id)).get();
  }

  createKeyboard(data: InsertKeyboard): Keyboard {
    return db.insert(keyboards).values(data).returning().get();
  }

  updateKeyboard(id: number, data: Partial<InsertKeyboard>): Keyboard | undefined {
    return db.update(keyboards).set(data).where(eq(keyboards.id, id)).returning().get();
  }

  markUsed(id: number): Keyboard | undefined {
    const now = new Date().toISOString().split("T")[0];
    const kb = this.getKeyboard(id);
    if (!kb) return undefined;
    
    db.insert(usageLog).values({ keyboardId: id, usedAt: now }).run();
    
    return db.update(keyboards).set({
      lastUsedAt: now,
      useCount: (kb.useCount || 0) + 1,
    }).where(eq(keyboards.id, id)).returning().get();
  }

  getRandomKeyboard(): Keyboard | undefined {
    const built = db.select().from(keyboards)
      .where(eq(keyboards.status, "built"))
      .all();
    if (built.length === 0) return undefined;
    return built[Math.floor(Math.random() * built.length)];
  }

  getKeyboardOfDay(): Keyboard | undefined {
    const built = db.select().from(keyboards)
      .where(eq(keyboards.status, "built"))
      .all();
    if (built.length === 0) return undefined;
    
    // Deterministic daily pick based on date seed
    const today = new Date().toISOString().split("T")[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % built.length;
    return built[index];
  }

  getUsageLog(keyboardId?: number): UsageLog[] {
    if (keyboardId) {
      return db.select().from(usageLog)
        .where(eq(usageLog.keyboardId, keyboardId))
        .orderBy(desc(usageLog.usedAt))
        .all();
    }
    return db.select().from(usageLog).orderBy(desc(usageLog.usedAt)).all();
  }

  logUsage(data: InsertUsageLog): UsageLog {
    return db.insert(usageLog).values(data).returning().get();
  }

  getKeycapSets(): KeycapSet[] {
    return db.select().from(keycapSets).all();
  }

  createKeycapSet(data: InsertKeycapSet): KeycapSet {
    return db.insert(keycapSets).values(data).returning().get();
  }

  getSwitches(): SwitchType[] {
    return db.select().from(switches).all();
  }

  createSwitch(data: InsertSwitch): SwitchType {
    return db.insert(switches).values(data).returning().get();
  }

  getStats() {
    const allKbs = this.getKeyboards();
    const builtKbs = allKbs.filter(k => k.status === "built");
    const gbKbs = allKbs.filter(k => k.status === "gb");
    const allKeycaps = this.getKeycapSets();
    const allSwitches = this.getSwitches();
    
    // Keycap usage frequency (from keyboards)
    const keycapUsage: Record<string, number> = {};
    builtKbs.forEach(k => {
      if (k.keycaps) {
        keycapUsage[k.keycaps] = (keycapUsage[k.keycaps] || 0) + 1;
      }
    });
    
    // Switch usage frequency (from keyboards)
    const switchUsage: Record<string, number> = {};
    builtKbs.forEach(k => {
      if (k.switchType) {
        switchUsage[k.switchType] = (switchUsage[k.switchType] || 0) + 1;
      }
    });
    
    // Format distribution
    const formatDist: Record<string, number> = {};
    builtKbs.forEach(k => {
      const fmt = k.format || "Unknown";
      formatDist[fmt] = (formatDist[fmt] || 0) + 1;
    });
    
    // Color distribution
    const colorDist: Record<string, number> = {};
    builtKbs.forEach(k => {
      if (k.color) {
        colorDist[k.color] = (colorDist[k.color] || 0) + 1;
      }
    });
    
    // Never used / longest unused
    const neverUsed = builtKbs.filter(k => !k.lastUsedAt);
    const usedKbs = builtKbs.filter(k => k.lastUsedAt)
      .sort((a, b) => (a.lastUsedAt! > b.lastUsedAt! ? 1 : -1));
    
    // Brands from switch names
    const switchBrands: Record<string, number> = {};
    allSwitches.forEach(s => {
      const brand = s.brand || "Other";
      switchBrands[brand] = (switchBrands[brand] || 0) + 1;
    });
    
    return {
      totalKeyboards: allKbs.length,
      builtKeyboards: builtKbs.length,
      groupBuys: gbKbs.length,
      totalKeycapSets: allKeycaps.length,
      keycapsOnKeyboard: allKeycaps.filter(k => k.status === "on_keyboard").length,
      keycapsInBox: allKeycaps.filter(k => k.status === "in_box").length,
      keycapsInGb: allKeycaps.filter(k => k.status === "gb").length,
      totalSwitches: allSwitches.length,
      keycapUsage,
      switchUsage,
      formatDistribution: formatDist,
      colorDistribution: colorDist,
      neverUsed: neverUsed.map(k => ({ id: k.id, name: k.name, color: k.color })),
      longestUnused: usedKbs.slice(0, 5).map(k => ({ id: k.id, name: k.name, lastUsedAt: k.lastUsedAt })),
      switchBrands,
      keyboardOfDay: this.getKeyboardOfDay(),
    };
  }
}

export const storage = new DatabaseStorage();
