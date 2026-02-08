import Container from "../atoms/Container/Container.jsx";
import PageStack from "../atoms/PageStack/PageStack.jsx";
import HomeSearch from "../organisms/HomeSearch/HomeSearch.jsx";
import HomeInfoSection from "../organisms/HomeInfoSection/HomeInfoSection.jsx";
import PromoGrid from "../organisms/PromoGrid/PromoGrid.jsx";
import "./HomeTemplate.css";

export default function HomeTemplate({ onSearch }) {
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <div className="search-card">
          <HomeSearch onSubmit={onSearch} />
        </div>
        <HomeInfoSection />
        <PromoGrid />
      </PageStack>
    </Container>
  );
}
