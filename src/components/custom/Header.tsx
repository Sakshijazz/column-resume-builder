import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { UserButton, useUser } from "@clerk/clerk-react";
import { ArrowRightIcon } from "lucide-react";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-3 px-5 flex justify-between shadow-md">
      <Link to={"/"}>
        <img
          src="/column-logo.png"
          alt="Column Logo"
          className="cursor-pointer"
          width={32}
          height={32}
        />
      </Link>
      {isSignedIn ? (
        <div className="flex gap-2 items-center">
          <Link to={"/dashboard"}>
            <Button variant="outline">Dashboard</Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to={"/auth/sign-in"}>
          <Button>
            Get Started <ArrowRightIcon />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
