import Container from "../ui/atoms/Container/Container.jsx";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
import Grid from "../ui/atoms/Grid/Grid.jsx";
import Stack from "../ui/atoms/Stack/Stack.jsx";
import VisuallyHidden from "../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
import { useI18n } from "../app/i18n.jsx";
import "./ResultsTemplate.css";

export default function ResultsTemplate({
  title,
  stepper,
  summary,
  filtersSidebar,
  header,
  toolbar,
  dayPicker,
  announcement,
  listContent,
  filtersDrawer,
  summaryBar,
  priceModal,
}) {
  const { t } = useI18n();
  return (
    <section className="results-page">
      <Container as="section">
        <PageStack gap="03" align="stretch" textAlign="left">
          <VisuallyHidden as="h1">{title}</VisuallyHidden>
          <div className="results-stepper">
            {stepper}
          </div>

          {summary}

          <Grid className="results-grid">
            <section className="results-sidebar" aria-labelledby="results-filters-title">
              <VisuallyHidden as="h2" id="results-filters-title">{t("results.filters.title")}</VisuallyHidden>
              <div className="results-panel">
                {filtersSidebar}
              </div>
            </section>
            <section className="results-content">
              <div className="results-panel results-panel--content">
                {header}
                {dayPicker}
                {toolbar}
                <VisuallyHidden as="p" aria-live="polite">
                  {announcement}
                </VisuallyHidden>
                <Stack gap="03">
                  {listContent}
                </Stack>
              </div>
            </section>
          </Grid>

          {filtersDrawer}
          {summaryBar}
          {priceModal}
        </PageStack>
      </Container>
    </section>
  );
}
