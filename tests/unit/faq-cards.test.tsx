import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

// Vitest globals are off, so unmount explicitly between tests.
afterEach(() => cleanup());

const ICONS = [
  { bg: "#eef9f9", fg: "#207d82", paths: ["M1 1h2", "M3 3h2"] },
  { bg: "#fef2f2", fg: "#dc2626", paths: ["M5 5h2"] },
];

const ITEMS = [
  { q: "First?", a: "Answer one." },
  { q: "Second?", a: "Answer two." },
  {
    q: "Third?",
    a: "Answer three.",
    source: ["Study title", "View the Research →", "Journal name"],
    links: [
      { text: "View the Research →", href: "https://example.org/one" },
      { text: "View the Research →", href: "https://example.org/two" },
      { text: "Read the Study →", href: "https://example.org/three" },
    ],
  },
];

async function load(mode: "single" | "multiple") {
  vi.resetModules();
  vi.doMock("@/components/shared/faq-config", () => ({ FAQ_MODE: mode }));
  const mod = await import("@/components/shared/FaqCards");
  return mod.FaqCards;
}

const panelOf = (button: HTMLElement) => {
  const id = button.getAttribute("aria-controls");
  expect(id).toBeTruthy();
  return document.getElementById(id as string) as HTMLElement;
};

describe("FaqCards toggling (single mode)", () => {
  it("starts collapsed and toggles with click", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const q1 = screen.getByRole("button", { name: /First\?/ });
    expect(q1).toHaveAttribute("type", "button");
    expect(q1).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(q1);
    expect(q1).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Answer one.")).toBeVisible();
    await userEvent.click(q1);
    expect(q1).toHaveAttribute("aria-expanded", "false");
  });

  it("aria-controls points at a role=region that is inert until opened", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const q1 = screen.getByRole("button", { name: /First\?/ });
    const panel = panelOf(q1);
    expect(panel).toHaveAttribute("role", "region");
    // Closed answers stay in the DOM (crawlers read them) but inert keeps their links out of tab order.
    expect(panel).toHaveAttribute("inert");
    expect(panel).toHaveTextContent("Answer one.");
    await userEvent.click(q1);
    expect(panel).not.toHaveAttribute("inert");
    expect(panel).toBeVisible();
    expect(panel).toHaveTextContent("Answer one.");
  });

  it("gives each region a stable, unique id", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const ids = screen
      .getAllByRole("button")
      .map((b) => b.getAttribute("aria-controls"));
    expect(new Set(ids).size).toBe(ITEMS.length);
  });

  it("closes the other item when a second opens", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const [q1, q2] = screen.getAllByRole("button");
    await userEvent.click(q1);
    await userEvent.click(q2);
    expect(q1).toHaveAttribute("aria-expanded", "false");
    expect(q2).toHaveAttribute("aria-expanded", "true");
    expect(panelOf(q1)).toHaveAttribute("inert");
    expect(panelOf(q2)).not.toHaveAttribute("inert");
  });

  it("is operable with the keyboard (Enter opens, Space closes)", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    await userEvent.tab();
    const first = screen.getAllByRole("button")[0];
    expect(first).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(first).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" ");
    expect(first).toHaveAttribute("aria-expanded", "false");
  });
});

describe("FaqCards (multiple mode)", () => {
  it("keeps several items open", async () => {
    const FaqCards = await load("multiple");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const [q1, q2] = screen.getAllByRole("button");
    await userEvent.click(q1);
    await userEvent.click(q2);
    expect(q1).toHaveAttribute("aria-expanded", "true");
    expect(q2).toHaveAttribute("aria-expanded", "true");
  });
});

describe("FaqCards accessibility", () => {
  it("labels every region by its question button", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    for (const button of screen.getAllByRole("button")) {
      const panel = panelOf(button);
      expect(button.id).toBeTruthy();
      expect(panel).toHaveAttribute("aria-labelledby", button.id);
    }
    await userEvent.click(screen.getByRole("button", { name: /Second\?/ }));
    expect(screen.getByRole("region", { name: "Second?" })).toHaveTextContent(
      "Answer two.",
    );
  });

  it("uses the question text as the accessible name; glyph and icons are aria-hidden", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const q1 = screen.getByRole("button", { name: "First?" });
    expect(q1).not.toHaveAttribute("aria-label");
    // The plus/minus is an SVG whose vertical bar collapses on open.
    const bar = q1.querySelector(".faq-plus-bar");
    expect(bar).not.toBeNull();
    for (const svg of q1.querySelectorAll("svg"))
      expect(svg).toHaveAttribute("aria-hidden", "true");
    await userEvent.click(q1);
    expect(q1.querySelector(".faq-plus-bar")).toHaveClass("scale-y-0");
    for (const svg of q1.querySelectorAll("svg"))
      expect(svg).toHaveAttribute("aria-hidden", "true");
  });
  it("marks each card for the colour fade and each icon for the open-state growth", async () => {
    const FaqCards = await load("single");
    const { container } = render(<FaqCards items={ITEMS} icons={ICONS} />);
    expect(container.querySelectorAll(".faq-card").length).toBe(ITEMS.length);
    expect(container.querySelectorAll(".faq-icon").length).toBe(ITEMS.length);
  });
});

