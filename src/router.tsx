import { createBrowserRouter } from "react-router";

// UIs
import RootLayout from "./ui/layouts/RootLayout";
import AuthLayout from "./ui/layouts/AuthLayout";
import AppLayout from "./ui/layouts/AppLayout";
import EmptyState from "./ui/placeholders/EmptyState";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Board from "./pages/Board";

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
        children: [
          {
            index: true,
            element: <EmptyState type="board" />,
          },
          {
            path: "boards/:boardId/:boardName",
            element: <Board />,
          },
        ],
      },
    ],
  },
]);

export default router;
