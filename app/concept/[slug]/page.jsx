import { notFound } from "next/navigation";
import TechByte from "@/components/TechByte";
import { concepts, getConceptBySlug } from "@/data/concepts";

export function generateStaticParams() {
  return concepts
    .filter((c) => c.questions)
    .map((c) => ({ slug: c.slug }));
}

export default async function ConceptPage({ params }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept || !concept.questions) notFound();
  return <TechByte concept={concept} />;
}
