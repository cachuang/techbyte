import { notFound } from "next/navigation";
import RecapQuiz from "@/components/RecapQuiz";
import { concepts, getConceptBySlug } from "@/data/concepts";

export function generateStaticParams() {
  return concepts
    .filter((c) => c.recapQuestion)
    .map((c) => ({ slug: c.slug }));
}

export default async function RecapPage({ params }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept || !concept.recapQuestion) notFound();
  return <RecapQuiz concept={concept} />;
}
