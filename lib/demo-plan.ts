export type Plan = 'basic' | 'custom';

/** Reads the `plan` query value. Only the exact strings `basic` and `custom` count; a repeated parameter uses its first value. */
export function parsePlan(value: string | string[] | null | undefined): Plan | null {
  const v = Array.isArray(value) ? value[0] : value;
  return v === 'basic' || v === 'custom' ? v : null;
}
