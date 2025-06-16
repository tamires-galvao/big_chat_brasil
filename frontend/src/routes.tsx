import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { SignIn } from "./pages/auth/sign-in";
import Conversations from "./pages/app/conversations";
import { Error } from "./pages/error";
import { Chat } from "./pages/app/chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Conversations />,
      },
      {
        path: "conversations",
        element: <Conversations />,
        children: [
          {
            path: ":id",
            element: <Chat />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth", // rotas públicas de autenticação
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
    ],
  },
]);
