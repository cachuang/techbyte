"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const TABS = [
  { href: "/", label: "每日", icon: "📅", match: (p) => !p.startsWith("/stats") && !p.startsWith("/map") },
  { href: "/stats", label: "我的數據", icon: "📊", match: (p) => p.startsWith("/stats") },
  { href: "/map", label: "我的技能樹", icon: "🌱", match: (p) => p.startsWith("/map") },
];

export default function MainTabs() {
  const pathname = usePathname() || "/";
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <nav style={styles.bar} className="tb-tabs" aria-label="主要導覽">
      {TABS.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            style={
              active
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
            className="tb-tab"
            aria-current={active ? "page" : undefined}
          >
            <span style={styles.icon}>{t.icon}</span>
            <span
              style={
                active
                  ? { ...styles.label, ...styles.labelActive }
                  : styles.label
              }
            >
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  bar: {
    display: "flex",
    maxWidth: 680,
    margin: "0 auto",
    borderBottom: "1px solid #1e1e1e",
    background: "#0a0a0a",
  },
  tab: {
    flex: 1,
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    padding: "10px 8px 9px",
    textDecoration: "none",
    color: "#7a766c",
    borderBottom: "2px solid transparent",
    transition: "all 0.15s ease",
    minHeight: 50,
  },
  tabActive: {
    color: "#facc15",
    borderBottomColor: "#facc15",
  },
  icon: {
    fontSize: 17,
    lineHeight: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    letterSpacing: 1.2,
    fontWeight: 700,
    textTransform: "uppercase",
    color: "#7a766c",
    lineHeight: 1,
  },
  labelActive: {
    color: "#facc15",
  },
};
