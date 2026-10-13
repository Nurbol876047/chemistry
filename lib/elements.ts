import { Droplet, Flame, Mountain, Wind, type LucideIcon } from "lucide-react";
import { Element } from "@/lib/types";

export const ELEMENT_META: Record<
  Element,
  { label: string; icon: LucideIcon; className: string }
> = {
  су: { label: "Су стихиясы", icon: Droplet, className: "bg-sky-50 text-sky-700 border-sky-300" },
  от: { label: "От стихиясы", icon: Flame, className: "bg-orange-50 text-orange-700 border-orange-300" },
  жер: {
    label: "Жер стихиясы",
    icon: Mountain,
    className: "bg-stone-50 text-stone-700 border-stone-300",
  },
  ауа: { label: "Ауа стихиясы", icon: Wind, className: "bg-cyan-50 text-cyan-700 border-cyan-300" },
};
