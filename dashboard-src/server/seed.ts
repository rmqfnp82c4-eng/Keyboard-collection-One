import { db } from "./storage";
import { keyboards, keycapSets, switches } from "@shared/schema";

// Photo folder mapping from GitHub repo
const photoFolders: Record<string, string> = {
  "MatrixLab Navi 70": "Navi70",
  "Geonworks Frog Mini": "Frog Mini",
  "MMStudio Class60": "Class60",
  "MatrixLab Corsa65": "Corsa65",
  "Tofu60 2.0|Navy": "Tofu60 2.0",
  "Swagkeys Transition Lite": "Transition Lite",
  "KBD8X MKIII": "KBD mkIII",
  "La-Versa.kbd Otsukimi": "Otsukimi",
  "Rule60": "Rule60 V3",
  "Felice Lab Curva 40 R2": "Curva40",
  "Geonworks F2-84": "F2-84",
  "Geonworks F2-8X V2|Hyperbeige": "F1-8X V2",
  "Neo Ergo|Nebula": "Neo Ergo Nebula",
  "KBDFans Agar": "Agar",
  "Mode Sonnet": "Mode Sonnet",
  "Monokei & TGR Tomo": "Monokei & TGR TOMO",
  "Linworks & TGR Dolice": "Linworks & TGR Dolice",
  "Ramaworks Kara": "Ramaworks KARA",
  "Swagkeys Eave65": "Eave65",
  "Holy60": "Holy60",
  "Tofu60 2.0|White": "Tofu60 2.0 White",
  "Neo Ergo|Navy": "Neo Ergo",
  "El Chibre": "El Chibre",
  "Ortho60 V2": "Ortho60 V2",
  "Geonworks Frog TKL": "Frog TKL",
  "Glare65": "Glare65",
  "Geonworks F2-8X V2|HyperBeige2": "Geonworks F2-8X V2",
  "TGR & SM Lin Shi Alice": "TGR & SM Lin Shi Alice",
};

function inferFormat(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("40") || n.includes("curva")) return "40%";
  if (n.includes("60") || n.includes("holy") || n.includes("tofu") || n.includes("rule") || n.includes("gehirn")) return "60%";
  if (n.includes("65") || n.includes("corsa") || n.includes("eave") || n.includes("glare")) return "65%";
  if (n.includes("70") || n.includes("navi")) return "70%";
  if (n.includes("75") || n.includes("84")) return "75%";
  if (n.includes("tkl") || n.includes("8x") || n.includes("tomo") || n.includes("dolice") || n.includes("810") || n.includes("sonic170")) return "TKL";
  if (n.includes("ergo") || n.includes("alice")) return "Ergo/Alice";
  if (n.includes("ortho")) return "Ortho";
  if (n.includes("agar")) return "65%";
  if (n.includes("sonnet")) return "65%";
  if (n.includes("otsukimi")) return "60%";
  if (n.includes("chibre")) return "60%";
  if (n.includes("class")) return "60%";
  if (n.includes("tiga")) return "65%";
  if (n.includes("altair")) return "65%";
  if (n.includes("logos")) return "65%";
  if (n.includes("keyboy")) return "40%";
  return "60%";
}

