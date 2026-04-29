import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dices, Check, RefreshCw, Sparkles, Camera } from "lucide-react";
import { getPhotoUrl, getAllPhotoUrls, getPhotoCount } from "@/lib/photos";
import { getRandomKeyboard } from "@/lib/staticData";
import { useI18n } from "@/lib/i18n";
import { PhotoGallery } from "@/components/photo-gallery";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback }from "react";



interface KB {
  id: number;
  name: string;
  color: string | null;
  keycaps: string | null;
  switchType: string | null;
  photoFolder: string | null;
  format: string | null;
  useCount: number | null;
  lastUsedAt: string | null;
}

export default function KeyboardOfDay() {
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<"daily" | "random">("daily");
  const [randomKb, setRandomKb] = useState<KB | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const { data: dailyKb, isLoading } = useQuery<KB>({
    queryKey: ["/api/keyboard-of-day"],
  });

  const fetchRandom = useCallback(async () => {
    setIsSpinning(true);
    // Animate for a moment
    await new Promise((r) => setTimeout(r, 600));
    const data = getRandomKeyboard();
    setRandomKb(data as KB);
    setIsSpinning(false);
  }, []);

  const markUsed = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/keyboards/${id}/use`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/keyboards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/keyboard-of-day"] });
      if (activeKb) setUsedIds((prev) => new Set(prev).add(activeKb.id));
      toast({
        title: locale === "ru" ? "✅ Отмечено!" : "✅ Marked!",
        description: locale === "ru"
          ? `${activeKb?.name} используется сегодня`
          : `${activeKb?.name} is your board today`,
      });
    },
  });

  const activeKb = mode === "daily" ? dailyKb : randomKb;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold tracking-tight" data-testid="text-page-title">
          {t("kotd.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("kotd.subtitle")}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={mode === "daily" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("daily")}
          data-testid="button-mode-daily"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          {t("kotd.dailyPick")}
        </Button>
        <Button
          variant={mode === "random" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("random");
            if (!randomKb) fetchRandom();
          }}
          data-testid="button-mode-random"
        >
          <Dices className="w-3.5 h-3.5 mr-1" />
          {t("kotd.random")}
        </Button>
      </div>

      {/* Keyboard Card */}
      <Card
        className={`overflow-hidden transition-all duration-300 ${
          isSpinning ? "scale-95 opacity-50" : "scale-100 opacity-100"
        }`}
        data-testid="card-selected-keyboard"
      >
        {activeKb?.photoFolder && (
          <div
            className="h-64 bg-muted overflow-hidden relative cursor-pointer"
            onClick={() => getPhotoCount(activeKb.photoFolder) > 0 && setGalleryOpen(true)}
          >
            <img
              src={getPhotoUrl(activeKb.photoFolder) || ""}
              alt={activeKb.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.display = "none";
              }}
            />
            {getPhotoCount(activeKb.photoFolder) > 1 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                <Camera className="w-3 h-3" />
                {getPhotoCount(activeKb.photoFolder)}
              </div>
            )}
          </div>
        )}
        <CardContent className="p-6">
          {activeKb ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold" data-testid="text-keyboard-name">
                  {activeKb.name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeKb.format && (
                    <Badge variant="secondary">{activeKb.format}</Badge>
                  )}
                  {activeKb.color && (
                    <Badge variant="outline">{activeKb.color}</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {activeKb.keycaps && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      {t("kotd.keycaps")}
                    </p>
                    <p className="text-sm font-medium">{activeKb.keycaps}</p>
                  </div>
                )}
                {activeKb.switchType && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      {t("kotd.switches")}
                    </p>
                    <p className="text-sm font-medium">{activeKb.switchType}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                {usedIds.has(activeKb.id) ? (
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled
                    data-testid="button-use-keyboard"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {locale === "ru" ? "Используется сегодня" : "Used Today"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => markUsed.mutate(activeKb.id)}
                    disabled={markUsed.isPending}
                    className="flex-1"
                    data-testid="button-use-keyboard"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {t("kotd.useThisBoard")}
                  </Button>
                )}
                {mode === "random" && (
                  <Button
                    variant="outline"
                    onClick={fetchRandom}
                    disabled={isSpinning}
                    data-testid="button-reroll-random"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`}
                    />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Dices className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("kotd.hitRandom")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {mode === "daily" && (
        <p className="text-center text-xs text-muted-foreground">
          {t("kotd.changesDaily")}
        </p>
      )}

      {/* Photo Gallery */}
      <PhotoGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        photos={activeKb ? getAllPhotoUrls(activeKb.photoFolder) : []}
        keyboardName={activeKb?.name || ""}
      />
    </div>
  );
}