describe("FaqCards icons", () => {
  it("renders the icon spec: background, foreground colour and every path", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    const [q1, q2] = screen.getAllByRole("button");
    const svg1 = q1.querySelector("svg") as SVGElement;
    expect((svg1.parentElement as HTMLElement).style.backgroundColor).toBe(
      "rgb(238, 249, 249)",
    );
    expect(svg1.style.color).toBe("rgb(32, 125, 130)");
    expect(
      [...svg1.querySelectorAll("path")].map((p) => p.getAttribute("d")),
    ).toEqual(["M1 1h2", "M3 3h2"]);
    const svg2 = q2.querySelector("svg") as SVGElement;
    expect((svg2.parentElement as HTMLElement).style.backgroundColor).toBe(
      "rgb(254, 242, 242)",
    );
    expect(
      [...svg2.querySelectorAll("path")].map((p) => p.getAttribute("d")),
    ).toEqual(["M5 5h2"]);
  });

  it("falls back to a default icon when icons[i] is missing", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={[ICONS[0]]} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(ITEMS.length);
    for (const b of buttons.slice(1)) {
      const svg = b.querySelector("svg") as SVGElement;
      expect(svg).toBeTruthy();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg.querySelectorAll("path").length).toBeGreaterThan(0);
    }
  });

  it("works with no icons prop at all", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} />);
    for (const b of screen.getAllByRole("button"))
      expect(b.querySelector("svg")).toBeTruthy();
  });
});

describe("FaqCards question colour", () => {
  it("defaults to the brand-dark token and accepts an override", async () => {
    const FaqCards = await load("single");
    const { unmount } = render(<FaqCards items={ITEMS} icons={ICONS} />);
    expect(screen.getByText("First?").getAttribute("style")).toContain(
      "--faq-question-color: var(--color-brand-dark)",
    );
    unmount();
    render(<FaqCards items={ITEMS} icons={ICONS} questionColor="#207d82" />);
    expect(screen.getByText("First?").getAttribute("style")).toContain(
      "--faq-question-color: #207d82",
    );
  });
});

describe("FaqCards answer links", () => {
  it("renders no link markup for items without links or source", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    await userEvent.click(screen.getByRole("button", { name: /First\?/ }));
    const panel = screen.getByRole("region", { name: "First?" });
    expect(within(panel).queryAllByRole("link", { hidden: true })).toHaveLength(
      0,
    );
    expect(panel.querySelector("a")).toBeNull();
    expect(panel.querySelectorAll("p")).toHaveLength(1);
  });

  it("renders real, labelled, safe links with no aria-label", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    await userEvent.click(screen.getByRole("button", { name: /Third\?/ }));
    const panel = screen.getByRole("region", { name: "Third?" });
    const single = within(panel).getByRole("link", {
      name: "Read the Study →",
    });
    expect(single.tagName).toBe("A");
    expect(single).toHaveAttribute("href", "https://example.org/three");
    expect(single).toHaveAttribute("target", "_blank");
    expect(single.getAttribute("rel")).toMatch(/noopener/);
    expect(single.getAttribute("rel")).toMatch(/noreferrer/);
    expect(single).not.toHaveAttribute("aria-label");
    expect(single).toHaveTextContent("Read the Study →");
    // no suffix when the label is unique
    expect(single.querySelector(".sr-only")).toBeNull();
  });

  it('adds an sr-only "(n of m)" suffix AFTER the label for same-label links', async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    await userEvent.click(screen.getByRole("button", { name: /Third\?/ }));
    const panel = screen.getByRole("region", { name: "Third?" });
    const same = within(panel).getAllByRole("link", {
      name: /View the Research/,
    });
    expect(same).toHaveLength(2);
    expect(same.map((l) => l.getAttribute("href"))).toEqual([
      "https://example.org/one",
      "https://example.org/two",
    ]);
    same.forEach((link, n) => {
      const label = link.firstChild as ChildNode;
      expect(label.nodeType).toBe(Node.TEXT_NODE);
      expect(label.textContent).toBe("View the Research →");
      const hint = link.querySelector(".sr-only") as HTMLElement;
      expect(hint).toBeTruthy();
      expect(hint.textContent).toBe(` (${n + 1} of 2)`);
      expect(link.lastChild).toBe(hint);
      expect(link).not.toHaveAttribute("aria-label");
    });
    const names = within(panel)
      .getAllByRole("link")
      .map((l) => l.textContent);
    expect(new Set(names).size).toBe(names.length);
  });

  it("shows source lines as plain text and does not repeat a source line that is a link label", async () => {
    const FaqCards = await load("single");
    render(<FaqCards items={ITEMS} icons={ICONS} />);
    await userEvent.click(screen.getByRole("button", { name: /Third\?/ }));
    const panel = screen.getByRole("region", { name: "Third?" });
    expect(within(panel).getByText("Study title")).toBeVisible();
    expect(within(panel).getByText("Journal name")).toBeVisible();
    // 'View the Research →' appears only as the two links, not also as plain text lines
    expect(panel.textContent?.match(/View the Research →/g)).toHaveLength(2);
  });
});
