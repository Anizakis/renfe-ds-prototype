import "./CheckoutStepper.css";
import { useI18n } from "../../../app/i18n.jsx";

export default function CheckoutStepper({ steps, currentStep }) {
  const { t } = useI18n();
  return (
    <ol className="checkout-stepper" aria-label={t("stepper.progress")}>
      {steps.map((step) => {
        const isCurrent = step.id === currentStep;
        return (
          <li
            key={step.id}
            className={`checkout-stepper__item ${isCurrent ? "is-current" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="checkout-stepper__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
