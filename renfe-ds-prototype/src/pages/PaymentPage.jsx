import { useRef, useState } from "react";
import { useTravel } from "../app/store.jsx";
import {
  getPassengersTotal,
  getSelectedExtras,
  getSelectedFare,
  getSelectedJourney,
  getSelectedReturnJourney,
  getTotalPrice,
} from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import { formatPrice } from "../app/utils.js";
import { getBreakdownItems } from "../app/breakdown.js";
import PaymentTemplate from "../ui/templates/PaymentTemplate.jsx";

export default function PaymentPage() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const totals = getTotalPrice(state);
  const journey = getSelectedJourney(state);
  const returnJourney = getSelectedReturnJourney(state);
  const selectedFare = getSelectedFare(state);
  const selectedExtras = getSelectedExtras(state);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef(null);

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const passengersTotal = getPassengersTotal(state);
  const isRoundTrip = state.search?.tripType === "roundTrip";
  const baseOrigin = state.search?.origin || "—";
  const baseDestination = state.search?.destination || "—";
  const fareName = selectedFare?.nameKey ? t(selectedFare.nameKey) : selectedFare?.name;
  const extrasNames = selectedExtras.map((extra) => (extra.nameKey ? t(extra.nameKey) : extra.name));

  const formatTripDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    const locale = typeof document !== "undefined"
      ? (document.documentElement.lang || "es-ES")
      : "es-ES";
    const formatted = date.toLocaleDateString(locale, {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const cleaned = formatted.replace(",", "").replace(/\s+de\s+/g, " ");
    return cleaned
      .split(" ")
      .map((part) => part ? part[0].toUpperCase() + part.slice(1) : part)
      .join(" ");
  };

  const formatTripSummary = (trip, fallbackDate, fallbackOrigin, fallbackDestination) => {
    const dateLabel = formatTripDate(trip?.date ?? fallbackDate);
    const origin = trip?.origin ?? fallbackOrigin;
    const destination = trip?.destination ?? fallbackDestination;
    const timeLabel = trip
      ? `${trip.departTime}-${trip.arriveTime} · ${trip.service}`
      : t("summary.noTrainSelected");
    return `${dateLabel} · ${origin} → ${destination} · ${timeLabel}`;
  };

  const breakdownItems = getBreakdownItems({
    t,
    baseTotal: totals.base,
    farePrice: totals.fare,
    extrasTotal: totals.extras,
    passengersTotal,
  });
  const monetaryBreakdownItems = breakdownItems.filter((item) => (
    item.label !== t("summary.passengers")
    && item.label !== t("summary.fare")
    && item.label !== t("summary.extras")
  ));

  const detailItems = [
    {
      key: "outbound-trip",
      label: t("summary.outboundTrip"),
      value: formatTripDate(journey?.date ?? state.search?.departDate),
      description: formatTripSummary(journey, state.search?.departDate, baseOrigin, baseDestination),
      icon: "train",
    },
  ];

  if (isRoundTrip) {
    detailItems.push({
      key: "return-trip",
      label: t("summary.returnTrip"),
      value: formatTripDate(returnJourney?.date ?? state.search?.returnDate),
      description: formatTripSummary(returnJourney, state.search?.returnDate, baseDestination, baseOrigin),
      icon: "route",
    });
  }

  detailItems.push(
    {
      key: "fare-name",
      label: t("summary.fare"),
      value: selectedFare ? fareName : t("summary.noFare"),
      description: totals.fare > 0 ? `+${formatPrice(totals.fare)}` : null,
      icon: "confirmation_number",
    },
    {
      key: "extras-names",
      label: t("summary.extras"),
      value: extrasNames.length > 0 ? extrasNames.join(", ") : t("summary.noExtras"),
      description: totals.extras > 0 ? `+${formatPrice(totals.extras)}` : null,
      icon: "lightbulb",
    },
    {
      key: "passengers",
      label: t("summary.passengers"),
      value: `x${passengersTotal}`,
      icon: "person",
    }
  );

  const summaryItems = [
    ...detailItems,
    ...monetaryBreakdownItems.map((item, index) => ({
      ...item,
      key: `breakdown-${index}`,
      icon: item.icon ?? "payments",
    })),
  ];

  const handlePay = () => {
    setIsLoading(true);
    dispatch({ type: "CLEAR_PAYMENT_ERROR" });

    setTimeout(() => {
      setIsLoading(false);
      dispatch({
        type: "SET_PAYMENT_ERROR",
        payload: "timeout",
      });
    }, 1200);
  };

  return (
    <PaymentTemplate
      title={t("payment.title")}
      stepperProps={{ steps, currentStep: "payment" }}
      paymentError={state.paymentError}
      text={{
        errorTitle: t("payment.errorTitle"),
        errorBody: t("payment.errorBody"),
        nameLabel: t("payment.name"),
        cardNumberLabel: t("payment.cardNumber"),
        expiryLabel: t("payment.expiry"),
        cvvLabel: t("payment.cvv"),
        pay: t("payment.pay"),
        change: t("common.change"),
        loading: t("common.loading"),
        changeBody: t("payment.changeBody"),
        accept: t("payment.accept"),
      }}
      placeholders={{
        name: t("payment.placeholders.name"),
        cardNumber: t("payment.placeholders.cardNumber"),
        expiry: t("payment.placeholders.expiry"),
        cvv: t("payment.placeholders.cvv"),
      }}
      isLoading={isLoading}
      isModalOpen={isModalOpen}
      onPay={handlePay}
      onOpenChange={() => setIsModalOpen(true)}
      onCloseChange={() => setIsModalOpen(false)}
      triggerRef={triggerRef}
      summaryTitle={t("summary.title")}
      summaryItems={summaryItems}
      total={totals.total}
      totalLabel={t("summary.total")}
    />
  );
}
