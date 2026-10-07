import type { Food, Meal } from "./api";
export function composition(items: Food[]) {
  return items.reduce(
    (total, item) => {
      const ratio = item.grams / 100;
      return {
        kcal: total.kcal + item.kcal * ratio,
        protein: total.protein + item.protein * ratio,
        carbs: total.carbs + item.carbs * ratio,
        fat: total.fat + item.fat * ratio,
        fiber: total.fiber + item.fiber * ratio,
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
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
