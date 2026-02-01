/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const STORAGE_KEY = "renfe-ds-state";

const initialState = {
  search: {
    origin: "",
    destination: "",
    departDate: "",
    returnDate: "",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    tripType: "oneWay",
  },
  selectedJourneyId: null,
  selectedJourney: null,
  selectedReturnJourneyId: null,
  selectedReturnJourney: null,
  selectedFareId: null,
  extrasByJourney: {},
  travelers: [],
  paymentError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: { ...state.search, ...action.payload } };
    case "SET_JOURNEY":
      if (typeof action.payload === "string") {
        return { ...state, selectedJourneyId: action.payload, selectedJourney: null };
      }
      return {
        ...state,
        selectedJourneyId: action.payload?.id ?? null,
        selectedJourney: action.payload ?? null,
      };
    case "SET_RETURN_JOURNEY":
      if (typeof action.payload === "string") {
        return { ...state, selectedReturnJourneyId: action.payload, selectedReturnJourney: null };
      }
      return {
        ...state,
        selectedReturnJourneyId: action.payload?.id ?? null,
        selectedReturnJourney: action.payload ?? null,
      };
    case "SET_FARE":
      return { ...state, selectedFareId: action.payload };
    case "TOGGLE_EXTRA": {
      // Determine current journey key (outbound or return)
      const journeyKey = state.selectedJourneyId || "none";
      const returnKey = state.selectedReturnJourneyId || null;
      let newExtrasByJourney = { ...state.extrasByJourney };
      // Outbound
      if (!returnKey) {
        const prev = newExtrasByJourney[journeyKey] || {};
        newExtrasByJourney[journeyKey] = {
          ...prev,
          [action.payload]: !prev[action.payload],
        };
      } else {
        // Round trip: store as {outboundId|returnId: {extras}}
        const comboKey = `${journeyKey}|${returnKey}`;
        const prev = newExtrasByJourney[comboKey] || {};
        newExtrasByJourney[comboKey] = {
          ...prev,
          [action.payload]: !prev[action.payload],
        };
      }
      return {
        ...state,
        extrasByJourney: newExtrasByJourney,
      };
    }
    case "CLEAR_EXTRAS":
      return { ...state, extrasByJourney: {} };
    case "SET_PAYMENT_ERROR":
      return { ...state, paymentError: action.payload };
    case "CLEAR_PAYMENT_ERROR":
      return { ...state, paymentError: null };
    case "SET_TRAVELER": {
      const { index, fields, type } = action.payload;
      const next = [...(state.travelers || [])];
      next[index] = { type, fields };
      return { ...state, travelers: next };
    }
    default:
      return state;
  }
}

const TravelContext = createContext(null);

export function TravelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (base) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return base;
    try {
      return { ...base, ...JSON.parse(stored) };
    } catch {
      return base;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const ctx = useContext(TravelContext);
  if (!ctx) {
    throw new Error("useTravel must be used within TravelProvider");
  }
  return ctx;
}
