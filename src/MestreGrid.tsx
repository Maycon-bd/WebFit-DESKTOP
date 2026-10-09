import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, PointerEvent, DragEvent, KeyboardEvent } from "react";

export interface MestreGridColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number | null | undefined;
  sortable?: boolean;
  minWidth?: number;
  align?: "left" | "center" | "right";
}

export function sortGridRows<T>(
  rows: readonly T[],
  column: MestreGridColumn<T>,
  direction: "ascending" | "descending",
) {
  const collator = new Intl.Collator("pt-BR", {
    numeric: true,
    sensitivity: "base",
  });
  const sign = direction === "ascending" ? 1 : -1;

  return [...rows].sort((left, right) => {
    const leftValue = column.sortValue
      ? column.sortValue(left)
      : (left as Record<string, unknown>)[column.key];
    const rightValue = column.sortValue
      ? column.sortValue(right)
      : (right as Record<string, unknown>)[column.key];
    if (leftValue === rightValue) return 0;
    if (leftValue === null || leftValue === undefined || leftValue === "")
      return 1 * sign;
    if (rightValue === null || rightValue === undefined || rightValue === "")
      return -1 * sign;
    if (typeof leftValue === "number" && typeof rightValue === "number")
      return (leftValue - rightValue) * sign;
    return collator.compare(String(leftValue), String(rightValue)) * sign;
  });
}

