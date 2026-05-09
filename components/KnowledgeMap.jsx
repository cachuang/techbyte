"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { concepts } from "@/data/concepts";

const STATUS = {
  mastered: { bg: "#facc15", border: "#facc15", text: "#0a0a0a", label: "已掌握" },
  attempted: { bg: "#1f1810", border: "#f59e0b", text: "#f59e0b", label: "嘗試中" },
  untouched: { bg: "#111", border: "#2a2a2a", text: "#666", label: "未做" },
};

const TAG_STYLE = {
  width: 130,
  background: "#0a0a0a",
  border: "1.5px solid #facc15",
  color: "#facc15",
  fontFamily: "'Courier New', monospace",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  padding: "8px 12px",
  borderRadius: 8,
};

function buildGraph(bestScoreByDay) {
  const tags = [...new Set(concepts.map((c) => c.tag))];
  const nodes = [];
  const edges = [];
  const center = { x: 400, y: 320 };
  const tagRadius = 220;
  const conceptOffset = 150;

  tags.forEach((tag, i) => {
    const angle = (i * 2 * Math.PI) / tags.length - Math.PI / 2;
    const tx = center.x + tagRadius * Math.cos(angle);
    const ty = center.y + tagRadius * Math.sin(angle);

    nodes.push({
      id: `tag-${tag}`,
      position: { x: tx, y: ty },
      data: { label: tag },
      style: TAG_STYLE,
      sourcePosition: "right",
      targetPosition: "left",
      draggable: false,
      selectable: false,
    });

    const tagConcepts = concepts.filter((c) => c.tag === tag);
    tagConcepts.forEach((c, j) => {
      const spread =
        tagConcepts.length === 1
          ? 0
          : (j - (tagConcepts.length - 1) / 2) * 0.32;
      const cAngle = angle + spread;
      const cx = tx + conceptOffset * Math.cos(cAngle);
      const cy = ty + conceptOffset * Math.sin(cAngle);

      const score = bestScoreByDay[c.day];
      const status =
        score == null ? "untouched" : score >= 2 ? "mastered" : "attempted";
      const s = STATUS[status];

      nodes.push({
        id: `concept-${c.day}`,
        position: { x: cx, y: cy },
        data: {
          label: `Day ${c.day} · ${c.title}${score != null ? ` (${score}/3)` : ""}`,
          day: c.day,
        },
        style: {
          width: 170,
          background: s.bg,
          border: `1.5px solid ${s.border}`,
          color: s.text,
          padding: "8px 10px",
          borderRadius: 8,
          fontSize: 12,
          fontFamily: "inherit",
          cursor: "pointer",
        },
        draggable: false,
      });

      edges.push({
        id: `e-${tag}-${c.day}`,
        source: `tag-${tag}`,
        target: `concept-${c.day}`,
        style: { stroke: status === "mastered" ? "#facc15" : "#2a2a2a" },
        animated: status === "mastered",
      });
    });
  });

  return { nodes, edges };
}

export default function KnowledgeMap({ attempts }) {
  const router = useRouter();

  const bestScoreByDay = useMemo(() => {
    const map = {};
    for (const a of attempts ?? []) {
      const prev = map[a.day];
      if (prev == null || a.score > prev) map[a.day] = a.score;
    }
    return map;
  }, [attempts]);

  const { nodes, edges } = useMemo(
    () => buildGraph(bestScoreByDay),
    [bestScoreByDay],
  );

  const handleNodeClick = (_event, node) => {
    if (node.id.startsWith("concept-") && node.data?.day) {
      router.push(`/day/${node.data.day}`);
    }
  };

  return (
    <div style={{ height: "70vh", background: "#0a0a0a" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesConnectable={false}
        nodesFocusable
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e1e1e" gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
