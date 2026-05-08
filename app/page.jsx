import TechByte from "@/components/TechByte";
import { getConceptByDay } from "@/data/concepts";

export default function Home() {
  const today = getConceptByDay(1);
  return <TechByte concept={today} />;
}
