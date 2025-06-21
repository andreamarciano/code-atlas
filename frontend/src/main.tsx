import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";

import { UserProvider } from "./utils/UserContext.tsx";

import Home from "./pages/Home.tsx";
import LanguagePage from "./pages/LanguagePage/LanguagePage.tsx";
import NotFound from "./pages/NotFound.tsx";

import { ProtectedRoute } from "./pages/Profile/ProtectedRoute.tsx";
import Profile from "./pages/Profile/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "language/:name", element: <LanguagePage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/profile", element: <Profile /> }],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
