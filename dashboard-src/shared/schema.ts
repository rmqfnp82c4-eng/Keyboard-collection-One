import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const keyboards = sqliteTable("keyboards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color"),
  keycaps: text("keycaps"),
  switchType: text("switch_type"),
  photoCount: integer("photo_count").default(0),
  photoFolder: text("photo_folder"),
  status: text("status").default("built"), // built | gb (group buy)
  lastUsedAt: text("last_used_at"), // ISO date string
  useCount: integer("use_count").default(0),
  format: text("format"), // 40%, 60%, 65%, 75%, TKL, etc.
});

export const usageLog = sqliteTable("usage_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyboardId: integer("keyboard_id").notNull(),
  usedAt: text("used_at").notNull(), // ISO date
});

export const keycapSets = sqliteTable("keycap_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  status: text("status").notNull(), // on_keyboard | in_box | gb
});

export const switches = sqliteTable("switches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  brand: text("brand"),
  inUse: integer("in_use").default(0), // 1 if currently on a keyboard
});

export const insertKeyboardSchema = createInsertSchema(keyboards).omit({ id: true });
export const insertUsageLogSchema = createInsertSchema(usageLog).omit({ id: true });
export const insertKeycapSetSchema = createInsertSchema(keycapSets).omit({ id: true });
export const insertSwitchSchema = createInsertSchema(switches).omit({ id: true });

export type InsertKeyboard = z.infer<typeof insertKeyboardSchema>;
export type Keyboard = typeof keyboards.$inferSelect;
export type InsertUsageLog = z.infer<typeof insertUsageLogSchema>;
export type UsageLog = typeof usageLog.$inferSelect;
export type InsertKeycapSet = z.infer<typeof insertKeycapSetSchema>;
export type KeycapSet = typeof keycapSets.$inferSelect;
export type InsertSwitch = z.infer<typeof insertSwitchSchema>;
export type Switch = typeof switches.$inferSelect;
