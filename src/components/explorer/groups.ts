import { Bird, Bug, Droplets, Fish, Leaf, PawPrint, Snail, Sprout, Turtle, type LucideIcon } from "lucide-react";

/** Grupos del filtro. `value` es el nombre que entienden iNaturalist y GBIF. */
export const EXPLORER_GROUPS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "Aves", label: "Aves", icon: Bird },
  { value: "Mammalia", label: "Mamíferos", icon: PawPrint },
  { value: "Reptilia", label: "Reptiles", icon: Turtle },
  { value: "Amphibia", label: "Anfibios", icon: Droplets },
  { value: "Actinopterygii", label: "Peces", icon: Fish },
  { value: "Insecta", label: "Insectos", icon: Bug },
  { value: "Arachnida", label: "Arañas", icon: Bug },
  { value: "Mollusca", label: "Moluscos", icon: Snail },
  { value: "Plantae", label: "Plantas", icon: Leaf },
  { value: "Fungi", label: "Hongos", icon: Sprout },
];

export const groupLabel = (value?: string | null) => EXPLORER_GROUPS.find((group) => group.value === value)?.label;

/** Ícono del grupo para tarjetas sin foto. Acepta también clases de GBIF (Magnoliopsida…). */
export const groupIcon = (group?: string | null): LucideIcon => {
  const match = EXPLORER_GROUPS.find((item) => item.value === group);
  if (match) return match.icon;
  if (group && /opsida|phyta|Plantae/.test(group)) return Leaf;
  if (group && /mycetes|Fungi/.test(group)) return Sprout;
  return Leaf;
};
