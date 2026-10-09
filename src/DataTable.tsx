import type { ReactNode } from "react";

export interface DataColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
}

/** Presentation only: callers own fetching, paging, errors and row actions. */
export function DataTable<T>({
  label,
  columns,
  rows,
  rowKey,
  footer,
}: {
  label: string;
  columns: readonly DataColumn<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string | number;
  footer?: ReactNode;
}) {
  return (
    <div className="table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table>
        <caption className="visually-hidden">{label}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer}
    </div>
  );
}
