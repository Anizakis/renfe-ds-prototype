import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Modal from "./Modal.jsx";

vi.mock("./useFocusTrap.js", () => ({
  default: () => {},
}));

describe("Modal", () => {
  it("renders dialog when open", () => {
    render(
      <Modal isOpen titleId="modal-title" descriptionId="modal-desc" onClose={() => {}}>
        <h2 id="modal-title">Title</h2>
        <p id="modal-desc">Description</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
