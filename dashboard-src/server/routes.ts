import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(server: Server, app: Express) {
  // --- Keyboards ---
  app.get("/api/keyboards", (_req, res) => {
    res.json(storage.getKeyboards());
  });

  app.get("/api/keyboards/:id", (req, res) => {
    const kb = storage.getKeyboard(Number(req.params.id));
    if (!kb) return res.status(404).json({ error: "Not found" });
    res.json(kb);
  });

  app.post("/api/keyboards/:id/use", (req, res) => {
    const kb = storage.markUsed(Number(req.params.id));
    if (!kb) return res.status(404).json({ error: "Not found" });
    res.json(kb);
  });

  // --- Keyboard of the Day ---
  app.get("/api/keyboard-of-day", (_req, res) => {
    const kb = storage.getKeyboardOfDay();
    if (!kb) return res.status(404).json({ error: "No keyboards" });
    res.json(kb);
  });

  // --- Random ---
  app.get("/api/keyboards/random/pick", (_req, res) => {
    const kb = storage.getRandomKeyboard();
    if (!kb) return res.status(404).json({ error: "No keyboards" });
    res.json(kb);
  });

  // --- Usage Log ---
  app.get("/api/usage-log", (req, res) => {
    const kbId = req.query.keyboardId ? Number(req.query.keyboardId) : undefined;
    res.json(storage.getUsageLog(kbId));
  });

  // --- Keycap Sets ---
  app.get("/api/keycaps", (_req, res) => {
    res.json(storage.getKeycapSets());
  });

  // --- Switches ---
  app.get("/api/switches", (_req, res) => {
    res.json(storage.getSwitches());
  });

  // --- Stats ---
  app.get("/api/stats", (_req, res) => {
    res.json(storage.getStats());
  });
}
