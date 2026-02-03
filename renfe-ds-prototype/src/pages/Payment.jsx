import { useRef, useState } from "react";
import Container from "../ui/atoms/Container/Container.jsx";
import Grid from "../ui/atoms/Grid/Grid.jsx";
import Stack from "../ui/atoms/Stack/Stack.jsx";
import AnimatedCheckoutStepper from "../ui/organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import InputText from "../ui/atoms/InputText/InputText.jsx";
import Button from "../ui/atoms/Button/Button.jsx";
import PriceBreakdown from "../ui/organisms/PriceBreakdown/PriceBreakdown.jsx";
import { Alert } from "../ui/atoms";
import Modal from "../ui/molecules/Modal/Modal.jsx";
import Loading from "../ui/atoms/Loading/Loading.jsx";
import VisuallyHidden from "../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
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
import "../templates/PaymentTemplate.css";

export default function Payment() {
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
  const monetaryBreakdownItems = breakdownItems.filter(
    (item) => item.label !== t("summary.passengers")
  );

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
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <AnimatedCheckoutStepper steps={steps} currentStep="payment" />
        <VisuallyHidden as="h1">{t("payment.title")}</VisuallyHidden>
        {state.paymentError && (
          <Alert title={t("payment.errorTitle")}>
            {t("payment.errorBody")}
          </Alert>
        )}
        <Grid className="payment-grid">
          <div className="payment-form" aria-busy={isLoading ? "true" : undefined}>
            <div className="card">
              <Stack gap="04">
                <InputText
                  label={t("payment.name")}
                  inputId="card-name"
                  helperId="card-name-helper"
                  helperText=""
                  size="m"
                  placeholder={t("payment.placeholders.name")}
                  inputProps={{
                    name: "cc-name",
                    autoComplete: "cc-name",
                  }}
                />
                <InputText
                  label={t("payment.cardNumber")}
                  inputId="card-number"
                  helperId="card-number-helper"
                  helperText=""
                  size="m"
                  placeholder={t("payment.placeholders.cardNumber")}
                  inputProps={{
                    name: "cc-number",
                    autoComplete: "cc-number",
                    inputMode: "numeric",
                  }}
                />
                <Grid>
                  <div className="col-span-6">
                    <InputText
                      label={t("payment.expiry")}
                      inputId="card-exp"
                      helperId="card-exp-helper"
                      helperText=""
                      size="m"
                      placeholder={t("payment.placeholders.expiry")}
                      inputProps={{
                        name: "cc-exp",
                        autoComplete: "cc-exp",
                        inputMode: "numeric",
                      }}
                    />
                  </div>
                  <div className="col-span-6">
                    <InputText
                      label={t("payment.cvv")}
                      inputId="card-cvv"
                      helperId="card-cvv-helper"
                      helperText=""
                      size="m"
                      placeholder={t("payment.placeholders.cvv")}
                      inputProps={{
                        name: "cc-csc",
                        autoComplete: "cc-csc",
                        inputMode: "numeric",
                      }}
                    />
                  </div>
                </Grid>
                <Stack direction="row" gap="03" className="form-actions">
                  <Button variant="primary" onClick={handlePay} disabled={isLoading}>
                    {t("payment.pay")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(true)}
                    ref={triggerRef}
                  >
                    {t("common.change")}
                  </Button>
                  {isLoading && <Loading label={t("common.loading")} />}
                </Stack>
              </Stack>
            </div>
          </div>
          <aside className="payment-summary">
            <PriceBreakdown
              title={t("summary.title")}
              items={summaryItems}
              total={totals.total}
              totalLabel={t("summary.total")}
            />
          </aside>
        </Grid>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titleId="change-method-title"
          descriptionId="change-method-desc"
          triggerRef={triggerRef}
        >
          <div className="payment-change-modal">
            <h2 id="change-method-title" className="section-title">{t("common.change")}</h2>
            <p id="change-method-desc">
              {t("payment.changeBody")}
            </p>
            <div className="form-actions">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>{t("payment.accept")}</Button>
            </div>
          </div>
        </Modal>
      </PageStack>
    </Container>
  );
}
