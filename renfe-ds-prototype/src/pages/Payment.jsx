import { useRef, useState } from "react";
import Container from "../components/Container/Container.jsx";
import Grid from "../components/Grid/Grid.jsx";
import Stack from "../components/Stack/Stack.jsx";
import CheckoutStepper from "../components/navigation/CheckoutStepper/CheckoutStepper.jsx";
import InputText from "../components/InputText/InputText.jsx";
import Button from "../components/Button/Button.jsx";
import PriceBreakdown from "../components/PriceBreakdown/PriceBreakdown.jsx";
import StickySummaryBar from "../components/StickySummaryBar/StickySummaryBar.jsx";
import Alert from "../components/Alert/Alert.jsx";
import Modal from "../components/Modal/Modal.jsx";
import Loading from "../components/Loading/Loading.jsx";
import { useTravel } from "../app/store.jsx";
import { getTotalPrice } from "../app/pricing.js";
import { useI18n } from "../app/i18n.jsx";
import "./pages.css";

export default function Payment() {
  const { state, dispatch } = useTravel();
  const { t } = useI18n();
  const totals = getTotalPrice(state);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef(null);

  const steps = [
    { id: "results", label: t("stepper.results") },
    { id: "fares", label: t("stepper.fares") },
    { id: "extras", label: t("stepper.extras") },
    { id: "payment", label: t("stepper.payment") },
  ];

  const breakdownItems = [
    { label: t("summary.journey"), value: `${totals.base.toFixed(2)} €` },
    { label: t("summary.fare"), value: `${totals.fare.toFixed(2)} €` },
    { label: t("summary.extras"), value: `${totals.extras.toFixed(2)} €` },
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
    <Container as="section" className="page">
      <h1 className="page-title">{t("payment.title")}</h1>
      <CheckoutStepper steps={steps} currentStep="payment" />
      {state.paymentError && (
        <Alert title={t("payment.errorTitle")}>
          {t("payment.errorBody")}
        </Alert>
      )}
      <Grid>
        <div className="col-span-8">
          <div className="card" aria-busy={isLoading ? "true" : undefined}>
            <Stack gap="04">
              <InputText label={t("payment.name")} inputId="card-name" helperId="card-name-helper" helperText="" />
              <InputText label={t("payment.cardNumber")} inputId="card-number" helperId="card-number-helper" helperText="" />
              <Grid>
                <div className="col-span-6">
                  <InputText label={t("payment.expiry")} inputId="card-exp" helperId="card-exp-helper" helperText="" />
                </div>
                <div className="col-span-6">
                  <InputText label={t("payment.cvv")} inputId="card-cvv" helperId="card-cvv-helper" helperText="" />
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
        <div className="col-span-4">
          <PriceBreakdown
            title={t("summary.title")}
            items={breakdownItems}
            total={totals.total}
            totalLabel={t("summary.total")}
          />
        </div>
      </Grid>
      <StickySummaryBar>
        <div className="form-actions">
          <span>{t("summary.total")}: {totals.total.toFixed(2)} €</span>
        </div>
      </StickySummaryBar>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        titleId="change-method-title"
        descriptionId="change-method-desc"
        triggerRef={triggerRef}
      >
        <h2 id="change-method-title" className="section-title">{t("common.change")}</h2>
        <p id="change-method-desc">
          {t("payment.changeBody")}
        </p>
        <div className="form-actions">
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>{t("payment.accept")}</Button>
        </div>
      </Modal>
    </Container>
  );
}
