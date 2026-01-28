import "./CheckoutStepper.css";

export default function CheckoutStepper({ steps, currentStep }) {
  return (
    <ol className="checkout-stepper" aria-label="Progress">
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
