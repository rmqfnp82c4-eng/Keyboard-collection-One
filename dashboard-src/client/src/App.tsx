import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Keyboard,
  Dices,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { I18nProvider, useI18n } from "./lib/i18n";
import { ScrollToTop } from "@/components/scroll-to-top";
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

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 text-primary shrink-0"
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
      <span className="font-semibold text-sm tracking-tight">KeebTracker</span>
    </div>
  );
}

interface SidebarContentProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const [location] = useLocation();
  const { t } = useI18n();

  const links = [
    { href: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { href: "/collection", icon: Keyboard, label: t("nav.collection") },
    { href: "/keyboard-of-day", icon: Dices, label: t("nav.keebOfDay") },
    { href: "/stats", icon: BarChart3, label: t("nav.stats") },
  ];

  return (
    <>
      <div className="p-4 border-b border-sidebar-border">
        <Logo />
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? location === "/" || location === ""
              : location.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
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
    </>
  );
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-sidebar-border bg-sidebar text-sidebar-foreground sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        aria-label="Open menu"
        data-testid="mobile-menu-button"
      >
        <Menu className="w-5 h-5" />
      </button>
      <Logo />
      <div className="w-9" />
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative w-64 max-w-[80%] h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col animate-in slide-in-from-left duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [mainEl, setMainEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setMainEl(mainRef.current);
  }, []);

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <Router hook={useHashLocation}>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-56 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col h-full shrink-0">
              <SidebarContent />
            </aside>

            {/* Mobile header + drawer */}
            <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <main
              ref={mainRef}
              className="flex-1 overflow-y-auto relative"
            >
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/collection" component={Collection} />
                <Route path="/keyboard-of-day" component={KeyboardOfDay} />
                <Route path="/stats" component={StatsPage} />
                <Route component={NotFound} />
              </Switch>
              <ScrollToTop scrollContainer={mainEl} />
            </main>
          </div>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </I18nProvider>
  );
}

export default App;
