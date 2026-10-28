import { useCallback, useRef, useState } from "react";

export type FieldType = "text" | "email" | "tel" | "select" | "textarea";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  maxLength?: number;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateFields(
  values: Record<string, string>,
  fields: readonly Field[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = (values[f.name] ?? "").trim();
    if (f.required && !v) {
      errors[f.name] = `${f.label} is required`;
      continue;
    }
    if (!v) continue;
    if (f.type === "email" && !EMAIL.test(v))
      errors[f.name] = "Enter a valid email address";
    else if (f.maxLength && (values[f.name] ?? "").length > f.maxLength)
      errors[f.name] = `${f.label} must be ${f.maxLength} characters or fewer`;
  }
  return errors;
}

export function useGuardedSubmit<T>(fn: (v: T) => Promise<void>) {
  const busy = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const run = useCallback(
    async (v: T) => {
      if (busy.current) return false;
      busy.current = true;
      setSubmitting(true);
      try {
        await fn(v);
        return true;
      } finally {
        busy.current = false;
        setSubmitting(false);
      }
    },
    [fn],
  );
  return { submitting, run };
}
