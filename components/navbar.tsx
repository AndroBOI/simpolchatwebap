import { MessageCircle, UserRound, Users, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/online-users", icon: UserRound, label: "Online" },
  { href: "/users", icon: Users, label: "Users" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex w-full">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center py-3 gap-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
