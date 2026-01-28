import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "renfe-ds-lang";

const STRINGS = {
  es: {
    appName: "Renfe",
    nav: {
      home: "Inicio",
      search: "Buscar",
      help: "Ayuda",
      access: "Accede",
      menu: "Menú",
      login: "Entrar",
      results: "Resultados",
      fares: "Tarifas",
      extras: "Extras",
      payment: "Pago",
    },
    common: {
      continue: "Continuar",
      back: "Volver",
      retry: "Reintentar",
      change: "Cambiar",
      accept: "Aceptar",
      loading: "Cargando",
      optional: "(opcional)",
      skipToContent: "Saltar al contenido",
      language: "Idioma",
    },
    home: {
      title: "Buscar viaje",
      origin: "Origen",
      destination: "Destino",
      dates: "Fechas",
      departDate: "Ida",
      returnDate: "Vuelta",
      passengers: "Pasajeros",
      search: "Buscar",
      swap: "Intercambiar",
      errors: {
        originRequired: "Indica un origen",
        destinationRequired: "Indica un destino",
        stationInvalid: "Selecciona una estación válida de la lista.",
      },
    },
    login: {
      title: "Entrar o crear cuenta",
      email: "Email",
      password: "Contraseña",
      submit: "Acceder",
    },
    results: {
      title: "Resultados",
      filters: "Filtros",
      journeys: "Trenes disponibles",
      select: "Seleccionar",
      selected: "Seleccionado",
      filterTime: "Horarios",
      filterPrice: "Precio",
      filterServices: "Servicios",
    },
    fares: {
      title: "Tarifas",
      compare: "Comparar tarifas",
      select: "Elegir tarifa",
      tableFare: "Tarifa",
      tableConditions: "Condiciones",
      tablePrice: "Precio",
      tableAction: "Acción",
    },
    extras: {
      title: "Extras",
      select: "Añadir extras",
      added: "Añadido",
    },
    payment: {
      title: "Pago",
      pay: "Confirmar pago",
      errorTitle: "No se pudo completar el pago",
      errorBody: "Ha ocurrido un error temporal. Puedes reintentar o volver atrás sin perder tu selección.",
      name: "Nombre",
      cardNumber: "Número de tarjeta",
      expiry: "Caducidad",
      cvv: "CVV",
      changeBody: "Cambia el método de pago sin perder tu selección.",
      accept: "Aceptar",
    },
    summary: {
      title: "Resumen",
      journey: "Trayecto",
      fare: "Tarifa",
      extras: "Extras",
      total: "Total",
      priceUpdated: "Precio actualizado",
    },
    stepper: {
      results: "Resultados",
      fares: "Tarifas",
      extras: "Extras",
      payment: "Pago",
    },
    tabs: {
      sevenDays: "7 días",
    },
    drawer: {
      menuTitle: "Menú",
      navigation: "Navegación",
      searchLabel: "Buscar",
      searchPlaceholder: "Buscar",
      cercanias: "Cercanías",
      viaja: "Viaja",
      inspira: "Inspírate",
      manageTicket: "Gestiona tu billete",
      moreRenfe: "Más Renfe",
      help: "Ayuda y contacto",
      access: "Acceso",
      settings: "Ajustes",
      language: "Idioma",
      cookies: "Galletas",
      cookiesMvp: "Gestión de cookies (MVP)",
      darkMode: "Modo oscuro",
      modeOn: "Modo oscuro activado",
      modeOff: "Modo oscuro desactivado",
    },
  },
  en: {
    appName: "Renfe",
    nav: {
      home: "Home",
      search: "Search",
      help: "Help",
      access: "Sign in",
      menu: "Menu",
      login: "Sign in",
      results: "Results",
      fares: "Fares",
      extras: "Extras",
      payment: "Payment",
    },
    common: {
      continue: "Continue",
      back: "Back",
      retry: "Retry",
      change: "Change",
      accept: "Accept",
      loading: "Loading",
      optional: "(optional)",
      skipToContent: "Skip to content",
      language: "Language",
    },
    home: {
      title: "Search trip",
      origin: "Origin",
      destination: "Destination",
      dates: "Dates",
      departDate: "Departure",
      returnDate: "Return",
      passengers: "Passengers",
      search: "Search",
      swap: "Swap",
      errors: {
        originRequired: "Enter an origin",
        destinationRequired: "Enter a destination",
        stationInvalid: "Select a valid station from the list.",
      },
    },
    login: {
      title: "Sign in or create account",
      email: "Email",
      password: "Password",
      submit: "Sign in",
    },
    results: {
      title: "Results",
      filters: "Filters",
      journeys: "Available trains",
      select: "Select",
      selected: "Selected",
      filterTime: "Times",
      filterPrice: "Price",
      filterServices: "Services",
    },
    fares: {
      title: "Fares",
      compare: "Compare fares",
      select: "Select fare",
      tableFare: "Fare",
      tableConditions: "Conditions",
      tablePrice: "Price",
      tableAction: "Action",
    },
    extras: {
      title: "Extras",
      select: "Add extras",
      added: "Added",
    },
    payment: {
      title: "Payment",
      pay: "Confirm payment",
      errorTitle: "Payment could not be completed",
      errorBody: "A temporary error occurred. You can retry or go back without losing your selection.",
      name: "Name",
      cardNumber: "Card number",
      expiry: "Expiry",
      cvv: "CVV",
      changeBody: "Change the payment method without losing your selection.",
      accept: "Accept",
    },
    summary: {
      title: "Summary",
      journey: "Journey",
      fare: "Fare",
      extras: "Extras",
      total: "Total",
      priceUpdated: "Price updated",
    },
    stepper: {
      results: "Results",
      fares: "Fares",
      extras: "Extras",
      payment: "Payment",
    },
    tabs: {
      sevenDays: "7 days",
    },
    drawer: {
      menuTitle: "Menu",
      navigation: "Navigation",
      searchLabel: "Search",
      searchPlaceholder: "Search",
      cercanias: "Cercanías",
      viaja: "Travel",
      inspira: "Get inspired",
      manageTicket: "Manage your ticket",
      moreRenfe: "More Renfe",
      help: "Help and contact",
      access: "Access",
      settings: "Settings",
      language: "Language",
      cookies: "Cookies",
      cookiesMvp: "Cookie management (MVP)",
      darkMode: "Dark mode",
      modeOn: "Dark mode enabled",
      modeOff: "Dark mode disabled",
    },
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && STRINGS[stored] ? stored : "es";
  });

  const setLang = useCallback((lang) => {
    if (!STRINGS[lang]) return;
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key) => {
      const parts = key.split(".");
      let current = STRINGS[language];
      for (const part of parts) {
        current = current?.[part];
      }
      return current ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage: setLang, t }),
    [language, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
