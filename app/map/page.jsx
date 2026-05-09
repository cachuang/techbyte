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
        .select("day, score")
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
      <div style={styles.gate}>
        <h1 style={styles.gateTitle}>🗺 知識地圖</h1>
        <p style={styles.gateText}>
          登入後即可看到 8 個主題、15 個概念的視覺化進度。
        </p>
        <p style={styles.gateText}>右上角點「登入」用 email 收登入連結。</p>
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
    <div style={styles.wrap}>
      <h1 style={styles.title}>🗺 知識地圖</h1>
      <p style={styles.subtitle}>
        金色＝已掌握（≥2/3）　橙色＝嘗試過　灰色＝未做。點概念前往閱讀。
      </p>
      <KnowledgeMap attempts={attempts} />
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "24px 28px 40px",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f0f0e8",
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 20,
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
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
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
