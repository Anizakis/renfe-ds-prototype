import Container from "../atoms/Container/Container.jsx";
import Grid from "../atoms/Grid/Grid.jsx";
import Stack from "../atoms/Stack/Stack.jsx";
import AnimatedCheckoutStepper from "../organisms/AnimatedCheckoutStepper/AnimatedCheckoutStepper.jsx";
import InputText from "../atoms/InputText/InputText.jsx";
import Button from "../atoms/Button/Button.jsx";
import PriceBreakdown from "../organisms/PriceBreakdown/PriceBreakdown.jsx";
import { Alert } from "../atoms";
import Modal from "../molecules/Modal/Modal.jsx";
import Loading from "../atoms/Loading/Loading.jsx";
import VisuallyHidden from "../atoms/VisuallyHidden/VisuallyHidden.jsx";
import PageStack from "../atoms/PageStack/PageStack.jsx";
import "./PaymentTemplate.css";

export default function PaymentTemplate({
  title,
  stepperProps,
  paymentError,
  text,
  placeholders,
  isLoading,
  isModalOpen,
  onPay,
  onOpenChange,
  onCloseChange,
  triggerRef,
  summaryTitle,
  summaryItems,
  total,
  totalLabel,
}) {
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <AnimatedCheckoutStepper {...stepperProps} />
        <VisuallyHidden as="h1">{title}</VisuallyHidden>
        {paymentError && (
          <Alert title={text.errorTitle}>
            {text.errorBody}
          </Alert>
        )}
        <Grid className="payment-grid">
          <div className="payment-form" aria-busy={isLoading ? "true" : undefined}>
            <div className="card">
              <Stack gap="04">
                <InputText
                  label={text.nameLabel}
                  inputId="card-name"
                  helperId="card-name-helper"
                  helperText=""
                  size="m"
                  placeholder={placeholders.name}
                  inputProps={{
                    name: "cc-name",
                    autoComplete: "cc-name",
                  }}
                />
                <InputText
                  label={text.cardNumberLabel}
                  inputId="card-number"
                  helperId="card-number-helper"
                  helperText=""
                  size="m"
                  placeholder={placeholders.cardNumber}
                  inputProps={{
                    name: "cc-number",
                    autoComplete: "cc-number",
                    inputMode: "numeric",
                  }}
                />
                <Grid>
                  <div className="payment-field--expiry">
                    <InputText
                      label={text.expiryLabel}
                      inputId="card-exp"
                      helperId="card-exp-helper"
                      helperText=""
                      size="m"
                      placeholder={placeholders.expiry}
                      inputProps={{
                        name: "cc-exp",
                        autoComplete: "cc-exp",
                        inputMode: "numeric",
                      }}
                    />
                  </div>
                  <div className="payment-field--cvv">
                    <InputText
                      label={text.cvvLabel}
                      inputId="card-cvv"
                      helperId="card-cvv-helper"
                      helperText=""
                      size="m"
                      placeholder={placeholders.cvv}
                      inputProps={{
                        name: "cc-csc",
                        autoComplete: "cc-csc",
                        inputMode: "numeric",
                      }}
                    />
                  </div>
                </Grid>
                <Stack direction="row" gap="03" className="form-actions">
                  <Button variant="primary" onClick={onPay} disabled={isLoading}>
                    {text.pay}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onOpenChange}
                    ref={triggerRef}
                  >
                    {text.change}
                  </Button>
                  {isLoading && <Loading label={text.loading} />}
                </Stack>
              </Stack>
            </div>
          </div>
          <aside className="payment-summary">
            <PriceBreakdown
              title={summaryTitle}
              items={summaryItems}
              total={total}
              totalLabel={totalLabel}
            />
          </aside>
        </Grid>

        <Modal
          isOpen={isModalOpen}
          onClose={onCloseChange}
          titleId="change-method-title"
          descriptionId="change-method-desc"
          triggerRef={triggerRef}
        >
          <div className="payment-change-modal">
            <h2 id="change-method-title" className="section-title">{text.change}</h2>
            <p id="change-method-desc">
              {text.changeBody}
            </p>
            <div className="form-actions">
              <Button variant="primary" onClick={onCloseChange}>{text.accept}</Button>
            </div>
          </div>
        </Modal>
      </PageStack>
    </Container>
  );
}
