import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/research/", label: "Research" },
  { to: "/news/", label: "Market News" },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-serif text-[1.45rem] font-semibold leading-none tracking-[0.02em] text-foreground transition-opacity hover:opacity-80"
        >
          Yujia Zhang
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "nav-link text-sm transition-colors",
                location.pathname === l.to
                  ? "text-foreground font-medium"
                  : "text-muted hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="mailto:yujia.zhang.uom@gmail.com"
            className="rounded-full border border-foreground px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-white"
          >
            Get In Touch
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border px-6 pb-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cn(
                "text-sm py-2",
                location.pathname === l.to
                  ? "text-foreground font-medium"
                  : "text-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="mailto:yujia.zhang.uom@gmail.com"
            className="rounded-full border border-foreground px-5 py-2 text-sm font-medium text-center mt-2"
          >
            Get In Touch
          </a>
        </nav>
      )}
    </header>
  );
}
