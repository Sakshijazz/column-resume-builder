import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import SignInPage from "./auth/sign-in/SignIn.tsx";
import Home from "./home/index.tsx";
import Dashboard from "./dashboard/index.tsx";
import App from "./App.tsx";
import EditResume from "./dashboard/resume/[resumeId]/edit/index.tsx";
import ViewResume from "./my-resume/[resumeId]/view/index.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/resume/:resumeId/edit",
        element: <EditResume />,
      },
    ],
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/my-resume/:resumeId/view",
    element: <ViewResume />,
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <RouterProvider router={router} />
  </ClerkProvider>
);
