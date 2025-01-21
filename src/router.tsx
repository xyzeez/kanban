import { createBrowserRouter } from "react-router";

// UIs
import RootLayout from "./ui/RootLayout";
import AuthLayout from "./ui/AuthLayout";
import AppLayout from "./ui/AppLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
      {
        path: "/",
        element: <AppLayout />,
      },
    ],
  },
]);

export default router;
