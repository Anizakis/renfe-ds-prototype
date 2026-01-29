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
  selectedFareId: null,
  extras: {},
  paymentError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: { ...state.search, ...action.payload } };
    case "SET_JOURNEY":
      return { ...state, selectedJourneyId: action.payload };
    case "SET_FARE":
      return { ...state, selectedFareId: action.payload };
    case "TOGGLE_EXTRA":
      return {
        ...state,
        extras: {
          ...state.extras,
          [action.payload]: !state.extras[action.payload],
        },
      };
    case "CLEAR_EXTRAS":
      return { ...state, extras: {} };
    case "SET_PAYMENT_ERROR":
      return { ...state, paymentError: action.payload };
    case "CLEAR_PAYMENT_ERROR":
      return { ...state, paymentError: null };
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
