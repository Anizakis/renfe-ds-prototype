
import { useNavigate } from "react-router-dom";

import Container from "../ui/atoms/Container/Container.jsx";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
import HomeSearch from "../ui/organisms/HomeSearch/HomeSearch.jsx";
import "../templates/HomeTemplate.css";

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
