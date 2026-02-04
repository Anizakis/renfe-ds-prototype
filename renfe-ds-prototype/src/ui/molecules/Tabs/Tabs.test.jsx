import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Tabs from "./Tabs.jsx";

const tabs = [
  { id: "one", label: "One", content: "Panel One" },
  { id: "two", label: "Two", content: "Panel Two" },
];

describe("Tabs", () => {
  it("moves focus with arrow keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} onChange={onChange} label="Example tabs" />);

    const tabOne = screen.getByRole("tab", { name: "One" });
    tabOne.focus();
    await user.keyboard("{ArrowRight}");

    const tabTwo = screen.getByRole("tab", { name: "Two" });
    expect(tabTwo).toHaveFocus();
  });
});
