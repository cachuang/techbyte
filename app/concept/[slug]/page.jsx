import { notFound } from "next/navigation";
import TechByte from "@/components/TechByte";
import ConceptStub from "@/components/ConceptStub";
import { concepts, getConceptBySlug } from "@/data/concepts";

export function generateStaticParams() {
  // 每個 slug 都生（包含 stub），stub 走 ConceptStub 路徑
  return concepts.map((c) => ({ slug: c.slug }));
}

export default async function ConceptPage({ params }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();
  if (!concept.questions) return <ConceptStub concept={concept} />;
  return <TechByte concept={concept} />;
}
