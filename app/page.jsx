import Link from "next/link";
import { concepts } from "@/data/concepts";

export default function Home() {
  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <span style={styles.logo}>techbyte</span>
        <span style={styles.tagline}>A byte a day, keeps the layoff away</span>
      </header>

      <ul style={styles.list}>
        {concepts.map((c) => {
          const isReady = !!c.questions;
          const inner = (
            <div style={{ ...styles.row, opacity: isReady ? 1 : 0.4 }}>
              <span style={styles.day}>Day {String(c.day).padStart(2, "0")}</span>
              <span style={styles.tag}>{c.tag}</span>
              <span style={styles.title}>{c.title}</span>
              <span style={styles.status}>{isReady ? "→" : "soon"}</span>
            </div>
          );
          return (
            <li key={c.day} style={styles.item}>
              {isReady ? (
                <Link href={`/day/${c.day}`} style={styles.link}>
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e8e8e0",
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "32px 28px 24px",
    borderBottom: "1px solid #1e1e1e",
  },
  logo: {
    fontFamily: "'Courier New', monospace",
    fontSize: 18,
    color: "#facc15",
    letterSpacing: 3,
    fontWeight: 700,
  },
  tagline: { fontSize: 13, color: "#666", fontStyle: "italic" },
  list: { listStyle: "none", padding: "16px 0", margin: 0 },
  item: { borderBottom: "1px solid #161616" },
  link: { textDecoration: "none", color: "inherit", display: "block" },
  row: {
    display: "grid",
    gridTemplateColumns: "70px 90px 1fr 40px",
    alignItems: "center",
    gap: 16,
    padding: "16px 28px",
    transition: "background 0.15s",
  },
  day: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#666",
    letterSpacing: 1,
  },
  tag: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#facc15",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: { fontSize: 16, color: "#f0f0e8" },
  status: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#444",
    textAlign: "right",
  },
};
