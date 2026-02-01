import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.jsx";
import { I18nProvider } from "./app/i18n.jsx";

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}