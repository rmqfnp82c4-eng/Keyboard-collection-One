import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Keyboard,
  Dices,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { I18nProvider, useI18n } from "./lib/i18n";
import Dashboard from "./pages/dashboard";
import Collection from "./pages/collection";
import KeyboardOfDay from "./pages/keyboard-of-day";
import StatsPage from "./pages/stats-page";
import NotFound from "./pages/not-found";

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg hover:bg-accent transition-colors"
      data-testid="theme-toggle"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function LocaleToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ru" : "en")}
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors text-xs font-semibold text-sidebar-foreground"
      data-testid="locale-toggle"
      aria-label="Toggle language"
    >
      <span className="text-[10px] leading-none opacity-60">{locale === "en" ? "EN" : "RU"}</span>
      <span className="text-sidebar-foreground/60">→</span>
      <span className="leading-none text-primary">{locale === "en" ? "RU" : "EN"}</span>
    </button>
  );
}

function AppSidebar() {
  const [location] = useLocation();
  const { t } = useI18n();

  const links = [
    { href: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { href: "/collection", icon: Keyboard, label: t("nav.collection") },
    { href: "/keyboard-of-day", icon: Dices, label: t("nav.keebOfDay") },
    { href: "/stats", icon: BarChart3, label: t("nav.stats") },
  ];

  return (
    <aside className="w-56 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 32 32"
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-label="Keyboard Dashboard"
          >
            <rect x="3" y="8" width="26" height="16" rx="3" />
            <rect x="7" y="12" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
            <rect x="12" y="12" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
            <rect x="17" y="12" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
            <rect x="22" y="12" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
            <rect x="9" y="17" width="14" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          </svg>
          <span className="font-semibold text-sm tracking-tight">
            KeebTracker
          </span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? location === "/" || location === ""
              : location.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              data-testid={`nav-${link.href === "/" ? "dashboard" : link.href.slice(1)}`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        <span className="text-xs text-sidebar-foreground/50">v1.0</span>
        <div className="flex items-center gap-1">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

function App() {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <Router hook={useHashLocation}>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/collection" component={Collection} />
                <Route path="/keyboard-of-day" component={KeyboardOfDay} />
                <Route path="/stats" component={StatsPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </I18nProvider>
  );
}

export default App;
