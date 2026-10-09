import type { Food } from "./api";

const fields = ["kcal", "protein", "carbs", "fat", "fiber"] as const;
export type OfficialFood = Food & { code: string };
let loaded: Promise<readonly OfficialFood[]> | null = null;

/** A damaged local asset must produce an error, never an empty catalogue. */
export function parseFoodCatalog(raw: string): OfficialFood[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Catálogo inválido.");
  const codes = new Set<string>();
  for (const food of parsed) {
    if (
      !food ||
      typeof food.code !== "string" ||
      !food.name ||
      typeof food.name !== "string" ||
      !["TBCA 7.3", "TACO 4ª edição"].includes(food.source) ||
      food.grams !== 100 ||
      codes.has(food.code) ||
      !Array.isArray(food.measures) ||
      food.measures.some(
        (m: { name?: unknown; grams?: number }) =>
          typeof m.name !== "string" ||
          !Number.isFinite(m.grams) ||
          (m.grams ?? 0) <= 0,
      ) ||
      !food.nutrients ||
      typeof food.nutrients !== "object" ||
      Array.isArray(food.nutrients) ||
      fields.some(
        (field) =>
          food[field] !== null &&
          (!Number.isFinite(food[field]) || food[field] < 0),
      )
    )
      throw new Error("Catálogo inválido.");
    codes.add(food.code);
  }
  return parsed as OfficialFood[];
}

/** Load shared local chunks only when the picker is opened. Dynamic module
 * imports work with the existing script CSP; no network permission is added. */
export function loadFoodCatalog(): Promise<readonly OfficialFood[]> {
  loaded ??= Promise.all([
    import("./data/tbca.json?raw"),
    import("./data/taco.json?raw"),
  ])
    .then(([tbca, taco]) => {
      const foods = [
        ...parseFoodCatalog(tbca.default),
        ...parseFoodCatalog(taco.default),
      ];
      if (
        !foods.length ||
        new Set(foods.map((f) => f.code)).size !== foods.length
      )
        throw new Error("Catálogo inválido.");
      return foods;
    })
    .catch((error: unknown) => {
      loaded = null;
      throw error;
    });
  return loaded;
}
