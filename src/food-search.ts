function normalized(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

/** All words must match; preparation and official code remain searchable. */
export function searchFoods<T extends { name: string; code: string }>(
  foods: readonly T[],
  query: string,
): T[] {
  const words = normalized(query).trim().split(/\s+/).filter(Boolean);
  return foods.filter((food) => {
    const text = normalized(`${food.name} ${food.code}`);
    return words.every((word) => text.includes(word));
  });
}
