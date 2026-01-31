import { fares, extras } from "../data/mockData.js";

export function getSelectedJourney(state) {
  return state.selectedJourney ?? null;
}

export function getSelectedReturnJourney(state) {
  return state.selectedReturnJourney ?? null;
}

export function getPassengersTotal(state) {
  const passengers = state.search?.passengers;
  if (!passengers) return 1;
  if (typeof passengers === "number") return passengers;
  return (passengers.adults ?? 0) + (passengers.children ?? 0) + (passengers.infants ?? 0);
}

export function getSelectedFare(state) {
  return fares.find((fare) => fare.id === state.selectedFareId) ?? fares[0];
}

export function getSelectedExtras(state) {
  // Determine current journey key (outbound or round trip combo)
  const journeyKey = state.selectedJourneyId || "none";
  const returnKey = state.selectedReturnJourneyId || null;
  let selected = {};
  if (!returnKey) {
    selected = state.extrasByJourney?.[journeyKey] || {};
  } else {
    const comboKey = `${journeyKey}|${returnKey}`;
    selected = state.extrasByJourney?.[comboKey] || {};
  }
  return extras.filter((extra) => selected[extra.id]);
}

export function getTotalPrice(state) {
  const journey = getSelectedJourney(state);
  const returnJourney = getSelectedReturnJourney(state);
  const fare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const passengersTotal = getPassengersTotal(state);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const base = (journey?.price ?? 0) + ((state.search?.tripType === "roundTrip" ? returnJourney?.price : 0) ?? 0);
  const fareAdd = fare?.price ?? 0;
  const perPassenger = base + fareAdd + extrasTotal;
  return {
    base,
    fare: fareAdd,
    extras: extrasTotal,
    total: perPassenger * passengersTotal,
  };
}
