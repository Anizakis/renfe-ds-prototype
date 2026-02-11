export const getCheckoutSteps = (t) => [
  { id: "results", label: t("stepper.results") },
  { id: "fares", label: t("stepper.fares") },
  { id: "travelers", label: t("stepper.travelers") },
  { id: "extras", label: t("stepper.extras") },
  { id: "payment", label: t("stepper.payment") },
];
