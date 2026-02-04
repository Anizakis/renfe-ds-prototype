import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StickySummaryBar from "./StickySummaryBar.jsx";
import { TravelProvider } from "../../../app/store.jsx";

const Wrapper = ({ children }) => (
  <TravelProvider>
    {children}
  </TravelProvider>
);

describe("StickySummaryBar", () => {
  it("renders summary toggle", () => {
    render(
      <StickySummaryBar
        journey={{
          date: "2026-02-01",
          origin: "Madrid",
          destination: "Valencia",
          departTime: "08:00",
          arriveTime: "10:00",
          service: "AVE",
        }}
        returnJourney={null}
        total={120}
        breakdownItems={[]}
        canContinue={true}
        onContinue={() => {}}
        onViewDetails={() => {}}
        t={(key) => key}
      />,
      { wrapper: Wrapper }
    );

    expect(screen.getByRole("button", { name: "Sumario del viaje" })).toBeInTheDocument();
  });
});
