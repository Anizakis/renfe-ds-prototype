import { describe, it, expect } from "vitest";
import { getTotalPrice } from "./pricing.js";

const baseState = {
  search: {
    tripType: "oneWay",
    passengers: { adults: 1, children: 0, infants: 0 },
  },
  selectedJourneyId: null,
  selectedJourney: { price: 50 },
  selectedReturnJourneyId: null,
  selectedReturnJourney: null,
  selectedFareId: "basic",
  extrasByJourney: {},
};

describe("pricing", () => {
  it("calculates total price for one-way", () => {
    const totals = getTotalPrice(baseState);
    expect(totals.base).toBe(50);
    expect(totals.total).toBe(50);
  });
});
