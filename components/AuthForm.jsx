"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div style={styles.box}>
        <p style={styles.successText}>
          ✉️ 登入連結已寄到 <strong>{email}</strong>，請點信中連結登入。
        </p>
        {onClose && (
          <button onClick={onClose} style={styles.closeBtn}>
            關閉
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.box}>
      <label style={styles.label} htmlFor="auth-email">
        用 email 登入（會收到一個一次性連結）
      </label>
      <div style={styles.row} className="tb-auth-row">
        <input
          id="auth-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          className="tb-auth-input"
          disabled={status === "sending"}
          autoComplete="email"
          inputMode="email"
        />
        <button
          type="submit"
          style={{ ...styles.btn, opacity: status === "sending" ? 0.5 : 1 }}
          className="tb-auth-submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "寄送中..." : "寄送登入連結"}
        </button>
      </div>
      {status === "error" && <p style={styles.errorText}>登入失敗：{errorMsg}</p>}
    </form>
  );
}

const styles = {
  box: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "16px 20px",
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
    fontFamily: "'Courier New', monospace",
    letterSpacing: 1,
  },
  row: { display: "flex", gap: 8 },
  input: {
    flex: 1,
    padding: "10px 12px",
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    color: "#f0f0e8",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  },
  btn: {
    padding: "10px 16px",
    background: "#facc15",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 6,
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  successText: { fontSize: 14, color: "#4ade80", lineHeight: 1.6 },
  errorText: { fontSize: 13, color: "#f87171", marginTop: 10 },
  closeBtn: {
    marginTop: 12,
    padding: "6px 12px",
    background: "transparent",
    color: "#888",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    fontSize: 12,
    fontFamily: "monospace",
    cursor: "pointer",
  },
};
