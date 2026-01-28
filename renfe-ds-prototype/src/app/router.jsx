import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Results from "../pages/Results.jsx";
import Fares from "../pages/Fares.jsx";
import Extras from "../pages/Extras.jsx";
import Payment from "../pages/Payment.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "results", element: <Results /> },
      { path: "fares", element: <Fares /> },
      { path: "extras", element: <Extras /> },
      { path: "payment", element: <Payment /> },
    ],
  },
]);
