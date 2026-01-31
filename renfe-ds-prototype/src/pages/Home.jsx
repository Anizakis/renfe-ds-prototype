
import { useNavigate } from "react-router-dom";

import Container from "../components/Container/Container.jsx";
import PageStack from "../components/PageStack/PageStack.jsx";
import HomeSearch from "../components/HomeSearch/HomeSearch.jsx";

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container as="section">
      <PageStack gap="10" align="stretch" textAlign="left">
        <div className="search-card">
          <HomeSearch onSubmit={() => navigate("/results")} />
        </div>
      </PageStack>
    </Container>
  );
}
