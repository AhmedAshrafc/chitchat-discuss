"use client";

// We made this component so we can use it in the Header component. To avoid the cookies being modified and turns every other page dynamic.

import Link from "next/link";

// Adding a ton of imports for components coming from that NextUI library.
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

// To see if a user is signed in or not from a Client Component.
import { useSession } from "next-auth/react";

import * as serverActions from "@/server-actions";

export default function HeaderAuth() {
  const session = useSession();

  return (
    <>
      {session.data?.user ? (
        <Popover placement="left">
          <PopoverTrigger>
            <Avatar
              src={session.data.user.image || ""}
              className="cursor-pointer"
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <form action={serverActions.signOut}>
                <Button type="submit" color="primary">
                  Sign Out
                </Button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      ) : session.status === "loading" ? null : (
        <>
          <NavbarItem>
            <form action={serverActions.signIn}>
              <Button type="submit" color="secondary" variant="bordered">
                Sign In
              </Button>
            </form>
          </NavbarItem>
          <NavbarItem>
            <form action={serverActions.signIn}>
              <Button type="submit" color="primary" variant="flat">
                Sign Up
              </Button>
            </form>
          </NavbarItem>
        </>
      )}
    </>
  );
}
