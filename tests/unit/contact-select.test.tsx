import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "@/components/pages/contact-us/Select";

const OPTIONS = ["Parent", "Therapist", "School"];

function setup(onChange = vi.fn()) {
  render(
    <Select
      id="topic"
      label="Topic"
      placeholder="Choose one"
      options={OPTIONS}
      value=""
      onChange={onChange}
    />,
  );
  return onChange;
}

describe("Select", () => {
  it("opens on click and picks an option with the mouse", async () => {
    const onChange = setup();
    await userEvent.click(screen.getByRole("button", { name: /choose one/i }));
    await userEvent.click(screen.getByRole("option", { name: "Therapist" }));
    expect(onChange).toHaveBeenCalledWith("Therapist");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("works with the keyboard: Enter opens, ArrowDown moves, Enter selects", async () => {
    const onChange = setup();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("Therapist");
  });
  it("Escape closes without changing the value", async () => {
    const onChange = setup();
    await userEvent.click(screen.getByRole("button", { name: /choose one/i }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
  it("shows the error and marks the button invalid", () => {
    render(
      <Select
        id="t"
        label="Topic"
        placeholder="Choose one"
        options={OPTIONS}
        value=""
        onChange={() => {}}
        error="Topic is required"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Topic is required");
    expect(screen.getByRole("button", { name: /choose one/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
