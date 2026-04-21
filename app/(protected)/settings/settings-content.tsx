import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  KeyRound,
  WifiOff,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <CircleUserRound className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {user?.user_metadata?.display_name ?? "No name set"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </div>

      <section className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide px-1 mb-2">
          Appearance
        </p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-3">
            <span>Theme</span>
            <ThemeSwitcher />
          </div>
        </div>
      </section>

      <section className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide px-1 mb-2">
          Account
        </p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <CircleUserRound className="w-4 h-4 text-muted-foreground" />
              <span>Display Name</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              <span>Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </section>

      <section className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide px-1 mb-2">
          Preferences
        </p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <WifiOff className="w-4 h-4 text-muted-foreground" />
              <span>Online Status</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </section>

      <section>
        <div className="rounded-xl border border-destructive/30 bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-destructive">Sign Out</span>
            <LogoutButton />
          </div>
        </div>
      </section>
    </div>
  );
}
