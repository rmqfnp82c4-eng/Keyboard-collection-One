import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Search, Check, Clock, Package } from "lucide-react";
import { getPhotoUrl } from "@/lib/photos";
import { useI18n } from "@/lib/i18n";



interface Keyboard {
  id: number;
  name: string;
  color: string | null;
  keycaps: string | null;
  switchType: string | null;
  photoCount: number | null;
  photoFolder: string | null;
  status: string | null;
  lastUsedAt: string | null;
  useCount: number | null;
  format: string | null;
}

export default function Collection() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: keyboards, isLoading } = useQuery<Keyboard[]>({
    queryKey: ["/api/keyboards"],
  });

  const markUsed = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/keyboards/${id}/use`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keyboards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const filtered = (keyboards || []).filter((kb) => {
    const matchesSearch =
      !search ||
      kb.name.toLowerCase().includes(search.toLowerCase()) ||
      (kb.keycaps || "").toLowerCase().includes(search.toLowerCase()) ||
      (kb.switchType || "").toLowerCase().includes(search.toLowerCase()) ||
      (kb.color || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "built" && kb.status === "built") ||
      (filter === "gb" && kb.status === "gb") ||
      (filter === "unused" && kb.status === "built" && !kb.lastUsedAt);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold tracking-tight" data-testid="text-page-title">
          {t("coll.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {keyboards?.length || 0} {t("coll.keyboards")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("coll.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">{t("coll.all")}</TabsTrigger>
            <TabsTrigger value="built" data-testid="tab-built">{t("coll.built")}</TabsTrigger>
            <TabsTrigger value="gb" data-testid="tab-gb">{t("coll.groupBuy")}</TabsTrigger>
            <TabsTrigger value="unused" data-testid="tab-unused">{t("coll.unused")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((kb) => (
          <Card
            key={kb.id}
            className="overflow-hidden group"
            data-testid={`card-keyboard-${kb.id}`}
          >
            {/* Photo */}
            {kb.photoFolder && (
              <div className="h-40 bg-muted overflow-hidden">
                <img
                  src={getPhotoUrl(kb.photoFolder) || ""}
                  alt={kb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.display = "none";
                  }}
                />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight truncate">
                    {kb.name}
                  </h3>
                  {kb.color && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {kb.color}
                    </p>
                  )}
                </div>
                <Badge
                  variant={kb.status === "gb" ? "outline" : "secondary"}
                  className="text-xs shrink-0"
                >
                  {kb.status === "gb" ? (
                    <>
                      <Package className="w-3 h-3 mr-1" />
                      {t("coll.groupBuy")}
                    </>
                  ) : (
                    kb.format || t("coll.built")
                  )}
                </Badge>
              </div>

              {kb.status === "built" && (
                <>
                  <div className="mt-3 space-y-1.5">
                    {kb.keycaps && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider w-12 shrink-0">
                          {t("coll.caps")}
                        </span>
                        <span className="text-xs truncate">{kb.keycaps}</span>
                      </div>
                    )}
                    {kb.switchType && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider w-12 shrink-0">
                          {t("coll.switch")}
                        </span>
                        <span className="text-xs truncate">
                          {kb.switchType}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {kb.lastUsedAt
                        ? `${t("coll.used")} ${kb.lastUsedAt}`
                        : t("coll.neverTracked")}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => markUsed.mutate(kb.id)}
                      disabled={markUsed.isPending}
                      data-testid={`button-use-${kb.id}`}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {t("coll.use")}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">{t("coll.noKeyboards")}</p>
        </div>
      )}
    </div>
  );
}
