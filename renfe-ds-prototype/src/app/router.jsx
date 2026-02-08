import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ResultsPage from "../pages/ResultsPage.jsx";
import FaresPage from "../pages/FaresPage.jsx";
import TravelersPage from "../pages/TravelersPage.jsx";
import ExtrasPage from "../pages/ExtrasPage.jsx";
import PaymentPage from "../pages/PaymentPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "results", element: <ResultsPage /> },
      { path: "fares", element: <FaresPage /> },
      { path: "travelers", element: <TravelersPage /> },
      { path: "extras", element: <ExtrasPage /> },
      { path: "payment", element: <PaymentPage /> },
    ],
  },
]);
