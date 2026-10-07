import { useState } from "react";
import foods from "./data/tbca.json";
import type { Food } from "./api";
function normalized(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}
export function FoodPicker({ onAdd }: { onAdd: (food: Food) => void }) {
  const [query, setQuery] = useState("");
  return (
    <details className="food-picker">
      <summary>Buscar alimento na TBCA 7.3</summary>
      <label className="field">
        <span>Pesquisar na base inicial offline</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Arroz, feijão, banana…"
        />
      </label>
      <p className="hint">
        Catálogo inicial de 5 alimentos com preparação identificada. Para outros
        alimentos, registre a composição e a origem explicitamente.
      </p>
      {foods
        .filter((food) => normalized(food.name).includes(normalized(query)))
        .map((food) => (
          <div className="catalog-row" key={food.code}>
            <span>
              {food.name}
              <small>
                {food.source} · {food.code}
              </small>
            </span>
            <button
              type="button"
              onClick={() => onAdd(structuredClone(food) as Food)}
            >
              Incluir
            </button>
          </div>
        ))}
    </details>
  );
}
