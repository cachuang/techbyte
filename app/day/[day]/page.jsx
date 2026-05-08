import { notFound } from "next/navigation";
import TechByte from "@/components/TechByte";
import { concepts, getConceptByDay } from "@/data/concepts";

export function generateStaticParams() {
  return concepts
    .filter((c) => c.questions)
    .map((c) => ({ day: String(c.day) }));
}

export default async function DayPage({ params }) {
  const { day } = await params;
  const concept = getConceptByDay(Number(day));
  if (!concept || !concept.questions) notFound();
  return <TechByte concept={concept} />;
}
