"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Supabase Auth 會驗證 email 域名是否有 DNS（拒絕虛構域名），所以借用 gmail.com 當載體。
// 加 "techbyte_" 前綴避免跟真實 Gmail 用戶撞 — 我們從不真的寄信，這個 email 也不會
// 顯示給使用者；只是 auth.users 的內部主鍵。
const usernameToEmail = (u) =>
  `techbyte_${u.trim().toLowerCase()}@gmail.com`;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

export default function AuthForm({ onClose }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    if (!USERNAME_PATTERN.test(username.trim())) {
      setStatus("error");
      setErrorMsg("帳號需 3–24 字，只能用英文 / 數字 / 底線");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setErrorMsg("密碼至少 6 字元");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const email = usernameToEmail(username);

    const { error } =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { username: username.trim() } },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMsg(translateError(error.message, mode));
      return;
    }

    // 成功：useAuth 監聽到 user 變動會自動更新 Header。關掉 form。
    setStatus("idle");
    setUsername("");
    setPassword("");
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.box}>
      <div style={styles.tabs}>
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMsg("");
            setStatus("idle");
          }}
          style={mode === "signin" ? styles.tabActive : styles.tab}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg("");
            setStatus("idle");
          }}
          style={mode === "signup" ? styles.tabActive : styles.tab}
        >
          註冊
        </button>
      </div>

      <label style={styles.label} htmlFor="auth-username">
        帳號（英文 / 數字 / 底線，3–24 字）
      </label>
      <input
        id="auth-username"
        type="text"
        required
        placeholder="alice"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
        className="tb-auth-input"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        disabled={status === "submitting"}
      />

      <label style={{ ...styles.label, marginTop: 12 }} htmlFor="auth-password">
        密碼（至少 6 字元）
      </label>
      <input
        id="auth-password"
        type="password"
        required
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        className="tb-auth-input"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        disabled={status === "submitting"}
      />

      <button
        type="submit"
        style={{ ...styles.btn, opacity: status === "submitting" ? 0.5 : 1 }}
        className="tb-auth-submit"
        disabled={status === "submitting"}
      >
        {status === "submitting"
          ? "處理中..."
          : mode === "signup"
          ? "建立帳號"
          : "登入"}
      </button>

      {status === "error" && <p style={styles.errorText}>{errorMsg}</p>}

      <p style={styles.hint}>
        {mode === "signup"
          ? "註冊不需 email、不會寄信。記得密碼，目前沒有忘記密碼流程。"
          : "首次來請先點上面「註冊」建立帳號。"}
      </p>
    </form>
  );
}

function translateError(msg, mode) {
  const lower = (msg || "").toLowerCase();
  if (lower.includes("invalid login")) return "帳號或密碼錯誤";
  if (lower.includes("already registered") || lower.includes("already exists"))
    return "此帳號已存在，請改用「登入」";
  if (lower.includes("at least") && lower.includes("6")) return "密碼至少 6 字元";
  if (lower.includes("not confirmed"))
    return "Supabase 後台未關閉「Confirm email」，請先到 Auth 設定關掉";
  return mode === "signup" ? `註冊失敗：${msg}` : `登入失敗：${msg}`;
}

const styles = {
  box: {
    background: "#141418",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "18px 20px",
    marginBottom: 16,
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 18,
    borderBottom: "1px solid #2a2a2a",
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    background: "transparent",
    color: "#888",
    border: "none",
    borderBottom: "2px solid transparent",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 1,
    cursor: "pointer",
    fontWeight: 700,
    transition: "color 0.15s",
  },
  tabActive: {
    flex: 1,
    padding: "10px 0",
    background: "transparent",
    color: "#facc15",
    border: "none",
    borderBottom: "2px solid #facc15",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 1,
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: -1,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    fontFamily: "'Courier New', monospace",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    color: "#f0f0e8",
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
  },
  btn: {
    marginTop: 18,
    width: "100%",
    padding: "12px 16px",
    background: "#facc15",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 6,
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: 700,
    cursor: "pointer",
  },
  errorText: {
    fontSize: 13,
    color: "#f87171",
    marginTop: 12,
    lineHeight: 1.5,
  },
  hint: {
    fontSize: 11,
    color: "#666",
    marginTop: 14,
    lineHeight: 1.6,
    fontFamily: "'Courier New', monospace",
  },
};
