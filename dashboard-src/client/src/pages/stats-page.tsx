import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Keyboard, Box, ToggleLeft, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const CHART_COLORS = [
  "hsl(38, 92%, 50%)",   // amber
  "hsl(262, 60%, 55%)",  // purple
  "hsl(183, 65%, 38%)",  // teal
  "hsl(150, 50%, 42%)",  // green
  "hsl(12, 78%, 55%)",   // coral
  "hsl(210, 60%, 50%)",  // blue
  "hsl(330, 50%, 50%)",  // pink
  "hsl(45, 80%, 55%)",   // gold
];

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

interface KeycapSet {
  id: number;
  name: string;
  status: string;
}

interface SwitchItem {
  id: number;
  name: string;
  brand: string | null;
  inUse: number | null;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground tabular-nums">{payload[0].value}</p>
    </div>
  );
}

export default function StatsPage() {
  const { t } = useI18n();
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });
  const { data: keycaps } = useQuery<KeycapSet[]>({
    queryKey: ["/api/keycaps"],
  });
  const { data: switches } = useQuery<SwitchItem[]>({
    queryKey: ["/api/switches"],
  });

  if (statsLoading || !stats) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  // Prepare chart data
  const formatData = Object.entries(stats.formatDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const brandData = Object.entries(stats.switchBrands)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const colorData = Object.entries(stats.colorDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const keycapStatusData = [
    { name: t("stats.onKeyboard"), value: stats.keycapsOnKeyboard },
    { name: t("stats.inBox"), value: stats.keycapsInBox },
    { name: t("stats.groupBuy"), value: stats.keycapsInGb },
  ];

  // Days in hobby calc (from April 2024)
  const hobbyStart = new Date("2024-04-17");
  const now = new Date();
  const daysInHobby = Math.floor(
    (now.getTime() - hobbyStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold tracking-tight" data-testid="text-page-title">
          {t("stats.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("stats.subtitle")}
        </p>
      </div>

      {/* Hero Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="card-stat-days">
          <CardContent className="p-4 text-center">
            <Calendar className="w-5 h-5 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold tabular-nums">{daysInHobby}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("stats.daysInHobby")}</p>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-keyboards">
          <CardContent className="p-4 text-center">
            <Keyboard className="w-5 h-5 mx-auto text-chart-1 mb-2" />
            <p className="text-3xl font-bold tabular-nums">
              {stats.totalKeyboards}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("stats.keyboards")}</p>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-keycaps">
          <CardContent className="p-4 text-center">
            <Box className="w-5 h-5 mx-auto text-chart-3 mb-2" />
            <p className="text-3xl font-bold tabular-nums">
              {stats.totalKeycapSets}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("stats.gmkSets")}</p>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-switches">
          <CardContent className="p-4 text-center">
            <ToggleLeft className="w-5 h-5 mx-auto text-chart-2 mb-2" />
            <p className="text-3xl font-bold tabular-nums">
              {stats.totalSwitches}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("stats.switches")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Format Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {t("stats.layoutDist")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={formatData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={72}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(38, 92%, 50%)"
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Keycap Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {t("stats.keycapStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={keycapStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {keycapStatusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Switch Brands */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {t("stats.topSwitchBrands")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={brandData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(262, 60%, 55%)"
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Color Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {t("stats.keyboardColors")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={colorData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(183, 65%, 38%)"
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Keycap Sets Table */}
      {keycaps && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {t("stats.allGmkSets")} ({keycaps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {keycaps.map((kc) => (
                <div
                  key={kc.id}
                  className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg"
                  data-testid={`card-keycap-${kc.id}`}
                >
                  <span className="text-xs truncate mr-2">{kc.name}</span>
                  <Badge
                    variant={
                      kc.status === "on_keyboard"
                        ? "default"
                        : kc.status === "in_box"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-[10px] shrink-0"
                  >
                    {kc.status === "on_keyboard"
                      ? t("stats.active")
                      : kc.status === "in_box"
                        ? t("stats.inBoxBadge")
                        : t("stats.gbBadge")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Switch Inventory */}
      {switches && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              {t("stats.switchInventory")} ({switches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {switches.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg"
                  data-testid={`card-switch-${sw.id}`}
                >
                  <div className="min-w-0 mr-2">
                    <p className="text-xs truncate">{sw.name}</p>
                    {sw.brand && (
                      <p className="text-[10px] text-muted-foreground">
                        {sw.brand}
                      </p>
                    )}
                  </div>
                  {sw.inUse ? (
                    <Badge variant="default" className="text-[10px] shrink-0">
                      {t("stats.inUseBadge")}
                    </Badge>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
