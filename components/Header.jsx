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
        <Link href="/" style={styles.brandLink}>
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
    padding: "16px 28px",
    borderBottom: "1px solid #1e1e1e",
    background: "#0a0a0a",
    position: "sticky",
    top: 0,
    zIndex: 10,
    maxWidth: 680,
    margin: "0 auto",
  },
  brandLink: { textDecoration: "none" },
  logo: {
    fontFamily: "'Courier New', monospace",
    fontSize: 16,
    color: "#facc15",
    letterSpacing: 2,
    fontWeight: 700,
  },
  nav: { display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap" },
  navLink: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#aaa",
    letterSpacing: 1,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  navIcon: { fontSize: 14 },
  navLabel: {},
  username: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#888",
    letterSpacing: 0.3,
  },
  linkBtn: {
    background: "transparent",
    color: "#facc15",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    padding: "6px 12px",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    cursor: "pointer",
  },
  authWrap: { maxWidth: 680, margin: "16px auto 0", padding: "0 28px" },
};
