import hero from "@/data/hero.json";
import Shelf from "@/components/Shelf";
import type { HeroColumn } from "@/lib/types";

export default function Page() {
  return <Shelf hero={hero as HeroColumn[]} />;
}
