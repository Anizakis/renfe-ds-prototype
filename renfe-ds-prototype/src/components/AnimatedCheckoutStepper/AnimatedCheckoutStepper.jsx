import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../app/i18n.jsx";
import "./AnimatedCheckoutStepper.css";
import { checkoutSteps } from "./checkoutSteps.js";

export default function AnimatedCheckoutStepper({ currentStep }) {
  const steps = checkoutSteps;
  const navigate = useNavigate();
  const { t } = useI18n();
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStep)
  );
  const progress = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;
  const mobileLabel = useMemo(() => {
    const stepLabel = steps[currentIndex]?.label ?? "";
    return `${t("stepper.step")} ${currentIndex + 1} ${t("stepper.of")} ${steps.length} · ${stepLabel}`;
  }, [steps, currentIndex, t]);

  return (
    <div className="animated-stepper" style={{ "--progress": `${progress}%` }}>
      <div className="animated-stepper__mobile" aria-label={mobileLabel}>
        <span className="animated-stepper__mobile-label">{mobileLabel}</span>
        <span className="animated-stepper__mobile-track" aria-hidden="true">
          <span className="animated-stepper__mobile-fill" />
        </span>
      </div>
      <div className="animated-stepper__row" role="navigation" aria-label="Progress">
        {steps.flatMap((step, index) => {
          const isCurrent = step.id === currentStep;
          const isComplete = index < currentIndex;
          const isFuture = index > currentIndex;
          const stepPath = step.path ?? `/${step.id}`;
          const connectorState = index < currentIndex ? " is-complete" : "";
          const stepNode = isComplete ? (
            <button
              key={`${step.id}-step`}
              type="button"
              className={`animated-stepper__step is-complete`}
              onClick={() => navigate(stepPath)}
            >
              <span className="animated-stepper__indicator" aria-hidden="true">
                <span className="animated-stepper__indicator-icon">check</span>
              </span>
              <span className="animated-stepper__label">{step.label}</span>
            </button>
          ) : (
            <span
              key={`${step.id}-step`}
              className={`animated-stepper__step${isCurrent ? " is-current" : ""}${isFuture ? " is-future" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
              aria-disabled={isFuture ? "true" : undefined}
            >
              <span className="animated-stepper__indicator" aria-hidden="true">
                <span className="animated-stepper__indicator-text">{index + 1}</span>
              </span>
              <span className="animated-stepper__label">{step.label}</span>
            </span>
          );
          const connectorNode = index < steps.length - 1
            ? (
              <span
                key={`${step.id}-connector`}
                className={`animated-stepper__connector${connectorState}`}
                aria-hidden="true"
              />
            )
            : [];
          return [stepNode, connectorNode];
        })}
      </div>
    </div>
  );
}