export function seed() {
  // Check if already seeded
  const existing = db.select().from(keyboards).all();
  if (existing.length > 0) return;

  const kbData: Array<{name: string; color: string | null; keycaps: string | null; switchType: string | null; photoCount: number; photoFolder: string | null; status: string; format: string}> = [
    { name: "MatrixLab Navi 70", color: "Meteorite Gray", keycaps: "GMK Dracula V2.0 GIT CORE", switchType: "Gateron Type-R", photoCount: 13, photoFolder: "Navi70", status: "built", format: "70%" },
    { name: "Geonworks Frog Mini", color: "Burgundy", keycaps: "GMK Panels", switchType: "Cherry MX2A Black", photoCount: 11, photoFolder: "Frog Mini", status: "built", format: "60%" },
    { name: "MMStudio Class60", color: "Navy", keycaps: "GMK Dualshot R2", switchType: "Owlab London Fog", photoCount: 11, photoFolder: "Class60", status: "built", format: "60%" },
    { name: "MatrixLab Corsa65", color: "Sunflower Yellow", keycaps: "GMK Laser", switchType: "Keebfront DOOM", photoCount: 17, photoFolder: "Corsa65", status: "built", format: "65%" },
    { name: "Tofu60 2.0 (Navy)", color: "Navy", keycaps: "GMK Honor Light Base", switchType: "Gateron Type-R", photoCount: 10, photoFolder: "Tofu60 2.0", status: "built", format: "60%" },
    { name: "Swagkeys Transition Lite", color: "Pink", keycaps: "GMK DMG 3", switchType: "SW x Captain Sterling Ghost Dragon", photoCount: 1, photoFolder: "Transition Lite", status: "built", format: "60%" },
    { name: "KBD8X MKIII", color: "Purple", keycaps: "GMK Royal Cadet", switchType: "HMX Guava", photoCount: 1, photoFolder: "KBD mkIII", status: "built", format: "TKL" },
    { name: "La-Versa.kbd Otsukimi", color: "Midnight Blue", keycaps: "GMK Haku", switchType: "Techno Violet", photoCount: 15, photoFolder: "Otsukimi", status: "built", format: "60%" },
    { name: "Rule60", color: "PC / Clear", keycaps: "GMK Baltic", switchType: "Gateron Quinn", photoCount: 1, photoFolder: "Rule60 V3", status: "built", format: "60%" },
    { name: "Felice Lab Curva 40 R2", color: "Metallic", keycaps: "GMK Nuclear Data R2", switchType: "Cherry MX2A Brown", photoCount: 1, photoFolder: "Curva40", status: "built", format: "40%" },
    { name: "Geonworks F2-84", color: "Cookie Cream", keycaps: "GMK Rubrehose", switchType: "Cherry MX2A Black", photoCount: 8, photoFolder: "F2-84", status: "built", format: "75%" },
    { name: "Geonworks F2-8X V2", color: "Hyperbeige", keycaps: "GMK Prussian Blue", switchType: "Cherry MX2A Purple", photoCount: 9, photoFolder: "F1-8X V2", status: "built", format: "TKL" },
    { name: "Neo Ergo (Nebula)", color: "Nebula", keycaps: "GMK Fright Club", switchType: "Outemu Unity", photoCount: 1, photoFolder: "Neo Ergo Nebula", status: "built", format: "Ergo/Alice" },
    { name: "KBDFans Agar", color: "Burgundy", keycaps: "GMK Higanbana", switchType: "Invokeys x ALAS Red Bean", photoCount: 7, photoFolder: "Agar", status: "built", format: "65%" },
    { name: "Mode Sonnet", color: "Green", keycaps: "GMK November Fog", switchType: "Akko Green Fog", photoCount: 1, photoFolder: "Mode Sonnet", status: "built", format: "65%" },
    { name: "Monokei & TGR Tomo", color: "Navy", keycaps: "GMK Grand Prix", switchType: "SWK V Black", photoCount: 1, photoFolder: "Monokei & TGR TOMO", status: "built", format: "TKL" },
    { name: "Linworks & TGR Dolice", color: "Dark Gray", keycaps: "GMK Terror Below", switchType: "Cherry MX2A Black", photoCount: 1, photoFolder: "Linworks & TGR Dolice", status: "built", format: "TKL" },
    { name: "Ramaworks Kara", color: "Azure", keycaps: "GMK Analog Dreams R2 Digital Nightmares", switchType: "Raptor MX Extreme Gaming Switch", photoCount: 1, photoFolder: "Ramaworks KARA", status: "built", format: "60%" },
    { name: "Swagkeys Eave65", color: "PC / Clear", keycaps: "GMK Pulse (Mitolet)", switchType: "Gateron Azure Dragon V4", photoCount: 1, photoFolder: "Eave65", status: "built", format: "65%" },
    { name: "Holy60", color: "Red", keycaps: "GMK Honor Light Base", switchType: "Invokeys x ALAS Nightshade", photoCount: 1, photoFolder: "Holy60", status: "built", format: "60%" },
    { name: "Tofu60 2.0 (White)", color: "White", keycaps: "GMK Cubed", switchType: "Gateron Weightlessness", photoCount: 1, photoFolder: "Tofu60 2.0 White", status: "built", format: "60%" },
    { name: "Neo Ergo (Navy)", color: "Navy", keycaps: "GMK Parcel", switchType: "Invokeys x ALAS Daydreamer", photoCount: 1, photoFolder: "Neo Ergo", status: "built", format: "Ergo/Alice" },
    { name: "+84", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "75%" },
    { name: "Gehirn60", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "60%" },
    { name: "Altair-X R2", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "65%" },
    { name: "Machina Tiga", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "65%" },
    { name: "El Chibre", color: "Blue", keycaps: "GMK Pulse", switchType: "Cherry MX2A Purple", photoCount: 1, photoFolder: "El Chibre", status: "built", format: "60%" },
    { name: "Ortho60 V2", color: "Black", keycaps: "GMK Oblivion 40s", switchType: "Gateron Harmonic", photoCount: 1, photoFolder: "Ortho60 V2", status: "built", format: "Ortho" },
    { name: "Geonworks Frog TKL", color: "Dark Green", keycaps: "GMK Metropolis R2", switchType: "Cherry MX2A Orange", photoCount: 1, photoFolder: "Frog TKL", status: "built", format: "TKL" },
    { name: "Neson Studio 810E", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "TKL" },
    { name: "Glare65", color: "RAW", keycaps: "GMK Masterpiece", switchType: "Clackbits Linear R2", photoCount: 3, photoFolder: "Glare65", status: "built", format: "65%" },
    { name: "Geonworks F2-8X V2 (2nd)", color: "HyperBeige", keycaps: "GMK Black Snail (Red Cyrillic)", switchType: "Gateron Type-R", photoCount: 1, photoFolder: "Geonworks F2-8X V2", status: "built", format: "TKL" },
    { name: "Antipode Studio Logos Mk.1", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "65%" },
    { name: "Sonic170 V2", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "TKL" },
    { name: "Keyboy40", color: null, keycaps: null, switchType: null, photoCount: 0, photoFolder: null, status: "gb", format: "40%" },
    { name: "TGR & SM Lin Shi Alice", color: "Silver", keycaps: "GMK ONI", switchType: "KNC Keys Red Jacket V1 Redux", photoCount: 1, photoFolder: "TGR & SM Lin Shi Alice", status: "built", format: "Ergo/Alice" },
  ];

  for (const kb of kbData) {
    db.insert(keyboards).values(kb).run();
  }

  // --- Keycap Sets ---
  const keycapData: Array<{name: string; status: string}> = [
    { name: "GMK Dracula V2", status: "on_keyboard" },
    { name: "GMK Analog Dreams R2", status: "in_box" },
    { name: "GMK Parcel", status: "on_keyboard" },
    { name: "GMK Cubed", status: "on_keyboard" },
    { name: "GMK Kitsune", status: "in_box" },
    { name: "GMK Honor Light Base", status: "on_keyboard" },
    { name: "GMK Striker R2 (×2)", status: "in_box" },
    { name: "GMK Dualshot R2", status: "on_keyboard" },
    { name: "GMK WOB Katakana", status: "in_box" },
    { name: "GMK Panels", status: "on_keyboard" },
    { name: "GMK Terror Below", status: "on_keyboard" },
    { name: "GMK Royal Cadet", status: "on_keyboard" },
    { name: "GMK Analog Dreams R2 Digital Nightmare", status: "on_keyboard" },
    { name: "GMK Laser", status: "on_keyboard" },
    { name: "GMK Pulse", status: "on_keyboard" },
    { name: "GMK Nuclear Data R2", status: "on_keyboard" },
    { name: "GMK Haku", status: "on_keyboard" },
    { name: "GMK Dots R2 (Dark)", status: "on_keyboard" },
    { name: "GMK Fright Club", status: "on_keyboard" },
    { name: "GMK Skeletor", status: "in_box" },
    { name: "GMK November Fog", status: "on_keyboard" },
    { name: "GMK Dots R2 (Light)", status: "in_box" },
    { name: "GMK Baltic", status: "on_keyboard" },
    { name: "GMK Gurokawa", status: "gb" },
    { name: "GMK Kaiju R3", status: "in_box" },
    { name: "GMK Blue Alert", status: "in_box" },
    { name: "GMK Prussian Blue", status: "on_keyboard" },
    { name: "GMK Higanbana", status: "on_keyboard" },
    { name: "GMK Evil Dolch", status: "in_box" },
    { name: "GMK Black Snail", status: "in_box" },
    { name: "GMK Rubrehose", status: "on_keyboard" },
    { name: "GMK Pulse (Mitolet)", status: "on_keyboard" },
    { name: "GMK Serenity", status: "in_box" },
    { name: "GMK DMG 3", status: "on_keyboard" },
    { name: "GMK Mon.Material V1", status: "on_keyboard" },
    { name: "GMK Chaos Theory", status: "in_box" },
    { name: "GMK SUSU", status: "in_box" },
    { name: "GMK Grand Prix", status: "on_keyboard" },
    { name: "GMK Divinapapaya", status: "gb" },
    { name: "GMK Masterpiece", status: "on_keyboard" },
    { name: "GMK Metropolis", status: "on_keyboard" },
    { name: "GMK ONI", status: "on_keyboard" },
    { name: "GMK Deep Navy", status: "in_box" },
    { name: "GMK Oblivion 40s", status: "on_keyboard" },
    { name: "GMK Taiga R2", status: "gb" },
    { name: "GMK Dracula V2 (2nd)", status: "in_box" },
    { name: "GMK Nightlight", status: "in_box" },
    { name: "GMK Fuji", status: "in_box" },
    { name: "GMK Windbreaker", status: "in_box" },
    { name: "GMK Fleuriste", status: "in_box" },
    { name: "GMK Nervewrecker", status: "in_box" },
    { name: "GMK Redacted®", status: "in_box" },
    { name: "GMK Combobreaker", status: "gb" },
  ];

  for (const kc of keycapData) {
    db.insert(keycapSets).values(kc).run();
  }

  // --- Switches ---
  const switchData: Array<{name: string; brand: string; inUse: number}> = [
    { name: "PH Studio Poki Zaku", brand: "PH Studio", inUse: 0 },
    { name: "HMX FJ 400", brand: "HMX", inUse: 0 },
    { name: "HMX Joker", brand: "HMX", inUse: 0 },
    { name: "HMX x BCKeys Martini", brand: "HMX", inUse: 0 },
    { name: "HMX Guava", brand: "HMX", inUse: 1 },
    { name: "Siliworks × Napworks Nap", brand: "Siliworks", inUse: 0 },
    { name: "HEX Studio & Diamond Brother Lycoris", brand: "HEX Studio", inUse: 0 },
    { name: "Keygeek Purple Dawn", brand: "Keygeek", inUse: 0 },
    { name: "Wuque Studio WS Stellar Bluerose", brand: "Wuque Studio", inUse: 0 },
    { name: "Gateron Oil King", brand: "Gateron", inUse: 0 },
    { name: "Gateron Ink V2", brand: "Gateron", inUse: 0 },
    { name: "Gateron Mini-I", brand: "Gateron", inUse: 0 },
    { name: "Gateron Weightlessness", brand: "Gateron", inUse: 1 },
    { name: "Gateron Dark One", brand: "Gateron", inUse: 0 },
    { name: "Gateron Melodic", brand: "Gateron", inUse: 0 },
    { name: "Gateron Robin", brand: "Gateron", inUse: 0 },
    { name: "Gateron Smoothie", brand: "Gateron", inUse: 0 },
    { name: "Gateron INK V2 Black Baltic Edition", brand: "Gateron", inUse: 0 },
    { name: "Siliworks × HMX SONJA", brand: "Siliworks", inUse: 0 },
    { name: "Siliworks × HMX SONJA HC", brand: "Siliworks", inUse: 0 },
    { name: "Cherry MX2A Black", brand: "Cherry", inUse: 1 },
    { name: "Cherry MX2A Brown", brand: "Cherry", inUse: 1 },
    { name: "Cherry MX2A Purple", brand: "Cherry", inUse: 1 },
    { name: "Cherry MX Black Hyperglide", brand: "Cherry", inUse: 0 },
    { name: "Prevail Nebula", brand: "Prevail", inUse: 0 },
    { name: "Ice and Snow Baikal", brand: "Ice and Snow", inUse: 0 },
    { name: "MOYU Melody Redux", brand: "MOYU", inUse: 0 },
    { name: "LICHICX XCJZ Green Tea Tactile", brand: "LICHICX", inUse: 0 },
    { name: "JWK Semi-silent", brand: "JWK", inUse: 0 },
    { name: "EPOMAKER Bluebird", brand: "EPOMAKER", inUse: 0 },
    { name: "LEOBOG Kayking V2", brand: "LEOBOG", inUse: 0 },
    { name: "NovelKeys × Kailh NK Blueberry", brand: "NovelKeys", inUse: 0 },
    { name: "MOYU Poseidon", brand: "MOYU", inUse: 0 },
    { name: "CK × Haimu Clipper Sea Serpent", brand: "CK × Haimu", inUse: 0 },
    { name: "HC Studio Roselle", brand: "HC Studio", inUse: 0 },
    { name: "BSUN Snow Diane", brand: "BSUN", inUse: 0 },
    { name: "NovelKeys × Kailh NK Cream Clickie", brand: "NovelKeys", inUse: 0 },
    { name: "KNC Keys Green Jacket", brand: "KNC Keys", inUse: 0 },
    { name: "Invokeys × ALAS Daydreamer", brand: "Invokeys", inUse: 1 },
    { name: "Invokeys × ALAS Nightshade", brand: "Invokeys", inUse: 1 },
    { name: "Invokeys × ALAS Red Bean", brand: "Invokeys", inUse: 1 },
    { name: "Moyu × XCJZ Snow Grape", brand: "Moyu", inUse: 0 },
    { name: "Sarokeys Strawberry Wine", brand: "Sarokeys", inUse: 0 },
    { name: "KeyByeLab Switch", brand: "KeyByeLab", inUse: 0 },
    { name: "KTT Matcha", brand: "KTT", inUse: 0 },
    { name: "MMD Vivian V2", brand: "MMD", inUse: 0 },
    { name: "SWK Neon Switch", brand: "SWK", inUse: 0 },
    { name: "SW x CaptainSterling Ghost Dragon", brand: "Swagkeys", inUse: 1 },
    { name: "Owlab London Fog", brand: "Owlab", inUse: 1 },
    { name: "Keygeek Mirror Lake Linear", brand: "Keygeek", inUse: 0 },
    { name: "Keygeek × Brian Workshop B1", brand: "Keygeek", inUse: 0 },
    { name: "Gateron Type-R", brand: "Gateron", inUse: 1 },
    { name: "Gateron Quinn", brand: "Gateron", inUse: 1 },
    { name: "Gateron Azure Dragon V4", brand: "Gateron", inUse: 1 },
    { name: "Gateron Green Apple", brand: "Gateron", inUse: 0 },
    { name: "Wingtree Linear", brand: "Wingtree", inUse: 0 },
    { name: "Cherry MX2A Speed Silver", brand: "Cherry", inUse: 0 },
    { name: "Keygeek Sunflower", brand: "Keygeek", inUse: 0 },
    { name: "LEOBOG Immortality", brand: "LEOBOG", inUse: 0 },
    { name: "LEOBOG Lavender", brand: "LEOBOG", inUse: 0 },
    { name: "GOAT.WORKS × Wingtree WINGBlack", brand: "GOAT.WORKS", inUse: 0 },
    { name: "ZEALPC Clickiez", brand: "ZEALPC", inUse: 0 },
    { name: "Everglide Dark Jade", brand: "Everglide", inUse: 0 },
    { name: "HMX Sand Storm", brand: "HMX", inUse: 0 },
    { name: "Outemu Unity", brand: "Outemu", inUse: 1 },
    { name: "Keygeek Orange Boi", brand: "Keygeek", inUse: 0 },
    { name: "Keygeek M1", brand: "Keygeek", inUse: 0 },
    { name: "Cherry MX Blossom", brand: "Cherry", inUse: 0 },
    { name: "Gateron Lanes", brand: "Gateron", inUse: 0 },
    { name: "Keebfront Sinister", brand: "Keebfront", inUse: 0 },
    { name: "Keebfront Coley", brand: "Keebfront", inUse: 0 },
    { name: "Keebfront DOOM", brand: "Keebfront", inUse: 1 },
    { name: "Clackbits Linear", brand: "Clackbits", inUse: 0 },
    { name: "KNC Keys Black Jacket (Tactile)", brand: "KNC Keys", inUse: 0 },
    { name: "KNC Keys Red Jacket V1 Redux", brand: "KNC Keys", inUse: 1 },
    { name: "Tofutypes × KNC Keys Tempeh", brand: "KNC Keys", inUse: 0 },
    { name: "BSUN Golden Apple", brand: "BSUN", inUse: 0 },
    { name: "SWK V Black", brand: "SWK", inUse: 1 },
    { name: "KBDfans Roller V2", brand: "KBDfans", inUse: 0 },
    { name: "HMX Firecracker (Tactile)", brand: "HMX", inUse: 0 },
  ];

  for (const sw of switchData) {
    db.insert(switches).values(sw).run();
  }

  console.log("Seeded: " + kbData.length + " keyboards, " + keycapData.length + " keycap sets, " + switchData.length + " switches");
}
