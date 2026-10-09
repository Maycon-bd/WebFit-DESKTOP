import type { InputHTMLAttributes } from "react";

/** Controlled search input; each caller owns filtering and result completeness. */
export function SearchInput(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  return <input {...props} type="search" />;
}
