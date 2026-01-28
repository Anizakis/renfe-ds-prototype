import { fares, journeys, extras } from "../data/mockData.js";

export function getSelectedJourney(state) {
  return journeys.find((journey) => journey.id === state.selectedJourneyId) ?? null;
}

export function getSelectedFare(state) {
  return fares.find((fare) => fare.id === state.selectedFareId) ?? fares[0];
}

export function getSelectedExtras(state) {
  return extras.filter((extra) => state.extras[extra.id]);
}

export function getTotalPrice(state) {
  const journey = getSelectedJourney(state);
  const fare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const base = journey?.price ?? 0;
  const fareAdd = fare?.price ?? 0;
  return {
    base,
    fare: fareAdd,
    extras: extrasTotal,
    total: base + fareAdd + extrasTotal,
  };
}
