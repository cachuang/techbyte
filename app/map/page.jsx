"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import KnowledgeMap from "@/components/KnowledgeMap";

export default function MapPage() {
  const { user, loading: authLoading } = useAuth();
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("attempts")
        .select("concept_slug, score")
        .eq("user_id", user.id);
      if (cancelled) return;
      if (error) setError(error.message);
      else setAttempts(data ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return <p style={styles.note}>載入中...</p>;
  }

  if (!user) {
    return (
      <div style={styles.gate} className="tb-gate">
        <h1 style={styles.gateTitle} className="tb-gate-title">
          🌱 我的技能樹
        </h1>
        <p style={styles.gateText} className="tb-gate-text">
          登入後即可看到 8 個主題、15 個概念的視覺化進度。
        </p>
        <p style={styles.gateText} className="tb-gate-text">
          右上角點「登入」→ 切到「註冊」建一個帳號（username + 密碼，不寄信）。
        </p>
      </div>
    );
  }

  if (error) {
    return <p style={styles.note}>讀取進度失敗：{error}</p>;
  }

  if (attempts == null) {
    return <p style={styles.note}>讀取進度中...</p>;
  }

  return (
    <div style={styles.wrap} className="tb-map-wrap">
      <h1 style={styles.title} className="tb-map-title">
        🌱 我的技能樹
      </h1>
      <p style={styles.subtitle} className="tb-map-subtitle">
        依領域分組的學習進度。點任一個概念前往閱讀或重做。
      </p>
      <KnowledgeMap attempts={attempts} />
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "24px 28px 60px",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f0f0e8",
    fontFamily: "var(--font-sans)",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#7a766c",
    marginBottom: 22,
    lineHeight: 1.6,
  },
  gate: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "60px 28px",
    textAlign: "center",
  },
  gateTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#f0f0e8",
    fontFamily: "var(--font-sans)",
    marginBottom: 16,
  },
  gateText: {
    fontSize: 15,
    color: "#888",
    lineHeight: 1.7,
    marginBottom: 8,
  },
  note: {
    maxWidth: 680,
    margin: "60px auto",
    padding: "0 28px",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
};
