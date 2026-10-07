import { useState } from "react";
import foods from "./data/tbca.json";
import type { Food } from "./api";
import { searchFoods } from "./food-search";
export function FoodPicker({ onAdd }: { onAdd: (food: Food) => void }) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(24);
  const results = searchFoods(foods, query);
  return (
    <details className="food-picker">
      <summary>Buscar alimento na TBCA 7.3</summary>
      <label className="field">
        <span>Pesquisar alimento, preparação ou código</span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(24);
          }}
          placeholder="Ex.: arroz cozido ou BRC0208A"
        />
      </label>
      <p className="hint">
        {foods.length} alimentos disponíveis offline. Confira a preparação antes
        de incluir. O catálogo está em ampliação; para um alimento ausente,
        preencha a composição personalizada e sua origem.
      </p>
      <p className="hint" role="status">
        {results.length === 0
          ? "Nenhum alimento encontrado neste catálogo. Tente menos palavras ou outra preparação."
          : `Mostrando ${Math.min(limit, results.length)} de ${results.length} alimentos.`}
      </p>
      {results.slice(0, limit).map((food) => (
        <div className="catalog-row" key={food.code}>
          <span>
            {food.name}
            <small>
              {food.source} · {food.code}
            </small>
          </span>
          <button
            type="button"
            aria-label={`Incluir ${food.name}`}
            onClick={() => onAdd(structuredClone(food) as Food)}
          >
            Incluir
          </button>
        </div>
      ))}
      {results.length > limit && (
        <button
          type="button"
          className="secondary"
          onClick={() => setLimit(limit + 24)}
        >
          Mostrar mais alimentos
        </button>
      )}
    </details>
  );
}
