import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Keyboard,
  Box,
  ToggleLeft,
  Clock,
  AlertTriangle,
  Dices,
  ArrowRight,
  Check,
} from "lucide-react";
import { Link } from "wouter";
import { getPhotoUrl } from "@/lib/photos";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";



interface Stats {
  totalKeyboards: number;
  builtKeyboards: number;
  groupBuys: number;
  totalKeycapSets: number;
  keycapsOnKeyboard: number;
  keycapsInBox: number;
  keycapsInGb: number;
  totalSwitches: number;
  keycapUsage: Record<string, number>;
  switchUsage: Record<string, number>;
  formatDistribution: Record<string, number>;
  colorDistribution: Record<string, number>;
  neverUsed: Array<{ id: number; name: string; color: string | null }>;
  longestUnused: Array<{
    id: number;
    name: string;
    lastUsedAt: string | null;
  }>;
  switchBrands: Record<string, number>;
  keyboardOfDay: any;
}

export default function Dashboard() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const markUsed = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/keyboards/${id}/use`);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/keyboards"] });
      setUsedIds((prev) => new Set(prev).add(id));
      toast({
        title: locale === "ru" ? "✅ Отмечено!" : "✅ Marked!",
        description: locale === "ru"
          ? "Клавиатура используется сегодня"
          : "Keyboard is your board today",
      });
    },
  });

  if (isLoading || !stats) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: t("dash.keyboards"),
      value: stats.totalKeyboards,
      sub: `${stats.builtKeyboards} ${t("dash.built")} · ${stats.groupBuys} ${t("dash.gb")}`,
      icon: Keyboard,
      color: "text-primary",
    },
    {
      label: t("dash.gmkSets"),
      value: stats.totalKeycapSets,
      sub: `${stats.keycapsOnKeyboard} ${t("dash.onBoard")} · ${stats.keycapsInBox} ${t("dash.inBox")}`,
      icon: Box,
      color: "text-chart-3",
    },
    {
      label: t("dash.switches"),
      value: stats.totalSwitches,
      sub: `${Object.keys(stats.switchBrands).length} ${t("dash.brands")}`,
      icon: ToggleLeft,
      color: "text-chart-2",
    },
    {
      label: t("dash.needRotation"),
      value: stats.neverUsed.length,
      sub: t("dash.neverTracked"),
      icon: AlertTriangle,
      color: "text-chart-5",
    },
  ];

  // Top 5 keycaps / switches
  const topKeycaps = Object.entries(stats.keycapUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topSwitches = Object.entries(stats.switchUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  function boardWord(count: number) {
    return count > 1 ? t("dash.boards") : t("dash.board");
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-page-title">
            {t("dash.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("dash.subtitle", { kb: stats.totalKeyboards, kc: stats.totalKeycapSets, sw: stats.totalSwitches })}
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} data-testid={`card-kpi-${kpi.label.toLowerCase().replace(/\s/g, "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keyboard of the Day */}
      {stats.keyboardOfDay && (
        <Card className="overflow-hidden" data-testid="card-keyboard-of-day">
          <div className="flex flex-col md:flex-row">
            {stats.keyboardOfDay.photoFolder && (
              <div className="md:w-72 h-48 md:h-auto bg-muted overflow-hidden shrink-0">
                <img
                  src={getPhotoUrl(stats.keyboardOfDay.photoFolder) || ""}
                  alt={stats.keyboardOfDay.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="p-5 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Dices className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {t("dash.keyboardOfDay")}
                </span>
              </div>
              <h2 className="text-lg font-bold">{stats.keyboardOfDay.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.keyboardOfDay.color && (
                  <Badge variant="secondary">{stats.keyboardOfDay.color}</Badge>
                )}
                {stats.keyboardOfDay.keycaps && (
                  <Badge variant="outline">{stats.keyboardOfDay.keycaps}</Badge>
                )}
                {stats.keyboardOfDay.switchType && (
                  <Badge variant="outline">
                    {stats.keyboardOfDay.switchType}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {usedIds.has(stats.keyboardOfDay.id) ? (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled
                    data-testid="button-use-today"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    {locale === "ru" ? "Отмечено" : "Used"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => markUsed.mutate(stats.keyboardOfDay.id)}
                    disabled={markUsed.isPending}
                    data-testid="button-use-today"
                  >
                    {t("dash.useToday")}
                  </Button>
                )}
                <Link href="/keyboard-of-day">
                  <Button size="sm" variant="outline" data-testid="button-reroll">
                    <Dices className="w-3.5 h-3.5 mr-1" />
                    {t("dash.reroll")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keycaps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {t("dash.mostUsedKeycaps")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topKeycaps.map(([name, count], i) => (
              <div
                key={name}
                className="flex items-center justify-between py-1.5"
                data-testid={`row-keycap-${i}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums w-4">
                    {i + 1}
                  </span>
                  <span className="text-sm">{name}</span>
                </div>
                <Badge variant="secondary" className="tabular-nums text-xs">
                  {count} {boardWord(count)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Switches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {t("dash.mostUsedSwitches")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topSwitches.map(([name, count], i) => (
              <div
                key={name}
                className="flex items-center justify-between py-1.5"
                data-testid={`row-switch-${i}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums w-4">
                    {i + 1}
                  </span>
                  <span className="text-sm">{name}</span>
                </div>
                <Badge variant="secondary" className="tabular-nums text-xs">
                  {count} {boardWord(count)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Need Rotation */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                <AlertTriangle className="w-4 h-4 inline mr-1 text-chart-5" />
                {t("dash.needsRotation")}
              </CardTitle>
              <Link href="/collection">
                <Button variant="ghost" size="sm" className="text-xs" data-testid="button-view-all">
                  {t("dash.viewAll")} <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {stats.neverUsed.slice(0, 8).map((kb) => (
                <div
                  key={kb.id}
                  className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg"
                  data-testid={`card-unused-${kb.id}`}
                >
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {kb.name}
                    </p>
                    {kb.color && (
                      <p className="text-xs text-muted-foreground">
                        {kb.color}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => markUsed.mutate(kb.id)}
                    disabled={markUsed.isPending}
                    data-testid={`button-use-${kb.id}`}
                  >
                    {t("coll.use")}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
