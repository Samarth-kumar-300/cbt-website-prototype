import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useGuardedSubmit,
  validateFields,
  type Field,
} from "@/lib/contact-form";

const FIELDS: Field[] = [
  { name: "name", label: "Name", type: "text", required: true, maxLength: 80 },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "topic", label: "Topic", type: "select", required: true },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: false,
    maxLength: 2000,
  },
];
const OK = {
  name: "Asha",
  email: "asha@example.com",
  topic: "Schools",
  message: "Hello",
};

describe("validateFields", () => {
  it("accepts valid input", () => {
    expect(validateFields(OK, FIELDS)).toEqual({});
  });
  it("flags empty required fields", () => {
    const e = validateFields(
      { name: "", email: "", topic: "", message: "" },
      FIELDS,
    );
    expect(Object.keys(e).sort()).toEqual(["email", "name", "topic"]);
  });
  it("treats whitespace-only as empty", () => {
    expect(validateFields({ ...OK, name: "   " }, FIELDS).name).toBeDefined();
  });
  it("rejects malformed email", () => {
    ["nope", "a@b", "a b@c.com", "@x.com"].forEach((email) =>
      expect(validateFields({ ...OK, email }, FIELDS).email).toBeDefined(),
    );
  });
  it("enforces maxLength", () => {
    expect(
      validateFields({ ...OK, message: "x".repeat(2001) }, FIELDS).message,
    ).toBeDefined();
    expect(
      validateFields({ ...OK, message: "x".repeat(2000) }, FIELDS).message,
    ).toBeUndefined();
  });
  it("does not require optional fields", () => {
    expect(validateFields({ ...OK, message: "" }, FIELDS)).toEqual({});
  });
});

describe("useGuardedSubmit", () => {
  it("ignores a second submit while the first is in flight", async () => {
    let release!: () => void;
    const fn = vi.fn(() => new Promise<void>((r) => (release = r)));
    const { result } = renderHook(() => useGuardedSubmit(fn));
    let first!: Promise<boolean>, second!: Promise<boolean>;
    await act(async () => {
      first = result.current.run({ a: 1 });
      second = result.current.run({ a: 1 });
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.submitting).toBe(true);
    await act(async () => {
      release();
      await first;
    });
    expect(await second).toBe(false);
    expect(result.current.submitting).toBe(false);
  });
});
