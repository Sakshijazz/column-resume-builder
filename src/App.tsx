import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Navigate, Outlet } from "react-router";
import { useUser } from "@clerk/clerk-react";
import "./App.css";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"/auth/sign-in"} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
