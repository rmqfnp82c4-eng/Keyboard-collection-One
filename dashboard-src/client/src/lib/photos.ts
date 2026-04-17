const GITHUB_PHOTOS_BASE =
  "https://raw.githubusercontent.com/rmqfnp82c4-eng/Keyboard-collection-One/main/Photos";

// Exact first-photo filename mapping from the GitHub repo
const FIRST_PHOTO: Record<string, string> = {
  "Navi70": "Navi70 (1)",
  "Frog Mini": "Frog Mini (1)",
  "Class60": "MMClass60 (1)",
  "Corsa65": "Corsa65 (10)",
  "Tofu60 2.0": "Tofu60 (1)",
  "Transition Lite": "Transition Lite",
  "KBD mkIII": "KBD mkIII",
  "Otsukimi": "Otsukimi (1)",
  "Rule60 V3": "Rule60 V3",
  "Curva40": "Curva40",
  "F2-84": "Geon F2-84 (1)",
  "F1-8X V2": "Geon F1-8X V2 (1)",
  "Neo Ergo Nebula": "Nebula",
  "Agar": "Agar (1)",
  "Mode Sonnet": "Mode Sonnet",
  "Monokei & TGR TOMO": "TOMO",
  "Linworks & TGR Dolice": "Linworks & TGR Dolice",
  "Ramaworks KARA": "KARA",
  "Eave65": "Eave65",
  "Holy60": "Holy60",
  "Tofu60 2.0 White": "Tofu60 2.0 White",
  "Neo Ergo": "Neo Ergo (1)",
  "El Chibre": "El Chibre",
  "Ortho60 V2": "Ortho60 V2",
  "Frog TKL": "Frog TKL",
  "Glare65": "Glare65 1",
  "Geonworks F2-8X V2": "Geonworks F2-8X V2",
  "TGR & SM Lin Shi Alice": "TGR & SN Lin Shi Alice",
};

export function getPhotoUrl(folder: string | null): string | null {
  if (!folder) return null;
  const filename = FIRST_PHOTO[folder];
  if (!filename) return null;
  return `${GITHUB_PHOTOS_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}.jpg`;
}
