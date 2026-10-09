import type { Food, Meal } from "./api";
export function compositionText(
  value: number | null,
  digits: number,
  unit: string,
) {
  return value === null ? "Indisponível" : `${value.toFixed(digits)} ${unit}`;
}
export function composition(items: Food[]) {
  function sum(total: number | null, amount: number | null, ratio: number) {
    return total === null || amount === null ? null : total + amount * ratio;
  }
  return items.reduce(
    (total, item) => {
      const ratio = item.grams / 100;
      return {
        kcal: sum(total.kcal, item.kcal, ratio),
        protein: sum(total.protein, item.protein, ratio),
        carbs: sum(total.carbs, item.carbs, ratio),
        fat: sum(total.fat, item.fat, ratio),
        fiber: sum(total.fiber, item.fiber, ratio),
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } as Record<
      "kcal" | "protein" | "carbs" | "fat" | "fiber",
      number | null
    >,
  );
}
export function menuComposition(meals: Meal[]) {
  return composition(meals.flatMap((m) => m.items));
}
export function cpfDigits(value: string) {
  return value.replace(/\D/g, "");
}
export function displayName(patient: { name: string; socialName?: string }) {
  return patient.socialName?.trim() || patient.name;
}
