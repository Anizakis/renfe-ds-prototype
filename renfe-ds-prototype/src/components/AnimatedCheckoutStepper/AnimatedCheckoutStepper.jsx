import "./AnimatedCheckoutStepper.css";

export default function AnimatedCheckoutStepper({ steps, currentStep }) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStep)
  );
  const progress = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="animated-stepper" style={{ "--progress": `${progress}%` }}>
      <div className="animated-stepper__track" aria-hidden="true">
        <span className="animated-stepper__fill" />
      </div>
      <ol className="animated-stepper__list" aria-label="Progress">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isComplete = index < currentIndex;
          return (
            <li
              key={step.id}
              className={`animated-stepper__item${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className="animated-stepper__dot" aria-hidden="true" />
              <span className="animated-stepper__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
