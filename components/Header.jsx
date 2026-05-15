"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AuthForm from "./AuthForm";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header style={styles.header} className="tb-header">
        <Link href="/" style={styles.brandLink} aria-label="techbyte home">
          <svg
            width="26"
            height="26"
            viewBox="0 0 64 64"
            aria-hidden="true"
            style={styles.brandMark}
          >
            <rect width="64" height="64" rx="14" fill="#facc15" />
            <rect x="14" y="10" width="9" height="44" rx="1.5" fill="#0a0a0a" />
            <circle cx="35" cy="40" r="14.5" fill="#0a0a0a" />
            <circle cx="35.5" cy="40" r="5.5" fill="#facc15" />
          </svg>
          <span style={styles.logo}>techbyte</span>
        </Link>
        <nav style={styles.nav}>
          {!loading && user && (
            <>
              <Link href="/map" style={styles.navLink} className="tb-nav-link">
                <span style={styles.navIcon}>🗺</span>
                <span style={styles.navLabel}>知識地圖</span>
              </Link>
              <span style={styles.username} className="tb-header-email">
                @{user.user_metadata?.username || (user.email || "").split("@")[0]}
              </span>
              <button onClick={signOut} style={styles.linkBtn} className="tb-link-btn">
                登出
              </button>
            </>
          )}
          {!loading && !user && (
            <button
              onClick={() => setShowAuth((s) => !s)}
              style={styles.linkBtn}
              className="tb-link-btn"
            >
              {showAuth ? "取消" : "登入"}
            </button>
          )}
        </nav>
      </header>
      {showAuth && !user && (
        <div style={styles.authWrap} className="tb-auth-wrap">
          <AuthForm onClose={() => setShowAuth(false)} />
        </div>
      )}
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #1e1e1e",
    background: "#0a0a0a",
    position: "sticky",
    top: 0,
    zIndex: 10,
    maxWidth: 680,
    margin: "0 auto",
  },
  brandLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    textDecoration: "none",
  },
  brandMark: {
    display: "block",
    flexShrink: 0,
  },
  logo: {
    fontFamily: "var(--font-mono)",
    fontSize: 18,
    color: "#facc15",
    letterSpacing: 2,
    fontWeight: 700,
  },
  nav: { display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap" },
  navLink: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "#aaa",
    letterSpacing: 1,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  navIcon: { fontSize: 15 },
  navLabel: {},
  username: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "#888",
    letterSpacing: 0.3,
  },
  linkBtn: {
    background: "transparent",
    color: "#facc15",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    padding: "7px 14px",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    letterSpacing: 1,
    cursor: "pointer",
  },
  authWrap: { maxWidth: 680, margin: "16px auto 0", padding: "0 20px" },
};
