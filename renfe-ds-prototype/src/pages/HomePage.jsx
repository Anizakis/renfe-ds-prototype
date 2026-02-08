import { useNavigate } from "react-router-dom";
import HomeTemplate from "../ui/templates/HomeTemplate.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <HomeTemplate onSearch={() => navigate("/results")} />
  );
}
