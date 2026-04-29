import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  keyboardName: string;
}

export function PhotoGallery({ isOpen, onClose, photos, keyboardName }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const { t } = useI18n();

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrent(0);
      setLoaded({});
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(photos.length - 1, c + 1));
    },
    [isOpen, onClose, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || photos.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-3 px-1">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-4 h-4 opacity-60" />
            <span className="font-semibold text-sm">{keyboardName}</span>
            <span className="text-xs text-white/50">
              {current + 1} / {photos.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label={t("gallery.close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-black/40 rounded-xl overflow-hidden flex items-center justify-center">
          {!loaded[current] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <img
            src={photos[current]}
            alt={`${keyboardName} — ${t("gallery.photo")} ${current + 1}`}
            className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${loaded[current] ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded((prev) => ({ ...prev, [current]: true }))}
            draggable={false}
          />

          {/* Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-20 disabled:cursor-default transition-all"
                aria-label={t("gallery.prev")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(photos.length - 1, c + 1))}
                disabled={current === photos.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-20 disabled:cursor-default transition-all"
                aria-label={t("gallery.next")}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-1.5 mt-3 overflow-x-auto max-w-full pb-1 px-1">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current
                    ? "border-primary ring-1 ring-primary/50 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`${keyboardName} ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
