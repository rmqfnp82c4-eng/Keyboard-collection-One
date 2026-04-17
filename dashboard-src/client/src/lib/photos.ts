const GITHUB_PHOTOS_BASE =
  "https://raw.githubusercontent.com/rmqfnp82c4-eng/Keyboard-collection-One/main/Photos";

// All photos per folder, in display order
const ALL_PHOTOS: Record<string, string[]> = {
  "Navi70": ["Navi70 (1)", "Navi70 (2)", "Navi70 (3)", "Navi70 (4)", "Navi70 (5)", "Navi70 (6)", "Navi70 (7)", "Navi70 (8)", "Navi70 (9)", "Navi70 (10)", "Navi70 (11)", "Navi70 (12)", "Navi70"],
  "Frog Mini": ["Frog Mini (1)", "Frog Mini (2)", "Frog Mini (3)", "Frog Mini (4)", "Frog Mini (7)", "Frog Mini (9)", "Frog Mini (10)", "Frog Mini (11)", "Frog Mini (14)", "Frog Mini (15)", "Frog Mini (17)"],
  "Class60": ["MMClass60 (1)", "MMClass60 (2)", "MMClass60 (3)", "MMClass60 (4)", "MMClass60 (5)", "MMClass60 (6)", "MMClass60 (7)", "MMClass60 (8)", "MMClass60 (9)", "MMClass60 (10)", "MMClass60 (11)", "MMClass60 (12)"],
  "Corsa65": ["Corsa65 (10)", "Corsa65 (2)", "Corsa65 (3)", "Corsa65 (4)", "Corsa65 (5)", "Corsa65 (6)", "Corsa65 (7)", "Corsa65 (8)", "Corsa65 (9)", "Corsa65 (11)", "Corsa65 (12)", "Corsa65 (13)", "Corsa65 (14)", "Corsa65 (15)", "Corsa65 (16)", "Corsa65 (17)", "Corsa65 (18)"],
  "Tofu60 2.0": ["Tofu60 (1)", "Tofu60 (2)", "Tofu60 (3)", "Tofu60 (4)", "Tofu60 (5)", "Tofu60 (6)", "Tofu60 (7)", "Tofu60 (8)", "Tofu60 (9)", "Tofu60 (10)"],
  "Transition Lite": ["Transition Lite"],
  "KBD mkIII": ["KBD mkIII"],
  "Otsukimi": ["Otsukimi (1)", "Otsukimi (2)", "Otsukimi (3)", "Otsukimi (4)", "Otsukimi (5)", "Otsukimi (6)", "Otsukimi (7)", "Otsukimi (8)", "Otsukimi (9)", "Otsukimi (10)", "Otsukimi (11)", "Otsukimi (12)", "Otsukimi (13)", "Otsukimi (14)", "Otsukimi"],
  "Rule60 V3": ["Rule60 V3"],
  "Curva40": ["Curva40"],
  "F2-84": ["Geon F2-84 (1)", "Geon F2-84 (3)", "Geon F2-84 (4)", "Geon F2-84 (5)", "Geon F2-84 (6)", "Geon F2-84 (7)", "Geon F2-84 (8)", "Geon F2-84 (9)", "Geon F2-84 (10)", "Geon F2-84 (11)", "Geon F2-84 (12)", "Geon F2-84 (13)", "Geon F2-84 (14)", "Geon F2-84 (15)", "Geon F2-84 (16)", "Geon F2-84 (17)", "Geon F2-84 (18)", "Geon F2-84 (19)", "Geon F2-84 (20)", "Geon F2-84 (21)", "Geon F2-84 (22)", "Geon F2-84 (23)"],
  "F1-8X V2": ["Geon F1-8X V2 (1)", "Geon F1-8X V2 (2)", "Geon F1-8X V2 (3)", "Geon F1-8X V2 (4)", "Geon F1-8X V2 (5)", "Geon F1-8X V2 (6)", "Geon F1-8X V2 (7)", "Geon F1-8X V2 (8)", "Geon F1-8X V2 (9)"],
  "Neo Ergo Nebula": ["Nebula"],
  "Agar": ["Agar (1)", "Agar (2)", "Agar (3)", "Agar (4)", "Agar (5)", "Agar (6)", "Agar (7)"],
  "Mode Sonnet": ["Mode Sonnet"],
  "Monokei & TGR TOMO": ["TOMO"],
  "Linworks & TGR Dolice": ["Linworks & TGR Dolice"],
  "Ramaworks KARA": ["KARA"],
  "Eave65": ["Eave65"],
  "Holy60": ["Holy60"],
  "Tofu60 2.0 White": ["Tofu60 2.0 White"],
  "Neo Ergo": ["Neo Ergo (1)", "Neo Ergo (2)", "Neo Ergo (3)", "Neo Ergo (4)", "Neo Ergo (5)", "Neo Ergo (6)", "Neo Ergo (7)", "Neo Ergo (8)", "Neo Ergo (9)", "Neo Ergo (10)", "Neo Ergo (11)", "Neo Ergo (12)", "Neo Ergo (13)"],
  "El Chibre": ["El Chibre"],
  "Ortho60 V2": ["Ortho60 V2"],
  "Frog TKL": ["Frog TKL"],
  "Glare65": ["Glare65 1", "Glare65 2", "Glare65 3"],
  "Geonworks F2-8X V2": ["Geonworks F2-8X V2"],
  "TGR & SM Lin Shi Alice": ["TGR & SN Lin Shi Alice"],
};

function buildUrl(folder: string, filename: string): string {
  return `${GITHUB_PHOTOS_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}.jpg`;
}

export function getPhotoUrl(folder: string | null): string | null {
  if (!folder) return null;
  const photos = ALL_PHOTOS[folder];
  if (!photos || photos.length === 0) return null;
  return buildUrl(folder, photos[0]);
}

export function getAllPhotoUrls(folder: string | null): string[] {
  if (!folder) return [];
  const photos = ALL_PHOTOS[folder];
  if (!photos) return [];
  return photos.map((filename) => buildUrl(folder, filename));
}

export function getPhotoCount(folder: string | null): number {
  if (!folder) return 0;
  return ALL_PHOTOS[folder]?.length || 0;
}
