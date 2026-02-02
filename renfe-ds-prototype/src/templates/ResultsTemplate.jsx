import Container from "../ui/atoms/Container/Container.jsx";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
import Grid from "../ui/atoms/Grid/Grid.jsx";
import Stack from "../ui/atoms/Stack/Stack.jsx";
import VisuallyHidden from "../ui/atoms/VisuallyHidden/VisuallyHidden.jsx";
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
  return (
    <main id="main" className="results-page">
      <Container as="section">
        <PageStack gap="03" align="stretch" textAlign="left">
          <VisuallyHidden as="h1">{title}</VisuallyHidden>
          <div className="results-stepper">
            {stepper}
          </div>

          {summary}

          <Grid className="results-grid">
            <aside className="results-sidebar">
              <div className="results-panel">
                {filtersSidebar}
              </div>
            </aside>
            <section className="results-content">
              <div className="results-panel results-panel--content">
                {header}
                {toolbar}
                {dayPicker}
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
    </main>
  );
}
