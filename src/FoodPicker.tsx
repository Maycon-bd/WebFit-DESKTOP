import { useEffect, useRef, useState } from "react";
import type { Food } from "./api";
import { loadFoodCatalog } from "./food-catalog";
import type { OfficialFood } from "./food-catalog";
import { searchFoods } from "./food-search";
import { FormField } from "./FormField";
import { SearchInput } from "./SearchInput";
export function FoodPicker({ onAdd }: { onAdd: (food: Food) => void }) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(24);
  const [foods, setFoods] = useState<readonly OfficialFood[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function load() {
    if (loading || foods) return;
    setLoading(true);
    setError(false);
    try {
      const data = await loadFoodCatalog();
      if (alive.current) setFoods(data);
    } catch {
      if (alive.current) setError(true);
    } finally {
      if (alive.current) setLoading(false);
    }
  }
  const results = searchFoods(foods ?? [], query);
  return (
    <details
      className="food-picker"
      onToggle={(e) => {
        if (e.currentTarget.open) void load();
      }}
    >
      <summary>Buscar alimento nas tabelas oficiais</summary>
      {loading && <p role="status">Carregando catálogo offline…</p>}
      {error && (
        <div role="alert">
          <p>
            Não foi possível carregar o catálogo offline. Tente novamente; se
            persistir, reinstale a versão do aplicativo.
          </p>
          <button type="button" onClick={() => void load()}>
            Tentar carregar novamente
          </button>
        </div>
      )}
      <FormField label="Pesquisar alimento, preparação ou código">
        <SearchInput
          value={query}
          disabled={!foods}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(24);
          }}
          placeholder="Ex.: arroz cozido ou BRC0208A"
        />
      </FormField>
      <p className="hint">
        {foods
          ? `${foods.length} registros oficiais offline, incluindo itens com restrição indicada abaixo.`
          : "Catálogo TBCA 7.3 e fallback TACO."}{" "}
        Confira a preparação antes de incluir. Para um alimento ausente,
        preencha a composição personalizada e sua origem.
      </p>
      <p className="hint" role="status">
        {!foods
          ? ""
          : results.length === 0
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
            {food.compositionIssues?.length ? (
              <small>
                Composição conflitante na fonte. Inclusão indisponível.
              </small>
            ) : null}
          </span>
          <button
            type="button"
            disabled={Boolean(food.compositionIssues?.length)}
            aria-label={`Incluir ${food.name}`}
            onClick={() => onAdd(structuredClone(food))}
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