/** Grid padrão do Desktop: tabela acessível, ordenação, paginação e ajuste de colunas. */
export function MestreGrid<T>({
  label,
  columns,
  rows,
  rowKey,
  footer,
  pageSize = 25,
  emptyMessage = "Nenhum registro encontrado.",
}: {
  label: string;
  columns: readonly MestreGridColumn<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string | number;
  footer?: ReactNode;
  pageSize?: number;
  emptyMessage?: string;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((column) => column.key),
  );
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const columnKeys = columns.map((column) => column.key).join("\u0000");
  const resizing = useRef<{
    key: string;
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);

  useEffect(() => {
    setColumnOrder((current) => {
      const keys = columns.map((column) => column.key);
      const retained = current.filter((key) => keys.includes(key));
      const next = [
        ...retained,
        ...keys.filter((key) => !retained.includes(key)),
      ];
      return next.length === current.length &&
        next.every((key, index) => key === current[index])
        ? current
        : next;
    });
  }, [columnKeys]);

  useEffect(() => setPage(1), [rows]);

  const orderedColumns = useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    return columnOrder
      .map((key) => byKey.get(key))
      .filter((column): column is MestreGridColumn<T> => Boolean(column));
  }, [columnOrder, columns]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return [...rows];
    const column = columns.find((candidate) => candidate.key === sortKey);
    return column ? sortGridRows(rows, column, sortDirection) : [...rows];
  }, [columns, rows, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = sortedRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function moveColumn(key: string, offset: number) {
    setColumnOrder((current) => {
      const from = current.indexOf(key);
      const to = from + offset;
      if (from < 0 || to < 0 || to >= current.length) return current;
      const next = [...current];
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });
  }

  function dropColumn(event: DragEvent<HTMLTableCellElement>, key: string) {
    event.preventDefault();
    const source = draggedColumn;
    setDraggedColumn(null);
    if (!source || source === key) return;
    setColumnOrder((current) => {
      const next = [...current];
      const from = next.indexOf(source);
      const to = next.indexOf(key);
      if (from < 0 || to < 0) return current;
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });
  }

  function startResize(event: PointerEvent<HTMLSpanElement>, key: string) {
    event.preventDefault();
    event.stopPropagation();
    const header = event.currentTarget.closest("th");
    if (!header) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    resizing.current = {
      key,
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: header.getBoundingClientRect().width,
    };
  }

  function resizeColumn(event: PointerEvent<HTMLSpanElement>, key: string) {
    const active = resizing.current;
    if (!active || active.key !== key || active.pointerId !== event.pointerId)
      return;
    setColumnWidths((current) => ({
      ...current,
      [key]: Math.max(
        80,
        Math.round(active.startWidth + event.clientX - active.startX),
      ),
    }));
  }

  function stopResize(event: PointerEvent<HTMLSpanElement>) {
    const active = resizing.current;
    if (active?.pointerId === event.pointerId) {
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
      resizing.current = null;
    }
  }

  function handleResizeKeyDown(
    event: KeyboardEvent<HTMLSpanElement>,
    key: string,
    minWidth: number,
  ) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentWidth = columnWidths[key] ?? minWidth;
    const adjustment = event.key === "ArrowRight" ? 16 : -16;
    setColumnWidths((current) => ({
      ...current,
      [key]: Math.max(80, currentWidth + adjustment),
    }));
  }

  return (
    <section className="mestre-grid" aria-label={label}>
      <div className="table-wrap" role="region" aria-label={label} tabIndex={0}>
        <table>
          <caption className="visually-hidden">{label}</caption>
          <thead>
            <tr>
              {orderedColumns.map((column) => {
                const isSorted = sortKey === column.key;
                const sortable = column.sortable !== false;
                const minWidth = column.minWidth ?? 100;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    draggable
                    aria-sort={isSorted ? sortDirection : undefined}
                    style={{
                      width: columnWidths[column.key],
                      minWidth: column.minWidth,
                      textAlign: column.align,
                    }}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      setDraggedColumn(column.key);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => dropColumn(event, column.key)}
                    onDragEnd={() => setDraggedColumn(null)}
                    className={draggedColumn === column.key ? "is-dragged" : ""}
                  >
                    <div className="mestre-grid-heading">
                      {sortable ? (
                        <button
                          type="button"
                          className="mestre-grid-sort"
                          onClick={() => {
                            setSortDirection((current) =>
                              isSorted && current === "ascending"
                                ? "descending"
                                : "ascending",
                            );
                            setSortKey(column.key);
                            setPage(1);
                          }}
                        >
                          {column.label}
                          <span aria-hidden="true">
                            {isSorted
                              ? sortDirection === "ascending"
                                ? " ↑"
                                : " ↓"
                              : " ↕"}
                          </span>
                        </button>
                      ) : (
                        column.label
                      )}
                      <span
                        className="mestre-grid-resizer"
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Ajustar largura de ${column.label}`}
                        aria-valuemin={80}
                        aria-valuenow={columnWidths[column.key] ?? minWidth}
                        tabIndex={0}
                        onPointerDown={(event) =>
                          startResize(event, column.key)
                        }
                        onPointerMove={(event) =>
                          resizeColumn(event, column.key)
                        }
                        onPointerUp={stopResize}
                        onPointerCancel={stopResize}
                        onKeyDown={(event) =>
                          handleResizeKeyDown(event, column.key, minWidth)
                        }
                        onClick={(event) => event.stopPropagation()}
                        onDragStart={(event) => event.preventDefault()}
                      />
                      <span className="mestre-grid-reorder-tools">
                        <button
                          type="button"
                          aria-label={`Mover ${column.label} para a esquerda`}
                          disabled={columnOrder[0] === column.key}
                          onClick={() => moveColumn(column.key, -1)}
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label={`Mover ${column.label} para a direita`}
                          disabled={columnOrder.at(-1) === column.key}
                          onClick={() => moveColumn(column.key, 1)}
                        >
                          ›
                        </button>
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length ? (
              visibleRows.map((row) => (
                <tr key={rowKey(row)}>
                  {orderedColumns.map((column) => (
                    <td key={column.key} style={{ textAlign: column.align }}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Math.max(1, orderedColumns.length)}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(totalPages > 1 || footer) && (
        <footer className="mestre-grid-footer">
          <span>
            Total: <strong>{rows.length}</strong> registros
          </span>
          {footer}
          {totalPages > 1 && (
            <nav aria-label={`Paginação de ${label}`}>
              <button
                type="button"
                aria-label="Página anterior"
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
              >
                Anterior
              </button>
              <span>
                Página {safePage} de {totalPages}
              </span>
              <button
                type="button"
                aria-label="Próxima página"
                disabled={safePage === totalPages}
                onClick={() => setPage(safePage + 1)}
              >
                Próxima
              </button>
            </nav>
          )}
        </footer>
      )}
    </section>
  );
}
