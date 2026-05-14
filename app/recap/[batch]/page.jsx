import { notFound } from "next/navigation";
import RecapBatch from "@/components/RecapBatch";
import { concepts } from "@/data/concepts";
import {
  RECAP_BATCH_SIZE,
  parseBatchKey,
  getBatchConcepts,
} from "@/lib/recap-prefs";

// Pre-generate batches "1-5", "6-10", ... 涵蓋目前內容範圍。
// L1 全部移到 Day 0、L2/L3 壓縮到 Day 1-27 後，最大完整 batch 是 21-25。
const MAX_BATCH_END_DAY = 25;

export function generateStaticParams() {
  const out = [];
  for (
    let end = RECAP_BATCH_SIZE;
    end <= MAX_BATCH_END_DAY;
    end += RECAP_BATCH_SIZE
  ) {
    const start = end - RECAP_BATCH_SIZE + 1;
    out.push({ batch: `${start}-${end}` });
  }
  return out;
}

export default async function RecapBatchPage({ params }) {
  const { batch: batchParam } = await params;
  const batch = parseBatchKey(batchParam);
  if (!batch) notFound();

  const batchConcepts = getBatchConcepts(batch, concepts);
  if (batchConcepts.length === 0) notFound();

  return <RecapBatch batch={batch} concepts={batchConcepts} />;
}
