import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import axe from "axe-core";
import Tabs from "./Tabs.jsx";

const tabs = [
  { id: "one", label: "One", content: "Panel One" },
  { id: "two", label: "Two", content: "Panel Two" },
];

describe("Tabs a11y", () => {
  it("has no obvious a11y violations", async () => {
    const { container } = render(<Tabs tabs={tabs} label="Example tabs" />);
    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    expect(results.violations.length).toBe(0);
  });
});
