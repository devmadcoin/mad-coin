import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router";
import { LINKS } from "@/lib/data";
import { PAGE_LINKS } from "@/lib/pages-data";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "py-3" : "py-5")}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src="/assets/mad-logo.png"
              alt="$MAD"
              className="h-10 w-10 rounded-full shadow-glow-sm transition-transform duration-300 hover:rotate-[-8deg] hover:scale-110"
            />
            <div className="leading-none">
              <span className="font-display text-lg tracking-wide text-bone">$MAD</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-ash">
                Stay $MAD
              </span>
            </div>
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-0.5 rounded-full border px-1.5 py-1.5 transition-all duration-500 lg:flex",
              scrolled || pathname !== "/" ? "glass border-white/10 shadow-lg shadow-black/40" : "border-transparent",
            )}
          >
            {PAGE_LINKS.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                end={l.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                    isActive
                      ? l.label === "Shop"
                        ? "bg-mad text-white shadow-glow-sm"
                        : "bg-bone text-ink"
                      : "text-ash hover:bg-white/5 hover:text-bone",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-mad px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all duration-300 hover:scale-105 hover:bg-mad-bright hover:shadow-glow sm:block"
            >
              Buy $MAD
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="glass flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 lg:hidden"
            >
              <span className={cn("h-0.5 w-5 bg-bone transition-all duration-300", open && "translate-y-1 rotate-45")} />
              <span className={cn("h-0.5 w-5 bg-bone transition-all duration-300", open && "-translate-y-1 -rotate-45")} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            {PAGE_LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <NavLink
                  to={l.href}
                  end={l.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "font-display text-4xl uppercase tracking-wide transition-colors",
                      isActive ? "text-mad" : "text-bone hover:text-mad",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 rounded-full bg-mad px-8 py-3 font-bold uppercase tracking-wider text-white shadow-glow"
            >
              Buy $MAD
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
